/**
 * ╔═══════════════════════════════════════════════════════════════════════════════════════════════╗
 * ║                           NUCLEUS MAPPER - МАТЕМАТИЧЕСКИ АНАЛИЗ                               ║
 * ║                                                                                               ║
 * ║   "Всеки модул трябва да е свързан с ядрото. Orphan модули = мъртъв код."                     ║
 * ║                                                                                               ║
 * ║   Този скрипт анализира ВСИЧКИ .ts/.js файлове и определя:                                    ║
 * ║   1. Колко модула има                                                                         ║
 * ║   2. Кои са АКТИВНИ (импортирани от други модули)                                             ║
 * ║   3. Кои са ORPHAN (никой не ги импортира)                                                    ║
 * ║   4. Dependency graph на цялата екосистема                                                    ║
 * ║                                                                                               ║
 * ║   Created: 2026-01-02 | QAntum Empire - ABSOLUTE SOVEREIGNTY                                  ║
 * ╚═══════════════════════════════════════════════════════════════════════════════════════════════╝
 */

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION — използва текущия проект; за multi-repo задай NUCLEUS_REPOS=path1,path2
// ═══════════════════════════════════════════════════════════════════════════════

const ROOT = process.cwd();
const multiRepos = process.env.NUCLEUS_REPOS;
const REPOS = multiRepos
  ? multiRepos.split(',').map((p, i) => ({ name: `Repo${i + 1}`, path: p.trim(), role: 'core' }))
  : [{ name: path.basename(ROOT) || 'project', path: ROOT, role: 'core' }];

const IGNORE_DIRS = ['node_modules', '.git', '.venv', 'dist', 'dist-forge', 'dist-protected', 'coverage', '__pycache__', '_BACKUPS', '_ARCHIVE', 'analysis-output'];
const CODE_EXTENSIONS = ['.ts', '.js', '.tsx', '.jsx'];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA STRUCTURES
// ═══════════════════════════════════════════════════════════════════════════════

const modules = new Map(); // modulePath -> ModuleInfo
const importGraph = new Map(); // modulePath -> Set<importedModulePaths>
const exportGraph = new Map(); // modulePath -> Set<importedByModulePaths>

// ═══════════════════════════════════════════════════════════════════════════════
// SCANNING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function scanDirectory(dir, repo) {
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          if (!IGNORE_DIRS.includes(item)) {
            scanDirectory(fullPath, repo);
          }
        } else if (CODE_EXTENSIONS.includes(path.extname(item))) {
          analyzeModule(fullPath, repo);
        }
      } catch (e) { /* skip */ }
    }
  } catch (e) { /* skip */ }
}

function analyzeModule(filePath, repo) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').length;
    const relativePath = filePath.replace(repo.path + '\\', '').replace(/\\/g, '/');
    const moduleName = path.basename(filePath, path.extname(filePath));
    
    // Extract exports
    const exports = [];
    const exportClassRegex = /export\s+(class|interface|type|enum|const|function|async function)\s+(\w+)/g;
    let match;
    while ((match = exportClassRegex.exec(content)) !== null) {
      exports.push({ type: match[1], name: match[2] });
    }
    
    // Check for default export
    if (/export\s+default/.test(content)) {
      exports.push({ type: 'default', name: 'default' });
    }
    
    // Check for re-exports
    const reExportRegex = /export\s+\*\s+from|export\s+{\s*[^}]+\s*}\s+from/g;
    while ((match = reExportRegex.exec(content)) !== null) {
      exports.push({ type: 're-export', name: 'barrel' });
    }
    
    // Extract imports
    const imports = [];
    const importRegex = /import\s+(?:{[^}]+}|[\w*]+(?:\s*,\s*{[^}]+})?)\s+from\s+['"]([^'"]+)['"]/g;
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      imports.push(importPath);
      
      // Resolve relative imports
      if (importPath.startsWith('.')) {
        const resolvedPath = resolveImport(filePath, importPath, repo);
        if (resolvedPath) {
          if (!importGraph.has(filePath)) importGraph.set(filePath, new Set());
          importGraph.get(filePath).add(resolvedPath);
          
          if (!exportGraph.has(resolvedPath)) exportGraph.set(resolvedPath, new Set());
          exportGraph.get(resolvedPath).add(filePath);
        }
      }
    }
    
    // Store module info
    modules.set(filePath, {
      name: moduleName,
      path: filePath,
      relativePath,
      repo: repo.name,
      lines,
      exports,
      imports,
      exportCount: exports.length,
      importCount: imports.length,
      isIndex: moduleName === 'index',
      isTest: filePath.includes('test') || filePath.includes('spec'),
      folder: path.dirname(relativePath).split('/')[0] || 'root'
    });
    
  } catch (e) { /* skip */ }
}

function resolveImport(fromFile, importPath, repo) {
  const fromDir = path.dirname(fromFile);
  let resolved = path.resolve(fromDir, importPath);
  
  // Try with extensions
  for (const ext of CODE_EXTENSIONS) {
    if (fs.existsSync(resolved + ext)) return resolved + ext;
  }
  
  // Try as directory with index
  for (const ext of CODE_EXTENSIONS) {
    const indexPath = path.join(resolved, 'index' + ext);
    if (fs.existsSync(indexPath)) return indexPath;
  }
  
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYSIS FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function analyzeConnectivity() {
  const results = {
    totalModules: modules.size,
    activeModules: 0,
    orphanModules: [],
    entryPoints: [],
    mostImported: [],
    byRepo: {},
    byFolder: {}
  };
  
  // Initialize repo stats
  for (const repo of REPOS) {
    results.byRepo[repo.name] = { total: 0, active: 0, orphan: 0, lines: 0 };
  }
  
  // Analyze each module
  modules.forEach((mod, filePath) => {
    const isImportedBy = exportGraph.get(filePath)?.size || 0;
    const imports = importGraph.get(filePath)?.size || 0;
    
    // Update repo stats
    results.byRepo[mod.repo].total++;
    results.byRepo[mod.repo].lines += mod.lines;
    
    // Update folder stats
    const folderKey = `${mod.repo}/${mod.folder}`;
    if (!results.byFolder[folderKey]) {
      results.byFolder[folderKey] = { total: 0, active: 0, orphan: 0, lines: 0 };
    }
    results.byFolder[folderKey].total++;
    results.byFolder[folderKey].lines += mod.lines;
    
    // Determine if active or orphan
    // A module is ACTIVE if:
    // 1. It's imported by at least one other module, OR
    // 2. It's an index/entry point file, OR
    // 3. It's a test file, OR
    // 4. It has exports AND imports something (it's part of the chain)
    
    const isActive = 
      isImportedBy > 0 || 
      mod.isIndex || 
      mod.isTest ||
      (mod.exportCount > 0 && mod.importCount > 0) ||
      mod.name === 'index' ||
      mod.relativePath.includes('index.');
    
    if (isActive) {
      results.activeModules++;
      results.byRepo[mod.repo].active++;
      results.byFolder[folderKey].active++;
    } else {
      // Potential orphan - but check if it has exports (might be entry point)
      if (mod.exportCount === 0 && !mod.isTest) {
        results.orphanModules.push({
          name: mod.name,
          path: mod.relativePath,
          repo: mod.repo,
          lines: mod.lines,
          reason: 'No exports, not imported'
        });
        results.byRepo[mod.repo].orphan++;
        results.byFolder[folderKey].orphan++;
      } else if (isImportedBy === 0 && !mod.isIndex) {
        results.orphanModules.push({
          name: mod.name,
          path: mod.relativePath,
          repo: mod.repo,
          lines: mod.lines,
          reason: 'Has exports but never imported'
        });
        results.byRepo[mod.repo].orphan++;
        results.byFolder[folderKey].orphan++;
      } else {
        results.activeModules++;
        results.byRepo[mod.repo].active++;
        results.byFolder[folderKey].active++;
      }
    }
    
    // Track most imported
    if (isImportedBy > 5) {
      results.mostImported.push({
        name: mod.name,
        path: mod.relativePath,
        repo: mod.repo,
        importedBy: isImportedBy
      });
    }
    
    // Track entry points (modules that import but aren't imported)
    if (imports > 0 && isImportedBy === 0 && !mod.isTest) {
      results.entryPoints.push({
        name: mod.name,
        path: mod.relativePath,
        repo: mod.repo,
        imports: imports
      });
    }
  });
  
  // Sort results
  results.mostImported.sort((a, b) => b.importedBy - a.importedBy);
  results.orphanModules.sort((a, b) => b.lines - a.lines);
  
  return results;
}

// ═══════════════════════════════════════════════════════════════════════════════
// REPORTING
// ═══════════════════════════════════════════════════════════════════════════════

function printReport(results) {
  console.log('\n╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║              🔬 NUCLEUS MAPPER - МАТЕМАТИЧЕСКИ АНАЛИЗ 🔬                      ║');
  console.log('║                                                                               ║');
  console.log('║   "Всеки модул трябва да е свързан с ядрото"                                  ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');
  
  // Overall stats
  const activePercent = ((results.activeModules / results.totalModules) * 100).toFixed(1);
  const orphanPercent = ((results.orphanModules.length / results.totalModules) * 100).toFixed(1);
  
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║  📊 ОБЩА СТАТИСТИКА                                                          ║');
  console.log('╠═══════════════════════════════════════════════════════════════════════════════╣');
  console.log(`║  Общо модули:        ${results.totalModules.toString().padEnd(10)} файла                                  ║`);
  console.log(`║  Активни модули:     ${results.activeModules.toString().padEnd(10)} (${activePercent}%)                             ║`);
  console.log(`║  Orphan модули:      ${results.orphanModules.length.toString().padEnd(10)} (${orphanPercent}%)                              ║`);
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');
  
  // By repo
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║  📁 ПО РЕПОЗИТОРИИ                                                           ║');
  console.log('╠═══════════════════════════════════════════════════════════════════════════════╣');
  for (const [repo, stats] of Object.entries(results.byRepo)) {
    if (stats.total > 0) {
      const pct = ((stats.active / stats.total) * 100).toFixed(0);
      console.log(`║  ${repo.padEnd(20)} ${stats.total.toString().padStart(5)} модула | ${stats.active.toString().padStart(5)} активни (${pct}%) | ${stats.lines.toLocaleString().padStart(8)} lines ║`);
    }
  }
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');
  
  // By folder (top 15)
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║  📂 ПО ПАПКИ (TOP 15 по брой модули)                                         ║');
  console.log('╠═══════════════════════════════════════════════════════════════════════════════╣');
  const sortedFolders = Object.entries(results.byFolder)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 15);
  for (const [folder, stats] of sortedFolders) {
    const pct = stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(0) : 0;
    const status = stats.orphan === 0 ? '✅' : (stats.orphan > 3 ? '⚠️' : '🔶');
    console.log(`║  ${status} ${folder.padEnd(30)} ${stats.total.toString().padStart(4)} mod | ${pct.toString().padStart(3)}% active | ${stats.lines.toLocaleString().padStart(7)} ln ║`);
  }
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');
  
  // Most imported (nucleus modules)
  if (results.mostImported.length > 0) {
    console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
    console.log('║  🧠 ЯДРЕНИ МОДУЛИ (най-импортирани - критични за системата)                  ║');
    console.log('╠═══════════════════════════════════════════════════════════════════════════════╣');
    for (const mod of results.mostImported.slice(0, 10)) {
      console.log(`║  🔗 ${mod.name.padEnd(25)} импортиран от ${mod.importedBy.toString().padStart(3)} модула  [${mod.repo}]`.padEnd(80) + '║');
    }
    console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');
  }
  
  // Orphan modules
  if (results.orphanModules.length > 0) {
    console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
    console.log('║  ⚠️  ORPHAN МОДУЛИ (не са свързани с ядрото)                                  ║');
    console.log('╠═══════════════════════════════════════════════════════════════════════════════╣');
    const topOrphans = results.orphanModules.slice(0, 15);
    for (const mod of topOrphans) {
      console.log(`║  ❌ ${mod.name.padEnd(25)} ${mod.lines.toString().padStart(5)} ln  [${mod.repo}]`.padEnd(80) + '║');
    }
    if (results.orphanModules.length > 15) {
      console.log(`║  ... и още ${results.orphanModules.length - 15} orphan модула`.padEnd(80) + '║');
    }
    console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');
  }
  
  // Health score
  const healthScore = Math.round((results.activeModules / results.totalModules) * 100);
  const healthEmoji = healthScore >= 95 ? '🟢' : healthScore >= 80 ? '🟡' : healthScore >= 60 ? '🟠' : '🔴';
  const healthStatus = healthScore >= 95 ? 'PERFECT SYNC' : healthScore >= 80 ? 'GOOD' : healthScore >= 60 ? 'NEEDS ATTENTION' : 'CRITICAL';
  
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║  🎯 ECOSYSTEM HEALTH                                                         ║');
  console.log('╠═══════════════════════════════════════════════════════════════════════════════╣');
  console.log(`║  ${healthEmoji} Score: ${healthScore}/100 - ${healthStatus}`.padEnd(80) + '║');
  console.log(`║                                                                               ║`);
  console.log(`║  Формула: (Активни модули / Общо модули) × 100                                ║`);
  console.log(`║           (${results.activeModules} / ${results.totalModules}) × 100 = ${healthScore}%`.padEnd(72) + '       ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');
}

function saveReport(results) {
  const outDir = path.join(ROOT, 'analysis-output');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const reportPath = path.join(outDir, 'nucleus-map-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📄 Full report saved to: analysis-output/nucleus-map-report.json\n`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🔬 Starting Nucleus Mapper...\n');

// Scan all repos
for (const repo of REPOS) {
  console.log(`📂 Scanning ${repo.name}...`);
  scanDirectory(repo.path, repo);
}

console.log(`\n✅ Scanned ${modules.size} modules\n`);

// Analyze connectivity
const results = analyzeConnectivity();

// Print and save report
printReport(results);
saveReport(results);
