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
/** Observability configuration */
export interface ObservabilityConfig {
    /** Service name */
    serviceName?: string;
    /** Service version */
    serviceVersion?: string;
    /** OTLP endpoint */
    endpoint?: string;
    /** Export interval in ms */
    exportInterval?: number;
    /** Max spans to buffer */
    maxSpans?: number;
    /** Enable console export (for debugging) */
    consoleExport?: boolean;
    /** Include detailed attributes */
    detailedAttributes?: boolean;
    /** Sampling rate (0-1) */
    samplingRate?: number;
    /** Verbose logging */
    verbose?: boolean;
}
/** Span status */
export type SpanStatus = 'ok' | 'error' | 'timeout';
/** Active span context */
interface SpanContext {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
}
/**
 * Observability Bridge
 *
 * Provides:
 * - Distributed tracing with W3C Trace Context
 * - Span creation and management
 * - Metric collection
 * - Export to OTLP backends
 */
export declare class ObservabilityBridge extends EventEmitter {
    /** Configuration */
    private config;
    /** Span buffer */
    private spanBuffer;
    /** Active spans */
    private activeSpans;
    /** Export timer */
    private exportTimer;
    /** Statistics */
    private stats;
    /** Current trace context (for context propagation) */
    private currentContext;
    constructor(config?: ObservabilityConfig);
    /**
     * Start a new trace
     */
    startTrace(operationName: string, attributes?: Record<string, string>): string;
    /**
     * Start a span within current trace
     */
    startSpan(operationName: string, attributes?: Record<string, string>): string;
    /**
     * Create a span
     */
    private createSpan;
    /**
     * Add event to current span
     */
    addEvent(name: string, attributes?: Record<string, unknown>): void;
    /**
     * Set span attribute
     */
    setAttribute(key: string, value: string): void;
    /**
     * Set span status
     */
    setStatus(status: SpanStatus, message?: string): void;
    /**
     * End current span
     */
    endSpan(status?: SpanStatus): void;
    /**
     * End trace (ends all active spans)
     */
    endTrace(): void;
    /**
     * Create a child span and execute function
     */
    withSpan<T>(operationName: string, fn: () => Promise<T>, attributes?: Record<string, string>): Promise<T>;
    /**
     * Record exception
     */
    recordException(error: Error): void;
    /**
     * Get current trace ID
     */
    getCurrentTraceId(): string | null;
    /**
     * Get current span ID
     */
    getCurrentSpanId(): string | null;
    /**
     * Get trace context for propagation
     */
    getTraceContext(): SpanContext | null;
    /**
     * Set trace context (for cross-process propagation)
     */
    setTraceContext(context: SpanContext): void;
    /**
     * Get W3C traceparent header
     */
    getTraceparent(): string | null;
    /**
     * Parse W3C traceparent header
     */
    parseTraceparent(traceparent: string): SpanContext | null;
    /**
     * Add span to buffer
     */
    private addToBuffer;
    /**
     * Log span to console (for debugging)
     */
    private logSpan;
    /**
     * Export spans to backend
     */
    export(): Promise<number>;
    /**
     * Simulate OTLP export
     */
    private simulateExport;
    /**
     * Convert spans to OTLP format
     */
    private toOtlpFormat;
    /**
     * Start export timer
     */
    private startExportTimer;
    /**
     * Stop export timer
     */
    private stopExportTimer;
    /**
     * Get statistics
     */
    getStats(): {
        spansCreated: number;
        spansExported: number;
        spansDropped: number;
        spansBuffered: number;
        spansActive: number;
        errors: number;
    };
    /**
     * Get all active traces
     */
    getActiveTraces(): string[];
    /**
     * Clear all data
     */
    clear(): void;
    /**
     * Shutdown
     */
    shutdown(): Promise<void>;
    /**
     * Log if verbose
     */
    private log;
}
export default ObservabilityBridge;
//# sourceMappingURL=observability-bridge.d.ts.map