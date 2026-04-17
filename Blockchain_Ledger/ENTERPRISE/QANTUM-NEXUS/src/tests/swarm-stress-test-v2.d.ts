/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔥 SWARM STRESS TEST V2 - "THE REAL DEAL"
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * v27.0.1 "Indestructible" - AITK Enhanced Edition
 *
 * This is the HIGH-FIDELITY stress test that simulates REAL production scenarios:
 * - Immediate Failover Test (<50ms using Hot-Standby Pool)
 * - Stale Lock Watchdog Validation (Deadly Lock Exercise)
 * - Adaptive Batching with Sine Wave Load (10k-100k msg/sec)
 * - AITK Tracing Integration for telemetry
 *
 * NO MORE setTimeout FAKES - This is the REAL DEAL!
 *
 * @version 2.0.0
 * @author Димитър Продромов (Meta-Architect)
 * @copyright 2025. All Rights Reserved.
 * @license PROPRIETARY AND CONFIDENTIAL
 * ═══════════════════════════════════════════════════════════════════════════════
 */
declare const V2_CONFIG: {
    WORKER_COUNT: number;
    THREAD_POOL_SIZE: number;
    readonly WORKERS_PER_THREAD: number;
    TEST_DURATION_MS: number;
    CHAOS_START_DELAY_MS: number;
    ASSASSINATION_INTERVAL_MS: number;
    TARGET_FAILOVER_LATENCY_MS: number;
    TARGET_LOCK_RECOVERY_MS: number;
    TARGET_AVG_LATENCY_MS: number;
    TARGET_P99_LATENCY_MS: number;
    TARGET_THROUGHPUT: number;
    STALE_LOCK_TIMEOUT_MS: number;
    LOCK_ACQUISITION_RATE: number;
    BURST_CYCLE_MS: number;
    MIN_BURST_RATE: number;
    MAX_BURST_RATE: number;
    HOT_STANDBY_SIZE: number;
    BYTES_PER_WORKER: number;
};
interface V2Metrics {
    messagesGenerated: number;
    messagesReceived: number;
    messagesLost: number;
    lossPercentage: number;
    throughput: number;
    avgLatency: number;
    p50Latency: number;
    p95Latency: number;
    p99Latency: number;
    maxLatency: number;
    failoverCount: number;
    avgFailoverLatency: number;
    p99FailoverLatency: number;
    maxFailoverLatency: number;
    instantFailovers: number;
    coldFailovers: number;
    locksAcquired: number;
    locksReleased: number;
    staleLocksDetected: number;
    staleLocksRecovered: number;
    avgLockRecoveryTime: number;
    batchIntervalChanges: number;
    minBatchInterval: number;
    maxBatchInterval: number;
    avgBatchInterval: number;
    raceConditionsDetected: number;
    peakMemoryUsage: number;
}
declare class SwarmStressTestV2 {
    private eventBus;
    private sharedMemory;
    private chaos;
    private hotStandby;
    private tracing;
    private workers;
    private metrics;
    private testStartTime;
    private failoverEvents;
    private burstPhases;
    private currentBurstRate;
    constructor();
    private initializeMetrics;
    run(): Promise<V2Metrics>;
    private printHeader;
    private setupEventHandlers;
    private spawnWorkers;
    private startChaosInjection;
    /**
     * Sine Wave Load Simulation
     */
    private startSineWaveLoad;
    private waitForCompletion;
    private collectFinalMetrics;
    private printReport;
    private getVerdicts;
    private getFinalVerdict;
}
export { SwarmStressTestV2, V2_CONFIG, V2Metrics };
//# sourceMappingURL=swarm-stress-test-v2.d.ts.map