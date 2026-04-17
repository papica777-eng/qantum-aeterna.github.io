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
import { IntentType, ExtractedEntity, SemanticAction } from './voice-commander';
/**
 * Supported languages for voice recognition
 * v26.0: Added Chinese (CN) and Japanese (JP) for full 6-language support
 */
export type SupportedLanguage = 'bg' | 'en' | 'de' | 'fr' | 'es' | 'ru' | 'cn' | 'jp' | 'auto';
/**
 * Language-specific intent patterns
 */
export interface LanguagePatterns {
    language: SupportedLanguage;
    displayName: string;
    nativeName: string;
    patterns: LanguageIntentPattern[];
    vocabulary: string[];
    entityMappings: EntityMapping[];
}
/**
 * Intent pattern for specific language
 */
export interface LanguageIntentPattern {
    type: IntentType;
    patterns: RegExp[];
    examples: string[];
}
/**
 * Entity mapping for translation
 */
export interface EntityMapping {
    type: 'element' | 'action' | 'direction' | 'time';
    native: string;
    english: string;
}
export declare const BULGARIAN_PATTERNS: LanguagePatterns;
export declare const ENGLISH_PATTERNS: LanguagePatterns;
export declare const CHINESE_PATTERNS: LanguagePatterns;
export declare const JAPANESE_PATTERNS: LanguagePatterns;
export declare class MultiLanguageCognition {
    private supportedLanguages;
    private activeLanguage;
    private detectedLanguage;
    constructor();
    /**
     * Register a new language
     */
    registerLanguage(patterns: LanguagePatterns): void;
    /**
     * Set active language
     */
    setLanguage(language: SupportedLanguage): void;
    /**
     * Get active language
     */
    getLanguage(): SupportedLanguage;
    /**
     * Detect language from transcript
     * v26.0: Enhanced with Chinese and Japanese detection
     */
    detectLanguage(transcript: string): SupportedLanguage;
    /**
     * Parse intent from transcript using appropriate language
     */
    parseIntent(transcript: string): {
        type: IntentType;
        confidence: number;
        language: SupportedLanguage;
        entities: ExtractedEntity[];
        action: SemanticAction | null;
    };
    /**
     * Calculate confidence score
     */
    private calculateConfidence;
    /**
     * Extract entities from transcript
     */
    private extractEntities;
    /**
     * Build semantic action from intent
     */
    private buildAction;
    /**
     * Extract target from transcript
     */
    private extractTargetFromTranscript;
    /**
     * Build selector from context
     */
    private buildSelector;
    /**
     * Translate entity from native to English
     */
    translateEntity(value: string, language: SupportedLanguage): string;
    /**
     * Get all supported languages
     */
    getSupportedLanguages(): Array<{
        code: SupportedLanguage;
        name: string;
        nativeName: string;
    }>;
    /**
     * Get examples for a specific language and intent type
     */
    getExamples(language: SupportedLanguage, type?: IntentType): string[];
    /**
     * Get vocabulary for a specific language
     */
    getVocabulary(language: SupportedLanguage): string[];
}
export default MultiLanguageCognition;
//# sourceMappingURL=multi-language-cognition.d.ts.map