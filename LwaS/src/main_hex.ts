import { VortexEngine } from './core/VortexEngine.ts';
import { BinanceAdapter, VortexBrainAdapter, TelegramAdapter } from './infra/adapters.ts';

/**
 * 🏭 THE FACTORY (Composition Root)
 * 
 * This is where we assemble the machine.
 * 1. We build the parts (Exchange, Brain, Notifier).
 * 2. We inject them into the Engine.
 * 3. We turn the key.
 */

async function main() {
    console.clear();
    console.log("💎 VORTEX HEXAGONAL ARCHITECTURE LOADING...");
    console.log("=========================================");

    // 1. INFRASTRUCTURE LAYER ( The Tools )
    // If we want to switch to Bybit later, we just change this line:
    // const exchange = new BybitAdapter(); 
    const exchange = new BinanceAdapter();

    // If we want to switch to Gemini Brain:
    // const brain = new GeminiCloudAdapter();
    const brain = new VortexBrainAdapter();

    const notifier = new TelegramAdapter();

    // 2. CORE LAYER ( The Business Logic )
    // The Engine doesn't know it's using Binance. It just uses "exchange".
    const bot = new VortexEngine(exchange, brain, notifier);

    // 3. EXECUTION
    try {
        // Connect to the world
        await exchange.connect();

        // Start the OODA Loop
        console.log("🚀 STARTING ENGINE SEQUENCE...");
        await bot.start("BTC/USDT", 2000); // 2 second interval

    } catch (e) {
        console.error("🔥 FATAL SYSTEM FAILURE:", e);
        process.exit(1);
    }
}

// Global Error Handlers (Safety Net)
process.on('uncaughtException', (err) => {
    console.error('CRITICAL UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('CRITICAL UNHANDLED REJECTION:', reason);
});

main();
