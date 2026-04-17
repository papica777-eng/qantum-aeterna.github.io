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
 * Vision analysis result
 */
export interface VisionAnalysisResult {
    /** Extracted text from image */
    text: string;
    /** Detected elements */
    elements: DetectedElement[];
    /** Analysis confidence */
    confidence: number;
    /** Provider used */
    provider: 'gemini' | 'ollama-llava';
    /** Processing time (ms) */
    latency: number;
    /** Raw response */
    rawResponse?: string;
    /** Fallback triggered */
    fallbackUsed: boolean;
}
/**
 * Detected UI element
 */
export interface DetectedElement {
    /** Element type */
    type: string;
    /** Element description */
    description: string;
    /** Bounding box (if available) */
    bounds?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /** Confidence score */
    confidence: number;
    /** Element text content */
    text?: string;
    /** Suggested selector */
    selector?: string;
}
/**
 * Vision controller configuration
 */
export interface HybridVisionConfig {
    /** Gemini API key */
    geminiApiKey?: string;
    /** Gemini model */
    geminiModel: string;
    /** Ollama endpoint */
    ollamaEndpoint: string;
    /** Ollama model */
    ollamaModel: string;
    /** Latency threshold for fallback (ms) */
    latencyThreshold: number;
    /** Enable fallback */
    enableFallback: boolean;
    /** Timeout (ms) */
    timeout: number;
    /** Retry count */
    retryCount: number;
}
/**
 * Provider health status
 */
interface ProviderHealth {
    gemini: {
        available: boolean;
        avgLatency: number;
        successRate: number;
        lastCheck: number;
    };
    ollama: {
        available: boolean;
        avgLatency: number;
        successRate: number;
        lastCheck: number;
    };
}
export declare class HybridVisionController extends EventEmitter {
    private config;
    private health;
    private latencyHistory;
    constructor(config?: Partial<HybridVisionConfig>);
    /**
     * Initialize and health check both providers
     */
    initialize(): Promise<void>;
    /**
     * Check Gemini API health
     */
    private checkGeminiHealth;
    /**
     * Check Ollama health
     */
    private checkOllamaHealth;
    /**
     * Analyze image with automatic fallback
     */
    analyzeImage(imagePath: string, prompt?: string): Promise<VisionAnalysisResult>;
    /**
     * Analyze with Gemini API
     */
    private analyzeWithGemini;
    /**
     * Analyze with Ollama Llava
     */
    private analyzeWithOllama;
    /**
     * Analyze with racing strategy - fastest wins
     */
    analyzeWithRacing(imagePath: string, prompt: string): Promise<VisionAnalysisResult>;
    /**
     * Read image and convert to base64
     */
    private readImage;
    /**
     * Parse elements from response text
     */
    private parseElements;
    /**
     * Update latency history
     */
    private updateLatencyHistory;
    /**
     * Get current health status
     */
    getHealth(): ProviderHealth;
    /**
     * Get configuration
     */
    getConfig(): HybridVisionConfig;
    /**
     * Update latency threshold
     */
    setLatencyThreshold(ms: number): void;
    /**
     * Toggle fallback
     */
    setFallbackEnabled(enabled: boolean): void;
    /**
     * Force provider selection
     */
    analyzeWithProvider(imagePath: string, prompt: string, provider: 'gemini' | 'ollama-llava'): Promise<VisionAnalysisResult>;
}
export default HybridVisionController;
//# sourceMappingURL=hybrid-vision-controller.d.ts.map