/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🧠 QANTUM HYBRID v1.0.0 - BasePage
 * Enterprise POM (Page Object Model) base class
 * Ported from: training-framework/architecture/pom-base.js
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
import type { Page, BrowserContext, Response } from 'playwright';
import { BaseElement, LocatorStrategy, ElementOptions } from './BaseElement';
import { BaseComponent } from './BaseComponent';
export interface PageOptions {
    baseUrl?: string;
    timeout?: number;
    waitForLoad?: boolean;
    loadStrategy?: 'load' | 'domcontentloaded' | 'networkidle';
}
export interface PageMetadata {
    name: string;
    url: string;
    description?: string;
    version?: string;
}
export interface ActionOptions {
    timeout?: number;
    retries?: number;
}
export type ActionFunction = (page: BasePage, params?: Record<string, unknown>) => Promise<void>;
export interface PageAction {
    name: string;
    description?: string;
    fn: ActionFunction;
}
export declare class BasePage extends EventEmitter {
    page?: Page;
    context?: BrowserContext;
    elements: Map<string, BaseElement>;
    components: Map<string, BaseComponent>;
    actions: Map<string, PageAction>;
    metadata: PageMetadata;
    options: Required<PageOptions>;
    protected initialized: boolean;
    constructor(metadata?: Partial<PageMetadata>, options?: PageOptions);
    /**
     * Set Playwright page instance
     */
    setPage(page: Page): this;
    /**
     * Navigate to page URL
     */
    navigate(path?: string): Promise<Response | null>;
    /**
     * Wait for page to load
     */
    waitForLoad(): Promise<void>;
    /**
     * Define an element on the page
     */
    element(name: string, locator: string | LocatorStrategy, options?: ElementOptions): BaseElement;
    /**
     * Get element by name (shorthand)
     */
    $(name: string): BaseElement;
    /**
     * Get element by name (alias)
     */
    getElement(name: string): BaseElement;
    /**
     * Check if element exists in definition
     */
    hasElement(name: string): boolean;
    /**
     * Get all element names
     */
    getElementNames(): string[];
    /**
     * Define a component on the page
     */
    component<T extends BaseComponent>(name: string, ComponentClass: new (root: LocatorStrategy, options?: ElementOptions) => T, rootLocator: string | LocatorStrategy, options?: ElementOptions): T;
    /**
     * Get component by name
     */
    getComponent<T extends BaseComponent>(name: string): T;
    /**
     * Define a page action
     */
    action(name: string, fn: ActionFunction, description?: string): this;
    /**
     * Execute a page action
     */
    execute(name: string, params?: Record<string, unknown>): Promise<void>;
    /**
     * Get current URL
     */
    getUrl(): Promise<string>;
    /**
     * Get page title
     */
    getTitle(): Promise<string>;
    /**
     * Take screenshot
     */
    screenshot(options?: {
        path?: string;
        fullPage?: boolean;
        type?: 'png' | 'jpeg';
    }): Promise<Buffer>;
    /**
     * Execute script in page context
     */
    evaluate<T>(script: string | ((arg?: unknown) => T), arg?: unknown): Promise<T>;
    /**
     * Wait for network idle
     */
    waitForNetworkIdle(timeout?: number): Promise<void>;
    /**
     * Wait for selector
     */
    waitForSelector(selector: string, options?: {
        state?: 'attached' | 'detached' | 'visible' | 'hidden';
        timeout?: number;
    }): Promise<void>;
    /**
     * Wait for navigation
     */
    waitForNavigation(options?: {
        url?: string | RegExp;
        timeout?: number;
    }): Promise<void>;
    /**
     * Reload page
     */
    reload(): Promise<Response | null>;
    /**
     * Go back
     */
    goBack(): Promise<Response | null>;
    /**
     * Go forward
     */
    goForward(): Promise<Response | null>;
    /**
     * Get frame by name or URL
     */
    frame(nameOrUrl: string | RegExp): BasePage | null;
    /**
     * Handle dialogs
     */
    onDialog(handler: (dialog: {
        type: string;
        message: string;
        accept: (text?: string) => Promise<void>;
        dismiss: () => Promise<void>;
    }) => void): void;
    /**
     * Auto-accept dialogs
     */
    autoAcceptDialogs(): void;
    /**
     * Auto-dismiss dialogs
     */
    autoDismissDialogs(): void;
    /**
     * Get page state summary
     */
    getState(): {
        metadata: PageMetadata;
        initialized: boolean;
        elementCount: number;
        componentCount: number;
        actionCount: number;
        elements: string[];
        components: string[];
        actions: string[];
    };
    /**
     * Get underlying Playwright page
     */
    getPlaywrightPage(): Page;
}
export default BasePage;
//# sourceMappingURL=BasePage.d.ts.map