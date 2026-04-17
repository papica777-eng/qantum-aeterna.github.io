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
import { Page } from 'playwright';
/** Semantic element extracted from DOM */
export interface SemanticElement {
    /** Unique identifier for this element */
    id: string;
    /** Element tag name */
    tag: string;
    /** Visible text content */
    visibleText: string;
    /** ARIA label if present */
    ariaLabel: string | null;
    /** Placeholder text (for inputs) */
    placeholder: string | null;
    /** ARIA role */
    role: string | null;
    /** Element type (for inputs) */
    type: string | null;
    /** All CSS classes */
    classes: string[];
    /** Element ID attribute */
    elementId: string | null;
    /** Name attribute */
    name: string | null;
    /** Visual coordinates on screen */
    coordinates: {
        x: number;
        y: number;
        width: number;
        height: number;
        centerX: number;
        centerY: number;
    };
    /** Best selector found */
    selector: string;
    /** Is element currently visible */
    isVisible: boolean;
    /** Is element interactable */
    isInteractable: boolean;
    /** Parent semantic info */
    parentContext: string | null;
    /** Nearby text (context) */
    nearbyText: string[];
}
/** Semantic Map - abstracted view of page */
export interface SemanticMap {
    url: string;
    timestamp: Date;
    title: string;
    elements: SemanticElement[];
    /** Quick lookup by intent keywords */
    intentIndex: Map<string, SemanticElement[]>;
}
/** Intent definition */
export interface Intent {
    /** Action name like LOGIN_ACTION, SUBMIT_ORDER */
    action: string;
    /** Keywords to search for */
    keywords: string[];
    /** Synonyms for each keyword */
    synonyms?: Record<string, string[]>;
    /** Expected element type */
    expectedType?: 'button' | 'link' | 'input' | 'form' | 'any';
    /** Position hints */
    positionHint?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}
/** Match result with confidence score */
export interface IntentMatch {
    element: SemanticElement;
    score: number;
    confidence: 'high' | 'medium' | 'low';
    matchReasons: string[];
}
/** Knowledge base entry for learned selectors */
export interface KnowledgeEntry {
    intent: string;
    url: string;
    selectors: {
        primary: string;
        fallbacks: string[];
    };
    visualSignature?: {
        position: {
            x: number;
            y: number;
        };
        size: {
            width: number;
            height: number;
        };
        nearbyText: string[];
    };
    lastUsed: Date;
    successCount: number;
    failCount: number;
}
/** ASC Configuration */
export interface ASCConfig {
    /** Path to knowledge.json file */
    knowledgePath?: string;
    /** Minimum confidence threshold (0-1) */
    confidenceThreshold?: number;
    /** Enable visual fallback */
    enableVisualFallback?: boolean;
    /** Enable auto-learning */
    enableLearning?: boolean;
    /** Verbose logging */
    verbose?: boolean;
}
export declare class AdaptiveSemanticCore {
    private config;
    private knowledge;
    private semanticCache;
    constructor(config?: ASCConfig);
    /**
     * 🗺️ SAL: Convert raw DOM into Semantic Map
     * Filters only interactive elements and extracts semantic meaning
     */
    createSemanticMap(page: Page): Promise<SemanticMap>;
    /**
     * Extract searchable keywords from element
     */
    private extractKeywords;
    /**
     * 🎯 HIM: Find best element for given intent
     * Uses scoring algorithm with text matching, synonyms, position, proximity
     */
    matchIntent(page: Page, intent: Intent): Promise<IntentMatch | null>;
    /**
     * Expand keywords with all synonyms
     */
    private expandKeywords;
    /**
     * Calculate match score for element
     */
    private calculateScore;
    private textMatchScore;
    private typeMatchScore;
    private positionMatchScore;
    private ariaMatchScore;
    private contextMatchScore;
    private getMatchReasons;
    /**
     * 👁️ VCB: Visual fallback when HIM confidence is low
     * Takes screenshot, finds element visually, extracts new selector
     */
    visualFallback(page: Page, intent: Intent, description: string): Promise<IntentMatch | null>;
    /**
     * 🔄 Extract selector from coordinates using page context
     */
    extractSelectorFromCoordinates(page: Page, x: number, y: number): Promise<string | null>;
    /**
     * Load knowledge from file
     */
    private loadKnowledge;
    /**
     * Save knowledge to file
     */
    saveKnowledge(): void;
    /**
     * Get known selector for intent
     */
    private getKnownSelector;
    /**
     * Learn new selector from successful match
     */
    learnSelector(intent: string, url: string, element: SemanticElement, success: boolean): void;
    /**
     * 🚀 Execute intent - main entry point
     * Tries HIM first, falls back to VCB if confidence is low
     */
    executeIntent(page: Page, intent: Intent, action?: 'click' | 'fill' | 'hover', value?: string): Promise<boolean>;
    /**
     * 🔍 Quick intent matching for common actions
     */
    findElement(page: Page, keywords: string[], options?: Partial<Intent>): Promise<IntentMatch | null>;
    /**
     * 📊 Get statistics about knowledge base
     */
    getStats(): {
        totalEntries: number;
        successRate: number;
        mostUsed: string[];
    };
    /**
     * 🧹 Clear semantic cache
     */
    clearCache(): void;
}
export default AdaptiveSemanticCore;
export declare const CommonIntents: {
    LOGIN: {
        action: string;
        keywords: string[];
        expectedType: "button";
        positionHint: "top-right";
    };
    LOGOUT: {
        action: string;
        keywords: string[];
        expectedType: "button";
    };
    SUBMIT: {
        action: string;
        keywords: string[];
        expectedType: "button";
    };
    SEARCH: {
        action: string;
        keywords: string[];
        expectedType: "input";
    };
    ADD_TO_CART: {
        action: string;
        keywords: string[];
        expectedType: "button";
    };
    CHECKOUT: {
        action: string;
        keywords: string[];
        expectedType: "button";
    };
    NEXT: {
        action: string;
        keywords: string[];
        expectedType: "button";
    };
    CLOSE: {
        action: string;
        keywords: string[];
        expectedType: "button";
    };
};
//# sourceMappingURL=semantic-core.d.ts.map