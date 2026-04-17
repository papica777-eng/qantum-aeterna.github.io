/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: ERROR HANDLING & RETRY SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Comprehensive error classification, retry strategies, recovery mechanisms
 * Dead letter queue for failed operations
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export declare enum ErrorCategory {
    NETWORK = "network",
    ELEMENT = "element",
    TIMEOUT = "timeout",
    VALIDATION = "validation",
    AUTHENTICATION = "authentication",
    CAPTCHA = "captcha",
    RATE_LIMIT = "rate_limit",
    BLOCKED = "blocked",
    SESSION = "session",
    DATA = "data",
    SYSTEM = "system",
    UNKNOWN = "unknown"
}
export declare enum ErrorSeverity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export interface ClassifiedError {
    original: Error;
    category: ErrorCategory;
    severity: ErrorSeverity;
    retryable: boolean;
    retryDelay: number;
    maxRetries: number;
    recoveryAction?: RecoveryAction;
    context?: Record<string, any>;
}
export type RecoveryAction = 'retry' | 'wait_and_retry' | 'refresh_page' | 'clear_cookies' | 'rotate_proxy' | 'solve_captcha' | 'new_session' | 'escalate' | 'abort';
export interface RetryConfig {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
    strategy: 'fixed' | 'linear' | 'exponential' | 'fibonacci' | 'decorrelated_jitter';
    jitter: boolean;
    retryableErrors?: ErrorCategory[];
    onRetry?: (attempt: number, error: ClassifiedError) => Promise<void>;
}
export interface DeadLetterItem {
    id: string;
    error: ClassifiedError;
    operation: string;
    args: any[];
    attempts: number;
    firstFailure: Date;
    lastFailure: Date;
    context?: Record<string, any>;
}
export declare class ErrorClassifier {
    private static patterns;
    /**
     * Classify error
     */
    static classify(error: Error | string, context?: Record<string, any>): ClassifiedError;
    /**
     * Get default retry delay for category
     */
    private static getRetryDelay;
    /**
     * Get default max retries for category
     */
    private static getMaxRetries;
    /**
     * Add custom pattern
     */
    static addPattern(pattern: RegExp, category: ErrorCategory, severity: ErrorSeverity, retryable: boolean, recovery?: RecoveryAction): void;
    /**
     * Check if error is retryable
     */
    static isRetryable(error: Error | string): boolean;
    /**
     * Get recovery action for error
     */
    static getRecoveryAction(error: Error | string): RecoveryAction;
}
export declare class RetryManager extends EventEmitter {
    private config;
    private fibonacciCache;
    constructor(config?: Partial<RetryConfig>);
    /**
     * Execute with retry
     */
    execute<T>(operation: () => Promise<T>, options?: Partial<RetryConfig>): Promise<T>;
    /**
     * Check if should retry
     */
    private shouldRetry;
    /**
     * Calculate retry delay
     */
    calculateDelay(attempt: number, config: RetryConfig, error?: ClassifiedError): number;
    /**
     * Fibonacci sequence
     */
    private fibonacci;
    private sleep;
}
export interface RecoveryContext {
    page?: any;
    browser?: any;
    proxyRotator?: {
        rotateProxy: () => Promise<string>;
    };
    captchaSolver?: {
        solve: (page: any) => Promise<string>;
    };
    sessionManager?: {
        createSession: () => Promise<void>;
        clearSession: () => Promise<void>;
    };
}
export declare class RecoveryStrategies extends EventEmitter {
    private context;
    constructor(context?: RecoveryContext);
    /**
     * Execute recovery action
     */
    execute(action: RecoveryAction, error: ClassifiedError): Promise<boolean>;
    private waitAndRetry;
    private refreshPage;
    private clearCookies;
    private rotateProxy;
    private solveCaptcha;
    private newSession;
    /**
     * Update context
     */
    setContext(context: Partial<RecoveryContext>): void;
}
export declare class DeadLetterQueue extends EventEmitter {
    private queue;
    private maxSize;
    private retentionMs;
    constructor(options?: {
        maxSize?: number;
        retentionHours?: number;
    });
    /**
     * Add failed operation
     */
    add(item: Omit<DeadLetterItem, 'id' | 'firstFailure' | 'lastFailure' | 'attempts'>): string;
    /**
     * Get item by ID
     */
    get(id: string): DeadLetterItem | undefined;
    /**
     * Get all items
     */
    getAll(filter?: {
        category?: ErrorCategory;
        operation?: string;
        minAttempts?: number;
    }): DeadLetterItem[];
    /**
     * Retry item
     */
    retry<T>(id: string, operation: (...args: any[]) => Promise<T>): Promise<T | null>;
    /**
     * Retry all items of category
     */
    retryCategory<T>(category: ErrorCategory, operation: (...args: any[]) => Promise<T>, options?: {
        maxConcurrent?: number;
        delayBetween?: number;
    }): Promise<{
        succeeded: number;
        failed: number;
    }>;
    /**
     * Remove item
     */
    remove(id: string): boolean;
    /**
     * Clear all items
     */
    clear(): void;
    /**
     * Get stats
     */
    getStats(): {
        total: number;
        byCategory: Record<ErrorCategory, number>;
        byOperation: Record<string, number>;
        avgAttempts: number;
        oldestItem?: Date;
    };
    /**
     * Prune expired items
     */
    prune(): number;
    /**
     * Export to JSON
     */
    export(): string;
    /**
     * Import from JSON
     */
    import(json: string): number;
    private pruneOldest;
    private generateId;
}
export declare enum CircuitState {
    CLOSED = "closed",
    OPEN = "open",
    HALF_OPEN = "half_open"
}
export declare class CircuitBreaker extends EventEmitter {
    private options;
    private state;
    private failures;
    private successes;
    private lastFailureTime?;
    private nextAttemptTime?;
    constructor(options?: {
        failureThreshold?: number;
        successThreshold?: number;
        timeout?: number;
        resetTimeout?: number;
    });
    /**
     * Execute with circuit breaker
     */
    execute<T>(operation: () => Promise<T>): Promise<T>;
    /**
     * Get current state
     */
    getState(): CircuitState;
    /**
     * Force reset
     */
    reset(): void;
    private onSuccess;
    private onFailure;
    private withTimeout;
}
export declare class ErrorHandler extends EventEmitter {
    classifier: typeof ErrorClassifier;
    retry: RetryManager;
    recovery: RecoveryStrategies;
    deadLetter: DeadLetterQueue;
    circuitBreaker: CircuitBreaker;
    constructor(options?: {
        retry?: Partial<RetryConfig>;
        recovery?: RecoveryContext;
        deadLetter?: {
            maxSize?: number;
            retentionHours?: number;
        };
        circuitBreaker?: {
            failureThreshold?: number;
            timeout?: number;
        };
    });
    /**
     * Execute operation with full error handling
     */
    execute<T>(operation: () => Promise<T>, options?: {
        name?: string;
        args?: any[];
        retry?: Partial<RetryConfig>;
        useCircuitBreaker?: boolean;
    }): Promise<T>;
}
export default ErrorHandler;
//# sourceMappingURL=ErrorHandler.d.ts.map