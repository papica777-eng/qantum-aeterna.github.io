/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * QANTUM PRIME - SENDGRID DISPATCHER
 * Sends personalized proposals via SendGrid with rate limiting
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION - ADD YOUR SENDGRID API KEY HERE
// ═══════════════════════════════════════════════════════════════════════════════
const CONFIG = {
    // 🔑 GET YOUR KEY: https://app.sendgrid.com/settings/api_keys
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || 'YOUR_SENDGRID_API_KEY_HERE',
    
    // Sender info (must be verified in SendGrid)
    FROM_EMAIL: process.env.FROM_EMAIL || 'sales@qantum-prime.com',
    FROM_NAME: 'QAntum Prime',
    
    // Rate limiting (to avoid spam flags)
    SEND_INTERVAL_MS: 30 * 60 * 1000, // 30 minutes between sends
    MAX_SENDS_PER_DAY: 50,
    
    // Tracking
    WEBHOOK_URL: process.env.DISCORD_WEBHOOK || process.env.SLACK_WEBHOOK || null
};

const PROPOSALS_DIR = path.join(__dirname, '..', '..', 'data', 'proposals');
const SENT_LOG = path.join(PROPOSALS_DIR, 'sent-log.json');

class SendGridDispatcher {
    constructor() {
        this.sentLog = this.loadSentLog();
        this.queue = [];
    }

    loadSentLog() {
        if (fs.existsSync(SENT_LOG)) {
            return JSON.parse(fs.readFileSync(SENT_LOG, 'utf-8'));
        }
        return { sent: [], failed: [], stats: { total_sent: 0, total_failed: 0 } };
    }

    saveSentLog() {
        fs.writeFileSync(SENT_LOG, JSON.stringify(this.sentLog, null, 2));
    }

    async sendEmail(to, subject, htmlBody, textBody) {
        if (CONFIG.SENDGRID_API_KEY === 'YOUR_SENDGRID_API_KEY_HERE') {
            console.log(`   ⚠️ SIMULATION MODE (no API key)`);
            console.log(`   📧 Would send to: ${to}`);
            console.log(`   📋 Subject: ${subject}`);
            return { success: true, simulated: true };
        }

        return new Promise((resolve, reject) => {
            const data = JSON.stringify({
                personalizations: [{ to: [{ email: to }] }],
                from: { email: CONFIG.FROM_EMAIL, name: CONFIG.FROM_NAME },
                subject: subject,
                content: [
                    { type: 'text/plain', value: textBody },
                    { type: 'text/html', value: htmlBody.replace(/\n/g, '<br>') }
                ],
                tracking_settings: {
                    click_tracking: { enable: true },
                    open_tracking: { enable: true }
                }
            });

            const options = {
                hostname: 'api.sendgrid.com',
                port: 443,
                path: '/v3/mail/send',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.SENDGRID_API_KEY}`,
                    'Content-Length': data.length
                }
            };

            const req = https.request(options, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    if (res.statusCode === 202) {
                        resolve({ success: true, statusCode: res.statusCode });
                    } else {
                        resolve({ success: false, statusCode: res.statusCode, error: body });
                    }
                });
            });

            req.on('error', (e) => reject(e));
            req.write(data);
            req.end();
        });
    }

    async notifyWebhook(message) {
        if (!CONFIG.WEBHOOK_URL) return;

        const payload = JSON.stringify({
            content: message, // Discord format
            text: message     // Slack format
        });

        return new Promise((resolve) => {
            const url = new URL(CONFIG.WEBHOOK_URL);
            const req = https.request({
                hostname: url.hostname,
                path: url.pathname,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }, resolve);
            req.write(payload);
            req.end();
        });
    }

    loadProposals() {
        const summaryFile = path.join(PROPOSALS_DIR, 'proposals-summary.json');
        if (!fs.existsSync(summaryFile)) {
            console.log('❌ No proposals found. Run proposal-factory.js first.');
            return [];
        }
        
        const summary = JSON.parse(fs.readFileSync(summaryFile, 'utf-8'));
        return summary.proposals;
    }

    canSendToday() {
        const today = new Date().toISOString().split('T')[0];
        const sentToday = this.sentLog.sent.filter(s => s.sent_at.startsWith(today)).length;
        return sentToday < CONFIG.MAX_SENDS_PER_DAY;
    }

    async sendProposal(proposal) {
        // Check if already sent
        if (this.sentLog.sent.find(s => s.lead_id === proposal.lead_id)) {
            console.log(`   ⏭️ Already sent to ${proposal.lead_name}, skipping`);
            return { skipped: true };
        }

        // Check daily limit
        if (!this.canSendToday()) {
            console.log(`   ⚠️ Daily limit reached (${CONFIG.MAX_SENDS_PER_DAY})`);
            return { limited: true };
        }

        // Need valid email
        if (!proposal.email || proposal.email.includes('placeholder')) {
            console.log(`   ⚠️ No valid email for ${proposal.lead_name}`);
            return { no_email: true };
        }

        console.log(`   📤 Sending to: ${proposal.email}`);
        
        try {
            const result = await this.sendEmail(
                proposal.email,
                proposal.subject,
                proposal.body,
                proposal.body // Use same for text version
            );

            if (result.success) {
                this.sentLog.sent.push({
                    lead_id: proposal.lead_id,
                    lead_name: proposal.lead_name,
                    email: proposal.email,
                    sent_at: new Date().toISOString(),
                    simulated: result.simulated || false
                });
                this.sentLog.stats.total_sent++;
                this.saveSentLog();

                // Notify webhook
                await this.notifyWebhook(
                    `📧 **QAntum Sales**: Proposal sent to **${proposal.lead_name}** (${proposal.email})\nPriority: ${proposal.priority_score} | Template: ${proposal.template_used}`
                );

                return { success: true };
            } else {
                this.sentLog.failed.push({
                    lead_id: proposal.lead_id,
                    error: result.error,
                    failed_at: new Date().toISOString()
                });
                this.sentLog.stats.total_failed++;
                this.saveSentLog();
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    async dispatchAll(dryRun = true) {
        console.log(`
╔═══════════════════════════════════════════════════════════════════════╗
║   📬 QANTUM PRIME - SENDGRID DISPATCHER                               ║
║   Mode: ${dryRun ? 'DRY RUN (simulation)' : 'LIVE SEND'}                                         ║
╚═══════════════════════════════════════════════════════════════════════╝
`);

        const proposals = this.loadProposals();
        if (proposals.length === 0) return;

        // Sort by priority (hottest first)
        proposals.sort((a, b) => b.priority_score - a.priority_score);

        console.log(`📋 ${proposals.length} proposals to process\n`);

        let sent = 0, skipped = 0, failed = 0;

        for (const proposal of proposals) {
            console.log(`\n🎯 ${proposal.lead_name} (Priority: ${proposal.priority_score})`);
            
            if (dryRun) {
                console.log(`   📧 [DRY RUN] Would send: ${proposal.subject}`);
                console.log(`   📍 To: ${proposal.email || '[NO EMAIL]'}`);
                skipped++;
            } else {
                const result = await this.sendProposal(proposal);
                if (result.success) sent++;
                else if (result.skipped) skipped++;
                else failed++;

                // Rate limiting between sends
                if (!result.skipped && !result.limited) {
                    console.log(`   ⏳ Waiting ${CONFIG.SEND_INTERVAL_MS / 60000} minutes before next send...`);
                    await new Promise(r => setTimeout(r, CONFIG.SEND_INTERVAL_MS));
                }
            }
        }

        console.log(`
╔═══════════════════════════════════════════════════════════════════════╗
║   📊 DISPATCH COMPLETE                                                 ║
╠═══════════════════════════════════════════════════════════════════════╣
║   ✅ Sent: ${sent.toString().padEnd(55)}║
║   ⏭️ Skipped: ${skipped.toString().padEnd(52)}║
║   ❌ Failed: ${failed.toString().padEnd(53)}║
╚═══════════════════════════════════════════════════════════════════════╝
`);
    }

    // Start continuous dispatch loop
    async startAutoDispatch() {
        console.log(`
╔═══════════════════════════════════════════════════════════════════════╗
║   🤖 QANTUM PRIME - AUTO DISPATCH MODE                                ║
║   Running every ${CONFIG.SEND_INTERVAL_MS / 60000} minutes                                       ║
║   Press Ctrl+C to stop                                                ║
╚═══════════════════════════════════════════════════════════════════════╝
`);

        // First run immediately
        await this.dispatchAll(CONFIG.SENDGRID_API_KEY === 'YOUR_SENDGRID_API_KEY_HERE');

        // Then schedule
        setInterval(async () => {
            console.log(`\n🔄 Auto-dispatch cycle: ${new Date().toLocaleString()}`);
            await this.dispatchAll(CONFIG.SENDGRID_API_KEY === 'YOUR_SENDGRID_API_KEY_HERE');
        }, CONFIG.SEND_INTERVAL_MS);
    }
}

// Run if called directly
if (require.main === module) {
    const dispatcher = new SendGridDispatcher();
    
    // Check for --live flag for actual sending
    if (process.argv.includes('--live')) {
        dispatcher.dispatchAll(false);
    } else if (process.argv.includes('--auto')) {
        dispatcher.startAutoDispatch();
    } else {
        console.log('Running in DRY RUN mode. Use --live to actually send, --auto for continuous.\n');
        dispatcher.dispatchAll(true);
    }
}

module.exports = { SendGridDispatcher, CONFIG };
