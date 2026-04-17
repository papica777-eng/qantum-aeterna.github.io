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
import { HealthCheckResult, SystemHealth } from '../types';
/**
 * Health check function type
 */
export type HealthCheckFn = () => Promise<HealthCheckResult>;
/**
 * Alert severity levels
 */
export type AlertSeverity = 'info' | 'warning' | 'critical';
/**
 * Alert configuration
 */
export interface AlertConfig {
    /** Enable alerting */
    enabled: boolean;
    /** Memory threshold (0-1) */
    memoryThreshold: number;
    /** CPU threshold (0-1) */
    cpuThreshold: number;
    /** Consecutive failures before alert */
    failureThreshold: number;
    /** Alert callback */
    onAlert?: (alert: HealthAlert) => void;
}
/**
 * Health alert
 */
export interface HealthAlert {
    /** Alert ID */
    id: string;
    /** Severity */
    severity: AlertSeverity;
    /** Source module */
    module: string;
    /** Alert message */
    message: string;
    /** Timestamp */
    timestamp: Date;
    /** Auto-resolved */
    resolved: boolean;
    /** Resolution time */
    resolvedAt?: Date;
}
/**
 * Health history entry
 */
export interface HealthHistoryEntry {
    /** Timestamp */
    timestamp: Date;
    /** Overall healthy */
    healthy: boolean;
    /** Module count */
    moduleCount: number;
    /** Healthy modules */
    healthyModules: number;
    /** Memory usage ratio */
    memoryUsage: number;
    /** CPU usage ratio */
    cpuUsage: number;
}
/**
 * Health Check System Configuration
 */
export interface HealthCheckConfig {
    /** Enable health checks */
    enabled?: boolean;
    /** Check interval in ms */
    interval?: number;
    /** History retention count */
    historyRetention?: number;
    /** Alert configuration */
    alerts?: Partial<AlertConfig>;
}
/**
 * Health Check System
 *
 * Monitors health of all QANTUM modules.
 */
export declare class HealthCheckSystem extends EventEmitter {
    private config;
    private alertConfig;
    private checks;
    private lastResults;
    private consecutiveFailures;
    private alerts;
    private history;
    private checkInterval?;
    private lastCpuInfo;
    private startTime;
    private checksPerformed;
    constructor(config?: HealthCheckConfig);
    /**
     * Register built-in health checks
     */
    private registerBuiltinChecks;
    /**
     * Get CPU usage
     */
    private getCpuUsage;
    /**
     * Register a health check
     * @param name - Check name
     * @param checkFn - Check function
     */
    register(name: string, checkFn: HealthCheckFn): void;
    /**
     * Unregister a health check
     * @param name - Check name
     */
    unregister(name: string): boolean;
    /**
     * Start health check monitoring
     */
    start(): void;
    /**
     * Stop health check monitoring
     */
    stop(): void;
    /**
     * Run all health checks
     */
    runAllChecks(): Promise<HealthCheckResult[]>;
    /**
     * Run a single health check
     */
    private runCheck;
    /**
     * Create an alert
     */
    private createAlert;
    /**
     * Try to resolve an alert
     */
    private tryResolveAlert;
    /**
     * Determine alert severity
     */
    private determineSeverity;
    /**
     * Update health history
     */
    private updateHistory;
    /**
     * Get current health status
     */
    getHealth(): Promise<SystemHealth>;
    /**
     * Get last results
     */
    getLastResults(): HealthCheckResult[];
    /**
     * Get active alerts
     */
    getActiveAlerts(): HealthAlert[];
    /**
     * Get all alerts
     */
    getAllAlerts(): HealthAlert[];
    /**
     * Get health history
     */
    getHistory(): HealthHistoryEntry[];
    /**
     * Get health trend
     */
    getHealthTrend(): {
        trend: 'improving' | 'stable' | 'degrading';
        avgHealth: number;
        avgMemory: number;
        avgCpu: number;
    };
    /**
     * Get statistics
     */
    getStats(): {
        checksPerformed: number;
        registeredChecks: number;
        activeAlerts: number;
        historyEntries: number;
        uptime: number;
    };
    /**
     * Check if running
     */
    isRunning(): boolean;
    /**
     * Shutdown
     */
    shutdown(): void;
}
export default HealthCheckSystem;
//# sourceMappingURL=health-check.d.ts.map