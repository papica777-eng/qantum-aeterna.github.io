/**
 * 🔄 SELF-OPTIMIZING ENGINE - Auto-Performance Tuning
 *
 * The system that makes QANTUM self-sufficient:
 * - Monitors Ghost test performance in real-time
 * - Detects latency anomalies and bottlenecks
 * - Auto-refactors test code for optimal performance
 * - Learns from performance patterns
 *
 * "A system that improves itself"
 *
 * @version 1.0.0
 * @phase 91-95 - The Singularity
 */
import { EventEmitter } from 'events';
interface OptimizationConfig {
    latencyThreshold: number;
    sampleSize: number;
    autoRefactorEnabled: boolean;
    performanceHistorySize: number;
    outputDir: string;
    reportInterval: number;
}
interface PerformanceMetric {
    testId: string;
    testName: string;
    duration: number;
    timestamp: number;
    apiCalls: ApiCallMetric[];
    memoryUsage: number;
    cpuUsage: number;
    networkLatency: number;
    status: 'pass' | 'fail' | 'slow';
}
interface ApiCallMetric {
    endpoint: string;
    method: string;
    duration: number;
    status: number;
    size: number;
    cached: boolean;
}
interface LatencyAnomaly {
    id: string;
    testId: string;
    detectedAt: number;
    expectedDuration: number;
    actualDuration: number;
    slowestEndpoint: string;
    rootCause: 'api_latency' | 'network' | 'dom_complexity' | 'memory' | 'unknown';
    severity: 'low' | 'medium' | 'high' | 'critical';
    autoFixed: boolean;
}
interface OptimizationSuggestion {
    id: string;
    testId: string;
    type: 'cache_api' | 'parallel_requests' | 'reduce_dom_queries' | 'batch_operations' | 'refactor_selector';
    description: string;
    expectedImprovement: number;
    codeChange: CodeChange;
    confidence: number;
    autoApplicable: boolean;
}
interface CodeChange {
    filePath: string;
    lineNumber: number;
    originalCode: string;
    optimizedCode: string;
    reason: string;
}
interface OptimizationReport {
    generatedAt: number;
    totalTests: number;
    optimizedTests: number;
    totalImprovementMs: number;
    totalImprovementPercent: number;
    anomaliesDetected: number;
    anomaliesFixed: number;
    suggestions: OptimizationSuggestion[];
}
export declare class SelfOptimizingEngine extends EventEmitter {
    private config;
    private performanceHistory;
    private baselines;
    private anomalies;
    private optimizations;
    private isMonitoring;
    private monitorInterval;
    constructor(config?: Partial<OptimizationConfig>);
    /**
     * 🚀 Start real-time performance monitoring
     */
    startMonitoring(): void;
    /**
     * Stop monitoring
     */
    stopMonitoring(): void;
    /**
     * 📊 Record a test execution metric
     */
    recordMetric(metric: PerformanceMetric): void;
    /**
     * 🔍 Detect latency anomalies
     */
    private detectAnomaly;
    /**
     * 🔬 Analyze root cause of latency
     */
    private analyzeRootCause;
    /**
     * Find slowest API endpoint
     */
    private findSlowestEndpoint;
    /**
     * 🔄 Auto-optimize test code
     */
    private autoOptimize;
    /**
     * 💡 Generate optimization suggestions
     */
    private generateOptimizations;
    /**
     * Generate parallel execution code
     */
    private generateParallelCode;
    /**
     * Generate cache code
     */
    private generateCacheCode;
    /**
     * Generate DOM optimization code
     */
    private generateDomOptimization;
    /**
     * Generate batch operation code
     */
    private generateBatchCode;
    /**
     * Find repeated API calls
     */
    private findRepeatedCalls;
    /**
     * Apply optimization suggestion
     */
    private applySuggestion;
    /**
     * Update baseline statistics
     */
    private updateBaseline;
    /**
     * 📊 Analyze overall performance
     */
    analyzePerformance(): OptimizationReport;
    /**
     * 📈 Get performance statistics
     */
    getStatistics(): {
        totalTests: number;
        totalMetrics: number;
        anomaliesDetected: number;
        anomaliesFixed: number;
        avgImprovement: number;
        topSlowTests: Array<{
            testId: string;
            avgDuration: number;
        }>;
    };
    private loadPerformanceData;
    private savePerformanceData;
}
export declare function createSelfOptimizer(config?: Partial<OptimizationConfig>): SelfOptimizingEngine;
export type { PerformanceMetric, LatencyAnomaly, OptimizationSuggestion, OptimizationReport };
//# sourceMappingURL=self-optimizing-engine.d.ts.map