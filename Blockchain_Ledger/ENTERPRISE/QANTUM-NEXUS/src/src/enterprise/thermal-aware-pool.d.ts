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
import { HardwareTelemetry, SystemMetrics } from '../telemetry/hardware-telemetry';
/**
 * Thermal throttling configuration
 */
export interface ThermalThrottleConfig {
    /** Temperature threshold to start throttling (°C) */
    throttleThreshold: number;
    /** Critical temperature to enter emergency mode (°C) */
    criticalThreshold: number;
    /** Cool temperature to unlock full power (°C) */
    coolThreshold: number;
    /** Maximum concurrent instances when cool */
    maxInstancesCool: number;
    /** Minimum concurrent instances when hot */
    minInstancesHot: number;
    /** Temperature check interval (ms) */
    checkInterval: number;
    /** Enable dynamic scaling */
    enableDynamicScaling: boolean;
}
/**
 * Throttle state
 */
export type ThrottleState = 'cool' | 'warm' | 'hot' | 'critical' | 'emergency';
/**
 * Throttle event
 */
export interface ThrottleEvent {
    previousState: ThrottleState;
    newState: ThrottleState;
    temperature: number;
    recommendedConcurrency: number;
    timestamp: number;
}
/**
 * Pool metrics
 */
export interface ThermalPoolMetrics {
    currentTemperature: number;
    state: ThrottleState;
    currentConcurrency: number;
    maxConcurrency: number;
    queueLength: number;
    completedTasks: number;
    throttleCount: number;
    avgTaskTime: number;
}
export declare class ThermalAwarePool extends EventEmitter {
    private config;
    private telemetry;
    private currentState;
    private currentTemperature;
    private currentConcurrency;
    private monitorInterval;
    private throttleCount;
    private completedTasks;
    private totalTaskTime;
    private taskQueue;
    private activeWorkers;
    constructor(config?: Partial<ThermalThrottleConfig>);
    /**
     * Start thermal monitoring
     */
    start(): void;
    /**
     * Stop thermal monitoring
     */
    stop(): void;
    /**
     * Handle telemetry metrics
     */
    private handleMetrics;
    /**
     * Calculate thermal state from temperature
     */
    private calculateState;
    /**
     * Adjust concurrency based on thermal state
     */
    private adjustConcurrency;
    /**
     * Set temperature manually (for testing or external sensors)
     */
    setTemperature(temp: number): void;
    /**
     * Execute task with thermal-aware throttling
     */
    execute<T>(task: () => Promise<T>): Promise<T>;
    /**
     * Execute batch of tasks with thermal-aware concurrency
     */
    executeBatch<T>(tasks: Array<() => Promise<T>>): Promise<T[]>;
    /**
     * Process task queue
     */
    private processQueue;
    /**
     * Get current metrics
     */
    getMetrics(): ThermalPoolMetrics;
    /**
     * Get current state
     */
    getState(): ThrottleState;
    /**
     * Get current concurrency limit
     */
    getConcurrency(): number;
    /**
     * Get temperature
     */
    getTemperature(): number;
    /**
     * Get configuration
     */
    getConfig(): ThermalThrottleConfig;
    /**
     * Update configuration
     */
    updateConfig(config: Partial<ThermalThrottleConfig>): void;
    /**
     * Force concurrency (override thermal scaling)
     */
    forceConcurrency(concurrency: number): void;
    /**
     * Get queue length
     */
    getQueueLength(): number;
    /**
     * Check if throttling is active
     */
    isThrottling(): boolean;
}
export { HardwareTelemetry, SystemMetrics };
export default ThermalAwarePool;
//# sourceMappingURL=thermal-aware-pool.d.ts.map