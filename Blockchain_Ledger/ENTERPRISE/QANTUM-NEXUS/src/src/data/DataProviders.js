"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataProvider = exports.EmailProvider = exports.ProxyProvider = exports.CardProvider = exports.AccountProvider = exports.BaseProvider = void 0;
const events_1 = require("events");
// ═══════════════════════════════════════════════════════════════════════════════
// BASE PROVIDER
// ═══════════════════════════════════════════════════════════════════════════════
class BaseProvider extends events_1.EventEmitter {
    db;
    cache = new Map();
    usedIds = new Set();
    lockedIds = new Set();
    constructor(db) {
        super();
        this.db = db;
    }
    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        this.usedIds.clear();
        this.lockedIds.clear();
    }
    /**
     * Reset used tracking
     */
    resetUsed() {
        this.usedIds.clear();
    }
    /**
     * Lock an item (prevent it from being selected)
     */
    lock(id) {
        this.lockedIds.add(id);
    }
    /**
     * Unlock an item
     */
    unlock(id) {
        this.lockedIds.delete(id);
    }
    /**
     * Get excluded IDs (used + locked)
     */
    getExcludedIds() {
        return [...this.usedIds, ...this.lockedIds];
    }
}
exports.BaseProvider = BaseProvider;
class AccountProvider extends BaseProvider {
    options;
    currentAccount = null;
    constructor(db, options = {}) {
        super(db);
        this.options = {
            autoMarkUsed: true,
            cooldownMinutes: 60,
            maxRetries: 3,
            allowReuse: false,
            ...options
        };
    }
    /**
     * Get next available account
     */
    async getNext(options = {}) {
        const excludeIds = this.options.allowReuse ? [...this.lockedIds] : this.getExcludedIds();
        const account = await this.db.getNextAccount({
            ...options,
            excludeIds,
            lockForUpdate: true
        });
        if (account) {
            this.currentAccount = account;
            this.usedIds.add(account.id);
            this.cache.set(account.id, account);
            this.emit('account:selected', account);
        }
        return account;
    }
    /**
     * Get current account
     */
    getCurrent() {
        return this.currentAccount;
    }
    /**
     * Mark current account as successfully used
     */
    async markSuccess() {
        if (!this.currentAccount)
            return;
        if (this.options.autoMarkUsed) {
            await this.db.markAccountUsed(this.currentAccount.id, 'used');
        }
        this.emit('account:success', this.currentAccount);
        this.currentAccount = null;
    }
    /**
     * Mark current account as failed
     */
    async markFailed(error) {
        if (!this.currentAccount)
            return;
        await this.db.markAccountFailed(this.currentAccount.id, error);
        this.emit('account:failed', { account: this.currentAccount, error });
        this.currentAccount = null;
    }
    /**
     * Set cooldown on current account
     */
    async setCooldown(minutes) {
        if (!this.currentAccount)
            return;
        const cooldownMinutes = minutes || this.options.cooldownMinutes || 60;
        await this.db.setAccountCooldown(this.currentAccount.id, cooldownMinutes);
        this.emit('account:cooldown', { account: this.currentAccount, minutes: cooldownMinutes });
    }
    /**
     * Get account with proxy
     */
    async getWithProxy() {
        const account = await this.getNext({ withProxy: true });
        if (!account || !account.proxy_id)
            return null;
        const proxy = await this.db.getProxyById(account.proxy_id);
        if (!proxy)
            return null;
        return { account, proxy };
    }
    /**
     * Get account with card
     */
    async getWithCard() {
        const account = await this.getNext({ withCard: true });
        if (!account || !account.card_id)
            return null;
        const card = await this.db.getCardById(account.card_id);
        if (!card)
            return null;
        return { account, card };
    }
    /**
     * Get full profile (account + proxy + card)
     */
    async getFullProfile() {
        const account = await this.getNext({ withProxy: true, withCard: true });
        if (!account)
            return null;
        const [proxy, card] = await Promise.all([
            account.proxy_id ? this.db.getProxyById(account.proxy_id) : null,
            account.card_id ? this.db.getCardById(account.card_id) : null
        ]);
        return { account, proxy, card };
    }
    /**
     * Get count of available accounts
     */
    async getAvailableCount() {
        const stats = await this.db.getStats();
        return stats.accounts.active;
    }
}
exports.AccountProvider = AccountProvider;
class CardProvider extends BaseProvider {
    options;
    currentCard = null;
    constructor(db, options = {}) {
        super(db);
        this.options = {
            autoMarkUsed: true,
            validateExpiry: true,
            maxUsagePerCard: 1,
            ...options
        };
    }
    /**
     * Get next available card
     */
    async getNext(options = {}) {
        const card = await this.db.getNextCard({
            ...options,
            excludeIds: this.getExcludedIds(),
            lockForUpdate: true
        });
        if (card) {
            // Validate expiry if enabled
            if (this.options.validateExpiry) {
                const valid = await this.db.validateCard(card);
                if (!valid) {
                    this.usedIds.add(card.id);
                    return this.getNext(options); // Try next card
                }
            }
            this.currentCard = card;
            this.usedIds.add(card.id);
            this.cache.set(card.id, card);
            this.emit('card:selected', { id: card.id, type: card.card_type });
        }
        return card;
    }
    /**
     * Get current card
     */
    getCurrent() {
        return this.currentCard;
    }
    /**
     * Mark card payment as successful
     */
    async markSuccess() {
        if (!this.currentCard)
            return;
        await this.db.markCardUsed(this.currentCard.id, true);
        this.emit('card:success', this.currentCard);
        this.currentCard = null;
    }
    /**
     * Mark card payment as declined
     */
    async markDeclined() {
        if (!this.currentCard)
            return;
        await this.db.markCardUsed(this.currentCard.id, false);
        this.emit('card:declined', this.currentCard);
        this.currentCard = null;
    }
    /**
     * Get card details formatted for payment forms
     */
    getPaymentDetails() {
        if (!this.currentCard)
            return null;
        return {
            number: this.currentCard.card_number,
            holder: this.currentCard.holder_name,
            expiry: `${this.currentCard.expiry_month}/${this.currentCard.expiry_year}`,
            expiryMonth: this.currentCard.expiry_month,
            expiryYear: this.currentCard.expiry_year,
            cvv: this.currentCard.cvv
        };
    }
    /**
     * Get billing address formatted
     */
    getBillingAddress() {
        if (!this.currentCard)
            return null;
        return {
            address: this.currentCard.billing_address || '',
            city: this.currentCard.billing_city || '',
            zip: this.currentCard.billing_zip || '',
            country: this.currentCard.billing_country || ''
        };
    }
    /**
     * Get available count
     */
    async getAvailableCount() {
        const stats = await this.db.getStats();
        return stats.cards.active;
    }
}
exports.CardProvider = CardProvider;
class ProxyProvider extends BaseProvider {
    options;
    currentProxy = null;
    failCount = 0;
    rotationIndex = 0;
    proxyPool = [];
    constructor(db, options = {}) {
        super(db);
        this.options = {
            rotateOnFail: true,
            maxFailsBeforeRotate: 3,
            stickySession: false,
            ...options
        };
    }
    /**
     * Get next available proxy
     */
    async getNext(options = {}) {
        // Use sticky session if enabled and we have a working proxy
        if (this.options.stickySession && this.currentProxy && this.failCount === 0) {
            return this.currentProxy;
        }
        const proxy = await this.db.getNextProxy({
            country: options.country || this.options.preferredCountry,
            protocol: options.protocol || this.options.preferredProtocol,
            maxResponseTime: options.maxResponseTime,
            rotationGroup: options.rotationGroup,
            excludeIds: this.getExcludedIds(),
            lockForUpdate: true
        });
        if (proxy) {
            this.currentProxy = proxy;
            this.failCount = 0;
            this.cache.set(proxy.id, proxy);
            this.emit('proxy:selected', { id: proxy.id, host: proxy.host, country: proxy.country });
        }
        return proxy;
    }
    /**
     * Get current proxy
     */
    getCurrent() {
        return this.currentProxy;
    }
    /**
     * Get proxy URL for browser
     */
    getProxyUrl() {
        if (!this.currentProxy)
            return null;
        return this.db.getProxyUrl(this.currentProxy);
    }
    /**
     * Get proxy config for Playwright
     */
    getPlaywrightConfig() {
        if (!this.currentProxy)
            return null;
        const config = {
            server: `${this.currentProxy.protocol}://${this.currentProxy.host}:${this.currentProxy.port}`
        };
        if (this.currentProxy.username) {
            config.username = this.currentProxy.username;
            config.password = this.currentProxy.password;
        }
        return config;
    }
    /**
     * Report proxy success
     */
    async reportSuccess(responseTime) {
        if (!this.currentProxy)
            return;
        this.failCount = 0;
        await this.db.updateProxyStats(this.currentProxy.id, true, responseTime);
        this.emit('proxy:success', { id: this.currentProxy.id, responseTime });
    }
    /**
     * Report proxy failure
     */
    async reportFailure() {
        if (!this.currentProxy)
            return;
        this.failCount++;
        await this.db.updateProxyStats(this.currentProxy.id, false);
        this.emit('proxy:failure', { id: this.currentProxy.id, failCount: this.failCount });
        // Rotate if too many failures
        if (this.options.rotateOnFail && this.failCount >= (this.options.maxFailsBeforeRotate || 3)) {
            this.usedIds.add(this.currentProxy.id);
            this.currentProxy = null;
            this.emit('proxy:rotating');
        }
    }
    /**
     * Force rotation to next proxy
     */
    async rotate() {
        if (this.currentProxy) {
            this.usedIds.add(this.currentProxy.id);
        }
        this.currentProxy = null;
        this.failCount = 0;
        return this.getNext();
    }
    /**
     * Load proxy pool for round-robin rotation
     */
    async loadPool(options = {}) {
        const proxies = await this.db.raw()('proxies')
            .where('status', 'active')
            .where(builder => {
            if (options.country)
                builder.where('country', options.country);
            if (options.protocol)
                builder.where('protocol', options.protocol);
        })
            .orderBy('response_time', 'asc')
            .limit(options.limit || 100);
        this.proxyPool = proxies;
        this.rotationIndex = 0;
        this.emit('proxy:pool_loaded', { count: proxies.length });
        return proxies.length;
    }
    /**
     * Get next proxy from pool (round-robin)
     */
    getNextFromPool() {
        if (this.proxyPool.length === 0)
            return null;
        const proxy = this.proxyPool[this.rotationIndex];
        this.rotationIndex = (this.rotationIndex + 1) % this.proxyPool.length;
        this.currentProxy = proxy;
        return proxy;
    }
    /**
     * Get available count
     */
    async getAvailableCount() {
        const stats = await this.db.getStats();
        return stats.proxies.active;
    }
}
exports.ProxyProvider = ProxyProvider;
class EmailProvider extends BaseProvider {
    options;
    currentEmail = null;
    constructor(db, options = {}) {
        super(db);
        this.options = {
            requireVerified: false,
            ...options
        };
    }
    /**
     * Get next available email
     */
    async getNext(options = {}) {
        const email = await this.db.getNextEmail({
            provider: options.provider || this.options.preferredProvider,
            verified: options.verified ?? this.options.requireVerified,
            excludeIds: this.getExcludedIds(),
            lockForUpdate: true
        });
        if (email) {
            this.currentEmail = email;
            this.usedIds.add(email.id);
            this.cache.set(email.id, email);
            this.emit('email:selected', { id: email.id, provider: email.provider });
        }
        return email;
    }
    /**
     * Get current email
     */
    getCurrent() {
        return this.currentEmail;
    }
    /**
     * Mark email as used
     */
    async markUsed() {
        if (!this.currentEmail)
            return;
        await this.db.markEmailUsed(this.currentEmail.id);
        this.emit('email:used', this.currentEmail);
        this.currentEmail = null;
    }
    /**
     * Get IMAP config for email reading
     */
    getImapConfig() {
        if (!this.currentEmail || !this.currentEmail.imap_host)
            return null;
        return {
            host: this.currentEmail.imap_host,
            port: this.currentEmail.imap_port || 993,
            user: this.currentEmail.email,
            password: this.currentEmail.password || '',
            tls: true
        };
    }
    /**
     * Get available count
     */
    async getAvailableCount() {
        const stats = await this.db.getStats();
        return stats.emails.active;
    }
}
exports.EmailProvider = EmailProvider;
class DataProvider extends events_1.EventEmitter {
    accounts;
    cards;
    proxies;
    emails;
    db;
    constructor(config) {
        super();
        this.db = config.database;
        this.accounts = new AccountProvider(this.db, config.accountOptions);
        this.cards = new CardProvider(this.db, config.cardOptions);
        this.proxies = new ProxyProvider(this.db, config.proxyOptions);
        this.emails = new EmailProvider(this.db, config.emailOptions);
        // Forward events
        this.forwardEvents();
    }
    forwardEvents() {
        const providers = [
            { provider: this.accounts, prefix: 'account' },
            { provider: this.cards, prefix: 'card' },
            { provider: this.proxies, prefix: 'proxy' },
            { provider: this.emails, prefix: 'email' }
        ];
        for (const { provider, prefix } of providers) {
            provider.on('*', (event, data) => {
                this.emit(`${prefix}:${event}`, data);
            });
        }
    }
    /**
     * Get complete automation profile
     */
    async getAutomationProfile() {
        const account = await this.accounts.getNext();
        if (!account)
            return null;
        const [card, proxy] = await Promise.all([
            account.card_id ? this.db.getCardById(account.card_id) : this.cards.getNext(),
            account.proxy_id ? this.db.getProxyById(account.proxy_id) : this.proxies.getNext()
        ]);
        // Try to get email if account doesn't have one
        const email = await this.emails.getNext();
        return { account, card, proxy, email };
    }
    /**
     * Mark current profile as completed successfully
     */
    async markProfileSuccess() {
        await Promise.all([
            this.accounts.markSuccess(),
            this.cards.markSuccess(),
            this.proxies.reportSuccess()
        ]);
    }
    /**
     * Mark current profile as failed
     */
    async markProfileFailed(error) {
        await Promise.all([
            this.accounts.markFailed(error),
            this.cards.markDeclined(),
            this.proxies.reportFailure()
        ]);
    }
    /**
     * Reset all providers
     */
    reset() {
        this.accounts.resetUsed();
        this.cards.resetUsed();
        this.proxies.resetUsed();
        this.emails.resetUsed();
    }
    /**
     * Clear all caches
     */
    clearCaches() {
        this.accounts.clearCache();
        this.cards.clearCache();
        this.proxies.clearCache();
        this.emails.clearCache();
    }
    /**
     * Get statistics
     */
    async getStats() {
        return this.db.getStats();
    }
}
exports.DataProvider = DataProvider;
exports.default = DataProvider;
//# sourceMappingURL=DataProviders.js.map