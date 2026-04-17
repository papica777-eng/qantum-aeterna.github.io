/**
 * 🐝 THE SWARM - Distributed Test Orchestrator
 *
 * Orchestrates test execution across multiple serverless functions
 * for massive parallelization.
 *
 * Supports:
 * - AWS Lambda
 * - Google Cloud Functions
 * - Azure Functions
 * - Local Docker containers
 *
 * @version 27.0.1 "Indestructible"
 * @phase 76-78 + Deep Kernel Optimization
 *
 * v27.0.1 Optimizations:
 * - Adaptive Batching (auto-scale flush interval based on msg/sec)
 * - Stale Lock Watchdog (200ms timeout + force release)
 * - Hot-Standby Worker Pool (5% pre-warmed for <100ms failover)
 * - V8 Hidden Classes (monomorphic message objects for reduced GC)
 */
import { EventEmitter } from 'events';
interface SwarmConfig {
    provider: 'aws-lambda' | 'gcp-functions' | 'azure-functions' | 'local-docker';
    region: string;
    functionName: string;
    maxConcurrency: number;
    timeout: number;
    memoryMB: number;
    credentials?: {
        accessKeyId?: string;
        secretAccessKey?: string;
        projectId?: string;
        keyFilename?: string;
    };
    batchingEnabled?: boolean;
    batchFlushInterval?: number;
    batchMaxSize?: number;
    useSharedMemory?: boolean;
    adaptiveBatching?: boolean;
    adaptiveThreshold?: number;
    staleLockTimeout?: number;
    hotStandbyPercent?: number;
    enableV8Optimizations?: boolean;
}
interface TestTask {
    id: string;
    testFile: string;
    testName?: string;
    config: Record<string, any>;
    priority: number;
    retryCount: number;
}
interface TaskResult {
    taskId: string;
    workerId: string;
    status: 'passed' | 'failed' | 'error' | 'timeout';
    duration: number;
    output?: unknown;
    error?: string;
    metrics: {
        memoryUsed: number;
        cpuTime: number;
    };
}
interface SwarmStatus {
    id: string;
    startTime: number;
    endTime?: number;
    totalTasks: number;
    completedTasks: number;
    passedTasks: number;
    failedTasks: number;
    activeWorkers: number;
    estimatedTimeRemaining: number;
}
interface WorkerStatusUpdate {
    workerId: string;
    taskId?: string;
    status: 'heartbeat' | 'task-start' | 'task-complete' | 'task-error';
    data?: Record<string, any>;
}
export declare class SwarmOrchestrator extends EventEmitter {
    private config;
    private taskQueue;
    private activeWorkers;
    private results;
    private swarmId;
    private status;
    private eventBus;
    private sharedMemory;
    private batchQueue;
    private workerIndexMap;
    private messagePool;
    private hotStandbyPool;
    private lastWorkerIndex;
    constructor(config?: Partial<SwarmConfig>);
    /**
     * v27.0.1: Handle stale lock release - trigger instant failover
     */
    private handleStaleLockRelease;
    /**
     * v27.0.1: Deploy a standby worker (pre-warmed)
     */
    private deployStandbyWorker;
    /**
     * v27.0.0: Process batched worker updates efficiently
     */
    private processBatchUpdate;
    /**
     * v27.0.1: Optimized status broadcast with message pooling
     */
    broadcastWorkerStatus(workerId: string, status: WorkerStatusUpdate['status'], data?: Record<string, any>): void;
    private updateWorkerHeartbeat;
    /**
     * v27.0.0: Get aggregated metrics from shared memory (fast path)
     */
    getAggregatedMetrics(): {
        totalCompleted: number;
        avgDuration: number;
        activeCount: number;
    };
    /**
     * Execute tests in swarm mode
     */
    executeSwarm(tasks: TestTask[]): Promise<SwarmStatus>;
    /**
     * Get real-time swarm status
     */
    getStatus(): SwarmStatus;
    /**
     * Get all results
     */
    getResults(): TaskResult[];
    /**
     * Cancel swarm execution
     */
    cancel(): Promise<void>;
    private deployWorkers;
    private deployWorker;
    private deployLambdaWorker;
    private deployGCPWorker;
    private deployAzureWorker;
    private deployDockerWorker;
    /**
     * Worker execution loop (simulated for local testing)
     */
    private runWorkerLoop;
    /**
     * Execute a single test task
     */
    private executeTask;
    private terminateWorker;
    private initializeStatus;
    private prioritizeTasks;
    private updateEstimatedTime;
    private waitForCompletion;
    private sleep;
}
export declare class SwarmTaskBuilder {
    private tasks;
    /**
     * Add test files to swarm
     */
    addTestFiles(files: string[], priority?: number): this;
    /**
     * Add specific test
     */
    addTest(testFile: string, testName: string, priority?: number): this;
    /**
     * Add Ghost Protocol API tests
     */
    addGhostTests(ghostDir: string, priority?: number): this;
    /**
     * Add Pre-Cog predicted tests
     */
    addPreCogTests(predictions: Array<{
        testFile: string;
        testName: string;
        failureProbability: number;
    }>): this;
    /**
     * Build task array
     */
    build(): TestTask[];
}
export declare function runSwarm(testDir: string, config?: Partial<SwarmConfig>): Promise<SwarmStatus>;
export {};
//# sourceMappingURL=swarm-orchestrator.d.ts.map