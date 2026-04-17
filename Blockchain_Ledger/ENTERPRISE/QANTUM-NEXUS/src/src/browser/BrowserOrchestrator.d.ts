/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: BROWSER ORCHESTRATOR
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Multi-browser orchestration, parallel execution, browser pool
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export type BrowserType = 'chromium' | 'firefox' | 'webkit' | 'chrome' | 'edge';
export interface BrowserConfig {
    type: BrowserType;
    headless?: boolean;
    args?: string[];
    timeout?: number;
    slowMo?: number;
    devtools?: boolean;
    proxy?: {
        server: string;
        username?: string;
        password?: string;
    };
    viewport?: {
        width: number;
        height: number;
    };
    userAgent?: string;
    locale?: string;
    timezone?: string;
    geolocation?: {
        latitude: number;
        longitude: number;
    };
}
export interface BrowserInstance {
    id: string;
    type: BrowserType;
    browser: any;
    createdAt: Date;
    lastUsed: Date;
    inUse: boolean;
    pagesCount: number;
}
export interface PoolConfig {
    browsers: Array<{
        type: BrowserType;
        count: number;
        config?: Partial<BrowserConfig>;
    }>;
    maxTotal?: number;
    idleTimeout?: number;
    acquireTimeout?: number;
}
export interface OrchestratorConfig {
    pool?: PoolConfig;
    maxConcurrency?: number;
    defaultBrowser?: BrowserType;
    retries?: number;
}
export declare class BrowserPool extends EventEmitter {
    private instances;
    private queue;
    private config;
    private cleanupTimer?;
    private idCounter;
    constructor(config: PoolConfig);
    /**
     * Initialize pool with browsers
     */
    initialize(): Promise<void>;
    /**
     * Acquire browser instance
     */
    acquire(type: BrowserType): Promise<BrowserInstance>;
    /**
     * Release browser instance
     */
    release(id: string): void;
    /**
     * Destroy browser instance
     */
    destroy(id: string): Promise<void>;
    /**
     * Shutdown pool
     */
    shutdown(): Promise<void>;
    /**
     * Get pool statistics
     */
    getStats(): {
        total: number;
        available: number;
        inUse: number;
        byType: Record<BrowserType, {
            total: number;
            available: number;
        }>;
    };
    private createInstance;
    private cleanupIdleInstances;
}
export declare class BrowserOrchestrator extends EventEmitter {
    private pool?;
    private config;
    private activeTasks;
    private taskQueue;
    private running;
    private taskCounter;
    constructor(config?: OrchestratorConfig);
    /**
     * Initialize orchestrator
     */
    initialize(): Promise<void>;
    /**
     * Execute task on browser
     */
    execute<T>(handler: (browser: any, page: any) => Promise<T>, options?: {
        browser?: BrowserType;
        timeout?: number;
    }): Promise<T>;
    /**
     * Execute tasks in parallel
     */
    parallel<T>(tasks: Array<{
        handler: (browser: any, page: any) => Promise<T>;
        browser?: BrowserType;
    }>): Promise<T[]>;
    /**
     * Execute task on all browsers
     */
    onAllBrowsers<T>(handler: (browser: any, page: any, browserType: BrowserType) => Promise<T>, browsers?: BrowserType[]): Promise<Map<BrowserType, T>>;
    /**
     * Shutdown orchestrator
     */
    shutdown(): Promise<void>;
    private processQueue;
    private runTask;
}
export declare class BrowserMatrix {
    private orchestrator;
    constructor(orchestrator: BrowserOrchestrator);
    /**
     * Run test across browser matrix
     */
    run<T>(test: (browser: any, page: any, context: MatrixContext) => Promise<T>, matrix: MatrixConfig): Promise<MatrixResult<T>>;
    private generateCombinations;
}
export interface MatrixConfig {
    browsers?: BrowserType[];
    viewports?: Array<{
        width: number;
        height: number;
    }>;
    locales?: string[];
}
export interface MatrixContext {
    browser: BrowserType;
    viewport: {
        width: number;
        height: number;
    };
    locale: string;
}
export interface MatrixResult<T> {
    total: number;
    passed: number;
    failed: number;
    results: Array<{
        context: MatrixContext;
        success: boolean;
        result?: T;
        error?: string;
    }>;
}
export declare function createOrchestrator(config?: OrchestratorConfig): BrowserOrchestrator;
export declare function createPool(config: PoolConfig): BrowserPool;
declare const _default: {
    BrowserPool: typeof BrowserPool;
    BrowserOrchestrator: typeof BrowserOrchestrator;
    BrowserMatrix: typeof BrowserMatrix;
    createOrchestrator: typeof createOrchestrator;
    createPool: typeof createPool;
};
export default _default;
//# sourceMappingURL=BrowserOrchestrator.d.ts.map