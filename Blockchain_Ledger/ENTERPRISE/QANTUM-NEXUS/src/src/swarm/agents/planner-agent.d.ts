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
import { AgentConfig, SwarmMessage, SwarmTask, TaskResult, ExecutionPlan } from '../types';
/**
 * Planner Agent - Strategic Planning
 *
 * Responsibilities:
 * - Break down high-level goals into executable tasks
 * - Create execution plans with dependencies
 * - Design fallback strategies
 * - Optimize task ordering
 */
export declare class PlannerAgent extends BaseAgent {
    /** Planning history for context */
    private planHistory;
    /** Max plans to keep in history */
    private maxHistorySize;
    constructor(config?: Partial<AgentConfig>);
    /**
     * Handle incoming message
     */
    protected handleMessage(message: SwarmMessage): Promise<SwarmMessage | null>;
    /**
     * Execute a task (planners don't execute directly)
     */
    executeTask(task: SwarmTask): Promise<TaskResult>;
    /**
     * Create an execution plan from a high-level goal
     */
    createPlan(goal: string, context?: Record<string, unknown>, traceId?: string): Promise<ExecutionPlan>;
    /**
     * Revise a plan based on feedback
     */
    revisePlan(planId: string, feedback: string, traceId?: string): Promise<ExecutionPlan | null>;
    /**
     * Decompose a goal into tasks
     */
    private decomposeGoal;
    /**
     * Create form filling tasks
     */
    private createFormTasks;
    /**
     * Create a task
     */
    private createTask;
    /**
     * Calculate task dependencies
     */
    private calculateDependencies;
    /**
     * Create fallback plan
     */
    private createFallbackPlan;
    /**
     * Estimate total duration for tasks
     */
    private estimateDuration;
    /**
     * Revise tasks based on feedback
     */
    private reviseTasks;
    /**
     * Get planning history
     */
    getPlanHistory(): ExecutionPlan[];
    /**
     * Get specific plan
     */
    getPlan(planId: string): ExecutionPlan | undefined;
}
export default PlannerAgent;
//# sourceMappingURL=planner-agent.d.ts.map