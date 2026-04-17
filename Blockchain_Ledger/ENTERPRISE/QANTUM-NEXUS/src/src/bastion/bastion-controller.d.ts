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
 * For licensing inquiries: dimitar.papazov@QAntum.dev
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'node:events';
import { SandboxExecutor } from './sandbox/sandbox-executor';
import { WorkerPoolManager } from './workers/worker-pool';
import { MemoryHardeningManager } from './memory/memory-hardening';
import { NeuralVault } from './neural/neural-vault';
import { ChecksumValidator } from './neural/checksum-validator';
import { CircuitBreakerManager } from './circuit/circuit-breaker';
import { HealthCheckSystem } from './health/health-check';
import { BastionConfig, BastionStats, SecurityViolation, MutationValidation, ServiceProvider, SystemHealth } from './types';
/**
 * Bastion Controller
 *
 * Central hub for all security and infrastructure operations.
 */
export declare class BastionController extends EventEmitter {
    private config;
    private sandbox;
    private workerPool;
    private memoryManager;
    private vault;
    private checksum;
    private circuitBreaker;
    private healthCheck;
    private isInitialized;
    private startTime;
    constructor(config?: BastionConfig);
    /**
     * Initialize the Bastion with vault password
     * @param vaultPassword - Password for encrypted storage
     */
    initialize(vaultPassword: string): Promise<void>;
    /**
     * Validate a mutation in sandbox
     * @param mutationId - Mutation identifier
     * @param mutationCode - Code to validate
     * @param context - Test context
     */
    validateMutation(mutationId: string, mutationCode: string, context?: Record<string, unknown>): Promise<MutationValidation>;
    /**
     * Get sandbox violations
     */
    getViolations(): SecurityViolation[];
    /**
     * Submit a task to the worker pool
     * @param type - Task type
     * @param payload - Task payload
     * @param options - Task options
     */
    submitTask<T = unknown, R = unknown>(type: string, payload: T, options?: {
        priority?: number;
        timeout?: number;
    }): Promise<R>;
    /**
     * Scale worker pool
     * @param targetCount - Target worker count
     */
    scaleWorkers(targetCount: number): void;
    /**
     * Get worker pool stats
     */
    getWorkerStats(): import("./types").WorkerPoolStats;
    /**
     * Register a browser instance for tracking
     * @param browser - Browser instance
     * @param instanceId - Unique ID
     */
    trackBrowser(browser: object, instanceId: string): void;
    /**
     * Track a resource with cleanup
     * @param type - Resource type
     * @param resource - Resource object
     * @param resourceId - Resource ID
     * @param cleanup - Cleanup callback
     */
    trackResource(type: 'browser' | 'page' | 'ghost' | 'mutation' | 'worker' | 'socket' | 'stream', resource: object, resourceId: string, cleanup?: () => void | Promise<void>): void;
    /**
     * Get memory stats
     */
    getMemoryStats(): {
        heapUsed: number;
        heapTotal: number;
        external: number;
        rss: number;
        activeResources: number;
        peakResources: number;
        uptime: number;
    };
    /**
     * Store data in encrypted vault
     * @param id - Entry ID
     * @param type - Entry type
     * @param data - Data to store
     */
    storeSecure(id: string, type: 'ghost_knowledge' | 'predictions' | 'mutations' | 'versions' | 'metrics', data: unknown): Promise<import("./types").VaultEntry>;
    /**
     * Retrieve data from vault
     * @param id - Entry ID
     */
    retrieveSecure<T = unknown>(id: string): Promise<T | null>;
    /**
     * Save vault to disk
     */
    saveVault(): Promise<void>;
    /**
     * Generate checksum for data
     * @param data - Data to hash
     */
    generateChecksum(data: unknown): string;
    /**
     * Verify data checksum
     * @param data - Data to verify
     * @param expectedHash - Expected hash
     */
    verifyChecksum(data: unknown, expectedHash: string): boolean;
    /**
     * Execute request with circuit breaker
     * @param requestFn - Request function
     * @param options - Options
     */
    executeWithFallback<T>(requestFn: (service: ServiceProvider) => Promise<T>, options?: {
        service?: ServiceProvider;
        timeout?: number;
    }): Promise<T>;
    /**
     * Get active service
     */
    getActiveService(): ServiceProvider;
    /**
     * Set primary service
     * @param service - Primary service
     */
    setPrimaryService(service: ServiceProvider): void;
    /**
     * Get circuit breaker stats
     */
    getCircuitStats(): {
        requestCount: number;
        failedCount: number;
        tripCount: number;
        failoverCount: number;
        activeService: ServiceProvider;
        uptime: number;
    };
    /**
     * Get system health
     */
    getHealth(): Promise<SystemHealth>;
    /**
     * Get health trend
     */
    getHealthTrend(): {
        trend: "improving" | "stable" | "degrading";
        avgHealth: number;
        avgMemory: number;
        avgCpu: number;
    };
    /**
     * Register custom health check
     * @param name - Check name
     * @param checkFn - Check function
     */
    registerHealthCheck(name: string, checkFn: () => Promise<{
        healthy: boolean;
        message: string;
        metrics?: Record<string, number>;
    }>): void;
    /**
     * Get comprehensive stats
     */
    getStats(): BastionStats;
    /**
     * Check if initialized
     */
    isReady(): boolean;
    /**
     * Set up event forwarding from components
     */
    private setupEventForwarding;
    /**
     * Register health checks for all components
     */
    private registerHealthChecks;
    /**
     * Ensure Bastion is initialized
     */
    private ensureInitialized;
    /**
     * Log with verbose check
     */
    private log;
    /**
     * Shutdown all components
     */
    shutdown(): Promise<void>;
    /**
     * Get component references for advanced usage
     */
    getComponents(): {
        sandbox: SandboxExecutor;
        workerPool: WorkerPoolManager;
        memoryManager: MemoryHardeningManager;
        vault: NeuralVault;
        checksum: ChecksumValidator;
        circuitBreaker: CircuitBreakerManager;
        healthCheck: HealthCheckSystem;
    };
}
export default BastionController;
//# sourceMappingURL=bastion-controller.d.ts.map