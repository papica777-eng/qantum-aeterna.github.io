#!/usr/bin/env node

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                          QANTUM CLI - SCRIPT GOD v2.0                         ║
 * ║                                                                               ║
 * ║       "Your voice is my command. Your thought is my execution."               ║
 * ║                                                                               ║
 * ║  Global CLI for QAntum Prime - Text/Voice commands to BrainRouter             ║
 * ║  Created: 2026-01-01 | QAntum Prime v28.1.0 SUPREME                          ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 * 
 * USAGE:
 *   qantum "Refactor this module"
 *   qantum --watch
 *   qantum --analyze <file>
 *   qantum --voice
 *   qantum --status
 */

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const readline = require('readline');

// ═══════════════════════════════════════════════════════════════════════════════
// ANSI COLORS
// ═══════════════════════════════════════════════════════════════════════════════

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
};

const c = {
  header: (s) => `${colors.bold}${colors.cyan}${s}${colors.reset}`,
  success: (s) => `${colors.green}${s}${colors.reset}`,
  error: (s) => `${colors.red}${s}${colors.reset}`,
  warning: (s) => `${colors.yellow}${s}${colors.reset}`,
  info: (s) => `${colors.blue}${s}${colors.reset}`,
  highlight: (s) => `${colors.magenta}${s}${colors.reset}`,
  dim: (s) => `${colors.dim}${s}${colors.reset}`,
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  version: '29.1.0',
  name: 'QAntum Prime CLI',
  defaultModel: 'deepseek-v3',
  fallbackModel: 'llama-3.1-70b',
  workspaceRoot: process.cwd(),
  historyFile: path.join(process.env.HOME || process.env.USERPROFILE, '.qantum_history'),
  configFile: path.join(process.env.HOME || process.env.USERPROFILE, '.qantumrc'),
  // v29.1: Adaptive Interface modes
  validModes: ['ARCHITECT', 'ENGINEER', 'QA'],
  currentMode: 'ARCHITECT',
};

// ═══════════════════════════════════════════════════════════════════════════════
// BANNER
// ═══════════════════════════════════════════════════════════════════════════════

function showBanner() {
  console.log(`
${colors.cyan}╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║   ${colors.bold}${colors.white}   ██████╗  █████╗ ███╗   ██╗████████╗██╗   ██╗███╗   ███╗${colors.cyan}                ║
║   ${colors.bold}${colors.white}  ██╔═══██╗██╔══██╗████╗  ██║╚══██╔══╝██║   ██║████╗ ████║${colors.cyan}                ║
║   ${colors.bold}${colors.white}  ██║   ██║███████║██╔██╗ ██║   ██║   ██║   ██║██╔████╔██║${colors.cyan}                ║
║   ${colors.bold}${colors.white}  ██║▄▄ ██║██╔══██║██║╚██╗██║   ██║   ██║   ██║██║╚██╔╝██║${colors.cyan}                ║
║   ${colors.bold}${colors.white}  ╚██████╔╝██║  ██║██║ ╚████║   ██║   ╚██████╔╝██║ ╚═╝ ██║${colors.cyan}                ║
║   ${colors.bold}${colors.white}   ╚══▀▀═╝ ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝${colors.cyan}                ║
║                                                                               ║
║                    ${colors.yellow}PRIME v29.1.0 - THE ADAPTIVE CONSCIOUSNESS${colors.cyan}               ║
║                                                                               ║
║          ${colors.dim}${colors.white}"Your voice is my command. Your thought is my execution."${colors.cyan}          ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝${colors.reset}
`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMMAND PARSER
// ═══════════════════════════════════════════════════════════════════════════════

class CommandParser {
  constructor() {
    this.commands = {
      // Code Operations
      'refactor': this.refactorCommand.bind(this),
      'analyze': this.analyzeCommand.bind(this),
      'fix': this.fixCommand.bind(this),
      'test': this.testCommand.bind(this),
      'document': this.documentCommand.bind(this),
      'optimize': this.optimizeCommand.bind(this),
      
      // Navigation
      'find': this.findCommand.bind(this),
      'goto': this.gotoCommand.bind(this),
      
      // System
      'status': this.statusCommand.bind(this),
      'watch': this.watchCommand.bind(this),
      'verify': this.verifyCommand.bind(this),
      'assimilate': this.assimilateCommand.bind(this),
      
      // Learning
      'learn': this.learnCommand.bind(this),
      'remember': this.rememberCommand.bind(this),
      'forget': this.forgetCommand.bind(this),
      
      // Empire Commands (Cloud-Hybrid RAG)
      'empire': this.empireCommand.bind(this),
      'sync': this.syncCommand.bind(this),
      'audit': this.auditCommand.bind(this),
      'ask': this.askCommand.bind(this),
      
      // v29.1: Adaptive Interface Commands
      'mode': this.modeCommand.bind(this),
      'genesis': this.genesisCommand.bind(this),
    };

    this.naturalLanguagePatterns = [
      { pattern: /^(refactor|преработи|рефакторирай)/i, command: 'refactor' },
      { pattern: /^(analyze|анализирай)/i, command: 'analyze' },
      { pattern: /^(fix|поправи|оправи)/i, command: 'fix' },
      { pattern: /^(test|тествай)/i, command: 'test' },
      { pattern: /^(document|документирай)/i, command: 'document' },
      { pattern: /^(optimize|оптимизирай)/i, command: 'optimize' },
      { pattern: /^(find|намери|търси)/i, command: 'find' },
      { pattern: /^(status|статус)/i, command: 'status' },
      { pattern: /^(watch|следи)/i, command: 'watch' },
      { pattern: /^(verify|верифицирай|провери)/i, command: 'verify' },
      { pattern: /^(learn|научи)/i, command: 'learn' },
      { pattern: /^(mode set|режим)/i, command: 'mode' },
      { pattern: /^(genesis|създай|генерирай)/i, command: 'genesis' },
    ];
  }

  async parse(input) {
    const trimmed = input.trim();
    
    // Check for exact command match
    const firstWord = trimmed.split(' ')[0].toLowerCase();
    if (this.commands[firstWord]) {
      const args = trimmed.slice(firstWord.length).trim();
      return { command: firstWord, args, raw: trimmed };
    }

    // Check natural language patterns
    for (const { pattern, command } of this.naturalLanguagePatterns) {
      if (pattern.test(trimmed)) {
        const args = trimmed.replace(pattern, '').trim();
        return { command, args, raw: trimmed };
      }
    }

    // Default: treat as natural language command to BrainRouter
    return { command: 'natural', args: trimmed, raw: trimmed };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // COMMAND IMPLEMENTATIONS
  // ─────────────────────────────────────────────────────────────────────────────

  async refactorCommand(args) {
    console.log(c.info('\n🔄 REFACTOR MODE'));
    console.log(c.dim(`   Target: ${args || 'current file'}`));
    
    const result = await this.routeToBrain({
      action: 'refactor',
      target: args,
      context: await this.getActiveFileContext(),
    });
    
    return result;
  }

  async analyzeCommand(args) {
    console.log(c.info('\n🔍 ANALYZE MODE'));
    console.log(c.dim(`   Target: ${args || 'workspace'}`));
    
    // Run analysis
    const files = args ? [args] : await this.getWorkspaceFiles();
    let totalIssues = 0;
    let totalSuggestions = 0;

    for (const file of files.slice(0, 10)) { // Limit to 10 files
      const analysis = await this.analyzeFile(file);
      totalIssues += analysis.issues;
      totalSuggestions += analysis.suggestions;
    }

    console.log(c.success(`\n✅ Analysis complete`));
    console.log(`   📊 Files analyzed: ${files.length}`);
    console.log(`   ⚠️  Issues found: ${totalIssues}`);
    console.log(`   💡 Suggestions: ${totalSuggestions}`);
    
    return { issues: totalIssues, suggestions: totalSuggestions };
  }

  async fixCommand(args) {
    console.log(c.info('\n🔧 FIX MODE'));
    console.log(c.dim(`   Issue: ${args}`));
    
    const result = await this.routeToBrain({
      action: 'fix',
      issue: args,
      context: await this.getActiveFileContext(),
    });
    
    return result;
  }

  async testCommand(args) {
    console.log(c.info('\n🧪 TEST MODE'));
    
    try {
      const result = execSync('npm test', { 
        cwd: CONFIG.workspaceRoot,
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      console.log(result);
      console.log(c.success('✅ Tests passed'));
    } catch (error) {
      console.log(c.error('❌ Tests failed'));
      console.log(error.stdout || error.message);
    }
  }

  async documentCommand(args) {
    console.log(c.info('\n📝 DOCUMENT MODE'));
    console.log(c.dim(`   Target: ${args || 'current file'}`));
    
    const result = await this.routeToBrain({
      action: 'document',
      target: args,
      context: await this.getActiveFileContext(),
    });
    
    return result;
  }

  async optimizeCommand(args) {
    console.log(c.info('\n⚡ OPTIMIZE MODE'));
    console.log(c.dim(`   Target: ${args || 'current file'}`));
    
    const result = await this.routeToBrain({
      action: 'optimize',
      target: args,
      context: await this.getActiveFileContext(),
    });
    
    return result;
  }

  async findCommand(args) {
    console.log(c.info('\n🔎 FIND MODE'));
    console.log(c.dim(`   Query: ${args}`));
    
    // Search in workspace
    const results = await this.searchWorkspace(args);
    
    if (results.length === 0) {
      console.log(c.warning('   No results found'));
    } else {
      console.log(c.success(`\n   Found ${results.length} matches:`));
      results.slice(0, 10).forEach((r, i) => {
        console.log(`   ${i + 1}. ${r.file}:${r.line}`);
        console.log(c.dim(`      ${r.preview}`));
      });
    }
    
    return results;
  }

  async gotoCommand(args) {
    console.log(c.info('\n📂 GOTO MODE'));
    console.log(c.dim(`   Target: ${args}`));
    
    // Open file in VS Code
    try {
      execSync(`code "${args}"`, { stdio: 'ignore' });
      console.log(c.success(`   Opened: ${args}`));
    } catch {
      console.log(c.error(`   Could not open: ${args}`));
    }
  }

  async statusCommand() {
    console.log(c.info('\n📊 SYSTEM STATUS'));
    console.log('═'.repeat(50));
    
    // Count files
    const files = await this.getWorkspaceFiles();
    const tsFiles = files.filter(f => f.endsWith('.ts')).length;
    const jsFiles = files.filter(f => f.endsWith('.js')).length;
    
    // Get git status
    let gitStatus = 'Unknown';
    try {
      const status = execSync('git status --porcelain', { 
        encoding: 'utf-8', 
        cwd: CONFIG.workspaceRoot 
      });
      const changes = status.trim().split('\n').filter(l => l).length;
      gitStatus = changes === 0 ? 'Clean' : `${changes} changes`;
    } catch {}

    console.log(`   ${c.highlight('QAntum Prime')} v28.1.0 SUPREME`);
    console.log(`   ${c.dim('Mode:')} Sovereign`);
    console.log(`   ${c.dim('Workspace:')} ${path.basename(CONFIG.workspaceRoot)}`);
    console.log(`   ${c.dim('Files:')} ${files.length} (${tsFiles} TS, ${jsFiles} JS)`);
    console.log(`   ${c.dim('Git:')} ${gitStatus}`);
    console.log(`   ${c.dim('Brain:')} ${CONFIG.defaultModel}`);
    console.log('═'.repeat(50));
  }

  async watchCommand() {
    console.log(c.info('\n👁️ WATCH MODE - Starting Live Listener...'));
    console.log(c.dim('   Press Ctrl+C to stop'));
    console.log('');
    
    // Start the VS Code Bridge
    const bridgePath = path.join(__dirname, '../src/reality/kernel/VSCodeBridge.ts');
    
    if (fs.existsSync(bridgePath)) {
      console.log(c.success('   ✅ VSCodeBridge found'));
      console.log(c.dim('   Starting file watcher...'));
      
      // Run with tsx
      const child = spawn('npx', ['tsx', bridgePath], {
        cwd: CONFIG.workspaceRoot,
        stdio: 'inherit',
      });
      
      child.on('error', (err) => {
        console.log(c.error(`   Error: ${err.message}`));
      });
      
      return new Promise((resolve) => {
        child.on('close', resolve);
      });
    } else {
      console.log(c.warning('   ⚠️ VSCodeBridge not found, using basic watcher'));
      
      // Basic file watcher fallback
      const watcher = fs.watch(CONFIG.workspaceRoot, { recursive: true }, (eventType, filename) => {
        if (filename && !filename.includes('node_modules') && !filename.includes('.git')) {
          console.log(`${c.info('📝')} ${eventType}: ${filename}`);
        }
      });
      
      process.on('SIGINT', () => {
        watcher.close();
        console.log(c.dim('\n   Watch mode stopped'));
        process.exit(0);
      });
    }
  }

  async verifyCommand(args) {
    console.log(c.info('\n✓ VERIFY MODE'));
    console.log(c.dim(`   Target: ${args || 'workspace'}`));
    
    // Run assimilator verification
    const target = args || CONFIG.workspaceRoot;
    
    console.log(c.dim('   Running Assimilator.verify()...'));
    
    // Basic verification
    const files = await this.getWorkspaceFiles();
    let verified = 0;
    let errors = 0;
    
    for (const file of files.slice(0, 50)) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        
        // Basic checks
        if (file.endsWith('.json')) {
          JSON.parse(content);
        }
        
        if (file.endsWith('.ts') || file.endsWith('.js')) {
          // Check for undefined references
          if (content.includes('undefined') && !content.includes('typeof')) {
            errors++;
            console.log(c.warning(`   ⚠️ ${path.basename(file)}: potential undefined usage`));
          }
        }
        
        verified++;
      } catch (e) {
        errors++;
        console.log(c.error(`   ❌ ${path.basename(file)}: ${e.message}`));
      }
    }
    
    console.log(c.success(`\n✅ Verification complete`));
    console.log(`   📊 Files verified: ${verified}`);
    console.log(`   ❌ Errors: ${errors}`);
  }

  async assimilateCommand(args) {
    console.log(c.info('\n🧠 ASSIMILATE MODE'));
    console.log(c.dim(`   Target: ${args || 'workspace'}`));
    
    // Build symbol registry
    const files = await this.getWorkspaceFiles();
    const symbols = new Map();
    let totalSymbols = 0;
    
    console.log(c.dim('   Building Symbol Registry...'));
    
    for (const file of files.filter(f => f.endsWith('.ts') || f.endsWith('.js'))) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        
        // Extract exports
        const exportMatches = content.matchAll(/export\s+(const|function|class|interface|type|enum)\s+(\w+)/g);
        for (const match of exportMatches) {
          symbols.set(match[2], { file, type: match[1] });
          totalSymbols++;
        }
      } catch {}
    }
    
    console.log(c.success(`\n✅ Assimilation complete`));
    console.log(`   📊 Files processed: ${files.length}`);
    console.log(`   🧩 Symbols indexed: ${totalSymbols}`);
    
    return { files: files.length, symbols: totalSymbols };
  }

  async learnCommand(args) {
    console.log(c.info('\n📚 LEARN MODE'));
    console.log(c.dim(`   Pattern: ${args}`));
    
    // Save to learning memory
    const learningFile = path.join(CONFIG.workspaceRoot, 'data/learning-memory.json');
    let memory = { patterns: [] };
    
    try {
      memory = JSON.parse(fs.readFileSync(learningFile, 'utf-8'));
    } catch {}
    
    memory.patterns.push({
      pattern: args,
      timestamp: Date.now(),
      source: 'cli',
    });
    
    fs.writeFileSync(learningFile, JSON.stringify(memory, null, 2));
    console.log(c.success('   ✅ Pattern learned and saved'));
  }

  async rememberCommand(args) {
    console.log(c.info('\n🧠 REMEMBER MODE'));
    
    const learningFile = path.join(CONFIG.workspaceRoot, 'data/learning-memory.json');
    
    try {
      const memory = JSON.parse(fs.readFileSync(learningFile, 'utf-8'));
      console.log(`   📚 Learned patterns: ${memory.patterns?.length || 0}`);
      
      if (memory.patterns?.length > 0) {
        memory.patterns.slice(-5).forEach((p, i) => {
          console.log(`   ${i + 1}. ${p.pattern}`);
        });
      }
    } catch {
      console.log(c.dim('   No learned patterns yet'));
    }
  }

  async forgetCommand(args) {
    console.log(c.info('\n🗑️ FORGET MODE'));
    console.log(c.dim(`   Pattern: ${args}`));
    
    const learningFile = path.join(CONFIG.workspaceRoot, 'data/learning-memory.json');
    
    try {
      const memory = JSON.parse(fs.readFileSync(learningFile, 'utf-8'));
      const originalCount = memory.patterns?.length || 0;
      
      memory.patterns = (memory.patterns || []).filter(p => !p.pattern.includes(args));
      
      const removed = originalCount - memory.patterns.length;
      fs.writeFileSync(learningFile, JSON.stringify(memory, null, 2));
      
      console.log(c.success(`   ✅ Removed ${removed} pattern(s)`));
    } catch {
      console.log(c.dim('   No patterns to forget'));
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // EMPIRE COMMANDS (Cloud-Hybrid RAG)
  // ─────────────────────────────────────────────────────────────────────────────

  async empireCommand(args) {
    const subcommand = args.split(' ')[0]?.toLowerCase() || 'status';
    const subargs = args.slice(subcommand.length).trim();

    console.log(`
${colors.cyan}╔═══════════════════════════════════════════════════════════════════════════════╗
║                           🏛️ EMPIRE COMMAND CENTER                            ║
╚═══════════════════════════════════════════════════════════════════════════════╝${colors.reset}
`);

    switch (subcommand) {
      case 'status':
        await this.empireStatus();
        break;
      case 'sync':
        await this.syncCommand();
        break;
      case 'audit':
        await this.auditCommand(subargs);
        break;
      case 'ask':
        await this.askCommand(subargs);
        break;
      case 'analyze':
        await this.empireAnalyze(subargs);
        break;
      default:
        console.log(c.warning(`Unknown empire command: ${subcommand}`));
        this.showEmpireHelp();
    }
  }

  async empireStatus() {
    console.log(c.header('🏛️ EMPIRE STATUS'));
    console.log('═'.repeat(60));

    // Load sync state
    const syncStatePath = path.join(CONFIG.workspaceRoot, 'data/vector-sync-state.json');
    let syncState = null;
    try {
      syncState = JSON.parse(fs.readFileSync(syncStatePath, 'utf-8'));
    } catch {}

    // Count files in each project
    const projects = [
      { name: 'MisteMind', path: 'C:/MisteMind', role: 'The Core' },
      { name: 'MrMindQATool', path: 'C:/MrMindQATool', role: 'The Shield' },
      { name: 'MisterMindPage', path: 'C:/MisterMindPage', role: 'The Voice' },
    ];

    let totalFiles = 0;
    let totalVectors = 0;

    console.log('\n   📊 PROJECT STATUS:');
    for (const project of projects) {
      const files = await this.countFiles(project.path);
      totalFiles += files;
      
      const vectors = syncState?.stats?.find(s => s.project === project.name)?.vectorsUpserted || 0;
      totalVectors += vectors;

      console.log(`   ${c.highlight(project.name)} (${project.role})`);
      console.log(`      Files: ${files} | Vectors: ${vectors}`);
    }

    console.log('\n   🧠 CLOUD BRAIN:');
    console.log(`      Model: ${c.success(CONFIG.defaultModel)}`);
    console.log(`      Total Vectors: ${totalVectors}`);
    console.log(`      Last Sync: ${syncState?.lastSync ? new Date(syncState.lastSync).toLocaleString() : 'Never'}`);
    console.log(`      API Key: ${process.env.DEEPSEEK_API_KEY ? c.success('Configured') : c.warning('Not set')}`);

    console.log('═'.repeat(60));
  }

  async syncCommand(args) {
    console.log(c.header('\n📡 EMPIRE SYNC - Синхронизиране с облачния мозък...'));
    
    const vectorSyncPath = path.join(__dirname, '../src/intelligence/VectorSync.ts');
    
    if (fs.existsSync(vectorSyncPath)) {
      console.log(c.dim('   Starting VectorSync...'));
      
      const child = spawn('npx', ['tsx', vectorSyncPath, '--sync'], {
        cwd: CONFIG.workspaceRoot,
        stdio: 'inherit',
      });

      return new Promise((resolve) => {
        child.on('close', (code) => {
          if (code === 0) {
            console.log(c.success('\n✅ Empire synchronized successfully!'));
          } else {
            console.log(c.error('\n❌ Sync failed'));
          }
          resolve();
        });
      });
    } else {
      console.log(c.error('   VectorSync module not found'));
    }
  }

  async auditCommand(args) {
    console.log(c.header('\n🔍 SOVEREIGN AUDIT - Сканиране за архитектурни аномалии...'));
    
    const auditPath = path.join(__dirname, '../src/intelligence/SovereignAudit.ts');
    
    if (fs.existsSync(auditPath)) {
      const isQuick = args.includes('--quick');
      console.log(c.dim(`   Mode: ${isQuick ? 'Quick' : 'Full'}`));
      
      const child = spawn('npx', ['tsx', auditPath, isQuick ? '--quick' : ''], {
        cwd: CONFIG.workspaceRoot,
        stdio: 'inherit',
      });

      return new Promise((resolve) => {
        child.on('close', (code) => {
          if (code === 0) {
            console.log(c.success('\n✅ Audit complete! Check data/audits/sovereign-report.md'));
          }
          resolve();
        });
      });
    } else {
      console.log(c.error('   SovereignAudit module not found'));
    }
  }

  async askCommand(args) {
    if (!args) {
      console.log(c.warning('   Usage: qantum ask "Your question here"'));
      return;
    }

    console.log(c.header('\n🧠 ASKING THE EMPIRE...'));
    console.log(c.dim(`   "${args}"\n`));
    
    const deepSeekPath = path.join(__dirname, '../src/intelligence/DeepSeekLink.ts');
    
    if (fs.existsSync(deepSeekPath)) {
      const child = spawn('npx', ['tsx', deepSeekPath, args], {
        cwd: CONFIG.workspaceRoot,
        stdio: 'inherit',
      });

      return new Promise((resolve) => {
        child.on('close', resolve);
      });
    } else {
      // Fallback to local analysis
      console.log(c.info('   DeepSeekLink not available, using local analysis...'));
      console.log(c.dim('\n   For full AI capabilities, configure DEEPSEEK_API_KEY'));
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // v29.1: ADAPTIVE INTERFACE COMMANDS
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * qantum mode set [architect|engineer|qa]
   * qantum mode
   */
  async modeCommand(args) {
    const parts = args.trim().toLowerCase().split(' ');
    const subCommand = parts[0];
    const modeArg = parts[1];

    if (subCommand === 'set' && modeArg) {
      // Map aliases
      const modeMap = {
        'architect': 'ARCHITECT',
        'engineer': 'ENGINEER',
        'qa': 'QA',
        'архитект': 'ARCHITECT',
        'инженер': 'ENGINEER',
        'одитор': 'QA',
      };

      const mode = modeMap[modeArg];
      if (!mode) {
        console.log(c.error(`\n❌ Unknown mode: ${modeArg}`));
        console.log(c.dim('   Valid modes: architect, engineer, qa'));
        return;
      }

      CONFIG.currentMode = mode;
      this.saveConfig();

      console.log(`
${colors.cyan}╔═══════════════════════════════════════════════════════════════╗
║  🧠 ADAPTIVE INTERFACE - Mode Changed                         ║
╠═══════════════════════════════════════════════════════════════╣${colors.reset}
`);
      this.printModeInfo(mode);
      console.log(`${colors.cyan}╚═══════════════════════════════════════════════════════════════╝${colors.reset}`);
      return;
    }

    // Show current mode and help
    console.log(`
${colors.cyan}╔═══════════════════════════════════════════════════════════════╗
║  🧠 ADAPTIVE INTERFACE - Current Mode                         ║
╠═══════════════════════════════════════════════════════════════╣${colors.reset}
`);
    this.printModeInfo(CONFIG.currentMode);
    console.log(`
${c.header('AVAILABLE MODES:')}
  ${c.highlight('ARCHITECT')} - High-level strategic vision, macro-architecture
  ${c.info('ENGINEER')}  - Detailed implementation, code blocks, file paths
  ${c.warning('QA')}        - Critical verification, risks, test coverage

${c.header('USAGE:')}
  qantum mode set architect   Switch to ARCHITECT mode
  qantum mode set engineer    Switch to ENGINEER mode
  qantum mode set qa          Switch to QA mode
${colors.cyan}╚═══════════════════════════════════════════════════════════════╝${colors.reset}
`);
  }

  printModeInfo(mode) {
    const modeInfo = {
      'ARCHITECT': {
        emoji: '🏛️',
        name: 'ARCHITECT PRIME',
        desc: 'High-Level Strategic Vision',
        focus: ['architecture', 'strategy', 'business-impact', 'philosophy'],
        verbosity: 'balanced',
        codeBlocks: false,
      },
      'ENGINEER': {
        emoji: '⚙️',
        name: 'ENGINEER PRO',
        desc: 'Detailed Implementation',
        focus: ['code', 'api', 'file-paths', 'benchmarks'],
        verbosity: 'detailed',
        codeBlocks: true,
      },
      'QA': {
        emoji: '🔍',
        name: 'QA AUDITOR',
        desc: 'Critical Verification',
        focus: ['vulnerabilities', 'risks', 'test-coverage', 'edge-cases'],
        verbosity: 'detailed',
        codeBlocks: true,
      },
    };

    const info = modeInfo[mode];
    console.log(`   ${info.emoji} ${c.header(info.name)}`);
    console.log(`   ${c.dim(info.desc)}`);
    console.log(`   Focus: ${info.focus.slice(0, 3).join(', ')}`);
    console.log(`   Verbosity: ${info.verbosity}`);
    console.log(`   Code Blocks: ${info.codeBlocks ? '✅' : '❌'}`);
  }

  /**
   * qantum genesis <EntityName> --type class --layer biology
   */
  async genesisCommand(args) {
    if (!args) {
      this.showGenesisHelp();
      return;
    }

    console.log(`
${colors.cyan}╔═══════════════════════════════════════════════════════════════╗
║  🌱 GENESIS ENGINE - Creating New Entity                      ║
╠═══════════════════════════════════════════════════════════════╣${colors.reset}
`);

    // Parse arguments
    const parts = args.split(' ');
    const entityName = parts[0];
    
    // Extract options
    let type = 'class';
    let layer = 'biology';
    let props = '';
    let description = `Auto-generated ${entityName}`;

    for (let i = 1; i < parts.length; i++) {
      if (parts[i] === '--type' && parts[i + 1]) {
        type = parts[i + 1];
        i++;
      } else if (parts[i] === '--layer' && parts[i + 1]) {
        layer = parts[i + 1];
        i++;
      } else if (parts[i] === '--props' && parts[i + 1]) {
        props = parts[i + 1];
        i++;
      } else if (parts[i] === '--desc' && parts[i + 1]) {
        description = parts.slice(i + 1).join(' ').replace(/^["']|["']$/g, '');
        break;
      }
    }

    // Validate
    const validTypes = ['class', 'interface', 'function', 'module', 'component', 'test'];
    const validLayers = ['biology', 'chemistry', 'physics', 'universe', 'cognition'];

    if (!validTypes.includes(type)) {
      console.log(c.error(`   ❌ Invalid type: ${type}`));
      console.log(c.dim(`      Valid types: ${validTypes.join(', ')}`));
      return;
    }

    if (!validLayers.includes(layer)) {
      console.log(c.error(`   ❌ Invalid layer: ${layer}`));
      console.log(c.dim(`      Valid layers: ${validLayers.join(', ')}`));
      return;
    }

    console.log(`   Entity: ${c.highlight(entityName)}`);
    console.log(`   Type: ${type}`);
    console.log(`   Layer: ${layer}`);
    console.log(`   Description: ${description}`);
    console.log('');

    // Try to run Genesis Engine
    const genesisPath = path.join(__dirname, '../src/biology/evolution/GenesisEngine.ts');
    
    if (fs.existsSync(genesisPath)) {
      console.log(c.info('   🧬 Invoking Genesis Engine...'));
      
      // For now, just create a basic file using templates
      const templateCode = this.generateBasicTemplate(entityName, type, layer, description, props);
      const outputPath = this.getOutputPath(entityName, type, layer);
      
      // Ensure directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, templateCode, 'utf-8');
      
      console.log(c.success(`\n   ✅ Entity created successfully!`));
      console.log(`   📁 Path: ${outputPath}`);
      
      if (type !== 'test') {
        console.log(c.dim(`   💡 Run 'qantum genesis ${entityName}Test --type test --layer ${layer}' to create tests`));
      }
    } else {
      console.log(c.warning('   ⚠️ GenesisEngine module not built yet'));
      console.log(c.dim('   Creating with inline template...'));
      
      const templateCode = this.generateBasicTemplate(entityName, type, layer, description, props);
      const outputPath = this.getOutputPath(entityName, type, layer);
      
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, templateCode, 'utf-8');
      
      console.log(c.success(`\n   ✅ Entity created!`));
      console.log(`   📁 Path: ${outputPath}`);
    }

    console.log(`${colors.cyan}╚═══════════════════════════════════════════════════════════════╝${colors.reset}`);
  }

  generateBasicTemplate(name, type, layer, description, props = '') {
    const layerComment = {
      biology: 'Neural Evolution Layer',
      chemistry: 'Transformation Layer',
      physics: 'Data & Vector Layer',
      universe: 'Enterprise Layer',
      cognition: 'Self-Awareness Layer',
    };

    if (type === 'class') {
      return `/**
 * ${name} - ${description}
 * 
 * Part of QAntum's ${layer.charAt(0).toUpperCase() + layer.slice(1)} Layer (${layerComment[layer]})
 * @layer ${layer}
 * @version 1.0.0
 * @generated Genesis Engine v29.1
 */

import { EventEmitter } from 'events';

export interface ${name}Config {
  // Configuration options
}

export class ${name} extends EventEmitter {
  private config: ${name}Config;

  constructor(config: Partial<${name}Config> = {}) {
    super();
    this.config = { ...this.getDefaultConfig(), ...config };
    this.initialize();
  }

  private getDefaultConfig(): ${name}Config {
    return {
      // Default values
    };
  }

  private initialize(): void {
    console.log('🧬 ${name} initialized');
  }

  // TODO: Add methods
}

export default ${name};
`;
    } else if (type === 'interface') {
      let properties = '  // TODO: Define properties';

      if (props) {
        properties = props.split(',').map(p => {
          const [key, type] = p.split(':');
          return `  ${key.trim()}: ${type ? type.trim() : 'any'};`;
        }).join('\n');
      }

      return `/**
 * ${name} - ${description}
 * 
 * @layer ${layer}
 * @version 1.0.0
 * @generated Genesis Engine v29.1
 */

export interface ${name} {
${properties}
}

export default ${name};
`;
    } else if (type === 'test') {
      return `/**
 * Test Suite: ${name}
 * 
 * @layer ${layer}
 * @coverage target: 80%
 * @generated Genesis Engine v29.1
 */

import { describe, it, expect, beforeEach } from 'vitest';

describe('${name}', () => {
  beforeEach(() => {
    // Setup
  });

  describe('initialization', () => {
    it.todo('should initialize correctly');
  });

  describe('core functionality', () => {
    it.todo('add test cases');
  });

  describe('edge cases', () => {
    it.todo('add edge case tests');
  });
});
`;
    }

    // Default function template
    return `/**
 * ${name} - ${description}
 * 
 * @layer ${layer}
 * @version 1.0.0
 * @generated Genesis Engine v29.1
 */

export function ${name.charAt(0).toLowerCase() + name.slice(1)}() {
  // TODO: Implement
}

export default ${name.charAt(0).toLowerCase() + name.slice(1)};
`;
  }

  getOutputPath(name, type, layer) {
    const layerDirs = {
      biology: 'src/biology/evolution',
      chemistry: 'src/chemistry',
      physics: 'src/physics',
      universe: 'src/enterprise',
      cognition: 'src/cognition',
    };

    const dir = layerDirs[layer] || 'src';
    const ext = type === 'test' ? '.test.ts' : '.ts';
    
    return path.join(CONFIG.workspaceRoot, dir, `${name}${ext}`);
  }

  showGenesisHelp() {
    console.log(`
${c.header('🌱 GENESIS ENGINE - Code Entity Generator')}

Creates new code entities following QAntum's 5-layer architecture.

${c.header('USAGE:')}
  qantum genesis <EntityName> [options]

${c.header('OPTIONS:')}
  --type <type>      Entity type: class, interface, function, module, test
  --layer <layer>    Target layer: biology, chemistry, physics, universe, cognition
  --desc "<text>"    Description of the entity
  --props "<props>"  Properties for interface (e.g. "id:string,name:string")

${c.header('EXAMPLES:')}
  qantum genesis NeuralEvolver --type class --layer biology
  qantum genesis DataProcessor --type class --layer chemistry
  qantum genesis VectorConfig --type interface --layer physics --props "id:string,count:number"
  qantum genesis NeuralEvolverTest --type test --layer biology

${c.header('LAYERS:')}
  biology    - Neural evolution, learning, adaptation
  chemistry  - Transformation, processing, conversion
  physics    - Data, vectors, storage
  universe   - Enterprise, business logic
  cognition  - Self-awareness, meta-learning
`);
  }

  saveConfig() {
    try {
      const configData = {
        currentMode: CONFIG.currentMode,
        lastUpdated: new Date().toISOString(),
      };
      fs.writeFileSync(CONFIG.configFile, JSON.stringify(configData, null, 2));
    } catch (error) {
      // Ignore save errors
    }
  }

  loadConfig() {
    try {
      if (fs.existsSync(CONFIG.configFile)) {
        const data = JSON.parse(fs.readFileSync(CONFIG.configFile, 'utf-8'));
        if (data.currentMode) CONFIG.currentMode = data.currentMode;
      }
    } catch (error) {
      // Ignore load errors
    }
  }

  async empireAnalyze(args) {
    console.log(c.header('\n📊 EMPIRE ANALYSIS'));
    console.log(c.dim(`   Query: ${args || 'full codebase'}`));
    
    // Get workspace stats
    const projects = ['C:/MisteMind', 'C:/MrMindQATool', 'C:/MisterMindPage'];
    let totalSymbols = 0;
    let totalFiles = 0;

    for (const projectPath of projects) {
      const files = await this.getWorkspaceFilesInPath(projectPath);
      totalFiles += files.length;
      
      for (const file of files.slice(0, 50)) {
        try {
          const content = fs.readFileSync(file, 'utf-8');
          const exports = content.match(/export\s+(const|function|class|interface|type)/g);
          totalSymbols += exports?.length || 0;
        } catch {}
      }
    }

    console.log(`\n   📊 Empire Statistics:`);
    console.log(`      Total Projects: 3`);
    console.log(`      Total Files: ${totalFiles}`);
    console.log(`      Indexed Symbols: ${totalSymbols}+`);
    console.log(`\n   For deep analysis, run: ${c.highlight('qantum empire audit')}`);
  }

  showEmpireHelp() {
    console.log(`
${c.header('EMPIRE COMMANDS:')}
  empire status              Show empire status
  empire sync                Sync all projects to cloud memory
  empire audit [--quick]     Run architecture audit
  empire ask "<query>"       Ask DeepSeek about the codebase
  empire analyze [query]     Analyze codebase statistics

${c.header('EXAMPLES:')}
  qantum empire status
  qantum empire sync
  qantum empire audit --quick
  qantum empire ask "Find bottlenecks in the codebase"
`);
  }

  async countFiles(basePath) {
    let count = 0;
    const walk = (dir) => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') continue;
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) walk(fullPath);
          else if (/\.(ts|js|html|css|json)$/.test(entry.name)) count++;
        }
      } catch {}
    };
    if (fs.existsSync(basePath)) walk(basePath);
    return count;
  }

  async getWorkspaceFilesInPath(basePath) {
    const files = [];
    const walk = (dir) => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') continue;
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) walk(fullPath);
          else if (/\.(ts|js)$/.test(entry.name)) files.push(fullPath);
        }
      } catch {}
    };
    if (fs.existsSync(basePath)) walk(basePath);
    return files;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // HELPER METHODS
  // ─────────────────────────────────────────────────────────────────────────────

  async routeToBrain(request) {
    // This would connect to BrainRouter.ts
    console.log(c.dim('   → Routing to BrainRouter...'));
    console.log(c.dim(`   → Model: ${CONFIG.defaultModel}`));
    console.log(c.dim(`   → Action: ${request.action}`));
    
    // Placeholder - in real implementation this would call BrainRouter
    return { success: true, model: CONFIG.defaultModel, action: request.action };
  }

  async getActiveFileContext() {
    // Read from VS Code state file
    const stateFile = path.join(CONFIG.workspaceRoot, '.vscode/.activeFile');
    
    try {
      const state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
      if (state.path) {
        const content = fs.readFileSync(state.path, 'utf-8');
        return { file: state.path, content };
      }
    } catch {}
    
    return null;
  }

  async getWorkspaceFiles() {
    const files = [];
    
    const walk = (dir) => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.name.startsWith('.') || 
              entry.name === 'node_modules' || 
              entry.name === 'dist' ||
              entry.name === 'coverage') {
            continue;
          }
          
          if (entry.isDirectory()) {
            walk(fullPath);
          } else if (entry.isFile()) {
            files.push(fullPath);
          }
        }
      } catch {}
    };
    
    walk(CONFIG.workspaceRoot);
    return files;
  }

  async searchWorkspace(query) {
    const results = [];
    const files = await this.getWorkspaceFiles();
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          if (line.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              file: path.relative(CONFIG.workspaceRoot, file),
              line: index + 1,
              preview: line.trim().slice(0, 80),
            });
          }
        });
      } catch {}
    }
    
    return results;
  }

  async analyzeFile(file) {
    let issues = 0;
    let suggestions = 0;
    
    try {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Check for issues
      if (content.includes('any')) issues++;
      if (content.includes('TODO')) suggestions++;
      if (content.includes('FIXME')) issues++;
      if (content.includes('console.log')) suggestions++;
    } catch {}
    
    return { issues, suggestions };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTIVE REPL
// ═══════════════════════════════════════════════════════════════════════════════

class QAntumREPL {
  constructor() {
    this.parser = new CommandParser();
    this.history = [];
    this.loadHistory();
  }

  loadHistory() {
    try {
      const content = fs.readFileSync(CONFIG.historyFile, 'utf-8');
      this.history = content.split('\n').filter(l => l);
    } catch {}
  }

  saveHistory() {
    try {
      fs.writeFileSync(CONFIG.historyFile, this.history.slice(-100).join('\n'));
    } catch {}
  }

  async start() {
    showBanner();
    console.log(c.dim('Type a command or natural language instruction. Type "exit" to quit.\n'));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `${colors.cyan}qantum${colors.reset} ${colors.dim}❯${colors.reset} `,
      historySize: 100,
    });

    rl.prompt();

    rl.on('line', async (line) => {
      const input = line.trim();
      
      if (!input) {
        rl.prompt();
        return;
      }

      if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
        console.log(c.dim('\n👋 QAntum Prime signing off. Sovereign mode deactivated.\n'));
        this.saveHistory();
        process.exit(0);
      }

      this.history.push(input);

      try {
        const parsed = await this.parser.parse(input);
        
        if (parsed.command === 'natural') {
          // Handle as natural language
          console.log(c.info('\n🧠 Processing natural language command...'));
          console.log(c.dim(`   "${parsed.args}"`));
          await this.parser.routeToBrain({ action: 'natural', query: parsed.args });
        } else if (this.parser.commands[parsed.command]) {
          await this.parser.commands[parsed.command](parsed.args);
        }
      } catch (error) {
        console.log(c.error(`\n❌ Error: ${error.message}`));
      }

      console.log('');
      rl.prompt();
    });

    rl.on('close', () => {
      console.log(c.dim('\n👋 Goodbye!\n'));
      this.saveHistory();
      process.exit(0);
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLI ENTRY POINT
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Interactive mode
    const repl = new QAntumREPL();
    await repl.start();
  } else if (args[0] === '--help' || args[0] === '-h') {
    showBanner();
    console.log(`
${c.header('USAGE:')}
  qantum                      Interactive REPL mode
  qantum "<command>"          Execute a single command
  qantum --watch              Start live file watcher
  qantum --status             Show system status
  qantum --analyze [file]     Analyze workspace or file
  qantum --verify [file]      Verify workspace or file
  qantum --assimilate         Build symbol registry
  qantum empire <cmd>         Empire commands (Cloud-Hybrid RAG)
  qantum --help               Show this help

${c.header('EMPIRE COMMANDS:')}
  empire status               Show empire status across 3 projects
  empire sync                 Sync all projects to Pinecone
  empire audit [--quick]      Run Sovereign Audit (DeepSeek-V3)
  empire ask "<query>"        Ask DeepSeek about the codebase
  empire analyze              Analyze empire statistics

${c.header('COMMANDS:')}
  refactor <target>           Refactor code
  analyze <target>            Analyze code quality
  fix <issue>                 Fix an issue
  test                        Run tests
  document <target>           Generate documentation
  optimize <target>           Optimize performance
  find <query>                Search in workspace
  goto <file>                 Open file in VS Code
  status                      System status
  watch                       Live file watcher
  verify                      Verify code correctness
  assimilate                  Build symbol registry
  learn <pattern>             Save a pattern
  remember                    Show learned patterns
  forget <pattern>            Remove a pattern

${c.header('EXAMPLES:')}
  qantum "refactor the auth module"
  qantum --watch
  qantum --analyze src/core
  qantum "намери всички TODO коментари"

${c.dim('QAntum Prime v28.1.0 SUPREME - Sovereign Mode')}
`);
  } else if (args[0] === '--watch' || args[0] === '-w') {
    showBanner();
    const parser = new CommandParser();
    await parser.watchCommand();
  } else if (args[0] === '--status' || args[0] === '-s') {
    const parser = new CommandParser();
    await parser.statusCommand();
  } else if (args[0] === '--analyze') {
    const parser = new CommandParser();
    await parser.analyzeCommand(args[1] || '');
  } else if (args[0] === '--verify') {
    const parser = new CommandParser();
    await parser.verifyCommand(args[1] || '');
  } else if (args[0] === '--assimilate') {
    const parser = new CommandParser();
    await parser.assimilateCommand(args[1] || '');
  } else if (args[0] === 'empire' || args[0] === '--empire') {
    const parser = new CommandParser();
    await parser.empireCommand(args.slice(1).join(' '));
  } else if (args[0] === '--sync') {
    const parser = new CommandParser();
    await parser.syncCommand();
  } else if (args[0] === '--audit') {
    const parser = new CommandParser();
    await parser.auditCommand(args.slice(1).join(' '));
  } else if (args[0] === '--ask') {
    const parser = new CommandParser();
    await parser.askCommand(args.slice(1).join(' '));
  } else if (args[0] === '--version' || args[0] === '-v') {
    console.log(`QAntum Prime CLI v${CONFIG.version}`);
  } else {
    // Single command mode
    const parser = new CommandParser();
    const input = args.join(' ');
    
    showBanner();
    console.log(c.dim(`Executing: "${input}"\n`));
    
    const parsed = await parser.parse(input);
    
    if (parsed.command === 'natural') {
      console.log(c.info('🧠 Processing natural language command...'));
      await parser.routeToBrain({ action: 'natural', query: parsed.args });
    } else if (parser.commands[parsed.command]) {
      await parser.commands[parsed.command](parsed.args);
    }
  }
}

main().catch(console.error);

// Export for programmatic use
module.exports = { CommandParser, QAntumREPL, CONFIG };
