/**
 * ⚛️🔐 QANTUM GENETIC LOCK - HARDWARE FINGERPRINT AUTHENTICATION
 * ═══════════════════════════════════════════════════════════════════════════════════════
 *
 *    ██████╗ ███████╗███╗   ██╗███████╗████████╗██╗ ██████╗
 *   ██╔════╝ ██╔════╝████╗  ██║██╔════╝╚══██╔══╝██║██╔════╝
 *   ██║  ███╗█████╗  ██╔██╗ ██║█████╗     ██║   ██║██║
 *   ██║   ██║██╔══╝  ██║╚██╗██║██╔══╝     ██║   ██║██║
 *   ╚██████╔╝███████╗██║ ╚████║███████╗   ██║   ██║╚██████╗
 *    ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝ ╚═════╝
 *
 *   ██╗      ██████╗  ██████╗██╗  ██╗
 *   ██║     ██╔═══██╗██╔════╝██║ ██╔╝
 *   ██║     ██║   ██║██║     █████╔╝
 *   ██║     ██║   ██║██║     ██╔═██╗
 *   ███████╗╚██████╔╝╚██████╗██║  ██╗
 *   ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝
 *
 * ═══════════════════════════════════════════════════════════════════════════════════════
 *
 *   Hardware DNA Verification System
 *
 *   QAntum работи САМО на оторизирани машини.
 *   Всеки опит за копиране на друга система ще бъде засечен.
 *
 *   "Your hardware is the key. Without it, QAntum is a ghost."
 *
 * ═══════════════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export interface HardwareFingerprint {
    cpuId: string;
    cpuModel: string;
    cpuCores: number;
    motherboardSerial: string;
    biosSerial: string;
    diskUUID: string;
    macAddresses: string[];
    hostname: string;
    username: string;
    platform: string;
    arch: string;
    totalMemory: number;
    gpuInfo?: string;
}
export interface FingerprintHash {
    full: string;
    partial: string;
    timestamp: number;
    version: string;
}
export interface LicenseData {
    machineId: string;
    fingerprintHash: string;
    issuedAt: number;
    expiresAt: number;
    tier: 'developer' | 'professional' | 'enterprise';
    maxWorkers: number;
    features: string[];
    signature: string;
}
export interface HardwareLockConfig {
    strictMode: boolean;
    allowedVariance: number;
    checkInterval: number;
    licensePath: string;
    onViolation: 'warn' | 'disable' | 'destroy';
    encryptionKey?: string;
}
export declare class HardwareLock extends EventEmitter {
    private config;
    private currentFingerprint;
    private licenseData;
    private verificationInterval;
    private isLocked;
    private violationCount;
    private static readonly MASTER_FINGERPRINT_HASH;
    constructor(config?: Partial<HardwareLockConfig>);
    /**
     * 🔍 Collect hardware fingerprint from current machine
     */
    collectFingerprint(): Promise<HardwareFingerprint>;
    /**
     * Get CPU ID (Windows specific)
     */
    private getCpuId;
    /**
     * Get Motherboard Serial Number
     */
    private getMotherboardSerial;
    /**
     * Get BIOS Serial Number
     */
    private getBiosSerial;
    /**
     * Get Disk UUID
     */
    private getDiskUUID;
    /**
     * Get all MAC addresses
     */
    private getMacAddresses;
    /**
     * Get GPU information
     */
    private getGpuInfo;
    /**
     * 🔐 Generate hash from fingerprint
     */
    generateHash(fingerprint: HardwareFingerprint): FingerprintHash;
    /**
     * Generate machine ID (short unique identifier)
     */
    generateMachineId(fingerprint: HardwareFingerprint): string;
    /**
     * 🔒 Initialize and lock to current hardware
     */
    initialize(): Promise<boolean>;
    /**
     * 🔑 Verify license file
     */
    verifyLicense(): Promise<boolean>;
    /**
     * Decrypt license data
     */
    private decryptLicense;
    /**
     * Encrypt license data
     */
    encryptLicense(licenseData: LicenseData): string;
    /**
     * Generate license request file
     */
    private generateLicenseRequest;
    /**
     * Start periodic hardware verification
     */
    private startPeriodicVerification;
    /**
     * 🔒 Verify current hardware matches license
     */
    verify(): Promise<boolean>;
    /**
     * 🚨 Handle security violation
     */
    private handleViolation;
    /**
     * 💀 Self-destruct critical data
     */
    private selfDestruct;
    /**
     * Check if system is locked
     */
    isSystemLocked(): boolean;
    /**
     * Get current license info
     */
    getLicenseInfo(): LicenseData | null;
    /**
     * Get current fingerprint
     */
    getFingerprint(): HardwareFingerprint | null;
    /**
     * Stop verification
     */
    stop(): void;
}
export declare function getHardwareLock(config?: Partial<HardwareLockConfig>): HardwareLock;
export declare function createHardwareLock(config?: Partial<HardwareLockConfig>): HardwareLock;
export default HardwareLock;
//# sourceMappingURL=hardware-lock.d.ts.map