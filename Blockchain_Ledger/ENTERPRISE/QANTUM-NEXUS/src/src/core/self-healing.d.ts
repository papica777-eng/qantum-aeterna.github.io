/**
 * 🧠 QANTUM HYBRID - Self-Healing Engine
 * Автоматично възстановяване на счупени селектори
 */
import type { Page } from 'playwright';
export interface HealingResult {
    healed: boolean;
    originalSelector: string;
    newSelector?: string;
    confidence: number;
    method: 'exact' | 'text' | 'testId' | 'role' | 'xpath' | 'fuzzy';
}
export declare class SelfHealingEngine {
    private healingHistory;
    /**
     * Опитва да намери елемент с различни стратегии
     */
    heal(page: Page, selector: string): Promise<HealingResult>;
    /**
     * Търси по data-testid
     */
    private healByTestId;
    /**
     * Търси по текст
     */
    private healByText;
    /**
     * Търси по ARIA role
     */
    private healByRole;
    /**
     * Частично съвпадение (fuzzy)
     */
    private healByPartialMatch;
    /**
     * Проверява дали елементът е видим
     */
    private isVisible;
    /**
     * Изчисти историята
     */
    clearHistory(): void;
    /**
     * Вземи статистика
     */
    getStats(): {
        total: number;
        healed: number;
    };
}
export declare const selfHealer: SelfHealingEngine;
//# sourceMappingURL=self-healing.d.ts.map