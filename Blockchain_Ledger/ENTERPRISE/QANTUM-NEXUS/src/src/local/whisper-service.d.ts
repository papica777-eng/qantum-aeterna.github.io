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
 * For licensing inquiries: dimitar.prodromov@QAntum.dev
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
/**
 * Whisper transcription result
 */
export interface WhisperResult {
    /** Transcribed text */
    text: string;
    /** Detected language */
    language: string;
    /** Language confidence (0-1) */
    languageConfidence: number;
    /** Segments with timestamps */
    segments: WhisperSegment[];
    /** Processing duration (ms) */
    processingTime: number;
    /** Model used */
    model: string;
}
/**
 * Transcription segment with timing
 */
export interface WhisperSegment {
    /** Segment ID */
    id: number;
    /** Start time (seconds) */
    start: number;
    /** End time (seconds) */
    end: number;
    /** Segment text */
    text: string;
    /** Confidence score */
    confidence: number;
}
/**
 * Whisper service configuration
 */
export interface WhisperServiceConfig {
    /** Path to Python executable */
    pythonPath: string;
    /** Whisper model size */
    model: 'tiny' | 'base' | 'small' | 'medium' | 'large-v2' | 'large-v3';
    /** Device to use */
    device: 'cpu' | 'cuda' | 'auto';
    /** Compute type */
    computeType: 'int8' | 'float16' | 'float32' | 'auto';
    /** Default language (null for auto-detect) */
    language: string | null;
    /** Path to custom Python script */
    scriptPath?: string;
    /** Timeout in milliseconds */
    timeout: number;
    /** Number of worker threads */
    threads: number;
}
export declare class WhisperService extends EventEmitter {
    private config;
    private pythonProcess;
    private isReady;
    private pendingRequests;
    private requestQueue;
    private isProcessing;
    private outputBuffer;
    constructor(config?: Partial<WhisperServiceConfig>);
    /**
     * Initialize the Whisper service
     */
    initialize(): Promise<void>;
    /**
     * Shutdown the Whisper service
     */
    shutdown(): Promise<void>;
    /**
     * Transcribe audio file
     */
    transcribe(audioPath: string, language?: string): Promise<WhisperResult>;
    /**
     * Transcribe audio buffer
     */
    transcribeBuffer(buffer: Buffer, format?: string, language?: string): Promise<WhisperResult>;
    /**
     * Process request queue
     */
    private processQueue;
    /**
     * Send command to Python process
     */
    private sendCommand;
    /**
     * Handle Python output
     */
    private handlePythonOutput;
    /**
     * Create the Python bridge script
     */
    private createPythonScript;
    private generateRequestId;
    /**
     * Check if service is ready
     */
    isServiceReady(): boolean;
    /**
     * Get current configuration
     */
    getConfig(): WhisperServiceConfig;
    /**
     * Update configuration (requires restart)
     */
    updateConfig(config: Partial<WhisperServiceConfig>): void;
    /**
     * Get queue status
     */
    getQueueStatus(): {
        pending: number;
        processing: boolean;
    };
}
export default WhisperService;
//# sourceMappingURL=whisper-service.d.ts.map