/**
 * ⚛️🛡️ QANTUM ANTI-TAMPER - INTEGRITY PROTECTION SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════════════════
 *
 *    █████╗ ███╗   ██╗████████╗██╗      ████████╗ █████╗ ███╗   ███╗██████╗ ███████╗██████╗
 *   ██╔══██╗████╗  ██║╚══██╔══╝██║      ╚══██╔══╝██╔══██╗████╗ ████║██╔══██╗██╔════╝██╔══██╗
 *   ███████║██╔██╗ ██║   ██║   ██║         ██║   ███████║██╔████╔██║██████╔╝█████╗  ██████╔╝
 *   ██╔══██║██║╚██╗██║   ██║   ██║         ██║   ██╔══██║██║╚██╔╝██║██╔═══╝ ██╔══╝  ██╔══██╗
 *   ██║  ██║██║ ╚████║   ██║   ██║         ██║   ██║  ██║██║ ╚═╝ ██║██║     ███████╗██║  ██║
 *   ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝         ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝
 *
 * ═══════════════════════════════════════════════════════════════════════════════════════
 *
 *   Anti-Debug • Anti-VM • Anti-Reverse Engineering
 *
 *   QAntum се защитава от анализ и манипулация.
 *   Всеки опит за дебъгване или стартиране в VM ще бъде засечен.
 *
 *   "If they can't see you, they can't break you."
 *
 * ═══════════════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export interface DetectionResult {
    isDetected: boolean;
    type: 'debugger' | 'vm' | 'sandbox' | 'analysis' | 'integrity';
    confidence: number;
    details: string;
    timestamp: number;
}
export interface VMSignature {
    name: string;
    indicators: string[];
    processNames: string[];
    registryKeys?: string[];
    files?: string[];
    macPrefixes?: string[];
}
export interface AntiTamperConfig {
    enableDebugDetection: boolean;
    enableVMDetection: boolean;
    enableSandboxDetection: boolean;
    enableIntegrityCheck: boolean;
    checkInterval: number;
    onDetection: 'warn' | 'evade' | 'terminate' | 'corrupt';
    criticalFiles: string[];
    allowedEnvironments: string[];
}
export interface IntegrityHash {
    file: string;
    hash: string;
    size: number;
    timestamp: number;
}
export declare class AntiTamper extends EventEmitter {
    private config;
    private detections;
    private integrityHashes;
    private checkInterval;
    private isCompromised;
    private evasionMode;
    constructor(config?: Partial<AntiTamperConfig>);
    /**
     * 🛡️ Initialize anti-tamper protection
     */
    initialize(): Promise<boolean>;
    /**
     * 🔍 Perform full security scan
     */
    performFullScan(): Promise<DetectionResult[]>;
    /**
     * 🔍 Detect debugger presence
     */
    detectDebugger(): Promise<DetectionResult>;
    /**
     * 🔍 Detect Virtual Machine
     */
    detectVM(): Promise<DetectionResult>;
    /**
     * 🔍 Detect Sandbox environment
     */
    detectSandbox(): Promise<DetectionResult>;
    /**
     * 🔍 Check file integrity
     */
    checkIntegrity(): Promise<DetectionResult>;
    /**
     * 🔍 Detect timing anomalies
     */
    detectTimingAnomaly(): DetectionResult;
    /**
     * Initialize file integrity monitoring
     */
    private initializeIntegrityMonitoring;
    /**
     * Start continuous monitoring
     */
    private startMonitoring;
    /**
     * 🚨 Handle detection
     */
    private handleDetection;
    /**
     * 🥷 Activate evasion mode
     */
    private activateEvasion;
    /**
     * Generate noise data to confuse analysis
     */
    private generateNoise;
    /**
     * Throttle execution to slow analysis
     */
    private throttleExecution;
    /**
     * 💀 Terminate execution
     */
    private terminate;
    /**
     * 🔥 Corrupt sensitive data
     */
    private corrupt;
    /**
     * Check if system is compromised
     */
    isSystemCompromised(): boolean;
    /**
     * Check if in evasion mode
     */
    isInEvasionMode(): boolean;
    /**
     * Get all detections
     */
    getDetections(): DetectionResult[];
    /**
     * Stop monitoring
     */
    stop(): void;
}
export declare function getAntiTamper(config?: Partial<AntiTamperConfig>): AntiTamper;
export declare function createAntiTamper(config?: Partial<AntiTamperConfig>): AntiTamper;
export default AntiTamper;
//# sourceMappingURL=anti-tamper.d.ts.map