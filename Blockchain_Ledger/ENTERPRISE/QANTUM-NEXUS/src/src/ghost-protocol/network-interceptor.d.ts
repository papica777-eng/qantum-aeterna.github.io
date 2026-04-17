/**
 * 👻 GHOST PROTOCOL - Network Interceptor
 *
 * The "Nuclear Option" for test optimization.
 * Records all network traffic during UI tests and converts them to pure API tests.
 *
 * Features:
 * - Intercepts POST/PUT/PATCH/DELETE requests
 * - Extracts Bearer tokens automatically
 * - Generates standalone API tests (no browser needed)
 * - 10x-100x faster execution
 *
 * @version 1.0.0
 * @phase 61-65
 */
import { Page } from 'playwright';
interface GhostConfig {
    outputDir: string;
    captureGetRequests: boolean;
    extractTokens: boolean;
    minifyOutput: boolean;
    includeResponseValidation: boolean;
    excludePatterns: string[];
}
export declare class NetworkInterceptor {
    private session;
    private config;
    private requestCounter;
    constructor(config?: Partial<GhostConfig>);
    /**
     * Start capturing network traffic for a test
     */
    startCapture(page: Page, testName: string): Promise<void>;
    /**
     * Handle intercepted request
     */
    private handleRequest;
    /**
     * Handle response and attach to captured request
     */
    private handleResponse;
    /**
     * Capture request details
     */
    private captureRequest;
    /**
     * Extract authentication token from headers
     */
    private extractAuthToken;
    /**
     * Extract dynamic values from responses (IDs, etc.)
     */
    private extractDynamicValues;
    /**
     * Stop capture and generate API test file
     */
    stopCapture(): Promise<string>;
    /**
     * Get current capture statistics
     */
    getStats(): {
        requests: number;
        hasAuth: boolean;
        baseUrl: string;
    } | null;
    private shouldExclude;
    private isApiRequest;
    private cleanHeaders;
    private safeGetResponseBody;
}
export declare function createGhostInterceptor(config?: Partial<GhostConfig>): NetworkInterceptor;
/**
 * Higher-order function to wrap UI tests with Ghost Protocol
 *
 * Usage:
 * ```
 * test('login flow', withGhost('login', async ({ page }) => {
 *     await page.goto('/login');
 *     await page.fill('#email', 'user@test.com');
 *     await page.click('#submit');
 * }));
 * ```
 */
export declare function withGhost(testName: string, testFn: (context: {
    page: Page;
    ghost: NetworkInterceptor;
}) => Promise<void>, config?: Partial<GhostConfig>): (context: {
    page: Page;
}) => Promise<void>;
export declare function runGhostCapture(uiTestPath: string): Promise<void>;
export {};
//# sourceMappingURL=network-interceptor.d.ts.map