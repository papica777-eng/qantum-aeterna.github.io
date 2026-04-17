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
 * CPU core metrics
 */
export interface CoreMetrics {
    id: number;
    model: string;
    speed: number;
    times: {
        user: number;
        nice: number;
        sys: number;
        idle: number;
        irq: number;
    };
    usage: number;
}
/**
 * System metrics snapshot
 */
export interface SystemMetrics {
    timestamp: number;
    cpu: {
        model: string;
        cores: number;
        threads: number;
        speed: number;
        usage: number;
        perCore: CoreMetrics[];
        temperature?: number;
    };
    memory: {
        total: number;
        used: number;
        free: number;
        usagePercent: number;
        heapUsed: number;
        heapTotal: number;
        external: number;
    };
    system: {
        platform: string;
        arch: string;
        uptime: number;
        loadAvg: number[];
    };
}
/**
 * Throttling configuration
 */
export interface ThrottleConfig {
    /** CPU threshold to trigger throttling (0-100) */
    cpuThreshold: number;
    /** Memory threshold to trigger throttling (0-100) */
    memoryThreshold: number;
    /** Delay to add when throttled (ms) */
    throttleDelay: number;
    /** Minimum workers to maintain */
    minWorkers: number;
    /** Maximum workers allowed */
    maxWorkers: number;
    /** Check interval (ms) */
    checkInterval: number;
    /** Cool-down period after throttle (ms) */
    cooldownPeriod: number;
}
/**
 * Worker pool status
 */
export interface WorkerPoolStatus {
    activeWorkers: number;
    maxWorkers: number;
    queueLength: number;
    completedTasks: number;
    throttled: boolean;
}
/**
 * Task for worker distribution
 */
export interface WorkerTask<T = unknown> {
    id: string;
    type: string;
    data: T;
    priority: 'high' | 'normal' | 'low';
    createdAt: number;
}
/**
 * ⚡ HardwareTelemetry - System Monitoring Engine
 *
 * Provides real-time monitoring of CPU, memory, and system metrics.
 * Automatically throttles workload when system resources are strained.
 */
export declare class HardwareTelemetry extends EventEmitter {
    private lastCpuInfo;
    private lastCpuTime;
    private monitoringInterval;
    private metricsHistory;
    private maxHistoryLength;
    private throttleConfig;
    private isThrottled;
    private lastThrottleTime;
    private throttleCount;
    private workerPool;
    private taskQueue;
    private completedTasks;
    constructor(config?: Partial<ThrottleConfig>);
    /**
     * Start monitoring system resources
     */
    startMonitoring(): void;
    /**
     * Stop monitoring
     */
    stopMonitoring(): void;
    /**
     * Collect current system metrics
     */
    collectMetrics(): SystemMetrics;
    /**
     * Check if throttling is needed
     */
    private checkThrottling;
    /**
     * Scale worker pool up or down
     */
    private scaleWorkers;
    /**
     * Get throttle delay if throttled
     */
    getThrottleDelay(): number;
    /**
     * Check if system is throttled
     */
    isSystemThrottled(): boolean;
    /**
     * Add task to queue with priority handling
     */
    queueTask<T>(task: WorkerTask<T>): void;
    /**
     * Get next task from queue
     */
    getNextTask(): WorkerTask | undefined;
    /**
     * Get worker pool status
     */
    getWorkerPoolStatus(): WorkerPoolStatus;
    /**
     * Get metrics history
     */
    getMetricsHistory(): SystemMetrics[];
    /**
     * Get average metrics over time period
     */
    getAverageMetrics(periodMs?: number): {
        avgCpuUsage: number;
        avgMemoryUsage: number;
        peakCpuUsage: number;
        peakMemoryUsage: number;
        throttleEvents: number;
    };
    /**
     * Generate performance report
     */
    generateReport(): string;
    /**
     * Get ASCII usage bar
     */
    private getUsageBar;
    /**
     * Format bytes to human readable
     */
    private formatBytes;
    /**
     * Format uptime to human readable
     */
    private formatUptime;
    /**
     * Update throttle configuration
     */
    updateConfig(config: Partial<ThrottleConfig>): void;
    /**
     * Get current configuration
     */
    getConfig(): ThrottleConfig;
}
export declare const hardwareTelemetry: HardwareTelemetry;
//# sourceMappingURL=hardware-telemetry.d.ts.map