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
import type { Browser as PlaywrightBrowser, BrowserContext as PlaywrightBrowserContext, Page } from 'playwright';
import { BrowserContext } from '../types';
/** Browser pool configuration */
export interface BrowserPoolConfig {
    /** Maximum parallel browsers */
    maxBrowsers?: number;
    /** Maximum contexts per browser */
    maxContextsPerBrowser?: number;
    /** Browser type */
    browserType?: 'chromium' | 'firefox' | 'webkit';
    /** Headless mode */
    headless?: boolean;
    /** Context timeout in ms */
    contextTimeout?: number;
    /** Auto-cleanup inactive contexts */
    autoCleanup?: boolean;
    /** Cleanup interval in ms */
    cleanupInterval?: number;
    /** Max context age in ms */
    maxContextAge?: number;
    /** Default viewport */
    viewport?: {
        width: number;
        height: number;
    };
    /** Verbose logging */
    verbose?: boolean;
}
/** Extended browser context */
interface BrowserContextWrapper {
    id: string;
    browserId: string;
    context: PlaywrightBrowserContext;
    page: Page;
    status: 'available' | 'busy' | 'error';
    assignedAgent?: string;
    currentUrl?: string;
    createdAt: Date;
    lastUsed?: Date;
    taskCount: number;
}
/**
 * Browser Pool Manager
 *
 * Features:
 * - Dynamic browser/context scaling
 * - Automatic load balancing
 * - Health monitoring
 * - Resource cleanup
 */
export declare class BrowserPoolManager extends EventEmitter {
    /** Configuration */
    private config;
    /** Browser instances */
    private browsers;
    /** All contexts (for quick lookup) */
    private contexts;
    /** Waiting queue */
    private waitingQueue;
    /** Cleanup timer */
    private cleanupTimer;
    /** Playwright instance (set externally) */
    private playwright;
    /** Statistics */
    private stats;
    constructor(config?: BrowserPoolConfig);
    /**
     * Detect CPU cores
     */
    private detectCpuCores;
    /**
     * Initialize the pool with Playwright
     */
    initialize(playwright: Record<string, {
        launch: (options: {
            headless?: boolean;
        }) => Promise<PlaywrightBrowser>;
    }>): Promise<void>;
    /**
     * Get max capacity
     */
    getMaxCapacity(): number;
    /**
     * Create a new browser instance
     */
    private createBrowser;
    /**
     * Acquire a browser context
     */
    acquire(agentId?: string): Promise<BrowserContextWrapper>;
    /**
     * Release a browser context
     */
    release(contextId: string): void;
    /**
     * Find an available context
     */
    private findAvailableContext;
    /**
     * Create a new context
     */
    private createContext;
    /**
     * Find browser with capacity
     */
    private findBrowserWithCapacity;
    /**
     * Queue request when no context available
     */
    private queueRequest;
    /**
     * Process waiting queue
     */
    private processWaitingQueue;
    /**
     * Destroy a context
     */
    destroyContext(contextId: string): Promise<void>;
    /**
     * Destroy a browser
     */
    destroyBrowser(browserId: string): Promise<void>;
    /**
     * Start cleanup timer
     */
    private startCleanupTimer;
    /**
     * Stop cleanup timer
     */
    private stopCleanupTimer;
    /**
     * Cleanup old/unused contexts
     */
    private cleanup;
    /**
     * Execute task in parallel across multiple contexts
     */
    executeParallel<T>(tasks: Array<(page: Page) => Promise<T>>, agentId?: string): Promise<Array<{
        success: boolean;
        result?: T;
        error?: string;
    }>>;
    /**
     * Get context by ID
     */
    getContext(contextId: string): BrowserContextWrapper | undefined;
    /**
     * Get all contexts
     */
    getAllContexts(): BrowserContext[];
    /**
     * Get statistics
     */
    getStats(): typeof this.stats & {
        availableContexts: number;
        busyContexts: number;
        queueLength: number;
        utilization: number;
    };
    /**
     * Shutdown the pool
     */
    shutdown(): Promise<void>;
    /**
     * Log if verbose
     */
    private log;
}
export default BrowserPoolManager;
//# sourceMappingURL=browser-pool.d.ts.map