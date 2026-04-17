/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔥 SWARM EXTREME STRESS TEST - "THE HAMMER" PROTOCOL
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * v27.0.1 "Indestructible" Edition
 *
 * This test pushes the SwarmOrchestrator to its BREAKING POINT:
 * - 1000+ Concurrent Workers via Worker Threads
 * - "Hammer" Protocol: 1ms status floods to ZeroLatencyEventBus
 * - Chaos Injection: Worker assassination, memory pressure
 * - SharedArrayBuffer race condition validation
 * - Load balancing under extreme stress
 *
 * v27.0.1 Optimizations Under Test:
 * - Adaptive Batching (auto-scale at 50k msg/sec)
 * - Stale Lock Watchdog (200ms timeout)
 * - Hot-Standby Pool (5% pre-warmed workers)
 * - V8 Hidden Classes (message pooling)
 *
 * @copyright 2025 Димитър Продромов (Dimitar Prodromov). All Rights Reserved.
 * @license PROPRIETARY AND CONFIDENTIAL
 * ═══════════════════════════════════════════════════════════════════════════════
 */
declare const STRESS_CONFIG: {
    /** Total number of simulated workers */
    WORKER_COUNT: number;
    /** Number of actual OS threads (limited by CPU) */
    THREAD_POOL_SIZE: number;
    /** Workers simulated per thread */
    readonly WORKERS_PER_THREAD: number;
    /** "Hammer" Protocol: Status update interval (ms) */
    HAMMER_INTERVAL_MS: number;
    /** Test duration (ms) */
    TEST_DURATION_MS: number;
    /** Chaos injection start delay (ms) */
    CHAOS_START_DELAY_MS: number;
    /** Worker assassination interval (ms) */
    ASSASSINATION_INTERVAL_MS: number;
    /** Memory pressure threshold (MB) */
    MEMORY_PRESSURE_MB: number;
    /** Load balancing validation threshold (ms) */
    LOAD_BALANCE_THRESHOLD_MS: number;
    /** SharedArrayBuffer size (bytes per worker) */
    SAB_BYTES_PER_WORKER: number;
    /** Maximum acceptable race conditions */
    MAX_RACE_CONDITIONS: number;
    /** Breaking point detection threshold (% message loss) */
    BREAKING_POINT_THRESHOLD: number;
    /** v27.0.1: Stale lock timeout (ms) */
    STALE_LOCK_TIMEOUT_MS: number;
    /** v27.0.1: Hot standby pool size */
    HOT_STANDBY_COUNT: number;
    /** v27.0.1: Adaptive batching threshold */
    ADAPTIVE_THRESHOLD: number;
};
interface StressMetrics {
    messagesGenerated: number;
    messagesReceived: number;
    messagesLost: number;
    lossPercentage: number;
    raceConditionsDetected: number;
    workersAssassinated: number;
    workersRespawned: number;
    peakMemoryUsage: number;
    avgLatency: number;
    maxLatency: number;
    p99Latency: number;
    loadBalanceTime: number[];
    breakingPointReached: boolean;
    breakingPointWorkerCount?: number;
    throughput: number;
}
declare class SwarmStressTest {
    private eventBus;
    private sharedMemory;
    private chaos;
    private hotStandby;
    private workers;
    private metrics;
    private testStartTime;
    private loadBalanceTimes;
    constructor();
    /**
     * v27.0.1: Handle stale lock recovery with hot standby
     */
    private handleStaleLockRecovery;
    /**
     * 🚀 Run the extreme stress test
     */
    run(): Promise<StressMetrics>;
    private setupEventHandlers;
    private spawnWorkers;
    private startChaosInjection;
    private waitForCompletion;
    private collectFinalMetrics;
    private printReport;
    private getVerdict;
}
export { SwarmStressTest, STRESS_CONFIG, StressMetrics };
//# sourceMappingURL=swarm-stress-test.d.ts.map