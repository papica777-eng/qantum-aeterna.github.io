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
/**
 * Result of syntax validation
 */
export interface SyntaxValidationResult {
    valid: boolean;
    errors: SyntaxError[];
    warnings: string[];
    parsedAST?: unknown;
}
/**
 * Syntax error details
 */
export interface SyntaxError {
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning';
}
/**
 * Result of logic validation
 */
export interface LogicValidationResult {
    valid: boolean;
    issues: LogicIssue[];
    metrics: CodeMetrics;
}
/**
 * Logic issue found in code
 */
export interface LogicIssue {
    type: 'infinite-loop' | 'unreachable' | 'side-effect' | 'memory-leak' | 'security' | 'performance';
    message: string;
    line?: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    suggestion?: string;
}
/**
 * Code metrics
 */
export interface CodeMetrics {
    lineCount: number;
    complexity: number;
    nestingDepth: number;
    functionCount: number;
    asyncOperations: number;
    dangerousPatterns: string[];
}
/**
 * Sandbox execution result
 */
export interface SandboxExecutionResult {
    success: boolean;
    result?: unknown;
    error?: string;
    executionTime: number;
    memoryUsed: number;
    violations: SecurityViolation[];
    output: string[];
}
/**
 * Security violation
 */
export interface SecurityViolation {
    type: 'filesystem' | 'network' | 'process' | 'eval' | 'prototype' | 'timeout' | 'memory';
    operation: string;
    blocked: boolean;
    timestamp: Date;
}
/**
 * Full validation report
 */
export interface ValidationReport {
    id: string;
    code: string;
    timestamp: Date;
    syntax: SyntaxValidationResult;
    logic: LogicValidationResult;
    sandbox: SandboxExecutionResult;
    approved: boolean;
    approvalReason: string;
    score: number;
}
/**
 * Logic Gate configuration
 */
export interface LogicGateConfig {
    maxExecutionTime?: number;
    maxMemory?: number;
    maxComplexity?: number;
    maxNestingDepth?: number;
    allowedPatterns?: RegExp[];
    forbiddenPatterns?: RegExp[];
    requiredPatterns?: RegExp[];
    autoApproveThreshold?: number;
}
/**
 * 🧪 AI Logic Gate
 *
 * Three-phase validation for AI-generated code:
 * 1. Syntax Validation - Check for valid JavaScript/TypeScript
 * 2. Logic Validation - Check for dangerous patterns and code quality
 * 3. Sandbox Execution - Test in isolated environment
 *
 * Only code that passes all three phases is approved for production.
 */
export declare class AILogicGate extends EventEmitter {
    private config;
    private validationHistory;
    private approvalCount;
    private rejectionCount;
    private startTime;
    constructor(config?: LogicGateConfig);
    /**
     * Validate AI-generated code through all gates
     * @param code - Code to validate
     * @param context - Optional execution context
     * @returns Full validation report
     */
    validate(code: string, context?: Record<string, unknown>): Promise<ValidationReport>;
    /**
     * Phase 1: Syntax Validation
     * Checks if code is syntactically valid JavaScript
     */
    private validateSyntax;
    /**
     * Phase 2: Logic Validation
     * Checks for dangerous patterns and code quality
     */
    private validateLogic;
    /**
     * Calculate code metrics
     */
    private calculateMetrics;
    /**
     * Phase 3: Sandbox Execution
     * Executes code in isolated environment
     */
    private executeInSandbox;
    /**
     * Create secure sandbox with trapped globals
     */
    private createSecureSandbox;
    /**
     * Calculate approval score (0-100)
     */
    private calculateScore;
    /**
     * Generate human-readable approval reason
     */
    private generateApprovalReason;
    /**
     * Generate unique report ID
     */
    private generateReportId;
    /**
     * Get validation statistics
     */
    getStats(): {
        totalValidations: number;
        approved: number;
        rejected: number;
        approvalRate: number;
        uptime: number;
    };
    /**
     * Get recent validation reports
     * @param count - Number of reports to return
     */
    getRecentReports(count?: number): ValidationReport[];
    /**
     * Clear validation history
     */
    clearHistory(): void;
}
export default AILogicGate;
//# sourceMappingURL=logic-gate.d.ts.map