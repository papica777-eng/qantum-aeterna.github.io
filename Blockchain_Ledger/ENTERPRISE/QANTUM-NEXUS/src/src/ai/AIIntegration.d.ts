/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: AI/ML INTEGRATION
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Smart selectors, anomaly detection, predictive healing, ML model training
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export interface ElementFeatures {
    tagName: string;
    id: string;
    className: string;
    text: string;
    attributes: Record<string, string>;
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
    xpath: string;
    cssSelector: string;
    depth: number;
    siblingIndex: number;
    parentTag: string;
    childCount: number;
    isVisible: boolean;
    isInteractive: boolean;
}
export interface SelectorPrediction {
    selector: string;
    confidence: number;
    strategy: 'id' | 'css' | 'xpath' | 'text' | 'role' | 'ai';
    fallbacks: string[];
}
export interface AnomalyResult {
    isAnomaly: boolean;
    score: number;
    reasons: string[];
    baseline: any;
    current: any;
}
export interface PredictionResult {
    willFail: boolean;
    probability: number;
    reasons: string[];
    suggestedAction: string;
}
export interface TrainingData {
    features: number[];
    label: number;
    metadata?: Record<string, any>;
}
export declare class SmartSelectorAI extends EventEmitter {
    private model;
    private selectorHistory;
    private learningRate;
    constructor();
    /**
     * Find element with AI-powered selector
     */
    findElement(page: any, description: string): Promise<{
        element: any;
        prediction: SelectorPrediction;
    }>;
    /**
     * Learn from selector success/failure
     */
    learn(description: string, selector: string, success: boolean): void;
    /**
     * Suggest best selector for element
     */
    suggestSelector(page: any, element: any): Promise<SelectorPrediction[]>;
    private extractFeaturesFromDescription;
    private generateCandidates;
    private rankCandidates;
    private extractElementFeatures;
    private extractSelectorFeatures;
    private hashDescription;
    private recordSuccess;
}
export declare class AnomalyDetector extends EventEmitter {
    private baselines;
    private threshold;
    constructor(threshold?: number);
    /**
     * Record baseline data
     */
    recordBaseline(key: string, value: number): void;
    /**
     * Detect anomaly
     */
    detect(key: string, value: number): AnomalyResult;
    /**
     * Detect multiple metrics
     */
    detectMultiple(metrics: Record<string, number>): Map<string, AnomalyResult>;
    /**
     * Export baselines
     */
    exportBaselines(): Record<string, BaselineData>;
    /**
     * Import baselines
     */
    importBaselines(data: Record<string, BaselineData>): void;
    private updateStatistics;
}
interface BaselineData {
    values: number[];
    mean: number;
    stdDev: number;
    min: number;
    max: number;
}
export declare class PredictiveHealing extends EventEmitter {
    private failurePatterns;
    private elementHealth;
    /**
     * Record element interaction
     */
    recordInteraction(selector: string, success: boolean, context: Record<string, any>): void;
    /**
     * Predict if selector will fail
     */
    predict(selector: string, context: Record<string, any>): PredictionResult;
    /**
     * Get healing suggestions
     */
    getHealingSuggestions(selector: string): string[];
    private learnFailurePattern;
    private findMatchingPatterns;
    private matchesConditions;
    private describePattern;
    private analyzeContexts;
}
export declare class MLModelTrainer extends EventEmitter {
    private trainingData;
    private model;
    constructor();
    /**
     * Add training sample
     */
    addSample(features: number[], label: number, metadata?: Record<string, any>): void;
    /**
     * Train model
     */
    train(epochs?: number, learningRate?: number): TrainingResult;
    /**
     * Predict
     */
    predict(features: number[]): number;
    /**
     * Save model
     */
    saveModel(filePath: string): void;
    /**
     * Load model
     */
    loadModel(filePath: string): void;
    /**
     * Export training data
     */
    exportTrainingData(filePath: string): void;
    /**
     * Import training data
     */
    importTrainingData(filePath: string): void;
}
interface TrainingResult {
    epochs: number;
    finalLoss: number;
    duration: number;
    samplesUsed: number;
}
export declare function createSmartSelectorAI(): SmartSelectorAI;
export declare function createAnomalyDetector(threshold?: number): AnomalyDetector;
export declare function createPredictiveHealing(): PredictiveHealing;
export declare function createMLTrainer(): MLModelTrainer;
declare const _default: {
    SmartSelectorAI: typeof SmartSelectorAI;
    AnomalyDetector: typeof AnomalyDetector;
    PredictiveHealing: typeof PredictiveHealing;
    MLModelTrainer: typeof MLModelTrainer;
    createSmartSelectorAI: typeof createSmartSelectorAI;
    createAnomalyDetector: typeof createAnomalyDetector;
    createPredictiveHealing: typeof createPredictiveHealing;
    createMLTrainer: typeof createMLTrainer;
};
export default _default;
//# sourceMappingURL=AIIntegration.d.ts.map