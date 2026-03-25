import { Page, Locator } from 'playwright';
import { IHealingStrategy } from './IHealingStrategy';
import { TestIdStrategy } from './TestIdStrategy';
import { TextContentStrategy } from './TextContentStrategy';
import { LayoutStrategy } from './LayoutStrategy';

/**
 * 🏥 HealingEngine - The Sovereign Immune System
 * Synthesizes O(1) and Semantic strategies for Zero Entropy execution.
 */
export class HealingEngine {
  private static instances = new WeakMap<Page, HealingEngine>();
  private strategies: IHealingStrategy[] = [];

  private constructor() {
    this.strategies = [
      new TestIdStrategy(),
      new TextContentStrategy(),
      new LayoutStrategy()
    ];
  }

  public static getInstance(page: Page): HealingEngine {
    if (!this.instances.has(page)) {
      this.instances.set(page, new HealingEngine());
    }
    return this.instances.get(page)!;
  }

  /**
   * Complexity: O(N) where N is number of strategies
   */
  public async attemptHealing(page: Page, selector: string, context?: any): Promise<Locator | null> {
    console.log(`[HealingEngine] 🚑 Critical Failure on: ${selector}. Initiating recovery...`);
    
    for (const strategy of this.strategies) {
      try {
        const locator = await strategy.heal(page, selector, context);
        if (locator && await locator.count() > 0 && await locator.first().isVisible()) {
          console.log(`[HealingEngine] ✅ Recovery successful via ${strategy.name}`);
          return locator.first();
        }
      } catch (e: any) {
        console.warn(`[HealingEngine] ⚠️ Strategy ${strategy.name} failed: ${e.message}`);
      }
    }

    console.error(`[HealingEngine] 💀 All healing strategies exhausted for: ${selector}`);
    return null;
  }
}
