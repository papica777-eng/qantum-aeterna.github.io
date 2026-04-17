/**
 * 🧠 NEURAL MAP ENGINE - Cognitive Anchors System
 *
 * Creates intelligent, self-learning selectors based on multiple signals:
 * - Semantic meaning (text, labels, aria)
 * - Visual position (relative to viewport, parent, siblings)
 * - DOM structure (AST-like tree analysis)
 * - Historical success/failure patterns
 *
 * The system learns from every interaction and improves selector
 * reliability over time - becoming smarter with each test run.
 *
 * @version 1.0.0
 * @phase 81-83
 */
import { Page, ElementHandle, Locator } from 'playwright';
interface CognitiveAnchor {
    id: string;
    name: string;
    type: 'button' | 'input' | 'link' | 'form' | 'container' | 'text' | 'interactive';
    selectors: SelectorSignal[];
    visual: VisualFingerprint;
    semantic: SemanticContext;
    learning: LearningData;
    createdAt: number;
    lastSeen: number;
    pageUrl: string;
}
interface SelectorSignal {
    type: 'id' | 'testid' | 'aria' | 'text' | 'css' | 'xpath' | 'role' | 'visual';
    selector: string;
    value?: string;
    confidence: number;
    successRate: number;
    lastUsed: number;
    usageCount: number;
}
interface VisualFingerprint {
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    relativePosition: {
        nearestLandmark: string;
        quadrant: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
        percentFromTop: number;
        percentFromLeft: number;
    };
    colors: {
        background: string;
        text: string;
        border: string;
    };
    fontSize: number;
    isVisible: boolean;
    zIndex: number;
    visualHash?: string;
    fingerprint?: string;
}
interface SemanticContext {
    innerText: string;
    placeholderText?: string;
    labelText?: string;
    ariaLabel?: string;
    title?: string;
    role: string;
    purpose: 'navigation' | 'action' | 'input' | 'display' | 'container';
    nearbyText: string[];
    formContext?: string;
    headingContext?: string;
    businessFunction?: string;
}
interface LearningData {
    totalAttempts: number;
    successfulFinds: number;
    failedFinds: number;
    healingEvents: number;
    failurePatterns: FailurePattern[];
    successPatterns: string[];
    confidenceHistory: Array<{
        timestamp: number;
        confidence: number;
    }>;
    alternatives: SelectorSignal[];
}
interface FailurePattern {
    timestamp: number;
    selector: string;
    reason: 'not_found' | 'multiple_matches' | 'stale' | 'hidden' | 'detached';
    pageState?: string;
}
interface DOMNode {
    tagName: string;
    id?: string;
    classes: string[];
    attributes: Record<string, string>;
    text: string;
    children: DOMNode[];
    parent?: DOMNode;
    siblings: DOMNode[];
    depth: number;
    index: number;
    boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
interface NeuralMapConfig {
    storageDir: string;
    minConfidence: number;
    maxAlternatives: number;
    learningEnabled: boolean;
    visualFingerprintEnabled: boolean;
    autoHealingEnabled: boolean;
}
export declare class NeuralMapEngine {
    private config;
    private anchors;
    private pageAst;
    private currentPage;
    constructor(config?: Partial<NeuralMapConfig>);
    /**
     * 🧠 Create a Cognitive Anchor for an element
     */
    createAnchor(page: Page, element: ElementHandle | Locator, name: string, businessFunction?: string): Promise<CognitiveAnchor>;
    /**
     * 🎯 Find element using Cognitive Anchor (with self-healing)
     */
    findElement(page: Page, anchorId: string): Promise<ElementHandle | null>;
    /**
     * 🔮 Smart locator that returns best current selector
     */
    getSmartLocator(page: Page, anchorId: string): Promise<Locator | null>;
    /**
     * 📊 Get anchor statistics
     */
    getAnchorStats(anchorId: string): object | null;
    /**
     * 🗺️ Build AST-like DOM tree for analysis
     */
    buildDomAst(page: Page): Promise<DOMNode>;
    private extractSelectorSignals;
    private createSignal;
    private extractVisualFingerprint;
    private extractSemanticContext;
    private inferBusinessFunction;
    private selfHeal;
    private findByVisualSimilarity;
    private findBySemanticContext;
    private findByFuzzyText;
    private updateAnchorFromElement;
    private trySelector;
    private verifyVisualMatch;
    private recordSuccess;
    private recordFailure;
    private calculateOverallConfidence;
    private getBestSelector;
    private determineElementType;
    private generateAnchorId;
    private countNodes;
    private loadAnchors;
    private saveAnchors;
}
export declare function createNeuralMap(config?: Partial<NeuralMapConfig>): NeuralMapEngine;
export type { CognitiveAnchor, SelectorSignal, VisualFingerprint, SemanticContext, LearningData };
//# sourceMappingURL=neural-map-engine.d.ts.map