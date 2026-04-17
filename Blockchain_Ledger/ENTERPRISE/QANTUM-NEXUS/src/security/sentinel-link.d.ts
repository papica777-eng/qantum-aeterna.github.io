/**
 * ⚛️📡 QANTUM SENTINEL LINK - CLOUD VERIFICATION HEARTBEAT
 * ═══════════════════════════════════════════════════════════════════════════════════════
 *
 *   ███████╗███████╗███╗   ██╗████████╗██╗███╗   ██╗███████╗██╗
 *   ██╔════╝██╔════╝████╗  ██║╚══██╔══╝██║████╗  ██║██╔════╝██║
 *   ███████╗█████╗  ██╔██╗ ██║   ██║   ██║██╔██╗ ██║█████╗  ██║
 *   ╚════██║██╔══╝  ██║╚██╗██║   ██║   ██║██║╚██╗██║██╔══╝  ██║
 *   ███████║███████╗██║ ╚████║   ██║   ██║██║ ╚████║███████╗███████╗
 *   ╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝╚═╝  ╚═══╝╚══════╝╚══════╝
 *
 *   ██╗     ██╗███╗   ██╗██╗  ██╗
 *   ██║     ██║████╗  ██║██║ ██╔╝
 *   ██║     ██║██╔██╗ ██║█████╔╝
 *   ██║     ██║██║╚██╗██║██╔═██╗
 *   ███████╗██║██║ ╚████║██║  ██╗
 *   ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
 *
 * ═══════════════════════════════════════════════════════════════════════════════════════
 *
 *   Cloud Verification & Kill Switch System
 *
 *   QAntum поддържа постоянна връзка със Sentinel сървър.
 *   При нарушение на лиценза - дистанционно деактивиране.
 *
 *   "Even when offline, the Sentinel remembers."
 *
 * ═══════════════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export interface SentinelConfig {
    serverUrl: string;
    apiKey: string;
    machineId: string;
    heartbeatInterval: number;
    gracePeriod: number;
    maxOfflineTime: number;
    encryptionKey: string;
    onVerificationFailed: 'warn' | 'dormant' | 'disable' | 'destroy';
    enableKillSwitch: boolean;
    enableUsageTracking: boolean;
}
export interface HeartbeatRequest {
    machineId: string;
    timestamp: number;
    version: string;
    signature: string;
    metrics?: UsageMetrics;
}
export interface HeartbeatResponse {
    status: 'active' | 'suspended' | 'revoked' | 'expired';
    message?: string;
    expiresAt?: number;
    features?: string[];
    commands?: RemoteCommand[];
    signature: string;
}
export interface UsageMetrics {
    testsRun: number;
    errorsFound: number;
    uptime: number;
    lastActive: number;
    cpuUsage: number;
    memoryUsage: number;
}
export interface RemoteCommand {
    id: string;
    type: 'update' | 'message' | 'disable' | 'destroy' | 'config';
    payload: any;
    timestamp: number;
    signature: string;
}
export interface OfflineToken {
    machineId: string;
    issuedAt: number;
    validUntil: number;
    checksum: string;
    signature: string;
}
export declare class SentinelLink extends EventEmitter {
    private config;
    private heartbeatTimer;
    private lastVerification;
    private isActive;
    private isDormant;
    private offlineMode;
    private offlineToken;
    private failedAttempts;
    private metrics;
    private startTime;
    private pendingCommands;
    private static readonly DEFAULT_SERVER;
    constructor(config: Partial<SentinelConfig>);
    /**
     * 📡 Initialize Sentinel connection
     */
    initialize(): Promise<boolean>;
    /**
     * 💓 Send heartbeat to Sentinel server
     */
    sendHeartbeat(): Promise<boolean>;
    /**
     * Process heartbeat response
     */
    private processHeartbeatResponse;
    /**
     * Start heartbeat timer
     */
    private startHeartbeat;
    /**
     * 📴 Check offline token validity
     */
    private checkOfflineToken;
    /**
     * Generate offline token for future use
     */
    private generateOfflineToken;
    /**
     * Start offline monitoring
     */
    private startOfflineMonitoring;
    /**
     * 🎮 Process remote commands
     */
    private processRemoteCommands;
    /**
     * Update configuration from remote command
     */
    private updateConfig;
    /**
     * 🚨 Handle verification failure
     */
    private handleVerificationFailure;
    /**
     * 😴 Enter dormant mode
     */
    private enterDormantMode;
    /**
     * 🔒 Disable QAntum
     */
    private disable;
    /**
     * 💀 Execute kill switch
     */
    private executeKillSwitch;
    /**
     * Clear all sensitive data
     */
    private clearSensitiveData;
    /**
     * 📊 Collect usage metrics
     */
    private collectMetrics;
    /**
     * Update metrics
     */
    updateMetrics(updates: Partial<UsageMetrics>): void;
    /**
     * Sign request
     */
    private signRequest;
    /**
     * Verify response signature
     */
    private verifyResponseSignature;
    /**
     * Verify command signature
     */
    private verifyCommandSignature;
    /**
     * Generate token checksum
     */
    private generateTokenChecksum;
    /**
     * Sign token
     */
    private signToken;
    /**
     * Encrypt token
     */
    private encryptToken;
    /**
     * Decrypt token
     */
    private decryptToken;
    /**
     * Make HTTP request to Sentinel server
     */
    private makeRequest;
    /**
     * Check if license is active
     */
    isLicenseActive(): boolean;
    /**
     * Check if in dormant mode
     */
    isInDormantMode(): boolean;
    /**
     * Check if offline
     */
    isOffline(): boolean;
    /**
     * Get time until offline token expires
     */
    getOfflineTimeRemaining(): number;
    /**
     * Stop Sentinel
     */
    stop(): void;
}
export declare function getSentinelLink(config: Partial<SentinelConfig>): SentinelLink;
export declare function createSentinelLink(config: Partial<SentinelConfig>): SentinelLink;
export default SentinelLink;
//# sourceMappingURL=sentinel-link.d.ts.map