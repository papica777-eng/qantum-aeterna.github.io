import { HybridGodModeWrapper } from "./HybridGodModeWrapper";

/**
 * @wrapper Hybrid_real_lead_hunter
 * @description Auto-generated God-Mode Hybrid.
 * @origin "real-lead-hunter.js"
 */
export class Hybrid_real_lead_hunter extends HybridGodModeWrapper {
    async execute(): Promise<void> {
        try {
            console.log("/// [HYBRID_CORE] Executing Logics from Hybrid_real_lead_hunter ///");
            
            // --- START LEGACY INJECTION ---
            /**
 * ═══════════════════════════════════════════════════════════════════════════════
 * QANTUM PRIME - REAL LEAD HUNTER
 * Finds ACTUAL companies looking for QA/Testing solutions
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  outputDir: path.join(__dirname, '..', 'data', 'real-leads'),
  reportsDir: path.join(__dirname, '..', 'data', 'real-reports'),
  cycleInterval: 30 * 60 * 1000, // 30 minutes
};

// Ensure directories exist
[CONFIG.outputDir, CONFIG.reportsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

class RealLeadHunter {
  constructor() {
    this.leads = [];
    this.stats = {
      startedAt: new Date(),
      cyclesRun: 0,
      totalLeadsFound: 0,
      apiCalls: 0,
    };
    this.loadExistingLeads();
  }

  loadExistingLeads() {
    const leadsFile = path.join(CONFIG.outputDir, 'leads.json');
    if (fs.existsSync(leadsFile)) {
      this.leads = JSON.parse(fs.readFileSync(leadsFile, 'utf-8'));
      console.log(`📂 Loaded ${this.leads.length} existing leads`);
    }
  }

  saveLeads() {
    const leadsFile = path.join(CONFIG.outputDir, 'leads.json');
    fs.writeFileSync(leadsFile, JSON.stringify(this.leads, null, 2));
  }

  // HTTP request helper
  httpGet(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      const options = {
        headers: {
          'User-Agent': 'QAntum-Prime-LeadHunter/1.0',
          'Accept': 'application/json',
        }
      };
      
      protocol.get(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve(data);
          }
        });
      }).on('error', reject);
    });
  }

  // 1. GitHub API - Find repos searching for QA/testing tools (FREE, no key needed)
  async searchGitHub() {
    console.log('\n🔍 [GitHub] Searching for companies needing QA tools...');
    this.stats.apiCalls++;
    
    const queries = [
      'qa+automation+hiring',
      'testing+framework+needed',
      'selenium+cypress+help',
      'e2e+testing+setup',
      'quality+assurance+tool',
    ];
    
    const query = queries[Math.floor(Math.random() * queries.length)];
    const newLeads = [];
    
    try {
      // Search GitHub issues mentioning QA needs
      const url = `https://api.github.com/search/repositories?q=${query}&sort=updated&per_page=10`;
      const data = await this.httpGet(url);
      
      if (data.items && data.items.length > 0) {
        for (const repo of data.items.slice(0, 5)) {
          // Extract potential company info
          const owner = repo.owner;
          
          // Skip if we already have this lead
          if (this.leads.find(l => l.source_id === `github_${owner.login}`)) continue;
          
          const lead = {
            id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            source: 'GitHub',
            source_id: `github_${owner.login}`,
            name: owner.login,
            type: owner.type, // User or Organization
            profile_url: owner.html_url,
            repo_name: repo.full_name,
            repo_url: repo.html_url,
            repo_description: repo.description,
            stars: repo.stargazers_count,
            language: repo.language,
            discovered_at: new Date().toISOString(),
            query_matched: query,
            score: this.calculateScore(repo),
            status: 'new',
          };
          
          newLeads.push(lead);
        }
      }
      
      console.log(`   ✅ Found ${newLeads.length} potential leads from GitHub`);
    } catch (error) {
      console.log(`   ⚠️ GitHub API error: ${error.message}`);
    }
    
    return newLeads;
  }

  // 2. Hacker News API - Find discussions about QA tools (FREE)
  async searchHackerNews() {
    console.log('\n🔍 [HackerNews] Finding QA/testing discussions...');
    this.stats.apiCalls++;
    
    const newLeads = [];
    
    try {
      // Get latest stories
      const topStories = await this.httpGet('https://hacker-news.firebaseio.com/v0/newstories.json');
      const storiesToCheck = topStories.slice(0, 20);
      
      for (const storyId of storiesToCheck.slice(0, 5)) {
        const story = await this.httpGet(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
        
        if (!story || !story.title) continue;
        
        const title = story.title.toLowerCase();
        const isRelevant = ['test', 'qa', 'quality', 'selenium', 'cypress', 'automation', 'e2e'].some(
          keyword => title.includes(keyword)
        );
        
        if (isRelevant && story.by) {
          if (this.leads.find(l => l.source_id === `hn_${story.id}`)) continue;
          
          const lead = {
            id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            source: 'HackerNews',
            source_id: `hn_${story.id}`,
            name: story.by,
            title: story.title,
            url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
            hn_link: `https://news.ycombinator.com/item?id=${story.id}`,
            score: story.score || 0,
            discovered_at: new Date().toISOString(),
            status: 'new',
          };
          
          newLeads.push(lead);
        }
      }
      
      console.log(`   ✅ Found ${newLeads.length} relevant discussions on HN`);
    } catch (error) {
      console.log(`   ⚠️ HackerNews API error: ${error.message}`);
    }
    
    return newLeads;
  }

  // 3. Reddit API (public JSON endpoints) - Find QA needs (FREE)
  async searchReddit() {
    console.log('\n🔍 [Reddit] Scanning QA subreddits...');
    this.stats.apiCalls++;
    
    const subreddits = ['QualityAssurance', 'softwaretesting', 'selenium', 'devops'];
    const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
    const newLeads = [];
    
    try {
      const url = `https://www.reddit.com/r/${subreddit}/new.json?limit=10`;
      const data = await this.httpGet(url);
      
      if (data.data && data.data.children) {
        for (const post of data.data.children.slice(0, 5)) {
          const item = post.data;
          
          // Look for posts asking for help/tools
          const title = item.title.toLowerCase();
          const isNeed = ['need', 'help', 'looking for', 'recommend', 'best', 'tool', 'framework'].some(
            keyword => title.includes(keyword)
          );
          
          if (isNeed) {
            if (this.leads.find(l => l.source_id === `reddit_${item.id}`)) continue;
            
            const lead = {
              id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              source: 'Reddit',
              source_id: `reddit_${item.id}`,
              subreddit: subreddit,
              author: item.author,
              title: item.title,
              url: `https://reddit.com${item.permalink}`,
              upvotes: item.ups,
              comments: item.num_comments,
              discovered_at: new Date().toISOString(),
              status: 'new',
            };
            
            newLeads.push(lead);
          }
        }
      }
      
      console.log(`   ✅ Found ${newLeads.length} potential leads from r/${subreddit}`);
    } catch (error) {
      console.log(`   ⚠️ Reddit API error: ${error.message}`);
    }
    
    return newLeads;
  }

  // 4. RemoteOK Jobs API - Find companies hiring QA (FREE)
  async searchRemoteJobs() {
    console.log('\n🔍 [RemoteOK] Finding companies hiring QA engineers...');
    this.stats.apiCalls++;
    
    const newLeads = [];
    
    try {
      const data = await this.httpGet('https://remoteok.com/api');
      
      if (Array.isArray(data)) {
        const qaJobs = data.filter(job => {
          if (!job.position) return false;
          const pos = job.position.toLowerCase();
          return pos.includes('qa') || pos.includes('test') || pos.includes('quality');
        }).slice(0, 5);
        
        for (const job of qaJobs) {
          if (this.leads.find(l => l.source_id === `remoteok_${job.id}`)) continue;
          
          const lead = {
            id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            source: 'RemoteOK',
            source_id: `remoteok_${job.id}`,
            company: job.company,
            position: job.position,
            location: job.location || 'Remote',
            url: job.url,
            company_logo: job.company_logo,
            tags: job.tags,
            salary_min: job.salary_min,
            salary_max: job.salary_max,
            discovered_at: new Date().toISOString(),
            status: 'new',
            priority: 'high', // Companies actively hiring = hot leads
          };
          
          newLeads.push(lead);
        }
      }
      
      console.log(`   ✅ Found ${newLeads.length} companies hiring QA from RemoteOK`);
    } catch (error) {
      console.log(`   ⚠️ RemoteOK API error: ${error.message}`);
    }
    
    return newLeads;
  }

  calculateScore(repo) {
    let score = 50;
    if (repo.stargazers_count > 100) score += 10;
    if (repo.stargazers_count > 1000) score += 15;
    if (repo.owner.type === 'Organization') score += 20;
    if (repo.language === 'JavaScript' || repo.language === 'TypeScript') score += 5;
    return Math.min(score, 100);
  }

  async runCycle() {
    this.stats.cyclesRun++;
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`🔄 CYCLE #${this.stats.cyclesRun} START: ${new Date().toLocaleString()}`);
    console.log(`${'═'.repeat(60)}`);

    // Run all searches
    const allNewLeads = [];
    
    try {
      const githubLeads = await this.searchGitHub();
      allNewLeads.push(...githubLeads);
    } catch (e) { console.log('GitHub search failed:', e.message); }
    
    await this.delay(2000); // Rate limiting
    
    try {
      const hnLeads = await this.searchHackerNews();
      allNewLeads.push(...hnLeads);
    } catch (e) { console.log('HN search failed:', e.message); }
    
    await this.delay(2000);
    
    try {
      const redditLeads = await this.searchReddit();
      allNewLeads.push(...redditLeads);
    } catch (e) { console.log('Reddit search failed:', e.message); }
    
    await this.delay(2000);
    
    try {
      const jobLeads = await this.searchRemoteJobs();
      allNewLeads.push(...jobLeads);
    } catch (e) { console.log('RemoteOK search failed:', e.message); }

    // Add new leads
    if (allNewLeads.length > 0) {
      this.leads.push(...allNewLeads);
      this.stats.totalLeadsFound += allNewLeads.length;
      this.saveLeads();
      console.log(`\n✅ Added ${allNewLeads.length} NEW REAL leads (Total: ${this.leads.length})`);
    } else {
      console.log(`\n📭 No new leads this cycle (Total: ${this.leads.length})`);
    }

    // Save report
    this.saveReport();

    // Stats
    const runtime = Math.floor((Date.now() - this.stats.startedAt.getTime()) / 1000 / 60);
    console.log(`\n📊 SESSION STATS:`);
    console.log(`   • Cycles run: ${this.stats.cyclesRun}`);
    console.log(`   • Total leads found: ${this.stats.totalLeadsFound}`);
    console.log(`   • API calls made: ${this.stats.apiCalls}`);
    console.log(`   • Runtime: ${runtime} minutes`);
    console.log(`\n💤 Next cycle in 30 minutes...`);
  }

  saveReport() {
    const report = {
      generatedAt: new Date().toISOString(),
      stats: {
        ...this.stats,
        startedAt: this.stats.startedAt.toISOString(),
      },
      runtime: Math.floor((Date.now() - this.stats.startedAt.getTime()) / 1000 / 60) + ' minutes',
      totalLeads: this.leads.length,
      leadsBySoure: {
        GitHub: this.leads.filter(l => l.source === 'GitHub').length,
        HackerNews: this.leads.filter(l => l.source === 'HackerNews').length,
        Reddit: this.leads.filter(l => l.source === 'Reddit').length,
        RemoteOK: this.leads.filter(l => l.source === 'RemoteOK').length,
      },
      hotLeads: this.leads.filter(l => l.priority === 'high').slice(-10),
      latestLeads: this.leads.slice(-10),
    };

    const reportFile = path.join(CONFIG.reportsDir, `report-${Date.now()}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`📊 Report saved: ${reportFile}`);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async start() {
    console.log(`
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║   🎯 QANTUM PRIME - REAL LEAD HUNTER 🎯                              ║
║                                                                       ║
║   Started: ${new Date().toISOString()}                       ║
║   Mode: REAL DATA COLLECTION                                          ║
║                                                                       ║
║   Sources:                                                            ║
║   • GitHub API (repos needing QA tools)                               ║
║   • HackerNews (QA discussions)                                       ║
║   • Reddit (r/QualityAssurance, r/softwaretesting)                   ║
║   • RemoteOK (companies hiring QA)                                    ║
║                                                                       ║
║   Output: ${CONFIG.outputDir}                                         ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
`);

    // First cycle immediately
    await this.runCycle();

    // Then every 30 minutes
    setInterval(() => this.runCycle(), CONFIG.cycleInterval);

    console.log(`\n⏰ Running every 30 minutes. Press Ctrl+C to stop.`);
  }
}

// Start the hunter
const hunter = new RealLeadHunter();
hunter.start().catch(console.error);

            // --- END LEGACY INJECTION ---

            await this.recordAxiom({ 
                status: 'SUCCESS', 
                origin: 'Hybrid_real_lead_hunter',
                timestamp: Date.now()
            });
        } catch (error) {
            console.error("/// [HYBRID_FAULT] Critical Error in Hybrid_real_lead_hunter ///", error);
            await this.recordAxiom({ 
                status: 'CRITICAL_FAILURE', 
                error: String(error),
                origin: 'Hybrid_real_lead_hunter'
            });
            throw error;
        }
    }
}
