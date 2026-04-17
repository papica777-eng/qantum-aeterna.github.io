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
import { BaseAgent } from './base-agent';
import { AgentConfig, SwarmMessage, SwarmTask, TaskResult, CriticFeedback } from '../types';
/**
 * Critic Agent - Quality Assurance
 *
 * Responsibilities:
 * - Review task execution results
 * - Identify issues and failures
 * - Provide constructive feedback
 * - Approve or reject results
 */
export declare class CriticAgent extends BaseAgent {
    /** Feedback history */
    private feedbackHistory;
    /** Max history size */
    private maxHistorySize;
    /** Strict mode - reject on any issue */
    private strictMode;
    /** Quality threshold (0-1) */
    private qualityThreshold;
    constructor(config?: Partial<AgentConfig>);
    /**
     * Set strict mode
     */
    setStrictMode(strict: boolean): void;
    /**
     * Set quality threshold
     */
    setQualityThreshold(threshold: number): void;
    /**
     * Handle incoming message
     */
    protected handleMessage(message: SwarmMessage): Promise<SwarmMessage | null>;
    /**
     * Execute a task (critics don't execute directly)
     */
    executeTask(task: SwarmTask): Promise<TaskResult>;
    /**
     * Review a task result
     */
    reviewResult(result: TaskResult, task?: SwarmTask): Promise<CriticFeedback>;
    /**
     * Validate task-specific results
     */
    private validateTaskResult;
    /**
     * Suggest correction based on issues
     */
    private suggestCorrection;
    /**
     * Batch review multiple results
     */
    batchReview(results: TaskResult[], tasks?: SwarmTask[]): Promise<CriticFeedback[]>;
    /**
     * Get approval rate
     */
    getApprovalRate(): number;
    /**
     * Get common issues
     */
    getCommonIssues(): Record<string, number>;
    /**
     * Categorize issue into buckets
     */
    private categorizeIssue;
    /**
     * Store feedback
     */
    private storeFeedback;
    /**
     * Get feedback history
     */
    getFeedbackHistory(): CriticFeedback[];
    /**
     * Get feedback by task ID
     */
    getFeedbackByTask(taskId: string): CriticFeedback | undefined;
}
export default CriticAgent;
//# sourceMappingURL=critic-agent.d.ts.map