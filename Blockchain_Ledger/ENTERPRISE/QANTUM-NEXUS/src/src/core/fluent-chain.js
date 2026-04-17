"use strict";
/**
 * 🧠 QANTUM HYBRID - Fluent Chain
 * Cypress-style method chaining: mm.click().type().should()
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FluentChain = void 0;
class FluentChain {
    page;
    currentLocator;
    currentSelector;
    selfHealer;
    deepSearch;
    timeout;
    constructor(page, selfHealer, deepSearch, timeout = 30000) {
        this.page = page;
        this.selfHealer = selfHealer;
        this.deepSearch = deepSearch;
        this.timeout = timeout;
    }
    /**
     * Избери елемент
     */
    get(selector) {
        this.currentSelector = selector;
        this.currentLocator = this.page.locator(selector);
        return this;
    }
    /**
     * Намери с Deep Search (Shadow DOM, Iframes)
     */
    async find(selector) {
        this.currentSelector = selector;
        const result = await this.deepSearch.find(this.page, selector);
        if (result.found && result.locator) {
            this.currentLocator = result.locator;
        }
        else {
            // Self-healing опит
            const healed = await this.selfHealer.heal(this.page, selector);
            if (healed.healed && healed.newSelector) {
                this.currentLocator = this.page.locator(healed.newSelector);
                console.log(`🩹 Self-healed: "${selector}" → "${healed.newSelector}"`);
            }
            else {
                this.currentLocator = this.page.locator(selector);
            }
        }
        return this;
    }
    /**
     * Кликни
     */
    async click() {
        await this.ensureLocator();
        await this.currentLocator.click({ timeout: this.timeout });
        return this;
    }
    /**
     * Double click
     */
    async dblclick() {
        await this.ensureLocator();
        await this.currentLocator.dblclick({ timeout: this.timeout });
        return this;
    }
    /**
     * Right click
     */
    async rightclick() {
        await this.ensureLocator();
        await this.currentLocator.click({ button: 'right', timeout: this.timeout });
        return this;
    }
    /**
     * Въведи текст
     */
    async type(text, options) {
        await this.ensureLocator();
        if (options?.clear) {
            await this.currentLocator.clear();
        }
        await this.currentLocator.fill(text);
        return this;
    }
    /**
     * Натисни клавиш
     */
    async press(key) {
        await this.ensureLocator();
        await this.currentLocator.press(key);
        return this;
    }
    /**
     * Hover
     */
    async hover() {
        await this.ensureLocator();
        await this.currentLocator.hover({ timeout: this.timeout });
        return this;
    }
    /**
     * Focus
     */
    async focus() {
        await this.ensureLocator();
        await this.currentLocator.focus();
        return this;
    }
    /**
     * Scroll into view
     */
    async scrollIntoView() {
        await this.ensureLocator();
        await this.currentLocator.scrollIntoViewIfNeeded();
        return this;
    }
    /**
     * Избери от dropdown
     */
    async select(value) {
        await this.ensureLocator();
        await this.currentLocator.selectOption(value);
        return this;
    }
    /**
     * Check checkbox/radio
     */
    async check() {
        await this.ensureLocator();
        await this.currentLocator.check();
        return this;
    }
    /**
     * Uncheck
     */
    async uncheck() {
        await this.ensureLocator();
        await this.currentLocator.uncheck();
        return this;
    }
    /**
     * Upload file
     */
    async upload(filePath) {
        await this.ensureLocator();
        await this.currentLocator.setInputFiles(filePath);
        return this;
    }
    /**
     * Изчакай елемент
     */
    async wait(timeout) {
        await this.ensureLocator();
        await this.currentLocator.waitFor({
            state: 'visible',
            timeout: timeout || this.timeout
        });
        return this;
    }
    /**
     * Cypress-style should() assertions
     */
    async should(assertion, expected) {
        await this.ensureLocator();
        const locator = this.currentLocator;
        switch (assertion) {
            case 'be.visible':
                await (0, test_1.expect)(locator).toBeVisible({ timeout: this.timeout });
                break;
            case 'be.hidden':
            case 'not.be.visible':
                await (0, test_1.expect)(locator).toBeHidden({ timeout: this.timeout });
                break;
            case 'exist':
                await (0, test_1.expect)(locator).toHaveCount(1, { timeout: this.timeout });
                break;
            case 'not.exist':
                await (0, test_1.expect)(locator).toHaveCount(0, { timeout: this.timeout });
                break;
            case 'be.enabled':
                await (0, test_1.expect)(locator).toBeEnabled({ timeout: this.timeout });
                break;
            case 'be.disabled':
                await (0, test_1.expect)(locator).toBeDisabled({ timeout: this.timeout });
                break;
            case 'be.checked':
                await (0, test_1.expect)(locator).toBeChecked({ timeout: this.timeout });
                break;
            case 'have.text':
                await (0, test_1.expect)(locator).toHaveText(expected, { timeout: this.timeout });
                break;
            case 'contain.text':
            case 'contain':
                await (0, test_1.expect)(locator).toContainText(expected, { timeout: this.timeout });
                break;
            case 'have.value':
                await (0, test_1.expect)(locator).toHaveValue(expected, { timeout: this.timeout });
                break;
            case 'have.attr':
                if (Array.isArray(expected)) {
                    await (0, test_1.expect)(locator).toHaveAttribute(expected[0], expected[1], { timeout: this.timeout });
                }
                break;
            case 'have.class':
                await (0, test_1.expect)(locator).toHaveClass(new RegExp(expected), { timeout: this.timeout });
                break;
            case 'have.count':
                await (0, test_1.expect)(locator).toHaveCount(expected, { timeout: this.timeout });
                break;
            default:
                throw new Error(`Unknown assertion: ${assertion}`);
        }
        return this;
    }
    /**
     * Вземи текст
     */
    async getText() {
        await this.ensureLocator();
        return await this.currentLocator.textContent() || '';
    }
    /**
     * Вземи атрибут
     */
    async getAttribute(name) {
        await this.ensureLocator();
        return await this.currentLocator.getAttribute(name);
    }
    /**
     * Вземи стойност
     */
    async getValue() {
        await this.ensureLocator();
        return await this.currentLocator.inputValue();
    }
    /**
     * Провери дали е видим
     */
    async isVisible() {
        await this.ensureLocator();
        return await this.currentLocator.isVisible();
    }
    /**
     * Вземи Playwright locator директно
     */
    getLocator() {
        return this.currentLocator;
    }
    /**
     * Осигури че имаме локатор
     */
    async ensureLocator() {
        if (!this.currentLocator) {
            throw new Error('No element selected. Use .get() or .find() first.');
        }
        // Опитай self-healing ако елементът не съществува
        const count = await this.currentLocator.count();
        if (count === 0 && this.currentSelector) {
            const healed = await this.selfHealer.heal(this.page, this.currentSelector);
            if (healed.healed && healed.newSelector) {
                this.currentLocator = this.page.locator(healed.newSelector);
                console.log(`🩹 Auto-healed: "${this.currentSelector}" → "${healed.newSelector}"`);
            }
        }
    }
}
exports.FluentChain = FluentChain;
// Import Playwright expect
const test_1 = require("@playwright/test");
//# sourceMappingURL=fluent-chain.js.map