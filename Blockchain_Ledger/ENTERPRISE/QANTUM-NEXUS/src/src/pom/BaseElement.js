"use strict";
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🧠 QANTUM HYBRID v1.0.0 - BaseElement
 * Enterprise-grade element with self-healing capabilities
 * Ported from: training-framework/architecture/pom-base.js
 * ═══════════════════════════════════════════════════════════════════════════════
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseElement = void 0;
const events_1 = require("events");
// ═══════════════════════════════════════════════════════════════════════════════
// BASE ELEMENT CLASS
// ═══════════════════════════════════════════════════════════════════════════════
class BaseElement extends events_1.EventEmitter {
    locator;
    options;
    alternativeLocators;
    metadata;
    state;
    page;
    cachedLocator;
    constructor(locator, options = {}) {
        super();
        this.locator = locator;
        this.options = {
            timeout: options.timeout ?? 30000,
            retries: options.retries ?? 3,
            waitBetweenRetries: options.waitBetweenRetries ?? 500,
            selfHealing: options.selfHealing ?? true,
            cacheEnabled: options.cacheEnabled ?? true,
            name: options.name ?? 'unnamed',
            type: options.type ?? 'generic',
            description: options.description ?? '',
        };
        this.alternativeLocators = [];
        this.metadata = {
            name: this.options.name,
            type: this.options.type,
            description: this.options.description,
            createdAt: Date.now(),
        };
        this.state = {
            lastInteraction: null,
            interactionCount: 0,
            errors: [],
            healingHistory: [],
        };
    }
    /**
     * Set page context
     */
    setPage(page) {
        this.page = page;
        this.cachedLocator = undefined;
        return this;
    }
    /**
     * Add alternative locator for self-healing
     */
    addAlternative(locator, priority = 0) {
        this.alternativeLocators.push({ locator, priority });
        this.alternativeLocators.sort((a, b) => b.priority - a.priority);
        return this;
    }
    /**
     * Get all locators (primary + alternatives)
     */
    getAllLocators() {
        return [
            { locator: this.locator, priority: 100 },
            ...this.alternativeLocators,
        ];
    }
    /**
     * Find element with self-healing
     */
    async find() {
        if (!this.page) {
            throw new Error('Page not set. Call setPage() first.');
        }
        // Use cached locator if available
        if (this.options.cacheEnabled && this.cachedLocator) {
            try {
                const count = await this.cachedLocator.count();
                if (count > 0) {
                    return this.cachedLocator;
                }
            }
            catch {
                // Cache invalid, continue to find
            }
        }
        const locators = this.getAllLocators();
        let lastError = null;
        for (const { locator, priority } of locators) {
            try {
                const playwrightLocator = this.toPlaywrightLocator(locator);
                const count = await playwrightLocator.count();
                if (count > 0) {
                    // If healed (not primary locator), record it
                    if (locator !== this.locator) {
                        this.recordHealing(locator);
                    }
                    this.cachedLocator = playwrightLocator;
                    return playwrightLocator;
                }
            }
            catch (error) {
                lastError = error;
            }
        }
        throw lastError || new Error(`Element not found: ${this.metadata.name}`);
    }
    /**
     * Convert LocatorStrategy to Playwright Locator
     */
    toPlaywrightLocator(strategy) {
        if (!this.page) {
            throw new Error('Page not set');
        }
        switch (strategy.type) {
            case 'css':
                return this.page.locator(strategy.value);
            case 'xpath':
                return this.page.locator(`xpath=${strategy.value}`);
            case 'id':
                return this.page.locator(`#${strategy.value}`);
            case 'name':
                return this.page.locator(`[name="${strategy.value}"]`);
            case 'testId':
                return this.page.getByTestId(strategy.value);
            case 'text':
                return this.page.getByText(strategy.value, { exact: strategy.options?.exact });
            case 'role':
                return this.page.getByRole(strategy.value, strategy.options);
            case 'label':
                return this.page.getByLabel(strategy.value);
            default:
                return this.page.locator(strategy.value);
        }
    }
    /**
     * Record healing event
     */
    recordHealing(usedLocator) {
        const event = {
            timestamp: Date.now(),
            originalLocator: this.locator,
            usedLocator,
            successful: true,
        };
        this.state.healingHistory.push(event);
        this.emit('healed', event);
        console.log(`🔧 Self-healed: ${this.metadata.name}`);
    }
    /**
     * Record interaction
     */
    recordInteraction(type, details = {}) {
        this.state.lastInteraction = {
            type,
            timestamp: Date.now(),
            details,
        };
        this.state.interactionCount++;
        this.emit('interaction', this.state.lastInteraction);
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // ACTIONS
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Click element
     */
    async click() {
        const locator = await this.find();
        await this.retry(async () => {
            await locator.click({ timeout: this.options.timeout });
        });
        this.recordInteraction('click');
    }
    /**
     * Double click
     */
    async dblclick() {
        const locator = await this.find();
        await this.retry(async () => {
            await locator.dblclick({ timeout: this.options.timeout });
        });
        this.recordInteraction('dblclick');
    }
    /**
     * Right click
     */
    async rightclick() {
        const locator = await this.find();
        await this.retry(async () => {
            await locator.click({ button: 'right', timeout: this.options.timeout });
        });
        this.recordInteraction('rightclick');
    }
    /**
     * Type text
     */
    async type(text, options) {
        const locator = await this.find();
        await this.retry(async () => {
            if (options?.clear) {
                await locator.clear();
            }
            await locator.fill(text);
        });
        this.recordInteraction('type', { text });
    }
    /**
     * Press key
     */
    async press(key) {
        const locator = await this.find();
        await locator.press(key);
        this.recordInteraction('press', { key });
    }
    /**
     * Clear input
     */
    async clear() {
        const locator = await this.find();
        await locator.clear();
        this.recordInteraction('clear');
    }
    /**
     * Hover over element
     */
    async hover() {
        const locator = await this.find();
        await locator.hover({ timeout: this.options.timeout });
        this.recordInteraction('hover');
    }
    /**
     * Focus element
     */
    async focus() {
        const locator = await this.find();
        await locator.focus();
        this.recordInteraction('focus');
    }
    /**
     * Blur element
     */
    async blur() {
        const locator = await this.find();
        await locator.blur();
        this.recordInteraction('blur');
    }
    /**
     * Scroll into view
     */
    async scrollIntoView() {
        const locator = await this.find();
        await locator.scrollIntoViewIfNeeded();
        this.recordInteraction('scrollIntoView');
    }
    /**
     * Select option from dropdown
     */
    async select(value) {
        const locator = await this.find();
        await locator.selectOption(value);
        this.recordInteraction('select', { value });
    }
    /**
     * Check checkbox/radio
     */
    async check() {
        const locator = await this.find();
        await locator.check();
        this.recordInteraction('check');
    }
    /**
     * Uncheck checkbox
     */
    async uncheck() {
        const locator = await this.find();
        await locator.uncheck();
        this.recordInteraction('uncheck');
    }
    /**
     * Upload file
     */
    async upload(filePath) {
        const locator = await this.find();
        await locator.setInputFiles(filePath);
        this.recordInteraction('upload', { filePath });
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // GETTERS
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Get text content
     */
    async getText() {
        const locator = await this.find();
        return (await locator.textContent()) ?? '';
    }
    /**
     * Get inner text
     */
    async getInnerText() {
        const locator = await this.find();
        return await locator.innerText();
    }
    /**
     * Get input value
     */
    async getValue() {
        const locator = await this.find();
        return await locator.inputValue();
    }
    /**
     * Get attribute
     */
    async getAttribute(name) {
        const locator = await this.find();
        return await locator.getAttribute(name);
    }
    /**
     * Get CSS property
     */
    async getCssValue(property) {
        const locator = await this.find();
        return await locator.evaluate((el, prop) => {
            return window.getComputedStyle(el).getPropertyValue(prop);
        }, property);
    }
    /**
     * Get bounding box
     */
    async getRect() {
        const locator = await this.find();
        return await locator.boundingBox();
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // STATE CHECKS
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Check if visible
     */
    async isVisible() {
        try {
            const locator = await this.find();
            return await locator.isVisible();
        }
        catch {
            return false;
        }
    }
    /**
     * Check if enabled
     */
    async isEnabled() {
        const locator = await this.find();
        return await locator.isEnabled();
    }
    /**
     * Check if disabled
     */
    async isDisabled() {
        const locator = await this.find();
        return await locator.isDisabled();
    }
    /**
     * Check if checked
     */
    async isChecked() {
        const locator = await this.find();
        return await locator.isChecked();
    }
    /**
     * Check if element exists
     */
    async exists() {
        try {
            const locator = await this.find();
            return (await locator.count()) > 0;
        }
        catch {
            return false;
        }
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // WAITS
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Wait for element to be visible
     */
    async waitForVisible(timeout) {
        const locator = await this.find();
        await locator.waitFor({ state: 'visible', timeout: timeout ?? this.options.timeout });
    }
    /**
     * Wait for element to be hidden
     */
    async waitForHidden(timeout) {
        const locator = await this.find();
        await locator.waitFor({ state: 'hidden', timeout: timeout ?? this.options.timeout });
    }
    /**
     * Wait for element to be attached
     */
    async waitForAttached(timeout) {
        const locator = await this.find();
        await locator.waitFor({ state: 'attached', timeout: timeout ?? this.options.timeout });
    }
    /**
     * Wait for element to be detached
     */
    async waitForDetached(timeout) {
        const locator = await this.find();
        await locator.waitFor({ state: 'detached', timeout: timeout ?? this.options.timeout });
    }
    /**
     * Wait for custom condition
     */
    async waitFor(condition, timeout) {
        const actualTimeout = timeout ?? this.options.timeout;
        const startTime = Date.now();
        while (Date.now() - startTime < actualTimeout) {
            try {
                const result = await condition();
                if (result)
                    return;
            }
            catch {
                // Continue waiting
            }
            await this.sleep(100);
        }
        throw new Error(`Wait timeout for ${this.metadata.name}: ${actualTimeout}ms`);
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITIES
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Retry operation
     */
    async retry(operation, retries) {
        const maxRetries = retries ?? this.options.retries;
        let lastError;
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await operation();
            }
            catch (error) {
                lastError = error;
                this.state.errors.push({
                    timestamp: Date.now(),
                    attempt: i + 1,
                    error: lastError.message,
                });
                await this.sleep(this.options.waitBetweenRetries);
            }
        }
        throw lastError;
    }
    /**
     * Sleep helper
     */
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    /**
     * Get element state info
     */
    getState() {
        return {
            ...this.state,
            metadata: this.metadata,
            locatorCount: this.getAllLocators().length,
        };
    }
    /**
     * Get Playwright locator directly
     */
    async getLocator() {
        return await this.find();
    }
}
exports.BaseElement = BaseElement;
exports.default = BaseElement;
//# sourceMappingURL=BaseElement.js.map