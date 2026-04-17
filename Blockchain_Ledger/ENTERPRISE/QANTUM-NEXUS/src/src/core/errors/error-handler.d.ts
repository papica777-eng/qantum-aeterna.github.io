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
import { IErrorHandler, IRetryStrategy, ILogger, ErrorContext, ErrorHandleResult, ErrorStrategy, RetryOptions, NeuralSnapshot } from '../di/container';
/**
 * Base error class for QANTUM errors
 * All custom errors extend this for type-safe handling
 */
export declare abstract class QAntumError extends Error {
    /** Error code for categorization */
    abstract readonly code: string;
    /** Component where error originated */
    abstract readonly component: string;
    /** Whether this error is recoverable */
    abstract readonly recoverable: boolean;
    /** Suggested retry strategy */
    abstract readonly retryStrategy: 'none' | 'immediate' | 'exponential' | 'alternative';
    /** Neural snapshot at time of error */
    neuralSnapshot?: NeuralSnapshot;
    /** Original error if wrapped */
    cause?: Error;
    constructor(message: string, cause?: Error);
}
/**
 * Network-related errors (API calls, WebSocket, etc.)
 */
export declare class NetworkError extends QAntumError {
    readonly code = "NETWORK_ERROR";
    readonly component = "Network";
    readonly recoverable = true;
    readonly retryStrategy: 'exponential';
    /** HTTP status code if applicable */
    readonly statusCode?: number;
    /** Target URL or endpoint */
    readonly endpoint?: string;
    constructor(message: string, options?: {
        statusCode?: number;
        endpoint?: string;
        cause?: Error;
    });
}
/**
 * Timeout errors for operations that exceeded their time limit
 */
export declare class TimeoutError extends QAntumError {
    readonly code = "TIMEOUT_ERROR";
    readonly component = "Timeout";
    readonly recoverable = true;
    readonly retryStrategy: 'exponential';
    /** Operation that timed out */
    readonly operation: string;
    /** Timeout duration in ms */
    readonly timeout: number;
    /** Elapsed time when timeout occurred */
    readonly elapsed: number;
    constructor(operation: string, timeout: number, elapsed: number, cause?: Error);
}
/**
 * Validation errors for invalid input or data
 */
export declare class ValidationError extends QAntumError {
    readonly code = "VALIDATION_ERROR";
    readonly component = "Validation";
    readonly recoverable = false;
    readonly retryStrategy: 'none';
    /** Field(s) that failed validation */
    readonly fields: string[];
    /** Validation rules that were violated */
    readonly violations: Array<{
        field: string;
        rule: string;
        message: string;
    }>;
    constructor(message: string, violations: Array<{
        field: string;
        rule: string;
        message: string;
    }>);
}
/**
 * Configuration errors for missing or invalid configuration
 */
export declare class ConfigurationError extends QAntumError {
    readonly code = "CONFIGURATION_ERROR";
    readonly component = "Configuration";
    readonly recoverable = false;
    readonly retryStrategy: 'none';
    /** Configuration key that's problematic */
    readonly configKey: string;
    /** Expected type or value */
    readonly expected?: string;
    /** Actual value received */
    readonly actual?: string;
    constructor(message: string, configKey: string, options?: {
        expected?: string;
        actual?: string;
    });
}
/**
 * AI service errors (API failures, rate limits, etc.)
 */
export declare class AIServiceError extends QAntumError {
    readonly code = "AI_SERVICE_ERROR";
    readonly component = "AIService";
    readonly recoverable = true;
    readonly retryStrategy: 'alternative';
    /** AI provider that failed */
    readonly provider: string;
    /** Model used */
    readonly model?: string;
    /** Error type from provider */
    readonly providerError?: string;
    /** Whether rate limited */
    readonly rateLimited: boolean;
    constructor(message: string, provider: string, options?: {
        model?: string;
        providerError?: string;
        rateLimited?: boolean;
        cause?: Error;
    });
}
/**
 * Browser automation errors
 */
export declare class BrowserError extends QAntumError {
    readonly code = "BROWSER_ERROR";
    readonly component = "Browser";
    readonly recoverable = true;
    readonly retryStrategy: 'immediate';
    /** Browser type (chromium, firefox, webkit) */
    readonly browserType: string;
    /** Page URL when error occurred */
    readonly pageUrl?: string;
    /** Selector that caused the error */
    readonly selector?: string;
    constructor(message: string, browserType: string, options?: {
        pageUrl?: string;
        selector?: string;
        cause?: Error;
    });
}
/**
 * Security violation errors from sandbox
 */
export declare class SecurityError extends QAntumError {
    readonly code = "SECURITY_ERROR";
    readonly component = "Security";
    readonly recoverable = false;
    readonly retryStrategy: 'none';
    /** Type of security violation */
    readonly violationType: 'sandbox' | 'authentication' | 'authorization' | 'injection';
    /** Attempted operation */
    readonly attemptedOperation: string;
    constructor(message: string, violationType: SecurityError['violationType'], attemptedOperation: string);
}
/**
 * Mutation errors from SEGC
 */
export declare class MutationError extends QAntumError {
    readonly code = "MUTATION_ERROR";
    readonly component = "SEGC";
    readonly recoverable = true;
    readonly retryStrategy: 'alternative';
    /** Mutation ID that failed */
    readonly mutationId: string;
    /** Phase where failure occurred */
    readonly phase: 'proposal' | 'validation' | 'application' | 'rollback';
    /** Whether rollback is available */
    readonly rollbackAvailable: boolean;
    constructor(message: string, mutationId: string, phase: MutationError['phase'], options?: {
        rollbackAvailable?: boolean;
        cause?: Error;
    });
}
/**
 * Worker thread errors
 */
export declare class WorkerError extends QAntumError {
    readonly code = "WORKER_ERROR";
    readonly component = "Worker";
    readonly recoverable = true;
    readonly retryStrategy: 'immediate';
    /** Worker ID that errored */
    readonly workerId: number;
    /** Task type being executed */
    readonly taskType?: string;
    /** Task ID if available */
    readonly taskId?: string;
    constructor(message: string, workerId: number, options?: {
        taskType?: string;
        taskId?: string;
        cause?: Error;
    });
}
/**
 * Circuit breaker errors
 */
export declare class CircuitOpenError extends QAntumError {
    readonly code = "CIRCUIT_OPEN";
    readonly component = "CircuitBreaker";
    readonly recoverable = true;
    readonly retryStrategy: 'alternative';
    /** Service that's circuit-opened */
    readonly service: string;
    /** When circuit will attempt half-open */
    readonly cooldownEnd: Date;
    constructor(service: string, cooldownEnd: Date);
}
/**
 * Generate a neural snapshot of the current system state
 * Captures memory, handles, and stack trace for debugging
 */
export declare function createNeuralSnapshot(error?: Error): NeuralSnapshot;
/**
 * Alternative strategy definition
 */
export interface AlternativeStrategy<T> {
    name: string;
    execute: () => Promise<T>;
    condition?: (error: Error) => boolean;
}
/**
 * 🔄 Exponential Backoff Retry Strategy
 *
 * Implements intelligent retry logic with:
 * - Exponential backoff (delay doubles each attempt)
 * - Jitter to prevent thundering herd
 * - Alternative strategies when retries exhausted
 * - Neural snapshots on each failure
 */
export declare class ExponentialBackoffRetry implements IRetryStrategy {
    private logger?;
    private alternatives;
    constructor(logger?: ILogger);
    /**
     * Register alternative strategies for a specific operation
     * @param operationName - Name of the operation
     * @param strategies - Alternative strategies to try
     */
    registerAlternatives<T>(operationName: string, strategies: AlternativeStrategy<T>[]): void;
    /**
     * Execute a function with exponential backoff retry
     * @param fn - Function to execute
     * @param options - Retry options
     * @returns Result of successful execution
     * @throws Last error if all retries and alternatives fail
     */
    execute<T>(fn: () => Promise<T>, options?: RetryOptions & {
        operationName?: string;
    }): Promise<T>;
    /**
     * Sleep helper
     */
    private sleep;
}
/**
 * Aggregate error containing all retry failures
 */
export declare class AggregateRetryError extends Error {
    readonly code = "AGGREGATE_RETRY_ERROR";
    readonly attempts: Array<{
        error: Error;
        attempt: number;
        snapshot: NeuralSnapshot;
    }>;
    readonly totalAttempts: number;
    constructor(message: string, attempts: Array<{
        error: Error;
        attempt: number;
        snapshot: NeuralSnapshot;
    }>);
    /**
     * Get the last error
     */
    get lastError(): Error | undefined;
    /**
     * Get all unique error types
     */
    get errorTypes(): string[];
}
/**
 * 🛡️ Centralized Error Handler
 *
 * Routes errors to appropriate handlers based on type.
 * Supports custom strategies for different error categories.
 */
export declare class CentralizedErrorHandler extends EventEmitter implements IErrorHandler {
    private strategies;
    private logger?;
    private retryStrategy;
    constructor(options?: {
        logger?: ILogger;
        retryStrategy?: IRetryStrategy;
    });
    /**
     * Register a custom error handling strategy
     * @param errorType - Error type name (constructor.name)
     * @param strategy - Strategy to handle the error
     */
    registerStrategy(errorType: string, strategy: ErrorStrategy): void;
    /**
     * Handle an error with appropriate strategy
     * @param error - Error to handle
     * @param context - Additional context
     * @returns Result of error handling
     */
    handle(error: Error, context?: ErrorContext): Promise<ErrorHandleResult>;
    /**
     * Find the most appropriate strategy for an error
     */
    private findStrategy;
    /**
     * Register default strategies for known error types
     */
    private registerDefaultStrategies;
}
export default CentralizedErrorHandler;
//# sourceMappingURL=error-handler.d.ts.map