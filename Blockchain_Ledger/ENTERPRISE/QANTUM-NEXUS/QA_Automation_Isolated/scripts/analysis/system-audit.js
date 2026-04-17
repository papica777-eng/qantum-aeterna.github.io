#!/usr/bin/env node
/**
 * 🔗 SYSTEM CONNECTION AUDIT
 * Проверява дали всички модули са свързани правилно.
 * Използва текущия проект (process.cwd()).
 */

const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const join = (...p) => path.join(ROOT, ...p);

console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║           🔗 SYSTEM CONNECTION AUDIT v34.1                                   ║
║                                                                              ║
║         "Всичко е зависимост. Квантово сплитане."                            ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);

// Core modules to check (paths relative to project root)
const CORE_MODULES = [
    { name: 'Memoryals', path: 'src/core/Memoryals.ts', type: 'core' },
    { name: 'CableSystem', path: 'src/core/CableSystem.ts', type: 'core' },
    { name: 'ModuleClasses', path: 'src/core/ModuleClasses.ts', type: 'core' },
    { name: 'PredictiveCables', path: 'src/core/PredictiveCables.ts', type: 'core' },
    { name: 'nerve-center', path: 'src/core/nerve-center.ts', type: 'core' },
    { name: 'EcosystemHarmonizer', path: 'src/intelligence/EcosystemHarmonizer.ts', type: 'intelligence' },
    { name: 'EcosystemSyncValidator', path: 'src/intelligence/EcosystemSyncValidator.ts', type: 'intelligence' },
    { name: 'SovereignMagnet', path: 'src/omega/SovereignMagnet.ts', type: 'omega' },
];

const SCRIPTS = [
    { name: 'change-detector', path: 'scripts/change-detector.ts' },
    { name: 'existence-checker', path: 'scripts/existence-checker.ts' },
    { name: 'command-center-server', path: 'scripts/command-center-server.js' },
];

const NERVE_TEMPLATES = [
    'intelligence-template.ts',
    'omega-template.ts',
    'physics-template.ts',
    'fortress-template.ts',
    'biology-template.ts',
    'guardians-template.ts',
    'reality-template.ts',
    'chemistry-template.ts'
];

const DATA_PATHS = [
    'data/memoryals',
    'data/nerve-signals',
    'data/nerve-center-state.json',
    'data/predictive-memory.json',
    'data/ecosystem-manifest.json'
];

const DASHBOARDS = [
    'dashboard/nerve-center.html',
    'dashboard/script-command-center.html',
    'dashboard/guardian-dashboard.html'
];

let stats = { connected: 0, missing: 0, warnings: [] };

// Check core modules
console.log('🔬 CORE MODULES:');
console.log('─'.repeat(60));
CORE_MODULES.forEach(m => {
    const fullPath = join(m.path);
    const exists = fs.existsSync(fullPath);
    const icon = exists ? '✅' : '❌';
    console.log(`  ${icon} ${m.name.padEnd(25)} [${m.type}]`);
    if (exists) stats.connected++; else { stats.missing++; stats.warnings.push(m.name); }
});

// Check scripts
console.log('\n📜 SCRIPTS:');
console.log('─'.repeat(60));
SCRIPTS.forEach(s => {
    const exists = fs.existsSync(join(s.path));
    const icon = exists ? '✅' : '❌';
    console.log(`  ${icon} ${s.name}`);
    if (exists) stats.connected++; else { stats.missing++; stats.warnings.push(s.name); }
});

// Check nerve templates
console.log('\n🧠 NERVE TEMPLATES:');
console.log('─'.repeat(60));
const templatesDir = join('scripts', 'nerve-templates');
NERVE_TEMPLATES.forEach(t => {
    const fullPath = path.join(templatesDir, t);
    const exists = fs.existsSync(fullPath);
    const icon = exists ? '✅' : '❌';
    console.log(`  ${icon} ${t}`);
    if (exists) stats.connected++; else { stats.missing++; stats.warnings.push(t); }
});

// Check data paths
console.log('\n💾 DATA STORAGE:');
console.log('─'.repeat(60));
DATA_PATHS.forEach(d => {
    const exists = fs.existsSync(join(d));
    const icon = exists ? '✅' : '❌';
    console.log(`  ${icon} ${d}`);
    if (exists) stats.connected++; else { stats.missing++; stats.warnings.push(d); }
});

// Check dashboards
console.log('\n🖥️ DASHBOARDS:');
console.log('─'.repeat(60));
DASHBOARDS.forEach(d => {
    const exists = fs.existsSync(join(d));
    const icon = exists ? '✅' : '❌';
    console.log(`  ${icon} ${d}`);
    if (exists) stats.connected++; else { stats.missing++; stats.warnings.push(d); }
});

// Check imports/connections
console.log('\n🔗 IMPORT CONNECTIONS:');
console.log('─'.repeat(60));
const importChecks = [
    { file: 'src/core/Memoryals.ts', shouldExport: 'memoryals' },
    { file: 'src/core/CableSystem.ts', shouldExport: 'CableSystem' },
    { file: 'src/core/PredictiveCables.ts', shouldExport: 'PredictiveCables' },
];

importChecks.forEach(check => {
    const fullPath = join(check.file);
    if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const hasExport = content.includes(`export`) && content.includes(check.shouldExport);
        const icon = hasExport ? '✅' : '⚠️';
        console.log(`  ${icon} ${check.file} exports ${check.shouldExport}`);
    }
});

// Summary
const total = stats.connected + stats.missing;
const percentage = Math.round((stats.connected / total) * 100);

console.log('\n' + '═'.repeat(60));
console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║  📊 AUDIT SUMMARY                                                            ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Connected:  ${stats.connected.toString().padEnd(5)} / ${total}                                                  ║
║  Missing:    ${stats.missing.toString().padEnd(5)}                                                           ║
║  Health:     ${percentage}%                                                            ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);

if (stats.warnings.length > 0) {
    console.log('⚠️ MISSING COMPONENTS:');
    stats.warnings.forEach(w => console.log(`   - ${w}`));
}

if (percentage === 100) {
    console.log('☀️ SYSTEM PERFECTLY CONNECTED! All modules operational.');
} else if (percentage >= 80) {
    console.log('🟡 System mostly connected. Minor issues detected.');
} else {
    console.log('🔴 System has connection issues. Review missing components.');
}

// Return exit code
process.exit(stats.missing > 0 ? 1 : 0);
