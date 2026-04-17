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
 * Docker container configuration
 */
export interface ContainerConfig {
    /** Container name */
    name: string;
    /** Browser type */
    browser: 'chrome' | 'firefox' | 'edge';
    /** Number of instances */
    instances: number;
    /** Memory limit */
    memoryLimit: string;
    /** CPU limit */
    cpuLimit: string;
    /** Enable VNC for debugging */
    enableVnc: boolean;
    /** VNC port (if enabled) */
    vncPort?: number;
    /** Selenium port */
    seleniumPort: number;
    /** Environment variables */
    env?: Record<string, string>;
}
/**
 * Docker Compose service
 */
export interface DockerService {
    image: string;
    container_name: string;
    ports: string[];
    environment: string[];
    depends_on?: string[];
    deploy?: {
        resources: {
            limits: {
                cpus: string;
                memory: string;
            };
        };
    };
    shm_size?: string;
    volumes?: string[];
    networks?: string[];
}
/**
 * Grid configuration
 */
export interface GridConfig {
    /** Hub port */
    hubPort: number;
    /** Maximum sessions */
    maxSessions: number;
    /** Session timeout (seconds) */
    sessionTimeout: number;
    /** Browser nodes */
    nodes: ContainerConfig[];
    /** Network name */
    networkName: string;
    /** Enable video recording */
    enableVideo: boolean;
    /** Video output path */
    videoPath?: string;
}
/**
 * Container status
 */
export interface ContainerStatus {
    id: string;
    name: string;
    status: 'running' | 'stopped' | 'created' | 'exited' | 'unknown';
    ports: string[];
    health: 'healthy' | 'unhealthy' | 'starting' | 'none';
    uptime?: string;
}
/**
 * Grid status
 */
export interface GridStatus {
    hub: ContainerStatus | null;
    nodes: ContainerStatus[];
    totalSessions: number;
    availableSessions: number;
    queuedSessions: number;
}
export declare class DockerManager extends EventEmitter {
    private config;
    private outputDir;
    private isGridRunning;
    private composeProcess;
    constructor(config?: Partial<GridConfig>);
    /**
     * Generate Dockerfile for custom test runner
     */
    generateDockerfile(): string;
    /**
     * Generate docker-compose.yml for Selenium Grid
     */
    generateDockerCompose(): string;
    /**
     * Generate Playwright docker-compose
     */
    generatePlaywrightCompose(): string;
    /**
     * Write Docker files to disk
     */
    writeDockerFiles(): Promise<{
        dockerfile: string;
        compose: string;
    }>;
    /**
     * Start Selenium Grid
     */
    startGrid(): Promise<void>;
    /**
     * Stop Selenium Grid
     */
    stopGrid(): Promise<void>;
    /**
     * Get grid status
     */
    getGridStatus(): Promise<GridStatus>;
    /**
     * Check Docker availability
     */
    checkDockerAvailable(): Promise<boolean>;
    /**
     * Get hub session info
     */
    private getHubSessionInfo;
    private parseContainerStatus;
    private toYaml;
    /**
     * Get configuration
     */
    getConfig(): GridConfig;
    /**
     * Check if grid is running
     */
    isRunning(): boolean;
    /**
     * Get hub URL
     */
    getHubUrl(): string;
}
export default DockerManager;
//# sourceMappingURL=docker-manager.d.ts.map