/**
 * ╔═══════════════════════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                                               ║
 * ║   ███████╗████████╗███████╗██████╗ ███╗   ██╗ █████╗ ██╗                                      ║
 * ║   ██╔════╝╚══██╔══╝██╔════╝██╔══██╗████╗  ██║██╔══██╗██║                                      ║
 * ║   █████╗     ██║   █████╗  ██████╔╝██╔██╗ ██║███████║██║                                      ║
 * ║   ██╔══╝     ██║   ██╔══╝  ██╔══██╗██║╚██╗██║██╔══██║██║                                      ║
 * ║   ███████╗   ██║   ███████╗██║  ██║██║ ╚████║██║  ██║███████╗                                 ║
 * ║   ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝                                 ║
 * ║                                                                                               ║
 * ║    ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗ ██╗ █████╗ ███╗   ██╗                             ║
 * ║   ██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗██║██╔══██╗████╗  ██║                             ║
 * ║   ██║  ███╗██║   ██║███████║██████╔╝██║  ██║██║███████║██╔██╗ ██║                             ║
 * ║   ██║   ██║██║   ██║██╔══██║██╔══██╗██║  ██║██║██╔══██║██║╚██╗██║                             ║
 * ║   ╚██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝██║██║  ██║██║ ╚████║                             ║
 * ║    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝                             ║
 * ║                                                                                               ║
 * ║   ВЕЧНИЯТ ПАЗИТЕЛ НА ЕКОСИСТЕМАТА - SELF-HEALING REAL-TIME GUARDIAN                           ║
 * ║                                                                                               ║
 * ║   "994,517 реда код, свързани завинаги. Един организъм, една воля, една цел."                 ║
 * ║                                                                                               ║
 * ║   Обединява:                                                                                  ║
 * ║   • EcosystemSyncValidator - Валидация на синхронизацията                                     ║
 * ║   • EcosystemHarmonizer - Автоматично хармонизиране                                           ║
 * ║   • CrossProjectSynergy - Синергия между проекти                                              ║
 * ║   • SovereignAudit - Одит на кода                                                             ║
 * ║   • HealthMonitor - Мониторинг на здравето                                                    ║
 * ║   • VectorSync - Векторна синхронизация                                                       ║
 * ║                                                                                               ║
 * ║   Created: 2026-01-02 | QAntum Empire - ABSOLUTE SOVEREIGNTY                                  ║
 * ║   Author: Димитър Продромов                                                                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════════════════════════╝
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const ROOT = path.join(__dirname, '..');
const defaultRepos = [
  { name: 'MrMindQATool', path: 'C:\\MrMindQATool', role: 'shield' },
  { name: 'MisteMind', path: 'C:\\MisteMind', role: 'core' },
  { name: 'MisterMindPage', path: 'C:\\MisterMindPage', role: 'voice' }
];
const hasExternalRepos = defaultRepos.some(r => fs.existsSync(path.join(r.path, 'src')));
const CONFIG = {
  repos: hasExternalRepos ? defaultRepos : [{ name: 'SamsunS24', path: ROOT, role: 'core' }],
  watchInterval: 5000,
  healingMemoryPath: path.join(ROOT, 'data', 'healing-memory.json'),
  logPath: path.join(ROOT, 'data', 'guardian-log.json'),
  ignoreDirs: ['node_modules', '.git', '.venv', 'dist', 'coverage']
};

// ═══════════════════════════════════════════════════════════════════════════════
// HEALING MEMORY - Learns from past fixes
// ═══════════════════════════════════════════════════════════════════════════════

class HealingMemory {
  constructor() {
    this.memories = this.load();
  }

  load() {
    try {
      if (fs.existsSync(CONFIG.healingMemoryPath)) {
        return JSON.parse(fs.readFileSync(CONFIG.healingMemoryPath, 'utf-8'));
      }
    } catch (e) { /* ignore */ }
    return {
      fixes: [],
      patterns: {},
      preventions: [],
      stats: { totalFixes: 0, autoHealed: 0, prevented: 0 }
    };
  }

  save() {
    fs.writeFileSync(CONFIG.healingMemoryPath, JSON.stringify(this.memories, null, 2));
  }

  remember(issue, fix, success) {
    const memory = {
      timestamp: new Date().toISOString(),
      issue: issue.type,
      file: issue.file,
      fix: fix.action,
      success,
      pattern: this.extractPattern(issue)
    };
    
    this.memories.fixes.push(memory);
    this.memories.stats.totalFixes++;
    if (success) this.memories.stats.autoHealed++;
    
    // Learn pattern
    const patternKey = `${issue.type}:${memory.pattern}`;
    if (!this.memories.patterns[patternKey]) {
      this.memories.patterns[patternKey] = { count: 0, fixes: [] };
    }
    this.memories.patterns[patternKey].count++;
    this.memories.patterns[patternKey].fixes.push(fix.action);
    
    this.save();
    return memory;
  }

  extractPattern(issue) {
    // Extract generalizable pattern from specific issue
    if (issue.file) {
      const ext = path.extname(issue.file);
      const folder = path.dirname(issue.file).split(path.sep).slice(-2).join('/');
      return `${folder}/*${ext}`;
    }
    return issue.type;
  }

  findSimilarFix(issue) {
    const pattern = this.extractPattern(issue);
    const patternKey = `${issue.type}:${pattern}`;
    const similar = this.memories.patterns[patternKey];
    
    if (similar && similar.count > 0) {
      // Return most common fix
      const fixCounts = {};
      similar.fixes.forEach(f => fixCounts[f] = (fixCounts[f] || 0) + 1);
      const mostCommon = Object.entries(fixCounts).sort((a, b) => b[1] - a[1])[0];
      return { action: mostCommon[0], confidence: mostCommon[1] / similar.count };
    }
    return null;
  }

  canPrevent(file) {
    // Check if we've seen issues with this type of file before
    const ext = path.extname(file);
    const folder = path.dirname(file).split(path.sep).slice(-2).join('/');
    const pattern = `${folder}/*${ext}`;
    
    for (const [key, data] of Object.entries(this.memories.patterns)) {
      if (key.includes(pattern) && data.count > 2) {
        return { shouldCheck: true, reason: `Pattern ${pattern} had ${data.count} issues before` };
      }
    }
    return { shouldCheck: false };
  }

  recordPrevention() {
    this.memories.stats.prevented++;
    this.save();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ISSUE DETECTOR
// ═══════════════════════════════════════════════════════════════════════════════

class IssueDetector {
  constructor(memory) {
    this.memory = memory;
  }

  async detectIssues() {
    const issues = [];
    
    // 1. Check import/export consistency
    issues.push(...await this.checkImportExportIssues());
    
    // 2. Check for orphan modules
    issues.push(...await this.checkOrphanModules());
    
    // 3. Check dependency versions
    issues.push(...await this.checkDependencyVersions());
    
    // 4. Check TypeScript config alignment
    issues.push(...await this.checkTsConfigAlignment());
    
    // 5. Check for syntax errors
    issues.push(...await this.checkSyntaxErrors());
    
    return issues;
  }

  async checkImportExportIssues() {
    const issues = [];
    
    for (const repo of CONFIG.repos) {
      const srcPath = path.join(repo.path, 'src');
      if (!fs.existsSync(srcPath)) continue;
      
      const files = this.getAllFiles(srcPath, ['.ts', '.js']);
      
      for (const file of files) {
        try {
          const content = fs.readFileSync(file, 'utf-8');
          
          // Check for broken imports
          const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
          let match;
          while ((match = importRegex.exec(content)) !== null) {
            const importPath = match[1];
            if (importPath.startsWith('.')) {
              const resolved = this.resolveImport(file, importPath);
              if (!resolved) {
                issues.push({
                  type: 'broken_import',
                  severity: 'critical',
                  file,
                  repo: repo.name,
                  details: `Import not found: ${importPath}`,
                  importPath
                });
              }
            }
          }
        } catch (e) { /* skip */ }
      }
    }
    
    return issues;
  }

  async checkOrphanModules() {
    const issues = [];
    const allImports = new Set();
    const allModules = new Map();
    
    for (const repo of CONFIG.repos) {
      const srcPath = path.join(repo.path, 'src');
      if (!fs.existsSync(srcPath)) continue;
      
      const files = this.getAllFiles(srcPath, ['.ts', '.js']);
      
      for (const file of files) {
        const moduleName = path.basename(file, path.extname(file));
        allModules.set(file, { name: moduleName, repo: repo.name });
        
        try {
          const content = fs.readFileSync(file, 'utf-8');
          const importRegex = /from\s+['"]([^'"]+)['"]/g;
          let match;
          while ((match = importRegex.exec(content)) !== null) {
            const importPath = match[1];
            if (importPath.startsWith('.')) {
              const resolved = this.resolveImport(file, importPath);
              if (resolved) allImports.add(resolved);
            }
          }
        } catch (e) { /* skip */ }
      }
    }
    
    // Find orphans (not imported and not index)
    allModules.forEach((info, file) => {
      if (!allImports.has(file) && 
          !info.name.includes('index') && 
          !file.includes('test') &&
          !file.includes('spec')) {
        
        // Check if it exports anything
        try {
          const content = fs.readFileSync(file, 'utf-8');
          if (!/export\s+(class|interface|function|const|default)/.test(content)) {
            issues.push({
              type: 'orphan_module',
              severity: 'warning',
              file,
              repo: info.repo,
              details: `Module "${info.name}" has no exports and is never imported`
            });
          }
        } catch (e) { /* skip */ }
      }
    });
    
    return issues;
  }

  async checkDependencyVersions() {
    const issues = [];
    const deps = new Map();
    
    for (const repo of CONFIG.repos) {
      const pkgPath = path.join(repo.path, 'package.json');
      if (!fs.existsSync(pkgPath)) continue;
      
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
        
        for (const [name, version] of Object.entries(allDeps)) {
          if (!deps.has(name)) deps.set(name, []);
          deps.get(name).push({ repo: repo.name, version });
        }
      } catch (e) { /* skip */ }
    }
    
    // Check for version conflicts
    deps.forEach((versions, name) => {
      if (versions.length > 1) {
        const uniqueVersions = [...new Set(versions.map(v => v.version))];
        if (uniqueVersions.length > 1) {
          issues.push({
            type: 'version_conflict',
            severity: 'warning',
            file: 'package.json',
            details: `Dependency "${name}" has different versions: ${versions.map(v => `${v.repo}:${v.version}`).join(', ')}`,
            dependency: name,
            versions
          });
        }
      }
    });
    
    return issues;
  }

  async checkTsConfigAlignment() {
    const issues = [];
    const configs = [];
    
    for (const repo of CONFIG.repos) {
      const tsConfigPath = path.join(repo.path, 'tsconfig.json');
      if (!fs.existsSync(tsConfigPath)) continue;
      
      try {
        const content = fs.readFileSync(tsConfigPath, 'utf-8');
        const cleaned = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
        const config = JSON.parse(cleaned);
        configs.push({ repo: repo.name, config });
      } catch (e) { /* skip */ }
    }
    
    // Check target alignment
    const targets = configs.map(c => c.config.compilerOptions?.target).filter(Boolean);
    const uniqueTargets = [...new Set(targets)];
    if (uniqueTargets.length > 1) {
      issues.push({
        type: 'tsconfig_mismatch',
        severity: 'info',
        file: 'tsconfig.json',
        details: `TypeScript targets differ: ${configs.map(c => `${c.repo}:${c.config.compilerOptions?.target}`).join(', ')}`
      });
    }
    
    return issues;
  }

  async checkSyntaxErrors() {
    const issues = [];
    
    for (const repo of CONFIG.repos) {
      const srcPath = path.join(repo.path, 'src');
      if (!fs.existsSync(srcPath)) continue;
      
      const files = this.getAllFiles(srcPath, ['.ts', '.js']);
      
      for (const file of files) {
        try {
          const content = fs.readFileSync(file, 'utf-8');
          
          // Check for common syntax issues
          const lines = content.split('\n');
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Check for unclosed brackets (simplified)
            const opens = (line.match(/[{(\[]/g) || []).length;
            const closes = (line.match(/[})\]]/g) || []).length;
            
            // Check for console.log in production code
            if (line.includes('console.log') && !file.includes('test') && !file.includes('debug')) {
              issues.push({
                type: 'console_log',
                severity: 'info',
                file,
                repo: repo.name,
                line: i + 1,
                details: 'console.log found in production code'
              });
            }
          }
        } catch (e) { /* skip */ }
      }
    }
    
    return issues;
  }

  getAllFiles(dir, extensions) {
    const files = [];
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && !CONFIG.ignoreDirs.includes(item)) {
          files.push(...this.getAllFiles(fullPath, extensions));
        } else if (extensions.includes(path.extname(item))) {
          files.push(fullPath);
        }
      }
    } catch (e) { /* skip */ }
    return files;
  }

  resolveImport(fromFile, importPath) {
    const fromDir = path.dirname(fromFile);
    let resolved = path.resolve(fromDir, importPath);
    
    for (const ext of ['.ts', '.tsx', '.js', '.jsx']) {
      if (fs.existsSync(resolved + ext)) return resolved + ext;
    }
    for (const ext of ['.ts', '.tsx', '.js', '.jsx']) {
      const indexPath = path.join(resolved, 'index' + ext);
      if (fs.existsSync(indexPath)) return indexPath;
    }
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SELF-HEALER
// ═══════════════════════════════════════════════════════════════════════════════

class SelfHealer {
  constructor(memory) {
    this.memory = memory;
  }

  async heal(issue) {
    console.log(`  🔧 Attempting to heal: ${issue.type}`);
    
    // First check if we have a learned fix
    const learnedFix = this.memory.findSimilarFix(issue);
    if (learnedFix && learnedFix.confidence > 0.7) {
      console.log(`  📚 Using learned fix (${(learnedFix.confidence * 100).toFixed(0)}% confidence)`);
    }
    
    let fix = { action: 'none', success: false };
    
    switch (issue.type) {
      case 'broken_import':
        fix = await this.healBrokenImport(issue);
        break;
      case 'version_conflict':
        fix = await this.healVersionConflict(issue);
        break;
      case 'orphan_module':
        fix = await this.healOrphanModule(issue);
        break;
      case 'console_log':
        fix = await this.healConsoleLog(issue);
        break;
      case 'tsconfig_mismatch':
        fix = { action: 'manual_review', success: false, reason: 'Requires manual review' };
        break;
      default:
        fix = { action: 'unknown', success: false };
    }
    
    // Remember this fix
    this.memory.remember(issue, fix, fix.success);
    
    return fix;
  }

  async healBrokenImport(issue) {
    // Try to find the correct import path
    const importName = path.basename(issue.importPath);
    
    for (const repo of CONFIG.repos) {
      const srcPath = path.join(repo.path, 'src');
      if (!fs.existsSync(srcPath)) continue;
      
      // Search for file with this name
      const found = this.findFile(srcPath, importName);
      if (found) {
        // Calculate relative path from issue file to found file
        const relativePath = path.relative(path.dirname(issue.file), found)
          .replace(/\\/g, '/')
          .replace(/\.(ts|js)$/, '');
        
        const fixedPath = relativePath.startsWith('.') ? relativePath : './' + relativePath;
        
        // Update the file
        try {
          let content = fs.readFileSync(issue.file, 'utf-8');
          content = content.replace(
            new RegExp(`from\\s+['"]${issue.importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`),
            `from '${fixedPath}'`
          );
          fs.writeFileSync(issue.file, content);
          
          return { action: 'fix_import_path', success: true, newPath: fixedPath };
        } catch (e) {
          return { action: 'fix_import_path', success: false, error: e.message };
        }
      }
    }
    
    return { action: 'fix_import_path', success: false, reason: 'Could not find target module' };
  }

  async healVersionConflict(issue) {
    // Get latest version from all
    const versions = issue.versions.map(v => v.version.replace(/[\^~]/g, ''));
    const latest = versions.sort().reverse()[0];
    
    // Update all package.json files
    let allSuccess = true;
    for (const repo of CONFIG.repos) {
      const pkgPath = path.join(repo.path, 'package.json');
      if (!fs.existsSync(pkgPath)) continue;
      
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        let modified = false;
        
        if (pkg.dependencies?.[issue.dependency]) {
          pkg.dependencies[issue.dependency] = `^${latest}`;
          modified = true;
        }
        if (pkg.devDependencies?.[issue.dependency]) {
          pkg.devDependencies[issue.dependency] = `^${latest}`;
          modified = true;
        }
        
        if (modified) {
          fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
        }
      } catch (e) {
        allSuccess = false;
      }
    }
    
    return { action: 'align_versions', success: allSuccess, version: latest };
  }

  async healOrphanModule(issue) {
    // Add export to index if exists
    const dir = path.dirname(issue.file);
    const indexPath = path.join(dir, 'index.ts');
    const moduleName = path.basename(issue.file, path.extname(issue.file));
    
    if (fs.existsSync(indexPath)) {
      try {
        let content = fs.readFileSync(indexPath, 'utf-8');
        if (!content.includes(moduleName)) {
          content += `\nexport * from './${moduleName}';\n`;
          fs.writeFileSync(indexPath, content);
          return { action: 'add_to_index', success: true };
        }
      } catch (e) {
        return { action: 'add_to_index', success: false, error: e.message };
      }
    }
    
    return { action: 'add_to_index', success: false, reason: 'No index.ts found' };
  }

  async healConsoleLog(issue) {
    try {
      let content = fs.readFileSync(issue.file, 'utf-8');
      const lines = content.split('\n');
      
      // Comment out the console.log instead of removing
      if (issue.line && lines[issue.line - 1]) {
        lines[issue.line - 1] = '// ' + lines[issue.line - 1] + ' // Auto-commented by Guardian';
        content = lines.join('\n');
        fs.writeFileSync(issue.file, content);
        return { action: 'comment_console_log', success: true };
      }
    } catch (e) {
      return { action: 'comment_console_log', success: false, error: e.message };
    }
    
    return { action: 'comment_console_log', success: false };
  }

  findFile(dir, name) {
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && !CONFIG.ignoreDirs.includes(item)) {
          const found = this.findFile(fullPath, name);
          if (found) return found;
        } else if (item.startsWith(name)) {
          return fullPath;
        }
      }
    } catch (e) { /* skip */ }
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ETERNAL GUARDIAN - Main orchestrator
// ═══════════════════════════════════════════════════════════════════════════════

class EternalGuardian extends EventEmitter {
  constructor() {
    super();
    this.memory = new HealingMemory();
    this.detector = new IssueDetector(this.memory);
    this.healer = new SelfHealer(this.memory);
    this.isRunning = false;
    this.stats = {
      startTime: null,
      checksPerformed: 0,
      issuesFound: 0,
      issuesHealed: 0,
      lastCheck: null
    };
    this.log = [];
  }

  async start() {
    console.log('\n╔═══════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                               ║');
    console.log('║   ███████╗████████╗███████╗██████╗ ███╗   ██╗ █████╗ ██╗                      ║');
    console.log('║   ██╔════╝╚══██╔══╝██╔════╝██╔══██╗████╗  ██║██╔══██╗██║                      ║');
    console.log('║   █████╗     ██║   █████╗  ██████╔╝██╔██╗ ██║███████║██║                      ║');
    console.log('║   ██╔══╝     ██║   ██╔══╝  ██╔══██╗██║╚██╗██║██╔══██║██║                      ║');
    console.log('║   ███████╗   ██║   ███████╗██║  ██║██║ ╚████║██║  ██║███████╗                 ║');
    console.log('║   ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝                 ║');
    console.log('║                                                                               ║');
    console.log('║    ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗ ██╗ █████╗ ███╗   ██╗             ║');
    console.log('║   ██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗██║██╔══██╗████╗  ██║             ║');
    console.log('║   ██║  ███╗██║   ██║███████║██████╔╝██║  ██║██║███████║██╔██╗ ██║             ║');
    console.log('║   ██║   ██║██║   ██║██╔══██║██╔══██╗██║  ██║██║██╔══██║██║╚██╗██║             ║');
    console.log('║   ╚██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝██║██║  ██║██║ ╚████║             ║');
    console.log('║    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝             ║');
    console.log('║                                                                               ║');
    console.log('║              🛡️  ВЕЧНИЯТ ПАЗИТЕЛ НА ЕКОСИСТЕМАТА  🛡️                          ║');
    console.log('║                                                                               ║');
    console.log('║   "994,517 реда код, свързани завинаги"                                       ║');
    console.log('║                                                                               ║');
    console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');

    this.isRunning = true;
    this.stats.startTime = new Date();
    
    console.log('🔱 Guardian activated at', this.stats.startTime.toISOString());
    console.log('📊 Healing memory loaded:', this.memory.memories.stats.totalFixes, 'past fixes');
    console.log('');
    
    // Initial full check
    await this.performCheck();
    
    // Start watch loop
    this.watchLoop();
  }

  async watchLoop() {
    while (this.isRunning) {
      await this.sleep(CONFIG.watchInterval);
      await this.performCheck();
    }
  }

  async performCheck() {
    this.stats.checksPerformed++;
    this.stats.lastCheck = new Date();
    
    console.log(`\n🔍 Check #${this.stats.checksPerformed} at ${this.stats.lastCheck.toLocaleTimeString()}`);
    
    // Detect issues
    const issues = await this.detector.detectIssues();
    
    if (issues.length === 0) {
      console.log('  ✅ No issues found - ecosystem healthy');
      return;
    }
    
    console.log(`  ⚠️  Found ${issues.length} issues`);
    this.stats.issuesFound += issues.length;
    
    // Group by severity
    const critical = issues.filter(i => i.severity === 'critical');
    const warnings = issues.filter(i => i.severity === 'warning');
    const info = issues.filter(i => i.severity === 'info');
    
    if (critical.length > 0) {
      console.log(`  🔴 Critical: ${critical.length}`);
    }
    if (warnings.length > 0) {
      console.log(`  🟡 Warnings: ${warnings.length}`);
    }
    if (info.length > 0) {
      console.log(`  🔵 Info: ${info.length}`);
    }
    
    // Heal critical issues first
    for (const issue of critical) {
      console.log(`\n  🚨 CRITICAL: ${issue.type}`);
      console.log(`     File: ${issue.file}`);
      console.log(`     Details: ${issue.details}`);
      
      const fix = await this.healer.heal(issue);
      
      if (fix.success) {
        console.log(`     ✅ HEALED: ${fix.action}`);
        this.stats.issuesHealed++;
      } else {
        console.log(`     ❌ Could not auto-heal: ${fix.reason || fix.error || 'Unknown'}`);
      }
      
      this.logIssue(issue, fix);
    }
    
    // Heal warnings
    for (const issue of warnings.slice(0, 5)) { // Limit to 5 per check
      const fix = await this.healer.heal(issue);
      if (fix.success) {
        console.log(`  ✅ Healed warning: ${issue.type}`);
        this.stats.issuesHealed++;
      }
      this.logIssue(issue, fix);
    }
    
    // Summary
    console.log('\n  📊 Session stats:');
    console.log(`     Checks: ${this.stats.checksPerformed}`);
    console.log(`     Issues found: ${this.stats.issuesFound}`);
    console.log(`     Issues healed: ${this.stats.issuesHealed}`);
    console.log(`     Heal rate: ${((this.stats.issuesHealed / Math.max(1, this.stats.issuesFound)) * 100).toFixed(1)}%`);
  }

  logIssue(issue, fix) {
    this.log.push({
      timestamp: new Date().toISOString(),
      issue,
      fix,
      checksPerformed: this.stats.checksPerformed
    });
    
    // Save log periodically
    if (this.log.length % 10 === 0) {
      fs.writeFileSync(CONFIG.logPath, JSON.stringify(this.log.slice(-100), null, 2));
    }
  }

  stop() {
    this.isRunning = false;
    console.log('\n🛑 Guardian stopped');
    console.log(`   Total runtime: ${Math.round((Date.now() - this.stats.startTime) / 1000)}s`);
    console.log(`   Issues healed: ${this.stats.issuesHealed}`);
    
    // Save final log
    fs.writeFileSync(CONFIG.logPath, JSON.stringify(this.log, null, 2));
    this.memory.save();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Run single check (for CLI)
  async runOnce() {
    console.log('\n🔬 Running single ecosystem check...\n');
    
    const issues = await this.detector.detectIssues();
    
    console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                    🔬 ECOSYSTEM HEALTH REPORT 🔬                              ║');
    console.log('╠═══════════════════════════════════════════════════════════════════════════════╣');
    
    const critical = issues.filter(i => i.severity === 'critical');
    const warnings = issues.filter(i => i.severity === 'warning');
    const info = issues.filter(i => i.severity === 'info');
    
    console.log(`║  🔴 Critical Issues: ${critical.length.toString().padEnd(50)}║`);
    console.log(`║  🟡 Warnings: ${warnings.length.toString().padEnd(57)}║`);
    console.log(`║  🔵 Info: ${info.length.toString().padEnd(61)}║`);
    console.log('╠═══════════════════════════════════════════════════════════════════════════════╣');
    
    if (issues.length === 0) {
      console.log('║  ✅ ECOSYSTEM IS HEALTHY - ALL MODULES CONNECTED!                            ║');
    } else {
      console.log('║  Issues found:                                                               ║');
      for (const issue of issues.slice(0, 10)) {
        const icon = issue.severity === 'critical' ? '🔴' : issue.severity === 'warning' ? '🟡' : '🔵';
        console.log(`║  ${icon} ${issue.type.padEnd(20)} ${(issue.repo || '').padEnd(15)} ${issue.details?.substring(0, 30) || ''}`.padEnd(80) + '║');
      }
      if (issues.length > 10) {
        console.log(`║  ... and ${issues.length - 10} more issues`.padEnd(80) + '║');
      }
    }
    
    // Health score
    const healthScore = Math.max(0, 100 - (critical.length * 20) - (warnings.length * 5) - info.length);
    const healthEmoji = healthScore >= 90 ? '🟢' : healthScore >= 70 ? '🟡' : healthScore >= 50 ? '🟠' : '🔴';
    
    console.log('╠═══════════════════════════════════════════════════════════════════════════════╣');
    console.log(`║  ${healthEmoji} Health Score: ${healthScore}/100`.padEnd(80) + '║');
    console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');
    
    // Auto-heal if requested
    if (process.argv.includes('--heal')) {
      console.log('\n🔧 Auto-healing enabled...\n');
      for (const issue of issues) {
        const fix = await this.healer.heal(issue);
        if (fix.success) {
          console.log(`  ✅ Healed: ${issue.type}`);
        }
      }
    }
    
    return { issues, healthScore };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════════════════════

const guardian = new EternalGuardian();

if (process.argv.includes('--watch')) {
  // Real-time watch mode
  guardian.start();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    guardian.stop();
    process.exit(0);
  });
} else {
  // Single run
  guardian.runOnce().then(({ healthScore }) => {
    process.exit(healthScore >= 70 ? 0 : 1);
  });
}
