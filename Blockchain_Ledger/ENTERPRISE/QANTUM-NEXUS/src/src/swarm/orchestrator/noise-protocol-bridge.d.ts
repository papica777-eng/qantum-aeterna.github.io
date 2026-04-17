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
 * For licensing inquiries: dimitar.prodromov@QAntum.dev
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
/**
 * Noise protocol handshake patterns
 */
export type NoisePattern = 'NN' | 'NK' | 'NX' | 'KK' | 'XX' | 'IK' | 'IX';
/**
 * Cipher suite configuration
 */
export interface CipherSuite {
    /** Key exchange algorithm */
    keyExchange: 'Curve25519' | 'Curve448';
    /** Symmetric cipher */
    cipher: 'ChaChaPoly' | 'AESGCM';
    /** Hash function */
    hash: 'SHA256' | 'SHA512' | 'BLAKE2s' | 'BLAKE2b';
}
/**
 * Key pair for asymmetric operations
 */
export interface KeyPair {
    publicKey: Buffer;
    privateKey: Buffer;
}
/**
 * Handshake state
 */
export interface HandshakeState {
    pattern: NoisePattern;
    role: 'initiator' | 'responder';
    localStatic?: KeyPair;
    localEphemeral?: KeyPair;
    remoteStatic?: Buffer;
    remoteEphemeral?: Buffer;
    chainingKey: Buffer;
    handshakeHash: Buffer;
    messagePatterns: string[];
    isComplete: boolean;
}
/**
 * Cipher state for post-handshake
 */
export interface CipherState {
    key: Buffer;
    nonce: bigint;
    initialized: boolean;
}
/**
 * Encrypted message format
 */
export interface EncryptedMessage {
    ciphertext: Buffer;
    tag: Buffer;
    nonce: Buffer;
    timestamp: number;
}
/**
 * Bridge configuration
 */
export interface NoiseBridgeConfig {
    /** Handshake pattern */
    pattern?: NoisePattern;
    /** Cipher suite */
    cipherSuite?: Partial<CipherSuite>;
    /** Static key (optional, generated if not provided) */
    staticKey?: KeyPair;
    /** Prologue data for binding */
    prologue?: Buffer;
    /** Pre-shared key (for PSK patterns) */
    psk?: Buffer;
    /** Enable padding to hide message lengths */
    enablePadding?: boolean;
    /** Padding block size */
    paddingBlockSize?: number;
    /** Verbose logging */
    verbose?: boolean;
}
/**
 * Connection statistics
 */
export interface ConnectionStats {
    messagesSent: number;
    messagesReceived: number;
    bytesSent: number;
    bytesReceived: number;
    handshakeTime: number;
    avgEncryptionTime: number;
    avgDecryptionTime: number;
    keyRotations: number;
}
/**
 * NoiseProtocolBridge - Secure Hardware-Level Communication
 *
 * Features:
 * - Noise Protocol Framework implementation
 * - AES-256-GCM with SIMD acceleration (when available)
 * - Zero metadata leakage through uniform padding
 * - Forward secrecy through ephemeral keys
 * - Mutual authentication
 * - Resistance to traffic analysis
 */
export declare class NoiseProtocolBridge extends EventEmitter {
    private config;
    private handshakeState;
    private sendCipher;
    private receiveCipher;
    private stats;
    private connected;
    private encryptionTimings;
    private decryptionTimings;
    private readonly PROTOCOL_NAME;
    constructor(config?: NoiseBridgeConfig);
    /**
     * Generate key pair using ECDH
     */
    generateKeyPair(): KeyPair;
    /**
     * Generate ephemeral key pair
     */
    private generateEphemeralKeyPair;
    /**
     * Perform Diffie-Hellman key exchange
     */
    private dh;
    /**
     * Initialize handshake as initiator
     */
    initiateHandshake(remoteStaticKey?: Buffer): Promise<Buffer>;
    /**
     * Process incoming handshake message
     */
    processHandshake(message: Buffer): Promise<Buffer | null>;
    /**
     * Initialize symmetric state
     */
    private initializeSymmetricState;
    /**
     * Hash protocol name
     */
    private hashProtocolName;
    /**
     * Get message patterns for handshake
     */
    private getMessagePatterns;
    /**
     * Generate handshake message
     */
    private generateHandshakeMessage;
    /**
     * Process incoming handshake message
     */
    private processIncomingHandshakeMessage;
    /**
     * Finalize handshake and derive transport keys
     */
    private finalizeHandshake;
    /**
     * Encrypt message using AES-256-GCM
     */
    encrypt(plaintext: Buffer): EncryptedMessage;
    /**
     * Decrypt message using AES-256-GCM
     */
    decrypt(message: EncryptedMessage): Buffer;
    /**
     * Encrypt and hash for handshake
     */
    private encryptAndHash;
    /**
     * Decrypt and hash for handshake
     */
    private decryptAndHash;
    /**
     * SHA-256 hash
     */
    private hash;
    /**
     * Mix data into handshake hash
     */
    private mixHash;
    /**
     * Mix key into chaining key using HKDF
     */
    private mixKey;
    /**
     * Split chaining key into two cipher keys
     */
    private split;
    /**
     * Rotate keys for forward secrecy
     */
    private rotateKeys;
    /**
     * Apply padding to hide message length
     */
    private applyPadding;
    /**
     * Remove padding
     */
    private removePadding;
    /**
     * Check if connection is established
     */
    isConnected(): boolean;
    /**
     * Get connection statistics
     */
    getStats(): ConnectionStats;
    /**
     * Get public key for sharing
     */
    getPublicKey(): Buffer;
    /**
     * Close connection
     */
    close(): void;
    /**
     * Log message if verbose
     */
    private log;
}
export declare function createNoiseBridge(config?: NoiseBridgeConfig): NoiseProtocolBridge;
export default NoiseProtocolBridge;
//# sourceMappingURL=noise-protocol-bridge.d.ts.map