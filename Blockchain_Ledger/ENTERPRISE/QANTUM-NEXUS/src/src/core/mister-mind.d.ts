/**
 * 🧠 QANTUM HYBRID - Main Class
 * Унифициран API: mm.visit().click().type().should()
 */
import { BrowserContext, Page } from 'playwright';
import { MMConfig, InterceptConfig } from '../types/index.js';
import { FluentChain } from './fluent-chain.js';
export declare class QAntum {
    private config;
    private browser?;
    private context?;
    private page?;
    private selfHealer;
    private deepSearch;
    private networkInterceptor;
    constructor(config?: Partial<MMConfig>);
    /**
     * Стартирай браузър
     */
    launch(): Promise<QAntum>;
    /**
     * Затвори браузър
     */
    close(): Promise<void>;
    /**
     * Вземи правилния браузър тип
     */
    private getBrowserType;
    /**
     * Отиди на URL
     */
    visit(url: string): Promise<QAntum>;
    /**
     * Презареди страницата
     */
    reload(): Promise<QAntum>;
    /**
     * Назад
     */
    goBack(): Promise<QAntum>;
    /**
     * Напред
     */
    goForward(): Promise<QAntum>;
    /**
     * Избери елемент (връща FluentChain за chaining)
     */
    get(selector: string): FluentChain;
    /**
     * Намери елемент с Deep Search
     */
    find(selector: string): Promise<FluentChain>;
    /**
     * Селектори по различни стратегии
     */
    getByTestId(testId: string): FluentChain;
    getByText(text: string): FluentChain;
    getByRole(role: string, options?: {
        name?: string;
    }): FluentChain;
    getByPlaceholder(placeholder: string): FluentChain;
    getByLabel(label: string): FluentChain;
    /**
     * Бърз клик
     */
    click(selector: string): Promise<QAntum>;
    /**
     * Бързо въвеждане
     */
    type(selector: string, text: string): Promise<QAntum>;
    /**
     * Изчакай елемент
     */
    waitFor(selector: string, timeout?: number): Promise<QAntum>;
    /**
     * Изчакай URL
     */
    waitForUrl(url: string | RegExp): Promise<QAntum>;
    /**
     * Изчакай навигация
     */
    waitForNavigation(): Promise<QAntum>;
    /**
     * Интерцептирай заявка
     */
    intercept(config: InterceptConfig): Promise<QAntum>;
    /**
     * Stub API response
     */
    stub(url: string | RegExp, body: unknown, status?: number): Promise<QAntum>;
    /**
     * Изчакай заявка
     */
    waitForRequest(url: string | RegExp): Promise<QAntum>;
    /**
     * Направи screenshot
     */
    screenshot(name?: string): Promise<string>;
    /**
     * Вземи HTML на страницата
     */
    getHtml(): Promise<string>;
    /**
     * Вземи заглавие
     */
    getTitle(): Promise<string>;
    /**
     * Вземи URL
     */
    getUrl(): string;
    /**
     * Изпълни JavaScript
     */
    evaluate<T>(fn: () => T): Promise<T>;
    /**
     * Пауза (за дебъгване)
     */
    pause(ms: number): Promise<QAntum>;
    /**
     * Директен достъп до Page
     */
    getPage(): Page;
    /**
     * Директен достъп до Context
     */
    getContext(): BrowserContext;
    /**
     * Осигури че има страница
     */
    private ensurePage;
}
/**
 * Създай нова инстанция на QANTUM
 */
export declare function createQA(config?: Partial<MMConfig>): QAntum;
export default QAntum;
//# sourceMappingURL=mister-mind.d.ts.map