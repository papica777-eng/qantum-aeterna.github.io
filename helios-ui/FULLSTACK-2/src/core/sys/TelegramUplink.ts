/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 📱 TELEGRAM UPLINK: MOBILE COMMAND CENTER
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Sends high-priority trade alerts directly to the Architect's device.
 * Bypasses silent mode for profit notifications.
 */

import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();

export class TelegramUplink {
    private bot: TelegramBot | null = null;
    private chatId: string | null = null;

    constructor() {
        // LOAD CREDENTIALS
        // IF USING .env FILE:
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chat = process.env.TELEGRAM_CHAT_ID;

        if (token && chat) {
            this.bot = new TelegramBot(token, { polling: false }); // No polling, just sending
            this.chatId = chat;
            console.log(`\x1b[32m📱 [TELEGRAM] UPLINK ESTABLISHED -> ${chat}\x1b[0m`);
        } else {
            console.warn(`\x1b[33m⚠️ [TELEGRAM] MISSING TOKEN. ALERTS DISABLED.\x1b[0m`);
            console.warn(`   > Please add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to .env`);
        }
    }

    public async sendAlert(message: string, profit: number): Promise<void> {
        if (!this.bot || !this.chatId) return;

        const icon = profit > 0 ? '💰' : '⚠️';
        const text = `
${icon} <b>QANTUM NOTIFICATION</b>
━━━━━━━━━━━━━━━━━━━━━━━━
${message}
<b>Net Result:</b> ${profit > 0 ? '+' : ''}$${profit.toFixed(2)}
━━━━━━━━━━━━━━━━━━━━━━━━
<i>Sent via Veritas OS</i>
`;
        try {
            await this.bot.sendMessage(this.chatId, text, { parse_mode: 'HTML' });
        } catch (e) {
            console.error(`❌ [TELEGRAM ERROR]:`, e);
        }
    }
}
