/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: SESSION & STORAGE MANAGEMENT
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Browser session management, storage persistence, caching layer
 * Cookie management, localStorage/sessionStorage handling
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export interface SessionData {
    id: string;
    name: string;
    cookies: Cookie[];
    localStorage: Record<string, string>;
    sessionStorage: Record<string, string>;
    userAgent?: string;
    viewport?: {
        width: number;
        height: number;
    };
    geolocation?: {
        latitude: number;
        longitude: number;
    };
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
    metadata?: Record<string, any>;
}
export interface Cookie {
    name: string;
    value: string;
    domain: string;
    path: string;
    expires?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
}
export interface SessionManagerConfig {
    storagePath: string;
    encryptionKey?: string;
    autoSave?: boolean;
    autoSaveInterval?: number;
    maxSessions?: number;
    sessionTTL?: number;
}
export interface CacheEntry<T> {
    key: string;
    value: T;
    createdAt: Date;
    expiresAt?: Date;
    hits: number;
    size?: number;
}
export interface CacheConfig {
    maxSize?: number;
    maxMemory?: number;
    defaultTTL?: number;
    cleanupInterval?: number;
}
export declare class SessionManager extends EventEmitter {
    private config;
    private sessions;
    private activeSession?;
    private autoSaveTimer?;
    constructor(config?: Partial<SessionManagerConfig>);
    /**
     * Create new session
     */
    createSession(options?: {
        name?: string;
        cookies?: Cookie[];
        localStorage?: Record<string, string>;
        sessionStorage?: Record<string, string>;
        userAgent?: string;
        viewport?: {
            width: number;
            height: number;
        };
        metadata?: Record<string, any>;
    }): SessionData;
    /**
     * Get session by ID
     */
    getSession(id: string): SessionData | undefined;
    /**
     * Get or create session by name
     */
    getOrCreateSession(name: string): SessionData;
    /**
     * Update session
     */
    updateSession(id: string, updates: Partial<Omit<SessionData, 'id' | 'createdAt'>>): SessionData | undefined;
    /**
     * Delete session
     */
    deleteSession(id: string): boolean;
    /**
     * Set active session
     */
    setActiveSession(id: string): void;
    /**
     * Get active session
     */
    getActiveSession(): SessionData | undefined;
    /**
     * List all sessions
     */
    listSessions(filter?: {
        name?: string;
        hasMetadata?: string;
        notExpired?: boolean;
    }): SessionData[];
    /**
     * Add cookies to session
     */
    addCookies(sessionId: string, cookies: Cookie[]): void;
    /**
     * Get cookies for domain
     */
    getCookies(sessionId: string, domain?: string): Cookie[];
    /**
     * Delete cookie
     */
    deleteCookie(sessionId: string, name: string, domain?: string): void;
    /**
     * Clear all cookies for session
     */
    clearCookies(sessionId: string): void;
    /**
     * Set localStorage item
     */
    setLocalStorage(sessionId: string, key: string, value: string): void;
    /**
     * Get localStorage item
     */
    getLocalStorage(sessionId: string, key: string): string | undefined;
    /**
     * Remove localStorage item
     */
    removeLocalStorage(sessionId: string, key: string): void;
    /**
     * Clear localStorage
     */
    clearLocalStorage(sessionId: string): void;
    /**
     * Set sessionStorage item
     */
    setSessionStorage(sessionId: string, key: string, value: string): void;
    /**
     * Get sessionStorage item
     */
    getSessionStorage(sessionId: string, key: string): string | undefined;
    /**
     * Clear sessionStorage
     */
    clearSessionStorage(sessionId: string): void;
    /**
     * Save session to disk
     */
    saveSession(id: string): void;
    /**
     * Save all sessions
     */
    saveAllSessions(): void;
    /**
     * Load sessions from disk
     */
    loadSessions(): void;
    /**
     * Export session to Playwright format
     */
    exportToPlaywright(sessionId: string): {
        cookies: any[];
        origins: any[];
    };
    /**
     * Import from Playwright format
     */
    importFromPlaywright(sessionId: string, state: {
        cookies: any[];
        origins: any[];
    }): void;
    private ensureStoragePath;
    private getSessionFilePath;
    private generateSessionId;
    private isExpired;
    private pruneOldestSession;
    private startAutoSave;
    /**
     * Cleanup and stop auto-save
     */
    destroy(): void;
}
export declare class CacheLayer<T = any> extends EventEmitter {
    private cache;
    private config;
    private cleanupTimer?;
    private currentMemory;
    constructor(config?: Partial<CacheConfig>);
    /**
     * Set cache value
     */
    set(key: string, value: T, options?: {
        ttl?: number;
    }): void;
    /**
     * Get cache value
     */
    get(key: string): T | undefined;
    /**
     * Get or set (cache-aside pattern)
     */
    getOrSet(key: string, factory: () => Promise<T>, options?: {
        ttl?: number;
    }): Promise<T>;
    /**
     * Check if key exists
     */
    has(key: string): boolean;
    /**
     * Delete cache entry
     */
    delete(key: string): boolean;
    /**
     * Clear all entries
     */
    clear(): void;
    /**
     * Get cache stats
     */
    getStats(): {
        size: number;
        memory: number;
        maxSize: number;
        maxMemory: number;
        hitRate?: number;
    };
    /**
     * Get all keys
     */
    keys(): string[];
    /**
     * Get all entries (for debugging)
     */
    entries(): Array<{
        key: string;
        hits: number;
        size: number;
        expiresAt?: Date;
    }>;
    /**
     * Invalidate by pattern
     */
    invalidatePattern(pattern: RegExp): number;
    private evictOne;
    private calculateSize;
    private cleanup;
    private startCleanup;
    /**
     * Destroy cache
     */
    destroy(): void;
}
export declare class StorageAdapter {
    private sessionManager;
    private sessionId;
    constructor(sessionManager: SessionManager, sessionId: string);
    /**
     * Apply storage state to Playwright context
     */
    applyToContext(context: any): Promise<void>;
    /**
     * Save context state to session
     */
    saveFromContext(context: any): Promise<void>;
    /**
     * Create storage state file for Playwright
     */
    createStorageStateFile(filePath: string): void;
}
export declare class StorageService extends EventEmitter {
    sessions: SessionManager;
    cache: CacheLayer;
    constructor(config?: {
        sessions?: Partial<SessionManagerConfig>;
        cache?: Partial<CacheConfig>;
    });
    /**
     * Create storage adapter for session
     */
    createAdapter(sessionId: string): StorageAdapter;
    /**
     * Destroy all resources
     */
    destroy(): void;
}
export default StorageService;
//# sourceMappingURL=StorageService.d.ts.map