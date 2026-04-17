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
 * For licensing inquiries: dimitar.prodromov@QAntum.dev
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
/**
 * Soldier task types
 */
export type SoldierTaskType = 'semantic-analysis' | 'dom-inspection' | 'visual-diff' | 'api-validation' | 'accessibility-audit' | 'performance-metric' | 'security-scan' | 'regression-check';
/**
 * Task priority levels
 */
export type TaskPriority = 'critical' | 'high' | 'normal' | 'low' | 'background';
/**
 * Task for soldiers
 */
export interface SoldierTask {
    id: string;
    type: SoldierTaskType;
    priority: TaskPriority;
    payload: unknown;
    createdAt: number;
    deadline?: number;
    retries: number;
    maxRetries: number;
}
/**
 * Task result from soldier
 */
export interface TaskResult {
    taskId: string;
    soldierId: number;
    success: boolean;
    result?: unknown;
    error?: string;
    executionTime: number;
    memoryUsed: number;
}
/**
 * Soldier status
 */
export interface SoldierStatus {
    id: number;
    threadId: number;
    status: 'idle' | 'busy' | 'cooldown' | 'terminated';
    currentTask: string | null;
    tasksCompleted: number;
    tasksFailed: number;
    avgExecutionTime: number;
    lastActive: number;
}
/**
 * Commander strategy
 */
export interface SwarmStrategy {
    name: string;
    description: string;
    maxConcurrency: number;
    priorityWeights: Record<TaskPriority, number>;
    taskDistribution: 'round-robin' | 'load-balanced' | 'priority-first' | 'thermal-aware';
    thermalConfig: ThermalConfig;
}
/**
 * Thermal throttling configuration
 */
export interface ThermalConfig {
    /** Temperature to start throttling (°C) */
    throttleTemp: number;
    /** Temperature to enter critical mode (°C) */
    criticalTemp: number;
    /** Temperature to unlock full power (°C) */
    coolTemp: number;
    /** Max soldiers when cool */
    maxSoldiersCool: number;
    /** Min soldiers when hot */
    minSoldiersHot: number;
    /** Check interval (ms) */
    checkInterval: number;
}
/**
 * Swarm metrics
 */
export interface SwarmMetrics {
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    avgExecutionTime: number;
    throughput: number;
    activeSoldiers: number;
    queueLength: number;
    thermalState: 'cool' | 'warm' | 'hot' | 'critical';
    estimatedTemperature: number;
}
export declare class Soldier {
    readonly id: number;
    threadId: number;
    status: SoldierStatus['status'];
    private currentTask;
    private tasksCompleted;
    private tasksFailed;
    private totalExecutionTime;
    private lastActive;
    constructor(id: number);
    /**
     * Execute a task
     */
    execute(task: SoldierTask): Promise<TaskResult>;
    /**
     * Process task based on type
     */
    private processTask;
    /**
     * Get soldier status
     */
    getStatus(): SoldierStatus;
    /**
     * Enter cooldown mode
     */
    enterCooldown(): void;
    /**
     * Resume from cooldown
     */
    resume(): void;
    /**
     * Terminate soldier
     */
    terminate(): void;
}
export declare class SwarmCommander extends EventEmitter {
    private soldiers;
    private taskQueue;
    private activeCount;
    private strategy;
    private metrics;
    private thermalMonitorInterval;
    private isRunning;
    private nextTaskId;
    private currentTemperature;
    private thermalState;
    constructor(strategy?: Partial<SwarmStrategy>);
    /**
     * Initialize the swarm
     */
    initialize(): Promise<void>;
    /**
     * Shutdown the swarm
     */
    shutdown(): Promise<void>;
    /**
     * Spawn a new soldier
     */
    private spawnSoldier;
    /**
     * Terminate a soldier
     */
    private terminateSoldier;
    /**
     * Scale soldiers based on thermal state
     */
    private scaleSoldiers;
    /**
     * Calculate optimal soldier count based on thermal state
     */
    private calculateOptimalSoldierCount;
    /**
     * Start thermal monitoring
     */
    private startThermalMonitoring;
    /**
     * Update thermal state (simulated based on CPU usage)
     */
    private updateThermalState;
    /**
     * Set temperature manually (for testing or external sensors)
     */
    setTemperature(temp: number): void;
    /**
     * Submit a task to the swarm
     */
    submitTask(type: SoldierTaskType, payload: unknown, options?: {
        priority?: TaskPriority;
        deadline?: number;
    }): Promise<string>;
    /**
     * Submit multiple tasks
     */
    submitBatch(tasks: Array<{
        type: SoldierTaskType;
        payload: unknown;
        priority?: TaskPriority;
    }>): Promise<string[]>;
    /**
     * Insert task by priority
     */
    private insertTaskByPriority;
    /**
     * Dispatch tasks to available soldiers
     */
    private dispatchTasks;
    /**
     * Handle task result
     */
    private handleTaskResult;
    /**
     * Update average execution time
     */
    private updateAvgExecutionTime;
    /**
     * Get swarm metrics
     */
    getMetrics(): SwarmMetrics;
    /**
     * Get all soldier statuses
     */
    getSoldierStatuses(): SoldierStatus[];
    /**
     * Get current strategy
     */
    getStrategy(): SwarmStrategy;
    /**
     * Update thermal config
     */
    updateThermalConfig(config: Partial<ThermalConfig>): void;
    /**
     * Get queue length
     */
    getQueueLength(): number;
    /**
     * Check if running
     */
    isSwarmRunning(): boolean;
}
export default SwarmCommander;
//# sourceMappingURL=swarm-commander.d.ts.map