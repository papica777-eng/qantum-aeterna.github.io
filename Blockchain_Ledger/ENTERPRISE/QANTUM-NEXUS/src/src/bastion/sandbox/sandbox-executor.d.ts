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
import { SecurityPolicy, SandboxResult, SecurityViolation, MutationValidation, SandboxConfig } from '../types';
/**
 * Sandboxed Mutation Executor
 *
 * Provides a secure execution environment for testing mutations
 * before they are applied to the live system.
 */
export declare class SandboxExecutor extends EventEmitter {
    private config;
    private violations;
    private executionCount;
    private blockedCount;
    private startTime;
    constructor(config?: SandboxConfig);
    /**
     * Execute code in a sandboxed environment
     * @param code - Code to execute
     * @param context - Optional context variables
     * @param policy - Optional security policy override
     */
    execute(code: string, context?: Record<string, unknown>, policy?: Partial<SecurityPolicy>): Promise<SandboxResult>;
    /**
     * Execute mutation code and validate safety
     * @param mutationId - Unique mutation identifier
     * @param mutationCode - Mutation code to test
     * @param testContext - Test context for validation
     */
    validateMutation(mutationId: string, mutationCode: string, testContext?: Record<string, unknown>): Promise<MutationValidation>;
    /**
     * Create sandbox object with security traps
     */
    private createSandbox;
    /**
     * Create a security violation record
     */
    private createViolation;
    /**
     * Handle a security violation
     */
    private handleViolation;
    /**
     * Default violation handler
     */
    private defaultViolationHandler;
    /**
     * Estimate memory usage of a result
     */
    private estimateMemoryUsage;
    /**
     * Get all recorded violations
     */
    getViolations(): SecurityViolation[];
    /**
     * Get executor statistics
     */
    getStats(): {
        executionCount: number;
        blockedCount: number;
        violationCount: number;
        uptime: number;
    };
    /**
     * Clear violation history
     */
    clearViolations(): void;
    /**
     * Check if sandbox is enabled
     */
    isEnabled(): boolean;
}
export default SandboxExecutor;
//# sourceMappingURL=sandbox-executor.d.ts.map