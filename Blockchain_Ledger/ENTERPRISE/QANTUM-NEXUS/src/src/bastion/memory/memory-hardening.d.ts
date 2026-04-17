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
import { BrowserMetadata, ResourceTracker } from '../types';
/**
 * Resource types that can be tracked
 */
export type ResourceType = 'browser' | 'page' | 'ghost' | 'mutation' | 'worker' | 'socket' | 'stream';
/**
 * Cleanup callback type
 */
export type CleanupCallback = () => void | Promise<void>;
/**
 * Memory Hardening Manager
 *
 * Provides GC-friendly resource tracking and automatic cleanup.
 */
export declare class MemoryHardeningManager extends EventEmitter {
    /** WeakMap for browser instance metadata */
    private browserMetadata;
    /** WeakMap for general resource metadata */
    private resourceMetadata;
    /** WeakRef registry for tracking live objects */
    private weakRefs;
    /** Finalization registry for cleanup callbacks */
    private finalizationRegistry;
    /** Resource trackers by type */
    private trackers;
    /** Cleanup callbacks pending execution */
    private pendingCleanups;
    /** Start time for uptime tracking */
    private startTime;
    /** Memory check interval */
    private memoryCheckInterval?;
    /** Memory pressure threshold (percentage) */
    private memoryPressureThreshold;
    constructor();
    /**
     * Register a browser instance with metadata
     * @param browser - Browser instance object
     * @param instanceId - Unique instance ID
     */
    registerBrowser(browser: object, instanceId: string): void;
    /**
     * Get browser metadata
     * @param browser - Browser instance
     */
    getBrowserMetadata(browser: object): BrowserMetadata | undefined;
    /**
     * Update browser activity
     * @param browser - Browser instance
     * @param pagesOpened - Number of pages opened
     * @param memoryEstimate - Estimated memory usage
     */
    updateBrowserActivity(browser: object, pagesOpened?: number, memoryEstimate?: number): void;
    /**
     * Mark browser as inactive
     * @param browser - Browser instance
     */
    deactivateBrowser(browser: object): void;
    /**
     * Track a resource with WeakRef
     * @param type - Resource type
     * @param resource - Resource object
     * @param resourceId - Unique resource ID
     * @param cleanup - Optional cleanup callback
     */
    trackResource(type: ResourceType, resource: object, resourceId: string, cleanup?: CleanupCallback): void;
    /**
     * Check if a resource is still alive
     * @param resourceId - Resource ID
     */
    isResourceAlive(resourceId: string): boolean;
    /**
     * Get a tracked resource (if still alive)
     * @param resourceId - Resource ID
     */
    getResource<T extends object>(resourceId: string): T | undefined;
    /**
     * Attach metadata to any object
     * @param object - Object to attach metadata to
     * @param metadata - Metadata to attach
     */
    attachMetadata<T extends object>(object: T, metadata: Record<string, unknown>): void;
    /**
     * Get metadata from an object
     * @param object - Object to get metadata from
     */
    getMetadata<T extends object>(object: T): Record<string, unknown> | undefined;
    /**
     * Handle finalization (called by GC)
     */
    private handleFinalization;
    /**
     * Execute cleanup callback safely
     */
    private executeCleanup;
    /**
     * Force cleanup of a specific resource
     * @param resourceId - Resource ID to clean up
     */
    forceCleanup(resourceId: string): Promise<boolean>;
    /**
     * Get tracker statistics
     * @param type - Resource type (optional, all if not specified)
     */
    getTrackerStats(type?: ResourceType): ResourceTracker | Map<ResourceType, ResourceTracker>;
    /**
     * Start memory pressure monitoring
     */
    private startMemoryMonitoring;
    /**
     * Check for memory pressure
     */
    private checkMemoryPressure;
    /**
     * Get memory statistics
     */
    getMemoryStats(): {
        heapUsed: number;
        heapTotal: number;
        external: number;
        rss: number;
        activeResources: number;
        peakResources: number;
        uptime: number;
    };
    /**
     * Clean up all resources of a type
     * @param type - Resource type
     */
    cleanupType(type: ResourceType): Promise<number>;
    /**
     * Set memory pressure threshold
     * @param threshold - Threshold (0-1)
     */
    setMemoryPressureThreshold(threshold: number): void;
    /**
     * Stop memory monitoring and clean up
     */
    shutdown(): void;
}
/**
 * Get the global memory hardening instance
 */
export declare function getGlobalMemoryManager(): MemoryHardeningManager;
export default MemoryHardeningManager;
//# sourceMappingURL=memory-hardening.d.ts.map