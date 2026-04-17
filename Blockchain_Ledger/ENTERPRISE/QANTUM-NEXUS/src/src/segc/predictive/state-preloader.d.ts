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
import { PredictedState, PrecomputedSelector, StateTransition, PredictiveConfig } from '../types';
/**
 * Predictive State Pre-loader
 *
 * Features:
 * - Learns state transitions from test history
 * - Precomputes future selectors
 * - Caches DOM snapshots for instant access
 * - Reduces test execution time by ~40%
 */
export declare class PredictiveStatePreloader extends EventEmitter {
    /** Configuration */
    private config;
    /** State transition graph (current state → next states with probability) */
    private transitionGraph;
    /** Precomputed selector cache */
    private selectorCache;
    /** DOM snapshot cache */
    private domCache;
    /** Current state tracking */
    private currentState;
    private stateHistory;
    /** Pending predictions */
    private pendingPredictions;
    /** Statistics */
    private stats;
    /** Start time */
    private startTime;
    constructor(config?: PredictiveConfig);
    /**
     * Learn a state transition
     * Call this whenever a state change is observed
     */
    learnTransition(fromState: string, toState: string, transitionTime: number): void;
    /**
     * Normalize probabilities so they sum to 1
     */
    private normalizeTransitionProbabilities;
    /**
     * Record state change and trigger predictions
     */
    recordStateChange(newState: string): void;
    /**
     * Predict next states based on transition graph
     */
    predictNextStates(fromState: string, depth?: number): PredictedState[];
    /**
     * Get selectors associated with a state
     */
    private getSelectorsForState;
    /**
     * Start preloading for a predicted state
     */
    private startPreloading;
    /**
     * Register a selector for a state
     */
    registerSelector(stateId: string, selector: string, context?: {
        elementType?: string;
        textContent?: string;
        ariaLabel?: string;
    }): PrecomputedSelector;
    /**
     * Generate alternative selectors
     */
    private generateAlternatives;
    /**
     * Precompute a selector (validate and cache alternatives)
     */
    private precomputeSelector;
    /**
     * Evict oldest cache entry
     */
    private evictOldestCacheEntry;
    /**
     * Cache DOM snapshot
     */
    cacheDOMSnapshot(stateId: string, html: string): void;
    /**
     * Get cached DOM for a state
     */
    getCachedDOM(stateId: string): string | null;
    /**
     * Evict oldest DOM entry
     */
    private evictOldestDOMEntry;
    /**
     * Get precomputed selector for quick access
     */
    getPrecomputedSelector(stateId: string, selector: string): PrecomputedSelector | null;
    /**
     * Record time saved by using cached data
     */
    recordTimeSaved(milliseconds: number): void;
    /**
     * Get most likely next action from current state
     */
    getMostLikelyNextAction(): {
        state: string;
        probability: number;
    } | null;
    /**
     * Get transition statistics
     */
    getTransitionStats(): Array<{
        from: string;
        to: string;
        probability: number;
        occurrences: number;
        avgTime: number;
    }>;
    /**
     * Get statistics
     */
    getStats(): typeof this.stats & {
        transitionCount: number;
        selectorCacheSize: number;
        domCacheSize: number;
        cacheHitRate: number;
        currentState: string;
        uptime: number;
    };
    /**
     * Count total transitions
     */
    private countTransitions;
    /**
     * Export state machine
     */
    exportStateMachine(): {
        states: string[];
        transitions: StateTransition[];
        currentState: string;
    };
    /**
     * Import state machine
     */
    importStateMachine(data: {
        states: string[];
        transitions: StateTransition[];
        currentState?: string;
    }): void;
    /**
     * Clear all caches
     */
    clearCaches(): void;
    /**
     * Shutdown
     */
    shutdown(): Promise<void>;
}
export default PredictiveStatePreloader;
//# sourceMappingURL=state-preloader.d.ts.map