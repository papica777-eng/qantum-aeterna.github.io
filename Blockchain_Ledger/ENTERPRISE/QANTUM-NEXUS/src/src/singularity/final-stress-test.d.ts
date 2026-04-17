/**
 * 🔥 FINAL STRESS TEST - Maximum Load Validation
 *
 * Ultimate stress test for QANTUM:
 * - Run all 100 phases simultaneously
 * - Maximum parallel workers
 * - Memory and CPU stress testing
 * - Network saturation tests
 * - Recovery and stability validation
 *
 * Goal: 100% stability under maximum load
 *
 * @version 1.0.0
 * @phase 96-100 - The Singularity
 */
import { EventEmitter } from 'events';
interface StressTestConfig {
    duration: number;
    maxWorkers: number;
    targetCPU: number;
    targetMemory: number;
    phases: string[];
    reportInterval: number;
}
interface SystemMetrics {
    timestamp: number;
    cpu: number;
    memory: {
        used: number;
        total: number;
        percentage: number;
    };
    heap: {
        used: number;
        total: number;
    };
    activeWorkers: number;
    completedTasks: number;
    failedTasks: number;
    throughput: number;
}
interface PhaseResult {
    phase: string;
    status: 'passed' | 'failed' | 'timeout';
    duration: number;
    errors: string[];
    metrics: {
        peakCPU: number;
        peakMemory: number;
        averageLatency: number;
    };
}
interface StressTestReport {
    startTime: number;
    endTime: number;
    duration: number;
    totalPhases: number;
    passedPhases: number;
    failedPhases: number;
    passRate: number;
    systemStability: number;
    peakMetrics: {
        maxCPU: number;
        maxMemory: number;
        maxWorkers: number;
    };
    phaseResults: PhaseResult[];
    recommendations: string[];
}
declare const ALL_PHASES: string[];
export declare class FinalStressTest extends EventEmitter {
    private config;
    private metrics;
    private phaseResults;
    private isRunning;
    private startTime;
    constructor(config?: Partial<StressTestConfig>);
    /**
     * 🔥 Run full stress test
     */
    run(): Promise<StressTestReport>;
    /**
     * Run all phases simultaneously
     */
    private runAllPhases;
    /**
     * Run individual phase
     */
    private runPhase;
    /**
     * Simulate CPU work
     */
    private simulateCPUWork;
    /**
     * Collect system metrics
     */
    private collectMetrics;
    /**
     * Estimate CPU usage
     */
    private estimateCPU;
    /**
     * Calculate throughput
     */
    private calculateThroughput;
    /**
     * Get latest metrics
     */
    private getLatestMetrics;
    /**
     * Generate final report
     */
    private generateReport;
    /**
     * Display report
     */
    private displayReport;
    /**
     * Chunk array into batches
     */
    private chunkArray;
}
export declare function createStressTest(config?: Partial<StressTestConfig>): FinalStressTest;
export { ALL_PHASES };
export type { StressTestConfig, StressTestReport, PhaseResult, SystemMetrics };
//# sourceMappingURL=final-stress-test.d.ts.map