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
import { PersonaEngine, BehaviorProfile, UserPersona } from './persona-engine';
/**
 * Action types supported by the executor
 */
export type ActionType = 'click' | 'type' | 'scroll' | 'hover' | 'wait' | 'navigate' | 'screenshot';
/**
 * Action configuration
 */
export interface Action {
    type: ActionType;
    selector?: string;
    value?: string;
    x?: number;
    y?: number;
    timeout?: number;
    options?: Record<string, unknown>;
}
/**
 * Execution result
 */
export interface ActionResult {
    success: boolean;
    action: Action;
    duration: number;
    rageClicked: boolean;
    missClicked: boolean;
    retries: number;
    error?: string;
}
/**
 * Page interface (Playwright-like)
 */
export interface PageLike {
    click(selector: string, options?: Record<string, unknown>): Promise<void>;
    type(selector: string, text: string, options?: Record<string, unknown>): Promise<void>;
    hover(selector: string): Promise<void>;
    waitForSelector(selector: string, options?: Record<string, unknown>): Promise<unknown>;
    evaluate<T>(fn: (...args: unknown[]) => T, ...args: unknown[]): Promise<T>;
    mouse: {
        move(x: number, y: number, options?: Record<string, unknown>): Promise<void>;
        click(x: number, y: number, options?: Record<string, unknown>): Promise<void>;
    };
    keyboard: {
        type(text: string, options?: Record<string, unknown>): Promise<void>;
        press(key: string): Promise<void>;
    };
    screenshot(options?: Record<string, unknown>): Promise<Buffer>;
    goto(url: string, options?: Record<string, unknown>): Promise<unknown>;
}
/**
 * 🎮 ActionExecutor - Executes actions with persona-based behavior
 *
 * Integrates with PersonaEngine to simulate realistic user interactions
 * including rage clicks, miss clicks, and human-like timing.
 */
export declare class ActionExecutor extends EventEmitter {
    private personaEngine;
    private page;
    private loadStartTime;
    constructor(personaEngine?: PersonaEngine);
    /**
     * Set the page instance to execute actions on
     */
    setPage(page: PageLike): void;
    /**
     * Load a persona for behavior simulation
     */
    loadPersona(personaOrTemplate: UserPersona | string): BehaviorProfile;
    /**
     * Execute an action with persona-based behavior
     */
    execute(action: Action): Promise<ActionResult>;
    /**
     * Execute click with persona behavior (rage clicks, miss clicks)
     */
    private executeClick;
    /**
     * Execute type with realistic typing speed
     */
    private executeType;
    /**
     * Execute scroll with persona-based speed
     */
    private executeScroll;
    /**
     * Execute hover with realistic mouse movement
     */
    private executeHover;
    /**
     * Execute wait
     */
    private executeWait;
    /**
     * Execute navigation with load time monitoring
     */
    private executeNavigate;
    /**
     * Add persona-based delay between interactions
     */
    private addInteractionDelay;
    /**
     * Delay helper
     */
    private delay;
    /**
     * Get UX recommendations based on test session
     */
    getUXRecommendations(): string[];
    /**
     * Get frustration metrics
     */
    getFrustrationMetrics(): {
        currentLevel: number;
        rageClicks: number;
        missClicks: number;
        frustrationEvents: number;
    };
    /**
     * Get interaction log
     */
    getInteractionLog(): import("./persona-engine").InteractionEvent[];
    /**
     * Reset session
     */
    reset(): void;
}
export declare const actionExecutor: ActionExecutor;
//# sourceMappingURL=action-executor.d.ts.map