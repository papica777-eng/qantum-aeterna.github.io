/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * QANTUM PRIME - LEAD ENRICHER
 * Scans leads' GitHub repos to find specific problems we can solve
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const LEADS_FILE = path.join(__dirname, '..', '..', 'data', 'real-leads', 'leads.json');
const ENRICHED_FILE = path.join(__dirname, '..', '..', 'data', 'real-leads', 'enriched-leads.json');

class LeadEnricher {
    constructor() {
        this.leads = [];
        this.enrichedLeads = [];
    }

    async httpGet(url) {
        return new Promise((resolve, reject) => {
            https.get(url, {
                headers: {
                    'User-Agent': 'QAntum-Prime-SalesBot/1.0',
                    'Accept': 'application/vnd.github.v3+json'
                }
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch {
                        resolve(null);
                    }
                });
            }).on('error', reject);
        });
    }

    loadLeads() {
        if (fs.existsSync(LEADS_FILE)) {
            this.leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
            console.log(`📂 Loaded ${this.leads.length} leads for enrichment`);
        }
    }

    async analyzeGitHubRepo(repoUrl) {
        const problems = [];
        const opportunities = [];
        
        // Extract owner/repo from URL
        const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!match) return { problems, opportunities };
        
        const [, owner, repo] = match;
        
        try {
            // 1. Check package.json for testing frameworks
            const packageJson = await this.httpGet(
                `https://raw.githubusercontent.com/${owner}/${repo}/main/package.json`
            );
            
            if (packageJson) {
                const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
                
                // Detect testing stack
                if (deps['playwright']) {
                    opportunities.push({
                        type: 'playwright_user',
                        message: 'Uses Playwright - can benefit from Ghost Protocol stealth',
                        value: 'high'
                    });
                }
                if (deps['cypress']) {
                    opportunities.push({
                        type: 'cypress_user', 
                        message: 'Uses Cypress - can migrate to faster Playwright with QAntum',
                        value: 'high'
                    });
                }
                if (deps['jest'] || deps['mocha']) {
                    opportunities.push({
                        type: 'unit_testing',
                        message: 'Has unit tests but may lack E2E - QAntum fills the gap',
                        value: 'medium'
                    });
                }
                if (!deps['playwright'] && !deps['cypress'] && !deps['puppeteer']) {
                    problems.push({
                        type: 'no_e2e',
                        message: 'No E2E testing framework detected',
                        severity: 'critical',
                        solution: 'QAntum provides full E2E coverage out of the box'
                    });
                }
            }

            // 2. Check for CI/CD config
            const hasGitHubActions = await this.httpGet(
                `https://api.github.com/repos/${owner}/${repo}/contents/.github/workflows`
            );
            
            if (!hasGitHubActions || hasGitHubActions.message === 'Not Found') {
                problems.push({
                    type: 'no_ci',
                    message: 'No CI/CD pipeline detected',
                    severity: 'high',
                    solution: 'QAntum includes pre-built GitHub Actions for automated testing'
                });
            }

            // 3. Check repo stats
            const repoData = await this.httpGet(`https://api.github.com/repos/${owner}/${repo}`);
            if (repoData && !repoData.message) {
                if (repoData.open_issues_count > 10) {
                    problems.push({
                        type: 'many_issues',
                        message: `${repoData.open_issues_count} open issues - may indicate testing gaps`,
                        severity: 'medium',
                        solution: 'QAntum Oracle can predict bugs before they become issues'
                    });
                }
                
                // Recent activity = hot lead
                const lastPush = new Date(repoData.pushed_at);
                const daysSinceUpdate = (Date.now() - lastPush) / (1000 * 60 * 60 * 24);
                if (daysSinceUpdate < 7) {
                    opportunities.push({
                        type: 'active_development',
                        message: 'Actively maintained - high conversion potential',
                        value: 'high'
                    });
                }
            }

        } catch (error) {
            console.log(`   ⚠️ Could not analyze ${repoUrl}: ${error.message}`);
        }

        return { problems, opportunities };
    }

    async enrichLead(lead) {
        console.log(`\n🔍 Enriching: ${lead.name || lead.company}`);
        
        const enrichedLead = { ...lead };
        enrichedLead.enriched_at = new Date().toISOString();
        enrichedLead.analysis = {
            problems: [],
            opportunities: [],
            recommended_pitch: '',
            priority_score: lead.score || 50
        };

        // GitHub leads - analyze their repo
        if (lead.source === 'GitHub' && lead.repo_url) {
            const { problems, opportunities } = await this.analyzeGitHubRepo(lead.repo_url);
            enrichedLead.analysis.problems = problems;
            enrichedLead.analysis.opportunities = opportunities;
            
            // Calculate priority score
            enrichedLead.analysis.priority_score += problems.length * 10;
            enrichedLead.analysis.priority_score += opportunities.filter(o => o.value === 'high').length * 15;
            
            // Generate pitch
            if (lead.type === 'Organization') {
                enrichedLead.analysis.recommended_pitch = `Organization with ${lead.stars || 0} stars - enterprise pitch`;
                enrichedLead.analysis.priority_score += 20;
            }
            
            if (problems.find(p => p.type === 'no_e2e')) {
                enrichedLead.analysis.recommended_pitch = 
                    `No E2E testing detected in ${lead.repo_name}. QAntum Prime provides full coverage with Ghost Protocol stealth and Oracle predictive analytics.`;
            }
            
            console.log(`   ✅ Found ${problems.length} problems, ${opportunities.length} opportunities`);
        }

        // RemoteOK leads - they're hiring, that's the opportunity
        if (lead.source === 'RemoteOK') {
            enrichedLead.analysis.opportunities.push({
                type: 'hiring',
                message: `Actively hiring for ${lead.position}`,
                value: 'high'
            });
            enrichedLead.analysis.priority_score = 90; // Hot lead!
            enrichedLead.analysis.recommended_pitch = 
                `You're hiring a ${lead.position}. QAntum Prime is the AI QA agent that works 24/7 with 0.08ms failover - faster and cheaper than a human hire.`;
            
            console.log(`   🔥 HOT LEAD - Company is actively hiring!`);
        }

        return enrichedLead;
    }

    async enrichAll() {
        console.log(`
╔═══════════════════════════════════════════════════════════════════════╗
║   🔬 QANTUM PRIME - LEAD ENRICHER                                     ║
║   Analyzing leads for sales opportunities...                          ║
╚═══════════════════════════════════════════════════════════════════════╝
`);

        this.loadLeads();
        
        for (const lead of this.leads) {
            const enriched = await this.enrichLead(lead);
            this.enrichedLeads.push(enriched);
            
            // Rate limiting - don't hammer APIs
            await new Promise(r => setTimeout(r, 1000));
        }

        // Sort by priority
        this.enrichedLeads.sort((a, b) => 
            (b.analysis?.priority_score || 0) - (a.analysis?.priority_score || 0)
        );

        // Save enriched data
        fs.writeFileSync(ENRICHED_FILE, JSON.stringify(this.enrichedLeads, null, 2));
        
        console.log(`
╔═══════════════════════════════════════════════════════════════════════╗
║   ✅ ENRICHMENT COMPLETE                                               ║
╠═══════════════════════════════════════════════════════════════════════╣
║   Total Leads: ${this.enrichedLeads.length.toString().padEnd(49)}║
║   Hot Leads (90+): ${this.enrichedLeads.filter(l => l.analysis?.priority_score >= 90).length.toString().padEnd(45)}║
║   Saved to: ${ENRICHED_FILE.replace('C:\\MisteMind\\', '').substring(0, 45).padEnd(45)}║
╚═══════════════════════════════════════════════════════════════════════╝
`);

        return this.enrichedLeads;
    }
}

// Run if called directly
if (require.main === module) {
    const enricher = new LeadEnricher();
    enricher.enrichAll().catch(console.error);
}

module.exports = { LeadEnricher };
