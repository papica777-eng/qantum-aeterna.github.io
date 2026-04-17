/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ZERO-DOWNTIME HOT-SWAP SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Corporate-Grade Deployment Without Stopping:
 * - Blue-Green deployment
 * - Rolling updates
 * - Hot module replacement
 * - State migration
 * - Graceful traffic shifting
 * - Rollback capability
 *
 * Features:
 * - Zero downtime deployments
 * - Automatic health checks
 * - Traffic shadowing for canary releases
 * - State persistence across updates
 * - Automatic rollback on failure
 */
import { EventEmitter } from 'events';
/**
 * Deployment strategies
 */
export declare enum DeploymentStrategy {
    BLUE_GREEN = "blue-green",
    ROLLING = "rolling",
    CANARY = "canary",
    IMMEDIATE = "immediate"
}
/**
 * Module version info
 */
export interface ModuleVersion {
    version: string;
    path: string;
    checksum: string;
    timestamp: number;
    healthy: boolean;
}
/**
 * Deployment configuration
 */
export interface DeploymentConfig {
    strategy: DeploymentStrategy;
    healthCheckInterval?: number;
    healthCheckTimeout?: number;
    trafficShiftDuration?: number;
    rollbackOnError?: boolean;
}
/**
 * Hot-Swap Manager
 *
 * Enables zero-downtime updates in corporate environments
 */
export declare class HotSwapManager extends EventEmitter {
    private modules;
    private healthCheckIntervals;
    private deploymentConfig;
    constructor(config?: Partial<DeploymentConfig>);
    /**
     * Register a module for hot-swapping
     */
    registerModule(moduleName: string, version: string, modulePath: string): void;
    /**
     * Deploy a new version of a module without downtime
     */
    deployUpdate(moduleName: string, newVersion: string, newModulePath: string): Promise<void>;
    /**
     * Blue-Green deployment
     *
     * Instantly switch traffic from old to new version
     */
    private blueGreenDeploy;
    /**
     * Rolling deployment
     *
     * Gradually shift traffic to new version
     */
    private rollingDeploy;
    /**
     * Canary deployment
     *
     * Shadow traffic to test new version before full rollout
     */
    private canaryDeploy;
    /**
     * Immediate deployment (for emergencies)
     */
    private immediateDeploy;
    /**
     * Rollback to previous version
     */
    rollback(moduleName: string, targetVersion: ModuleVersion): Promise<void>;
    /**
     * Perform health check on module version
     */
    private performHealthCheck;
    /**
     * Monitor canary deployment
     */
    private monitorCanary;
    /**
     * Start continuous health checks for a module
     */
    private startHealthChecks;
    /**
     * Prepare module for deployment
     */
    private prepareModule;
    /**
     * Load module
     */
    private loadModule;
    /**
     * Switch traffic to new version
     */
    private switchTraffic;
    /**
     * Gradually shift traffic
     */
    private shiftTraffic;
    /**
     * Calculate file checksum
     */
    private calculateChecksum;
    /**
     * Sleep utility
     */
    private sleep;
    /**
     * Get module status
     */
    getModuleStatus(moduleName: string): {
        active: ModuleVersion;
        staging?: ModuleVersion;
        previousVersions: ModuleVersion[];
    } | undefined;
    /**
     * Shutdown hot-swap manager
     */
    shutdown(): Promise<void>;
}
export declare function getHotSwapManager(config?: Partial<DeploymentConfig>): HotSwapManager;
//# sourceMappingURL=zero-downtime.d.ts.map