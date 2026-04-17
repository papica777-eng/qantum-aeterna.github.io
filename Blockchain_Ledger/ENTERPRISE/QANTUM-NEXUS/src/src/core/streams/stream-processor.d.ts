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
import { Transform, Readable, Writable } from 'node:stream';
import { EventEmitter } from 'node:events';
/**
 * Stream processing options
 */
export interface StreamProcessorOptions {
    /** High water mark for streams (default: 64KB) */
    highWaterMark?: number;
    /** Enable automatic backpressure handling */
    autoBackpressure?: boolean;
    /** Maximum memory threshold before pausing (bytes) */
    memoryThreshold?: number;
    /** Enable gzip compression for output */
    compress?: boolean;
}
/**
 * JSON streaming options
 */
export interface JSONStreamOptions {
    /** Path to array within JSON (e.g., 'data.items') */
    jsonPath?: string;
    /** Parse as NDJSON (newline-delimited JSON) */
    ndjson?: boolean;
    /** Buffer size for parsing */
    bufferSize?: number;
}
/**
 * Batch processing options
 */
export interface BatchOptions<T> {
    /** Number of items per batch */
    batchSize: number;
    /** Process function for each batch */
    processor: (batch: T[]) => Promise<void>;
    /** Max concurrent batches */
    concurrency?: number;
    /** Timeout per batch in ms */
    timeout?: number;
}
/**
 * Stream statistics
 */
export interface StreamStats {
    bytesProcessed: number;
    itemsProcessed: number;
    batchesProcessed: number;
    errors: number;
    startTime: number;
    throughput: number;
    memoryPeakUsage: number;
}
/**
 * Transform stream that parses JSON lines (NDJSON)
 * Each line is parsed independently, preventing memory overflow
 */
export declare class JSONLineParser extends Transform {
    private buffer;
    private lineCount;
    constructor();
    _transform(chunk: Buffer, encoding: string, callback: Function): void;
    _flush(callback: Function): void;
    getLineCount(): number;
}
/**
 * Transform stream that parses large JSON arrays item by item
 * Uses minimal memory by streaming array elements
 */
export declare class JSONArrayParser extends Transform {
    private buffer;
    private depth;
    private inArray;
    private itemStart;
    private itemCount;
    private jsonPath;
    constructor(options?: {
        jsonPath?: string;
    });
    _transform(chunk: Buffer, encoding: string, callback: Function): void;
    _flush(callback: Function): void;
    getItemCount(): number;
}
/**
 * Transform stream that batches items for efficient processing
 */
export declare class BatchProcessor<T> extends Transform {
    private batch;
    private batchSize;
    private processor;
    private batchCount;
    private processing;
    private queue;
    private concurrency;
    private activeProcessors;
    constructor(options: BatchOptions<T>);
    _transform(item: T, encoding: string, callback: (error?: Error | null) => void): void;
    _flush(callback: (error?: Error | null) => void): void;
    private flushQueue;
    private processQueue;
    private processBatch;
    getBatchCount(): number;
}
/**
 * Transform stream that throttles based on memory pressure
 * Pauses upstream when memory threshold is exceeded
 */
export declare class MemoryThrottleTransform extends Transform {
    private threshold;
    private checkInterval;
    private _isPausedByMemory;
    private timer?;
    private peakMemory;
    constructor(options?: {
        threshold?: number;
        checkInterval?: number;
    });
    /** Check if stream is paused due to memory pressure */
    get isPausedByMemory(): boolean;
    private startMemoryMonitor;
    _transform(chunk: unknown, encoding: string, callback: Function): void;
    _destroy(error: Error | null, callback: (error: Error | null) => void): void;
    getPeakMemory(): number;
}
/**
 * 📊 Stream Processor
 *
 * High-level API for memory-efficient data processing.
 * Optimized for 24GB RAM Ryzen systems.
 */
export declare class StreamProcessor extends EventEmitter {
    private options;
    private stats;
    constructor(options?: StreamProcessorOptions);
    /**
     * Process a large JSON file as a stream
     * @param inputPath - Path to input file
     * @param processor - Function to process each item
     * @param options - JSON streaming options
     */
    processJSONFile<T>(inputPath: string, processor: (item: T) => Promise<void>, options?: JSONStreamOptions): Promise<StreamStats>;
    /**
     * Process a large JSON file in batches
     * @param inputPath - Path to input file
     * @param options - Batch processing options
     */
    processJSONInBatches<T>(inputPath: string, options: BatchOptions<T> & JSONStreamOptions): Promise<StreamStats>;
    /**
     * Stream data from one file to another with transformation
     * @param inputPath - Source file path
     * @param outputPath - Destination file path
     * @param transform - Transform function for each item
     */
    transformFile<TInput, TOutput>(inputPath: string, outputPath: string, transform: (item: TInput) => TOutput | Promise<TOutput>, options?: JSONStreamOptions): Promise<StreamStats>;
    /**
     * Create a readable stream from an async generator
     * @param generator - Async generator function
     */
    createReadableFromGenerator<T>(generator: AsyncGenerator<T, void, unknown>): Readable;
    /**
     * Create a writable stream that collects items
     * @param maxItems - Maximum items to collect (prevents memory issues)
     */
    createCollectorStream<T>(maxItems?: number): Writable & {
        getItems(): T[];
    };
    /**
     * Reset statistics
     */
    private resetStats;
    /**
     * Finalize statistics
     */
    private finalizeStats;
    /**
     * Get current statistics
     */
    getStats(): StreamStats;
}
export default StreamProcessor;
//# sourceMappingURL=stream-processor.d.ts.map