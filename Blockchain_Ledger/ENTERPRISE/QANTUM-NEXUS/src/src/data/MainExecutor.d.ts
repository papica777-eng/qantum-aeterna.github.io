/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: MAIN EXECUTOR
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * The main automation orchestrator - connects all components together
 * Handles parallel execution, task queuing, and error recovery
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
import { DatabaseHandler, Account, Proxy, Card } from './DatabaseHandler';
import { DataProvider } from './DataProviders';
import { MindEngine, MindEngineConfig } from './MindEngine';
import { CaptchaSolver, CaptchaSolverConfig } from './CaptchaSolver';
export interface AutomationTask {
    name: string;
    execute: (engine: MindEngine, context: TaskContext) => Promise<TaskResult>;
    validate?: (engine: MindEngine, context: TaskContext) => Promise<boolean>;
    onError?: (error: Error, engine: MindEngine, context: TaskContext) => Promise<void>;
    timeout?: number;
    retries?: number;
}
export interface TaskContext {
    account: Account;
    proxy: Proxy | null;
    card: Card | null;
    taskId: string;
    attempt: number;
    startTime: Date;
    data: Record<string, any>;
}
export interface TaskResult {
    success: boolean;
    data?: Record<string, any>;
    error?: string;
    screenshots?: string[];
}
export interface ExecutorConfig {
    database: DatabaseHandler;
    engine?: Partial<MindEngineConfig>;
    captcha?: CaptchaSolverConfig;
    parallel?: {
        enabled: boolean;
        maxWorkers: number;
        delayBetweenStarts?: number;
    };
    retry?: {
        maxRetries: number;
        delayMs: number;
        exponentialBackoff: boolean;
    };
    logging?: {
        level: 'debug' | 'info' | 'warn' | 'error';
        file?: string;
        console?: boolean;
    };
}
export interface ExecutionStats {
    total: number;
    completed: number;
    failed: number;
    running: number;
    pending: number;
    avgDuration: number;
    successRate: number;
}
export declare class MainExecutor extends EventEmitter {
    private config;
    private db;
    private dataProvider;
    private captchaSolver;
    private activeWorkers;
    private taskQueue;
    private isRunning;
    private stats;
    private durations;
    constructor(config: ExecutorConfig);
    /**
     * Run a single automation task
     */
    run(task: AutomationTask): Promise<TaskResult>;
    /**
     * Run multiple tasks in parallel
     */
    runParallel(task: AutomationTask, count: number): Promise<TaskResult[]>;
    /**
     * Run task from database queue
     */
    runFromQueue(taskType: string, handler: AutomationTask): Promise<void>;
    /**
     * Stop queue processing
     */
    stopQueue(): void;
    private executeWithTimeout;
    private calculateRetryDelay;
    private updateStats;
    private sleep;
    private log;
    /**
     * Get execution statistics
     */
    getStats(): ExecutionStats;
    /**
     * Get active workers
     */
    getActiveWorkers(): number;
    /**
     * Get captcha solver
     */
    getCaptchaSolver(): CaptchaSolver | null;
    /**
     * Get data provider
     */
    getDataProvider(): DataProvider;
    /**
     * Get database handler
     */
    getDatabase(): DatabaseHandler;
    /**
     * Stop all active workers
     */
    stopAll(): Promise<void>;
}
/**
 * Quick function to run automation with database
 */
export declare function runAutomation(dbConfig: {
    type: 'postgresql' | 'mysql' | 'sqlite';
    host?: string;
    database: string;
    user?: string;
    password?: string;
}, task: (engine: MindEngine) => Promise<void>, options?: {
    headless?: boolean;
    captchaApiKey?: string;
    captchaProvider?: '2captcha' | 'anticaptcha' | 'capmonster';
}): Promise<void>;
export declare const PredefinedTasks: {
    /**
     * GitHub signup task
     */
    githubSignup: (options?: {
        verify2FA?: boolean;
    }) => AutomationTask;
    /**
     * Generic payment task
     */
    makePayment: (options: {
        url: string;
        selectors: {
            cardNumber: string;
            cardHolder: string;
            expiry?: string;
            expiryMonth?: string;
            expiryYear?: string;
            cvv: string;
            submit: string;
        };
    }) => AutomationTask;
};
export default MainExecutor;
//# sourceMappingURL=MainExecutor.d.ts.map