/**
 * 🏗️ QANTUM ARCHITECTURE REORGANIZER v34.2
 * =========================================
 * Автоматично реорганизира цялата кодова база.
 * Използва текущия проект (process.cwd()) и съвместими ignore списъци с vortex-config.
 *
 * Usage: node scripts/architecture-reorganizer.js [analyze|execute|clean|test]
 *        npm run analyze:architecture
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = process.cwd();
const IGNORE_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage',
  '.vscode', '.cursor', '__pycache__', '.venv', 'analysis-output',
  '_BACKUPS', '.ascension-backup', '_ARCHIVE'
]);

// ═══════════════════════════════════════════════════════════════════════════════
// STRUCTURE DEFINITION
// ═══════════════════════════════════════════════════════════════════════════════

const STRUCTURE = {
    // 👁️👂👄🧠 СЕТИВА
    'core/eyes': ['watch', 'observe', 'file-watch', 'detector', 'scanner', 'monitor'],
    'core/ears': ['websocket', 'event-bus', 'listener', 'webhook', 'input', 'receiver', 'socket'],
    'core/mouth': ['server', 'api', 'notify', 'report', 'output', 'send', 'response'],
    'core/brain': ['command-center', 'orchestrat', 'main', 'controller', 'router'],

    // 🛡️ SECURITY
    'security/auth': ['auth', 'jwt', 'token', 'login', 'session', 'zero-trust', 'permission'],
    'security/encryption': ['encrypt', 'decrypt', 'aes', 'hash', 'crypto', 'cipher'],
    'security/firewall': ['firewall', 'block', 'filter', 'rate-limit', 'intrusion', 'guard'],
    'security/guardians': ['watchdog', 'collar', 'health', 'sentinel', 'kill-switch'],

    // 🧠 BRAIN  
    'brain/logic': ['logic', 'decision', 'validate', 'rule', 'process', 'engine', 'analyzer'],
    'brain/memory': ['memory', 'cache', 'state', 'store', 'memoryals', 'persist', 'storage'],
    'brain/learning': ['learn', 'pattern', 'evolve', 'optimize', 'genetic', 'neural', 'ml'],
    'brain/connections': ['deepseek', 'ollama', 'ai-', 'llm', 'model', 'gpt', 'claude'],

    // ⚡ SKILLS
    'skills/network': ['port-scan', 'subnet', 'dns', 'ping', 'network', 'ip-', 'trace'],
    'skills/scraping': ['scrape', 'hunt', 'extract', 'crawler', 'spider', 'lead', 'email'],
    'skills/automation': ['daemon', 'assimilator', 'auto', 'schedule', 'cron', 'task', 'job'],
    'skills/business': ['arbitrage', 'wallet', 'payment', 'crm', 'sales', 'invoice', 'profit']
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function getFileHash(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    return crypto.createHash('md5').update(content).digest('hex');
}

function classifyFile(fileName, content) {
    const nameLower = fileName.toLowerCase();
    const contentLower = (content || '').substring(0, 3000).toLowerCase();
    
    for (const [category, keywords] of Object.entries(STRUCTURE)) {
        for (const kw of keywords) {
            if (nameLower.includes(kw) || contentLower.includes(kw)) {
                return category;
            }
        }
    }
    
    return 'unclassified';
}

function getAllFiles(dir, files = []) {
    try {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
            if (item.isDirectory()) {
                if (IGNORE_DIRS.has(item.name)) continue;
                getAllFiles(path.join(dir, item.name), files);
            } else if (item.isFile() && /\.(ts|js)$/.test(item.name) && !item.name.includes('.d.ts')) {
                files.push(path.join(dir, item.name));
            }
        }
    } catch (e) {}
    return files;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMMANDS
// ═══════════════════════════════════════════════════════════════════════════════

function analyze() {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║  🔍 ANALYZING CODEBASE                                       ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    const files = getAllFiles(ROOT);
    const hashes = new Map();
    const duplicates = [];
    const classified = {};
    
    console.log(`📁 Found ${files.length} source files\n`);
    
    // Find duplicates and classify
    for (const filePath of files) {
        try {
            const hash = getFileHash(filePath);
            const fileName = path.basename(filePath);
            const content = fs.readFileSync(filePath, 'utf8');
            
            if (hashes.has(hash)) {
                duplicates.push({
                    original: hashes.get(hash),
                    duplicate: filePath
                });
            } else {
                hashes.set(hash, filePath);
                
                const category = classifyFile(fileName, content);
                if (!classified[category]) classified[category] = [];
                classified[category].push({ path: filePath, name: fileName });
            }
        } catch (e) {}
    }
    
    // Report duplicates
    console.log('🔄 DUPLICATES FOUND: ' + duplicates.length);
    duplicates.slice(0, 10).forEach(d => {
        console.log(`   ${path.basename(d.duplicate)} = ${path.basename(d.original)}`);
    });
    if (duplicates.length > 10) console.log(`   ... and ${duplicates.length - 10} more\n`);
    
    // Report classification
    console.log('\n📊 CLASSIFICATION:');
    for (const [cat, files] of Object.entries(classified).sort((a, b) => b[1].length - a[1].length)) {
        console.log(`   ${cat}: ${files.length} files`);
    }
    
    // Save report (analysis-output съвместим с vortex)
    const outDir = path.join(ROOT, 'analysis-output');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const reportPath = path.join(outDir, 'architecture-report.json');
    const report = { duplicates, classified, root: ROOT, timestamp: new Date().toISOString() };
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log('\n💾 Report saved to analysis-output/architecture-report.json');
    
    return report;
}

function execute() {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║  🚀 EXECUTING REORGANIZATION                                 ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    // Create directories
    console.log('📁 Creating directory structure...');
    for (const category of Object.keys(STRUCTURE)) {
        const dir = path.join(ROOT, category);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`   ✅ ${category}`);
        }
    }
    
    // Load report
    let report;
    try {
        report = JSON.parse(fs.readFileSync(path.join(ROOT, 'analysis-output', 'architecture-report.json'), 'utf8'));
    } catch (e) {
        console.log('❌ Run "analyze" first!');
        return;
    }
    
    let moved = 0, skipped = 0;
    
    // Move files to new locations
    console.log('\n📦 Moving files...');
    for (const [category, files] of Object.entries(report.classified)) {
        if (category === 'unclassified') continue;
        
        const targetDir = path.join(ROOT, category);
        
        for (const file of files) {
            try {
                const srcPath = file.path;
                const destPath = path.join(targetDir, file.name);
                
                // Skip if already in correct place or dest exists
                if (srcPath.includes(category) || fs.existsSync(destPath)) {
                    skipped++;
                    continue;
                }
                
                // Copy (not move, for safety)
                fs.copyFileSync(srcPath, destPath);
                moved++;
            } catch (e) {}
        }
    }
    
    console.log(`\n✅ Moved: ${moved} files`);
    console.log(`⏭️  Skipped: ${skipped} files`);
    
    // Create index files
    createIndexFiles();
}

function createIndexFiles() {
    console.log('\n📝 Creating index files...');
    
    for (const category of Object.keys(STRUCTURE)) {
        const dir = path.join(ROOT, category);
        if (!fs.existsSync(dir)) continue;
        
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
        if (files.length === 0) continue;
        
        const indexContent = `/**
 * 🔥 QANTUM ${category.toUpperCase().replace('/', ' > ')}
 * Auto-generated index file
 */

${files.slice(0, 30).map(f => `// export * from './${f.replace(/\.(ts|js)$/, '')}';`).join('\n')}
`;
        
        fs.writeFileSync(path.join(dir, '_index.ts'), indexContent);
        console.log(`   ✅ ${category}/_index.ts (${files.length} exports)`);
    }
}

function clean() {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║  🧹 CLEANING DUPLICATES                                      ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    let report;
    try {
        report = JSON.parse(fs.readFileSync(path.join(ROOT, 'analysis-output', 'architecture-report.json'), 'utf8'));
    } catch (e) {
        console.log('❌ Run "analyze" first!');
        return;
    }
    
    console.log(`Found ${report.duplicates.length} duplicates to review\n`);
    
    // Just report, don't delete automatically (too dangerous)
    report.duplicates.slice(0, 20).forEach((d, i) => {
        console.log(`${i + 1}. DUPLICATE:`);
        console.log(`   Original:  ${d.original}`);
        console.log(`   Duplicate: ${d.duplicate}`);
        console.log('');
    });
    
    console.log('⚠️  Review and delete manually for safety!');
}

function test() {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║  🧪 TESTING ARCHITECTURE                                     ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    const tests = [];
    
    // Test 1: Directory structure exists
    console.log('📁 Test 1: Directory Structure');
    for (const category of Object.keys(STRUCTURE)) {
        const dir = path.join(ROOT, category);
        const exists = fs.existsSync(dir);
        console.log(`   ${exists ? '✅' : '❌'} ${category}`);
        tests.push({ name: `dir_${category}`, passed: exists });
    }
    
    // Test 2: No orphan files
    console.log('\n📄 Test 2: File Classification');
    const files = getAllFiles(ROOT);
    let classified = 0, unclassified = 0;
    
    for (const filePath of files) {
        const fileName = path.basename(filePath);
        const content = fs.readFileSync(filePath, 'utf8');
        const category = classifyFile(fileName, content);
        
        if (category === 'unclassified') {
            unclassified++;
        } else {
            classified++;
        }
    }
    
    const classificationRate = (classified / (classified + unclassified) * 100).toFixed(1);
    console.log(`   ✅ Classified: ${classified}`);
    console.log(`   ⚠️  Unclassified: ${unclassified}`);
    console.log(`   📊 Rate: ${classificationRate}%`);
    tests.push({ name: 'classification', passed: classificationRate > 80 });
    
    // Summary
    const passed = tests.filter(t => t.passed).length;
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`📊 TESTS: ${passed}/${tests.length} PASSED`);
    console.log('═══════════════════════════════════════════════════════════════');
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════════════════════

const command = process.argv[2] || 'help';

console.log('');
console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║  🏗️  QANTUM ARCHITECTURE REORGANIZER v34.1                   ║');
console.log('╚══════════════════════════════════════════════════════════════╝');

switch (command) {
    case 'analyze':
        analyze();
        break;
    case 'execute':
        execute();
        break;
    case 'clean':
        clean();
        break;
    case 'test':
        test();
        break;
    default:
        console.log('\n🛠️  COMMANDS:');
        console.log('   analyze  - Scan and classify all files');
        console.log('   execute  - Move files to new structure');
        console.log('   clean    - List duplicates for removal');
        console.log('   test     - Verify architecture integrity');
        console.log('\n📌 USAGE:');
        console.log('   node architecture-reorganizer.js analyze');
        console.log('   node architecture-reorganizer.js execute');
}
