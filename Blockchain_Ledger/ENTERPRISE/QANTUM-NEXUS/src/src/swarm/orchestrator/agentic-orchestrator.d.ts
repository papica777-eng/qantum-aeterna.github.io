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
import { EventEmitter } from 'events';
import { SwarmConfig, SwarmMessage, SwarmTask, TaskResult, ExecutionPlan, SwarmStats } from '../types';
import { PlannerAgent } from '../agents/planner-agent';
import { ExecutorAgent } from '../agents/executor-agent';
import { CriticAgent } from '../agents/critic-agent';
/** Orchestrator status */
export type OrchestratorStatus = 'idle' | 'running' | 'paused' | 'stopped' | 'error';
/** Message handler function */
type MessageHandler = (message: SwarmMessage) => Promise<void>;
/**
 * Agentic Orchestrator
 *
 * Coordinates the swarm of agents:
 * 1. Routes messages between agents
 * 2. Manages execution flow
 * 3. Handles retries and fallbacks
 * 4. Collects metrics and stats
 */
export declare class AgenticOrchestrator extends EventEmitter {
    /** Configuration */
    private config;
    /** Planner agent */
    private planner;
    /** Executor agents (can have multiple) */
    private executors;
    /** Critic agent */
    private critic;
    /** Message queue */
    private messageQueue;
    /** Processing flag */
    private isProcessing;
    /** Status */
    private status;
    /** Start time */
    private startTime;
    /** Statistics */
    private stats;
    /** Task execution times for averaging */
    private executionTimes;
    /** Active trace IDs */
    private activeTraces;
    /** External message handlers (for WebSocket integration) */
    private externalHandlers;
    /** Verbose logging */
    private verbose;
    constructor(config?: Partial<SwarmConfig>);
    /**
     * Initialize the orchestrator with agents
     */
    initialize(): Promise<void>;
    /**
     * Create default agents
     */
    private createDefaultAgents;
    /**
     * Create agents from configuration
     */
    private createAgentsFromConfig;
    /**
     * Set up event handlers for agents
     */
    private setupEventHandlers;
    /**
     * Start the orchestrator
     */
    start(): void;
    /**
     * Pause the orchestrator
     */
    pause(): void;
    /**
     * Resume the orchestrator
     */
    resume(): void;
    /**
     * Stop the orchestrator
     */
    stop(): Promise<void>;
    /**
     * Execute a goal through the swarm
     */
    executeGoal(goal: string, context?: Record<string, unknown>): Promise<{
        traceId: string;
        success: boolean;
        results: TaskResult[];
        plan: ExecutionPlan | null;
    }>;
    /**
     * Execute a single task directly
     */
    executeTask(task: SwarmTask): Promise<TaskResult>;
    /**
     * Send a message to the swarm
     */
    sendMessage(message: SwarmMessage): void;
    /**
     * Process message queue
     */
    private processMessages;
    /**
     * Route a message to the appropriate agent
     */
    private routeMessage;
    /**
     * Find an agent by ID
     */
    private findAgent;
    /**
     * Get an available executor
     */
    private getAvailableExecutor;
    /**
     * Register external message handler (for WebSocket)
     */
    registerExternalHandler(agentId: string, handler: MessageHandler): void;
    /**
     * Unregister external handler
     */
    unregisterExternalHandler(agentId: string): void;
    /**
     * Set browser page for executors
     */
    setPage(page: unknown): void;
    /**
     * Update statistics
     */
    private updateStats;
    /**
     * Get current statistics
     */
    getStats(): SwarmStats;
    /**
     * Get agent count
     */
    getAgentCount(): number;
    /**
     * Get active agent count
     */
    private getActiveAgentCount;
    /**
     * Get orchestrator status
     */
    getStatus(): OrchestratorStatus;
    /**
     * Get planner agent
     */
    getPlanner(): PlannerAgent | null;
    /**
     * Get executor agents
     */
    getExecutors(): ExecutorAgent[];
    /**
     * Get critic agent
     */
    getCritic(): CriticAgent | null;
    /**
     * Log if verbose
     */
    private log;
    /**
     * Increment distillation entry count
     */
    incrementDistillationCount(): void;
}
export default AgenticOrchestrator;
//# sourceMappingURL=agentic-orchestrator.d.ts.map