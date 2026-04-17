/**
 * 🔧 SELF-HEALING V2 - Real-Time Test Refactoring
 *
 * Advanced self-healing system that automatically repairs
 * broken tests when cognitive anchors change.
 *
 * Features:
 * - Real-time DOM mutation detection
 * - Intelligent selector migration
 * - Automatic test code refactoring
 * - Learning from successful repairs
 *
 * @version 1.0.0
 * @phase 89-90
 */
import { EventEmitter } from 'events';
import { CognitiveAnchor, SelectorSignal } from './neural-map-engine';
interface SelfHealingConfig {
    autoHeal: boolean;
    maxHealAttempts: number;
    healingStrategies: HealingStrategy[];
    learningEnabled: boolean;
    notifyOnHeal: boolean;
    refactorTestCode: boolean;
    backupBeforeRefactor: boolean;
    outputDir: string;
}
type HealingStrategy = 'fallback-selector' | 'visual-match' | 'semantic-match' | 'ml-prediction' | 'neighboring-elements' | 'structure-analysis';
interface AnchorChange {
    anchorId: string;
    previousSelector: string;
    previousSignals: SelectorSignal[];
    changeType: 'moved' | 'modified' | 'removed' | 'replaced';
    detectedAt: number;
    pageUrl: string;
}
interface HealingResult {
    success: boolean;
    anchorId: string;
    strategy: HealingStrategy;
    previousSelector: string;
    newSelector: string;
    confidence: number;
    healingTime: number;
    refactoredFiles: string[];
}
interface RefactorSuggestion {
    testFile: string;
    line: number;
    originalCode: string;
    suggestedCode: string;
    reason: string;
    confidence: number;
    autoApply: boolean;
}
export declare class SelfHealingV2 extends EventEmitter {
    private config;
    private neuralMap;
    private healingHistory;
    private mutationPatterns;
    private activeWatchers;
    constructor(config?: Partial<SelfHealingConfig>);
    /**
     * 🔧 Attempt to heal a broken anchor
     */
    heal(page: any, anchor: CognitiveAnchor, change: AnchorChange): Promise<HealingResult>;
    /**
     * Try a specific healing strategy
     */
    private tryStrategy;
    /**
     * Strategy: Try fallback selectors from the anchor
     */
    private tryFallbackSelector;
    /**
     * Strategy: Semantic matching based on text/aria
     */
    private trySemanticMatch;
    /**
     * Strategy: Visual matching using image comparison
     */
    private tryVisualMatch;
    /**
     * Strategy: Find element based on neighboring elements
     */
    private tryNeighboringElements;
    /**
     * Strategy: Analyze DOM structure changes
     */
    private tryStructureAnalysis;
    /**
     * Strategy: ML-based prediction from learned patterns
     */
    private tryMLPrediction;
    /**
     * Find similar mutation patterns from history
     */
    private findSimilarPatterns;
    /**
     * Extract pattern from selector
     */
    private extractSelectorPattern;
    /**
     * Calculate string similarity
     */
    private calculateSimilarity;
    /**
     * Refactor test files with new selector
     */
    private refactorTests;
    /**
     * Find all test files in directory
     */
    private findTestFiles;
    /**
     * Refactor a single file
     */
    private refactorFile;
    /**
     * Generate refactoring suggestions without auto-applying
     */
    suggestRefactoring(anchor: CognitiveAnchor, healing: HealingResult): Promise<RefactorSuggestion[]>;
    /**
     * Record healing attempt
     */
    private recordHealing;
    /**
     * Learn from successful healing
     */
    private learnFromHealing;
    /**
     * Start real-time monitoring for anchor changes
     */
    startMonitoring(page: any, anchors: CognitiveAnchor[]): Promise<void>;
    /**
     * Check for mutations
     */
    private checkForMutations;
    /**
     * Stop monitoring
     */
    stopMonitoring(): void;
    private loadHealingData;
    private saveHealingData;
    private escapeRegex;
    /**
     * Get healing statistics
     */
    getStatistics(): {
        totalHealings: number;
        successRate: number;
        patternsLearned: number;
        topStrategies: Array<{
            strategy: string;
            count: number;
        }>;
    };
}
export declare function createSelfHealing(config?: Partial<SelfHealingConfig>): SelfHealingV2;
export { HealingResult, RefactorSuggestion, AnchorChange };
//# sourceMappingURL=self-healing-v2.d.ts.map