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
 * TTS Voice options
 */
export interface TTSVoice {
    id: string;
    name: string;
    language: string;
    gender: 'male' | 'female' | 'neutral';
}
/**
 * TTS Configuration
 */
export interface TTSConfig {
    /** TTS engine to use */
    engine: 'sapi' | 'espeak' | 'pyttsx3' | 'edge-tts';
    /** Voice ID or name */
    voice?: string;
    /** Speaking rate (0.5 - 2.0) */
    rate: number;
    /** Volume (0.0 - 1.0) */
    volume: number;
    /** Pitch adjustment */
    pitch: number;
    /** Language code */
    language: string;
    /** Enable audio caching */
    enableCache: boolean;
    /** Cache directory */
    cacheDir: string;
}
/**
 * Speech request
 */
export interface SpeechRequest {
    id: string;
    text: string;
    priority: 'immediate' | 'normal' | 'low';
    timestamp: number;
}
/**
 * Test result feedback templates
 */
export interface FeedbackTemplates {
    testPassed: string;
    testFailed: string;
    errorFound: string;
    warningFound: string;
    suiteCompleted: string;
    criticalError: string;
    [key: string]: string;
}
export declare class BulgarianTTS extends EventEmitter {
    private config;
    private speechQueue;
    private isSpeaking;
    private currentProcess;
    private templates;
    private cache;
    private nextRequestId;
    constructor(config?: Partial<TTSConfig>);
    /**
     * Initialize TTS engine
     */
    initialize(): Promise<void>;
    /**
     * Verify TTS engine is available
     */
    private verifyEngine;
    /**
     * Speak text
     */
    speak(text: string, priority?: SpeechRequest['priority']): Promise<void>;
    /**
     * Process speech queue
     */
    private processQueue;
    /**
     * Synthesize speech using configured engine
     */
    private synthesize;
    /**
     * Synthesize with Windows SAPI
     */
    private synthesizeWithSAPI;
    /**
     * Synthesize with espeak
     */
    private synthesizeWithEspeak;
    /**
     * Synthesize with pyttsx3
     */
    private synthesizeWithPyttsx3;
    /**
     * Synthesize with edge-tts (Microsoft Edge TTS)
     */
    private synthesizeWithEdgeTTS;
    /**
     * Play audio file
     */
    private playAudioFile;
    /**
     * Stop current speech
     */
    stopCurrentSpeech(): void;
    /**
     * Clear speech queue
     */
    clearQueue(): void;
    /**
     * Announce test passed
     */
    announceTestPassed(testName?: string): Promise<void>;
    /**
     * Announce test failed
     */
    announceTestFailed(testName?: string, reason?: string): Promise<void>;
    /**
     * Announce error found
     */
    announceError(element: string): Promise<void>;
    /**
     * Announce suite completion
     */
    announceSuiteCompletion(passed: number, failed: number): Promise<void>;
    /**
     * Announce critical error
     */
    announceCriticalError(message: string): Promise<void>;
    /**
     * Custom announcement using template
     */
    announceTemplate(templateKey: keyof FeedbackTemplates, replacements?: Record<string, string>): Promise<void>;
    /**
     * Add custom template
     */
    addTemplate(key: string, template: string): void;
    /**
     * Get configuration
     */
    getConfig(): TTSConfig;
    /**
     * Update configuration
     */
    updateConfig(config: Partial<TTSConfig>): void;
    /**
     * Get queue length
     */
    getQueueLength(): number;
    /**
     * Check if speaking
     */
    isSpeakingNow(): boolean;
    /**
     * Get available templates
     */
    getTemplates(): FeedbackTemplates;
    /**
     * List available voices (Windows SAPI)
     */
    listVoices(): Promise<TTSVoice[]>;
}
export default BulgarianTTS;
//# sourceMappingURL=bulgarian-tts.d.ts.map