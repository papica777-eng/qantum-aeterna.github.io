"use strict";
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🧠 QANTUM HYBRID v1.0.0 - Fluent Chain API
 * Cypress-style chaining: cy.get().should().click()
 * ═══════════════════════════════════════════════════════════════════════════════
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FluentChain = void 0;
// ═══════════════════════════════════════════════════════════════════════════════
// FLUENT CHAIN
// ═══════════════════════════════════════════════════════════════════════════════
class FluentChain {
    page;
    selector;
    locator;
    parentChain;
    options;
    assertions = [];
    constructor(page, selector, options = {}, parentChain) {
        this.page = page;
        this.selector = selector;
        this.locator = page.locator(selector);
        this.parentChain = parentChain;
        this.options = {
            timeout: options.timeout ?? 30000,
            log: options.log ?? true,
            force: options.force ?? false,
        };
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // TRAVERSAL
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Get child element
     */
    find(selector) {
        const newLocator = this.locator.locator(selector);
        const chain = new FluentChain(this.page, `${this.selector} ${selector}`, this.options, this);
        chain.locator = newLocator;
        return chain;
    }
    /**
     * Get first element
     */
    first() {
        const chain = new FluentChain(this.page, `${this.selector}:first`, this.options, this);
        chain.locator = this.locator.first();
        return chain;
    }
    /**
     * Get last element
     */
    last() {
        const chain = new FluentChain(this.page, `${this.selector}:last`, this.options, this);
        chain.locator = this.locator.last();
        return chain;
    }
    /**
     * Get nth element
     */
    eq(index) {
        const chain = new FluentChain(this.page, `${this.selector}:eq(${index})`, this.options, this);
        chain.locator = this.locator.nth(index);
        return chain;
    }
    /**
     * Get parent element
     */
    parent() {
        const chain = new FluentChain(this.page, `${this.selector}/..`, this.options, this);
        chain.locator = this.locator.locator('..');
        return chain;
    }
    /**
     * Get siblings
     */
    siblings(selector) {
        const sibSelector = selector ?? '*';
        const chain = new FluentChain(this.page, `${this.selector}~${sibSelector}`, this.options, this);
        chain.locator = this.locator.locator(`xpath=following-sibling::${sibSelector}`);
        return chain;
    }
    /**
     * Get next sibling
     */
    next() {
        const chain = new FluentChain(this.page, `${this.selector}+*`, this.options, this);
        chain.locator = this.locator.locator('xpath=following-sibling::*[1]');
        return chain;
    }
    /**
     * Get previous sibling
     */
    prev() {
        const chain = new FluentChain(this.page, `${this.selector}-*`, this.options, this);
        chain.locator = this.locator.locator('xpath=preceding-sibling::*[1]');
        return chain;
    }
    /**
     * Filter by selector
     */
    filter(selector) {
        const chain = new FluentChain(this.page, `${this.selector}:filter(${selector})`, this.options, this);
        chain.locator = this.locator.filter({ has: this.page.locator(selector) });
        return chain;
    }
    /**
     * Filter by text
     */
    contains(text) {
        const chain = new FluentChain(this.page, `${this.selector}:contains("${text}")`, this.options, this);
        chain.locator = this.locator.filter({ hasText: text });
        return chain;
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // ACTIONS
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Click element
     */
    async click(options) {
        await this.runAssertions();
        if (this.options.log) {
            console.log(`🖱️ click: ${this.selector}`);
        }
        await this.locator.click({
            timeout: this.options.timeout,
            force: options?.force ?? this.options.force,
        });
        return this;
    }
    /**
     * Double click
     */
    async dblclick() {
        await this.runAssertions();
        if (this.options.log) {
            console.log(`🖱️🖱️ dblclick: ${this.selector}`);
        }
        await this.locator.dblclick({ timeout: this.options.timeout });
        return this;
    }
    /**
     * Right click
     */
    async rightclick() {
        await this.runAssertions();
        if (this.options.log) {
            console.log(`🖱️ rightclick: ${this.selector}`);
        }
        await this.locator.click({ button: 'right', timeout: this.options.timeout });
        return this;
    }
    /**
     * Type text
     */
    async type(text, options) {
        await this.runAssertions();
        if (this.options.log) {
            console.log(`⌨️ type: "${text}" → ${this.selector}`);
        }
        if (options?.clear) {
            await this.locator.clear();
        }
        await this.locator.fill(text);
        return this;
    }
    /**
     * Clear input
     */
    async clear() {
        await this.runAssertions();
        if (this.options.log) {
            console.log(`🧹 clear: ${this.selector}`);
        }
        await this.locator.clear();
        return this;
    }
    /**
     * Check checkbox/radio
     */
    async check() {
        await this.runAssertions();
        if (this.options.log) {
            console.log(`☑️ check: ${this.selector}`);
        }
        await this.locator.check({ timeout: this.options.timeout });
        return this;
    }
    /**
     * Uncheck checkbox
     */
    async uncheck() {
        await this.runAssertions();
        if (this.options.log) {
            console.log(`☐ uncheck: ${this.selector}`);
        }
        await this.locator.uncheck({ timeout: this.options.timeout });
        return this;
    }
    /**
     * Select option from dropdown
     */
    async select(value) {
        await this.runAssertions();
        if (this.options.log) {
            console.log(`📋 select: ${value} → ${this.selector}`);
        }
        await this.locator.selectOption(value);
        return this;
    }
    /**
     * Hover over element
     */
    async hover() {
        await this.runAssertions();
        if (this.options.log) {
            console.log(`👆 hover: ${this.selector}`);
        }
        await this.locator.hover({ timeout: this.options.timeout });
        return this;
    }
    /**
     * Focus element
     */
    async focus() {
        await this.runAssertions();
        if (this.options.log) {
            console.log(`🎯 focus: ${this.selector}`);
        }
        await this.locator.focus();
        return this;
    }
    /**
     * Blur element
     */
    async blur() {
        await this.runAssertions();
        if (this.options.log) {
            console.log(`💨 blur: ${this.selector}`);
        }
        await this.locator.blur();
        return this;
    }
    /**
     * Scroll element into view
     */
    async scrollIntoView() {
        await this.runAssertions();
        if (this.options.log) {
            console.log(`📜 scrollIntoView: ${this.selector}`);
        }
        await this.locator.scrollIntoViewIfNeeded();
        return this;
    }
    /**
     * Trigger event
     */
    async trigger(event) {
        await this.runAssertions();
        if (this.options.log) {
            console.log(`⚡ trigger: ${event} → ${this.selector}`);
        }
        await this.locator.dispatchEvent(event);
        return this;
    }
    /**
     * Submit form
     */
    async submit() {
        await this.runAssertions();
        if (this.options.log) {
            console.log(`📤 submit: ${this.selector}`);
        }
        await this.locator.evaluate((el) => {
            const form = el.closest('form');
            if (form)
                form.submit();
        });
        return this;
    }
    /**
     * Upload file
     */
    async attachFile(filePath) {
        await this.runAssertions();
        if (this.options.log) {
            console.log(`📎 attachFile: ${filePath} → ${this.selector}`);
        }
        await this.locator.setInputFiles(filePath);
        return this;
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // ASSERTIONS (should)
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Add assertion (Cypress-style should)
     */
    should(assertion, ...args) {
        if (typeof assertion === 'function') {
            this.assertions.push(async () => {
                const result = await assertion(this);
                if (result === false) {
                    throw new Error('Custom assertion failed');
                }
            });
            return this;
        }
        // Parse Chai-style assertions
        const assertionMap = {
            // Visibility
            'be.visible': async () => {
                await expect(this.locator).toBeVisible({ timeout: this.options.timeout });
            },
            'be.hidden': async () => {
                await expect(this.locator).toBeHidden({ timeout: this.options.timeout });
            },
            'not.be.visible': async () => {
                await expect(this.locator).toBeHidden({ timeout: this.options.timeout });
            },
            'exist': async () => {
                const count = await this.locator.count();
                if (count === 0)
                    throw new Error(`Element does not exist: ${this.selector}`);
            },
            'not.exist': async () => {
                const count = await this.locator.count();
                if (count > 0)
                    throw new Error(`Element exists: ${this.selector}`);
            },
            // State
            'be.enabled': async () => {
                await expect(this.locator).toBeEnabled({ timeout: this.options.timeout });
            },
            'be.disabled': async () => {
                await expect(this.locator).toBeDisabled({ timeout: this.options.timeout });
            },
            'be.checked': async () => {
                await expect(this.locator).toBeChecked({ timeout: this.options.timeout });
            },
            'not.be.checked': async () => {
                await expect(this.locator).not.toBeChecked({ timeout: this.options.timeout });
            },
            'be.focused': async () => {
                await expect(this.locator).toBeFocused({ timeout: this.options.timeout });
            },
            'be.empty': async () => {
                await expect(this.locator).toBeEmpty({ timeout: this.options.timeout });
            },
            // Content
            'have.text': async () => {
                const expected = args[0];
                await expect(this.locator).toHaveText(expected, { timeout: this.options.timeout });
            },
            'contain': async () => {
                const expected = args[0];
                await expect(this.locator).toContainText(expected, { timeout: this.options.timeout });
            },
            'contain.text': async () => {
                const expected = args[0];
                await expect(this.locator).toContainText(expected, { timeout: this.options.timeout });
            },
            'have.value': async () => {
                const expected = args[0];
                await expect(this.locator).toHaveValue(expected, { timeout: this.options.timeout });
            },
            'have.attr': async () => {
                const [attr, value] = args;
                await expect(this.locator).toHaveAttribute(attr, value, { timeout: this.options.timeout });
            },
            'have.class': async () => {
                const className = args[0];
                await expect(this.locator).toHaveClass(new RegExp(className), { timeout: this.options.timeout });
            },
            'have.css': async () => {
                const [prop, value] = args;
                await expect(this.locator).toHaveCSS(prop, value, { timeout: this.options.timeout });
            },
            // Count
            'have.length': async () => {
                const expected = args[0];
                await expect(this.locator).toHaveCount(expected, { timeout: this.options.timeout });
            },
            'have.length.gt': async () => {
                const expected = args[0];
                const count = await this.locator.count();
                if (count <= expected)
                    throw new Error(`Expected length > ${expected}, got ${count}`);
            },
            'have.length.gte': async () => {
                const expected = args[0];
                const count = await this.locator.count();
                if (count < expected)
                    throw new Error(`Expected length >= ${expected}, got ${count}`);
            },
            'have.length.lt': async () => {
                const expected = args[0];
                const count = await this.locator.count();
                if (count >= expected)
                    throw new Error(`Expected length < ${expected}, got ${count}`);
            },
            'have.length.lte': async () => {
                const expected = args[0];
                const count = await this.locator.count();
                if (count > expected)
                    throw new Error(`Expected length <= ${expected}, got ${count}`);
            },
            // Misc
            'match': async () => {
                const pattern = args[0];
                const text = await this.locator.textContent() ?? '';
                if (!pattern.test(text))
                    throw new Error(`Text "${text}" does not match ${pattern}`);
            },
            'include': async () => {
                const expected = args[0];
                const text = await this.locator.textContent() ?? '';
                if (!text.includes(expected))
                    throw new Error(`Text "${text}" does not include "${expected}"`);
            },
        };
        const assertFn = assertionMap[assertion];
        if (assertFn) {
            this.assertions.push(assertFn);
        }
        else {
            console.warn(`Unknown assertion: ${assertion}`);
        }
        return this;
    }
    /**
     * Add negated assertion
     */
    and(assertion, ...args) {
        return this.should(assertion, ...args);
    }
    /**
     * Run all pending assertions
     */
    async runAssertions() {
        for (const assertion of this.assertions) {
            await assertion();
        }
        this.assertions = [];
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // GETTERS
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Get text content
     */
    async text() {
        await this.runAssertions();
        return (await this.locator.textContent()) ?? '';
    }
    /**
     * Get inner text
     */
    async innerText() {
        await this.runAssertions();
        return await this.locator.innerText();
    }
    /**
     * Get attribute value
     */
    async attr(name) {
        await this.runAssertions();
        return await this.locator.getAttribute(name);
    }
    /**
     * Get input value
     */
    async val() {
        await this.runAssertions();
        return await this.locator.inputValue();
    }
    /**
     * Get element count
     */
    async length() {
        return await this.locator.count();
    }
    /**
     * Check if visible
     */
    async isVisible() {
        return await this.locator.isVisible();
    }
    /**
     * Check if enabled
     */
    async isEnabled() {
        return await this.locator.isEnabled();
    }
    /**
     * Check if checked
     */
    async isChecked() {
        return await this.locator.isChecked();
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // CALLBACKS
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Execute callback with element (then)
     */
    async then(callback) {
        await this.runAssertions();
        return await callback(this);
    }
    /**
     * Execute callback on each element
     */
    async each(callback) {
        await this.runAssertions();
        const count = await this.locator.count();
        for (let i = 0; i < count; i++) {
            const chain = new FluentChain(this.page, `${this.selector}[${i}]`, this.options);
            chain.locator = this.locator.nth(i);
            await callback(chain, i);
        }
        return this;
    }
    /**
     * Execute callback with value (invoke)
     */
    async invoke(method) {
        await this.runAssertions();
        return await this.locator.evaluate((el, m) => el[m]?.(), method);
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // WAITING
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Wait for element to appear
     */
    async wait(timeout) {
        await this.locator.waitFor({
            state: 'visible',
            timeout: timeout ?? this.options.timeout
        });
        return this;
    }
    /**
     * Wait for element to disappear
     */
    async waitUntilGone(timeout) {
        await this.locator.waitFor({
            state: 'hidden',
            timeout: timeout ?? this.options.timeout
        });
        return this;
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITIES
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Get underlying Playwright locator
     */
    getLocator() {
        return this.locator;
    }
    /**
     * Take screenshot of element
     */
    async screenshot(path) {
        await this.runAssertions();
        return await this.locator.screenshot({ path });
    }
    /**
     * Log element info
     */
    async debug() {
        const count = await this.locator.count();
        const isVisible = count > 0 ? await this.locator.first().isVisible() : false;
        console.log(`🔍 Debug: ${this.selector}`);
        console.log(`   Count: ${count}`);
        console.log(`   Visible: ${isVisible}`);
        if (count > 0) {
            const text = await this.locator.first().textContent();
            console.log(`   Text: ${text?.substring(0, 50)}`);
        }
        return this;
    }
}
exports.FluentChain = FluentChain;
// ═══════════════════════════════════════════════════════════════════════════════
// EXPECT HELPERS (Playwright compatibility)
// ═══════════════════════════════════════════════════════════════════════════════
function expect(locator) {
    return {
        async toBeVisible(options) {
            await locator.waitFor({ state: 'visible', timeout: options?.timeout });
        },
        async toBeHidden(options) {
            await locator.waitFor({ state: 'hidden', timeout: options?.timeout });
        },
        async toBeEnabled(options) {
            const isEnabled = await locator.isEnabled();
            if (!isEnabled)
                throw new Error('Element is not enabled');
        },
        async toBeDisabled(options) {
            const isDisabled = await locator.isDisabled();
            if (!isDisabled)
                throw new Error('Element is not disabled');
        },
        async toBeChecked(options) {
            const isChecked = await locator.isChecked();
            if (!isChecked)
                throw new Error('Element is not checked');
        },
        async toBeFocused(options) {
            const isFocused = await locator.evaluate(el => el === document.activeElement);
            if (!isFocused)
                throw new Error('Element is not focused');
        },
        async toBeEmpty(options) {
            const text = await locator.textContent();
            if (text && text.trim())
                throw new Error('Element is not empty');
        },
        async toHaveText(expected, options) {
            const text = await locator.textContent() ?? '';
            if (typeof expected === 'string') {
                if (text !== expected)
                    throw new Error(`Expected "${expected}", got "${text}"`);
            }
            else {
                if (!expected.test(text))
                    throw new Error(`Text "${text}" does not match ${expected}`);
            }
        },
        async toContainText(expected, options) {
            const text = await locator.textContent() ?? '';
            if (!text.includes(expected))
                throw new Error(`"${text}" does not contain "${expected}"`);
        },
        async toHaveValue(expected, options) {
            const value = await locator.inputValue();
            if (value !== expected)
                throw new Error(`Expected value "${expected}", got "${value}"`);
        },
        async toHaveAttribute(name, value, options) {
            const attr = await locator.getAttribute(name);
            if (typeof value === 'string') {
                if (attr !== value)
                    throw new Error(`Expected ${name}="${value}", got "${attr}"`);
            }
            else {
                if (!attr || !value.test(attr))
                    throw new Error(`Attribute ${name}="${attr}" does not match ${value}`);
            }
        },
        async toHaveClass(expected, options) {
            const className = await locator.getAttribute('class') ?? '';
            if (typeof expected === 'string') {
                if (!className.includes(expected))
                    throw new Error(`Expected class "${expected}" in "${className}"`);
            }
            else {
                if (!expected.test(className))
                    throw new Error(`Class "${className}" does not match ${expected}`);
            }
        },
        async toHaveCSS(property, value, options) {
            const css = await locator.evaluate((el, prop) => window.getComputedStyle(el).getPropertyValue(prop), property);
            if (css !== value)
                throw new Error(`Expected CSS ${property}: ${value}, got ${css}`);
        },
        async toHaveCount(expected, options) {
            const count = await locator.count();
            if (count !== expected)
                throw new Error(`Expected ${expected} elements, found ${count}`);
        },
        not: {
            async toBeChecked(options) {
                const isChecked = await locator.isChecked();
                if (isChecked)
                    throw new Error('Element is checked');
            },
        },
    };
}
exports.default = FluentChain;
//# sourceMappingURL=FluentChain.js.map