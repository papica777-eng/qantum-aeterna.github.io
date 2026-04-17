#!/usr/bin/env npx tsx
/**
 * Пълен анализ на проекта — пуска всички анализи и обновява docs/PROJECT_STRUCTURE.md
 *
 * Usage: npx tsx scripts/run-full-analysis.ts
 *        npm run analyze:full
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { getLiveTaxonomy } from '../vortex-live-scan';

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, 'docs');
const OUT_FILE = path.join(DOCS_DIR, 'PROJECT_STRUCTURE.md');
const ANALYSIS_DIR = path.join(ROOT, 'analysis-output');

// Класификация на top-level папки
const CORE_NAMES = new Set(['src', 'security', 'qa', 'swarm', 'scripts', 'tests', 'docs', 'modules']);
const COLLECTED_NAMES = new Set(['_COLLECTED_MODULES_', '_TITAN_LIBRARY_', '_STRATIFIED_VORTEX_', '_LIBS_AND_MISC']);
const BACKUP_NAMES = new Set(['_BACKUPS', '_ARCHIVE', '.ascension-backup', 'archive']);
const IGNORE_TOP = new Set(['node_modules', '.git', '.cache', '.test-artifacts', '.test-models', 'analysis-output']);

function getTopLevelDirs(): { name: string; type: 'core' | 'collected' | 'backup' | 'other' }[] {
  const entries = fs.readdirSync(ROOT, { withFileTypes: true });
  const result: { name: string; type: 'core' | 'collected' | 'backup' | 'other' }[] = [];
  for (const e of entries) {
    if (!e.isDirectory() || IGNORE_TOP.has(e.name)) continue;
    let type: 'core' | 'collected' | 'backup' | 'other' = 'other';
    if (CORE_NAMES.has(e.name)) type = 'core';
    else if (COLLECTED_NAMES.has(e.name)) type = 'collected';
    else if (BACKUP_NAMES.has(e.name)) type = 'backup';
    result.push({ name: e.name, type });
  }
  result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}

function ensureDir(p: string) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function runStep(label: string, cmd: string): boolean {
  try {
    console.log(`\n▶ ${label}...`);
    execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
    return true;
  } catch (e) {
    console.warn(`⚠ ${label} failed (continuing).`);
    return false;
  }
}

function generateStructureMd(
  taxonomy: ReturnType<typeof getLiveTaxonomy>,
  topDirs: { name: string; type: string }[]
): string {
  const core = topDirs.filter((d) => d.type === 'core').map((d) => d.name);
  const collected = topDirs.filter((d) => d.type === 'collected').map((d) => d.name);
  const backup = topDirs.filter((d) => d.type === 'backup').map((d) => d.name);
  const other = topDirs.filter((d) => d.type === 'other').map((d) => d.name);

  return `# Структура на проекта

Автоматично генерирано от \`scripts/run-full-analysis.ts\` на ${new Date().toISOString().slice(0, 10)}.

## Vortex — модули (live scan)

| Категория   | Брой |
|------------|------|
| security   | ${taxonomy.counts.security ?? 0} |
| ai_core    | ${taxonomy.counts.ai_core ?? 0} |
| automation | ${taxonomy.counts.automation ?? 0} |
| economy    | ${taxonomy.counts.economy ?? 0} |
| other      | ${taxonomy.counts.other ?? 0} |
| **Общо**   | **${taxonomy.total}** |

Сканирани корени: \`${taxonomy.rootsScanned.join(', ')}\`

---

## Top-level папки

### Ядро (core)
${core.map((d) => `- \`${d}/\``).join('\n')}

### Събрани / библиотеки (collected)
${collected.map((d) => `- \`${d}/\``).join('\n') || '- *(няма)*'}

### Резервни / архив (backup)
${backup.map((d) => `- \`${d}/\``).join('\n') || '- *(няма)*'}

### Други домейни
${other.slice(0, 40).map((d) => `- \`${d}/\``).join('\n')}${other.length > 40 ? `\n- ... и още ${other.length - 40} папки` : ''}

---

## Репорти от анализа

| Репорт | Файл |
|--------|------|
| Vortex таксономия | \`analysis-output/TAXONOMY.json\` (от \`vortex:orchestrate\`) |
| Архитектура (дубликати, класификация) | \`analysis-output/architecture-report.json\` |
| Nucleus (orphan модули, граф) | \`analysis-output/nucleus-map-report.json\` |
| Auto-docs инвентар | \`analysis-output/auto-docs/project-inventory.json\` |

---

## Скриптове за анализ

| Команда | Описание |
|---------|----------|
| \`npm run analyze:full\` | Пълен анализ + обновяване на този документ |
| \`npm run analyze:architecture\` | Класификация и дубликати (architecture-reorganizer) |
| \`npm run analyze:nucleus\` | Orphan модули и dependency граф (nucleus-mapper) |
| \`npm run vortex:count\` | Брой модули на живо (vortex-count-modules) |
| \`npx tsx scripts/analysis/auto-documenter.ts\` | Инвентар и PROJECT-STATS (auto-documenter) |
| \`node scripts/analysis/system-audit.js\` | Проверка на core модули и скриптове |
| \`npx ts-node scripts/analysis/know-thyself.ts\` | Самоанализ → docs/SELF_ANALYSIS_2026.md, WHO_AM_I.md |
| \`npx ts-node scripts/analysis/system-meditate.ts\` | Layer integrity (src/) |
`;
}

// ─── Main ───────────────────────────────────────────────────────────────────

console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║  🔬 ПЪЛЕН АНАЛИЗ НА ПРОЕКТА                                                  ║
║  Root: ${ROOT.slice(0, 60).padEnd(60)}║
╚══════════════════════════════════════════════════════════════════════════════╝
`);

ensureDir(ANALYSIS_DIR);
ensureDir(DOCS_DIR);

// 1) Live taxonomy (без child process — директно)
const taxonomy = getLiveTaxonomy();
console.log(`\n✓ Vortex live scan: ${taxonomy.total} модула`);

// 2) Опционално пускане на останалите (ако искаш всичко наведнъж)
const skipSubScripts = process.argv.includes('--docs-only');
if (!skipSubScripts) {
  runStep('Architecture reorganizer (analyze)', 'node scripts/analysis/architecture-reorganizer.js analyze');
  runStep('Nucleus mapper', 'node scripts/analysis/nucleus-mapper.js');
  runStep('Vortex count (print)', 'npx tsx scripts/vortex-count-modules.ts');
}

// 3) Top-level папки
const topDirs = getTopLevelDirs();

// 4) Генериране на PROJECT_STRUCTURE.md
const md = generateStructureMd(taxonomy, topDirs);
fs.writeFileSync(OUT_FILE, md, 'utf8');
console.log(`\n✅ docs/PROJECT_STRUCTURE.md обновен.`);

console.log('\nГотово. За само документ без под-скриптове: npx tsx scripts/run-full-analysis.ts --docs-only\n');
