/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: ERROR HANDLER MIDDLEWARE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Centralized error handling with proper HTTP responses
 * Error classification, logging, and sanitization
 *
 * @author Dimitar Prodromov
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import type { ServerResponse } from 'http';
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly isOperational: boolean;
    readonly details?: unknown;
    constructor(message: string, statusCode?: number, code?: string, isOperational?: boolean, details?: unknown);
}
export declare class BadRequestError extends AppError {
    constructor(message?: string, details?: unknown);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string, code?: string);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string, code?: string);
}
export declare class NotFoundError extends AppError {
    constructor(resource?: string);
}
export declare class ConflictError extends AppError {
    constructor(message?: string);
}
export declare class TooManyRequestsError extends AppError {
    readonly retryAfter: number;
    constructor(retryAfter?: number);
}
export declare class InternalServerError extends AppError {
    constructor(message?: string);
}
export declare class ServiceUnavailableError extends AppError {
    constructor(message?: string);
}
export interface ErrorResponse {
    error: {
        message: string;
        code: string;
        statusCode: number;
        details?: unknown;
        requestId?: string;
        timestamp: string;
        path?: string;
        stack?: string;
    };
}
export interface ErrorHandlerConfig {
    /** Include stack trace in response */
    includeStack?: boolean;
    /** Include details in response */
    includeDetails?: boolean;
    /** Log all errors */
    logErrors?: boolean;
    /** Environment (development shows more info) */
    environment?: 'development' | 'production';
    /** Custom error transformer */
    transformError?: (error: Error) => AppError;
}
export declare class ErrorHandler {
    private config;
    constructor(config?: ErrorHandlerConfig);
    /**
     * Handle error and send response
     */
    handle(error: Error | unknown, res: ServerResponse, requestId?: string, path?: string): void;
    /**
     * Normalize any error to AppError
     */
    normalize(error: Error | unknown): AppError;
    /**
     * Default error transformer
     */
    private defaultTransform;
    /**
     * Format error response
     */
    private formatResponse;
    /**
     * Send HTTP response
     */
    private sendResponse;
    /**
     * Log error
     */
    private logError;
    /**
     * Create middleware function
     */
    middleware(): (error: Error, res: ServerResponse, requestId?: string, path?: string) => void;
}
type AsyncHandler<T> = (...args: unknown[]) => Promise<T>;
/**
 * Wrap async handler to catch errors
 */
export declare function asyncHandler<T>(fn: AsyncHandler<T>): AsyncHandler<T>;
/**
 * Try-catch wrapper that returns result or error
 */
export declare function tryCatch<T>(fn: () => Promise<T>): Promise<[T, null] | [null, Error]>;
export declare function createErrorHandler(config?: ErrorHandlerConfig): ErrorHandler;
export default ErrorHandler;
//# sourceMappingURL=errorHandler.d.ts.map