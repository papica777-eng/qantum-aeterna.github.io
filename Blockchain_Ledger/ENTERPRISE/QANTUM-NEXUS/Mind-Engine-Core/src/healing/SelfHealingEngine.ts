    totalHealings: number;
    successRate: number;
    topStrategies: Array<{ strategy: string; count: number }>;
    recentHealings: HealingRecord[];
    learnedMappings: number;
    failedSelectors: number;
  } {
    const strategyCount = new Map<string, number>();
    
    for (const record of this.healingHistory) {
      const count = strategyCount.get(record.strategyUsed) || 0;
      strategyCount.set(record.strategyUsed, count + 1);
    }

    const topStrategies = Array.from(strategyCount.entries())
      .map(([strategy, count]) => ({ strategy, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalHealings: this.healingHistory.length,
      successRate: this.healingHistory.length > 0 ? 100 : 0, // Only successful healings are recorded
      topStrategies,
      recentHealings: this.healingHistory.slice(-10),
      learnedMappings: this.learnedMappings.size,
      failedSelectors: this.failedSelectors.size,
    };
  }

  /**
   * Get healing history
   */
  getHistory(): HealingRecord[] {
    return [...this.healingHistory];
  }

  /**
   * Export learned mappings
   */
  exportMappings(): Record<string, string> {
    return Object.fromEntries(this.learnedMappings);
  }

  /**
   * Import learned mappings
   */
  importMappings(mappings: Record<string, string>): this {
    for (const [key, value] of Object.entries(mappings)) {
      this.learnedMappings.set(key, value);
    }
    return this;
  }

  /**
   * Clear all data
   */
  clear(): this {
    this.healingHistory = [];
    this.learnedMappings.clear();
    this.failedSelectors.clear();
    return this;
  }
}

export default SelfHealingEngine;
