/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: PROFESSIONAL LOGGER
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Production-grade logging with Winston
 * Structured logs, rotation, multiple transports
 *
 * @author Dimitar Prodromov
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'debug' | 'trace';
export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    requestId?: string;
    context?: string;
    meta?: Record<string, unknown>;
    stack?: string;
    duration?: number;
}
export interface LoggerConfig {
    level: LogLevel;
    format: 'json' | 'pretty';
    outputs: Array<'console' | 'file'>;
    filePath?: string;
    maxFileSize?: number;
    maxFiles?: number;
    colorize?: boolean;
}
export declare class Logger extends EventEmitter {
    private config;
    private fileStream?;
    private currentFileSize;
    private fileIndex;
    constructor(config?: Partial<LoggerConfig>);
    error(message: string, meta?: Record<string, unknown>): void;
    warn(message: string, meta?: Record<string, unknown>): void;
    info(message: string, meta?: Record<string, unknown>): void;
    http(message: string, meta?: Record<string, unknown>): void;
    debug(message: string, meta?: Record<string, unknown>): void;
    trace(message: string, meta?: Record<string, unknown>): void;
    /**
     * Create child logger with context
     */
    child(context: string): ChildLogger;
    /**
     * Log with request ID for tracing
     */
    withRequestId(requestId: string): RequestLogger;
    /**
     * Flush and close file streams
     */
    close(): Promise<void>;
    private log;
    private writeConsole;
    private writeFile;
    private initFileStream;
    private rotateFile;
    _log(level: LogLevel, message: string, meta?: Record<string, unknown>, requestId?: string, context?: string): void;
}
declare class ChildLogger {
    private parent;
    private context;
    constructor(parent: Logger, context: string);
    error(message: string, meta?: Record<string, unknown>): void;
    warn(message: string, meta?: Record<string, unknown>): void;
    info(message: string, meta?: Record<string, unknown>): void;
    http(message: string, meta?: Record<string, unknown>): void;
    debug(message: string, meta?: Record<string, unknown>): void;
    trace(message: string, meta?: Record<string, unknown>): void;
}
declare class RequestLogger {
    private parent;
    private requestId;
    constructor(parent: Logger, requestId: string);
    error(message: string, meta?: Record<string, unknown>): void;
    warn(message: string, meta?: Record<string, unknown>): void;
    info(message: string, meta?: Record<string, unknown>): void;
    http(message: string, meta?: Record<string, unknown>): void;
    debug(message: string, meta?: Record<string, unknown>): void;
    trace(message: string, meta?: Record<string, unknown>): void;
}
export declare function getLogger(): Logger;
export declare function createLogger(config: Partial<LoggerConfig>): Logger;
export default Logger;
//# sourceMappingURL=logger.d.ts.map