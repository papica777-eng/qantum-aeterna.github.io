import { Page, Request, Route } from 'playwright';

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                               ║
 * ║   QANTUM NETWORK INTERCEPTOR (v26.0-STEEL)                                    ║
 * ║   "Absolute control over the application's bloodstream"                      ║
 * ║                                                                               ║
 * ║   - Phase 4: Network Interception (Steps 66-80)                               ║
 * ║   - Latency Stress Testing & Response Stubbing                                ║
 * ║                                                                               ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

export interface MockResponse {
    status?: number;
    contentType?: string;
    headers?: Record<string, string>;
    body?: string | Buffer | any;
    delay?: number;
}

export interface InterceptRule {
    url: string | RegExp;
    method?: string;
    handler?: (route: Route, request: Request) => Promise<void>;
    mock?: MockResponse;
}

export class NetworkInterceptor {
    private page: Page | null = null;
    private rules: Map<string, InterceptRule> = new Map();
    private active: boolean = false;
    private recordings: any[] = [];

    /**
     * Complexity: O(1)
     * Attach the interceptor to a Playwright page.
     */
    public async attach(page: Page): Promise<void> {
        this.page = page;
        this.active = true;
        // Re-apply existing rules if any
        for (const [id, rule] of this.rules.entries()) {
            await this.applyRule(id, rule);
        }
        console.log('STATUS: NETWORK_INTERCEPTOR_ATTACHED');
    }

    /**
     * Complexity: O(1)
     * Detach and clear all routes.
     */
    public async detach(): Promise<void> {
        if (this.page) {
            await this.page.unroute('**/*');
        }
        this.page = null;
        this.active = false;
        console.log('STATUS: NETWORK_INTERCEPTOR_DETACHED');
    }

    /**
     * Complexity: O(1)
     * Add a rule and apply it if a page is attached.
     */
    public async addRule(id: string, rule: InterceptRule): Promise<void> {
        this.rules.set(id, rule);
        if (this.active && this.page) {
            await this.applyRule(id, rule);
        }
    }

    /**
     * Complexity: O(1)
     * Preset for Latency Stress Testing.
     */
    public async injectLatency(pattern: string | RegExp, ms: number = 2000): Promise<void> {
        await this.addRule(`latency_${ms}`, {
            url: pattern,
            handler: async (route) => {
                await new Promise(resolve => setTimeout(resolve, ms));
                await route.continue();
            }
        });
    }

    /**
     * Complexity: O(1)
     * Preset for Stripe Simulation (Success).
     */
    public async mockStripeSuccess(): Promise<void> {
        await this.addRule('stripe_pi_success', {
            url: /.*api\.stripe\.com\/v1\/payment_intents.*/,
            mock: {
                status: 200,
                body: {
                    id: 'pi_qantum_mock_success',
                    object: 'payment_intent',
                    amount: 2000,
                    currency: 'usd',
                    status: 'succeeded'
                }
            }
        });
    }

    private async applyRule(id: string, rule: InterceptRule): Promise<void> {
        if (!this.page) return;

        await this.page.route(rule.url, async (route: Route, request: Request) => {
            // 🛡️ QAntum Binary Shield: Force ignore bloatware
            const url = request.url();
            const isBloat = /\.(png|jpg|jpeg|gif|webp|woff|woff2|ttf|otf|mp4|webm|pdf|svg)$/i.test(url);
            
            if (isBloat) {
                return route.continue();
            }

            // Filter by method if specified
            if (rule.method && request.method() !== rule.method) {
                return route.continue();
            }

            // High-priority custom handler
            if (rule.handler) {
                return await rule.handler(route, request);
            }

            // Standard mock response
            if (rule.mock) {
                if (rule.mock.delay) {
                    await new Promise(resolve => setTimeout(resolve, rule.mock.delay!));
                }

                // 🛡️ QAntum Memory Shield: Return fulfillment and DO NOT record bloat
                return await route.fulfill({
                    status: rule.mock.status || 200,
                    contentType: rule.mock.contentType || 'application/json',
                    headers: rule.mock.headers,
                    body: typeof rule.mock.body === 'object' 
                        ? JSON.stringify(rule.mock.body) 
                        : (rule.mock.body || '')
                });
            }

            return await route.continue();
        });
    }

    /**
     * Complexity: O(1)
     * Clear specific rule.
     */
    public async clearRule(id: string): Promise<void> {
        this.rules.delete(id);
        // Note: Playwright does not support unrouting specific patterns easily without re-routing everything.
        // We might need to unroute(**/*) and re-apply remaining rules.
        if (this.page) {
            await this.page.unroute('**/*');
            for (const [rid, rule] of this.rules.entries()) {
                await this.applyRule(rid, rule);
            }
        }
    }
}
