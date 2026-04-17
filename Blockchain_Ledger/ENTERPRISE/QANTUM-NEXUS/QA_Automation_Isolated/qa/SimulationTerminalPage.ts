/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SIMULATION TERMINAL PAGE (POM)
 * ═══════════════════════════════════════════════════════════════════════════════
 * Капсулира логиката на симулационния терминал. Изолира локатори и метрики
 * от драйвъра. Устойчив при промени в DOM чрез data-атрибути и стабилни селектори.
 *
 * Mister Mind Architect: използва Explicit Wait — без sleep().
 * @see SeleniumAdapter_1.ts (Playwright-backed WebDriver)
 */

import { By, until, type WebDriver, type WebElement } from '../legacy-adapter';

export interface ScrapedMetrics {
  model: 'VORTEX' | 'Standard AI';
  profit: number;
  hitRate: number;
  drawdown: number;
  trades?: number;
}

/** Timeout за изчакване на край на симулация (ms). */
const SIMULATION_COMPLETE_TIMEOUT = 60_000;

/**
 * Page Object за страницата с резултати от Vortex vs Standard AI симулация.
 * Очаква DOM с data-атрибути: data-model="VORTEX" | "Standard AI",
 * data-metric="profit" | "hitRate" | "drawdown" (или таблица с предвидими текстове).
 */
export class SimulationTerminalPage {
  constructor(private driver: WebDriver) { }

  /** Локатори по data-атрибути (препоръчително за стабилност). */
  static readonly selectors = {
    runButton: By.id('run-simulation-btn'),
    statusBanner: By.css('[data-simulation-status]'),
    winnerBanner: By.xpath("//*[contains(text(), 'WINNER') or contains(text(), 'ПРЕГАЗВА')]"),
    simulationFinished: By.xpath("//*[contains(text(), 'Simulation Finished') or contains(text(), 'Край на симулацията')]"),
    vortexRow: By.css('[data-model="VORTEX"]'),
    aiRow: By.css('[data-model="Standard AI"]'),
    /** Fallback: редове в таблица по текст. */
    vortexRowFallback: By.xpath("//*[contains(., 'VORTEX') and (contains(., 'PnL') or contains(., 'Profit') or contains(., 'Hit') or contains(., 'Drawdown'))]"),
    aiRowFallback: By.xpath("//*[contains(., 'Standard AI') and (contains(., 'PnL') or contains(., 'Profit') or contains(., 'Hit') or contains(., 'Drawdown'))]"),
  } as const;

  /**
   * Explicit Wait за приключване на симулацията.
   * Не използва sleep() — чака до timeout за специфичен елемент/текст.
   */
  async waitForSimulationComplete(timeoutMs: number = SIMULATION_COMPLETE_TIMEOUT): Promise<void> {
    await this.driver.wait(
      until.elementLocated(SimulationTerminalPage.selectors.simulationFinished),
      timeoutMs,
      'Simulation did not finish within timeout (expected "Simulation Finished" or "Край на симулацията")'
    );
  }

  /**
   * Алтернативно: чака по статус банер (data-simulation-status="finished").
   */
  async waitForStatusFinished(timeoutMs: number = SIMULATION_COMPLETE_TIMEOUT): Promise<void> {
    const condition = async (driver: WebDriver): Promise<boolean> => {
      const el = await driver.findElement(SimulationTerminalPage.selectors.statusBanner).catch(() => null);
      if (!el) return false;
      const status = await el.getAttribute('data-simulation-status');
      return status === 'finished';
    };
    await this.driver.wait(condition, timeoutMs, 'Status banner did not become "finished"');
  }

  /**
   * Извлича метрики за даден модел от DOM.
   * Поддържа: data-metric атрибути или regex върху текста на реда.
   */
  async getMetrics(modelName: 'VORTEX' | 'Standard AI'): Promise<ScrapedMetrics> {
    const rowBy = modelName === 'VORTEX'
      ? SimulationTerminalPage.selectors.vortexRow
      : SimulationTerminalPage.selectors.aiRow;

    let row: WebElement;
    try {
      row = await this.driver.findElement(rowBy);
    } catch {
      const fallback = modelName === 'VORTEX'
        ? SimulationTerminalPage.selectors.vortexRowFallback
        : SimulationTerminalPage.selectors.aiRowFallback;
      row = await this.driver.findElement(fallback);
    }

    const rowText = await row.getText();

    const profitMatch = rowText.match(/\$?([\d.-]+)\s*(?:USD)?/);
    const hitRateMatch = rowText.match(/Hit\s*rate[:\s]*([\d.]+)\s*%?/i) || rowText.match(/Hit\s*Rate[:\s]*([\d.]+)/i);
    const drawdownMatch = rowText.match(/[Dd]rawdown[:\s]*([\d.]+)\s*%?/i) || rowText.match(/[Mm]ax\s*drawdown[:\s]*([\d.]+)/i);
    const tradesMatch = rowText.match(/Сделки[:\s]*(\d+)/i) || rowText.match(/[Tt]rades[:\s]*(\d+)/i);

    return {
      model: modelName,
      profit: profitMatch ? parseFloat(profitMatch[1].replace(/\s/g, '')) : 0,
      hitRate: hitRateMatch ? parseFloat(hitRateMatch[1]) : 0,
      drawdown: drawdownMatch ? parseFloat(drawdownMatch[1]) : 0,
      trades: tradesMatch ? parseInt(tradesMatch[1], 10) : undefined,
    };
  }

  /** Клик по бутон "Run" (ако страницата го има). */
  async clickRunSimulation(): Promise<void> {
    const btn = await this.driver.findElement(SimulationTerminalPage.selectors.runButton);
    await btn.click();
  }

  /**
   * Shadow DOM: проникване в Shadow Root за скрити метрики (модерни SaaS / Web Components).
   * Използва executeScript в браузъра — единственият надежден начин за достъп до shadowRoot.
   */
  async getShadowMetric(hostSelector: string, innerSelector: string): Promise<string | null> {
    const result = await this.driver.executeScript<string | null>(
      [
        'var o = arguments[0];',
        'var host = document.querySelector(o.hostSelector);',
        'if (host && host.shadowRoot) {',
        '  var el = host.shadowRoot.querySelector(o.innerSelector);',
        '  return el ? el.innerText : null;',
        '}',
        'return null;',
      ].join(' '),
      { hostSelector, innerSelector }
    );
    return result ?? null;
  }

  /**
   * Извлича метрика за VORTEX от Shadow DOM (напр. host="#vortex-dashboard", inner="[data-metric=profit]").
   */
  async getVortexMetricFromShadow(hostSelector: string, metricAttr: string): Promise<string | null> {
    return this.getShadowMetric(hostSelector, `[data-metric="${metricAttr}"]`);
  }
}
