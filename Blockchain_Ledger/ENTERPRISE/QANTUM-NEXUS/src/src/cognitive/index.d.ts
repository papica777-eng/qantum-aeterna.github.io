/**
 * 🧠 COGNITIVE CORE - Unified Export
 *
 * Master module that ties together all cognitive capabilities:
 * - NeuralMapEngine: Cognitive Anchors with self-learning selectors
 * - AutonomousExplorer: Self-discovery and site mapping
 * - AutoTestFactory: Self-writing test generation
 * - SelfHealingV2: Real-time test repair
 *
 * @version 1.0.0
 * @phase 81-90
 */
export { NeuralMapEngine, CognitiveAnchor, createNeuralMap } from './neural-map-engine';
export { AutonomousExplorer, SiteMap, DiscoveredPage, createExplorer } from './autonomous-explorer';
export { AutoTestFactory, createTestFactory } from './auto-test-factory';
export { SelfHealingV2, HealingResult, createSelfHealing } from './self-healing-v2';
export type { DiscoveredForm, ApiCall, TransactionFlow } from './autonomous-explorer';
export type { RefactorSuggestion, AnchorChange } from './self-healing-v2';
import { NeuralMapEngine } from './neural-map-engine';
import { AutonomousExplorer, SiteMap } from './autonomous-explorer';
import { AutoTestFactory } from './auto-test-factory';
import { SelfHealingV2 } from './self-healing-v2';
import { EventEmitter } from 'events';
interface CognitiveConfig {
    autoExplore: boolean;
    autoGenerateTests: boolean;
    autoHeal: boolean;
    outputDir: string;
    parallelWorkers: number;
    maxPages: number;
}
/**
 * 🧠 Cognitive Orchestrator - The Brain of QANTUM
 *
 * Coordinates all cognitive modules for autonomous test generation
 */
export declare class CognitiveOrchestrator extends EventEmitter {
    private config;
    private neuralMap;
    private explorer;
    private testFactory;
    private selfHealing;
    constructor(config?: Partial<CognitiveConfig>);
    /**
     * 🚀 Full autonomous pipeline
     */
    autonomousRun(targetUrl: string): Promise<{
        siteMap: SiteMap;
        testsGenerated: number;
        healingEnabled: boolean;
    }>;
    /**
     * Setup event handlers
     */
    private setupEventHandlers;
    /**
     * Get individual modules
     */
    getNeuralMap(): NeuralMapEngine;
    getExplorer(): AutonomousExplorer;
    getTestFactory(): AutoTestFactory;
    getSelfHealing(): SelfHealingV2;
}
/**
 * Factory function
 */
export declare function createCognitiveOrchestrator(config?: Partial<CognitiveConfig>): CognitiveOrchestrator;
//# sourceMappingURL=index.d.ts.map