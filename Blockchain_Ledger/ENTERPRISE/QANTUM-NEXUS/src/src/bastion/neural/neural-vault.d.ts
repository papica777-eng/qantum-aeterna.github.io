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
import { EncryptedPayload, VaultEntry, SyncStatus, NeuralVaultConfig } from '../types';
/**
 * Neural Vault
 *
 * Provides encrypted storage for sensitive QANTUM data.
 */
export declare class NeuralVault extends EventEmitter {
    private config;
    private derivedKey;
    private salt;
    private manifest;
    private entries;
    private syncStatus;
    private machineId;
    private operationCount;
    private startTime;
    constructor(config?: NeuralVaultConfig);
    /**
     * Initialize the vault with a password
     * @param password - Master password for encryption
     * @param existingVault - Load existing vault if present
     */
    initialize(password: string, existingVault?: boolean): Promise<void>;
    /**
     * Derive encryption key from password using PBKDF2
     */
    private deriveKey;
    /**
     * Encrypt data using AES-256-GCM
     * @param data - Data to encrypt
     */
    encrypt(data: unknown): Promise<EncryptedPayload>;
    /**
     * Decrypt data using AES-256-GCM
     * @param payload - Encrypted payload
     */
    decrypt<T = unknown>(payload: EncryptedPayload): Promise<T>;
    /**
     * Store data in the vault
     * @param id - Entry ID
     * @param type - Entry type
     * @param data - Data to store
     */
    store(id: string, type: VaultEntry['type'], data: unknown): Promise<VaultEntry>;
    /**
     * Retrieve data from the vault
     * @param id - Entry ID
     */
    retrieve<T = unknown>(id: string): Promise<T | null>;
    /**
     * Check if an entry exists
     * @param id - Entry ID
     */
    has(id: string): boolean;
    /**
     * Delete an entry
     * @param id - Entry ID
     */
    delete(id: string): boolean;
    /**
     * Calculate SHA-256 checksum
     * @param data - Data to hash
     */
    calculateChecksum(data: string): string;
    /**
     * Verify data integrity
     * @param id - Entry ID
     */
    verifyIntegrity(id: string): Promise<boolean>;
    /**
     * Save vault to disk
     */
    save(): Promise<void>;
    /**
     * Load vault from disk
     * @param password - Master password
     */
    private loadVault;
    /**
     * Change the master password
     * @param currentPassword - Current password
     * @param newPassword - New password
     */
    changePassword(currentPassword: string, newPassword: string): Promise<void>;
    /**
     * Export vault (for backup)
     */
    export(): Promise<string>;
    /**
     * Import vault (from backup)
     * @param exportData - Exported vault data
     * @param password - Master password
     */
    import(exportData: string, password: string): Promise<void>;
    /**
     * Get sync status
     */
    getSyncStatus(): SyncStatus;
    /**
     * Get vault statistics
     */
    getStats(): {
        entryCount: number;
        totalSize: number;
        operationCount: number;
        uptime: number;
        pendingChanges: number;
    };
    /**
     * List all entries
     */
    listEntries(): Array<{
        id: string;
        type: VaultEntry['type'];
        size: number;
        lastModified: Date;
    }>;
    /**
     * Generate machine ID
     */
    private generateMachineId;
    /**
     * Check if vault is initialized
     */
    isInitialized(): boolean;
    /**
     * Check if vault is enabled
     */
    isEnabled(): boolean;
    /**
     * Close the vault
     */
    close(): Promise<void>;
}
export default NeuralVault;
//# sourceMappingURL=neural-vault.d.ts.map