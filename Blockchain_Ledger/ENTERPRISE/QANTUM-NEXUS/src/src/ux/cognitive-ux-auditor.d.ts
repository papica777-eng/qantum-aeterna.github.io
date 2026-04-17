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
 * UX Analysis Result
 */
export interface UXAnalysisResult {
    /** Overall UX score (0-100) */
    score: number;
    /** Detailed category scores */
    categoryScores: {
        visualHierarchy: number;
        accessibility: number;
        consistency: number;
        clarity: number;
        spacing: number;
        colorContrast: number;
        typography: number;
        interactiveElements: number;
    };
    /** Identified UX issues */
    issues: UXIssue[];
    /** Positive UX aspects */
    strengths: string[];
    /** Actionable recommendations */
    recommendations: UXRecommendation[];
    /** Analysis metadata */
    metadata: {
        analysisTime: number;
        modelUsed: string;
        imageSize: {
            width: number;
            height: number;
        };
        timestamp: number;
    };
}
/**
 * UX Issue identified in the interface
 */
export interface UXIssue {
    /** Issue severity */
    severity: 'critical' | 'major' | 'minor' | 'suggestion';
    /** Issue category */
    category: string;
    /** Human-readable description */
    description: string;
    /** Location in the UI (if applicable) */
    location?: {
        x: number;
        y: number;
        width: number;
        height: number;
        element?: string;
    };
    /** WCAG guideline reference (if applicable) */
    wcagReference?: string;
    /** Estimated impact on user experience (0-100) */
    impact: number;
}
/**
 * UX Recommendation
 */
export interface UXRecommendation {
    /** Priority level */
    priority: 'high' | 'medium' | 'low';
    /** Recommendation text */
    text: string;
    /** Related issues */
    relatedIssues: number[];
    /** Estimated effort to implement */
    effort: 'low' | 'medium' | 'high';
    /** Expected improvement in UX score */
    expectedImprovement: number;
}
/**
 * Gemini API Configuration
 */
export interface GeminiConfig {
    apiKey: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
}
/**
 * 🧠 CognitiveUXAuditor - AI-Powered UX Analysis Engine
 *
 * Leverages Gemini 2.0 Flash Vision to perform deep analysis of UI screenshots
 * and provide actionable UX insights.
 */
export declare class CognitiveUXAuditor extends EventEmitter {
    private config;
    private analysisHistory;
    private cacheEnabled;
    private cache;
    constructor(config?: GeminiConfig);
    /**
     * Configure the Gemini API connection
     */
    configure(config: GeminiConfig): void;
    /**
     * Analyze a screenshot for UX issues
     */
    analyzeScreenshot(screenshot: Buffer | string, context?: {
        pageUrl?: string;
        pageName?: string;
        targetPersona?: string;
    }): Promise<UXAnalysisResult>;
    /**
     * Call Gemini Vision API
     */
    private callGeminiVision;
    /**
     * Parse Gemini response into structured result
     */
    private parseGeminiResponse;
    /**
     * Analyze multiple screenshots and compare
     */
    compareScreenshots(screenshots: Array<{
        buffer: Buffer;
        name: string;
    }>): Promise<{
        results: Array<{
            name: string;
            result: UXAnalysisResult;
        }>;
        comparison: {
            best: string;
            worst: string;
            averageScore: number;
            commonIssues: string[];
        };
    }>;
    /**
     * Generate a human-readable UX report
     */
    generateReport(result: UXAnalysisResult): string;
    /**
     * Get emoji for score range
     */
    private getScoreEmoji;
    /**
     * Generate ASCII progress bar
     */
    private generateProgressBar;
    /**
     * Generate cache key for image
     */
    private generateCacheKey;
    /**
     * Enable/disable caching
     */
    setCaching(enabled: boolean): void;
    /**
     * Clear cache
     */
    clearCache(): void;
    /**
     * Get analysis history
     */
    getHistory(): UXAnalysisResult[];
    /**
     * Get average scores from history
     */
    getHistoryStats(): {
        averageScore: number;
        totalAnalyses: number;
        mostCommonIssues: Array<{
            category: string;
            count: number;
        }>;
    };
}
export declare const cognitiveUXAuditor: CognitiveUXAuditor;
//# sourceMappingURL=cognitive-ux-auditor.d.ts.map