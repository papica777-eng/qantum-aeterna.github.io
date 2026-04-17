/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: TASK QUEUE SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Enterprise task queue with Bull/BullMQ for reliable job processing
 * Supports parallel workers, priorities, retries, and rate limiting
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export type JobStatus = 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'paused';
export type JobPriority = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export interface QueueConfig {
    name: string;
    redis?: {
        host: string;
        port: number;
        password?: string;
        db?: number;
    };
    defaultJobOptions?: JobOptions;
    limiter?: {
        max: number;
        duration: number;
    };
    settings?: {
        lockDuration?: number;
        stalledInterval?: number;
        maxStalledCount?: number;
    };
}
export interface JobOptions {
    priority?: JobPriority;
    delay?: number;
    attempts?: number;
    backoff?: {
        type: 'fixed' | 'exponential';
        delay: number;
    };
    timeout?: number;
    removeOnComplete?: boolean | number;
    removeOnFail?: boolean | number;
    lifo?: boolean;
    jobId?: string;
    repeatOptions?: {
        cron?: string;
        every?: number;
        limit?: number;
        startDate?: Date;
        endDate?: Date;
        tz?: string;
    };
}
export interface Job<T = any> {
    id: string;
    name: string;
    data: T;
    status: JobStatus;
    progress: number;
    attempts: number;
    maxAttempts: number;
    createdAt: Date;
    processedAt?: Date;
    finishedAt?: Date;
    failedReason?: string;
    returnValue?: any;
    opts: JobOptions;
}
export interface WorkerOptions {
    concurrency?: number;
    lockDuration?: number;
    limiter?: {
        max: number;
        duration: number;
    };
}
export interface QueueStats {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    paused: number;
}
export declare class InMemoryQueue<T = any> extends EventEmitter {
    private jobs;
    private waitingQueue;
    private activeJobs;
    private delayedJobs;
    private config;
    private isProcessing;
    private processor;
    private concurrency;
    private jobCounter;
    constructor(config: QueueConfig);
    /**
     * Add job to queue
     */
    add(name: string, data: T, opts?: JobOptions): Promise<Job<T>>;
    /**
     * Add bulk jobs
     */
    addBulk(jobs: Array<{
        name: string;
        data: T;
        opts?: JobOptions;
    }>): Promise<Job<T>[]>;
    /**
     * Process jobs with handler
     */
    process(concurrency: number, processor: (job: Job<T>) => Promise<any>): void;
    process(processor: (job: Job<T>) => Promise<any>): void;
    /**
     * Process next jobs
     */
    private processNext;
    /**
     * Sort waiting queue by priority
     */
    private sortByPriority;
    /**
     * Create timeout promise
     */
    private createTimeout;
    /**
     * Get job by ID
     */
    getJob(jobId: string): Promise<Job<T> | undefined>;
    /**
     * Get jobs by status
     */
    getJobs(status: JobStatus | JobStatus[], start?: number, end?: number): Promise<Job<T>[]>;
    /**
     * Get queue statistics
     */
    getStats(): Promise<QueueStats>;
    /**
     * Pause queue
     */
    pause(): Promise<void>;
    /**
     * Resume queue
     */
    resume(): Promise<void>;
    /**
     * Remove job
     */
    remove(jobId: string): Promise<void>;
    /**
     * Clean old jobs
     */
    clean(grace: number, status?: JobStatus): Promise<Job<T>[]>;
    /**
     * Empty queue
     */
    empty(): Promise<void>;
    /**
     * Close queue
     */
    close(): Promise<void>;
}
export declare class TaskQueueManager extends EventEmitter {
    private queues;
    private defaultConfig;
    constructor(defaultConfig?: Partial<QueueConfig>);
    /**
     * Create or get queue
     */
    getQueue<T = any>(name: string, config?: Partial<QueueConfig>): InMemoryQueue<T>;
    /**
     * Get all queue stats
     */
    getAllStats(): Promise<Record<string, QueueStats>>;
    /**
     * Pause all queues
     */
    pauseAll(): Promise<void>;
    /**
     * Resume all queues
     */
    resumeAll(): Promise<void>;
    /**
     * Close all queues
     */
    closeAll(): Promise<void>;
}
export interface RateLimiterConfig {
    maxRequests: number;
    windowMs: number;
    keyPrefix?: string;
}
export declare class RateLimiter {
    private config;
    private requests;
    constructor(config: RateLimiterConfig);
    /**
     * Check if request is allowed
     */
    isAllowed(key: string): Promise<boolean>;
    /**
     * Wait until request is allowed
     */
    waitForSlot(key: string, timeout?: number): Promise<boolean>;
    /**
     * Get remaining requests
     */
    getRemainingRequests(key: string): number;
    /**
     * Reset key
     */
    reset(key: string): void;
    /**
     * Clear all
     */
    clear(): void;
}
export interface WorkerPoolConfig {
    minWorkers: number;
    maxWorkers: number;
    idleTimeout?: number;
    taskTimeout?: number;
}
export interface WorkerTask<I, O> {
    id: string;
    input: I;
    resolve: (output: O) => void;
    reject: (error: Error) => void;
}
export declare class WorkerPool<I = any, O = any> extends EventEmitter {
    private config;
    private workers;
    private idleWorkers;
    private taskQueue;
    private processor;
    private workerIdCounter;
    private idleTimers;
    private isShuttingDown;
    constructor(config: WorkerPoolConfig);
    /**
     * Set processor function
     */
    setProcessor(processor: (input: I) => Promise<O>): void;
    /**
     * Execute task
     */
    execute(input: I): Promise<O>;
    /**
     * Execute multiple tasks
     */
    executeAll(inputs: I[]): Promise<O[]>;
    /**
     * Execute tasks with concurrency limit
     */
    executeBatch(inputs: I[], concurrency?: number): Promise<O[]>;
    /**
     * Create new worker
     */
    private createWorker;
    /**
     * Remove worker
     */
    private removeWorker;
    /**
     * Process task queue
     */
    private processQueue;
    /**
     * Return worker to idle pool
     */
    private returnWorker;
    /**
     * Get pool stats
     */
    getStats(): {
        totalWorkers: number;
        idleWorkers: number;
        busyWorkers: number;
        pendingTasks: number;
    };
    /**
     * Shutdown pool
     */
    shutdown(force?: boolean): Promise<void>;
}
export declare function createQueue<T = any>(name: string, config?: Partial<QueueConfig>): InMemoryQueue<T>;
export declare function createWorkerPool<I, O>(config: WorkerPoolConfig): WorkerPool<I, O>;
export declare function createRateLimiter(config: RateLimiterConfig): RateLimiter;
export default TaskQueueManager;
//# sourceMappingURL=TaskQueue.d.ts.map