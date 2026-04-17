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
import { SwappableModule, SwappableMethod, MethodAlternative, HotSwapEvent, HotSwapConfig } from '../types';
/**
 * Hot-Swap Module Loader
 *
 * Features:
 * - Register methods as swappable
 * - Add alternatives for A/B testing
 * - Swap implementations at runtime
 * - Track performance of each alternative
 */
export declare class HotSwapModuleLoader extends EventEmitter {
    /** Configuration */
    private config;
    /** Registered modules */
    private modules;
    /** Registered methods */
    private methods;
    /** Swap history */
    private swapHistory;
    /** Original implementations (for rollback) */
    private originals;
    /** Statistics */
    private stats;
    /** Start time */
    private startTime;
    constructor(config?: HotSwapConfig);
    /**
     * Register a module as swappable
     */
    registerModule(name: string, instance: object, description?: string): SwappableModule;
    /**
     * Register a method as swappable
     */
    registerMethod(moduleId: string, methodName: string, implementation: Function): SwappableMethod;
    /**
     * Add an alternative implementation
     */
    addAlternative(methodId: string, implementation: Function, options?: {
        name?: string;
        description?: string;
        priority?: number;
    }): MethodAlternative;
    /**
     * Swap to an alternative implementation
     */
    swap(methodId: string, alternativeId: string): Promise<boolean>;
    /**
     * Rollback to original implementation
     */
    rollback(methodId: string): Promise<boolean>;
    /**
     * Execute a method (with tracking)
     */
    execute<T>(methodId: string, ...args: unknown[]): Promise<T>;
    /**
     * Update average execution time
     */
    private updateAverageTime;
    /**
     * Update alternative's average time
     */
    private updateAlternativeTime;
    /**
     * Create a proxy for a method that auto-tracks
     */
    createProxy<T extends (...args: unknown[]) => unknown>(methodId: string): T;
    /**
     * Get best performing alternative
     */
    getBestAlternative(methodId: string): MethodAlternative | null;
    /**
     * Get method by ID
     */
    getMethod(methodId: string): SwappableMethod | undefined;
    /**
     * Get module by ID
     */
    getModule(moduleId: string): SwappableModule | undefined;
    /**
     * Get all methods in a module
     */
    getModuleMethods(moduleId: string): SwappableMethod[];
    /**
     * Get swap history
     */
    getSwapHistory(): HotSwapEvent[];
    /**
     * Get statistics
     */
    getStats(): typeof this.stats & {
        moduleCount: number;
        methodCount: number;
        activeSwaps: number;
        uptime: number;
    };
    /**
     * Export configuration
     */
    exportConfig(): {
        modules: Array<{
            id: string;
            name: string;
            methods: string[];
        }>;
        methods: Array<{
            id: string;
            alternativeCount: number;
            activeAlternative?: string;
        }>;
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
export default HotSwapModuleLoader;
//# sourceMappingURL=module-loader.d.ts.map