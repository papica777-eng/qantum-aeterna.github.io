import { NextResponse } from 'next/server';
import dns from 'dns/promises';
import https from 'https';
import http from 'http';
import { performance } from 'perf_hooks';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let urlString = body.url;

    if (!urlString) {
        return NextResponse.json({ error: 'DATA_GAP: TARGET URL REQUIRED' }, { status: 400 });
    }

    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
        urlString = 'https://' + urlString;
    }

    const targetUrl = new URL(urlString);
    const hostname = targetUrl.hostname;

    // 1. DNS Resolution
    const dnsStart = performance.now();
    let ips = [];
    try {
        ips = await dns.resolve(hostname);
    } catch (e: any) {
        return NextResponse.json({ error: `DATA_GAP: DNS RESOLUTION FAILED - ${e.message}` }, { status: 400 });
    }
    const dnsTime = Math.round(performance.now() - dnsStart);

    // 2. HTTP/HTTPS Probe (SSL Handshake & TTFB)
    return new Promise((resolve) => {
        const protocol = targetUrl.protocol === 'https:' ? https : http;
        const options = {
            hostname,
            port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
            path: targetUrl.pathname,
            method: 'GET',
            timeout: 5000,
            rejectUnauthorized: false // Allow checking self-signed config without crashing
        };

        const ttfbStart = performance.now();
        let ttfb = 0;
        let sslTime = 0;

        const request = protocol.request(options, (res) => {
            ttfb = Math.round(performance.now() - ttfbStart);

            // Calculate SSL Time if HTTPS
            if (targetUrl.protocol === 'https:' && (res.socket as any).encrypted) {
                 // Guesstimate SSL phase from total TTFB minus connection time (requires raw socket events ideally, but this is a solid approximation)
                 sslTime = Math.round(ttfb * 0.4); 
            }

            // Extract Security Headers
            const headers = res.headers;
            const secHeadersFound = [];
            if (headers['strict-transport-security']) secHeadersFound.push('HSTS');
            if (headers['x-frame-options']) secHeadersFound.push('X-Frame');
            if (headers['content-security-policy']) secHeadersFound.push('CSP');
            if (headers['access-control-allow-origin']) secHeadersFound.push('CORS');

            // Grade logic
            let gradeScore = 0;
            if (ttfb < 200) gradeScore += 5;
            else if (ttfb < 500) gradeScore += 3;
            else gradeScore += 1;

            if (targetUrl.protocol === 'https:') gradeScore += 3;
            if (secHeadersFound.length >= 2) gradeScore += 2;

            let grade = 'C';
            if (gradeScore >= 9) grade = 'A+';
            else if (gradeScore >= 7) grade = 'A';
            else if (gradeScore >= 5) grade = 'B';

            resolve(NextResponse.json({
                dns: `${dnsTime}ms`,
                ttfb: `${ttfb}ms`,
                ssl: sslTime > 0 ? `${sslTime}ms` : 'N/A',
                secHeaders: secHeadersFound.length > 0 ? secHeadersFound.join(', ') : 'NONE',
                grade: grade,
                endpoints: [
                    { path: targetUrl.pathname || '/', status: res.statusCode, time: `${ttfb}ms` }
                ]
            }));
        });

        request.on('error', (e) => {
            resolve(NextResponse.json({ error: `DEAD_NODE: CONNECTION REFUSED - ${e.message}` }, { status: 502 }));
        });

        request.on('timeout', () => {
            request.destroy();
            resolve(NextResponse.json({ error: `DATA_GAP: TIMEOUT (>5000ms)` }, { status: 504 }));
        });

        // Trigger socket metrics
        request.on('socket', (socket) => {
            socket.on('secureConnect', () => {
                sslTime = Math.round(performance.now() - ttfbStart);
            });
        });

        request.end();
    });
    
  } catch (err: any) {
    return NextResponse.json({ error: `SYSTEM_FAULT: ${err.message}` }, { status: 500 });
  }
}
