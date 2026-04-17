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
import { AgentConfig, SwarmMessage, SwarmTask, TaskResult } from '../types';
/**
 * Executor Agent - Task Execution
 *
 * Responsibilities:
 * - Execute browser automation tasks
 * - Run local LLM inference
 * - Report results back to orchestrator
 * - Handle retries and fallbacks
 */
export declare class ExecutorAgent extends BaseAgent {
    /** Browser page reference (set externally) */
    private page;
    /** Execution history for learning */
    private executionHistory;
    /** Max history size */
    private maxHistorySize;
    /** Retry delay in ms */
    private retryDelay;
    constructor(config?: Partial<AgentConfig>);
    /**
     * Set browser page reference
     */
    setPage(page: unknown): void;
    /**
     * Get browser page reference
     */
    getPage(): unknown;
    /**
     * Handle incoming message
     */
    protected handleMessage(message: SwarmMessage): Promise<SwarmMessage | null>;
    /**
     * Execute a task
     */
    executeTask(task: SwarmTask): Promise<TaskResult>;
    /**
     * Execute navigation task
     */
    private executeNavigate;
    /**
     * Execute click task
     */
    private executeClick;
    /**
     * Execute fill task
     */
    private executeFill;
    /**
     * Execute extract task
     */
    private executeExtract;
    /**
     * Execute validate task
     */
    private executeValidate;
    /**
     * Execute custom task
     */
    private executeCustom;
    /**
     * Retry task with feedback adjustments
     */
    private retryWithFeedback;
    /**
     * Generate possible selectors for a target
     */
    private generateSelectors;
    /**
     * Calculate confidence based on selector type and position
     */
    private calculateSelectorConfidence;
    /**
     * Store result in history
     */
    private storeResult;
    /**
     * Delay helper
     */
    private delay;
    /**
     * Get execution history
     */
    getExecutionHistory(): TaskResult[];
    /**
     * Get success rate
     */
    getSuccessRate(): number;
}
export default ExecutorAgent;
//# sourceMappingURL=executor-agent.d.ts.map