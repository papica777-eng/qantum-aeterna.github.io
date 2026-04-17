/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: CORE ENGINE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * The heart of Mind-Engine - combining Playwright power with Data-Driven automation
 * Anti-detection, context isolation, fingerprint randomization
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
import { Browser, BrowserContext, Page, LaunchOptions, BrowserContextOptions } from 'playwright';
import { DataProvider, DataProviderConfig } from './DataProviders';
import { DatabaseHandler, Account, Proxy, Card } from './DatabaseHandler';
export type BrowserName = 'chromium' | 'firefox' | 'webkit';
export interface FingerprintConfig {
    userAgent?: string;
    viewport?: {
        width: number;
        height: number;
    };
    locale?: string;
    timezone?: string;
    geolocation?: {
        latitude: number;
        longitude: number;
    };
    permissions?: string[];
    colorScheme?: 'light' | 'dark' | 'no-preference';
    reducedMotion?: 'reduce' | 'no-preference';
    forcedColors?: 'active' | 'none';
    deviceScaleFactor?: number;
    isMobile?: boolean;
    hasTouch?: boolean;
    javaScriptEnabled?: boolean;
    extraHTTPHeaders?: Record<string, string>;
}
export interface AntiDetectionConfig {
    randomizeFingerprint?: boolean;
    spoofWebGL?: boolean;
    spoofCanvas?: boolean;
    spoofAudioContext?: boolean;
    maskAutomation?: boolean;
    humanizeActions?: boolean;
    humanDelayMs?: {
        min: number;
        max: number;
    };
}
export interface MindEngineConfig {
    browser?: BrowserName;
    headless?: boolean;
    slowMo?: number;
    devtools?: boolean;
    database?: DatabaseHandler;
    dataProvider?: DataProviderConfig;
    antiDetection?: AntiDetectionConfig;
    fingerprint?: FingerprintConfig;
    proxy?: {
        server: string;
        username?: string;
        password?: string;
    };
    recordVideo?: boolean;
    videoDir?: string;
    recordHar?: boolean;
    harPath?: string;
    screenshotOnError?: boolean;
    screenshotDir?: string;
    defaultTimeout?: number;
    navigationTimeout?: number;
    contextOptions?: BrowserContextOptions;
    launchOptions?: LaunchOptions;
}
export interface SessionState {
    cookies: any[];
    localStorage: Record<string, string>;
    sessionStorage: Record<string, string>;
    origins: string[];
}
export declare class FingerprintGenerator {
    private static USER_AGENTS;
    private static VIEWPORTS;
    private static TIMEZONES;
    private static LOCALES;
    static generate(platform?: 'windows' | 'mac' | 'linux'): FingerprintConfig;
    static generateMobile(): FingerprintConfig;
    private static randomFrom;
}
export declare class MindEngine extends EventEmitter {
    private config;
    private browserType;
    private browser;
    private context;
    private page;
    private dataProvider;
    private currentAccount;
    private currentProxy;
    private currentCard;
    private fingerprint;
    private sessionId;
    constructor(config?: MindEngineConfig);
    private getBrowserType;
    /**
     * Initialize engine with data from database
     */
    initWithData(): Promise<{
        account: Account;
        proxy: Proxy | null;
        card: Card | null;
    }>;
    /**
     * Initialize browser with optional proxy
     */
    init(proxy?: {
        server: string;
        username?: string;
        password?: string;
    }): Promise<void>;
    /**
     * Create browser context with anti-detection
     */
    private createContext;
    /**
     * Apply anti-detection scripts to context
     */
    private applyAntiDetection;
    /**
     * Navigate to URL
     */
    goto(url: string, options?: {
        waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
    }): Promise<void>;
    /**
     * Click element with human-like behavior
     */
    click(selector: string): Promise<void>;
    /**
     * Type text with human-like delays
     */
    type(selector: string, text: string): Promise<void>;
    /**
     * Fill form field (faster than type)
     */
    fill(selector: string, value: string): Promise<void>;
    /**
     * Wait for element
     */
    waitFor(selector: string, options?: {
        timeout?: number;
        state?: 'visible' | 'hidden' | 'attached';
    }): Promise<void>;
    /**
     * Check if element exists
     */
    exists(selector: string): Promise<boolean>;
    /**
     * Get text content
     */
    getText(selector: string): Promise<string>;
    /**
     * Get attribute value
     */
    getAttribute(selector: string, name: string): Promise<string | null>;
    /**
     * Take screenshot
     */
    screenshot(name?: string): Promise<Buffer>;
    /**
     * Fill form with current account data
     */
    fillAccountData(mapping: {
        email?: string;
        password?: string;
        username?: string;
        phone?: string;
        [key: string]: string | undefined;
    }): Promise<void>;
    /**
     * Fill form with current card data
     */
    fillCardData(mapping: {
        number?: string;
        holder?: string;
        expiry?: string;
        expiryMonth?: string;
        expiryYear?: string;
        cvv?: string;
        address?: string;
        city?: string;
        zip?: string;
        country?: string;
    }): Promise<void>;
    /**
     * Get current account
     */
    getAccount(): Account | null;
    /**
     * Get current card
     */
    getCard(): Card | null;
    /**
     * Get current proxy
     */
    getProxy(): Proxy | null;
    /**
     * Save session state
     */
    saveSession(): Promise<SessionState>;
    /**
     * Restore session state
     */
    restoreSession(state: SessionState): Promise<void>;
    /**
     * Add human-like delay
     */
    private humanDelay;
    /**
     * Sleep for specified milliseconds
     */
    sleep(ms: number): Promise<void>;
    /**
     * Scroll page with human-like behavior
     */
    scroll(direction: 'up' | 'down' | 'top' | 'bottom', amount?: number): Promise<void>;
    /**
     * Random mouse movement
     */
    randomMouseMove(): Promise<void>;
    /**
     * Mark automation as successful
     */
    markSuccess(): Promise<void>;
    /**
     * Mark automation as failed
     */
    markFailed(error?: string): Promise<void>;
    /**
     * Close browser and cleanup
     */
    close(): Promise<void>;
    /**
     * Get raw Playwright page
     */
    getPage(): Page;
    /**
     * Get raw Playwright context
     */
    getContext(): BrowserContext;
    /**
     * Get raw Playwright browser
     */
    getBrowser(): Browser;
    /**
     * Get data provider
     */
    getData(): DataProvider;
    /**
     * Get session ID
     */
    getSessionId(): string;
}
export default MindEngine;
//# sourceMappingURL=MindEngine.d.ts.map