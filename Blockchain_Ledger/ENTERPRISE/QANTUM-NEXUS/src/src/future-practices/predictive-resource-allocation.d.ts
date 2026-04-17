/**
 * 🔮 PREDICTIVE RESOURCE ALLOCATION ENGINE
 *
 * Advanced Practice #2: Swarm predicts Lambda instances needed before tests start.
 *
 * This module uses ML patterns and historical data to predict resource needs,
 * pre-warming cloud instances, and optimizing cost/performance ratio.
 *
 * Features:
 * - Time-series analysis of test patterns
 * - Lambda/container pre-warming
 * - Cost optimization algorithms
 * - Auto-scaling predictions
 * - Load balancing forecasts
 *
 * @version 1.0.0
 * @phase Future Practices - Beyond Phase 100
 * @author QANTUM AI Architect
 */
import { EventEmitter } from 'events';
interface ResourcePrediction {
    predictionId: string;
    timestamp: number;
    timeHorizon: number;
    resources: {
        lambdaInstances: number;
        containerCount: number;
        memoryMB: number;
        cpuUnits: number;
        networkBandwidth: number;
    };
    confidence: number;
    factors: PredictionFactor[];
    estimatedCost: number;
    actualUsage?: ResourceUsage;
}
interface ResourceUsage {
    timestamp: number;
    lambdaInvocations: number;
    containerCount: number;
    memoryPeakMB: number;
    cpuPeakPercent: number;
    networkMB: number;
    duration: number;
    cost: number;
}
interface PredictionFactor {
    name: string;
    weight: number;
    value: number;
    contribution: number;
}
interface PreWarmConfig {
    provider: 'aws' | 'azure' | 'gcp' | 'local';
    region: string;
    preWarmMinutes: number;
    maxInstances: number;
    costThreshold: number;
    enableAutoScale: boolean;
}
export declare class PredictiveResourceEngine extends EventEmitter {
    private config;
    private patterns;
    private predictions;
    private usageHistory;
    private timeSeriesData;
    private modelWeights;
    private seasonality;
    private hourlyPattern;
    constructor(config?: Partial<PreWarmConfig>);
    /**
     * 🚀 Initialize prediction engine
     */
    initialize(): Promise<void>;
    /**
     * 📊 Load historical test patterns
     */
    private loadHistoricalPatterns;
    /**
     * 📈 Initialize time series tracking
     */
    private initializeTimeSeries;
    /**
     * 🔮 Generate resource prediction for upcoming time window
     */
    predictResources(minutesAhead?: number): Promise<ResourcePrediction>;
    /**
     * 📊 Calculate prediction factors
     */
    private calculatePredictionFactors;
    /**
     * Calculate historical average for time slot
     */
    private calculateHistoricalAverage;
    /**
     * Calculate recent usage trend
     */
    private calculateRecentTrend;
    /**
     * Estimate test complexity based on scheduled tests
     */
    private estimateTestComplexity;
    /**
     * Calculate base resources
     */
    private calculateBaseResources;
    /**
     * Apply multipliers and constraints
     */
    private applyMultipliers;
    /**
     * Calculate prediction confidence
     */
    private calculateConfidence;
    /**
     * 💰 Estimate cost for predicted resources
     */
    private estimateCost;
    /**
     * 🔥 Pre-warm resources based on prediction
     */
    preWarmResources(prediction: ResourcePrediction): Promise<PreWarmResult>;
    /**
     * Execute pre-warm commands
     */
    private executePreWarm;
    /**
     * AWS Lambda pre-warming
     */
    private preWarmAWS;
    /**
     * Azure pre-warming
     */
    private preWarmAzure;
    /**
     * GCP pre-warming
     */
    private preWarmGCP;
    /**
     * Local Docker pre-warming
     */
    private preWarmLocal;
    /**
     * 📊 Record actual usage for model improvement
     */
    recordUsage(usage: ResourceUsage): void;
    /**
     * Update time series data
     */
    private updateTimeSeries;
    /**
     * 🧠 Adjust model weights based on prediction accuracy
     */
    private adjustModelWeights;
    /**
     * 📈 Get prediction accuracy stats
     */
    getAccuracyStats(): PredictionAccuracyStats;
    /**
     * 📊 Generate resource report
     */
    generateReport(): ResourceReport;
    /**
     * Generate optimization recommendations
     */
    private generateRecommendations;
}
interface PreWarmResult {
    predictionId: string;
    provider: string;
    requestedResources: ResourcePrediction['resources'];
    warmedResources: ResourcePrediction['resources'];
    startTime: number;
    endTime?: number;
    status: 'pending' | 'success' | 'failed';
    errors: string[];
}
interface PredictionAccuracyStats {
    totalPredictions: number;
    evaluatedPredictions: number;
    avgAccuracy: number;
    avgOverPrediction: number;
    avgUnderPrediction: number;
    costSavings: number;
}
interface ResourceReport {
    timestamp: number;
    provider: string;
    region: string;
    predictionStats: PredictionAccuracyStats;
    modelWeights: Record<string, number>;
    recentPredictions: ResourcePrediction[];
    recentUsage: ResourceUsage[];
    recommendations: string[];
}
export declare function createPredictiveResourceEngine(config?: Partial<PreWarmConfig>): PredictiveResourceEngine;
export type { ResourcePrediction, ResourceUsage, PreWarmConfig, PreWarmResult, PredictionAccuracyStats, ResourceReport };
//# sourceMappingURL=predictive-resource-allocation.d.ts.map