import { HybridGodModeWrapper } from "./HybridGodModeWrapper";

/**
 * @wrapper Hybrid_start_reaper
 * @description Auto-generated God-Mode Hybrid.
 * @origin "start-reaper.js"
 */
export class Hybrid_start_reaper extends HybridGodModeWrapper {
    async execute(): Promise<void> {
        try {
            console.log("/// [HYBRID_CORE] Executing Logics from Hybrid_start_reaper ///");
            
            // --- START LEGACY INJECTION ---
            /**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║  QAntum Prime v28.0 - MARKET REAPER RUNNER                                ║
 * ║  Start the Economic Sovereign                                              ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * Usage:
 *   node scripts/start-reaper.js [--mode simulation|paper|live] [--capital 10000]
 */

const { ArbitrageOrchestrator } = require('../src/reality/economy/ArbitrageOrchestrator');
const { ReaperDashboard } = require('../src/dashboard/ReaperDashboard');

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (name, defaultValue) => {
  const index = args.indexOf(`--${name}`);
  return index !== -1 && args[index + 1] ? args[index + 1] : defaultValue;
};

const config = {
  mode: getArg('mode', 'simulation'),
  capitalUSD: parseFloat(getArg('capital', '10000')),
  maxTradesPerHour: parseInt(getArg('maxTrades', '50')),
  minProfitThreshold: parseFloat(getArg('minProfit', '1.5')),
  maxRiskThreshold: parseFloat(getArg('maxRisk', '15')),
  dailyLossLimit: parseFloat(getArg('lossLimit', '500')),
  enableChronosPrediction: getArg('chronos', 'true') === 'true',
  enableAtomicExecution: getArg('atomic', 'true') === 'true',
  telemetryUrl: getArg('telemetry', 'ws://192.168.0.6:8888'),
};

console.log(`
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                       ║
║   ⚛️  QAntum-Market-Reaper v28.0 - ECONOMIC SOVEREIGN                                 ║
║                                                                                       ║
║   "Който контролира арбитража, контролира пазара."                                    ║
║                                                                                       ║
╠═══════════════════════════════════════════════════════════════════════════════════════╣
║   Configuration:                                                                      ║
║   • Mode:           ${config.mode.toUpperCase().padEnd(15)}                                               ║
║   • Capital:        $${config.capitalUSD.toLocaleString().padEnd(14)}                                               ║
║   • Min Profit:     ${config.minProfitThreshold}%                                                              ║
║   • Max Risk:       ${config.maxRiskThreshold}%                                                              ║
║   • Daily Limit:    $${config.dailyLossLimit}                                                             ║
║   • Chronos:        ${config.enableChronosPrediction ? 'ENABLED ' : 'DISABLED'}                                                       ║
║   • Atomic Exec:    ${config.enableAtomicExecution ? 'ENABLED ' : 'DISABLED'}                                                       ║
║   • Telemetry:      ${config.telemetryUrl.padEnd(25)}                                    ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝
`);

// Create orchestrator
const reaper = new ArbitrageOrchestrator(config);
const dashboard = new ReaperDashboard(config.telemetryUrl);

// Setup event handlers
reaper.on('trade-completed', (data) => {
  console.log(`\n💰 TRADE COMPLETED: +$${data.profit.toFixed(2)}`);
  dashboard.addTrade({
    id: data.swap.id,
    timestamp: Date.now(),
    symbol: data.swap.buyOrder.symbol,
    buyExchange: data.swap.buyOrder.exchange,
    sellExchange: data.swap.sellOrder.exchange,
    profit: data.profit,
    status: 'success',
  });
});

reaper.on('trade-simulated', (data) => {
  console.log(`\n📝 [SIMULATION] Trade: +$${data.profit.toFixed(2)} | ${data.opportunity.symbol}`);
  dashboard.addTrade({
    id: `SIM-${Date.now()}`,
    timestamp: Date.now(),
    symbol: data.opportunity.symbol,
    buyExchange: data.opportunity.buyExchange,
    sellExchange: data.opportunity.sellExchange,
    profit: data.profit,
    status: 'success',
  });
});

reaper.on('opportunity-blocked', (data) => {
  console.log(`\n🚫 BLOCKED: ${data.reason}`);
  dashboard.addTrade({
    id: `BLOCKED-${Date.now()}`,
    timestamp: Date.now(),
    symbol: data.opportunity.symbol,
    buyExchange: data.opportunity.buyExchange,
    sellExchange: data.opportunity.sellExchange,
    profit: 0,
    status: 'blocked',
    reason: data.reason,
  });
});

reaper.on('trade-failed', (swap) => {
  console.log(`\n❌ FAILED: ${swap.id}`);
  dashboard.addTrade({
    id: swap.id,
    timestamp: Date.now(),
    symbol: swap.buyOrder.symbol,
    buyExchange: swap.buyOrder.exchange,
    sellExchange: swap.sellOrder.exchange,
    profit: 0,
    status: 'failed',
  });
});

// Status update interval
const statusInterval = setInterval(() => {
  const status = reaper.getStatus();
  dashboard.updateMetrics({
    totalProfit: status.allTimeProfit,
    todayProfit: status.todayProfit,
    totalTrades: status.tradesExecuted,
    winRate: status.winRate,
    currentCapital: status.capital,
    uptime: status.uptime,
    latencyMs: status.atomicLatencyMs,
    chronosAccuracy: status.chronosAccuracy,
    activeOpportunities: status.activeOpportunities,
  });
  
  // Print mini status
  process.stdout.write(`\r⚡ Trades: ${status.tradesExecuted} | Win: ${status.winRate.toFixed(1)}% | Profit: $${status.allTimeProfit.toFixed(2)} | Capital: $${status.capital.toFixed(2)}    `);
}, 5000);

// Dashboard render interval
const dashboardInterval = setInterval(() => {
  // Clear console and render dashboard
  // console.clear();
  // console.log(dashboard.render());
}, 30000);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down Market Reaper...');
  clearInterval(statusInterval);
  clearInterval(dashboardInterval);
  reaper.stop();
  
  const finalStats = reaper.getDailyStats();
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║  📊 FINAL SESSION REPORT                                                              ║
╠═══════════════════════════════════════════════════════════════════════════════════════╣
║  Trades Executed:     ${finalStats.tradesExecuted.toString().padEnd(10)}                                                   ║
║  Successful:          ${finalStats.successfulTrades.toString().padEnd(10)}                                                   ║
║  Failed:              ${finalStats.failedTrades.toString().padEnd(10)}                                                   ║
║  Win Rate:            ${(finalStats.successfulTrades / Math.max(1, finalStats.tradesExecuted) * 100).toFixed(1)}%                                                             ║
║  Total Profit:        $${finalStats.totalProfit.toFixed(2).padEnd(10)}                                                  ║
║  Best Trade:          $${(finalStats.bestTrade?.profit || 0).toFixed(2).padEnd(10)}                                                  ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝
  `);
  
  process.exit(0);
});

// Start the reaper!
console.log('\n🚀 Starting Market Reaper in 3 seconds...\n');

setTimeout(async () => {
  try {
    await reaper.start();
    console.log('\n✅ Market Reaper is now ACTIVE\n');
    console.log('Press Ctrl+C to stop and view final report.\n');
  } catch (error) {
    console.error('❌ Failed to start Market Reaper:', error);
    process.exit(1);
  }
}, 3000);

            // --- END LEGACY INJECTION ---

            await this.recordAxiom({ 
                status: 'SUCCESS', 
                origin: 'Hybrid_start_reaper',
                timestamp: Date.now()
            });
        } catch (error) {
            console.error("/// [HYBRID_FAULT] Critical Error in Hybrid_start_reaper ///", error);
            await this.recordAxiom({ 
                status: 'CRITICAL_FAILURE', 
                error: String(error),
                origin: 'Hybrid_start_reaper'
            });
            throw error;
        }
    }
}
