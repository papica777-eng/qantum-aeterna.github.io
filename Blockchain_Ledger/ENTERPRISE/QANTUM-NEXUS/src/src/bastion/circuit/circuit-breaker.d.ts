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
import { CircuitState, ServiceProvider, ServiceHealth, FallbackChain, CircuitBreakerConfig, HealthCheckResult, SystemHealth } from '../types';
/**
 * Request options
 */
export interface RequestOptions {
    service?: ServiceProvider;
    timeout?: number;
    retries?: number;
    fallbackEnabled?: boolean;
}
/**
 * Circuit Breaker Manager
 *
 * Provides fault tolerance for AI service calls with automatic failover.
 */
export declare class CircuitBreakerManager extends EventEmitter {
    private config;
    private circuits;
    private serviceHealth;
    private fallbackChain;
    private healthCheckInterval?;
    private startTime;
    private tripCount;
    private requestCount;
    private failedCount;
    constructor(config?: CircuitBreakerConfig);
    /**
     * Initialize a circuit for a service
     */
    private initializeCircuit;
    /**
     * Execute a request with circuit breaker protection
     * @param requestFn - Function that makes the actual request
     * @param options - Request options
     */
    execute<T>(requestFn: (service: ServiceProvider) => Promise<T>, options?: RequestOptions): Promise<T>;
    /**
     * Execute with fallback chain
     */
    private executeWithFallback;
    /**
     * Execute with timeout
     */
    private executeWithTimeout;
    /**
     * Check if circuit allows requests
     */
    canRequest(service: ServiceProvider): boolean;
    /**
     * Record successful request
     */
    private recordSuccess;
    /**
     * Record failed request
     */
    private recordFailure;
    /**
     * Transition circuit to new state
     */
    private transitionTo;
    /**
     * Get available services in fallback order
     */
    private getAvailableServices;
    /**
     * Start health check monitoring
     */
    private startHealthChecks;
    /**
     * Perform health checks on all services
     */
    performHealthChecks(): Promise<HealthCheckResult[]>;
    /**
     * Check health of a specific service
     */
    private checkServiceHealth;
    /**
     * Get circuit state for a service
     */
    getCircuitState(service: ServiceProvider): CircuitState | undefined;
    /**
     * Get all service health
     */
    getAllServiceHealth(): ServiceHealth[];
    /**
     * Get fallback chain info
     */
    getFallbackChain(): FallbackChain;
    /**
     * Get active service
     */
    getActiveService(): ServiceProvider;
    /**
     * Force circuit state
     */
    forceState(service: ServiceProvider, state: CircuitState): void;
    /**
     * Reset all circuits
     */
    resetAll(): void;
    /**
     * Set primary service
     */
    setPrimary(service: ServiceProvider): void;
    /**
     * Get system health overview
     */
    getSystemHealth(): Promise<SystemHealth>;
    /**
     * Get statistics
     */
    getStats(): {
        requestCount: number;
        failedCount: number;
        tripCount: number;
        failoverCount: number;
        activeService: ServiceProvider;
        uptime: number;
    };
    /**
     * Check if circuit breaker is enabled
     */
    isEnabled(): boolean;
    /**
     * Shutdown
     */
    shutdown(): void;
}
export default CircuitBreakerManager;
//# sourceMappingURL=circuit-breaker.d.ts.map