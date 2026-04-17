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
 * Intent categories for test actions
 */
export type IntentCategory = 'authentication' | 'navigation' | 'data_entry' | 'data_retrieval' | 'interaction' | 'assertion' | 'wait' | 'configuration';
/**
 * Semantic intent descriptor
 */
export interface SemanticIntent {
    id: string;
    category: IntentCategory;
    description: string;
    goal: string;
    constraints: string[];
    priority: number;
    confidence: number;
}
/**
 * Detected page element with semantic meaning
 */
export interface SemanticElement {
    selector: string;
    tagName: string;
    role?: string;
    label?: string;
    placeholder?: string;
    ariaLabel?: string;
    semanticType: ElementSemanticType;
    confidence: number;
    boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    isVisible: boolean;
    isEnabled: boolean;
}
/**
 * Semantic type of an element
 */
export type ElementSemanticType = 'login_button' | 'logout_button' | 'submit_button' | 'cancel_button' | 'username_field' | 'password_field' | 'email_field' | 'search_field' | 'navigation_link' | 'menu_item' | 'modal_dialog' | 'error_message' | 'success_message' | 'loading_indicator' | 'data_table' | 'form_container' | 'unknown';
/**
 * Healing attempt record
 */
export interface HealingAttempt {
    id: string;
    originalSelector: string;
    originalIntent: SemanticIntent;
    newSelector?: string;
    newStrategy?: string;
    success: boolean;
    duration: number;
    confidence: number;
    timestamp: number;
}
/**
 * Strategy for intent resolution
 */
export interface IntentResolutionStrategy {
    name: string;
    category: IntentCategory;
    patterns: Array<{
        condition: (page: PageContext) => Promise<boolean>;
        action: (page: PageContext, intent: SemanticIntent) => Promise<ResolutionResult>;
    }>;
    priority: number;
}
/**
 * Page context for analysis
 */
export interface PageContext {
    url: string;
    title: string;
    elements: SemanticElement[];
    forms: FormContext[];
    modals: ModalContext[];
    navigation: NavigationContext[];
    evaluate: <T>(fn: () => T) => Promise<T>;
    click: (selector: string) => Promise<void>;
    type: (selector: string, text: string) => Promise<void>;
    waitFor: (selector: string, timeout?: number) => Promise<boolean>;
}
/**
 * Form context
 */
export interface FormContext {
    selector: string;
    fields: SemanticElement[];
    submitButton?: SemanticElement;
    cancelButton?: SemanticElement;
    purpose: 'login' | 'registration' | 'search' | 'data_entry' | 'unknown';
}
/**
 * Modal context
 */
export interface ModalContext {
    selector: string;
    title?: string;
    type: 'alert' | 'confirm' | 'prompt' | 'custom';
    visible: boolean;
    closeButton?: SemanticElement;
}
/**
 * Navigation context
 */
export interface NavigationContext {
    selector: string;
    label: string;
    href?: string;
    isActive: boolean;
}
/**
 * Resolution result
 */
export interface ResolutionResult {
    success: boolean;
    strategy: string;
    selector?: string;
    action?: string;
    confidence: number;
    reasoning: string;
}
/**
 * Intent healing configuration
 */
export interface IntentHealingConfig {
    /** Enable semantic analysis */
    enableSemanticAnalysis: boolean;
    /** Enable NLU-based intent matching */
    enableNLU: boolean;
    /** Minimum confidence threshold */
    confidenceThreshold: number;
    /** Maximum healing attempts */
    maxAttempts: number;
    /** Enable learning from successful healings */
    enableLearning: boolean;
    /** Timeout for healing operations (ms) */
    timeout: number;
    /** Verbose logging */
    verbose: boolean;
}
/**
 * IntentHealingEngine - Semantic Test Recovery System
 *
 * Instead of just finding alternative selectors, this engine:
 * 1. Understands the INTENT behind the test step
 * 2. Analyzes the current page state semantically
 * 3. Finds ANY path to achieve the goal, even if UI changed completely
 * 4. Rewrites the test step with new strategy
 *
 * Example: Test says "click login button with #login-btn"
 *   - Button ID changed to #sign-in-button
 *   - Traditional healing: Find alternative selector
 *   - Intent healing: "User wants to access the system" - finds login form,
 *     enters credentials, submits - regardless of button ID
 */
export declare class IntentHealingEngine extends EventEmitter {
    private config;
    private strategies;
    private healingHistory;
    private learnedPatterns;
    private nextAttemptId;
    constructor(config?: Partial<IntentHealingConfig>);
    /**
     * Parse natural language description into semantic intent
     */
    parseIntent(description: string): SemanticIntent;
    /**
     * Detect intent category from description
     */
    private detectCategory;
    /**
     * Extract goal and constraints from description
     */
    private extractGoalAndConstraints;
    /**
     * Calculate priority based on category and description
     */
    private calculatePriority;
    /**
     * Calculate confidence in intent detection
     */
    private calculateIntentConfidence;
    /**
     * Analyze page semantically
     */
    analyzePage(page: PageContext): Promise<{
        elements: SemanticElement[];
        forms: FormContext[];
        modals: ModalContext[];
        navigation: NavigationContext[];
    }>;
    /**
     * Detect semantic elements on page
     */
    private detectSemanticElements;
    /**
     * Detect forms and their purposes
     */
    private detectForms;
    /**
     * Detect form purpose from fields
     */
    private detectFormPurpose;
    /**
     * Detect modals/dialogs
     */
    private detectModals;
    /**
     * Detect navigation elements
     */
    private detectNavigation;
    /**
     * Check if element is input type
     */
    private isInputElement;
    /**
     * Check if element is within another
     */
    private isWithinElement;
    /**
     * Heal a failed test step using intent-based reasoning
     */
    heal(originalSelector: string, intentDescription: string, page: PageContext): Promise<HealingAttempt>;
    /**
     * Create healing attempt record
     */
    private createHealingAttempt;
    /**
     * Create pattern key for learning
     */
    private createPatternKey;
    /**
     * Initialize built-in resolution strategies
     */
    private initializeStrategies;
    /**
     * Register a new resolution strategy
     */
    registerStrategy(strategy: IntentResolutionStrategy): void;
    /**
     * Get healing statistics
     */
    getStats(): {
        totalAttempts: number;
        successfulHealings: number;
        failedHealings: number;
        successRate: number;
        avgDuration: number;
        avgConfidence: number;
        strategiesRegistered: number;
        learnedPatterns: number;
    };
    /**
     * Get healing history
     */
    getHistory(): HealingAttempt[];
    /**
     * Clear learned patterns
     */
    clearLearnedPatterns(): void;
    /**
     * Update configuration
     */
    updateConfig(config: Partial<IntentHealingConfig>): void;
    /**
     * Log message if verbose
     */
    private log;
}
export declare function getIntentHealingEngine(): IntentHealingEngine;
export default IntentHealingEngine;
//# sourceMappingURL=intent-healing-engine.d.ts.map