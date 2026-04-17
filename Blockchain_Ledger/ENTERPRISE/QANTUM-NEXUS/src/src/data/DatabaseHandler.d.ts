/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: DATABASE HANDLER
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Enterprise-grade database handler supporting PostgreSQL, MySQL, SQLite
 * Manages accounts, cards, proxies, emails - all data-driven automation needs
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
import { Knex as KnexType } from 'knex';
export type DatabaseType = 'postgresql' | 'mysql' | 'sqlite' | 'mssql';
export interface DatabaseConfig {
    type: DatabaseType;
    host?: string;
    port?: number;
    database: string;
    user?: string;
    password?: string;
    filename?: string;
    ssl?: boolean | object;
    pool?: {
        min: number;
        max: number;
        acquireTimeoutMillis?: number;
        createTimeoutMillis?: number;
        idleTimeoutMillis?: number;
    };
    debug?: boolean;
}
export interface Account {
    id: number;
    email: string;
    password: string;
    username?: string;
    phone?: string;
    status: 'active' | 'used' | 'failed' | 'banned' | 'cooldown' | 'pending';
    usage_count: number;
    last_used_at?: Date;
    created_at: Date;
    updated_at?: Date;
    proxy_id?: number;
    card_id?: number;
    profile_data?: Record<string, any>;
    cookies?: string;
    session_data?: string;
    notes?: string;
    tags?: string[];
    priority?: number;
    cooldown_until?: Date;
}
export interface Card {
    id: number;
    card_number: string;
    holder_name: string;
    expiry_month: string;
    expiry_year: string;
    cvv: string;
    billing_address?: string;
    billing_city?: string;
    billing_zip?: string;
    billing_country?: string;
    card_type?: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
    status: 'active' | 'used' | 'declined' | 'expired' | 'invalid';
    usage_count: number;
    max_usage?: number;
    last_used_at?: Date;
    created_at: Date;
    balance?: number;
    notes?: string;
}
export interface Proxy {
    id: number;
    host: string;
    port: number;
    protocol: 'http' | 'https' | 'socks4' | 'socks5';
    username?: string;
    password?: string;
    country?: string;
    city?: string;
    isp?: string;
    status: 'active' | 'dead' | 'slow' | 'banned' | 'testing';
    response_time?: number;
    last_checked_at?: Date;
    fail_count: number;
    success_count: number;
    created_at: Date;
    expires_at?: Date;
    rotation_group?: string;
    sticky_session?: boolean;
    tags?: string[];
}
export interface Email {
    id: number;
    email: string;
    password?: string;
    provider: 'gmail' | 'outlook' | 'yahoo' | 'temp' | 'custom';
    imap_host?: string;
    imap_port?: number;
    smtp_host?: string;
    smtp_port?: number;
    status: 'active' | 'used' | 'blocked' | 'expired';
    verified: boolean;
    created_at: Date;
    last_used_at?: Date;
    recovery_email?: string;
    recovery_phone?: string;
    notes?: string;
}
export interface TaskRecord {
    id: number;
    task_type: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
    account_id?: number;
    card_id?: number;
    proxy_id?: number;
    input_data?: Record<string, any>;
    output_data?: Record<string, any>;
    error_message?: string;
    started_at?: Date;
    completed_at?: Date;
    created_at: Date;
    retry_count: number;
    priority: number;
    worker_id?: string;
}
export interface DatabaseStats {
    accounts: {
        total: number;
        active: number;
        used: number;
        failed: number;
        banned: number;
    };
    cards: {
        total: number;
        active: number;
        used: number;
        declined: number;
    };
    proxies: {
        total: number;
        active: number;
        dead: number;
        avgResponseTime: number;
    };
    emails: {
        total: number;
        active: number;
        verified: number;
    };
    tasks: {
        pending: number;
        running: number;
        completed: number;
        failed: number;
    };
}
export declare class DatabaseHandler extends EventEmitter {
    private knex;
    private config;
    private connected;
    private transactionStack;
    constructor(config: DatabaseConfig);
    /**
     * Connect to database
     */
    connect(): Promise<void>;
    /**
     * Disconnect from database
     */
    disconnect(): Promise<void>;
    /**
     * Check if connected
     */
    isConnected(): boolean;
    /**
     * Build Knex configuration from our config
     */
    private buildKnexConfig;
    /**
     * Get raw Knex instance for advanced queries
     */
    raw(): KnexType;
    /**
     * Begin transaction
     */
    beginTransaction(): Promise<KnexType.Transaction>;
    /**
     * Commit current transaction
     */
    commit(): Promise<void>;
    /**
     * Rollback current transaction
     */
    rollback(): Promise<void>;
    /**
     * Execute within transaction
     */
    withTransaction<T>(callback: (trx: KnexType.Transaction) => Promise<T>): Promise<T>;
    /**
     * Get next available account
     */
    getNextAccount(options?: {
        status?: Account['status'];
        minPriority?: number;
        tags?: string[];
        withProxy?: boolean;
        withCard?: boolean;
        excludeIds?: number[];
        lockForUpdate?: boolean;
    }): Promise<Account | null>;
    /**
     * Get account by ID
     */
    getAccountById(id: number): Promise<Account | null>;
    /**
     * Get account by email
     */
    getAccountByEmail(email: string): Promise<Account | null>;
    /**
     * Create new account
     */
    createAccount(account: Partial<Account>): Promise<Account>;
    /**
     * Update account
     */
    updateAccount(id: number, updates: Partial<Account>): Promise<Account>;
    /**
     * Mark account as used
     */
    markAccountUsed(id: number, status?: Account['status']): Promise<void>;
    /**
     * Mark account as failed
     */
    markAccountFailed(id: number, errorMessage?: string): Promise<void>;
    /**
     * Set account cooldown
     */
    setAccountCooldown(id: number, minutes: number): Promise<void>;
    /**
     * Bulk create accounts
     */
    bulkCreateAccounts(accounts: Partial<Account>[]): Promise<number>;
    /**
     * Get accounts by status
     */
    getAccountsByStatus(status: Account['status'], limit?: number): Promise<Account[]>;
    /**
     * Get next available card
     */
    getNextCard(options?: {
        cardType?: Card['card_type'];
        excludeIds?: number[];
        minBalance?: number;
        lockForUpdate?: boolean;
    }): Promise<Card | null>;
    /**
     * Get card by ID
     */
    getCardById(id: number): Promise<Card | null>;
    /**
     * Create card
     */
    createCard(card: Partial<Card>): Promise<Card>;
    /**
     * Mark card as used
     */
    markCardUsed(id: number, success?: boolean): Promise<void>;
    /**
     * Validate card (check expiry)
     */
    validateCard(card: Card): Promise<boolean>;
    /**
     * Bulk create cards
     */
    bulkCreateCards(cards: Partial<Card>[]): Promise<number>;
    /**
     * Get next available proxy
     */
    getNextProxy(options?: {
        protocol?: Proxy['protocol'];
        country?: string;
        maxResponseTime?: number;
        rotationGroup?: string;
        excludeIds?: number[];
        lockForUpdate?: boolean;
    }): Promise<Proxy | null>;
    /**
     * Get proxy by ID
     */
    getProxyById(id: number): Promise<Proxy | null>;
    /**
     * Create proxy
     */
    createProxy(proxy: Partial<Proxy>): Promise<Proxy>;
    /**
     * Update proxy stats after use
     */
    updateProxyStats(id: number, success: boolean, responseTime?: number): Promise<void>;
    /**
     * Get proxy connection string
     */
    getProxyUrl(proxy: Proxy): string;
    /**
     * Bulk create proxies
     */
    bulkCreateProxies(proxies: Partial<Proxy>[]): Promise<number>;
    /**
     * Test proxy connectivity
     */
    testProxy(proxy: Proxy): Promise<{
        success: boolean;
        responseTime: number;
    }>;
    /**
     * Get next available email
     */
    getNextEmail(options?: {
        provider?: Email['provider'];
        verified?: boolean;
        excludeIds?: number[];
        lockForUpdate?: boolean;
    }): Promise<Email | null>;
    /**
     * Create email
     */
    createEmail(email: Partial<Email>): Promise<Email>;
    /**
     * Mark email as used
     */
    markEmailUsed(id: number): Promise<void>;
    /**
     * Create task record
     */
    createTask(task: Partial<TaskRecord>): Promise<TaskRecord>;
    /**
     * Get next pending task
     */
    getNextTask(taskType?: string, workerId?: string): Promise<TaskRecord | null>;
    /**
     * Complete task
     */
    completeTask(id: number, outputData?: Record<string, any>): Promise<void>;
    /**
     * Fail task
     */
    failTask(id: number, errorMessage: string): Promise<void>;
    /**
     * Get database statistics
     */
    getStats(): Promise<DatabaseStats>;
    private getAccountStats;
    private getCardStats;
    private getProxyStats;
    private getEmailStats;
    private getTaskStats;
    /**
     * Initialize database schema (create tables if not exist)
     */
    initializeSchema(): Promise<void>;
    /**
     * Drop all tables (use with caution!)
     */
    dropAllTables(): Promise<void>;
    /**
     * Execute raw SQL query
     */
    query<T = any>(sql: string, bindings?: any[]): Promise<T[]>;
    /**
     * Health check
     */
    healthCheck(): Promise<boolean>;
    /**
     * Get table row count
     */
    getTableCount(table: string): Promise<number>;
    /**
     * Cleanup old records
     */
    cleanup(options: {
        olderThanDays: number;
        tables?: ('accounts' | 'cards' | 'proxies' | 'emails' | 'tasks')[];
    }): Promise<{
        [table: string]: number;
    }>;
}
/**
 * Create database handler from environment
 */
export declare function createDatabaseHandler(config?: Partial<DatabaseConfig>): DatabaseHandler;
/**
 * Create SQLite database handler (for local testing)
 */
export declare function createSQLiteHandler(filename?: string): DatabaseHandler;
export default DatabaseHandler;
//# sourceMappingURL=DatabaseHandler.d.ts.map