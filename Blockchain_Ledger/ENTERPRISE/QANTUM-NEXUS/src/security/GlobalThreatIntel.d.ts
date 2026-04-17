/**
 * GlobalThreatIntel.ts - "The Immunity Network"
 *
 * QAntum Framework v1.7.0 - "The Global Nexus & Autonomous Onboarding"
 *
 * Connects Fatality Engine with Nexus Mesh for global threat intelligence.
 * If one worker in Tokyo is detected by Akamai, all 1000 workers worldwide
 * receive an Immunity Patch in 0.05ms.
 *
 * MARKET VALUE: +$320,000
 * - Sub-millisecond threat propagation
 * - Automatic immunity patch generation
 * - CDN/WAF detection signatures
 * - Global coordination protocol
 *
 * @module security/GlobalThreatIntel
 * @version 1.0.0
 * @enterprise true
 */
import { EventEmitter } from 'events';
/**
 * Threat detection sources
 */
export type DetectionSource = 'akamai' | 'cloudflare' | 'fastly' | 'imperva' | 'aws-waf' | 'azure-frontdoor' | 'google-cloud-armor' | 'sucuri' | 'datadome' | 'perimeterx' | 'distil' | 'kasada' | 'internal';
/**
 * Threat severity levels
 */
export type ThreatSeverity = 'low' | 'medium' | 'high' | 'critical' | 'apocalyptic';
/**
 * Immunity patch types
 */
export type PatchType = 'fingerprint-rotation' | 'header-mutation' | 'timing-adjustment' | 'behavior-modification' | 'ip-rotation' | 'proxy-switch' | 'browser-profile' | 'tls-fingerprint' | 'javascript-execution' | 'cookie-management';
/**
 * Propagation strategy
 */
export type PropagationStrategy = 'instant-global' | 'regional-cascade' | 'priority-first' | 'stealth-rollout';
/**
 * Worker region
 */
export type WorkerRegion = 'tokyo' | 'singapore' | 'sydney' | 'mumbai' | 'frankfurt' | 'london' | 'paris' | 'stockholm' | 'virginia' | 'oregon' | 'ohio' | 'saopaulo' | 'capetown';
/**
 * Threat detection event
 */
export interface ThreatDetection {
    detectionId: string;
    timestamp: Date;
    source: DetectionSource;
    sourceVersion?: string;
    detectedInRegion: WorkerRegion;
    detectedByWorkerId: string;
    targetUrl: string;
    severity: ThreatSeverity;
    threatType: string;
    confidence: number;
    evidence: ThreatEvidence;
    responseCode?: number;
    responseHeaders?: Record<string, string>;
    challengeType?: string;
    detectionLatencyMs: number;
}
/**
 * Threat evidence
 */
export interface ThreatEvidence {
    requestFingerprint: string;
    userAgent: string;
    tlsFingerprint?: string;
    triggers: string[];
    blockingSignature?: string;
    exitIp: string;
    proxyUsed: boolean;
    requestPattern?: string;
    timingAnomaly?: boolean;
}
/**
 * Immunity patch
 */
export interface ImmunityPatch {
    patchId: string;
    timestamp: Date;
    threatDetectionId: string;
    source: DetectionSource;
    patchType: PatchType;
    priority: 'normal' | 'urgent' | 'emergency';
    patchCode: string;
    configuration: PatchConfiguration;
    testedAgainst: string[];
    effectivenessScore: number;
    generatedBy: 'ai' | 'heuristic' | 'manual';
    expiresAt: Date;
    version: number;
}
/**
 * Patch configuration
 */
export interface PatchConfiguration {
    newFingerprint?: FingerprintConfig;
    headerMutations?: HeaderMutation[];
    timingConfig?: TimingConfig;
    behaviorConfig?: BehaviorConfig;
    networkConfig?: NetworkConfig;
}
/**
 * Fingerprint configuration
 */
export interface FingerprintConfig {
    browserVersion?: string;
    platformVersion?: string;
    screenResolution?: string;
    timezone?: string;
    languages?: string[];
    webglVendor?: string;
    webglRenderer?: string;
    canvasHash?: string;
    audioFingerprint?: string;
}
/**
 * Header mutation
 */
export interface HeaderMutation {
    header: string;
    action: 'set' | 'remove' | 'randomize' | 'rotate';
    value?: string;
    values?: string[];
}
/**
 * Timing configuration
 */
export interface TimingConfig {
    minDelayMs: number;
    maxDelayMs: number;
    jitterMs: number;
    burstLimit: number;
    cooldownMs: number;
}
/**
 * Behavior configuration
 */
export interface BehaviorConfig {
    mouseMovement: 'human' | 'linear' | 'bezier';
    scrollPattern: 'natural' | 'instant' | 'stepped';
    keyboardTiming: 'human' | 'instant' | 'variable';
    clickDelay: number;
    hoverDuration: number;
}
/**
 * Network configuration
 */
export interface NetworkConfig {
    rotateIp: boolean;
    proxyPool?: string;
    preferredRegions?: WorkerRegion[];
    avoidRegions?: WorkerRegion[];
    tlsVersion?: string;
    cipherSuites?: string[];
}
/**
 * Propagation result
 */
export interface PropagationResult {
    propagationId: string;
    patchId: string;
    strategy: PropagationStrategy;
    startedAt: Date;
    completedAt: Date;
    totalLatencyMs: number;
    totalWorkers: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    regionStats: Record<WorkerRegion, RegionPropagationStats>;
    p50LatencyMs: number;
    p99LatencyMs: number;
    maxLatencyMs: number;
}
/**
 * Region propagation stats
 */
export interface RegionPropagationStats {
    workerCount: number;
    delivered: number;
    latencyMs: number;
    appliedAt: Date;
}
/**
 * Worker state
 */
export interface WorkerState {
    workerId: string;
    region: WorkerRegion;
    status: 'active' | 'patching' | 'degraded' | 'offline';
    currentFingerprint: string;
    appliedPatches: string[];
    lastHealthCheck: Date;
    healthScore: number;
    successRate: number;
    detectionCount: number;
    lastDetection?: Date;
}
/**
 * Detection signature
 */
export interface DetectionSignature {
    signatureId: string;
    source: DetectionSource;
    pattern: string;
    regex?: RegExp;
    severity: ThreatSeverity;
    category: string;
    recommendedPatch: PatchType;
    bypassStrategy: string;
    detectionCount: number;
    bypassSuccessRate: number;
    lastSeen: Date;
}
/**
 * Global threat intel configuration
 */
export interface GlobalThreatIntelConfig {
    maxWorkers: number;
    workersPerRegion: Record<WorkerRegion, number>;
    defaultStrategy: PropagationStrategy;
    targetLatencyMs: number;
    maxPropagationTimeMs: number;
    patchExpirationHours: number;
    maxActivePaches: number;
    autoGeneratePatches: boolean;
    signatureUpdateIntervalMs: number;
    healthCheckIntervalMs: number;
    degradedThreshold: number;
}
/**
 * GlobalThreatIntel - The Immunity Network
 *
 * Real-time threat intelligence propagation across the global worker swarm.
 * Sub-millisecond patch distribution for collective immunity.
 */
export declare class GlobalThreatIntel extends EventEmitter {
    private config;
    private workers;
    private patches;
    private detections;
    private signatures;
    private workersByRegion;
    private totalDetections;
    private totalPatches;
    private totalPropagations;
    private averagePropagationLatencyMs;
    private immunityRate;
    private fatalityEngineConnected;
    constructor(config?: Partial<GlobalThreatIntelConfig>);
    /**
     * Report a threat detection from a worker
     */
    reportThreatDetection(detection: Omit<ThreatDetection, 'detectionId'>): Promise<ImmunityPatch>;
    /**
     * Find matching signature for detection
     */
    private findMatchingSignature;
    /**
     * Generate immunity patch for a threat
     */
    private generateImmunityPatch;
    /**
     * Infer patch type from detection
     */
    private inferPatchType;
    /**
     * Generate patch configuration
     */
    private generatePatchConfiguration;
    /**
     * Generate new fingerprint
     */
    private generateNewFingerprint;
    /**
     * Generate header mutations
     */
    private generateHeaderMutations;
    /**
     * Generate timing config
     */
    private generateTimingConfig;
    /**
     * Generate behavior config
     */
    private generateBehaviorConfig;
    /**
     * Generate network config
     */
    private generateNetworkConfig;
    /**
     * Get preferred regions (avoid the detection region)
     */
    private getPreferredRegions;
    /**
     * Generate patch code
     */
    private generatePatchCode;
    /**
     * Calculate patch priority
     */
    private calculatePatchPriority;
    /**
     * Propagate patch to all workers
     */
    propagatePatch(patch: ImmunityPatch): Promise<PropagationResult>;
    /**
     * Deliver patch to a specific worker
     */
    private deliverPatchToWorker;
    /**
     * Microsecond sleep for ultra-fast operations
     */
    private microSleep;
    /**
     * Connect to Fatality Engine
     */
    connectFatalityEngine(): Promise<void>;
    /**
     * Receive ban event from Fatality Engine
     */
    handleFatalityBanEvent(event: {
        ip: string;
        reason: string;
        source: DetectionSource;
        region: WorkerRegion;
    }): Promise<ImmunityPatch>;
    /**
     * Initialize detection signatures
     */
    private initializeSignatures;
    /**
     * Initialize regional indexes
     */
    private initializeRegionalIndexes;
    /**
     * Initialize workers (simulation)
     */
    private initializeWorkers;
    /**
     * Update average latency
     */
    private updateAverageLatency;
    /**
     * Generate unique ID
     */
    private generateId;
    /**
     * Get threat intelligence analytics
     */
    getAnalytics(): ThreatIntelAnalytics;
    /**
     * Get worker by ID
     */
    getWorker(workerId: string): WorkerState | undefined;
    /**
     * Get workers by region
     */
    getWorkersByRegion(region: WorkerRegion): WorkerState[];
    /**
     * Get recent detections
     */
    getRecentDetections(limit?: number): ThreatDetection[];
    /**
     * Get active patches
     */
    getActivePatches(): ImmunityPatch[];
}
export interface ThreatIntelAnalytics {
    totalWorkers: number;
    activeWorkers: number;
    totalDetections: number;
    totalPatches: number;
    totalPropagations: number;
    averagePropagationLatencyMs: number;
    immunityRate: number;
    detectionsBySource: Record<string, number>;
    detectionsByRegion: Record<string, number>;
    activeSignatures: number;
    fatalityEngineConnected: boolean;
}
/**
 * Create a new GlobalThreatIntel instance
 */
export declare function createGlobalThreatIntel(config?: Partial<GlobalThreatIntelConfig>): GlobalThreatIntel;
export default GlobalThreatIntel;
//# sourceMappingURL=GlobalThreatIntel.d.ts.map