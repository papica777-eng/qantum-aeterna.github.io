/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * QANTUM PRIME - AUTONOMOUS SALES GENERAL
 * Master orchestrator for the complete sales pipeline
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');
const { LeadEnricher } = require('./lead-enricher');
const { ProposalFactory } = require('./proposal-factory');
const { SendGridDispatcher } = require('./sendgrid-dispatcher');

const CONFIG = {
    // Cycle timing
    HUNT_INTERVAL: 30 * 60 * 1000,     // Hunt new leads every 30 min
    ENRICH_INTERVAL: 60 * 60 * 1000,   // Enrich leads every hour
    DISPATCH_INTERVAL: 30 * 60 * 1000, // Send proposals every 30 min
    
    // Data paths
    DATA_DIR: path.join(__dirname, '..', '..', 'data'),
    
    // Mode
    DRY_RUN: process.env.DRY_RUN !== 'false' // Default to dry run for safety
};

class AutonomousSalesGeneral {
    constructor() {
        this.stats = {
            startedAt: new Date(),
            cycles: 0,
            leadsHunted: 0,
            leadsEnriched: 0,
            proposalsSent: 0,
            conversions: 0
        };
        
        this.enricher = new LeadEnricher();
        this.proposalFactory = new ProposalFactory();
        this.dispatcher = new SendGridDispatcher();
    }

    log(message, emoji = '🤖') {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] ${emoji} ${message}`);
    }

    async huntLeads() {
        this.log('Starting lead hunt cycle...', '🎯');
        
        // The real-lead-hunter.js handles this, we just trigger it
        const { execSync } = require('child_process');
        try {
            execSync('node scripts/real-lead-hunter.js --single-cycle', {
                cwd: path.join(__dirname, '..', '..'),
                stdio: 'inherit',
                timeout: 5 * 60 * 1000 // 5 min timeout
            });
            this.stats.leadsHunted++;
        } catch (e) {
            this.log(`Hunt cycle error: ${e.message}`, '⚠️');
        }
    }

    async enrichLeads() {
        this.log('Starting enrichment cycle...', '🔬');
        
        try {
            const enrichedLeads = await this.enricher.enrichAll();
            this.stats.leadsEnriched = enrichedLeads.length;
            this.log(`Enriched ${enrichedLeads.length} leads`, '✅');
        } catch (e) {
            this.log(`Enrichment error: ${e.message}`, '⚠️');
        }
    }

    async generateProposals() {
        this.log('Generating proposals...', '📝');
        
        try {
            const proposals = this.proposalFactory.generateAll();
            this.log(`Generated ${proposals.length} proposals`, '✅');
            return proposals;
        } catch (e) {
            this.log(`Proposal generation error: ${e.message}`, '⚠️');
            return [];
        }
    }

    async dispatchProposals() {
        this.log('Dispatching proposals...', '📬');
        
        try {
            await this.dispatcher.dispatchAll(CONFIG.DRY_RUN);
        } catch (e) {
            this.log(`Dispatch error: ${e.message}`, '⚠️');
        }
    }

    getStatus() {
        const runtime = Math.floor((Date.now() - this.stats.startedAt.getTime()) / 1000 / 60);
        
        return `
╔═══════════════════════════════════════════════════════════════════════════════╗
║   🎖️ AUTONOMOUS SALES GENERAL - STATUS REPORT                                 ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║   Runtime: ${runtime} minutes                                                  
║   Cycles Completed: ${this.stats.cycles}                                       
║                                                                               ║
║   📊 PIPELINE STATS:                                                          ║
║   ├─ Leads Hunted: ${this.stats.leadsHunted}                                   
║   ├─ Leads Enriched: ${this.stats.leadsEnriched}                               
║   ├─ Proposals Sent: ${this.stats.proposalsSent}                               
║   └─ Conversions: ${this.stats.conversions}                                    
║                                                                               ║
║   Mode: ${CONFIG.DRY_RUN ? 'DRY RUN (simulation)' : 'LIVE MODE'}              
╚═══════════════════════════════════════════════════════════════════════════════╝`;
    }

    async runFullCycle() {
        this.stats.cycles++;
        this.log(`Starting full sales cycle #${this.stats.cycles}`, '🔄');
        
        // 1. Enrich existing leads
        await this.enrichLeads();
        
        // 2. Generate proposals
        await this.generateProposals();
        
        // 3. Dispatch (dry run unless --live)
        await this.dispatchProposals();
        
        console.log(this.getStatus());
    }

    async start() {
        console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║   ⚔️ QANTUM PRIME - AUTONOMOUS SALES GENERAL ⚔️                               ║
║                                                                               ║
║   "While you celebrate, I conquer markets."                                   ║
║                                                                               ║
║   Started: ${new Date().toISOString()}                              
║   Mode: ${CONFIG.DRY_RUN ? 'DRY RUN (safe simulation)' : '🔴 LIVE MODE'}       
║                                                                               ║
║   Pipeline:                                                                   ║
║   1. Lead Hunter → 2. Lead Enricher → 3. Proposal Factory → 4. Dispatcher     ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`);

        // Run first cycle immediately
        await this.runFullCycle();

        // Schedule subsequent cycles
        setInterval(async () => {
            this.log('Scheduled cycle starting...', '⏰');
            await this.runFullCycle();
        }, CONFIG.ENRICH_INTERVAL);

        this.log('Sales General is now on autopilot. Press Ctrl+C to stop.', '🚀');
    }
}

// Run if called directly
if (require.main === module) {
    const general = new AutonomousSalesGeneral();
    
    // Check for live mode
    if (process.argv.includes('--live')) {
        CONFIG.DRY_RUN = false;
        console.log('\n⚠️ LIVE MODE ENABLED - Real emails will be sent!\n');
    }
    
    general.start().catch(console.error);
}

module.exports = { AutonomousSalesGeneral };
