/**
 * 🧠 QANTUM HYBRID v1.0.0 - DeepSearch Engine
 * Shadow DOM penetration + iFrame traversal + Overlay dismissal
 * Synthesis of GAMMA_INFRA and Sovereign standards.
 */

import type { Page, Locator, Frame, ElementHandle } from 'playwright';
import { EventEmitter } from 'events';

export interface DeepSearchConfig {
  shadowDOM: {
    enabled: boolean;
    maxDepth: number;
  };
  iframes: {
    enabled: boolean;
    autoSwitch: boolean;
    maxDepth: number;
  };
  overlays: {
    autoDismiss: boolean;
    selectors: string[];
    closeSelectors: string[];
  };
  timeout: number;
  retryInterval: number;
}

export interface DeepSearchResult {
  found: boolean;
  locator?: Locator;
  context: 'main' | 'shadow' | 'iframe';
  depth: number;
  timeMs: number;
}

export class DeepSearchEngine extends EventEmitter {
  private static instance: DeepSearchEngine;
  private page: Page;
  private config: DeepSearchConfig;

  private constructor(page: Page, config?: Partial<DeepSearchConfig>) {
    super();
    this.page = page;
    this.config = {
      shadowDOM: {
        enabled: config?.shadowDOM?.enabled ?? true,
        maxDepth: config?.shadowDOM?.maxDepth ?? 5,
      },
      iframes: {
        enabled: config?.iframes?.enabled ?? true,
        autoSwitch: config?.iframes?.autoSwitch ?? true,
        maxDepth: config?.iframes?.maxDepth ?? 3,
      },
      overlays: {
        autoDismiss: config?.overlays?.autoDismiss ?? true,
        selectors: config?.overlays?.selectors ?? [
          '[class*="cookie"]', '[class*="consent"]', '[role="dialog"]',
        ],
        closeSelectors: config?.overlays?.closeSelectors ?? [
          '[class*="close"]', '#accept', '.accept-all',
        ],
      },
      timeout: config?.timeout ?? 10000,
      retryInterval: config?.retryInterval ?? 500,
    };
  }

  public static getInstance(page: Page, config?: Partial<DeepSearchConfig>): DeepSearchEngine {
    if (!page) {
      throw new Error("[DeepSearchEngine] ❌ Cannot get instance without a valid Page context.");
    }
    if (!this.instances.has(page)) {
      console.log(`[DeepSearchEngine] 🧬 New Context Initialized via WeakMap.`);
      this.instances.set(page, new DeepSearchEngine(page, config));
    }
    return this.instances.get(page)!;
  }

  /**
   * Auto-dismiss overlays (cookies, modals, popups)
   */
  public async dismissOverlays(): Promise<void> {
    if (!this.config.overlays.autoDismiss) return;

    await this.page.evaluate(({ overlays, closes }) => {
      for (const overlaySel of overlays) {
        document.querySelectorAll(overlaySel).forEach((overlay) => {
          const el = overlay as HTMLElement;
          if (el.offsetParent === null) return;
          
          for (const closeSel of closes) {
            const closeBtn = el.querySelector(closeSel) as HTMLElement;
            if (closeBtn) {
              closeBtn.click();
              return;
            }
          }
          el.style.display = 'none';
        });
      }
    }, { overlays: this.config.overlays.selectors, closes: this.config.overlays.closeSelectors });
  }

  /**
   * Deep find - searches main DOM, Shadow DOM, and iframes
   */
  public async deepFind(selector: string): Promise<DeepSearchResult> {
    const startTime = Date.now();
    
    const searchPromise = (async (): Promise<DeepSearchResult> => {
      // 1. Try main DOM with Shadow piercing (Playwright default)
      try {
        const locator = this.page.locator(selector);
        if (await locator.count() > 0 && await locator.first().isVisible()) {
          return { found: true, locator: locator.first(), context: 'main', depth: 0, timeMs: Date.now() - startTime };
        }
      } catch {}

      // 2. Try Manual Shadow DOM Traversal if not found
      if (this.config.shadowDOM.enabled) {
        const shadowFound = await this.page.evaluate(({ sel, maxD }) => {
          function deepQuery(cssSelector: string, root: any = document, depth = 0): boolean {
            if (depth > maxD) return false;
            try {
              if (root.querySelector(cssSelector)) return true;
              const all = root.querySelectorAll('*');
              for (let i = 0; i < all.length; i++) {
                const el = all[i];
                if (el.shadowRoot && deepQuery(cssSelector, el.shadowRoot, depth + 1)) return true;
              }
            } catch (e) { return false; }
            return false;
          }
          return deepQuery(sel);
        }, { sel: selector, maxD: this.config.shadowDOM.maxDepth });

        if (shadowFound) {
          const locator = this.page.locator(`css=${selector}`);
          return { found: true, locator: locator.first(), context: 'shadow', depth: 1, timeMs: Date.now() - startTime };
        }
      }

      // 3. Try Iframes
      if (this.config.iframes.enabled) {
        const frames = this.page.frames();
        for (const frame of frames) {
          if (frame === this.page.mainFrame()) continue;
          try {
            const locator = frame.locator(selector);
            if (await locator.count() > 0) {
              return { found: true, locator: locator.first(), context: 'iframe', depth: 1, timeMs: Date.now() - startTime };
            }
          } catch {}
        }
      }

      return { found: false, context: 'main', depth: 0, timeMs: Date.now() - startTime };
    })();

    const timeoutPromise = new Promise<DeepSearchResult>((resolve) => 
      setTimeout(() => resolve({ found: false, context: 'main', depth: 0, timeMs: this.config.timeout }), this.config.timeout)
    );

    return Promise.race([searchPromise, timeoutPromise]);
  }
}

