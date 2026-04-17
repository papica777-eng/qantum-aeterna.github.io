"use strict";
/**
 * 🧠 QANTUM HYBRID - Main Class
 * Унифициран API: mm.visit().click().type().should()
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.QAntum = void 0;
exports.createQA = createQA;
const playwright_1 = require("playwright");
const index_js_1 = require("../types/index.js");
const self_healing_js_1 = require("./self-healing.js");
const deep_search_js_1 = require("./deep-search.js");
const network_interceptor_js_1 = require("./network-interceptor.js");
const fluent_chain_js_1 = require("./fluent-chain.js");
class QAntum {
    config;
    browser;
    context;
    page;
    // Core engines
    selfHealer;
    deepSearch;
    networkInterceptor;
    constructor(config = {}) {
        this.config = { ...index_js_1.DEFAULT_CONFIG, ...config };
        this.selfHealer = new self_healing_js_1.SelfHealingEngine();
        this.deepSearch = new deep_search_js_1.DeepSearchEngine();
        this.networkInterceptor = new network_interceptor_js_1.NetworkInterceptor();
    }
    // ============== BROWSER LIFECYCLE ==============
    /**
     * Стартирай браузър
     */
    async launch() {
        const browserType = this.getBrowserType();
        this.browser = await browserType.launch({
            headless: this.config.browser.headless,
            slowMo: this.config.browser.slowMo
        });
        // Нов контекст за изолация (като Cypress)
        this.context = await this.browser.newContext({
            viewport: this.config.browser.viewport,
            baseURL: this.config.baseUrl
        });
        this.page = await this.context.newPage();
        // Инициализирай network interceptor
        await this.networkInterceptor.init(this.page);
        // Включи tracing ако е конфигурирано
        if (this.config.reporting.traces) {
            await this.context.tracing.start({
                screenshots: true,
                snapshots: true
            });
        }
        return this;
    }
    /**
     * Затвори браузър
     */
    async close() {
        if (this.config.reporting.traces && this.context) {
            await this.context.tracing.stop({
                path: `traces/trace-${Date.now()}.zip`
            });
        }
        await this.context?.close();
        await this.browser?.close();
    }
    /**
     * Вземи правилния браузър тип
     */
    getBrowserType() {
        const browsers = {
            chromium: playwright_1.chromium,
            firefox: playwright_1.firefox,
            webkit: playwright_1.webkit
        };
        return browsers[this.config.browser.browser];
    }
    // ============== NAVIGATION ==============
    /**
     * Отиди на URL
     */
    async visit(url) {
        this.ensurePage();
        await this.page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: this.config.browser.timeout
        });
        return this;
    }
    /**
     * Презареди страницата
     */
    async reload() {
        this.ensurePage();
        await this.page.reload();
        return this;
    }
    /**
     * Назад
     */
    async goBack() {
        this.ensurePage();
        await this.page.goBack();
        return this;
    }
    /**
     * Напред
     */
    async goForward() {
        this.ensurePage();
        await this.page.goForward();
        return this;
    }
    // ============== ELEMENT SELECTION (Fluent API) ==============
    /**
     * Избери елемент (връща FluentChain за chaining)
     */
    get(selector) {
        this.ensurePage();
        return new fluent_chain_js_1.FluentChain(this.page, this.selfHealer, this.deepSearch, this.config.browser.timeout).get(selector);
    }
    /**
     * Намери елемент с Deep Search
     */
    async find(selector) {
        this.ensurePage();
        const chain = new fluent_chain_js_1.FluentChain(this.page, this.selfHealer, this.deepSearch, this.config.browser.timeout);
        return await chain.find(selector);
    }
    /**
     * Селектори по различни стратегии
     */
    getByTestId(testId) {
        return this.get(`[data-testid="${testId}"]`);
    }
    getByText(text) {
        return this.get(`text="${text}"`);
    }
    getByRole(role, options) {
        this.ensurePage();
        const chain = new fluent_chain_js_1.FluentChain(this.page, this.selfHealer, this.deepSearch, this.config.browser.timeout);
        // @ts-ignore
        chain['currentLocator'] = this.page.getByRole(role, options);
        return chain;
    }
    getByPlaceholder(placeholder) {
        return this.get(`[placeholder="${placeholder}"]`);
    }
    getByLabel(label) {
        this.ensurePage();
        const chain = new fluent_chain_js_1.FluentChain(this.page, this.selfHealer, this.deepSearch, this.config.browser.timeout);
        // @ts-ignore
        chain['currentLocator'] = this.page.getByLabel(label);
        return chain;
    }
    // ============== QUICK ACTIONS (Direct, no chaining) ==============
    /**
     * Бърз клик
     */
    async click(selector) {
        await this.get(selector).click();
        return this;
    }
    /**
     * Бързо въвеждане
     */
    async type(selector, text) {
        await this.get(selector).type(text);
        return this;
    }
    /**
     * Изчакай елемент
     */
    async waitFor(selector, timeout) {
        this.ensurePage();
        await this.page.waitForSelector(selector, {
            timeout: timeout || this.config.browser.timeout
        });
        return this;
    }
    /**
     * Изчакай URL
     */
    async waitForUrl(url) {
        this.ensurePage();
        await this.page.waitForURL(url);
        return this;
    }
    /**
     * Изчакай навигация
     */
    async waitForNavigation() {
        this.ensurePage();
        await this.page.waitForLoadState('domcontentloaded');
        return this;
    }
    // ============== NETWORK (Cypress-style) ==============
    /**
     * Интерцептирай заявка
     */
    async intercept(config) {
        await this.networkInterceptor.intercept(config);
        return this;
    }
    /**
     * Stub API response
     */
    async stub(url, body, status = 200) {
        await this.networkInterceptor.stub(url, body, status);
        return this;
    }
    /**
     * Изчакай заявка
     */
    async waitForRequest(url) {
        await this.networkInterceptor.waitForRequest(url);
        return this;
    }
    // ============== SCREENSHOTS & TRACES ==============
    /**
     * Направи screenshot
     */
    async screenshot(name) {
        this.ensurePage();
        const path = `screenshots/${name || `screenshot-${Date.now()}`}.png`;
        await this.page.screenshot({ path, fullPage: true });
        return path;
    }
    /**
     * Вземи HTML на страницата
     */
    async getHtml() {
        this.ensurePage();
        return await this.page.content();
    }
    /**
     * Вземи заглавие
     */
    async getTitle() {
        this.ensurePage();
        return await this.page.title();
    }
    /**
     * Вземи URL
     */
    getUrl() {
        this.ensurePage();
        return this.page.url();
    }
    // ============== UTILITIES ==============
    /**
     * Изпълни JavaScript
     */
    async evaluate(fn) {
        this.ensurePage();
        return await this.page.evaluate(fn);
    }
    /**
     * Пауза (за дебъгване)
     */
    async pause(ms) {
        await new Promise(resolve => setTimeout(resolve, ms));
        return this;
    }
    /**
     * Директен достъп до Page
     */
    getPage() {
        this.ensurePage();
        return this.page;
    }
    /**
     * Директен достъп до Context
     */
    getContext() {
        if (!this.context)
            throw new Error('Browser not launched');
        return this.context;
    }
    /**
     * Осигури че има страница
     */
    ensurePage() {
        if (!this.page) {
            throw new Error('Browser not launched. Call mm.launch() first.');
        }
    }
}
exports.QAntum = QAntum;
// ============== FACTORY FUNCTION ==============
/**
 * Създай нова инстанция на QANTUM
 */
function createQA(config) {
    return new QAntum(config);
}
// Default export
exports.default = QAntum;
//# sourceMappingURL=mister-mind.js.map