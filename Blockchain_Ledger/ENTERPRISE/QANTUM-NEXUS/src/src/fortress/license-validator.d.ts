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
export type LicenseTier = 'trial' | 'professional' | 'enterprise' | 'unlimited';
interface MachineFingerprint {
    cpuId: string;
    hostname: string;
    platform: string;
    totalMemory: number;
    networkInterfaces: string[];
    hash: string;
}
interface ValidationResult {
    valid: boolean;
    tier: LicenseTier;
    expiresIn: number;
    features: string[];
    limits: {
        maxWorkers: number;
        maxTestsPerDay: number;
        ghostProtocol: boolean;
        preCog: boolean;
        swarmExecution: boolean;
    };
    message: string;
}
export declare class LicenseValidator {
    private static instance;
    private licenseServerUrl;
    private cacheFile;
    private cache;
    private machineId;
    private publicKey;
    private readonly OFFLINE_GRACE_PERIOD;
    private readonly VALIDATION_INTERVAL;
    private constructor();
    static getInstance(): LicenseValidator;
    /**
     * Validate license key
     */
    validate(licenseKey?: string): Promise<ValidationResult>;
    /**
     * Generate machine fingerprint
     */
    generateMachineFingerprint(): MachineFingerprint;
    /**
     * Check if feature is available in current license
     */
    hasFeature(feature: string): boolean;
    /**
     * Get current license tier
     */
    getTier(): LicenseTier;
    /**
     * Get remaining tests for today
     */
    getRemainingTests(): number;
    /**
     * Activate license
     */
    activate(licenseKey: string): Promise<ValidationResult>;
    /**
     * Deactivate license (for transferring to another machine)
     */
    deactivate(): Promise<boolean>;
    private validateOnline;
    private sendRequest;
    private verifySignature;
    private loadCachedLicense;
    private updateCache;
    private isCacheValid;
    private canUseOfflineGrace;
    private encrypt;
    private decrypt;
    private createResult;
    private createResultFromCache;
    private createTrialResult;
    private getTierLimits;
    private getPublicKey;
}
export declare class AntiTamper {
    private static readonly INTEGRITY_CHECK_INTERVAL;
    private static integrityHashes;
    private static isRunning;
    /**
     * Initialize anti-tamper protection
     */
    static initialize(criticalFiles: string[]): void;
    /**
     * Start integrity monitoring
     */
    private static startMonitoring;
    /**
     * Detect debugger attachment
     */
    private static detectDebugger;
    /**
     * Handle tamper detection
     */
    private static onTamperDetected;
    /**
     * Handle debugger detection
     */
    private static onDebuggerDetected;
    /**
     * Trigger security countermeasures
     */
    private static triggerCountermeasures;
    private static calculateFileHash;
}
export declare function validateLicense(): Promise<ValidationResult>;
export declare function activateLicense(key: string): Promise<ValidationResult>;
export {};
//# sourceMappingURL=license-validator.d.ts.map