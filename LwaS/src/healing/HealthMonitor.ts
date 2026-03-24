/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║  QAntum Prime v28.1.0 SUPREME - HEALTH MONITOR                            ║
 * ║  "Преди да полетиш, провери горивото"                                     ║
 * ║                                                                           ║
 * ║  Проверява: .env конфигурация, Pinecone връзка, DeepSeek връзка           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface HealthCheck {
    name: string;
    status: 'healthy' | 'degraded' | 'critical' | 'unknown';
    message: string;
    latency?: number;
    details?: Record<string, unknown>;
}

interface SystemHealth {
    timestamp: string;
    overall: 'healthy' | 'degraded' | 'critical';
    checks: HealthCheck[];
    readyForSync: boolean;
    readyForProduction: boolean;
    recommendations: string[];
}

interface EnvRequirement {
    key: string;
    required: boolean;
    description: string;
    validator?: (value: string) => boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const ENV_REQUIREMENTS: EnvRequirement[] = [
    {
        key: 'DEEPSEEK_API_KEY',
        required: true,
        description: 'DeepSeek V3 API Key for Cloud AI',
        validator: (v) => v.length > 10 && !v.includes('your_'),
    },
    {
        key: 'PINECONE_API_KEY',
        required: true,
        description: 'Pinecone API Key for Vector Database',
        validator: (v) => v.length > 10 && !v.includes('your_'),
    },
    {
        key: 'PINECONE_ENV',
        required: true,
        description: 'Pinecone Environment (e.g., us-east-1)',
        validator: (v) => v.length > 0 && !v.includes('your_'),
    },
    {
        key: 'STRIPE_SECRET_KEY',
        required: false,
        description: 'Stripe Secret Key for Payments',
        validator: (v) => v.startsWith('sk_'),
    },
    {
        key: 'GITHUB_TOKEN',
        required: false,
        description: 'GitHub Token for CI/CD',
        validator: (v) => v.startsWith('ghp_') || v.startsWith('github_pat_'),
    },
];

const EMPIRE_PATHS = {
    core: process.env.EMPIRE_CORE || 'C:\\MisteMind',
    shield: process.env.EMPIRE_SHIELD || 'C:\\MrMindQATool',
    voice: process.env.EMPIRE_VOICE || 'C:\\MisterMindPage',
};

// ═══════════════════════════════════════════════════════════════════════════
// HEALTH MONITOR CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class HealthMonitor {
    private envPath: string;
    private checks: HealthCheck[] = [];

    constructor() {
        this.envPath = path.join(process.cwd(), '.env');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MAIN HEALTH CHECK
    // ═══════════════════════════════════════════════════════════════════════

    async runFullHealthCheck(): Promise<SystemHealth> {
        console.log('╔═══════════════════════════════════════════════════════════════╗');
        console.log('║  🏥 HEALTH MONITOR - System Pre-Flight Check                  ║');
        console.log('╚═══════════════════════════════════════════════════════════════╝\n');

        this.checks = [];

        // 1. Check .env file exists
        await this.checkEnvFile();

        // 2. Check required environment variables
        await this.checkEnvVariables();

        // 3. Check DeepSeek API connection
        await this.checkDeepSeekConnection();

        // 4. Check Pinecone connection
        await this.checkPineconeConnection();

        // 5. Check Empire paths
        await this.checkEmpirePaths();

        // Calculate overall health
        const health = this.calculateOverallHealth();

        // Print report
        this.printReport(health);

        return health;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // INDIVIDUAL CHECKS
    // ═══════════════════════════════════════════════════════════════════════

    private async checkEnvFile(): Promise<void> {
        console.log('📋 Checking .env file...');

        if (fs.existsSync(this.envPath)) {
            const stats = fs.statSync(this.envPath);
            this.checks.push({
                name: '.env File',
                status: 'healthy',
                message: '.env file exists and is readable',
                details: {
                    path: this.envPath,
                    size: stats.size,
                    modified: stats.mtime.toISOString(),
                },
            });
            console.log('   ✅ .env file found');
        } else {
            this.checks.push({
                name: '.env File',
                status: 'degraded',
                message: '.env file not found. Using environment variables.',
            });
            console.log('   ⚠️ .env file NOT found (using env vars)');
        }
    }

    private async checkEnvVariables(): Promise<void> {
        console.log('🔑 Checking environment variables...');

        // Load .env file if exists
        this.loadEnvFile();

        let requiredMissing = 0;
        let optionalMissing = 0;

        for (const req of ENV_REQUIREMENTS) {
            const value = process.env[req.key];

            if (!value || value.trim() === '') {
                if (req.required) {
                    requiredMissing++;
                    console.log(`   ❌ ${req.key}: MISSING (required)`);
                } else {
                    optionalMissing++;
                    console.log(`   ⚠️ ${req.key}: MISSING (optional)`);
                }
            } else if (req.validator && !req.validator(value)) {
                if (req.required) {
                    requiredMissing++;
                    console.log(`   ❌ ${req.key}: INVALID (still has placeholder)`);
                } else {
                    console.log(`   ⚠️ ${req.key}: INVALID (optional)`);
                }
            } else {
                console.log(`   ✅ ${req.key}: SET`);
            }
        }

        if (requiredMissing === 0) {
            this.checks.push({
                name: 'Environment Variables',
                status: optionalMissing > 0 ? 'degraded' : 'healthy',
                message: optionalMissing > 0
                    ? `All required keys set. ${optionalMissing} optional keys missing.`
                    : 'All environment variables configured correctly',
                details: { requiredMissing, optionalMissing },
            });
        } else {
            this.checks.push({
                name: 'Environment Variables',
                status: 'critical',
                message: `${requiredMissing} required environment variable(s) missing`,
                details: { requiredMissing, optionalMissing },
            });
        }
    }

    private async checkDeepSeekConnection(): Promise<void> {
        console.log('🧠 Checking DeepSeek API connection...');

        const apiKey = process.env.DEEPSEEK_API_KEY;

        if (!apiKey || apiKey.includes('your_')) {
            this.checks.push({
                name: 'DeepSeek API',
                status: 'degraded',
                message: 'DeepSeek API key not configured (offline mode)',
            });
            console.log('   ⚠️ API key not set (offline mode)');
            return;
        }

        try {
            const startTime = Date.now();
            const result = await this.testDeepSeekAPI(apiKey);
            const latency = Date.now() - startTime;

            if (result.success) {
                this.checks.push({
                    name: 'DeepSeek API',
                    status: 'healthy',
                    message: 'DeepSeek API connection successful',
                    latency,
                    details: { model: 'deepseek-chat' },
                });
                console.log(`   ✅ Connected (${latency}ms)`);
            } else {
                this.checks.push({
                    name: 'DeepSeek API',
                    status: 'degraded',
                    message: `DeepSeek API error: ${result.error}`,
                    latency,
                });
                console.log(`   ⚠️ Error: ${result.error}`);
            }
        } catch (error: any) {
            this.checks.push({
                name: 'DeepSeek API',
                status: 'degraded',
                message: `DeepSeek connection failed: ${error.message}`,
            });
            console.log(`   ⚠️ Connection failed: ${error.message}`);
        }
    }

    private async checkPineconeConnection(): Promise<void> {
        console.log('📌 Checking Pinecone connection...');

        const apiKey = process.env.PINECONE_API_KEY;

        if (!apiKey || apiKey.includes('your_')) {
            this.checks.push({
                name: 'Pinecone API',
                status: 'degraded',
                message: 'Pinecone API key not configured (offline mode)',
            });
            console.log('   ⚠️ API key not set (offline mode)');
            return;
        }

        try {
            const startTime = Date.now();
            const result = await this.testPineconeAPI(apiKey);
            const latency = Date.now() - startTime;

            if (result.success) {
                this.checks.push({
                    name: 'Pinecone API',
                    status: 'healthy',
                    message: 'Pinecone API connection successful',
                    latency,
                    details: { indexes: result.indexes || [] },
                });
                console.log(`   ✅ Connected (${latency}ms)`);
            } else {
                this.checks.push({
                    name: 'Pinecone API',
                    status: 'degraded',
                    message: `Pinecone API error: ${result.error}`,
                    latency,
                });
                console.log(`   ⚠️ Error: ${result.error}`);
            }
        } catch (error: any) {
            this.checks.push({
                name: 'Pinecone API',
                status: 'degraded',
                message: `Pinecone connection failed: ${error.message}`,
            });
            console.log(`   ⚠️ Connection failed: ${error.message}`);
        }
    }

    private async checkEmpirePaths(): Promise<void> {
        console.log('🏛️ Checking Empire paths...');

        let allExist = true;
        const details: Record<string, boolean> = {};

        for (const [name, empPath] of Object.entries(EMPIRE_PATHS)) {
            const exists = fs.existsSync(empPath);
            details[name] = exists;

            if (exists) {
                console.log(`   ✅ ${name}: ${empPath}`);
            } else {
                console.log(`   ⚠️ ${name}: ${empPath} (NOT FOUND)`);
                allExist = false;
            }
        }

        this.checks.push({
            name: 'Empire Paths',
            status: allExist ? 'healthy' : 'degraded',
            message: allExist
                ? 'All empire paths accessible'
                : 'Some empire paths not found (optional)',
            details,
        });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // API TEST HELPERS
    // ═══════════════════════════════════════════════════════════════════════

    private testDeepSeekAPI(apiKey: string): Promise<{ success: boolean; error?: string }> {
        return new Promise((resolve) => {
            const data = JSON.stringify({
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: 'ping' }],
                max_tokens: 5,
            });

            const options = {
                hostname: 'api.deepseek.com',
                port: 443,
                path: '/v1/chat/completions',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Length': data.length,
                },
                timeout: 10000,
            };

            const req = https.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        resolve({ success: true });
                    } else if (res.statusCode === 401) {
                        resolve({ success: false, error: 'Invalid API key' });
                    } else {
                        resolve({ success: false, error: `HTTP ${res.statusCode}` });
                    }
                });
            });

            req.on('error', (e) => resolve({ success: false, error: e.message }));
            req.on('timeout', () => {
                req.destroy();
                resolve({ success: false, error: 'Request timeout' });
            });

            req.write(data);
            req.end();
        });
    }

    private testPineconeAPI(apiKey: string): Promise<{ success: boolean; error?: string; indexes?: string[] }> {
        return new Promise((resolve) => {
            const options = {
                hostname: 'api.pinecone.io',
                port: 443,
                path: '/indexes',
                method: 'GET',
                headers: {
                    'Api-Key': apiKey,
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            };

            const req = https.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        try {
                            const data = JSON.parse(body);
                            resolve({ success: true, indexes: data.indexes?.map((i: any) => i.name) || [] });
                        } catch {
                            resolve({ success: true });
                        }
                    } else if (res.statusCode === 401) {
                        resolve({ success: false, error: 'Invalid API key' });
                    } else {
                        resolve({ success: false, error: `HTTP ${res.statusCode}` });
                    }
                });
            });

            req.on('error', (e) => resolve({ success: false, error: e.message }));
            req.on('timeout', () => {
                req.destroy();
                resolve({ success: false, error: 'Request timeout' });
            });

            req.end();
        });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════════════════════════

    private loadEnvFile(): void {
        if (!fs.existsSync(this.envPath)) return;

        const content = fs.readFileSync(this.envPath, 'utf-8');
        const lines = content.split('\n');

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;

            const eqIndex = trimmed.indexOf('=');
            if (eqIndex > 0) {
                const key = trimmed.substring(0, eqIndex).trim();
                const value = trimmed.substring(eqIndex + 1).trim();
                if (!process.env[key]) {
                    process.env[key] = value;
                }
            }
        }
    }

    private calculateOverallHealth(): SystemHealth {
        const critical = this.checks.filter(c => c.status === 'critical').length;
        const degraded = this.checks.filter(c => c.status === 'degraded').length;

        let overall: 'healthy' | 'degraded' | 'critical' = 'healthy';
        if (critical > 0) overall = 'critical';
        else if (degraded > 0) overall = 'degraded';

        const envOk = this.checks.find(c => c.name === '.env File')?.status !== 'critical';
        const deepSeekOk = this.checks.find(c => c.name === 'DeepSeek API')?.status === 'healthy';
        const pineconeOk = this.checks.find(c => c.name === 'Pinecone API')?.status === 'healthy';

        const readyForSync = envOk;
        const readyForProduction = envOk && deepSeekOk && pineconeOk;

        const recommendations: string[] = [];
        if (!envOk) {
            recommendations.push('Create .env file with API keys');
        }
        if (!deepSeekOk) {
            recommendations.push('Get DeepSeek API key from https://platform.deepseek.com/');
        }
        if (!pineconeOk) {
            recommendations.push('Get Pinecone API key from https://www.pinecone.io/');
        }

        return {
            timestamp: new Date().toISOString(),
            overall,
            checks: this.checks,
            readyForSync,
            readyForProduction,
            recommendations,
        };
    }

    private printReport(health: SystemHealth): void {
        console.log('\n════════════════════════════════════════════════════════════════');
        console.log('📊 HEALTH REPORT:');
        console.log(`   Overall Status: ${health.overall.toUpperCase()}`);
        console.log(`   Ready for Sync: ${health.readyForSync ? '✅' : '❌'}`);
        console.log(`   Ready for Production: ${health.readyForProduction ? '✅' : '❌'}`);

        if (health.recommendations.length > 0) {
            console.log('\n📋 RECOMMENDATIONS:');
            for (const rec of health.recommendations) {
                console.log(`   • ${rec}`);
            }
        }
        console.log('════════════════════════════════════════════════════════════════\n');
    }
}

export const healthMonitor = new HealthMonitor();
