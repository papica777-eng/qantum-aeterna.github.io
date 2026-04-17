/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ENTERPRISE ERROR HANDLING SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * God Mode Error Handling with:
 * - Typed error hierarchy
 * - Automatic error recovery strategies
 * - Circuit breaker integration
 * - Retry mechanisms with exponential backoff
 * - Error correlation and tracking
 * - Automatic alerting for critical errors
 * - Error analytics and reporting
 */
/**
 * Base error class for all QAntum errors
 */
export declare abstract class QAntumError extends Error {
    abstract readonly code: string;
    abstract readonly statusCode: number;
    abstract readonly recoverable: boolean;
    readonly retryStrategy: 'none' | 'immediate' | 'exponential' | 'alternative';
    readonly timestamp: Date;
    readonly correlationId: string;
    readonly context?: Record<string, unknown>;
    constructor(message: string, context?: Record<string, unknown>);
    toJSON(): {
        name: string;
        code: string;
        message: string;
        statusCode: number;
        recoverable: boolean;
        retryStrategy: "none" | "immediate" | "exponential" | "alternative";
        timestamp: string;
        correlationId: string;
        context: Record<string, unknown>;
        stack: string;
    };
}
/**
 * Validation Errors (400)
 */
export declare class ValidationError extends QAntumError {
    readonly validationErrors?: Record<string, string[]>;
    readonly code = "VALIDATION_ERROR";
    readonly statusCode = 400;
    readonly recoverable = false;
    constructor(message: string, validationErrors?: Record<string, string[]>);
}
/**
 * Authentication Errors (401)
 */
export declare class AuthenticationError extends QAntumError {
    readonly code = "AUTHENTICATION_ERROR";
    readonly statusCode = 401;
    readonly recoverable = false;
    constructor(message?: string);
}
/**
 * Authorization Errors (403)
 */
export declare class AuthorizationError extends QAntumError {
    readonly code = "AUTHORIZATION_ERROR";
    readonly statusCode = 403;
    readonly recoverable = false;
    constructor(message?: string);
}
/**
 * Not Found Errors (404)
 */
export declare class NotFoundError extends QAntumError {
    readonly code = "NOT_FOUND";
    readonly statusCode = 404;
    readonly recoverable = false;
    constructor(resource: string, identifier?: string);
}
/**
 * Conflict Errors (409)
 */
export declare class ConflictError extends QAntumError {
    readonly code = "CONFLICT";
    readonly statusCode = 409;
    readonly recoverable = false;
    constructor(message: string);
}
/**
 * Rate Limit Errors (429)
 */
export declare class RateLimitError extends QAntumError {
    readonly retryAfter?: number;
    readonly code = "RATE_LIMIT_EXCEEDED";
    readonly statusCode = 429;
    readonly recoverable = true;
    readonly retryStrategy: "exponential";
    constructor(message?: string, retryAfter?: number);
}
/**
 * Internal Server Errors (500)
 */
export declare class InternalServerError extends QAntumError {
    readonly code = "INTERNAL_SERVER_ERROR";
    readonly statusCode = 500;
    readonly recoverable = false;
    constructor(message?: string, context?: Record<string, unknown>);
}
/**
 * Service Unavailable Errors (503)
 */
export declare class ServiceUnavailableError extends QAntumError {
    readonly code = "SERVICE_UNAVAILABLE";
    readonly statusCode = 503;
    readonly recoverable = true;
    readonly retryStrategy: "exponential";
    constructor(service: string, reason?: string);
}
/**
 * Timeout Errors
 */
export declare class TimeoutError extends QAntumError {
    readonly code = "TIMEOUT";
    readonly statusCode = 504;
    readonly recoverable = true;
    readonly retryStrategy: "exponential";
    constructor(operation: string, timeout: number);
}
/**
 * Database Errors
 */
export declare class DatabaseError extends QAntumError {
    readonly originalError?: Error;
    readonly code = "DATABASE_ERROR";
    readonly statusCode = 500;
    readonly recoverable = false;
    constructor(message: string, originalError?: Error);
}
/**
 * Network Errors
 */
export declare class NetworkError extends QAntumError {
    readonly endpoint?: string;
    readonly code = "NETWORK_ERROR";
    readonly statusCode = 503;
    readonly recoverable = true;
    readonly retryStrategy: "exponential";
    constructor(message: string, endpoint?: string);
}
/**
 * Configuration Errors
 */
export declare class ConfigurationError extends QAntumError {
    readonly configKey?: string;
    readonly code = "CONFIGURATION_ERROR";
    readonly statusCode = 500;
    readonly recoverable = false;
    constructor(message: string, configKey?: string);
}
/**
 * Security Errors
 */
export declare class SecurityError extends QAntumError {
    readonly severity: 'low' | 'medium' | 'high' | 'critical';
    readonly code = "SECURITY_VIOLATION";
    readonly statusCode = 403;
    readonly recoverable = false;
    constructor(message: string, severity?: 'low' | 'medium' | 'high' | 'critical');
}
/**
 * License Errors
 */
export declare class LicenseError extends QAntumError {
    readonly code = "LICENSE_ERROR";
    readonly statusCode = 403;
    readonly recoverable = false;
    constructor(message: string);
}
/**
 * Circuit Breaker Errors
 */
export declare class CircuitBreakerError extends QAntumError {
    readonly code = "CIRCUIT_BREAKER_OPEN";
    readonly statusCode = 503;
    readonly recoverable = true;
    readonly retryStrategy: "alternative";
    constructor(service: string);
}
/**
 * Error Recovery Strategies
 */
export interface RetryConfig {
    maxAttempts: number;
    initialDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
    jitter: boolean;
}
export declare class ErrorRecoveryManager {
    private static defaultRetryConfig;
    /**
     * Retry an operation with exponential backoff
     */
    static retryWithBackoff<T>(operation: () => Promise<T>, config?: Partial<RetryConfig>): Promise<T>;
    /**
     * Execute with timeout
     */
    static withTimeout<T>(operation: () => Promise<T>, timeoutMs: number, operationName?: string): Promise<T>;
    /**
     * Execute with circuit breaker
     */
    static withCircuitBreaker<T>(operation: () => Promise<T>, serviceName: string, circuitBreaker: CircuitBreaker): Promise<T>;
    private static sleep;
}
/**
 * Circuit Breaker Implementation
 */
export declare class CircuitBreaker {
    private readonly threshold;
    private readonly timeout;
    private readonly halfOpenAttempts;
    private failureCount;
    private successCount;
    private lastFailureTime?;
    private state;
    constructor(threshold?: number, timeout?: number, // 1 minute
    halfOpenAttempts?: number);
    isOpen(): boolean;
    recordSuccess(): void;
    recordFailure(): void;
    reset(): void;
    getState(): {
        state: "closed" | "open" | "half-open";
        failureCount: number;
        successCount: number;
        lastFailureTime: Date;
    };
}
/**
 * Global error handler for unhandled errors
 */
export declare class GlobalErrorHandler {
    private static initialized;
    static initialize(): void;
    private static gracefulShutdown;
}
/**
 * Error formatter for API responses
 */
export declare class ErrorFormatter {
    static toHTTPResponse(error: Error): {
        statusCode: number;
        body: Record<string, unknown>;
    };
}
//# sourceMappingURL=enterprise-errors.d.ts.map