/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: METRICS & MONITORING
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Prometheus-compatible metrics, performance monitoring, alerting
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary';
export interface MetricConfig {
    name: string;
    help: string;
    type: MetricType;
    labels?: string[];
    buckets?: number[];
    percentiles?: number[];
}
export interface MetricValue {
    value: number;
    labels?: Record<string, string>;
    timestamp?: number;
}
export interface AlertRule {
    name: string;
    metric: string;
    condition: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
    threshold: number;
    duration?: number;
    labels?: Record<string, string>;
    handler: (alert: Alert) => void;
}
export interface Alert {
    rule: string;
    metric: string;
    value: number;
    threshold: number;
    labels: Record<string, string>;
    timestamp: Date;
    status: 'firing' | 'resolved';
}
declare abstract class Metric {
    protected config: MetricConfig;
    protected values: Map<string, number>;
    constructor(config: MetricConfig);
    abstract collect(): string;
    protected labelsKey(labels?: Record<string, string>): string;
    protected formatLabels(labelsKey: string): string;
}
export declare class Counter extends Metric {
    constructor(config: Omit<MetricConfig, 'type'>);
    inc(labels?: Record<string, string>, value?: number): void;
    get(labels?: Record<string, string>): number;
    reset(labels?: Record<string, string>): void;
    collect(): string;
}
export declare class Gauge extends Metric {
    constructor(config: Omit<MetricConfig, 'type'>);
    set(value: number, labels?: Record<string, string>): void;
    inc(labels?: Record<string, string>, value?: number): void;
    dec(labels?: Record<string, string>, value?: number): void;
    get(labels?: Record<string, string>): number;
    setToCurrentTime(labels?: Record<string, string>): void;
    collect(): string;
}
export declare class Histogram extends Metric {
    private bucketValues;
    private sums;
    private counts;
    private buckets;
    constructor(config: Omit<MetricConfig, 'type'> & {
        buckets?: number[];
    });
    observe(value: number, labels?: Record<string, string>): void;
    timer(labels?: Record<string, string>): () => number;
    collect(): string;
}
export declare class Summary extends Metric {
    private observations;
    private percentiles;
    constructor(config: Omit<MetricConfig, 'type'> & {
        percentiles?: number[];
    });
    observe(value: number, labels?: Record<string, string>): void;
    collect(): string;
}
export declare class MetricsRegistry {
    private metrics;
    private prefix;
    constructor(prefix?: string);
    createCounter(config: Omit<MetricConfig, 'type'>): Counter;
    createGauge(config: Omit<MetricConfig, 'type'>): Gauge;
    createHistogram(config: Omit<MetricConfig, 'type'> & {
        buckets?: number[];
    }): Histogram;
    createSummary(config: Omit<MetricConfig, 'type'> & {
        percentiles?: number[];
    }): Summary;
    getMetric(name: string): Metric | undefined;
    collect(): string;
}
export declare class AlertManager extends EventEmitter {
    private rules;
    private activeAlerts;
    private checkInterval?;
    private registry;
    constructor(registry: MetricsRegistry);
    addRule(rule: AlertRule): this;
    removeRule(name: string): boolean;
    start(intervalMs?: number): void;
    stop(): void;
    private checkAlerts;
    private evaluateCondition;
    getActiveAlerts(): Alert[];
}
export declare class MindEngineMetrics {
    private registry;
    readonly testsTotal: Counter;
    readonly testsPassed: Counter;
    readonly testsFailed: Counter;
    readonly testsSkipped: Counter;
    readonly testDuration: Histogram;
    readonly browsersActive: Gauge;
    readonly pagesActive: Gauge;
    readonly navigationDuration: Histogram;
    readonly actionsTotal: Counter;
    readonly actionDuration: Histogram;
    readonly actionErrors: Counter;
    readonly healingAttempts: Counter;
    readonly healingSuccess: Counter;
    readonly healingDuration: Histogram;
    readonly memoryUsage: Gauge;
    readonly cpuUsage: Gauge;
    readonly uptime: Gauge;
    constructor(prefix?: string);
    private startSystemMetrics;
    collect(): string;
    getRegistry(): MetricsRegistry;
}
export declare function createMetrics(prefix?: string): MindEngineMetrics;
declare const _default: {
    MetricsRegistry: typeof MetricsRegistry;
    Counter: typeof Counter;
    Gauge: typeof Gauge;
    Histogram: typeof Histogram;
    Summary: typeof Summary;
    AlertManager: typeof AlertManager;
    MindEngineMetrics: typeof MindEngineMetrics;
    createMetrics: typeof createMetrics;
};
export default _default;
//# sourceMappingURL=Metrics.d.ts.map