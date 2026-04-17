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
 * Checksum record
 */
export interface ChecksumRecord {
    /** Resource identifier */
    id: string;
    /** SHA-256 hash */
    hash: string;
    /** Hash algorithm used */
    algorithm: 'sha256';
    /** Size in bytes */
    size: number;
    /** Generation timestamp */
    generatedAt: Date;
    /** Optional metadata */
    metadata?: Record<string, unknown>;
}
/**
 * File checksum record
 */
export interface FileChecksum extends ChecksumRecord {
    /** File path */
    path: string;
    /** File modification time */
    mtime: Date;
}
/**
 * Manifest of checksums
 */
export interface ChecksumManifest {
    /** Manifest version */
    version: string;
    /** Generation timestamp */
    generatedAt: Date;
    /** Root path (for file manifests) */
    rootPath?: string;
    /** File checksums */
    files: FileChecksum[];
    /** Total files */
    totalFiles: number;
    /** Total size */
    totalSize: number;
    /** Manifest hash (hash of all file hashes) */
    manifestHash: string;
}
/**
 * Verification result
 */
export interface VerificationResult {
    /** Overall valid */
    valid: boolean;
    /** Checked items */
    checked: number;
    /** Valid items */
    validCount: number;
    /** Invalid items */
    invalidCount: number;
    /** Missing items */
    missingCount: number;
    /** Invalid items details */
    invalidItems: Array<{
        id: string;
        expected: string;
        actual: string | null;
        reason: 'mismatch' | 'missing' | 'error';
    }>;
    /** Verification timestamp */
    verifiedAt: Date;
}
/**
 * Checksum Validator
 *
 * Provides checksum generation and verification utilities.
 */
export declare class ChecksumValidator extends EventEmitter {
    private cache;
    private cacheEnabled;
    private operationCount;
    private startTime;
    constructor(options?: {
        cacheEnabled?: boolean;
    });
    /**
     * Generate SHA-256 hash for a string
     * @param data - String data
     */
    hashString(data: string): string;
    /**
     * Generate SHA-256 hash for a buffer
     * @param buffer - Buffer data
     */
    hashBuffer(buffer: Buffer): string;
    /**
     * Generate SHA-256 hash for any serializable data
     * @param data - Any serializable data
     */
    hashData(data: unknown): ChecksumRecord;
    /**
     * Generate SHA-256 hash for a file
     * @param filePath - File path
     */
    hashFile(filePath: string): Promise<FileChecksum>;
    /**
     * Generate checksum manifest for a directory
     * @param dirPath - Directory path
     * @param recursive - Include subdirectories
     */
    generateManifest(dirPath: string, recursive?: boolean): Promise<ChecksumManifest>;
    /**
     * Walk directory recursively
     */
    private walkDirectory;
    /**
     * Verify a checksum
     * @param data - Data to verify
     * @param expectedHash - Expected hash
     */
    verifyData(data: unknown, expectedHash: string): boolean;
    /**
     * Verify a file checksum
     * @param filePath - File path
     * @param expectedHash - Expected hash
     */
    verifyFile(filePath: string, expectedHash: string): Promise<boolean>;
    /**
     * Verify a manifest
     * @param manifest - Manifest to verify
     */
    verifyManifest(manifest: ChecksumManifest): Promise<VerificationResult>;
    /**
     * Verify multiple checksums at once
     * @param records - Checksum records to verify
     * @param dataProvider - Function to get data by ID
     */
    verifyMultiple(records: ChecksumRecord[], dataProvider: (id: string) => Promise<unknown>): Promise<VerificationResult>;
    /**
     * Compare two hashes in constant time (timing-safe)
     * @param hash1 - First hash
     * @param hash2 - Second hash
     */
    compareHashes(hash1: string, hash2: string): boolean;
    /**
     * Get cached checksum
     * @param id - Record ID
     */
    getCached(id: string): ChecksumRecord | undefined;
    /**
     * Clear cache
     */
    clearCache(): void;
    /**
     * Get statistics
     */
    getStats(): {
        operationCount: number;
        cacheSize: number;
        uptime: number;
    };
}
export default ChecksumValidator;
//# sourceMappingURL=checksum-validator.d.ts.map