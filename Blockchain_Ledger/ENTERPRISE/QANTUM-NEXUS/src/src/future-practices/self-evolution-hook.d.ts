/**
 * 🧬 SELF-EVOLUTION HOOK ENGINE
 *
 * v1.0.0.0 Future Practice: Autonomous code refactoring with Git integration
 *
 * When SelfOptimizingEngine detects need for change, this module has the
 * authority to automatically commit refactored code to Git.
 *
 * Core Innovation:
 * - AI-driven code refactoring
 * - Automatic Git commits with semantic messages
 * - Non-breaking evolution strategy
 * - Rollback capability
 * - Code review queue for critical changes
 *
 * @version 1.0.0
 * @phase Future Practices - Self-Evolution
 * @author QANTUM AI Architect
 */
import { EventEmitter } from 'events';
interface EvolutionTrigger {
    triggerId: string;
    type: 'schema_change' | 'api_update' | 'performance_issue' | 'security_fix' | 'deprecation' | 'optimization';
    source: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    detectedAt: number;
    context: Record<string, any>;
}
interface EvolutionPlan {
    planId: string;
    trigger: EvolutionTrigger;
    affectedFiles: string[];
    changes: CodeChange[];
    strategy: EvolutionStrategy;
    estimatedImpact: number;
    requiresReview: boolean;
    status: 'pending' | 'approved' | 'executing' | 'committed' | 'rolled_back' | 'failed';
}
interface CodeChange {
    changeId: string;
    filePath: string;
    changeType: 'modify' | 'create' | 'delete' | 'rename';
    originalCode?: string;
    newCode?: string;
    description: string;
    breakingChange: boolean;
}
interface EvolutionStrategy {
    approach: 'non-breaking' | 'breaking-with-migration' | 'full-replacement';
    testFirst: boolean;
    createBackup: boolean;
    autoRollbackOnFailure: boolean;
    requireApproval: boolean;
}
interface GitCommit {
    commitHash: string;
    message: string;
    filesChanged: string[];
    timestamp: number;
    evolutionPlanId: string;
}
interface EvolutionConfig {
    workingDirectory: string;
    gitEnabled: boolean;
    autoCommit: boolean;
    branchPrefix: string;
    requireApprovalFor: EvolutionTrigger['severity'][];
    backupDirectory: string;
    maxAutoCommitsPerHour: number;
    semanticCommitMessages: boolean;
}
export declare class SelfEvolutionHookEngine extends EventEmitter {
    private config;
    private pendingPlans;
    private executedPlans;
    private commits;
    private autoCommitsThisHour;
    private lastHourReset;
    private static readonly TRANSFORMATIONS;
    constructor(config?: Partial<EvolutionConfig>);
    /**
     * 🚀 Initialize Self-Evolution Hook
     */
    initialize(): Promise<void>;
    /**
     * 🔍 Register evolution trigger
     */
    registerTrigger(trigger: Omit<EvolutionTrigger, 'triggerId' | 'detectedAt'>): EvolutionTrigger;
    /**
     * 📋 Create evolution plan
     */
    createEvolutionPlan(trigger: EvolutionTrigger): Promise<EvolutionPlan>;
    /**
     * Analyze affected files based on trigger
     */
    private analyzeAffectedFiles;
    /**
     * Generate code changes for trigger
     */
    private generateChanges;
    /**
     * Add field to TypeScript interface
     */
    private addFieldToInterface;
    /**
     * Determine evolution strategy
     */
    private determineStrategy;
    /**
     * Estimate impact score (0-100)
     */
    private estimateImpact;
    /**
     * ✅ Approve evolution plan
     */
    approvePlan(planId: string): boolean;
    /**
     * 🚀 Execute evolution plan
     */
    executePlan(planId: string): Promise<ExecutionResult>;
    /**
     * Apply single code change
     */
    private applyChange;
    /**
     * Create backup of affected files
     */
    private createBackup;
    /**
     * Rollback changes from backup
     */
    private rollback;
    /**
     * 📝 Commit changes to Git
     */
    private commitChanges;
    /**
     * Generate semantic commit message
     */
    private generateCommitMessage;
    /**
     * Check and reset hourly commit limit
     */
    private checkAndResetHourlyLimit;
    /**
     * 🔄 Quick evolve - trigger + plan + execute in one step
     */
    quickEvolve(type: EvolutionTrigger['type'], source: string, context: Record<string, any>, options?: {
        severity?: EvolutionTrigger['severity'];
        skipApproval?: boolean;
    }): Promise<ExecutionResult | null>;
    /**
     * 📊 Get evolution statistics
     */
    getStats(): EvolutionStats;
    private calculateSuccessRate;
    /**
     * Get pending plans requiring approval
     */
    getPendingApprovals(): EvolutionPlan[];
}
interface ExecutionResult {
    planId: string;
    success: boolean;
    filesModified: string[];
    backupPath: string;
    commitHash: string;
    errors: string[];
}
interface EvolutionStats {
    pendingPlans: number;
    executedPlans: number;
    totalCommits: number;
    commitsThisHour: number;
    maxCommitsPerHour: number;
    successRate: number;
}
export declare function createSelfEvolutionHook(config?: Partial<EvolutionConfig>): SelfEvolutionHookEngine;
export type { EvolutionTrigger, EvolutionPlan, CodeChange, EvolutionStrategy, GitCommit, EvolutionConfig, ExecutionResult, EvolutionStats };
//# sourceMappingURL=self-evolution-hook.d.ts.map