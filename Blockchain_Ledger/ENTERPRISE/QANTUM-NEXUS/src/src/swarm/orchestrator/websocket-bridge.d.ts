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
import { SwarmMessage, MessagePriority } from '../types';
/** Connection status */
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';
/** WebSocket bridge configuration */
export interface WsBridgeConfig {
    /** WebSocket server URL */
    serverUrl?: string;
    /** Reconnect attempts */
    maxReconnectAttempts?: number;
    /** Reconnect interval in ms */
    reconnectInterval?: number;
    /** Heartbeat interval in ms */
    heartbeatInterval?: number;
    /** Message timeout in ms */
    messageTimeout?: number;
    /** Enable compression */
    compression?: boolean;
    /** Authentication token */
    authToken?: string;
    /** Verbose logging */
    verbose?: boolean;
}
/**
 * WebSocket Message Bridge
 *
 * Provides:
 * - Bidirectional messaging between cloud and local
 * - Automatic reconnection
 * - Message queuing and retry
 * - Heartbeat monitoring
 */
export declare class WebSocketBridge extends EventEmitter {
    /** Configuration */
    private config;
    /** WebSocket instance (will be actual WebSocket in browser/Node) */
    private ws;
    /** Connection status */
    private status;
    /** Reconnect attempts counter */
    private reconnectAttempts;
    /** Heartbeat timer */
    private heartbeatTimer;
    /** Pending messages awaiting response */
    private pendingMessages;
    /** Message queue for offline period */
    private messageQueue;
    /** Client ID */
    private clientId;
    /** Last heartbeat received */
    private lastHeartbeat;
    constructor(config?: WsBridgeConfig);
    /**
     * Connect to WebSocket server
     */
    connect(): Promise<boolean>;
    /**
     * Disconnect from server
     */
    disconnect(): Promise<void>;
    /**
     * Send a message through the bridge
     */
    send(message: SwarmMessage): Promise<unknown>;
    /**
     * Send message and wait for specific response
     */
    sendAndWaitForResponse(message: SwarmMessage, timeout?: number): Promise<SwarmMessage | null>;
    /**
     * Broadcast message to all connected clients
     */
    broadcast(type: SwarmMessage['type'], payload: unknown, traceId: string, priority?: MessagePriority): Promise<void>;
    /**
     * Handle incoming message
     */
    private handleIncomingMessage;
    /**
     * Find pending message by span ID
     */
    private findPendingBySpan;
    /**
     * Start heartbeat
     */
    private startHeartbeat;
    /**
     * Stop heartbeat
     */
    private stopHeartbeat;
    /**
     * Send heartbeat
     */
    private sendHeartbeat;
    /**
     * Schedule reconnect
     */
    private scheduleReconnect;
    /**
     * Flush message queue after reconnect
     */
    private flushMessageQueue;
    /**
     * Simulate connection (for testing without actual WebSocket)
     */
    private simulateConnection;
    /**
     * Simulate sending (for testing without actual WebSocket)
     */
    private simulateSend;
    /**
     * Get connection status
     */
    getStatus(): ConnectionStatus;
    /**
     * Get client ID
     */
    getClientId(): string;
    /**
     * Get pending message count
     */
    getPendingCount(): number;
    /**
     * Get queued message count
     */
    getQueuedCount(): number;
    /**
     * Check if connected
     */
    isConnected(): boolean;
    /**
     * Log if verbose
     */
    private log;
}
export default WebSocketBridge;
//# sourceMappingURL=websocket-bridge.d.ts.map