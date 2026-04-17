/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: DATA PROVIDERS
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * High-level providers for accounts, cards, proxies, emails
 * Built on top of DatabaseHandler with caching, rotation, and smart selection
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
import { DatabaseHandler, Account, Card, Proxy, Email } from './DatabaseHandler';
export declare abstract class BaseProvider<T> extends EventEmitter {
    protected db: DatabaseHandler;
    protected cache: Map<number, T>;
    protected usedIds: Set<number>;
    protected lockedIds: Set<number>;
    constructor(db: DatabaseHandler);
    /**
     * Clear cache
     */
    clearCache(): void;
    /**
     * Reset used tracking
     */
    resetUsed(): void;
    /**
     * Lock an item (prevent it from being selected)
     */
    lock(id: number): void;
    /**
     * Unlock an item
     */
    unlock(id: number): void;
    /**
     * Get excluded IDs (used + locked)
     */
    protected getExcludedIds(): number[];
}
export interface AccountProviderOptions {
    autoMarkUsed?: boolean;
    cooldownMinutes?: number;
    maxRetries?: number;
    allowReuse?: boolean;
}
export declare class AccountProvider extends BaseProvider<Account> {
    private options;
    private currentAccount;
    constructor(db: DatabaseHandler, options?: AccountProviderOptions);
    /**
     * Get next available account
     */
    getNext(options?: {
        withProxy?: boolean;
        withCard?: boolean;
        minPriority?: number;
        tags?: string[];
    }): Promise<Account | null>;
    /**
     * Get current account
     */
    getCurrent(): Account | null;
    /**
     * Mark current account as successfully used
     */
    markSuccess(): Promise<void>;
    /**
     * Mark current account as failed
     */
    markFailed(error?: string): Promise<void>;
    /**
     * Set cooldown on current account
     */
    setCooldown(minutes?: number): Promise<void>;
    /**
     * Get account with proxy
     */
    getWithProxy(): Promise<{
        account: Account;
        proxy: Proxy;
    } | null>;
    /**
     * Get account with card
     */
    getWithCard(): Promise<{
        account: Account;
        card: Card;
    } | null>;
    /**
     * Get full profile (account + proxy + card)
     */
    getFullProfile(): Promise<{
        account: Account;
        proxy: Proxy | null;
        card: Card | null;
    } | null>;
    /**
     * Get count of available accounts
     */
    getAvailableCount(): Promise<number>;
}
export interface CardProviderOptions {
    autoMarkUsed?: boolean;
    validateExpiry?: boolean;
    maxUsagePerCard?: number;
}
export declare class CardProvider extends BaseProvider<Card> {
    private options;
    private currentCard;
    constructor(db: DatabaseHandler, options?: CardProviderOptions);
    /**
     * Get next available card
     */
    getNext(options?: {
        cardType?: Card['card_type'];
        minBalance?: number;
    }): Promise<Card | null>;
    /**
     * Get current card
     */
    getCurrent(): Card | null;
    /**
     * Mark card payment as successful
     */
    markSuccess(): Promise<void>;
    /**
     * Mark card payment as declined
     */
    markDeclined(): Promise<void>;
    /**
     * Get card details formatted for payment forms
     */
    getPaymentDetails(): {
        number: string;
        holder: string;
        expiry: string;
        expiryMonth: string;
        expiryYear: string;
        cvv: string;
    } | null;
    /**
     * Get billing address formatted
     */
    getBillingAddress(): {
        address: string;
        city: string;
        zip: string;
        country: string;
    } | null;
    /**
     * Get available count
     */
    getAvailableCount(): Promise<number>;
}
export interface ProxyProviderOptions {
    rotateOnFail?: boolean;
    maxFailsBeforeRotate?: number;
    stickySession?: boolean;
    preferredCountry?: string;
    preferredProtocol?: Proxy['protocol'];
}
export declare class ProxyProvider extends BaseProvider<Proxy> {
    private options;
    private currentProxy;
    private failCount;
    private rotationIndex;
    private proxyPool;
    constructor(db: DatabaseHandler, options?: ProxyProviderOptions);
    /**
     * Get next available proxy
     */
    getNext(options?: {
        country?: string;
        protocol?: Proxy['protocol'];
        maxResponseTime?: number;
        rotationGroup?: string;
    }): Promise<Proxy | null>;
    /**
     * Get current proxy
     */
    getCurrent(): Proxy | null;
    /**
     * Get proxy URL for browser
     */
    getProxyUrl(): string | null;
    /**
     * Get proxy config for Playwright
     */
    getPlaywrightConfig(): {
        server: string;
        username?: string;
        password?: string;
    } | null;
    /**
     * Report proxy success
     */
    reportSuccess(responseTime?: number): Promise<void>;
    /**
     * Report proxy failure
     */
    reportFailure(): Promise<void>;
    /**
     * Force rotation to next proxy
     */
    rotate(): Promise<Proxy | null>;
    /**
     * Load proxy pool for round-robin rotation
     */
    loadPool(options?: {
        country?: string;
        protocol?: Proxy['protocol'];
        limit?: number;
    }): Promise<number>;
    /**
     * Get next proxy from pool (round-robin)
     */
    getNextFromPool(): Proxy | null;
    /**
     * Get available count
     */
    getAvailableCount(): Promise<number>;
}
export interface EmailProviderOptions {
    preferredProvider?: Email['provider'];
    requireVerified?: boolean;
}
export declare class EmailProvider extends BaseProvider<Email> {
    private options;
    private currentEmail;
    constructor(db: DatabaseHandler, options?: EmailProviderOptions);
    /**
     * Get next available email
     */
    getNext(options?: {
        provider?: Email['provider'];
        verified?: boolean;
    }): Promise<Email | null>;
    /**
     * Get current email
     */
    getCurrent(): Email | null;
    /**
     * Mark email as used
     */
    markUsed(): Promise<void>;
    /**
     * Get IMAP config for email reading
     */
    getImapConfig(): {
        host: string;
        port: number;
        user: string;
        password: string;
        tls: boolean;
    } | null;
    /**
     * Get available count
     */
    getAvailableCount(): Promise<number>;
}
export interface DataProviderConfig {
    database: DatabaseHandler;
    accountOptions?: AccountProviderOptions;
    cardOptions?: CardProviderOptions;
    proxyOptions?: ProxyProviderOptions;
    emailOptions?: EmailProviderOptions;
}
export declare class DataProvider extends EventEmitter {
    accounts: AccountProvider;
    cards: CardProvider;
    proxies: ProxyProvider;
    emails: EmailProvider;
    db: DatabaseHandler;
    constructor(config: DataProviderConfig);
    private forwardEvents;
    /**
     * Get complete automation profile
     */
    getAutomationProfile(): Promise<{
        account: Account;
        card: Card | null;
        proxy: Proxy | null;
        email: Email | null;
    } | null>;
    /**
     * Mark current profile as completed successfully
     */
    markProfileSuccess(): Promise<void>;
    /**
     * Mark current profile as failed
     */
    markProfileFailed(error?: string): Promise<void>;
    /**
     * Reset all providers
     */
    reset(): void;
    /**
     * Clear all caches
     */
    clearCaches(): void;
    /**
     * Get statistics
     */
    getStats(): Promise<import("./DatabaseHandler").DatabaseStats>;
}
export default DataProvider;
//# sourceMappingURL=DataProviders.d.ts.map