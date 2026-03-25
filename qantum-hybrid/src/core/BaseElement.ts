import { Page, Locator } from 'playwright';
import { HealingEngine } from './healing/HealingEngine';
import { DeepSearchEngine } from './DeepSearchEngine';
import { QuantumDecisionEngine } from './QuantumDecisionEngine';

export interface ElementFallbackData {
    text?: string;
    near?: string;
}

/**
 * 🛡️ BaseElement - The indestructible atom of QAntum-Hybrid.
 * Handles: Intelligent Backoff, Autonomous Healing, and Deep Search.
 */
export class BaseElement {
    protected page: Page;
    private primarySelector: string;
    private fallbackData?: ElementFallbackData;
    protected healingEngine: HealingEngine;
    protected deepSearchEngine: DeepSearchEngine;
    protected brain: QuantumDecisionEngine;
    protected maxRetries = 3;
    protected useDeepSearch = false;

    constructor(page: Page, selector: string, fallbackData?: ElementFallbackData) {
        this.page = page;
        this.primarySelector = selector;
        this.fallbackData = fallbackData;
        this.healingEngine = HealingEngine.getInstance(page);
        this.deepSearchEngine = DeepSearchEngine.getInstance(page);
        this.brain = new QuantumDecisionEngine(page);
    }

    /**
     * Enable/Disable Deep Search (Shadow DOM / Iframes) for this element.
     */
    public withDeepSearch(enabled = true): this {
        this.useDeepSearch = enabled;
        return this;
    }

    protected async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Acuire the Playwright locator with absolute resilience.
     */
    public async getLocator(): Promise<Locator> {
        let currentDelay = 500;

        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                // 1. Primary Attempt (Playwright default)
                const locator = this.page.locator(this.primarySelector);
                if (await locator.count() > 0 && await locator.first().isVisible()) {
                    return locator.first();
                }
                
                // 2. Deep Search Attempt (if enabled or if primary fails repeatedly)
                if (this.useDeepSearch || attempt > 1) {
                    const deepResult = await this.deepSearchEngine.deepFind(this.primarySelector);
                    if (deepResult.found && deepResult.locator) {
                        return deepResult.locator;
                    }
                }

                throw new Error('Element not found in primary context');
            } catch (error) {
                if (attempt === this.maxRetries) {
                    // 3. Final Resort: Healing Engine
                    return await this.healingEngine.attemptHealing(this.page, this.primarySelector, this.fallbackData);
                }
                
                console.warn(`⏳ [BaseElement] Stability drift for ${this.primarySelector}. Attempt ${attempt}/${this.maxRetries}...`);
                await this.delay(currentDelay);
                currentDelay *= 2; 
            }
        }
        
        throw new Error(`[CRITICAL] Failed to acquire stable locator for: ${this.primarySelector}`);
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       INTERACTIONS
       ═══════════════════════════════════════════════════════════════════════════ */

    public async click(): Promise<void> {
        const locator = await this.getLocator();
        await locator.scrollIntoViewIfNeeded();
        await locator.click();
    }

    public async type(text: string): Promise<void> {
        const locator = await this.getLocator();
        await locator.fill(text);
    }

    public async getText(): Promise<string> {
        const locator = await this.getLocator();
        return (await locator.textContent()) || '';
    }

    public async isVisible(): Promise<boolean> {
        try {
            const locator = await this.getLocator();
            return await locator.isVisible();
        } catch {
            return false;
        }
    }
}
