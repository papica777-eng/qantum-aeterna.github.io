import { HybridGodModeWrapper } from "./HybridGodModeWrapper";

/**
 * @wrapper Hybrid_chronos_scanner
 * @description Auto-generated God-Mode Hybrid.
 * @origin "chronos-scanner.js"
 */
export class Hybrid_chronos_scanner extends HybridGodModeWrapper {
    async execute(): Promise<void> {
        try {
            console.log("/// [HYBRID_CORE] Executing Logics from Hybrid_chronos_scanner ///");
            
            // --- START LEGACY INJECTION ---
            /**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHRONOS-PARADOX SCANNER
 * Real Site Analysis for dpengeneering.site
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');

const TARGET = 'https://dpengeneering.site';
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'scans');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function httpCheck(url) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        https.get(url, { timeout: 10000 }, (res) => {
            const responseTime = Date.now() - startTime;
            resolve({
                status: res.statusCode,
                headers: res.headers,
                responseTime,
                reachable: true
            });
        }).on('error', (err) => {
            resolve({
                status: 0,
                error: err.message,
                responseTime: Date.now() - startTime,
                reachable: false
            });
        });
    });
}

async function scanWithPlaywright() {
    console.log(`
╔═══════════════════════════════════════════════════════════════════════╗
║   ⚛️ CHRONOS-PARADOX SCANNER                                          ║
║   Target: ${TARGET}                                    ║
║   Mode: STEALTH + REAL ANALYSIS                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
`);

    const results = {
        target: TARGET,
        scanStarted: new Date().toISOString(),
        httpCheck: null,
        browserAnalysis: null,
        technologies: [],
        security: [],
        performance: null,
        screenshots: [],
        errors: []
    };

    // Step 1: HTTP Check
    console.log('\n🔍 [1/4] HTTP Connectivity Check...');
    results.httpCheck = await httpCheck(TARGET);
    
    if (results.httpCheck.reachable) {
        console.log(`   ✅ Site is ONLINE (Status: ${results.httpCheck.status}, ${results.httpCheck.responseTime}ms)`);
        console.log(`   📡 Server: ${results.httpCheck.headers?.server || 'Unknown'}`);
    } else {
        console.log(`   ❌ Site UNREACHABLE: ${results.httpCheck.error}`);
        results.scanCompleted = new Date().toISOString();
        fs.writeFileSync(
            path.join(OUTPUT_DIR, `scan-${Date.now()}.json`),
            JSON.stringify(results, null, 2)
        );
        return results;
    }

    // Step 2: Browser Analysis
    console.log('\n🌐 [2/4] Browser Analysis (Playwright Stealth)...');
    
    let browser;
    try {
        browser = await chromium.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-blink-features=AutomationControlled'
            ]
        });

        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport: { width: 1920, height: 1080 },
            locale: 'en-US'
        });

        const page = await context.newPage();
        
        // Capture console messages
        const consoleLogs = [];
        page.on('console', msg => consoleLogs.push({ type: msg.type(), text: msg.text() }));
        
        // Capture network requests
        const networkRequests = [];
        page.on('request', req => {
            networkRequests.push({
                url: req.url(),
                method: req.method(),
                resourceType: req.resourceType()
            });
        });

        // Navigate with timeout
        const startNav = Date.now();
        try {
            await page.goto(TARGET, { 
                waitUntil: 'networkidle',
                timeout: 30000 
            });
            results.performance = {
                loadTime: Date.now() - startNav,
                networkRequests: networkRequests.length
            };
            console.log(`   ✅ Page loaded in ${results.performance.loadTime}ms`);
        } catch (navError) {
            console.log(`   ⚠️ Navigation timeout, attempting partial analysis...`);
            results.errors.push({ stage: 'navigation', error: navError.message });
        }

        // Get page title and meta
        try {
            results.browserAnalysis = {
                title: await page.title(),
                url: page.url(),
                meta: await page.evaluate(() => {
                    const metas = {};
                    document.querySelectorAll('meta').forEach(m => {
                        const name = m.getAttribute('name') || m.getAttribute('property');
                        if (name) metas[name] = m.getAttribute('content');
                    });
                    return metas;
                })
            };
            console.log(`   📄 Title: ${results.browserAnalysis.title}`);
        } catch (e) {
            results.errors.push({ stage: 'meta', error: e.message });
        }

        // Detect technologies
        console.log('\n🔬 [3/4] Technology Detection...');
        try {
            results.technologies = await page.evaluate(() => {
                const tech = [];
                
                // Check for common frameworks
                if (window.React || document.querySelector('[data-reactroot]')) tech.push('React');
                if (window.Vue || document.querySelector('[data-v-]')) tech.push('Vue.js');
                if (window.angular || document.querySelector('[ng-app]')) tech.push('Angular');
                if (window.jQuery || window.$) tech.push('jQuery');
                if (document.querySelector('[class*="wp-"]')) tech.push('WordPress');
                if (document.querySelector('[class*="shopify"]')) tech.push('Shopify');
                if (window.gtag || window.ga) tech.push('Google Analytics');
                if (document.querySelector('[class*="bootstrap"]')) tech.push('Bootstrap');
                if (document.querySelector('[class*="tailwind"]')) tech.push('Tailwind CSS');
                
                // Check meta generators
                const generator = document.querySelector('meta[name="generator"]');
                if (generator) tech.push(`Generator: ${generator.content}`);
                
                // Check for common CDNs
                const scripts = Array.from(document.querySelectorAll('script[src]'));
                scripts.forEach(s => {
                    const src = s.src.toLowerCase();
                    if (src.includes('cloudflare')) tech.push('Cloudflare');
                    if (src.includes('googletagmanager')) tech.push('Google Tag Manager');
                    if (src.includes('facebook')) tech.push('Facebook Pixel');
                });
                
                return [...new Set(tech)];
            });
            console.log(`   📦 Technologies: ${results.technologies.join(', ') || 'None detected'}`);
        } catch (e) {
            results.errors.push({ stage: 'tech-detection', error: e.message });
        }

        // Security analysis
        console.log('\n🛡️ [4/4] Security Analysis...');
        results.security = [];
        
        // Check HTTPS
        if (page.url().startsWith('https://')) {
            results.security.push({ check: 'HTTPS', status: 'PASS' });
        } else {
            results.security.push({ check: 'HTTPS', status: 'FAIL' });
        }
        
        // Check headers
        if (results.httpCheck.headers) {
            const headers = results.httpCheck.headers;
            results.security.push({ 
                check: 'X-Frame-Options', 
                status: headers['x-frame-options'] ? 'PASS' : 'MISSING',
                value: headers['x-frame-options']
            });
            results.security.push({ 
                check: 'Content-Security-Policy', 
                status: headers['content-security-policy'] ? 'PASS' : 'MISSING' 
            });
            results.security.push({ 
                check: 'Strict-Transport-Security', 
                status: headers['strict-transport-security'] ? 'PASS' : 'MISSING' 
            });
        }
        
        results.security.forEach(s => {
            const icon = s.status === 'PASS' ? '✅' : s.status === 'MISSING' ? '⚠️' : '❌';
            console.log(`   ${icon} ${s.check}: ${s.status}`);
        });

        // Take screenshot
        const screenshotPath = path.join(OUTPUT_DIR, `screenshot-${Date.now()}.png`);
        try {
            await page.screenshot({ path: screenshotPath, fullPage: true });
            results.screenshots.push(screenshotPath);
            console.log(`\n📸 Screenshot saved: ${screenshotPath}`);
        } catch (e) {
            results.errors.push({ stage: 'screenshot', error: e.message });
        }

        // Store network analysis
        results.networkAnalysis = {
            totalRequests: networkRequests.length,
            byType: networkRequests.reduce((acc, r) => {
                acc[r.resourceType] = (acc[r.resourceType] || 0) + 1;
                return acc;
            }, {}),
            consoleLogs: consoleLogs.slice(0, 20) // First 20 logs
        };

        await browser.close();
        
    } catch (browserError) {
        console.log(`   ❌ Browser error: ${browserError.message}`);
        results.errors.push({ stage: 'browser', error: browserError.message });
        if (browser) await browser.close();
    }

    // Save results
    results.scanCompleted = new Date().toISOString();
    const scanDuration = new Date(results.scanCompleted) - new Date(results.scanStarted);
    
    const reportPath = path.join(OUTPUT_DIR, `scan-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

    console.log(`
╔═══════════════════════════════════════════════════════════════════════╗
║   ✅ SCAN COMPLETE                                                     ║
╠═══════════════════════════════════════════════════════════════════════╣
║   Duration: ${(scanDuration / 1000).toFixed(1)}s                                                       ║
║   Report: ${reportPath.replace('C:\\MisteMind\\', '')}      ║
║   Errors: ${results.errors.length}                                                              ║
╚═══════════════════════════════════════════════════════════════════════╝
`);

    return results;
}

// Run scanner
scanWithPlaywright().catch(console.error);

            // --- END LEGACY INJECTION ---

            await this.recordAxiom({ 
                status: 'SUCCESS', 
                origin: 'Hybrid_chronos_scanner',
                timestamp: Date.now()
            });
        } catch (error) {
            console.error("/// [HYBRID_FAULT] Critical Error in Hybrid_chronos_scanner ///", error);
            await this.recordAxiom({ 
                status: 'CRITICAL_FAILURE', 
                error: String(error),
                origin: 'Hybrid_chronos_scanner'
            });
            throw error;
        }
    }
}
