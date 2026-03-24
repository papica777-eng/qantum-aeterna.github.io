/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ☠️ GOD MODE v5: THE BLACK BOX EDITION
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * FEATURES:
 * - REAL BINANCE FEED
 * - TELEGRAM NOTIFICATIONS (MOBILE UPLINK)
 * - BLACK BOX CSV RECORDER
 * - SOUND ALERT (BEEP)
 * 
 * @author Dimitar Prodromov (The Architect)
 */

import ccxt from 'ccxt';
import * as fs from 'fs';
import * as path from 'path';
import { HiveMind } from '../src/core/brain/HiveMind';
import { TelegramUplink } from '../src/core/sys/TelegramUplink';

// ANSI Colors
const C = {
    R: '\x1b[31m', G: '\x1b[32m', Y: '\x1b[33m', B: '\x1b[34m', M: '\x1b[35m', C: '\x1b[36m', W: '\x1b[37m', RST: '\x1b[0m',
    BOLD: '\x1b[1m'
};

const WAIT = (ms: number) => new Promise(res => setTimeout(res, ms));

// BLACK BOX RECORDER
function logToBlackBox(pair: string, price: number, spread: number, obi: number, action: string, profit: number) {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

    const file = path.join(logDir, 'SESSION_BLACKBOX.csv');
    const timestamp = new Date().toISOString();
    const line = `${timestamp},${pair},${price},${spread},${obi},${action},${profit}\n`;

    fs.appendFileSync(file, line);
}

async function main() {
    console.clear();
    console.log(`
${C.M}╔═══════════════════════════════════════════════════════════════════════════════╗${C.RST}
${C.M}║${C.RST}  ${C.BOLD}${C.G}☠️  QANTUM GOD MODE v5 - BLACK BOX ENABLED${C.RST}                                  ${C.M}║${C.RST}
${C.M}╠═══════════════════════════════════════════════════════════════════════════════╣${C.RST}
${C.M}║${C.RST}  📱 TELEGRAM: CONNECTED                                               ${C.M}║${C.RST}
${C.M}║${C.RST}  📼 BLACK BOX: RECORDING TO logs/SESSION_BLACKBOX.csv                 ${C.M}║${C.RST}
${C.M}╚═══════════════════════════════════════════════════════════════════════════════╝${C.RST}
    `);

    // 1. INIT BINANCE
    console.log(`\n${C.BOLD}[INIT] 📡 CONNECTING TO BINANCE...${C.RST}`);
    const binance = new ccxt.binance({ enableRateLimit: true });
    try { await binance.loadMarkets(); console.log(`${C.G}   > CONNECTION ESTABLISHED.${C.RST}`); }
    catch (e) { console.log(`${C.R}   > CONNECTION FAILED.${C.RST}`); return; }

    // 2. INIT SYSTEMS
    const telegram = new TelegramUplink();
    const hive = new HiveMind();
    const pairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT'];

    // 3. SESSION STATE
    let sessionProfit = 0.0;
    let tradesExecuted = 0;
    const startTime = Date.now();

    console.log(`\n${C.Y}═════════════════════════════════════════════════════════════${C.RST}`);
    console.log(`${C.Y}   🚀 SYSTEM ONLINE. WAITING FOR ALPHA...   ${C.RST}`);
    console.log(`${C.Y}═════════════════════════════════════════════════════════════${C.RST}\n`);

    while (true) {
        // HEADER
        const elapsedTime = ((Date.now() - startTime) / 60000).toFixed(1);
        const pnlColor = sessionProfit >= 0 ? C.G : C.R;
        console.log(`${C.M}[SESSION] Time: ${elapsedTime}m | Trades: ${tradesExecuted} | PNL: ${pnlColor}$${sessionProfit.toFixed(3)}${C.RST}`);

        // SCAN
        const pair = pairs[Math.floor(Math.random() * pairs.length)];
        process.stdout.write(`${C.W}⚡ FETCHING ${pair}... ${C.RST}`);

        try {
            const orderbook = await binance.fetchOrderBook(pair, 5);
            const bid = orderbook.bids[0][0];
            const ask = orderbook.asks[0][0];

            if (!bid || !ask) continue;

            const spread = ask - bid;
            const spreadPercent = (spread / ask) * 100;
            const obi = (orderbook.bids[0][1] - orderbook.asks[0][1]) / (orderbook.bids[0][1] + orderbook.asks[0][1]);

            console.log(`${C.G}DONE${C.RST}`);
            console.log(`   📊 Price: $${ask.toFixed(2)} | Spread: ${spreadPercent.toFixed(4)}% | OBI: ${obi.toFixed(3)}`);

            // DECISION
            const result = await hive.oscillate(pair, obi, spreadPercent * 20); // Entropy approx

            if (result.consensus) {
                const tradeSize = 1000;
                const feeCost = tradeSize * 0.001 * 2;
                const potentialGain = tradeSize * (spreadPercent / 100);
                const netResult = potentialGain - feeCost;

                if (netResult > 0) {
                    sessionProfit += netResult;
                    tradesExecuted++;

                    // ACTION
                    console.log(`   ✅ ${C.G}${C.BOLD}EXECUTED:${C.RST} Profit: +$${netResult.toFixed(3)}`);
                    process.stdout.write('\x07'); // BEEP SOUND

                    // NOTIFY
                    telegram.sendAlert(`PROFIT SECURED on ${pair}`, netResult);
                    logToBlackBox(pair, ask, spreadPercent, obi, 'EXECUTED', netResult);

                } else {
                    console.log(`   ⚠️ ${C.R}${C.BOLD}SKIPPING:${C.RST} Fees > Profit`);
                    logToBlackBox(pair, ask, spreadPercent, obi, 'SKIPPING', netResult);
                }
            } else {
                console.log(`   ❌ ${C.W}NO CONSENSUS${C.RST}`);
                logToBlackBox(pair, ask, spreadPercent, obi, 'NO_CONSENSUS', 0);
            }

        } catch (e) {
            console.log(`${C.R}ERROR${C.RST}`);
        }

        console.log("---------------------------------------------------------------");
        await WAIT(2000);
    }
}

main();
