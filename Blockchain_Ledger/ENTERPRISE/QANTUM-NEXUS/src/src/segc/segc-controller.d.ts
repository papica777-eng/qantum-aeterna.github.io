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
import { GhostExecutionLayer } from './ghost/ghost-execution-layer';
import { PredictiveStatePreloader } from './predictive/state-preloader';
import { GeneticMutationEngine } from './mutations/mutation-engine';
import { HotSwapModuleLoader } from './hotswap/module-loader';
import { StateVersioningSystem } from './versioning/state-versioner';
import { SEGCConfig, SEGCStats, GhostPath, GeneticMutation, StateVersion } from './types';
/**
 * Self-Evolving Genetic Core
 *
 * The "Metabolism" of QANTUM
 * - Learns from every test execution
 * - Self-optimizes selector strategies
 * - Predicts and preloads future states
 * - Hot-swaps implementations without restart
 */
export declare class SEGCController extends EventEmitter {
    /** Configuration */
    private config;
    /** Ghost Execution Layer */
    ghost: GhostExecutionLayer;
    /** Predictive State Pre-loader */
    predictive: PredictiveStatePreloader;
    /** Genetic Mutation Engine */
    mutations: GeneticMutationEngine;
    /** Hot-Swap Module Loader */
    hotswap: HotSwapModuleLoader;
    /** State Versioning System */
    versioning: StateVersioningSystem;
    /** Start time */
    private startTime;
    /** Global stats */
    private globalStats;
    constructor(config?: SEGCConfig);
    /**
     * Setup event wiring between components
     */
    private setupEventWiring;
    /**
     * Run a learning cycle
     * Analyzes recent data and applies improvements
     */
    runLearningCycle(): Promise<{
        improvements: number;
        mutations: GeneticMutation[];
        predictions: number;
    }>;
    /**
     * Test alternative paths for a selector
     */
    testAlternativePaths(currentSelector: string, page: unknown, options?: {
        targetText?: string;
        elementType?: string;
    }): Promise<GhostPath | null>;
    /**
     * Record a test failure for mutation analysis
     */
    recordFailure(failure: {
        error: string;
        selector?: string;
        testName?: string;
    }): void;
    /**
     * Record a state change for prediction learning
     */
    recordStateChange(newState: string): void;
    /**
     * Get precomputed selector for a state
     */
    getPrecomputedSelector(stateId: string, selector: string): string[] | null;
    /**
     * Create a new strategy version
     */
    createVersion(options: {
        name: string;
        description?: string;
        strategy: object;
        isBaseline?: boolean;
    }): StateVersion;
    /**
     * Start A/B experiment
     */
    startExperiment(versionA: string, versionB: string, trafficSplit?: number): string;
    /**
     * Get current active version
     */
    getActiveVersion(): StateVersion | null;
    /**
     * Record version execution result
     */
    recordVersionResult(versionId: string, result: {
        success: boolean;
        executionTime: number;
        error?: string;
    }): void;
    /**
     * Register a module for hot-swapping
     */
    registerSwappableModule(name: string, instance: object): void;
    /**
     * Get comprehensive statistics
     */
    getStats(): SEGCStats;
    /**
     * Calculate overall fitness improvement
     */
    private calculateOverallFitness;
    /**
     * Export all knowledge
     */
    exportKnowledge(): {
        ghost: ReturnType<GhostExecutionLayer['exportKnowledge']>;
        predictive: ReturnType<PredictiveStatePreloader['exportStateMachine']>;
        mutations: ReturnType<GeneticMutationEngine['exportHistory']>;
        versioning: ReturnType<StateVersioningSystem['exportState']>;
    };
    /**
     * Import knowledge
     */
    importKnowledge(data: {
        ghost?: ReturnType<GhostExecutionLayer['exportKnowledge']>;
        predictive?: ReturnType<PredictiveStatePreloader['exportStateMachine']>;
    }): void;
    /**
     * Log message
     */
    private log;
    /**
     * Shutdown all components
     */
    shutdown(): Promise<void>;
}
export default SEGCController;
//# sourceMappingURL=segc-controller.d.ts.map