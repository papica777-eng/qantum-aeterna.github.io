/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: REQUEST LOGGING MIDDLEWARE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * HTTP request/response logging with timing
 * Request ID generation and propagation
 *
 * @author Dimitar Prodromov
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import type { IncomingMessage, ServerResponse } from 'http';
export interface RequestLogConfig {
    /** Log request body */
    logBody?: boolean;
    /** Log response body */
    logResponseBody?: boolean;
    /** Max body length to log */
    maxBodyLength?: number;
    /** Paths to skip logging */
    skipPaths?: string[];
    /** Headers to redact */
    redactHeaders?: string[];
    /** Fields to redact from body */
    redactFields?: string[];
    /** Request ID header name */
    requestIdHeader?: string;
    /** Generate request ID if not present */
    generateRequestId?: boolean;
}
export interface RequestLog {
    requestId: string;
    method: string;
    path: string;
    query?: Record<string, string>;
    headers?: Record<string, string>;
    body?: unknown;
    ip: string;
    userAgent?: string;
    timestamp: string;
}
export interface ResponseLog {
    requestId: string;
    statusCode: number;
    headers?: Record<string, string>;
    body?: unknown;
    duration: number;
    timestamp: string;
}
export declare class RequestLogger {
    private config;
    private static readonly DEFAULT_REDACT_HEADERS;
    private static readonly DEFAULT_REDACT_FIELDS;
    constructor(config?: RequestLogConfig);
    /**
     * Generate or extract request ID
     */
    getRequestId(req: IncomingMessage): string;
    /**
     * Generate unique request ID
     */
    private generateId;
    /**
     * Log incoming request
     */
    logRequest(req: IncomingMessage, requestId: string, body?: unknown): void;
    /**
     * Log outgoing response
     */
    logResponse(res: ServerResponse, requestId: string, startTime: number, body?: unknown): void;
    /**
     * Check if path should be skipped
     */
    private shouldSkip;
    /**
     * Redact sensitive headers
     */
    private redactHeaders;
    /**
     * Redact sensitive fields from body
     */
    private redactBody;
    /**
     * Recursively redact object fields
     */
    private redactObject;
    /**
     * Get client IP from request
     */
    private getClientIP;
    /**
     * Get emoji for status code
     */
    private getStatusEmoji;
}
export declare class ResponseTimeTracker {
    private metrics;
    private maxSamples;
    constructor(maxSamples?: number);
    /**
     * Record response time for endpoint
     */
    record(path: string, duration: number): void;
    /**
     * Get statistics for endpoint
     */
    getStats(path: string): {
        count: number;
        min: number;
        max: number;
        avg: number;
        p50: number;
        p95: number;
        p99: number;
    } | null;
    /**
     * Get all statistics
     */
    getAllStats(): Record<string, ReturnType<typeof this.getStats>>;
    /**
     * Reset all metrics
     */
    reset(): void;
}
export declare function createRequestLogger(config?: RequestLogConfig): RequestLogger;
export declare function createResponseTimeTracker(maxSamples?: number): ResponseTimeTracker;
export default RequestLogger;
//# sourceMappingURL=logging.d.ts.map