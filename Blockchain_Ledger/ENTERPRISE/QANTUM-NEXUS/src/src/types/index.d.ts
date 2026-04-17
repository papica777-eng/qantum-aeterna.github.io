/**
 * 🧠 QANTUM HYBRID - Core Types
 * Всички типове на едно място
 */
export type BrowserType = 'chromium' | 'firefox' | 'webkit';
export type ExecutionMode = 'local' | 'grid' | 'browserstack';
export interface BrowserConfig {
    browser: BrowserType;
    headless: boolean;
    slowMo?: number;
    viewport?: {
        width: number;
        height: number;
    };
    timeout?: number;
}
export interface MMConfig {
    baseUrl: string;
    browser: BrowserConfig;
    mode: ExecutionMode;
    retries: number;
    selfHealing: boolean;
    parallel: {
        enabled: boolean;
        workers: number;
    };
    reporting: {
        screenshots: boolean;
        traces: boolean;
        har: boolean;
    };
    grid?: {
        url: string;
        capabilities?: Record<string, unknown>;
    };
}
export interface MMElement {
    selector: string;
    shadowRoot?: boolean;
    iframe?: string;
    index?: number;
}
export interface LocatorStrategy {
    css?: string;
    xpath?: string;
    text?: string;
    testId?: string;
    role?: string;
}
export interface TestResult {
    name: string;
    status: 'passed' | 'failed' | 'skipped';
    duration: number;
    error?: string;
    screenshot?: string;
    trace?: string;
}
export interface InterceptConfig {
    url: string | RegExp;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | '*';
    response?: {
        status?: number;
        body?: unknown;
        headers?: Record<string, string>;
    };
}
export declare const DEFAULT_CONFIG: MMConfig;
//# sourceMappingURL=index.d.ts.map