/**
 * 🔥 QANTUM OFFENSIVE TOOLKIT v34.1
 * =================================
 * Хакерски инструменти за Command Center
 */

const http = require('http');
const https = require('https');
const dns = require('dns');
const net = require('net');
const { URL } = require('url');

class QAntumOffensiveToolkit {
    constructor() {
        this.userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Googlebot/2.1 (+http://www.google.com/bot.html)'
        ];
    }

    // ═══════════════════════════════════════════════════════════════════
    // 🔍 PORT SCANNER
    // ═══════════════════════════════════════════════════════════════════
    async scanPort(host, port, timeout = 1000) {
        return new Promise((resolve) => {
            const socket = new net.Socket();
            let status = 'closed';
            socket.setTimeout(timeout);
            socket.on('connect', () => { status = 'open'; socket.destroy(); });
            socket.on('timeout', () => socket.destroy());
            socket.on('error', () => socket.destroy());
            socket.on('close', () => resolve({ port, status }));
            socket.connect(port, host);
        });
    }

    async scanHost(host, ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 3306, 3389, 5432, 8080, 8443]) {
        console.log(`🔍 Scanning ${host}...`);
        const results = [];
        const services = {
            21: 'FTP', 22: 'SSH', 23: 'Telnet', 25: 'SMTP', 53: 'DNS',
            80: 'HTTP', 110: 'POP3', 143: 'IMAP', 443: 'HTTPS', 445: 'SMB',
            3306: 'MySQL', 3389: 'RDP', 5432: 'PostgreSQL', 8080: 'HTTP-Proxy', 8443: 'HTTPS-Alt'
        };
        
        for (const port of ports) {
            const r = await this.scanPort(host, port);
            if (r.status === 'open') {
                const service = services[port] || 'Unknown';
                console.log(`  ✅ Port ${port} (${service}) - OPEN`);
                results.push({ port, service, status: 'OPEN' });
            }
        }
        
        console.log(`\n📊 Found ${results.length} open ports`);
        return results;
    }

    async scanSubnet(subnet, port = 80) {
        console.log(`🌐 Scanning ${subnet}.0/24 on port ${port}...`);
        const alive = [];
        const promises = [];
        
        for (let i = 1; i <= 254; i++) {
            const ip = `${subnet}.${i}`;
            promises.push(
                this.scanPort(ip, port, 300).then(r => {
                    if (r.status === 'open') {
                        alive.push(ip);
                        console.log(`  🖥️  ${ip} - ALIVE`);
                    }
                })
            );
        }
        
        await Promise.all(promises);
        console.log(`\n📊 Found ${alive.length} hosts alive`);
        return alive;
    }

    // ═══════════════════════════════════════════════════════════════════
    // 🕷️ WEB SCRAPER
    // ═══════════════════════════════════════════════════════════════════
    async fetchPage(url, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const parsedUrl = new URL(url);
            const client = parsedUrl.protocol === 'https:' ? https : http;
            
            const req = client.get(url, {
                headers: {
                    'User-Agent': this.userAgents[Math.floor(Math.random() * this.userAgents.length)],
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5'
                },
                timeout
            }, (res) => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    return this.fetchPage(res.headers.location).then(resolve).catch(reject);
                }
                
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
            });
            
            req.on('error', reject);
            req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
        });
    }

    extractEmails(html) {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const emails = html.match(emailRegex) || [];
        return [...new Set(emails)].filter(e => !e.includes('example.com') && !e.includes('domain.com'));
    }

    extractPhones(html) {
        const bgPhone = /(?:\+?359|0)[\s.-]?(?:87|88|89|98|99|2|32|42|52|56|62|72|82|92)[\s.-]?\d{3}[\s.-]?\d{2,4}[\s.-]?\d{0,2}/g;
        const intPhone = /\+?[1-9]\d{0,2}[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g;
        const phones = [...(html.match(bgPhone) || []), ...(html.match(intPhone) || [])];
        return [...new Set(phones)];
    }

    extractLinks(html, baseUrl) {
        const linkRegex = /href=["']([^"']+)["']/gi;
        const links = [];
        let match;
        while ((match = linkRegex.exec(html)) !== null) {
            try {
                const link = new URL(match[1], baseUrl).href;
                if (!link.includes('javascript:') && !link.includes('mailto:')) {
                    links.push(link);
                }
            } catch {}
        }
        return [...new Set(links)];
    }

    // ═══════════════════════════════════════════════════════════════════
    // 🎯 LEAD HUNTER
    // ═══════════════════════════════════════════════════════════════════
    async huntLeads(domain) {
        console.log(`🎯 Hunting leads for: ${domain}`);
        const results = { domain, emails: [], phones: [], social: [], scannedPages: [] };
        const baseUrl = `https://${domain}`;
        
        try {
            let mainPage;
            try {
                mainPage = await this.fetchPage(`https://${domain}`);
            } catch {
                mainPage = await this.fetchPage(`http://${domain}`);
            }
            
            if (mainPage && mainPage.status === 200) {
                results.emails = this.extractEmails(mainPage.body);
                results.phones = this.extractPhones(mainPage.body);
                results.scannedPages.push('/');
                
                const links = this.extractLinks(mainPage.body, baseUrl);
                const socialPatterns = ['facebook.com', 'linkedin.com', 'twitter.com', 'instagram.com', 'youtube.com'];
                results.social = links.filter(l => socialPatterns.some(p => l.includes(p)));
            }
            
            const commonPages = ['/contact', '/about', '/team', '/kontakti', '/za-nas', '/contacts', '/about-us'];
            
            for (const page of commonPages) {
                try {
                    const res = await this.fetchPage(`https://${domain}${page}`);
                    if (res.status === 200) {
                        results.emails.push(...this.extractEmails(res.body));
                        results.phones.push(...this.extractPhones(res.body));
                        results.scannedPages.push(page);
                        console.log(`  📄 Scanned: ${page}`);
                    }
                } catch {}
                await this.sleep(200);
            }
            
            results.emails = [...new Set(results.emails)];
            results.phones = [...new Set(results.phones)];
            
            console.log(`\n📊 Results for ${domain}:`);
            console.log(`  📧 Emails: ${results.emails.length}`);
            console.log(`  📞 Phones: ${results.phones.length}`);
            console.log(`  🔗 Social: ${results.social.length}`);
            
        } catch (e) {
            console.log(`  ❌ Error: ${e.message}`);
            results.error = e.message;
        }
        
        return results;
    }

    async bulkHunt(domains) {
        console.log(`🎯 Bulk hunting ${domains.length} domains...\n`);
        const allResults = [];
        
        for (let i = 0; i < domains.length; i++) {
            console.log(`[${i + 1}/${domains.length}]`);
            const result = await this.huntLeads(domains[i]);
            allResults.push(result);
            console.log('');
            await this.sleep(1000);
        }
        
        const totalEmails = allResults.reduce((sum, r) => sum + r.emails.length, 0);
        const totalPhones = allResults.reduce((sum, r) => sum + r.phones.length, 0);
        
        console.log('═══════════════════════════════════════════════════════');
        console.log(`📊 BULK HUNT COMPLETE`);
        console.log(`  Domains: ${domains.length}`);
        console.log(`  Total Emails: ${totalEmails}`);
        console.log(`  Total Phones: ${totalPhones}`);
        console.log('═══════════════════════════════════════════════════════');
        
        return allResults;
    }

    // ═══════════════════════════════════════════════════════════════════
    // 🌐 DNS RECON
    // ═══════════════════════════════════════════════════════════════════
    async dnsRecon(domain) {
        console.log(`🌐 DNS Reconnaissance: ${domain}`);
        const results = {};
        
        const recordTypes = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA'];
        
        for (const type of recordTypes) {
            try {
                const records = await new Promise((resolve, reject) => {
                    dns.resolve(domain, type, (err, addresses) => {
                        if (err) reject(err);
                        else resolve(addresses);
                    });
                });
                results[type] = records;
                console.log(`  ${type}: ${JSON.stringify(records).substring(0, 80)}...`);
            } catch {}
        }
        
        if (results.A && results.A[0]) {
            try {
                const hostnames = await new Promise((resolve, reject) => {
                    dns.reverse(results.A[0], (err, hostnames) => {
                        if (err) reject(err);
                        else resolve(hostnames);
                    });
                });
                results.PTR = hostnames;
                console.log(`  PTR: ${hostnames.join(', ')}`);
            } catch {}
        }
        
        return results;
    }

    // ═══════════════════════════════════════════════════════════════════
    // 🔓 SECURITY SCANNER
    // ═══════════════════════════════════════════════════════════════════
    async securityScan(url) {
        console.log(`🔓 Security scan: ${url}`);
        const issues = [];
        
        try {
            const res = await this.fetchPage(url);
            const headers = res.headers;
            
            const securityHeaders = {
                'x-frame-options': { severity: 'MEDIUM', desc: 'Clickjacking protection' },
                'x-content-type-options': { severity: 'LOW', desc: 'MIME sniffing protection' },
                'x-xss-protection': { severity: 'LOW', desc: 'XSS filter' },
                'strict-transport-security': { severity: 'HIGH', desc: 'HTTPS enforcement' },
                'content-security-policy': { severity: 'MEDIUM', desc: 'Content security policy' }
            };
            
            for (const [header, info] of Object.entries(securityHeaders)) {
                if (!headers[header]) {
                    issues.push({ type: 'MISSING_HEADER', header, severity: info.severity, description: `Missing ${info.desc}` });
                    console.log(`  ⚠️  Missing: ${header} (${info.severity})`);
                } else {
                    console.log(`  ✅ Present: ${header}`);
                }
            }
            
            if (headers['server']) {
                issues.push({ type: 'SERVER_DISCLOSURE', value: headers['server'], severity: 'LOW' });
                console.log(`  ℹ️  Server disclosed: ${headers['server']}`);
            }
            
            if (url.startsWith('http://')) {
                issues.push({ type: 'NO_HTTPS', severity: 'HIGH', description: 'Site not using HTTPS' });
            }
            
            console.log(`\n📊 Found ${issues.length} potential issues`);
            
        } catch (e) {
            console.log(`  ❌ Error: ${e.message}`);
        }
        
        return issues;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// CLI
const toolkit = new QAntumOffensiveToolkit();
module.exports = { QAntumOffensiveToolkit, toolkit };

if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];
    const target = args[1];
    
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║  🔥 QANTUM OFFENSIVE TOOLKIT v34.1                           ║');
    console.log('║  "Информацията е сила. Силата е контрол."                    ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
    
    (async () => {
        switch (command) {
            case 'scan':
                if (!target) { console.log('Usage: scan <host>'); break; }
                await toolkit.scanHost(target);
                break;
            case 'subnet':
                if (!target) { console.log('Usage: subnet <x.x.x>'); break; }
                await toolkit.scanSubnet(target);
                break;
            case 'hunt':
                if (!target) { console.log('Usage: hunt <domain>'); break; }
                const leads = await toolkit.huntLeads(target);
                console.log('\n📋 FULL RESULTS:');
                console.log(JSON.stringify(leads, null, 2));
                break;
            case 'bulkhunt':
                const domains = target ? target.split(',') : [];
                if (domains.length === 0) { console.log('Usage: bulkhunt <d1,d2,d3>'); break; }
                await toolkit.bulkHunt(domains);
                break;
            case 'dns':
                if (!target) { console.log('Usage: dns <domain>'); break; }
                await toolkit.dnsRecon(target);
                break;
            case 'security':
                if (!target) { console.log('Usage: security <url>'); break; }
                await toolkit.securityScan(target);
                break;
            default:
                console.log('🛠️  COMMANDS:');
                console.log('');
                console.log('  scan <host>              Port scan a host');
                console.log('  subnet <x.x.x>           Scan entire subnet');
                console.log('  hunt <domain>            Extract emails, phones');
                console.log('  bulkhunt <d1,d2,d3>      Hunt multiple domains');
                console.log('  dns <domain>             DNS reconnaissance');
                console.log('  security <url>           Security headers scan');
                console.log('');
                console.log('📌 EXAMPLES:');
                console.log('  node offensive-toolkit.js scan 192.168.0.1');
                console.log('  node offensive-toolkit.js hunt example.bg');
                console.log('  node offensive-toolkit.js subnet 192.168.0');
        }
    })();
}
