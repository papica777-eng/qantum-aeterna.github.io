/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ENTERPRISE LOGGING SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * God Mode Enterprise Logging with:
 * - Structured JSON logging
 * - Correlation IDs for distributed tracing
 * - Multiple log levels (DEBUG, INFO, WARN, ERROR, FATAL)
 * - Performance metrics
 * - Security audit trails
 * - Log aggregation ready (ELK, Datadog, Splunk)
 * - Automatic PII masking
 * - Context enrichment
 */
import { EventEmitter } from 'events';
export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    FATAL = 4,
    SECURITY = 5
}
export interface LogContext {
    correlationId?: string;
    userId?: string;
    requestId?: string;
    sessionId?: string;
    operation?: string;
    component?: string;
    [key: string]: unknown;
}
export interface LogEntry {
    timestamp: string;
    level: string;
    message: string;
    context: LogContext;
    metadata?: Record<string, unknown>;
    error?: {
        name: string;
        message: string;
        stack?: string;
        code?: string;
    };
    performance?: {
        duration?: number;
        memory?: number;
        cpu?: number;
    };
    hostname: string;
    pid: number;
    environment: string;
}
export interface LoggerConfig {
    level: LogLevel;
    enableConsole: boolean;
    enableFile: boolean;
    filePath?: string;
    maxFileSize?: number;
    enableMetrics: boolean;
    enablePIIMasking: boolean;
    customTransports?: LogTransport[];
}
export interface LogTransport {
    log(entry: LogEntry): void | Promise<void>;
}
/**
 * Enterprise-Grade Logger
 *
 * Features:
 * - Structured JSON logging
 * - Multiple transports (console, file, custom)
 * - Automatic correlation ID propagation
 * - Performance tracking
 * - Security event logging
 * - PII data masking
 */
export declare class EnterpriseLogger extends EventEmitter {
    private config;
    private fileStream?;
    private metricsBuffer;
    private readonly PII_PATTERNS;
    constructor(config?: Partial<LoggerConfig>);
    private initialize;
    private initializeFileTransport;
    /**
     * Create a log entry with full context
     */
    private createLogEntry;
    /**
     * Mask PII data from log messages
     */
    private maskPII;
    /**
     * Generate correlation ID for distributed tracing
     */
    private generateCorrelationId;
    /**
     * Write log entry to all transports
     */
    private writeLog;
    private writeToConsole;
    private writeToFile;
    private rotateLog;
    private flushMetrics;
    private calculateLogLevelDistribution;
    private calculateAverageMemory;
    /**
     * Public logging methods
     */
    debug(message: string, context?: LogContext, metadata?: Record<string, unknown>): void;
    info(message: string, context?: LogContext, metadata?: Record<string, unknown>): void;
    warn(message: string, context?: LogContext, metadata?: Record<string, unknown>): void;
    error(message: string, error?: Error, context?: LogContext, metadata?: Record<string, unknown>): void;
    fatal(message: string, error?: Error, context?: LogContext, metadata?: Record<string, unknown>): void;
    /**
     * Security event logging with enhanced tracking
     */
    security(event: string, severity: 'low' | 'medium' | 'high' | 'critical', context: LogContext, metadata?: Record<string, unknown>): void;
    /**
     * Performance logging with automatic duration tracking
     */
    trackPerformance<T>(operation: string, fn: () => Promise<T>, context?: LogContext): Promise<T>;
    /**
     * Create child logger with inherited context
     */
    child(context: LogContext): EnterpriseLogger;
    /**
     * Graceful shutdown
     */
    shutdown(): Promise<void>;
}
export declare function createLogger(config?: Partial<LoggerConfig>): EnterpriseLogger;
export declare function getLogger(): EnterpriseLogger;
/**
 * Datadog Transport Example
 */
export declare class DatadogTransport implements LogTransport {
    private apiKey;
    private endpoint;
    constructor(apiKey: string, endpoint?: string);
    log(entry: LogEntry): Promise<void>;
}
//# sourceMappingURL=enterprise-logger.d.ts.map