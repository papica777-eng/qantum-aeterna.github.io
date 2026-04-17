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
import { GeneticMutation, FailurePattern, MutationEngineConfig } from '../types';
/**
 * Genetic Mutation Engine
 *
 * Features:
 * - Identifies recurring failure patterns
 * - Generates code mutations to fix issues
 * - Tests mutations in ghost threads
 * - Applies successful mutations automatically
 */
export declare class GeneticMutationEngine extends EventEmitter {
    /** Configuration */
    private config;
    /** Detected failure patterns */
    private failurePatterns;
    /** Generated mutations */
    private mutations;
    /** Mutation history (for rollback) */
    private mutationHistory;
    /** Pattern signatures to mutation rules */
    private mutationRules;
    /** Statistics */
    private stats;
    /** Start time */
    private startTime;
    constructor(config?: MutationEngineConfig);
    /**
     * Initialize built-in mutation rules
     */
    private initializeMutationRules;
    /**
     * Record a test failure
     */
    recordFailure(failure: {
        error: string;
        selector?: string;
        stack?: string;
        testName?: string;
        timestamp?: Date;
    }): FailurePattern;
    /**
     * Generate signature for failure pattern
     */
    private generatePatternSignature;
    /**
     * Classify error type
     */
    private classifyError;
    /**
     * Generate mutation for a failure pattern
     */
    private generateMutationForPattern;
    /**
     * Apply a mutation
     */
    applyMutation(mutationId: string): Promise<boolean>;
    /**
     * Rollback a mutation
     */
    rollbackMutation(mutationId: string): Promise<boolean>;
    /**
     * Record mutation success/failure
     */
    recordMutationResult(mutationId: string, success: boolean): void;
    /**
     * Adjust confidence for a mutation type
     */
    private adjustMutationConfidence;
    /**
     * Simplify a selector
     */
    private simplifySelector;
    /**
     * Get pending mutations
     */
    getPendingMutations(): GeneticMutation[];
    /**
     * Get applied mutations
     */
    getAppliedMutations(): GeneticMutation[];
    /**
     * Get failure patterns
     */
    getFailurePatterns(): FailurePattern[];
    /**
     * Get mutation by ID
     */
    getMutation(mutationId: string): GeneticMutation | undefined;
    /**
     * Get statistics
     */
    getStats(): typeof this.stats & {
        patternCount: number;
        mutationCount: number;
        successRate: number;
        uptime: number;
    };
    /**
     * Add custom mutation rule
     */
    addMutationRule(errorType: string, rule: (pattern: FailurePattern) => GeneticMutation): void;
    /**
     * Export mutation history
     */
    exportHistory(): Array<{
        mutation: GeneticMutation;
        appliedAt: Date;
        rolledBack: boolean;
    }>;
    /**
     * Clear all data
     */
    clear(): void;
    /**
     * Shutdown
     */
    shutdown(): Promise<void>;
}
export default GeneticMutationEngine;
//# sourceMappingURL=mutation-engine.d.ts.map