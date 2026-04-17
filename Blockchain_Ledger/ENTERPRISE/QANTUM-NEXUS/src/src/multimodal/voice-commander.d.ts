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
 * Voice command intent structure for Semantic Core integration
 */
export interface VoiceIntent {
    /** Unique intent identifier */
    id: string;
    /** Raw transcribed text */
    transcript: string;
    /** Detected intent type */
    type: IntentType;
    /** Confidence score (0-1) */
    confidence: number;
    /** Extracted entities from speech */
    entities: ExtractedEntity[];
    /** Parsed action for execution */
    action: SemanticAction | null;
    /** Timestamp of recognition */
    timestamp: number;
    /** Audio metadata */
    metadata: AudioMetadata;
}
/**
 * Supported intent types for QA operations
 */
export type IntentType = 'navigation' | 'interaction' | 'assertion' | 'data_entry' | 'screenshot' | 'stealth_capture' | 'sovereign_audit' | 'wait' | 'query' | 'test_control' | 'abort' | 'unknown';
/**
 * Entity extracted from voice command
 */
export interface ExtractedEntity {
    /** Entity type */
    type: 'selector' | 'url' | 'text' | 'number' | 'duration' | 'element_type';
    /** Extracted value */
    value: string;
    /** Position in transcript */
    startIndex: number;
    /** Length of entity in transcript */
    length: number;
    /** Confidence for this entity */
    confidence: number;
}
/**
 * Semantic action ready for Sovereign execution
 */
export interface SemanticAction {
    /** Action verb */
    verb: 'click' | 'type' | 'navigate' | 'wait' | 'assert' | 'screenshot' | 'hover' | 'scroll' | 'select';
    /** Target selector or URL */
    target: string;
    /** Additional parameters */
    params: Record<string, unknown>;
    /** Priority level */
    priority: 'critical' | 'high' | 'normal' | 'low';
}
/**
 * Audio metadata from voice input
 */
export interface AudioMetadata {
    /** Duration in milliseconds */
    duration: number;
    /** Sample rate */
    sampleRate: number;
    /** Number of channels */
    channels: number;
    /** Audio format */
    format: 'wav' | 'mp3' | 'webm' | 'ogg' | 'raw';
    /** Average volume level (0-1) */
    volumeLevel: number;
    /** Signal-to-noise ratio */
    snr: number;
    /** Language detected */
    language: string;
}
/**
 * Voice Commander configuration
 */
export interface VoiceCommanderConfig {
    /** Whisper API key */
    apiKey: string;
    /** Whisper model to use */
    model: 'whisper-1' | 'whisper-large-v3';
    /** Primary language */
    language: string;
    /** Enable real-time streaming */
    streaming: boolean;
    /** Silence threshold for VAD (Voice Activity Detection) */
    silenceThreshold: number;
    /** Maximum recording duration (ms) */
    maxDuration: number;
    /** Custom vocabulary for QA terms */
    customVocabulary: string[];
    /** Enable intent caching */
    cacheIntents: boolean;
}
export declare class VoiceCommander extends EventEmitter {
    private config;
    private isListening;
    private vadState;
    private audioBuffer;
    private intentHistory;
    private intentCache;
    private intentPatterns;
    constructor();
    /**
     * Configure the Voice Commander
     */
    configure(config: Partial<VoiceCommanderConfig>): void;
    /**
     * Get default QA vocabulary
     */
    private getDefaultVocabulary;
    /**
     * Start listening for voice commands
     */
    startListening(): Promise<void>;
    /**
     * Stop listening for voice commands
     */
    stopListening(): Promise<void>;
    /**
     * Process incoming audio chunk
     */
    processAudioChunk(chunk: Float32Array): Promise<VoiceIntent | null>;
    /**
     * Calculate volume level from audio chunk
     */
    private calculateVolume;
    /**
     * Process audio buffer and extract intent
     */
    private processAudioBuffer;
    /**
     * Transcribe audio using Whisper API
     */
    private transcribeAudio;
    /**
     * Convert Float32Array to WAV buffer
     */
    private float32ToWav;
    /**
     * Calculate Signal-to-Noise Ratio
     */
    private calculateSNR;
    /**
     * Parse voice transcript into semantic intent
     */
    parseIntent(transcript: string, metadata: AudioMetadata): VoiceIntent;
    /**
     * Initialize intent recognition patterns
     */
    private initializeIntentPatterns;
    private extractURL;
    private extractSelector;
    private extractElementType;
    private extractText;
    private extractDuration;
    private calculatePatternConfidence;
    private extractTargetFromTranscript;
    private buildSelectorFromContext;
    private normalizeForCache;
    private generateIntentId;
    /**
     * Directly transcribe audio file to intent
     */
    transcribeFile(audioBuffer: ArrayBuffer, format?: AudioMetadata['format']): Promise<VoiceIntent>;
    /**
     * Get intent history
     */
    getHistory(): VoiceIntent[];
    /**
     * Get statistics
     */
    getStats(): {
        totalIntents: number;
        byType: Record<IntentType, number>;
        averageConfidence: number;
        cacheHitRate: number;
    };
    /**
     * Clear history and cache
     */
    clear(): void;
    /**
     * Check if currently listening
     */
    isActive(): boolean;
}
export default VoiceCommander;
//# sourceMappingURL=voice-commander.d.ts.map