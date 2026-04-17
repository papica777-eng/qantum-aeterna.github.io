/**
 * 🐝 THE SWARM - Result Aggregator with WebSocket
 *
 * Real-time aggregation of distributed test results
 * with WebSocket streaming to dashboard.
 *
 * Features:
 * - Real-time result streaming
 * - Metric aggregation
 * - Live dashboard updates
 * - Historical data storage
 *
 * @version 1.0.0-QANTUM-PRIME
 * @phase 79-80
 */
import { EventEmitter } from 'events';
interface AggregatedMetrics {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    skippedTests: number;
    passRate: number;
    avgDuration: number;
    totalDuration: number;
    testsPerSecond: number;
    peakConcurrency: number;
    memoryUsed: number;
}
interface SwarmEvent {
    type: 'task:complete' | 'task:error' | 'worker:start' | 'worker:done' | 'swarm:progress' | 'swarm:complete';
    timestamp: number;
    data: any;
}
interface DashboardUpdate {
    type: 'metrics' | 'result' | 'progress' | 'alert';
    payload: any;
}
export declare class ResultAggregator extends EventEmitter {
    private results;
    private metrics;
    private timeline;
    private startTime;
    constructor();
    /**
     * Add result from worker
     */
    addResult(result: any): void;
    /**
     * Add error from worker
     */
    addError(error: any): void;
    /**
     * Get current aggregated metrics
     */
    getMetrics(): AggregatedMetrics;
    /**
     * Get all results
     */
    getResults(): any[];
    /**
     * Get timeline of events
     */
    getTimeline(): SwarmEvent[];
    /**
     * Generate summary report
     */
    generateSummary(): object;
    /**
     * Start aggregation session
     */
    startSession(): void;
    /**
     * End aggregation session
     */
    endSession(): object;
    private initializeMetrics;
    private updateMetrics;
    private recalculatePassRate;
    private getTopFailures;
    private getSlowestTests;
    private getWorkerPerformance;
}
export declare class SwarmWebSocketServer {
    private server;
    private clients;
    private aggregator;
    private port;
    constructor(aggregator: ResultAggregator, port?: number);
    /**
     * Start WebSocket server
     */
    start(): void;
    /**
     * Stop WebSocket server
     */
    stop(): void;
    /**
     * Broadcast message to all clients
     */
    broadcast(update: DashboardUpdate): void;
    /**
     * Send to specific subscribed clients
     */
    broadcastToSubscribers(channel: string, update: DashboardUpdate): void;
    private handleUpgrade;
    private handleMessage;
    private sendToClient;
    private closeClient;
    private setupAggregatorListeners;
}
export declare class DashboardConnector {
    private wsServer;
    private aggregator;
    constructor(port?: number);
    /**
     * Start dashboard connection
     */
    start(): void;
    /**
     * Stop dashboard connection
     */
    stop(): void;
    /**
     * Get aggregator for adding results
     */
    getAggregator(): ResultAggregator;
    /**
     * Manual broadcast
     */
    broadcast(update: DashboardUpdate): void;
}
export declare function createSwarmDashboard(port?: number): DashboardConnector;
export {};
//# sourceMappingURL=result-aggregator.d.ts.map