/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * QAntum - LICENSE MANAGER
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * @copyright 2025 Димитър Продромов (Dimitar Prodromov). All Rights Reserved.
 * @license PROPRIETARY AND CONFIDENTIAL
 *
 * Hardware ID verification system for enterprise licensing.
 * Protects intellectual property and ensures authorized usage only.
 * ═══════════════════════════════════════════════════════════════════════════════
 */
/**
 * License types
 */
export type LicenseType = 'trial' | 'professional' | 'enterprise' | 'sovereign';
/**
 * License info
 */
export interface LicenseInfo {
    type: LicenseType;
    owner: string;
    email: string;
    hardwareId: string;
    machineFingerprint: string;
    issuedAt: number;
    expiresAt: number;
    features: string[];
    maxInstances: number;
    signature: string;
}
/**
 * License validation result
 */
export interface LicenseValidationResult {
    valid: boolean;
    type: LicenseType | null;
    owner: string | null;
    features: string[];
    daysRemaining: number;
    error?: string;
}
/**
 * Hardware info for fingerprinting
 */
export interface HardwareInfo {
    cpuModel: string;
    cpuCores: number;
    totalMemory: number;
    hostname: string;
    platform: string;
    macAddresses: string[];
    diskSerial?: string;
    motherboardSerial?: string;
}
export declare class LicenseManager {
    private static readonly LICENSE_FILE;
    private static readonly PUBLIC_KEY;
    private license;
    private hardwareInfo;
    constructor();
    /**
     * Collect hardware information
     */
    private collectHardwareInfo;
    /**
     * Get disk serial (Windows)
     */
    private getDiskSerial;
    /**
     * Get motherboard serial (Windows)
     */
    private getMotherboardSerial;
    /**
     * Generate hardware ID
     */
    generateHardwareId(): string;
    /**
     * Generate machine fingerprint (more detailed)
     */
    generateMachineFingerprint(): string;
    /**
     * Load license from file
     */
    loadLicense(licenseFile?: string): boolean;
    /**
     * Validate loaded license
     */
    validate(): LicenseValidationResult;
    /**
     * Verify license signature
     */
    private verifySignature;
    /**
     * Check if specific feature is licensed
     */
    hasFeature(feature: string): boolean;
    /**
     * Get max instances allowed
     */
    getMaxInstances(): number;
    /**
     * Generate a development license
     */
    generateDevLicense(owner: string, email: string, type?: LicenseType): string;
    /**
     * Save license to file
     */
    saveLicense(licenseString: string, licenseFile?: string): void;
    /**
     * Get hardware info
     */
    getHardwareInfo(): HardwareInfo;
    /**
     * Get license info
     */
    getLicenseInfo(): LicenseInfo | null;
    /**
     * Display license status
     */
    displayStatus(): string;
}
/**
 * Decorator to guard methods with license check
 */
export declare function requireLicense(feature?: string): (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export default LicenseManager;
//# sourceMappingURL=license-manager.d.ts.map