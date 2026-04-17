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
import { AgentConfig, AgentRole, AgentStatus, SwarmMessage, SwarmTask, TaskResult, MessagePriority } from '../types';
/**
 * Abstract base class for swarm agents
 */
export declare abstract class BaseAgent {
    /** Agent configuration */
    protected config: AgentConfig;
    /** Current status */
    protected status: AgentStatus;
    /** Message queue */
    protected messageQueue: SwarmMessage[];
    /** Event listeners */
    protected listeners: Map<string, Function[]>;
    /** Start time */
    protected startTime: Date;
    /** Processed message count */
    protected processedMessages: number;
    /** Error count */
    protected errorCount: number;
    constructor(config: Partial<AgentConfig> & {
        role: AgentRole;
    });
    /**
     * Get default model based on role
     */
    private getDefaultModel;
    /**
     * Get default environment based on role
     */
    private getDefaultEnv;
    /**
     * Get agent ID
     */
    get id(): string;
    /**
     * Get agent role
     */
    get role(): AgentRole;
    /**
     * Get current status
     */
    getStatus(): AgentStatus;
    /**
     * Set status
     */
    setStatus(status: AgentStatus): void;
    /**
     * Get agent info
     */
    getInfo(): AgentConfig & {
        status: AgentStatus;
    };
    /**
     * Receive a message
     */
    receiveMessage(message: SwarmMessage): void;
    /**
     * Create a message to send
     */
    protected createMessage(to: string, type: SwarmMessage['type'], payload: unknown, traceId: string, parentSpanId?: string, priority?: MessagePriority): SwarmMessage;
    /**
     * Process next message in queue
     */
    processNextMessage(): Promise<SwarmMessage | null>;
    /**
     * Handle a message (implemented by subclasses)
     */
    protected abstract handleMessage(message: SwarmMessage): Promise<SwarmMessage | null>;
    /**
     * Execute a task (implemented by subclasses)
     */
    abstract executeTask(task: SwarmTask): Promise<TaskResult>;
    /**
     * Add event listener
     */
    on(event: string, callback: Function): void;
    /**
     * Remove event listener
     */
    off(event: string, callback: Function): void;
    /**
     * Emit an event
     */
    protected emit(event: string, data: unknown): void;
    /**
     * Get statistics
     */
    getStats(): {
        id: string;
        role: AgentRole;
        status: AgentStatus;
        processedMessages: number;
        errorCount: number;
        uptime: number;
        queueLength: number;
    };
    /**
     * Log if verbose mode
     */
    protected log(message: string, ...args: unknown[]): void;
    /**
     * Shutdown the agent
     */
    shutdown(): Promise<void>;
}
export default BaseAgent;
//# sourceMappingURL=base-agent.d.ts.map