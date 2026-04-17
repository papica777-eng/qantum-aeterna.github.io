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
import { EventEmitter } from 'events';
import { GhostPath, GhostSession, GhostExecutionConfig } from '../types';
/**
 * Ghost Execution Layer
 *
 * Features:
 * - Parallel testing of alternative selector paths
 * - Non-blocking shadow execution
 * - Automatic knowledge base updates
 * - Winner path detection
 */
export declare class GhostExecutionLayer extends EventEmitter {
    /** Configuration */
    private config;
    /** Active ghost sessions */
    private activeSessions;
    /** Path knowledge base (path hash → performance data) */
    private knowledgeBase;
    /** Statistics */
    private stats;
    /** Start time */
    private startTime;
    constructor(config?: GhostExecutionConfig);
    /**
     * Start a ghost execution session
     * Tests alternative paths while the main path executes
     */
    startGhostSession(realPath: GhostPath, alternativePaths: GhostPath[], page: unknown): Promise<GhostSession>;
    /**
     * Execute a single ghost path
     */
    private executeGhostPath;
    /**
     * Find element using ghost path (read-only, doesn't affect state)
     */
    private findElementGhost;
    /**
     * Simulate finding element (for testing without browser)
     */
    private simulateFindElement;
    /**
     * Get screenshot hash for visual comparison
     */
    private getScreenshotHash;
    /**
     * Complete a ghost session and determine winner
     */
    private completeSession;
    /**
     * Update knowledge base with ghost results
     */
    private updateKnowledgeBase;
    /**
     * Generate hash for path (for knowledge base key)
     */
    private getPathHash;
    /**
     * Generate alternative paths for a given selector
     */
    generateAlternativePaths(originalSelector: string, targetText?: string, elementType?: string): GhostPath[];
    /**
     * Simplify CSS selector
     */
    private simplifySelector;
    /**
     * Convert CSS selector to XPath
     */
    private toXPath;
    /**
     * Get best known path for a selector pattern
     */
    getBestKnownPath(selectorPattern: string): GhostPath | null;
    /**
     * Get session by ID
     */
    getSession(sessionId: string): GhostSession | undefined;
    /**
     * Get all active sessions
     */
    getActiveSessions(): GhostSession[];
    /**
     * Get statistics
     */
    getStats(): typeof this.stats & {
        knowledgeBaseSize: number;
        activeSessions: number;
        uptime: number;
        improvementRate: number;
    };
    /**
     * Export knowledge base
     */
    exportKnowledge(): Array<{
        pathHash: string;
        successRate: number;
        avgTime: number;
        sampleCount: number;
        lastUpdated: Date;
    }>;
    /**
     * Import knowledge base
     */
    importKnowledge(data: Array<{
        pathHash: string;
        successRate: number;
        avgTime: number;
        sampleCount: number;
        lastUpdated: Date;
    }>): void;
    /**
     * Clear knowledge base
     */
    clearKnowledge(): void;
    /**
     * Shutdown
     */
    shutdown(): Promise<void>;
}
export default GhostExecutionLayer;
//# sourceMappingURL=ghost-execution-layer.d.ts.map