/**
 * ╔═══════════════════════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                                               ║
 * ║   ██╗   ██╗███╗   ██╗██╗███████╗██╗███████╗██████╗                                            ║
 * ║   ██║   ██║████╗  ██║██║██╔════╝██║██╔════╝██╔══██╗                                           ║
 * ║   ██║   ██║██╔██╗ ██║██║█████╗  ██║█████╗  ██║  ██║                                           ║
 * ║   ██║   ██║██║╚██╗██║██║██╔══╝  ██║██╔══╝  ██║  ██║                                           ║
 * ║   ╚██████╔╝██║ ╚████║██║██║     ██║███████╗██████╔╝                                           ║
 * ║    ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝     ╚═╝╚══════╝╚═════╝                                            ║
 * ║                                                                                               ║
 * ║    ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗ ██╗ █████╗ ███╗   ██╗                             ║
 * ║   ██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗██║██╔══██╗████╗  ██║                             ║
 * ║   ██║  ███╗██║   ██║███████║██████╔╝██║  ██║██║███████║██╔██╗ ██║                             ║
 * ║   ██║   ██║██║   ██║██╔══██║██╔══██╗██║  ██║██║██╔══██║██║╚██╗██║                             ║
 * ║   ╚██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝██║██║  ██║██║ ╚████║                             ║
 * ║    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝                             ║
 * ║                                                                                               ║
 * ║   ЕДИНЕН ПАЗИТЕЛ - ВСИЧКИ МОДУЛИ, ЕДИН ОРГАНИЗЪМ                                              ║
 * ║                                                                                               ║
 * ║   Свързва:                                                                                    ║
 * ║   • SovereignMagnet - Gravity well за код                                                     ║
 * ║   • EcosystemSyncValidator - Валидация                                                        ║
 * ║   • EcosystemHarmonizer - Хармонизация                                                        ║
 * ║   • CrossProjectSynergy - Синергия                                                            ║
 * ║   • SovereignAudit - Одит                                                                     ║
 * ║   • HealthMonitor - Здраве                                                                    ║
 * ║   • VectorSync - Вектори                                                                      ║
 * ║                                                                                               ║
 * ║   "994,517 реда код. Един организъм. Една воля. Една цел."                                    ║
 * ║                                                                                               ║
 * ║   Created: 2026-01-02 | QAntum Empire - ABSOLUTE SOVEREIGNTY                                  ║
 * ╚═══════════════════════════════════════════════════════════════════════════════════════════════╝
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const EMPIRE_CONFIG = {
  repos: [
    { name: 'MrMindQATool', path: 'C:\\MrMindQATool', role: 'shield', emoji: '🛡️' },
    { name: 'MisteMind', path: 'C:\\MisteMind', role: 'core', emoji: '🧠' },
    { name: 'MisterMindPage', path: 'C:\\MisterMindPage', role: 'voice', emoji: '🌐' }
  ],
  dataPath: 'C:\\MisteMind\\data',
  logPath: 'C:\\MisteMind\\data\\unified-guardian.json',
  healingPath: 'C:\\MisteMind\\data\\guardian-healing.json',
  checkInterval: 10000,  // 10 seconds
  ignoreDirs: ['node_modules', '.git', '.venv', 'dist', 'dist-forge', 'dist-protected', 'coverage']
};

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE REGISTRY - All intelligence modules
// ═══════════════════════════════════════════════════════════════════════════════

const INTELLIGENCE_MODULES = {
  // Core Intelligence (MisteMind/src/intelligence)
  'EcosystemSyncValidator': {
    path: 'C:\\MisteMind\\src\\intelligence\\EcosystemSyncValidator.ts',
    purpose: 'Validates sync across all repos',
    methods: ['runFullScan', 'validateDependencies']
  },
  'EcosystemHarmonizer': {
    path: 'C:\\MisteMind\\src\\intelligence\\EcosystemHarmonizer.ts',
    purpose: 'Auto-aligns dependency versions',
    methods: ['harmonize', 'createSharedTypes']
  },
  'CrossProjectSynergy': {
    path: 'C:\\MisteMind\\src\\intelligence\\CrossProjectSynergy.ts',
    purpose: 'Тризъбецът на властта - cross-repo sync',
    methods: ['activate', 'syncAll']
  },
  'SovereignAudit': {
    path: 'C:\\MisteMind\\src\\intelligence\\SovereignAudit.ts',
    purpose: 'Scans 1M+ lines for anomalies',
    methods: ['fullAudit', 'quickScan']
  },
  'HealthMonitor': {
    path: 'C:\\MisteMind\\src\\intelligence\\HealthMonitor.ts',
    purpose: 'Real-time health monitoring',
    methods: ['checkHealth', 'getMetrics']
  },
  'VectorSync': {
    path: 'C:\\MisteMind\\src\\intelligence\\VectorSync.ts',
    purpose: 'Vector synchronization',
    methods: ['sync', 'validate']
  },
  
  // Omega Layer (MisteMind/src/omega)
  'SovereignMagnet': {
    path: 'C:\\MisteMind\\src\\omega\\SovereignMagnet.ts',
    purpose: 'Gravity well for code - auto-heal & place',
    methods: ['activateField', 'inject']
  },
  
  // Scripts
  'nucleus-mapper': {
    path: 'C:\\MisteMind\\scripts\\nucleus-mapper.js',
    purpose: 'Mathematical module connectivity analysis',
    methods: ['scan', 'report']
  },
  'eternal-guardian': {
    path: 'C:\\MisteMind\\scripts\\eternal-guardian.js',
    purpose: 'Self-healing ecosystem guardian',
    methods: ['runOnce', 'watch']
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED HEALING MEMORY
// ═══════════════════════════════════════════════════════════════════════════════

class UnifiedMemory {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(EMPIRE_CONFIG.healingPath)) {
        return JSON.parse(fs.readFileSync(EMPIRE_CONFIG.healingPath, 'utf-8'));
      }
    } catch (e) { /* ignore */ }
    
    return {
      created: new Date().toISOString(),
      sessions: [],
      patterns: {},
      fixes: [],
      preventions: [],
      learnings: [],
      stats: {
        totalChecks: 0,
        totalFixes: 0,
        totalPreventions: 0,
        uptime: 0
      }
    };
  }

  save() {
    const dir = path.dirname(EMPIRE_CONFIG.healingPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(EMPIRE_CONFIG.healingPath, JSON.stringify(this.data, null, 2));
  }

  recordSession(session) {
    this.data.sessions.push(session);
    if (this.data.sessions.length > 100) {
      this.data.sessions = this.data.sessions.slice(-100);
    }
    this.save();
  }

  recordFix(fix) {
    this.data.fixes.push(fix);
    this.data.stats.totalFixes++;
    this.learnFromFix(fix);
    this.save();
  }

  learnFromFix(fix) {
    const pattern = `${fix.type}:${fix.category}`;
    if (!this.data.patterns[pattern]) {
      this.data.patterns[pattern] = { count: 0, solutions: [] };
    }
    this.data.patterns[pattern].count++;
    this.data.patterns[pattern].solutions.push(fix.solution);
    
    // Keep only unique solutions
    this.data.patterns[pattern].solutions = [...new Set(this.data.patterns[pattern].solutions)];
  }

  getSolution(type, category) {
    const pattern = `${type}:${category}`;
    if (this.data.patterns[pattern] && this.data.patterns[pattern].solutions.length > 0) {
      return {
        found: true,
        solution: this.data.patterns[pattern].solutions[0],
        confidence: this.data.patterns[pattern].count / this.data.stats.totalFixes
      };
    }
    return { found: false };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE HEALTH CHECKER
// ═══════════════════════════════════════════════════════════════════════════════

class ModuleHealthChecker {
  constructor(memory) {
    this.memory = memory;
  }

  async checkAllModules() {
    const results = {
      healthy: [],
      missing: [],
      errors: [],
      orphans: []
    };

    for (const [name, config] of Object.entries(INTELLIGENCE_MODULES)) {
      const status = this.checkModule(name, config);
      
      if (status.exists && status.valid) {
        results.healthy.push({ name, ...status });
      } else if (!status.exists) {
        results.missing.push({ name, path: config.path });
      } else {
        results.errors.push({ name, ...status });
      }
    }

    return results;
  }

  checkModule(name, config) {
    const result = {
      exists: false,
      valid: false,
      size: 0,
      exports: [],
      imports: [],
      errors: []
    };

    if (!fs.existsSync(config.path)) {
      return result;
    }

    result.exists = true;
    
    try {
      const content = fs.readFileSync(config.path, 'utf-8');
      result.size = content.length;
      
      // Extract exports
      const exportMatches = content.match(/export\s+(class|function|const|interface)\s+(\w+)/g) || [];
      result.exports = exportMatches.map(m => m.split(/\s+/).pop());
      
      // Extract imports
      const importMatches = content.match(/import\s+.*\s+from\s+['"]([^'"]+)['"]/g) || [];
      result.imports = importMatches.map(m => {
        const match = m.match(/from\s+['"]([^'"]+)['"]/);
        return match ? match[1] : '';
      }).filter(Boolean);
      
      // Check for syntax errors (basic) - skip template literals and strings
      const cleanContent = content
        .replace(/`[^`]*`/gs, '')  // Remove template literals
        .replace(/'[^']*'/g, '')   // Remove single-quoted strings
        .replace(/"[^"]*"/g, '')   // Remove double-quoted strings
        .replace(/\/\/.*$/gm, '')  // Remove line comments
        .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove block comments
      
      const opens = (cleanContent.match(/{/g) || []).length;
      const closes = (cleanContent.match(/}/g) || []).length;
      
      // Allow small tolerance (2) for complex code
      if (Math.abs(opens - closes) > 2) {
        result.errors.push(`Unbalanced braces (${opens} opens, ${closes} closes)`);
      }
      
      result.valid = result.errors.length === 0;
      
    } catch (e) {
      result.errors.push(e.message);
    }

    return result;
  }

  checkConnections() {
    // Check if modules are connected (importing each other)
    const connections = new Map();
    
    for (const [name, config] of Object.entries(INTELLIGENCE_MODULES)) {
      if (!fs.existsSync(config.path)) continue;
      
      try {
        const content = fs.readFileSync(config.path, 'utf-8');
        const imports = [];
        
        // Find imports of other intelligence modules
        for (const otherName of Object.keys(INTELLIGENCE_MODULES)) {
          if (otherName !== name) {
            if (content.includes(otherName)) {
              imports.push(otherName);
            }
          }
        }
        
        connections.set(name, imports);
      } catch (e) { /* skip */ }
    }

    return connections;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ECOSYSTEM SCANNER
// ═══════════════════════════════════════════════════════════════════════════════

class EcosystemScanner {
  async scan() {
    const stats = {
      repos: [],
      totalFiles: 0,
      totalLines: 0,
      totalModules: 0,
      byExtension: {},
      byRepo: {}
    };

    for (const repo of EMPIRE_CONFIG.repos) {
      if (!fs.existsSync(repo.path)) continue;
      
      const repoStats = this.scanRepo(repo);
      stats.repos.push(repoStats);
      stats.totalFiles += repoStats.files;
      stats.totalLines += repoStats.lines;
      stats.totalModules += repoStats.modules;
      
      for (const [ext, count] of Object.entries(repoStats.byExtension)) {
        stats.byExtension[ext] = (stats.byExtension[ext] || 0) + count;
      }
    }

    return stats;
  }

  scanRepo(repo) {
    const stats = {
      name: repo.name,
      role: repo.role,
      emoji: repo.emoji,
      files: 0,
      lines: 0,
      modules: 0,
      byExtension: {}
    };

    const scanDir = (dir) => {
      try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          if (EMPIRE_CONFIG.ignoreDirs.includes(item)) continue;
          
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            scanDir(fullPath);
          } else {
            const ext = path.extname(item);
            stats.files++;
            stats.byExtension[ext] = (stats.byExtension[ext] || 0) + 1;
            
            if (['.ts', '.js', '.tsx', '.jsx'].includes(ext)) {
              stats.modules++;
              try {
                const content = fs.readFileSync(fullPath, 'utf-8');
                stats.lines += content.split('\n').length;
              } catch (e) { /* skip */ }
            }
          }
        }
      } catch (e) { /* skip */ }
    };

    scanDir(repo.path);
    return stats;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED GUARDIAN - The Orchestrator
// ═══════════════════════════════════════════════════════════════════════════════

class UnifiedGuardian extends EventEmitter {
  constructor() {
    super();
    this.memory = new UnifiedMemory();
    this.healthChecker = new ModuleHealthChecker(this.memory);
    this.scanner = new EcosystemScanner();
    this.isRunning = false;
    this.sessionId = Date.now().toString(36);
    this.stats = {
      startTime: null,
      checks: 0,
      fixes: 0,
      lastCheck: null
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STARTUP
  // ═══════════════════════════════════════════════════════════════════════════

  async start() {
    this.printBanner();
    
    this.isRunning = true;
    this.stats.startTime = new Date();
    
    console.log('🔱 Unified Guardian activated at', this.stats.startTime.toISOString());
    console.log(`📊 Session ID: ${this.sessionId}`);
    console.log('');
    
    // Initial full check
    await this.performFullCheck();
    
    // Start monitoring loop
    this.monitorLoop();
  }

  printBanner() {
    console.log('\n╔═══════════════════════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                                               ║');
    console.log('║   ██╗   ██╗███╗   ██╗██╗███████╗██╗███████╗██████╗                                            ║');
    console.log('║   ██║   ██║████╗  ██║██║██╔════╝██║██╔════╝██╔══██╗                                           ║');
    console.log('║   ██║   ██║██╔██╗ ██║██║█████╗  ██║█████╗  ██║  ██║                                           ║');
    console.log('║   ██║   ██║██║╚██╗██║██║██╔══╝  ██║██╔══╝  ██║  ██║                                           ║');
    console.log('║   ╚██████╔╝██║ ╚████║██║██║     ██║███████╗██████╔╝                                           ║');
    console.log('║    ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝     ╚═╝╚══════╝╚═════╝                                            ║');
    console.log('║                                                                                               ║');
    console.log('║    ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗ ██╗ █████╗ ███╗   ██╗                             ║');
    console.log('║   ██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗██║██╔══██╗████╗  ██║                             ║');
    console.log('║   ██║  ███╗██║   ██║███████║██████╔╝██║  ██║██║███████║██╔██╗ ██║                             ║');
    console.log('║   ██║   ██║██║   ██║██╔══██║██╔══██╗██║  ██║██║██╔══██║██║╚██╗██║                             ║');
    console.log('║   ╚██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝██║██║  ██║██║ ╚████║                             ║');
    console.log('║    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝                             ║');
    console.log('║                                                                                               ║');
    console.log('║   🛡️  ЕДИНЕН ПАЗИТЕЛ - ВСИЧКИ МОДУЛИ СВЪРЗАНИ ЗАВИНАГИ  🛡️                                   ║');
    console.log('║                                                                                               ║');
    console.log('║   "994,517 реда код. Един организъм. Една воля. Една цел."                                    ║');
    console.log('║                                                                                               ║');
    console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════════╝\n');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MONITORING LOOP
  // ═══════════════════════════════════════════════════════════════════════════

  async monitorLoop() {
    while (this.isRunning) {
      await this.sleep(EMPIRE_CONFIG.checkInterval);
      await this.performQuickCheck();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HEALTH CHECKS
  // ═══════════════════════════════════════════════════════════════════════════

  async performFullCheck() {
    console.log('═══════════════════════════════════════════════════════════════════════════════');
    console.log('                    🔬 FULL ECOSYSTEM SCAN 🔬');
    console.log('═══════════════════════════════════════════════════════════════════════════════\n');
    
    this.stats.checks++;
    this.stats.lastCheck = new Date();
    
    // 1. Scan ecosystem
    console.log('📊 Scanning ecosystem...');
    const ecosystemStats = await this.scanner.scan();
    
    console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
    console.log('│                         ECOSYSTEM STATISTICS                               │');
    console.log('├─────────────────────────────────────────────────────────────────────────────┤');
    
    for (const repo of ecosystemStats.repos) {
      console.log(`│  ${repo.emoji} ${repo.name.padEnd(20)} │ ${repo.files.toString().padStart(6)} files │ ${repo.lines.toLocaleString().padStart(10)} lines │`);
    }
    
    console.log('├─────────────────────────────────────────────────────────────────────────────┤');
    console.log(`│  📁 Total Files: ${ecosystemStats.totalFiles.toLocaleString().padEnd(10)} │ 📝 Total Lines: ${ecosystemStats.totalLines.toLocaleString().padEnd(15)}│`);
    console.log(`│  🧩 Total Modules: ${ecosystemStats.totalModules.toLocaleString().padEnd(58)}│`);
    console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');
    
    // 2. Check intelligence modules
    console.log('🧠 Checking intelligence modules...\n');
    const moduleHealth = await this.healthChecker.checkAllModules();
    
    console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
    console.log('│                       INTELLIGENCE MODULES STATUS                          │');
    console.log('├─────────────────────────────────────────────────────────────────────────────┤');
    
    for (const mod of moduleHealth.healthy) {
      console.log(`│  ✅ ${mod.name.padEnd(30)} │ ${(mod.size / 1024).toFixed(1).padStart(6)} KB │ ${mod.exports.length.toString().padStart(3)} exports │`);
    }
    
    for (const mod of moduleHealth.missing) {
      console.log(`│  ❌ ${mod.name.padEnd(30)} │ MISSING                              │`);
    }
    
    for (const mod of moduleHealth.errors) {
      console.log(`│  ⚠️  ${mod.name.padEnd(30)} │ ${mod.errors[0]?.substring(0, 30) || 'Error'}   │`);
    }
    
    console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');
    
    // 3. Check module connections
    console.log('🔗 Analyzing module connections...\n');
    const connections = this.healthChecker.checkConnections();
    
    console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
    console.log('│                         MODULE CONNECTIONS                                 │');
    console.log('├─────────────────────────────────────────────────────────────────────────────┤');
    
    connections.forEach((imports, moduleName) => {
      if (imports.length > 0) {
        console.log(`│  ${moduleName.padEnd(25)} → ${imports.join(', ').substring(0, 40).padEnd(42)}│`);
      }
    });
    
    console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');
    
    // 4. Calculate health score
    const healthScore = this.calculateHealthScore(moduleHealth, connections);
    
    console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
    console.log('│                           HEALTH SCORE                                     │');
    console.log('├─────────────────────────────────────────────────────────────────────────────┤');
    
    const healthBar = this.createProgressBar(healthScore, 50);
    const healthEmoji = healthScore >= 90 ? '🟢' : healthScore >= 70 ? '🟡' : healthScore >= 50 ? '🟠' : '🔴';
    
    console.log(`│  ${healthEmoji} ${healthBar} ${healthScore}/100   │`);
    console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');
    
    // Save session
    this.memory.recordSession({
      id: this.sessionId,
      timestamp: new Date().toISOString(),
      ecosystemStats,
      moduleHealth: {
        healthy: moduleHealth.healthy.length,
        missing: moduleHealth.missing.length,
        errors: moduleHealth.errors.length
      },
      healthScore
    });
    
    return { ecosystemStats, moduleHealth, connections, healthScore };
  }

  async performQuickCheck() {
    this.stats.checks++;
    this.stats.lastCheck = new Date();
    
    // Quick module health check
    const moduleHealth = await this.healthChecker.checkAllModules();
    
    const issues = moduleHealth.missing.length + moduleHealth.errors.length;
    
    if (issues > 0) {
      console.log(`\n⚠️ Quick check #${this.stats.checks}: ${issues} issues detected`);
      
      for (const mod of moduleHealth.missing) {
        console.log(`   ❌ Missing: ${mod.name}`);
      }
      for (const mod of moduleHealth.errors) {
        console.log(`   ⚠️ Error: ${mod.name} - ${mod.errors[0]}`);
      }
    } else {
      process.stdout.write(`\r✅ Check #${this.stats.checks} - All ${moduleHealth.healthy.length} modules healthy`);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════

  calculateHealthScore(moduleHealth, connections) {
    let score = 100;
    
    // Deduct for missing modules
    score -= moduleHealth.missing.length * 10;
    
    // Deduct for errors
    score -= moduleHealth.errors.length * 5;
    
    // Bonus for connections
    let totalConnections = 0;
    connections.forEach(imports => {
      totalConnections += imports.length;
    });
    
    // Max 10 bonus points for well-connected modules
    const connectionBonus = Math.min(10, Math.floor(totalConnections / 2));
    score += connectionBonus;
    
    return Math.max(0, Math.min(100, score));
  }

  createProgressBar(value, width) {
    const filled = Math.floor((value / 100) * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SHUTDOWN
  // ═══════════════════════════════════════════════════════════════════════════

  stop() {
    this.isRunning = false;
    
    const runtime = Math.round((Date.now() - this.stats.startTime) / 1000);
    
    console.log('\n\n═══════════════════════════════════════════════════════════════════════════════');
    console.log('                         🛑 GUARDIAN SHUTDOWN 🛑');
    console.log('═══════════════════════════════════════════════════════════════════════════════\n');
    console.log(`   Total runtime: ${runtime}s`);
    console.log(`   Checks performed: ${this.stats.checks}`);
    console.log(`   Issues fixed: ${this.stats.fixes}`);
    console.log('\n═══════════════════════════════════════════════════════════════════════════════\n');
    
    this.memory.save();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SINGLE RUN
  // ═══════════════════════════════════════════════════════════════════════════

  async runOnce() {
    this.printBanner();
    return await this.performFullCheck();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════════════════════

const guardian = new UnifiedGuardian();

if (process.argv.includes('--watch')) {
  guardian.start();
  
  process.on('SIGINT', () => {
    guardian.stop();
    process.exit(0);
  });
} else {
  guardian.runOnce().then(result => {
    process.exit(result.healthScore >= 70 ? 0 : 1);
  });
}

module.exports = { UnifiedGuardian };
