/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: PERFORMANCE TESTING
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Web Vitals, Lighthouse integration, load testing, profiling
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export interface WebVitals {
    LCP: number;
    FID: number;
    CLS: number;
    FCP: number;
    TTFB: number;
    TTI: number;
    TBT: number;
    SI: number;
}
export interface PerformanceThresholds {
    LCP?: number;
    FID?: number;
    CLS?: number;
    FCP?: number;
    TTFB?: number;
    TTI?: number;
    TBT?: number;
    SI?: number;
    loadTime?: number;
    resourceSize?: number;
    requestCount?: number;
}
export interface LighthouseConfig {
    categories?: ('performance' | 'accessibility' | 'best-practices' | 'seo' | 'pwa')[];
    device?: 'mobile' | 'desktop';
    throttling?: boolean;
    screenEmulation?: boolean;
}
export interface LighthouseReport {
    scores: {
        performance: number;
        accessibility: number;
        bestPractices: number;
        seo: number;
        pwa?: number;
    };
    metrics: WebVitals;
    audits: Record<string, {
        title: string;
        description: string;
        score: number | null;
        displayValue?: string;
    }>;
    timestamp: Date;
}
export interface LoadTestConfig {
    url: string;
    duration: number;
    rampUp?: number;
    concurrency: number;
    requestsPerSecond?: number;
    timeout?: number;
    headers?: Record<string, string>;
}
export interface LoadTestResult {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    avgResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
    p50ResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    requestsPerSecond: number;
    errors: Record<string, number>;
    duration: number;
}
export declare class WebVitalsCollector extends EventEmitter {
    private page;
    private metrics;
    constructor(page: any);
    /**
     * Collect all Web Vitals
     */
    collect(): Promise<WebVitals>;
    /**
     * Inject Web Vitals collector script
     */
    private injectCollector;
    /**
     * Get metrics from Performance API
     */
    private getPerformanceMetrics;
    /**
     * Assert metrics meet thresholds
     */
    assertThresholds(thresholds: PerformanceThresholds): {
        passed: boolean;
        violations: Array<{
            metric: string;
            actual: number;
            threshold: number;
        }>;
    };
}
export declare class LighthouseRunner extends EventEmitter {
    private config;
    constructor(config?: LighthouseConfig);
    /**
     * Run Lighthouse audit
     */
    run(url: string): Promise<LighthouseReport>;
    /**
     * Compare two reports
     */
    compare(baseline: LighthouseReport, current: LighthouseReport): LighthouseComparison;
}
export interface LighthouseComparison {
    scores: Record<string, {
        baseline: number;
        current: number;
        diff: number;
        percentage: string;
    }>;
    metrics: Record<string, {
        baseline: number;
        current: number;
        diff: number;
        improved: boolean;
    }>;
    improved: string[];
    degraded: string[];
}
export declare class LoadTester extends EventEmitter {
    private config;
    private running;
    private results;
    private errors;
    private successCount;
    private failCount;
    constructor(config: LoadTestConfig);
    /**
     * Run load test
     */
    run(): Promise<LoadTestResult>;
    /**
     * Stop load test
     */
    stop(): void;
    private worker;
    private makeRequest;
    private calculateResults;
}
export declare class ResourceProfiler extends EventEmitter {
    private page;
    constructor(page: any);
    /**
     * Profile page resources
     */
    profile(): Promise<ResourceProfile>;
    /**
     * Monitor resources in real-time
     */
    monitor(duration?: number): Promise<ResourceTimeline>;
}
export interface ResourceProfile {
    totalResources: number;
    totalSize: number;
    totalDuration: number;
    byType: Record<string, {
        count: number;
        size: number;
        duration: number;
    }>;
    resources: any[];
    largestResources: any[];
    slowestResources: any[];
}
export interface ResourceTimeline {
    duration: number;
    snapshots: Array<{
        time: number;
        resources: number;
        size: number;
    }>;
}
export declare class PerformanceBudget {
    private budgets;
    constructor(budgets: PerformanceThresholds);
    /**
     * Check if metrics meet budget
     */
    check(metrics: Partial<WebVitals> & {
        loadTime?: number;
        resourceSize?: number;
        requestCount?: number;
    }): BudgetResult;
    /**
     * Generate budget report
     */
    generateReport(metrics: Partial<WebVitals>): string;
}
export interface BudgetResult {
    passed: boolean;
    violations: BudgetViolation[];
    summary: string;
}
export interface BudgetViolation {
    metric: string;
    budget: number;
    actual: number;
    overage: number;
    percentage: string;
}
export declare function createWebVitalsCollector(page: any): WebVitalsCollector;
export declare function createLighthouseRunner(config?: LighthouseConfig): LighthouseRunner;
export declare function createLoadTester(config: LoadTestConfig): LoadTester;
declare const _default: {
    WebVitalsCollector: typeof WebVitalsCollector;
    LighthouseRunner: typeof LighthouseRunner;
    LoadTester: typeof LoadTester;
    ResourceProfiler: typeof ResourceProfiler;
    PerformanceBudget: typeof PerformanceBudget;
    createWebVitalsCollector: typeof createWebVitalsCollector;
    createLighthouseRunner: typeof createLighthouseRunner;
    createLoadTester: typeof createLoadTester;
};
export default _default;
//# sourceMappingURL=PerformanceTesting.d.ts.map