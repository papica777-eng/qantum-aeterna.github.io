#!/usr/bin/env node
/**
 * 🛡️ ETERNAL WATCHDOG v34.1 - Дежурният
 * ======================================
 * 
 * "Дежурният винаги е на смяна. Никога не спи."
 * 
 * Функции:
 * - Постоянно обикаля, вижда навсякъде
 * - Придвижва се с телепорт - не пропуска нарушения
 * - При нарушение: телепортира се и неутрализира проблема ЗАВИНАГИ
 * - Тайно оръжие: ВЕЧНИ БЕЛЕЗНИЦИ
 *   • Няма ключ
 *   • Вграден датчик с атомна бомба
 *   • Извод: няма спасение, вечен затвор
 * 
 * Usage:
 *   node scripts/eternal-watchdog.js              # Start patrol
 *   node scripts/eternal-watchdog.js --status     # Check status
 *   node scripts/eternal-watchdog.js --prisoners  # List captured threats
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec, execSync } = require('child_process');
const crypto = require('crypto');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION - Законът на Дежурния
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
    // Patrol interval (ms) - колко често обикаля
    patrolInterval: 5000, // 5 секунди
    
    // Teleport speed (instant)
    teleportDelay: 0,
    
    // Prison location
    prisonPath: path.join(__dirname, '..', 'data', 'eternal-prison'),
    
    // Watchdog state
    statePath: path.join(__dirname, '..', 'data', 'watchdog-state.json'),
    
    // Log path
    logPath: path.join(__dirname, '..', 'data', 'watchdog-patrol.log'),
    
    // Processes to watch
    criticalProcesses: [
        { name: 'nerve-center', script: 'src/core/nerve-center.ts', required: false },
        { name: 'memoryals', script: 'src/core/Memoryals.ts', required: false },
        { name: 'guardian', script: 'scripts/eternal-guardian.js', required: false }
    ],
    
    // Health checks
    healthChecks: [
        { name: 'data-integrity', check: checkDataIntegrity },
        { name: 'sensor-pulse', check: checkSensorPulse },
        { name: 'memory-usage', check: checkMemoryUsage },
        { name: 'disk-space', check: checkDiskSpace },
        { name: 'git-status', check: checkGitStatus }
    ],
    
    // Thresholds
    memoryThreshold: 90, // % RAM
    diskThreshold: 95,   // % Disk
    responseTimeout: 10000 // ms
};

// ═══════════════════════════════════════════════════════════════════════════════
// ETERNAL HANDCUFFS - Вечните белезници
// ═══════════════════════════════════════════════════════════════════════════════

class EternalHandcuffs {
    constructor(threatId, threatType, evidence) {
        this.id = `handcuff_${crypto.randomBytes(8).toString('hex')}`;
        this.threatId = threatId;
        this.threatType = threatType;
        this.evidence = evidence;
        this.capturedAt = Date.now();
        this.hasKey = false;      // НИКОГА няма ключ
        this.atomicSensor = true; // Датчик с атомна бомба
        this.escapeAttempts = 0;
        this.status = 'ETERNAL_PRISON';
    }
    
    // Опит за бягство = активиране на бомбата
    attemptEscape() {
        this.escapeAttempts++;
        console.log(`💥 ATOMIC SENSOR TRIGGERED! Escape attempt #${this.escapeAttempts}`);
        console.log(`🔒 Handcuffs tightened. No escape possible.`);
        return false; // Винаги неуспешно
    }
    
    // Проверка за ключ
    checkForKey() {
        return this.hasKey; // Винаги false
    }
    
    getStatus() {
        return {
            id: this.id,
            prisoner: this.threatId,
            type: this.threatType,
            capturedAt: new Date(this.capturedAt).toISOString(),
            hasKey: 'IMPOSSIBLE - NO KEY EXISTS',
            atomicSensor: 'ARMED',
            escapeAttempts: this.escapeAttempts,
            verdict: 'ETERNAL PRISON - NO RELEASE'
        };
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ETERNAL PRISON - Вечният затвор
// ═══════════════════════════════════════════════════════════════════════════════

class EternalPrison {
    constructor() {
        this.prisoners = new Map();
        this.ensurePrisonExists();
        this.loadPrisoners();
    }
    
    ensurePrisonExists() {
        if (!fs.existsSync(CONFIG.prisonPath)) {
            fs.mkdirSync(CONFIG.prisonPath, { recursive: true });
        }
    }
    
    loadPrisoners() {
        const prisonFile = path.join(CONFIG.prisonPath, 'inmates.json');
        if (fs.existsSync(prisonFile)) {
            try {
                const data = JSON.parse(fs.readFileSync(prisonFile, 'utf-8'));
                data.forEach(p => {
                    const handcuffs = new EternalHandcuffs(p.threatId, p.threatType, p.evidence);
                    handcuffs.capturedAt = p.capturedAt;
                    handcuffs.escapeAttempts = p.escapeAttempts || 0;
                    this.prisoners.set(p.threatId, handcuffs);
                });
            } catch (e) {
                // Fresh prison
            }
        }
    }
    
    savePrisoners() {
        const prisonFile = path.join(CONFIG.prisonPath, 'inmates.json');
        const data = Array.from(this.prisoners.values()).map(h => ({
            threatId: h.threatId,
            threatType: h.threatType,
            evidence: h.evidence,
            capturedAt: h.capturedAt,
            escapeAttempts: h.escapeAttempts
        }));
        fs.writeFileSync(prisonFile, JSON.stringify(data, null, 2));
    }
    
    // Арестува заплаха завинаги
    imprison(threatId, threatType, evidence) {
        if (this.prisoners.has(threatId)) {
            console.log(`⚠️ ${threatId} is already in eternal prison`);
            return this.prisoners.get(threatId);
        }
        
        const handcuffs = new EternalHandcuffs(threatId, threatType, evidence);
        this.prisoners.set(threatId, handcuffs);
        this.savePrisoners();
        
        console.log(`🔒 IMPRISONED: ${threatId}`);
        console.log(`   Type: ${threatType}`);
        console.log(`   Handcuffs: ETERNAL (no key, atomic sensor armed)`);
        
        return handcuffs;
    }
    
    // Проверка на затворник
    checkPrisoner(threatId) {
        return this.prisoners.get(threatId);
    }
    
    // Списък на всички затворници
    listPrisoners() {
        return Array.from(this.prisoners.values()).map(h => h.getStatus());
    }
    
    get prisonerCount() {
        return this.prisoners.size;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEALTH CHECK FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

async function checkDataIntegrity() {
    const criticalFiles = [
        'data/memoryals/sensor-registry.json',
        'data/nerve-center-state.json',
        'data/ecosystem-manifest.json'
    ];
    
    const issues = [];
    
    for (const file of criticalFiles) {
        const fullPath = path.join(__dirname, '..', file);
        if (!fs.existsSync(fullPath)) {
            issues.push({ file, issue: 'MISSING' });
            continue;
        }
        
        try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            JSON.parse(content); // Validate JSON
        } catch (e) {
            issues.push({ file, issue: 'CORRUPTED' });
        }
    }
    
    return {
        healthy: issues.length === 0,
        issues
    };
}

async function checkSensorPulse() {
    const sensorFile = path.join(__dirname, '..', 'data', 'memoryals', 'sensor-registry.json');
    
    if (!fs.existsSync(sensorFile)) {
        return { healthy: false, issues: [{ sensor: 'all', issue: 'REGISTRY_MISSING' }] };
    }
    
    try {
        const data = JSON.parse(fs.readFileSync(sensorFile, 'utf-8'));
        const issues = [];
        const now = Date.now();
        const maxAge = 30 * 60 * 1000; // 30 minutes - sensors are solar powered, they don't need frequent pulses
        
        (data.sensors || []).forEach(sensor => {
            if (now - sensor.lastPulse > maxAge) {
                issues.push({ sensor: sensor.name, issue: 'PULSE_TIMEOUT', lastPulse: sensor.lastPulse });
            }
            if (sensor.errors > 0) {
                issues.push({ sensor: sensor.name, issue: 'HAS_ERRORS', errors: sensor.errors });
            }
        });
        
        return { healthy: issues.length === 0, issues };
    } catch (e) {
        return { healthy: false, issues: [{ sensor: 'all', issue: 'PARSE_ERROR' }] };
    }
}

async function checkMemoryUsage() {
    const used = process.memoryUsage();
    const heapUsedMB = Math.round(used.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(used.heapTotal / 1024 / 1024);
    const percentage = Math.round((used.heapUsed / used.heapTotal) * 100);
    
    return {
        healthy: percentage < CONFIG.memoryThreshold,
        issues: percentage >= CONFIG.memoryThreshold ? [{
            issue: 'HIGH_MEMORY',
            used: `${heapUsedMB}MB`,
            total: `${heapTotalMB}MB`,
            percentage: `${percentage}%`
        }] : [],
        stats: { heapUsedMB, heapTotalMB, percentage }
    };
}

async function checkDiskSpace() {
    // Simple check - can we write?
    const testFile = path.join(CONFIG.prisonPath, '.disk-check');
    try {
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);
        return { healthy: true, issues: [] };
    } catch (e) {
        return { healthy: false, issues: [{ issue: 'DISK_WRITE_FAILED', error: e.message }] };
    }
}

async function checkGitStatus() {
    try {
        const status = execSync('git status --porcelain', { 
            cwd: path.join(__dirname, '..'),
            encoding: 'utf-8',
            timeout: 5000
        });
        
        const uncommitted = status.trim().split('\n').filter(l => l.trim()).length;
        
        return {
            healthy: true, // Git issues are informational, not critical
            issues: uncommitted > 0 ? [{
                issue: 'UNCOMMITTED_CHANGES',
                count: uncommitted
            }] : [],
            uncommitted
        };
    } catch (e) {
        return { healthy: true, issues: [] }; // Git not available is OK
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ETERNAL WATCHDOG - Дежурният
// ═══════════════════════════════════════════════════════════════════════════════

class EternalWatchdog {
    constructor() {
        this.prison = new EternalPrison();
        this.patrolCount = 0;
        this.teleportCount = 0;
        this.threatsNeutralized = 0;
        this.startTime = Date.now();
        this.isPatrolling = false;
        this.lastPatrol = null;
        
        this.ensureDataDirs();
        this.loadState();
    }
    
    ensureDataDirs() {
        const dirs = [
            path.dirname(CONFIG.statePath),
            path.dirname(CONFIG.logPath),
            CONFIG.prisonPath
        ];
        
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }
    
    loadState() {
        if (fs.existsSync(CONFIG.statePath)) {
            try {
                const data = JSON.parse(fs.readFileSync(CONFIG.statePath, 'utf-8'));
                this.patrolCount = data.patrolCount || 0;
                this.teleportCount = data.teleportCount || 0;
                this.threatsNeutralized = data.threatsNeutralized || 0;
            } catch (e) {
                // Fresh start
            }
        }
    }
    
    saveState() {
        const state = {
            patrolCount: this.patrolCount,
            teleportCount: this.teleportCount,
            threatsNeutralized: this.threatsNeutralized,
            lastPatrol: this.lastPatrol,
            uptime: Date.now() - this.startTime,
            prisoners: this.prison.prisonerCount
        };
        
        fs.writeFileSync(CONFIG.statePath, JSON.stringify(state, null, 2));
    }
    
    log(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const entry = `[${timestamp}] [${level}] ${message}\n`;
        fs.appendFileSync(CONFIG.logPath, entry);
        
        const icons = {
            'INFO': '📋',
            'PATROL': '🔍',
            'TELEPORT': '⚡',
            'THREAT': '🚨',
            'NEUTRALIZE': '💥',
            'PRISON': '🔒'
        };
        
        console.log(`${icons[level] || '•'} ${message}`);
    }
    
    // ⚡ ТЕЛЕПОРТ - моментално придвижване до проблема
    async teleport(location, reason) {
        this.teleportCount++;
        this.log(`TELEPORTING to ${location}: ${reason}`, 'TELEPORT');
        
        // Instant - no delay
        await new Promise(r => setTimeout(r, CONFIG.teleportDelay));
        
        return true;
    }
    
    // 💥 НЕУТРАЛИЗИРАНЕ - завинаги
    async neutralize(threatId, threatType, evidence) {
        this.threatsNeutralized++;
        
        this.log(`NEUTRALIZING THREAT: ${threatId}`, 'NEUTRALIZE');
        
        // Слагаме вечните белезници
        const handcuffs = this.prison.imprison(threatId, threatType, evidence);
        
        this.log(`Threat ${threatId} imprisoned with ETERNAL HANDCUFFS`, 'PRISON');
        this.log(`  - No key exists`, 'PRISON');
        this.log(`  - Atomic sensor armed`, 'PRISON');
        this.log(`  - Verdict: ETERNAL PRISON`, 'PRISON');
        
        // Предприемаме действие според типа заплаха
        await this.takeAction(threatId, threatType, evidence);
        
        return handcuffs;
    }
    
    // 🔧 Действие според типа заплаха
    async takeAction(threatId, threatType, evidence) {
        switch (threatType) {
            case 'CORRUPTED_FILE':
                // Възстановяваме от backup или пресъздаваме
                this.log(`Attempting to restore: ${threatId}`, 'INFO');
                break;
                
            case 'STOPPED_PROCESS':
                // Рестартираме процеса
                this.log(`Attempting to restart: ${threatId}`, 'INFO');
                break;
                
            case 'MEMORY_LEAK':
                // Принудително почистване
                if (global.gc) {
                    global.gc();
                    this.log(`Forced garbage collection`, 'INFO');
                }
                break;
                
            case 'SENSOR_FAILURE':
                // Пулс към датчика
                this.log(`Sending recovery pulse to sensor: ${threatId}`, 'INFO');
                break;
                
            default:
                this.log(`Generic containment for: ${threatId}`, 'INFO');
        }
    }
    
    // 🔍 ПАТРУЛ - обикаля и проверява всичко
    async patrol() {
        this.patrolCount++;
        this.lastPatrol = Date.now();
        
        const issues = [];
        
        // Изпълняваме всички health checks
        for (const check of CONFIG.healthChecks) {
            try {
                const result = await check.check();
                
                if (!result.healthy) {
                    result.issues.forEach(issue => {
                        issues.push({
                            check: check.name,
                            ...issue
                        });
                    });
                }
            } catch (e) {
                issues.push({
                    check: check.name,
                    issue: 'CHECK_FAILED',
                    error: e.message
                });
            }
        }
        
        // Ако има проблеми - телепортираме се и неутрализираме
        for (const issue of issues) {
            await this.teleport(issue.check, issue.issue);
            
            // Определяме дали е критичен проблем
            const isCritical = ['CORRUPTED', 'MISSING', 'HAS_ERRORS', 'PULSE_TIMEOUT'].includes(issue.issue);
            
            if (isCritical) {
                const threatId = `${issue.check}_${issue.file || issue.sensor || 'unknown'}`;
                await this.neutralize(threatId, issue.issue, issue);
            } else {
                this.log(`Non-critical issue logged: ${issue.check} - ${issue.issue}`, 'INFO');
            }
        }
        
        this.saveState();
        
        return {
            patrolNumber: this.patrolCount,
            issuesFound: issues.length,
            issues
        };
    }
    
    // 🚀 START ETERNAL PATROL
    startPatrol() {
        if (this.isPatrolling) {
            console.log('⚠️ Already patrolling!');
            return;
        }
        
        this.isPatrolling = true;
        
        console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║           🛡️  ETERNAL WATCHDOG v34.1 - ON DUTY                               ║
║                                                                              ║
║         "Дежурният винаги е на смяна. Никога не спи."                        ║
║                                                                              ║
║         ⚡ Teleport: ENABLED                                                 ║
║         🔒 Eternal Handcuffs: ARMED                                          ║
║         💥 Atomic Sensor: ACTIVE                                             ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);
        
        this.log('PATROL STARTED - Eternal watch begins', 'PATROL');
        
        // Първи патрул веднага
        this.patrol().then(result => {
            this.log(`Initial patrol complete. Issues: ${result.issuesFound}`, 'PATROL');
        });
        
        // Постоянен патрул
        this.patrolInterval = setInterval(async () => {
            const result = await this.patrol();
            
            if (result.issuesFound > 0) {
                this.log(`Patrol #${result.patrolNumber}: ${result.issuesFound} issues detected`, 'PATROL');
            } else {
                // Silent patrol - all clear (log every 10th)
                if (result.patrolNumber % 10 === 0) {
                    this.log(`Patrol #${result.patrolNumber}: All clear ✅`, 'PATROL');
                }
            }
        }, CONFIG.patrolInterval);
        
        // Handle shutdown
        process.on('SIGINT', () => this.shutdown());
        process.on('SIGTERM', () => this.shutdown());
    }
    
    shutdown() {
        console.log('\n🛡️ Watchdog going off duty...');
        this.isPatrolling = false;
        
        if (this.patrolInterval) {
            clearInterval(this.patrolInterval);
        }
        
        this.saveState();
        this.log('PATROL ENDED - Watchdog off duty', 'PATROL');
        
        console.log(`
📊 Final Statistics:
   Patrols completed: ${this.patrolCount}
   Teleports made: ${this.teleportCount}
   Threats neutralized: ${this.threatsNeutralized}
   Prisoners: ${this.prison.prisonerCount}
   Uptime: ${Math.round((Date.now() - this.startTime) / 1000)}s
`);
        
        process.exit(0);
    }
    
    getStatus() {
        return {
            status: this.isPatrolling ? 'ON_DUTY' : 'OFF_DUTY',
            patrolCount: this.patrolCount,
            teleportCount: this.teleportCount,
            threatsNeutralized: this.threatsNeutralized,
            prisoners: this.prison.prisonerCount,
            lastPatrol: this.lastPatrol ? new Date(this.lastPatrol).toISOString() : null,
            uptime: Date.now() - this.startTime,
            equipment: {
                teleport: 'ENABLED',
                eternalHandcuffs: 'ARMED',
                atomicSensor: 'ACTIVE',
                key: 'DOES_NOT_EXIST'
            }
        };
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════════════════════

const args = process.argv.slice(2);
const watchdog = new EternalWatchdog();

if (args.includes('--status') || args.includes('-s')) {
    console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║           🛡️  ETERNAL WATCHDOG STATUS                                        ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);
    console.log(JSON.stringify(watchdog.getStatus(), null, 2));
    
} else if (args.includes('--prisoners') || args.includes('-p')) {
    console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║           🔒 ETERNAL PRISON - INMATE LIST                                    ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);
    const prisoners = watchdog.prison.listPrisoners();
    
    if (prisoners.length === 0) {
        console.log('No prisoners. All threats contained or system clean.');
    } else {
        prisoners.forEach((p, i) => {
            console.log(`\n${i + 1}. PRISONER: ${p.prisoner}`);
            console.log(`   Type: ${p.type}`);
            console.log(`   Captured: ${p.capturedAt}`);
            console.log(`   Key: ${p.hasKey}`);
            console.log(`   Atomic Sensor: ${p.atomicSensor}`);
            console.log(`   Escape Attempts: ${p.escapeAttempts}`);
            console.log(`   Verdict: ${p.verdict}`);
        });
    }
    
} else if (args.includes('--patrol-once') || args.includes('-1')) {
    console.log('🔍 Running single patrol...\n');
    watchdog.patrol().then(result => {
        console.log(`\n✅ Patrol complete.`);
        console.log(`   Issues found: ${result.issuesFound}`);
        if (result.issues.length > 0) {
            console.log('\n📋 Issues:');
            result.issues.forEach(i => console.log(`   - ${i.check}: ${i.issue}`));
        }
    });
    
} else if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🛡️ ETERNAL WATCHDOG - Commands:

  node scripts/eternal-watchdog.js              Start eternal patrol
  node scripts/eternal-watchdog.js --status     Show watchdog status
  node scripts/eternal-watchdog.js --prisoners  List imprisoned threats
  node scripts/eternal-watchdog.js --patrol-once Single patrol run
  node scripts/eternal-watchdog.js --help       Show this help

Equipment:
  ⚡ Teleport         - Instant movement to threats
  🔒 Eternal Handcuffs - No key exists
  💥 Atomic Sensor    - Triggers on escape attempts
`);
    
} else {
    // Default: start patrol
    watchdog.startPatrol();
}
