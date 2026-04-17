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
import { WorkerInfo, WorkerPoolConfig, WorkerPoolStats } from '../types';
/**
 * Worker Pool Manager
 *
 * Manages a pool of worker threads for parallel task execution.
 * Designed for CPU-intensive operations like Ghost simulations.
 */
export declare class WorkerPoolManager extends EventEmitter {
    private workers;
    private workerInfo;
    private taskQueue;
    private activeTasks;
    private config;
    private isShuttingDown;
    private startTime;
    private tasksCompleted;
    private tasksFailed;
    private totalExecutionTime;
    private nextWorkerId;
    private thermalState;
    private estimatedTemperature;
    private throttledTasks;
    private rebalanceInterval;
    /** Used for CPU usage delta calculation */
    private _lastCpuUsage;
    constructor(config?: WorkerPoolConfig);
    /**
     * Initialize worker threads
     */
    private initializeWorkers;
    /**
     * v26.0: Start thermal monitoring and dynamic rebalancing
     */
    private startThermalMonitoring;
    /**
     * v26.0: Update thermal state based on CPU usage estimation
     */
    private updateThermalState;
    /**
     * v26.0: Dynamically rebalance workers based on thermal state and load
     */
    private rebalanceWorkers;
    /**
     * v26.0: Check if task should be throttled based on thermal state
     */
    private shouldThrottleTask;
    /**
     * Spawn a new worker thread
     */
    private spawnWorker;
    /**
     * Handle message from worker
     */
    private handleWorkerMessage;
    /**
     * Handle worker error
     */
    private handleWorkerError;
    /**
     * Handle worker exit
     */
    private handleWorkerExit;
    /**
     * Recycle a worker (terminate and respawn)
     */
    private recycleWorker;
    /**
     * Assign next task from queue to a worker
     */
    private assignNextTask;
    /**
     * Submit a task to the pool
     */
    submitTask<T = unknown, R = unknown>(type: string, payload: T, options?: {
        priority?: number;
        timeout?: number;
    }): Promise<R>;
    /**
     * Try to assign task to an idle worker
     */
    private tryAssignToIdleWorker;
    /**
     * Cancel a task
     */
    cancelTask(taskId: string): boolean;
    /**
     * Generate unique task ID
     */
    private generateTaskId;
    /**
     * Get default worker script content
     */
    private getDefaultWorkerScript;
    /**
     * Get pool statistics
     */
    getStats(): WorkerPoolStats;
    /**
     * v26.0: Get current thermal state
     */
    getThermalState(): 'cool' | 'warm' | 'hot' | 'critical';
    /**
     * v26.0: Get estimated CPU temperature
     */
    getEstimatedTemperature(): number;
    /**
     * Get worker information
     */
    getWorkerInfo(): WorkerInfo[];
    /**
     * Scale workers up or down
     */
    scale(targetCount: number): void;
    /**
     * Shutdown the pool gracefully
     */
    shutdown(graceful?: boolean): Promise<void>;
    /**
     * Check if pool is running
     */
    isRunning(): boolean;
}
/**
 * Worker thread entry point (for use in separate worker file)
 */
export declare function workerMain(): void;
export default WorkerPoolManager;
//# sourceMappingURL=worker-pool.d.ts.map