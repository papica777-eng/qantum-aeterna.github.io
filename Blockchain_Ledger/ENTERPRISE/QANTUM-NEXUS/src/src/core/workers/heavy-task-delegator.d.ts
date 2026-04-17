/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * QAntum
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * @copyright 2025 Димитър Продромов (Dimitar Prodromov). All Rights Reserved.
 * @license PROPRIETARY AND CONFIDENTIAL
 *
 * This file is part of QAntum.
 * Unauthorized copying, modification, distribution, or use of this file,
 * via any medium, is strictly prohibited without express written permission.
 *
 * For licensing inquiries: dimitar.papazov@QAntum.dev
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'node:events';
/**
 * Task types that should be offloaded to workers
 */
export declare enum HeavyTaskType {
    /** Visual regression comparison (pixel diff) */
    VISUAL_REGRESSION = "visual-regression",
    /** Large data mining and analysis */
    DATA_MINING = "data-mining",
    /** JSON parsing of large files */
    JSON_PARSING = "json-parsing",
    /** DOM snapshot comparison */
    DOM_COMPARISON = "dom-comparison",
    /** Mutation testing in isolation */
    MUTATION_TESTING = "mutation-testing",
    /** Code analysis and metrics */
    CODE_ANALYSIS = "code-analysis",
    /** AI response processing */
    AI_PROCESSING = "ai-processing",
    /** Hash computation */
    HASH_COMPUTATION = "hash-computation",
    /** Compression/decompression */
    COMPRESSION = "compression",
    /** Custom task */
    CUSTOM = "custom"
}
/**
 * Heavy task definition
 */
export interface HeavyTask<TInput = unknown, TOutput = unknown> {
    /** Unique task ID */
    id: string;
    /** Task type */
    type: HeavyTaskType;
    /** Input data for the task */
    input: TInput;
    /** Priority (higher = more urgent) */
    priority?: number;
    /** Timeout in milliseconds */
    timeout?: number;
    /** Callback for progress updates */
    onProgress?: (progress: number, message?: string) => void;
}
/**
 * Task result
 */
export interface TaskResult<T = unknown> {
    /** Task ID */
    taskId: string;
    /** Whether task succeeded */
    success: boolean;
    /** Result data */
    result?: T;
    /** Error if failed */
    error?: string;
    /** Execution time in ms */
    executionTime: number;
    /** Worker ID that processed the task */
    workerId: number;
}
/**
 * Worker info
 */
export interface WorkerInfo {
    id: number;
    threadId: number;
    status: 'idle' | 'busy' | 'starting' | 'error';
    currentTask?: string;
    tasksCompleted: number;
    totalExecutionTime: number;
    lastActive: Date;
}
/**
 * Delegator configuration
 */
export interface DelegatorConfig {
    /** Minimum number of workers */
    minWorkers?: number;
    /** Maximum number of workers */
    maxWorkers?: number;
    /** Auto-scale based on queue */
    autoScale?: boolean;
    /** Task timeout default (ms) */
    defaultTimeout?: number;
    /** Max queue size before rejecting */
    maxQueueSize?: number;
}
/**
 * Task handler interface
 */
export interface TaskHandler<TInput = unknown, TOutput = unknown> {
    execute(input: TInput, reportProgress: (progress: number, message?: string) => void): Promise<TOutput>;
}
/**
 * 🧵 Heavy Task Delegator
 *
 * Manages a pool of worker threads for CPU-intensive operations.
 * Automatically scales workers based on load.
 */
export declare class HeavyTaskDelegator extends EventEmitter {
    private config;
    private workers;
    private workerInfo;
    private taskQueue;
    private nextWorkerId;
    private startTime;
    constructor(config?: DelegatorConfig);
    /**
     * Initialize worker pool
     */
    private initializeWorkers;
    /**
     * Spawn a new worker
     */
    private spawnWorker;
    /**
     * Handle messages from workers
     */
    private handleWorkerMessage;
    /**
     * Handle worker errors
     */
    private handleWorkerError;
    /**
     * Handle worker exit
     */
    private handleWorkerExit;
    /**
     * Submit a heavy task for processing
     * @param task - Task to execute
     * @returns Promise resolving to task result
     */
    submit<TInput, TOutput>(task: HeavyTask<TInput, TOutput>): Promise<TaskResult<TOutput>>;
    /**
     * Process the task queue
     */
    private processQueue;
    /**
     * Get delegator statistics
     */
    getStats(): {
        totalWorkers: number;
        idleWorkers: number;
        busyWorkers: number;
        queueSize: number;
        totalTasksCompleted: number;
        avgExecutionTime: number;
        uptime: number;
    };
    /**
     * Get worker information
     */
    getWorkerInfo(): WorkerInfo[];
    /**
     * Scale workers up
     * @param count - Number of workers to add
     */
    scaleUp(count?: number): void;
    /**
     * Scale workers down
     * @param count - Number of workers to remove
     */
    scaleDown(count?: number): void;
    /**
     * Shutdown all workers
     * @param graceful - Wait for tasks to complete
     */
    shutdown(graceful?: boolean): Promise<void>;
}
export default HeavyTaskDelegator;
//# sourceMappingURL=heavy-task-delegator.d.ts.map