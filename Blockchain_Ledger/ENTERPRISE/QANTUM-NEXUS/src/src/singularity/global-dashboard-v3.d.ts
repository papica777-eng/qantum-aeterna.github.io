/**
 * 🌍 GLOBAL DASHBOARD V3 - World Map Visualization
 *
 * Real-time visualization of Swarm instances across the globe:
 * - Interactive world map with node locations
 * - WebSocket-powered live updates
 * - Performance metrics per region
 * - Animated data flows
 *
 * "See your tests run across the planet"
 *
 * @version 1.0.0
 * @phase 96-100 - The Singularity
 */
import { EventEmitter } from 'events';
interface DashboardConfig {
    port: number;
    wsPort: number;
    refreshRate: number;
    enableAnimations: boolean;
    theme: 'neon' | 'dark' | 'light';
}
interface SwarmNode {
    id: string;
    provider: 'aws' | 'azure' | 'gcp' | 'local';
    region: string;
    location: {
        lat: number;
        lng: number;
    };
    status: 'active' | 'idle' | 'error' | 'scaling';
    workers: number;
    maxWorkers: number;
    currentTasks: number;
    completedTasks: number;
    avgResponseTime: number;
    lastHeartbeat: number;
    metrics: NodeMetrics;
}
interface NodeMetrics {
    cpu: number;
    memory: number;
    network: number;
    testsPerSecond: number;
    errorRate: number;
    uptime: number;
}
interface GlobalMetrics {
    totalNodes: number;
    activeNodes: number;
    totalWorkers: number;
    activeWorkers: number;
    testsRunning: number;
    testsCompleted: number;
    testsPerSecond: number;
    avgLatency: number;
    errorRate: number;
    regionsActive: string[];
}
interface TestFlow {
    id: string;
    from: string;
    to: string;
    testName: string;
    status: 'running' | 'complete' | 'failed';
    progress: number;
    startTime: number;
}
export declare class GlobalDashboardV3 extends EventEmitter {
    private config;
    private httpServer;
    private wsServer;
    private clients;
    private nodes;
    private testFlows;
    private globalMetrics;
    private updateInterval;
    constructor(config?: Partial<DashboardConfig>);
    /**
     * 🚀 Start the dashboard server
     */
    start(): Promise<void>;
    /**
     * Start HTTP server with dashboard
     */
    private startHttpServer;
    /**
     * Start WebSocket server for real-time updates
     */
    private startWebSocketServer;
    /**
     * Start update loop
     */
    private startUpdateLoop;
    /**
     * Broadcast update to all clients
     */
    private broadcastUpdate;
    /**
     * Update simulation (for demo purposes)
     */
    private updateSimulation;
    /**
     * Update global metrics
     */
    private updateGlobalMetrics;
    /**
     * Update test flows animation
     */
    private updateTestFlows;
    /**
     * Initialize demo nodes
     */
    private initializeDemoNodes;
    /**
     * Register a new swarm node
     */
    registerNode(node: SwarmNode): void;
    /**
     * Add a test flow (animation)
     */
    addTestFlow(fromNodeId: string, toNodeId: string, testName: string): void;
    /**
     * Generate the dashboard HTML
     */
    private generateDashboardHTML;
    /**
     * Generate simplified world map SVG
     */
    private generateWorldMapSVG;
    /**
     * Initialize empty metrics
     */
    private initializeMetrics;
    /**
     * Stop the dashboard
     */
    stop(): void;
}
export declare function createGlobalDashboard(config?: Partial<DashboardConfig>): GlobalDashboardV3;
export type { SwarmNode, GlobalMetrics, TestFlow };
//# sourceMappingURL=global-dashboard-v3.d.ts.map