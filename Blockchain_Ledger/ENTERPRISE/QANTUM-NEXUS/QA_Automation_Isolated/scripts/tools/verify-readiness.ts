import { HybridGodModeWrapper } from "./HybridGodModeWrapper";

/**
 * @wrapper Hybrid_verify_readiness
 * @description Auto-generated God-Mode Hybrid.
 * @origin "verify-readiness.js"
 */
export class Hybrid_verify_readiness extends HybridGodModeWrapper {
    async execute(): Promise<void> {
        try {
            console.log("/// [HYBRID_CORE] Executing Logics from Hybrid_verify_readiness ///");
            
            // --- START LEGACY INJECTION ---
            /**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║  QAntum Prime v28.1.0 SUPREME - READINESS VERIFICATION                    ║
 * ║  Проверява всички системи преди полет                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CORE_PATH = 'C:\\MisteMind';

const REQUIRED_FILES = [
  'package.json',
  '.env.template',
  'data/backpack.json',
  'tools/qantum-cli.js',
  'scripts/count-loc.js',
  'MISTER-MIND-LEGACY.json',
];

const REQUIRED_SCRIPTS = [
  'production:launch',
  'empire:sync',
  'empire:audit',
  'empire:status',
  'loc:count',
  'qantum',
  'qantum:watch',
];

const INTELLIGENCE_MODULES = [
  'src/intelligence/VectorSync.ts',
  'src/intelligence/DeepSeekLink.ts',
  'src/intelligence/SovereignAudit.ts',
  'src/intelligence/CrossProjectSynergy.ts',
  'src/intelligence/PricingSyncEngine.ts',
  'src/intelligence/HealthMonitor.ts',
];

// ═══════════════════════════════════════════════════════════════════════════
// VERIFICATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function checkFiles() {
  console.log('\n📁 CHECKING REQUIRED FILES:');
  console.log('────────────────────────────────────────');
  
  let allExist = true;
  
  for (const file of REQUIRED_FILES) {
    const fullPath = path.join(CORE_PATH, file);
    const exists = fs.existsSync(fullPath);
    
    if (exists) {
      const stats = fs.statSync(fullPath);
      console.log(`   ✅ ${file} (${formatSize(stats.size)})`);
    } else {
      console.log(`   ❌ ${file} - MISSING`);
      allExist = false;
    }
  }
  
  return allExist;
}

function checkIntelligenceModules() {
  console.log('\n🧠 CHECKING INTELLIGENCE MODULES:');
  console.log('────────────────────────────────────────');
  
  let allExist = true;
  let totalSize = 0;
  
  for (const module of INTELLIGENCE_MODULES) {
    const fullPath = path.join(CORE_PATH, module);
    const exists = fs.existsSync(fullPath);
    
    if (exists) {
      const stats = fs.statSync(fullPath);
      totalSize += stats.size;
      console.log(`   ✅ ${path.basename(module)} (${formatSize(stats.size)})`);
    } else {
      console.log(`   ❌ ${path.basename(module)} - MISSING`);
      allExist = false;
    }
  }
  
  console.log(`   ────────────────────────────────────`);
  console.log(`   📊 Total Intelligence: ${formatSize(totalSize)}`);
  
  return allExist;
}

function checkNpmScripts() {
  console.log('\n📜 CHECKING NPM SCRIPTS:');
  console.log('────────────────────────────────────────');
  
  const packagePath = path.join(CORE_PATH, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  const scripts = pkg.scripts || {};
  
  let allExist = true;
  
  for (const script of REQUIRED_SCRIPTS) {
    if (scripts[script]) {
      const cmd = scripts[script].substring(0, 50);
      console.log(`   ✅ npm run ${script}`);
      console.log(`      → ${cmd}${scripts[script].length > 50 ? '...' : ''}`);
    } else {
      console.log(`   ❌ npm run ${script} - MISSING`);
      allExist = false;
    }
  }
  
  return allExist;
}

function checkEnvSetup() {
  console.log('\n🔐 CHECKING ENVIRONMENT:');
  console.log('────────────────────────────────────────');
  
  const templatePath = path.join(CORE_PATH, '.env.template');
  const envPath = path.join(CORE_PATH, '.env');
  
  const hasTemplate = fs.existsSync(templatePath);
  const hasEnv = fs.existsSync(envPath);
  
  console.log(`   ${hasTemplate ? '✅' : '❌'} .env.template exists`);
  console.log(`   ${hasEnv ? '✅' : '⚠️'} .env exists ${hasEnv ? '' : '(copy from template)'}`);
  
  if (hasEnv) {
    // Check if keys are filled
    const content = fs.readFileSync(envPath, 'utf-8');
    const hasDeepSeek = content.includes('DEEPSEEK_API_KEY=') && 
                        !content.includes('DEEPSEEK_API_KEY=your_');
    const hasPinecone = content.includes('PINECONE_API_KEY=') && 
                        !content.includes('PINECONE_API_KEY=your_');
    
    console.log(`   ${hasDeepSeek ? '✅' : '⚠️'} DEEPSEEK_API_KEY ${hasDeepSeek ? 'configured' : 'not set'}`);
    console.log(`   ${hasPinecone ? '✅' : '⚠️'} PINECONE_API_KEY ${hasPinecone ? 'configured' : 'not set'}`);
    
    return hasDeepSeek && hasPinecone;
  }
  
  return false;
}

function checkBackpack() {
  console.log('\n🎒 CHECKING BACKPACK:');
  console.log('────────────────────────────────────────');
  
  const backpackPath = path.join(CORE_PATH, 'data', 'backpack.json');
  
  if (!fs.existsSync(backpackPath)) {
    console.log('   ❌ backpack.json not found');
    return false;
  }
  
  try {
    const backpack = JSON.parse(fs.readFileSync(backpackPath, 'utf-8'));
    
    console.log(`   ✅ Version: ${backpack.version}`);
    console.log(`   ✅ Max Slots: ${backpack.maxSlots}`);
    console.log(`   ✅ Current Messages: ${backpack.messages?.length || 0}`);
    console.log(`   ✅ Last LOC Count: ${backpack.lastLOCCount?.totals?.totalLines?.toLocaleString() || 'N/A'} lines`);
    
    return true;
  } catch (error) {
    console.log(`   ❌ Invalid JSON: ${error.message}`);
    return false;
  }
}

function checkLegacy() {
  console.log('\n📜 CHECKING LEGACY DATA:');
  console.log('────────────────────────────────────────');
  
  const legacyPath = path.join(CORE_PATH, 'MISTER-MIND-LEGACY.json');
  
  if (!fs.existsSync(legacyPath)) {
    console.log('   ❌ MISTER-MIND-LEGACY.json not found');
    return false;
  }
  
  try {
    const legacy = JSON.parse(fs.readFileSync(legacyPath, 'utf-8'));
    
    if (legacy.locCount) {
      const loc = legacy.locCount;
      console.log(`   ✅ LOC Verified: ${loc.verified}`);
      console.log(`   ✅ Total Files: ${loc.totals?.files?.toLocaleString()}`);
      console.log(`   ✅ Total Lines: ${loc.totals?.totalLines?.toLocaleString()}`);
      console.log(`   ✅ Code Lines: ${loc.totals?.codeLines?.toLocaleString()}`);
      console.log(`   ✅ Last Count: ${new Date(loc.timestamp).toLocaleString()}`);
    }
    
    return true;
  } catch (error) {
    console.log(`   ❌ Invalid JSON: ${error.message}`);
    return false;
  }
}

function testCLI() {
  console.log('\n🖥️ TESTING CLI:');
  console.log('────────────────────────────────────────');
  
  try {
    const result = execSync('node tools/qantum-cli.js --status', {
      cwd: CORE_PATH,
      encoding: 'utf-8',
      timeout: 10000,
    });
    
    console.log('   ✅ qantum --status: WORKING');
    return true;
  } catch (error) {
    console.log(`   ❌ CLI Error: ${error.message}`);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════════════════

console.log('╔═══════════════════════════════════════════════════════════════════════════╗');
console.log('║  🚀 QAntum Prime - READINESS VERIFICATION                                 ║');
console.log('║  Проверка на всички системи преди полет                                   ║');
console.log('╚═══════════════════════════════════════════════════════════════════════════╝');

const results = {
  files: checkFiles(),
  intelligence: checkIntelligenceModules(),
  scripts: checkNpmScripts(),
  env: checkEnvSetup(),
  backpack: checkBackpack(),
  legacy: checkLegacy(),
  cli: testCLI(),
};

// Calculate overall readiness
const passed = Object.values(results).filter(Boolean).length;
const total = Object.keys(results).length;
const percentage = Math.round((passed / total) * 100);

console.log('\n════════════════════════════════════════════════════════════════════════════');
console.log('📊 READINESS SUMMARY:');
console.log('════════════════════════════════════════════════════════════════════════════');
console.log(`   Files:        ${results.files ? '✅ PASS' : '❌ FAIL'}`);
console.log(`   Intelligence: ${results.intelligence ? '✅ PASS' : '❌ FAIL'}`);
console.log(`   NPM Scripts:  ${results.scripts ? '✅ PASS' : '❌ FAIL'}`);
console.log(`   Environment:  ${results.env ? '✅ PASS' : '⚠️ INCOMPLETE'}`);
console.log(`   Backpack:     ${results.backpack ? '✅ PASS' : '❌ FAIL'}`);
console.log(`   Legacy Data:  ${results.legacy ? '✅ PASS' : '❌ FAIL'}`);
console.log(`   CLI:          ${results.cli ? '✅ PASS' : '❌ FAIL'}`);
console.log('────────────────────────────────────────────────────────────────────────────');
console.log(`   OVERALL: ${passed}/${total} checks passed (${percentage}%)`);

if (percentage === 100) {
  console.log('\n   🎯 STATUS: READY FOR FLIGHT! 🚀');
} else if (percentage >= 80) {
  console.log('\n   ⚠️ STATUS: ALMOST READY - Fill in API keys in .env');
} else {
  console.log('\n   ❌ STATUS: NOT READY - Fix missing components');
}

console.log('\n════════════════════════════════════════════════════════════════════════════');

// Exit with appropriate code
process.exit(percentage >= 80 ? 0 : 1);

            // --- END LEGACY INJECTION ---

            await this.recordAxiom({ 
                status: 'SUCCESS', 
                origin: 'Hybrid_verify_readiness',
                timestamp: Date.now()
            });
        } catch (error) {
            console.error("/// [HYBRID_FAULT] Critical Error in Hybrid_verify_readiness ///", error);
            await this.recordAxiom({ 
                status: 'CRITICAL_FAILURE', 
                error: String(error),
                origin: 'Hybrid_verify_readiness'
            });
            throw error;
        }
    }
}
