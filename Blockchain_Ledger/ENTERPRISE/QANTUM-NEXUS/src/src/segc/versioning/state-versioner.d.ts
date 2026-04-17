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
import { EventEmitter } from 'events';
import { StateVersion, StateVersionConfig } from '../types';
/**
 * Version Performance Metrics
 */
interface VersionMetrics {
    successCount: number;
    failureCount: number;
    totalExecutions: number;
    avgExecutionTime: number;
    lastExecutedAt: Date;
    errorMessages: string[];
}
/**
 * State Versioning System
 *
 * Features:
 * - Multiple strategy versions running in parallel
 * - Automatic winner selection based on metrics
 * - Gradual rollout with traffic splitting
 * - Rollback capability
 */
export declare class StateVersioningSystem extends EventEmitter {
    /** Configuration */
    private config;
    /** Registered versions */
    private versions;
    /** Version metrics */
    private metrics;
    /** Active version ID */
    private activeVersionId;
    /** Baseline version ID */
    private baselineVersionId;
    /** Traffic allocation */
    private trafficAllocation;
    /** Experiment history */
    private experiments;
    /** Statistics */
    private stats;
    /** Start time */
    private startTime;
    constructor(config?: StateVersionConfig);
    /**
     * Create a new version
     */
    createVersion(options: {
        name: string;
        description?: string;
        strategy: object;
        isBaseline?: boolean;
    }): StateVersion;
    /**
     * Create empty metrics object
     */
    private createEmptyMetrics;
    /**
     * Activate a version
     */
    activateVersion(versionId: string): boolean;
    /**
     * Start an A/B experiment
     */
    startExperiment(versionAId: string, versionBId: string, trafficSplit?: number): string;
    /**
     * Get version to use (based on traffic allocation)
     */
    selectVersion(): StateVersion | null;
    /**
     * Record execution result
     */
    recordResult(versionId: string, result: {
        success: boolean;
        executionTime: number;
        error?: string;
    }): void;
    /**
     * Check if any experiment can be concluded
     */
    private checkExperimentConclusion;
    /**
     * Simple statistical significance test
     */
    private isStatisticallySignificant;
    /**
     * Conclude an experiment
     */
    concludeExperiment(experimentId: string, winnerId: string): void;
    /**
     * Rollback to baseline
     */
    rollbackToBaseline(): boolean;
    /**
     * Get version by ID
     */
    getVersion(versionId: string): StateVersion | undefined;
    /**
     * Get version metrics
     */
    getVersionMetrics(versionId: string): VersionMetrics | undefined;
    /**
     * Get all versions
     */
    getAllVersions(): StateVersion[];
    /**
     * Get active versions
     */
    getActiveVersions(): StateVersion[];
    /**
     * Get experiment by ID
     */
    getExperiment(experimentId: string): {
        id: string;
        versionA: string;
        versionB: string;
        startedAt: Date;
        endedAt?: Date;
        winner?: string;
        metrics: {
            versionA: VersionMetrics;
            versionB: VersionMetrics;
        };
    };
    /**
     * Get all experiments
     */
    getExperiments(): {
        id: string;
        versionA: string;
        versionB: string;
        startedAt: Date;
        endedAt?: Date;
        winner?: string;
        metrics: {
            versionA: VersionMetrics;
            versionB: VersionMetrics;
        };
    }[];
    /**
     * Get statistics
     */
    getStats(): typeof this.stats & {
        versionCount: number;
        activeVersionCount: number;
        activeExperiments: number;
        uptime: number;
    };
    /**
     * Export state
     */
    exportState(): {
        versions: StateVersion[];
        metrics: Array<{
            versionId: string;
            metrics: VersionMetrics;
        }>;
        experiments: Array<{
            id: string;
            versionA: string;
            versionB: string;
            startedAt: Date;
            endedAt?: Date;
            winner?: string;
            metrics: {
                versionA: VersionMetrics;
                versionB: VersionMetrics;
            };
        }>;
        activeVersionId: string | null;
        baselineVersionId: string | null;
    };
    /**
     * Clear all
     */
    clear(): void;
    /**
     * Shutdown
     */
    shutdown(): Promise<void>;
}
export default StateVersioningSystem;
//# sourceMappingURL=state-versioner.d.ts.map