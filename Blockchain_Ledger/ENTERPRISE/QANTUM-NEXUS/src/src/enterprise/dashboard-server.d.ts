/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * QAntum
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * @copyright 2025 Димитър Продромов (Dimitar Prodromov). All Rights Reserved.
 * @license PROPRIETARY AND CONFIDENTIAL
 *
 * This file is part of QAntum.
 * Unauthorized copying, modification, distribution, or use of this file,
 * via any medium, is strictly prohibited without express written permission.
 *
 * For licensing inquiries: dimitar.prodromov@QAntum.dev
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
/**
 * Dashboard configuration
 */
export interface DashboardConfig {
    /** Server port */
    port: number;
    /** Host to bind */
    host: string;
    /** Update interval (ms) */
    updateInterval: number;
    /** Max log entries to keep */
    maxLogEntries: number;
    /** Enable authentication */
    requireAuth: boolean;
    /** Auth token (if enabled) */
    authToken?: string;
}
/**
 * System telemetry data
 */
export interface TelemetryData {
    timestamp: number;
    cpu: {
        temperature: number;
        usage: number;
        cores: number;
        model: string;
        perCore: number[];
    };
    memory: {
        total: number;
        used: number;
        free: number;
        percent: number;
    };
    system: {
        platform: string;
        uptime: number;
        hostname: string;
    };
}
/**
 * Docker container info
 */
export interface ContainerInfo {
    id: string;
    name: string;
    status: 'running' | 'stopped' | 'exited' | 'unknown';
    image: string;
    ports: string[];
    health: 'healthy' | 'unhealthy' | 'starting' | 'none';
    cpuPercent: number;
    memoryUsage: string;
}
/**
 * Activity log entry
 */
export interface LogEntry {
    id: string;
    timestamp: number;
    level: 'info' | 'success' | 'warning' | 'error' | 'debug';
    message: string;
    source: string;
    details?: Record<string, unknown>;
}
/**
 * Dashboard state
 */
export interface DashboardState {
    telemetry: TelemetryData;
    containers: ContainerInfo[];
    logs: LogEntry[];
    swarm: {
        activeSoldiers: number;
        queueLength: number;
        completedTasks: number;
        thermalState: string;
    };
    tests: {
        running: boolean;
        passed: number;
        failed: number;
        current: string;
    };
}
export declare class DashboardServer extends EventEmitter {
    private config;
    private server;
    private wss;
    private clients;
    private updateInterval;
    private state;
    private logIdCounter;
    private lastCpuInfo;
    private temperatureHistory;
    private usageHistory;
    constructor(config?: Partial<DashboardConfig>);
    /**
     * Initialize empty state
     */
    private initializeState;
    /**
     * Start the dashboard server
     */
    start(): Promise<void>;
    /**
     * Stop the dashboard server
     */
    stop(): Promise<void>;
    /**
     * Handle HTTP requests
     */
    private handleHttpRequest;
    /**
     * Serve JSON response
     */
    private serveJson;
    /**
     * Serve HTML dashboard
     */
    private serveHtml;
    /**
     * Handle WebSocket connection
     */
    private handleWebSocketConnection;
    /**
     * Handle client message
     */
    private handleClientMessage;
    /**
     * Broadcast to all clients
     */
    private broadcast;
    /**
     * Start the update loop
     */
    private startUpdateLoop;
    /**
     * Update telemetry data
     */
    private updateTelemetry;
    /**
     * Add log entry
     */
    log(level: LogEntry['level'], message: string, source: string, details?: Record<string, unknown>): void;
    /**
     * Log Bulgarian activity messages
     */
    logActivity(message: string, source?: string): void;
    /**
     * Log success
     */
    logSuccess(message: string, source?: string): void;
    /**
     * Log warning
     */
    logWarning(message: string, source?: string): void;
    /**
     * Log error
     */
    logError(message: string, source?: string): void;
    /**
     * Update container status
     */
    updateContainers(containers: ContainerInfo[]): void;
    /**
     * Add container
     */
    addContainer(container: ContainerInfo): void;
    /**
     * Remove container
     */
    removeContainer(containerId: string): void;
    /**
     * Update swarm status
     */
    updateSwarm(swarmState: DashboardState['swarm']): void;
    /**
     * Update test status
     */
    updateTests(testState: DashboardState['tests']): void;
    /**
     * Generate dashboard HTML
     */
    private generateDashboardHtml;
    /**
     * Get server URL
     */
    getUrl(): string;
    /**
     * Get current state
     */
    getState(): DashboardState;
    /**
     * Get connected client count
     */
    getClientCount(): number;
    /**
     * Check if server is running
     */
    isRunning(): boolean;
}
export default DashboardServer;
//# sourceMappingURL=dashboard-server.d.ts.map