"use strict";
/**
 * 🏰 THE FORTRESS - License Validator
 *
 * Hardware-bound licensing system that validates licenses
 * against a central API server.
 *
 * Features:
 * - Machine fingerprint generation
 * - Online license validation
 * - Offline grace period
 * - License tier enforcement
 * - Anti-tamper protection
 *
 * @version 1.0.0
 * @phase 73-74
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntiTamper = exports.LicenseValidator = void 0;
exports.validateLicense = validateLicense;
exports.activateLicense = activateLicense;
const crypto = __importStar(require("crypto"));
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const https = __importStar(require("https"));
// ============================================================
// LICENSE VALIDATOR
// ============================================================
class LicenseValidator {
    static instance;
    licenseServerUrl;
    cacheFile;
    cache = null;
    machineId;
    publicKey;
    // Offline grace period (7 days)
    OFFLINE_GRACE_PERIOD = 7 * 24 * 60 * 60 * 1000;
    // Validation interval (24 hours)
    VALIDATION_INTERVAL = 24 * 60 * 60 * 1000;
    constructor() {
        this.licenseServerUrl = process.env.qantum_LICENSE_SERVER ||
            'https://license.QAntum.ai/api/v1';
        this.cacheFile = path.join(os.homedir(), '.qantum', 'license.enc');
        this.machineId = this.generateMachineFingerprint().hash;
        this.publicKey = this.getPublicKey();
        this.loadCachedLicense();
    }
    static getInstance() {
        if (!LicenseValidator.instance) {
            LicenseValidator.instance = new LicenseValidator();
        }
        return LicenseValidator.instance;
    }
    /**
     * Validate license key
     */
    async validate(licenseKey) {
        const key = licenseKey || process.env.qantum_LICENSE_KEY || this.cache?.license.licenseKey;
        if (!key) {
            return this.createTrialResult();
        }
        // Check cache validity
        if (this.isCacheValid()) {
            console.log('🏰 [LICENSE] Using cached validation');
            return this.createResultFromCache();
        }
        // Online validation
        try {
            const result = await this.validateOnline(key);
            this.updateCache(result);
            return this.createResult(result);
        }
        catch (error) {
            // Offline fallback
            if (this.canUseOfflineGrace()) {
                console.log('🏰 [LICENSE] Using offline grace period');
                return this.createResultFromCache();
            }
            console.error('🏰 [LICENSE] Validation failed:', error);
            return this.createTrialResult();
        }
    }
    /**
     * Generate machine fingerprint
     */
    generateMachineFingerprint() {
        const cpus = os.cpus();
        const networkInterfaces = os.networkInterfaces();
        const cpuId = cpus[0]?.model || 'unknown';
        const hostname = os.hostname();
        const platform = `${os.platform()}-${os.arch()}`;
        const totalMemory = os.totalmem();
        const macAddresses = [];
        for (const [name, interfaces] of Object.entries(networkInterfaces)) {
            if (interfaces) {
                for (const iface of interfaces) {
                    if (!iface.internal && iface.mac !== '00:00:00:00:00:00') {
                        macAddresses.push(iface.mac);
                    }
                }
            }
        }
        // Create hash from all components
        const fingerprint = {
            cpuId,
            hostname,
            platform,
            totalMemory,
            networkInterfaces: macAddresses
        };
        const hash = crypto.createHash('sha256')
            .update(JSON.stringify(fingerprint))
            .digest('hex');
        return { ...fingerprint, hash };
    }
    /**
     * Check if feature is available in current license
     */
    hasFeature(feature) {
        if (!this.cache)
            return false;
        return this.cache.license.features.includes(feature) ||
            this.cache.license.features.includes('*');
    }
    /**
     * Get current license tier
     */
    getTier() {
        return this.cache?.license.tier || 'trial';
    }
    /**
     * Get remaining tests for today
     */
    getRemainingTests() {
        if (!this.cache)
            return 10; // Trial limit
        // In production, this would track actual usage
        return this.cache.license.maxTestsPerDay;
    }
    /**
     * Activate license
     */
    async activate(licenseKey) {
        console.log('🏰 [LICENSE] Activating license...');
        const result = await this.validateOnline(licenseKey, true);
        this.updateCache(result);
        console.log(`🏰 [LICENSE] Activated: ${result.tier.toUpperCase()}`);
        console.log(`🏰 [LICENSE] Organization: ${result.organization}`);
        console.log(`🏰 [LICENSE] Expires: ${new Date(result.expiresAt).toLocaleDateString()}`);
        return this.createResult(result);
    }
    /**
     * Deactivate license (for transferring to another machine)
     */
    async deactivate() {
        if (!this.cache)
            return false;
        try {
            await this.sendRequest('/deactivate', {
                licenseKey: this.cache.license.licenseKey,
                machineId: this.machineId
            });
            // Clear cache
            this.cache = null;
            if (fs.existsSync(this.cacheFile)) {
                fs.unlinkSync(this.cacheFile);
            }
            console.log('🏰 [LICENSE] Deactivated successfully');
            return true;
        }
        catch (error) {
            console.error('🏰 [LICENSE] Deactivation failed:', error);
            return false;
        }
    }
    // ============================================================
    // PRIVATE METHODS
    // ============================================================
    async validateOnline(licenseKey, activate = false) {
        const endpoint = activate ? '/activate' : '/validate';
        const response = await this.sendRequest(endpoint, {
            licenseKey,
            machineId: this.machineId,
            fingerprint: this.generateMachineFingerprint(),
            version: '1.0.0'
        });
        // Verify signature
        if (!this.verifySignature(response)) {
            throw new Error('Invalid license signature');
        }
        return response;
    }
    async sendRequest(endpoint, data) {
        return new Promise((resolve, reject) => {
            const url = new URL(endpoint, this.licenseServerUrl);
            const postData = JSON.stringify(data);
            const options = {
                hostname: url.hostname,
                port: 443,
                path: url.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData),
                    'X-qantum-Version': '1.0.0'
                },
                timeout: 10000
            };
            const req = https.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => {
                    try {
                        if (res.statusCode === 200) {
                            resolve(JSON.parse(body));
                        }
                        else {
                            reject(new Error(`License server error: ${res.statusCode}`));
                        }
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            });
            req.on('error', reject);
            req.on('timeout', () => reject(new Error('License server timeout')));
            req.write(postData);
            req.end();
        });
    }
    verifySignature(license) {
        if (!license.signature)
            return false;
        const dataToVerify = JSON.stringify({
            licenseKey: license.licenseKey,
            tier: license.tier,
            organization: license.organization,
            machineId: license.machineId,
            issuedAt: license.issuedAt,
            expiresAt: license.expiresAt
        });
        try {
            const verify = crypto.createVerify('RSA-SHA256');
            verify.update(dataToVerify);
            return verify.verify(this.publicKey, license.signature, 'base64');
        }
        catch {
            return false;
        }
    }
    loadCachedLicense() {
        try {
            if (fs.existsSync(this.cacheFile)) {
                const encrypted = fs.readFileSync(this.cacheFile, 'utf-8');
                const decrypted = this.decrypt(encrypted);
                this.cache = JSON.parse(decrypted);
            }
        }
        catch (error) {
            console.warn('🏰 [LICENSE] Could not load cached license');
            this.cache = null;
        }
    }
    updateCache(license) {
        this.cache = {
            license,
            lastValidated: Date.now(),
            validationCount: (this.cache?.validationCount || 0) + 1,
            offlineGracePeriod: Date.now() + this.OFFLINE_GRACE_PERIOD
        };
        // Save to disk
        const dir = path.dirname(this.cacheFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const encrypted = this.encrypt(JSON.stringify(this.cache));
        fs.writeFileSync(this.cacheFile, encrypted);
    }
    isCacheValid() {
        if (!this.cache)
            return false;
        const timeSinceValidation = Date.now() - this.cache.lastValidated;
        return timeSinceValidation < this.VALIDATION_INTERVAL;
    }
    canUseOfflineGrace() {
        if (!this.cache)
            return false;
        return Date.now() < this.cache.offlineGracePeriod;
    }
    encrypt(data) {
        const key = crypto.scryptSync(this.machineId, 'qantum-salt', 32);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(data, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return iv.toString('base64') + ':' + encrypted;
    }
    decrypt(data) {
        const key = crypto.scryptSync(this.machineId, 'qantum-salt', 32);
        const [ivBase64, encrypted] = data.split(':');
        const iv = Buffer.from(ivBase64, 'base64');
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    createResult(license) {
        const expiresIn = license.expiresAt - Date.now();
        return {
            valid: expiresIn > 0,
            tier: license.tier,
            expiresIn,
            features: license.features,
            limits: this.getTierLimits(license.tier),
            message: expiresIn > 0
                ? `Licensed to ${license.organization}`
                : 'License expired'
        };
    }
    createResultFromCache() {
        if (!this.cache)
            return this.createTrialResult();
        return this.createResult(this.cache.license);
    }
    createTrialResult() {
        return {
            valid: true,
            tier: 'trial',
            expiresIn: 7 * 24 * 60 * 60 * 1000, // 7 days
            features: ['basic-testing', 'self-healing'],
            limits: this.getTierLimits('trial'),
            message: 'Trial mode - Limited features'
        };
    }
    getTierLimits(tier) {
        const limits = {
            trial: {
                maxWorkers: 2,
                maxTestsPerDay: 50,
                ghostProtocol: false,
                preCog: false,
                swarmExecution: false
            },
            professional: {
                maxWorkers: 8,
                maxTestsPerDay: 1000,
                ghostProtocol: true,
                preCog: true,
                swarmExecution: false
            },
            enterprise: {
                maxWorkers: 32,
                maxTestsPerDay: 10000,
                ghostProtocol: true,
                preCog: true,
                swarmExecution: true
            },
            unlimited: {
                maxWorkers: 999,
                maxTestsPerDay: Infinity,
                ghostProtocol: true,
                preCog: true,
                swarmExecution: true
            }
        };
        return limits[tier];
    }
    getPublicKey() {
        // In production, this would be an actual RSA public key
        return `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1234567890
-----END PUBLIC KEY-----`;
    }
}
exports.LicenseValidator = LicenseValidator;
// ============================================================
// ANTI-TAMPER PROTECTION
// ============================================================
class AntiTamper {
    static INTEGRITY_CHECK_INTERVAL = 60000; // 1 minute
    static integrityHashes = new Map();
    static isRunning = false;
    /**
     * Initialize anti-tamper protection
     */
    static initialize(criticalFiles) {
        console.log('🏰 [ANTI-TAMPER] Initializing protection...');
        // Calculate initial hashes
        for (const file of criticalFiles) {
            if (fs.existsSync(file)) {
                const hash = this.calculateFileHash(file);
                this.integrityHashes.set(file, hash);
            }
        }
        // Start monitoring
        this.isRunning = true;
        this.startMonitoring();
        // Detect debugger
        this.detectDebugger();
        console.log(`🏰 [ANTI-TAMPER] Protecting ${criticalFiles.length} files`);
    }
    /**
     * Start integrity monitoring
     */
    static startMonitoring() {
        setInterval(() => {
            if (!this.isRunning)
                return;
            for (const [file, expectedHash] of this.integrityHashes) {
                if (fs.existsSync(file)) {
                    const currentHash = this.calculateFileHash(file);
                    if (currentHash !== expectedHash) {
                        this.onTamperDetected(file);
                    }
                }
            }
        }, this.INTEGRITY_CHECK_INTERVAL);
    }
    /**
     * Detect debugger attachment
     */
    static detectDebugger() {
        // Method 1: Check for inspector
        const inspector = require('inspector');
        if (inspector.url()) {
            this.onDebuggerDetected('Inspector attached');
        }
        // Method 2: Timing-based detection
        setInterval(() => {
            const start = Date.now();
            // This would be slower if debugger is attached
            for (let i = 0; i < 1000; i++) {
                Math.random();
            }
            const elapsed = Date.now() - start;
            if (elapsed > 100) { // Suspiciously slow
                this.onDebuggerDetected('Timing anomaly detected');
            }
        }, 30000);
    }
    /**
     * Handle tamper detection
     */
    static onTamperDetected(file) {
        console.error('🚨 [ANTI-TAMPER] FILE TAMPERING DETECTED!');
        console.error(`   File: ${file}`);
        // In production: send alert to server, disable features, etc.
        this.triggerCountermeasures('tamper');
    }
    /**
     * Handle debugger detection
     */
    static onDebuggerDetected(method) {
        console.warn('🚨 [ANTI-TAMPER] DEBUGGER DETECTED!');
        console.warn(`   Method: ${method}`);
        // In production: disable sensitive features
        this.triggerCountermeasures('debugger');
    }
    /**
     * Trigger security countermeasures
     */
    static triggerCountermeasures(reason) {
        // Log the incident
        const incident = {
            timestamp: Date.now(),
            reason,
            machineId: LicenseValidator.getInstance().generateMachineFingerprint().hash
        };
        // In production: send to server, revoke license, etc.
        console.error('🏰 [FORTRESS] Security incident logged:', incident);
        // Disable premium features
        process.env.qantum_RESTRICTED = 'true';
    }
    static calculateFileHash(filePath) {
        const content = fs.readFileSync(filePath);
        return crypto.createHash('sha256').update(content).digest('hex');
    }
}
exports.AntiTamper = AntiTamper;
// ============================================================
// EXPORTS & CLI
// ============================================================
async function validateLicense() {
    return LicenseValidator.getInstance().validate();
}
async function activateLicense(key) {
    return LicenseValidator.getInstance().activate(key);
}
//# sourceMappingURL=license-validator.js.map