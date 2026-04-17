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
import { TaskResult, SwarmTask } from '../types';
/** Distillation logger configuration */
export interface DistillationConfig {
    /** Output file path */
    outputPath?: string;
    /** Minimum confidence threshold */
    minConfidence?: number;
    /** Minimum quality score */
    minQuality?: number;
    /** Max entries per file (for rotation) */
    maxEntriesPerFile?: number;
    /** Enable auto-flush */
    autoFlush?: boolean;
    /** Flush interval in ms */
    flushInterval?: number;
    /** Include metadata in output */
    includeMetadata?: boolean;
    /** Verbose logging */
    verbose?: boolean;
}
/**
 * Distillation Logger
 *
 * Captures high-quality execution traces for:
 * - Fine-tuning local models (Gemma, Llama)
 * - Building domain-specific knowledge
 * - Improving selector generation
 * - Teaching reasoning patterns
 */
export declare class DistillationLogger {
    /** Configuration */
    private config;
    /** In-memory buffer */
    private buffer;
    /** Total entries written */
    private totalEntries;
    /** Current file index */
    private fileIndex;
    /** Flush timer */
    private flushTimer;
    /** Statistics */
    private stats;
    constructor(config?: DistillationConfig);
    /**
     * Record a successful execution
     */
    record(task: SwarmTask, result: TaskResult, context?: Record<string, unknown>): Promise<boolean>;
    /**
     * Assess quality of execution
     */
    private assessQuality;
    /**
     * Get expected duration for task type
     */
    private getExpectedDuration;
    /**
     * Assess selector quality
     */
    private assessSelectorQuality;
    /**
     * Create a distillation entry
     */
    private createEntry;
    /**
     * Build prompt from task
     */
    private buildPrompt;
    /**
     * Build completion from result
     */
    private buildCompletion;
    /**
     * Extract domain from URL
     */
    private extractDomain;
    /**
     * Build tags for entry
     */
    private buildTags;
    /**
     * Flush buffer to file
     */
    flush(): Promise<number>;
    /**
     * Convert entry to JSONL format
     */
    private entryToJsonl;
    /**
     * Get output file path
     */
    private getOutputPath;
    /**
     * Rotate to new file
     */
    private rotateFile;
    /**
     * Start auto-flush timer
     */
    private startAutoFlush;
    /**
     * Stop auto-flush timer
     */
    private stopAutoFlush;
    /**
     * Export in different formats
     */
    exportAs(format: 'jsonl' | 'csv' | 'parquet', outputPath: string): Promise<void>;
    /**
     * Export to CSV format
     */
    private exportToCsv;
    /**
     * Escape CSV field
     */
    private escapeCsv;
    /**
     * Get statistics
     */
    getStats(): {
        accepted: number;
        rejected: number;
        flushed: number;
        buffered: number;
        totalEntries: number;
        acceptanceRate: number;
    };
    /**
     * Clear all data
     */
    clear(): Promise<void>;
    /**
     * Shutdown logger
     */
    shutdown(): Promise<void>;
    /**
     * Log if verbose
     */
    private log;
}
export default DistillationLogger;
//# sourceMappingURL=distillation-logger.d.ts.map