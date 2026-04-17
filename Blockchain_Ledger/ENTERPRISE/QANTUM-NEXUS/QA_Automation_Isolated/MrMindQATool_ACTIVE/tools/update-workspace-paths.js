#!/usr/bin/env node
/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║  WORKSPACE PATH RESOLVER - Намира модулите където и да са                    ║
 * ║  Run: node tools/update-workspace-paths.js                                   ║
 * ║  Or:  npm run workspace:sync (if in package.json)                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 *
 * Търси MisteMind и MisterMindPage в:
 * - Env vars: MISTEMIND_PATH, MISTERMINDPAGE_PATH
 * - Sibling dirs: ../MisteMind, ../MisterMindPage
 * - Parent siblings: ../../MisteMind, ../../MisterMindPage
 * - Project root siblings
 * - CWD and parents up to 5 levels
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_FILE = path.join(__dirname, '..', 'qantum.code-workspace');
const WORKSPACE_DIR = path.dirname(WORKSPACE_FILE);

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'dist-forge', 'coverage', 'out', '.venv', '__pycache__']);

function dirExists(p) {
  try {
    return fs.existsSync(p) && fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function findInTree(rootDir, targetName, maxDepth = 8) {
  const results = [];
  function scan(dir, depth) {
    if (depth > maxDepth) return;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        if (!e.isDirectory() || SKIP_DIRS.has(e.name)) continue;
        const full = path.join(dir, e.name);
        if (e.name === targetName) results.push(path.resolve(full));
        else scan(full, depth + 1);
      }
    } catch (_) {}
  }
  scan(rootDir, 0);
  return results[0] || null;
}

const PATHS_CONFIG = path.join(WORKSPACE_DIR, '.qantum-workspace-paths.json');

function loadPathsConfig() {
  try {
    const raw = fs.readFileSync(PATHS_CONFIG, 'utf8');
    const data = JSON.parse(raw);
    return data;
  } catch {
    return {};
  }
}

const NAME_ALIASES = { MisteMind: ['MisteMind', 'MisteMind.-star'] };

function findModule(name) {
  const aliases = NAME_ALIASES[name] || [name];

  // 0. Config file (highest - user override)
  const config = loadPathsConfig();
  const configPath = config[name] || config[name.replace(/([A-Z])/g, (m) => m.toLowerCase())];
  if (configPath && dirExists(configPath)) return path.resolve(configPath);

  // 1. Env var
  const envKey = name.toUpperCase().replace(/-/g, '_') + '_PATH';
  const envPath = process.env[envKey];
  if (envPath && dirExists(envPath)) return path.resolve(envPath);

  const tryFind = (baseName) => {
    // 2. Relative to workspace
    for (let i = 1; i <= 6; i++) {
      const rel = path.join(WORKSPACE_DIR, ...Array(i).fill('..'), baseName);
      if (dirExists(rel)) return path.resolve(rel);
    }
    // 3. Sibling of workspace parent
    const sibling = path.join(path.dirname(WORKSPACE_DIR), baseName);
    if (dirExists(sibling)) return path.resolve(sibling);
    // 4. Walk up from cwd
    let dir = process.cwd();
    for (let i = 0; i < 8 && dir; i++) {
      const here = path.join(dir, baseName);
      if (dirExists(here)) return path.resolve(here);
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
    return null;
  };

  for (const alias of aliases) {
    const found = tryFind(alias);
    if (found) return found;
  }

  // 5. Recursive search inside project
  const projectRoot = (() => {
    let d = path.dirname(WORKSPACE_FILE);
    for (let i = 0; i < 10; i++) {
      if (fs.existsSync(path.join(d, 'package.json'))) return d;
      const p = path.dirname(d);
      if (p === d) break;
      d = p;
    }
    return process.cwd();
  })();
  for (const alias of aliases) {
    const found = findInTree(projectRoot, alias);
    if (found) return found;
  }

  // 6. Common Windows locations
  const home = process.env.USERPROFILE || process.env.HOME || '';
  const drives = ['C:', 'D:', 'E:'];
  const commonBases = [
    home,
    path.join(home, 'Documents'),
    path.join(home, 'Projects'),
    path.join(home, 'dev'),
    path.join(home, 'source'),
    ...drives,
    ...drives.map(d => path.join(d, 'Projects')),
    ...drives.map(d => path.join(d, 'dev')),
  ].filter(Boolean);
  for (const base of commonBases) {
    if (!base || !dirExists(base)) continue;
    for (const alias of aliases) {
      const candidate = path.join(base, alias);
      if (dirExists(candidate)) return path.resolve(candidate);
    }
  }

  return null;
}

function toRelativePath(absolutePath) {
  const rel = path.relative(WORKSPACE_DIR, absolutePath);
  return rel.startsWith('..') || path.isAbsolute(rel) ? rel : './' + rel;
}

function main() {
  const misteMind = findModule('MisteMind');
  const misterMindPage = findModule('MisterMindPage');

  let content = fs.readFileSync(WORKSPACE_FILE, 'utf8');

  const esc = (p) => String(p).replace(/\\/g, '/');

  // Replace MisteMind path (match by folder name, replace any current path)
  const mistePath = misteMind ? toRelativePath(misteMind) : '../MisteMind';
  content = content.replace(
    /("name":\s*"🧠 MisteMind"[^}]*?"path":\s*")[^"]*(")/,
    (_, pre, suf) => pre + esc(mistePath) + suf
  );

  // Replace MisterMindPage path
  const misterPath = misterMindPage ? toRelativePath(misterMindPage) : '../MisterMindPage';
  content = content.replace(
    /("name":\s*"🌐 MisterMindPage"[^}]*?"path":\s*")[^"]*(")/,
    (_, pre, suf) => pre + esc(misterPath) + suf
  );

  fs.writeFileSync(WORKSPACE_FILE, content, 'utf8');

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //   console.log('✓ Workspace paths updated'); // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //   if (misteMind) console.log('  🧠 MisteMind:', misteMind); // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //   else console.log('  ⚠ MisteMind: not found (using ../MisteMind)'); // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //   if (misterMindPage) console.log('  🌐 MisterMindPage:', misterMindPage); // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //   else console.log('  ⚠ MisterMindPage: not found (using ../MisterMindPage)'); // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian
  if (!misteMind || !misterMindPage) {
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //     console.log('\n💡 Ако са другаде, създай .qantum-workspace-paths.json в MrMindQATool_ACTIVE:'); // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //     console.log('   { "MisteMind": "C:\\\\MisteMind", "MisterMindPage": "C:\\\\MisterMindPage" }'); // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //     console.log('   Или: $env:MISTEMIND_PATH="C:\\MisteMind"; npm run workspace:sync'); // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian // Auto-commented by Guardian
  }
}

main();
