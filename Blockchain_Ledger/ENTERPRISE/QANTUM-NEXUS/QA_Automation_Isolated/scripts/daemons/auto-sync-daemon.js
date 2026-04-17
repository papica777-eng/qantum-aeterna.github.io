/**
 * ╔═══════════════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                                       ║
 * ║     █████╗ ██╗   ██╗████████╗ ██████╗       ███████╗██╗   ██╗███╗   ██╗ ██████╗       ║
 * ║    ██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗      ██╔════╝╚██╗ ██╔╝████╗  ██║██╔════╝       ║
 * ║    ███████║██║   ██║   ██║   ██║   ██║█████╗███████╗ ╚████╔╝ ██╔██╗ ██║██║            ║
 * ║    ██╔══██║██║   ██║   ██║   ██║   ██║╚════╝╚════██║  ╚██╔╝  ██║╚██╗██║██║            ║
 * ║    ██║  ██║╚██████╔╝   ██║   ╚██████╔╝      ███████║   ██║   ██║ ╚████║╚██████╗       ║
 * ║    ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝       ╚══════╝   ╚═╝   ╚═╝  ╚═══╝ ╚═════╝       ║
 * ║                                                                                       ║
 * ║   🔄 АВТОМАТИЧНА СИНХРОНИЗАЦИЯ НА ИМПЕРИЯТА                                          ║
 * ║                                                                                       ║
 * ║   Следи за промени, автоматично commit-ва, и никога не забравя нищо!                  ║
 * ║                                                                                       ║
 * ║   Created: 2026-01-02 | QAntum Prime v35.0 - THE SINGULARITY                          ║
 * ╚═══════════════════════════════════════════════════════════════════════════════════════╝
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
    projects: [
        { name: 'MisteMind', path: 'C:\\MisteMind' },
        { name: 'MrMindQATool', path: 'C:\\MrMindQATool' },
        { name: 'MisterMindPage', path: 'C:\\MisterMindPage' }
    ],
    syncInterval: 60000,      // Check every 60 seconds
    autoCommit: true,         // Auto-commit changes
    autoPush: false,          // Auto-push (disabled by default for safety)
    logPath: 'C:\\MisteMind\\data\\auto-sync-log.json',
    importantPatterns: [      // Patterns that require confirmation
        /\.env/,
        /secret/i,
        /password/i,
        /api[_-]?key/i,
        /\.encrypted$/
    ],
    ignorePatterns: [
        /node_modules/,
        /\.git/,
        /dist/,
        /\.log$/,
        /\.tmp$/
    ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════════

let syncLog = [];
let isRunning = false;
let lastSync = Date.now();
let pendingConfirmations = [];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const entry = { timestamp, type, message };
    syncLog.push(entry);
    
    const colors = {
        info: '\x1b[36m',
        success: '\x1b[32m',
        warning: '\x1b[33m',
        error: '\x1b[31m',
        important: '\x1b[35m'
    };
    
    console.log(`${colors[type] || ''}[${timestamp}] ${message}\x1b[0m`);
    
    // Keep only last 1000 entries
    if (syncLog.length > 1000) syncLog = syncLog.slice(-1000);
}

function saveLog() {
    try {
        const dir = path.dirname(CONFIG.logPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(CONFIG.logPath, JSON.stringify({
            lastSync,
            syncLog: syncLog.slice(-100),
            pendingConfirmations
        }, null, 2));
    } catch (e) { /* ignore */ }
}

function exec(cmd, cwd) {
    try {
        return execSync(cmd, { cwd, encoding: 'utf-8', timeout: 30000 }).trim();
    } catch (e) {
        return null;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GIT OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

function getGitStatus(projectPath) {
    const status = exec('git status --porcelain', projectPath);
    if (!status) return { changed: [], staged: [], untracked: [] };
    
    const lines = status.split('\n').filter(l => l);
    const changed = [];
    const staged = [];
    const untracked = [];
    
    for (const line of lines) {
        const [xy, ...fileParts] = line.split(' ');
        const file = fileParts.join(' ').trim();
        
        if (xy.startsWith('?')) {
            untracked.push(file);
        } else if (xy[0] !== ' ') {
            staged.push(file);
        } else {
            changed.push(file);
        }
    }
    
    return { changed, staged, untracked };
}

function checkImportantChanges(files) {
    const important = [];
    
    for (const file of files) {
        for (const pattern of CONFIG.importantPatterns) {
            if (pattern.test(file)) {
                important.push(file);
                break;
            }
        }
    }
    
    return important;
}

function autoCommit(project, files) {
    const allFiles = [...files.changed, ...files.staged, ...files.untracked];
    if (allFiles.length === 0) return false;
    
    // Check for important changes
    const important = checkImportantChanges(allFiles);
    if (important.length > 0) {
        log(`⚠️  IMPORTANT CHANGES in ${project.name}: ${important.join(', ')}`, 'important');
        pendingConfirmations.push({
            project: project.name,
            files: important,
            timestamp: Date.now()
        });
        return false;
    }
    
    // Auto-commit
    try {
        exec('git add -A', project.path);
        
        const message = `auto-sync: ${allFiles.length} files updated [${new Date().toISOString()}]`;
        exec(`git commit -m "${message}"`, project.path);
        
        log(`✅ Auto-committed ${allFiles.length} files in ${project.name}`, 'success');
        
        if (CONFIG.autoPush) {
            exec('git push', project.path);
            log(`📤 Pushed to remote: ${project.name}`, 'success');
        }
        
        return true;
    } catch (e) {
        log(`❌ Commit failed in ${project.name}: ${e.message}`, 'error');
        return false;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SYNC CYCLE
// ═══════════════════════════════════════════════════════════════════════════════

function runSyncCycle() {
    if (isRunning) return;
    isRunning = true;
    
    log('🔄 Starting sync cycle...', 'info');
    
    let totalChanges = 0;
    let projectsWithChanges = [];
    
    for (const project of CONFIG.projects) {
        if (!fs.existsSync(project.path)) {
            log(`⚠️  Project not found: ${project.name}`, 'warning');
            continue;
        }
        
        const status = getGitStatus(project.path);
        const allChanges = status.changed.length + status.staged.length + status.untracked.length;
        
        if (allChanges > 0) {
            totalChanges += allChanges;
            projectsWithChanges.push({
                name: project.name,
                changes: allChanges,
                files: [...status.changed, ...status.staged, ...status.untracked]
            });
            
            log(`📝 ${project.name}: ${allChanges} changes detected`, 'warning');
            
            if (CONFIG.autoCommit) {
                autoCommit(project, status);
            }
        }
    }
    
    if (totalChanges === 0) {
        log('✨ All repositories clean - no changes', 'success');
    } else {
        log(`📊 Total: ${totalChanges} changes across ${projectsWithChanges.length} projects`, 'info');
    }
    
    lastSync = Date.now();
    saveLog();
    isRunning = false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FILE WATCHER
// ═══════════════════════════════════════════════════════════════════════════════

function startFileWatcher() {
    log('👁️ Starting file watchers...', 'info');
    
    for (const project of CONFIG.projects) {
        if (!fs.existsSync(project.path)) continue;
        
        const srcPath = path.join(project.path, 'src');
        if (!fs.existsSync(srcPath)) continue;
        
        try {
            fs.watch(srcPath, { recursive: true }, (eventType, filename) => {
                if (!filename) return;
                
                // Ignore certain files
                for (const pattern of CONFIG.ignorePatterns) {
                    if (pattern.test(filename)) return;
                }
                
                log(`📁 ${project.name}: ${eventType} - ${filename}`, 'info');
            });
            
            log(`✅ Watching: ${project.name}/src`, 'success');
        } catch (e) {
            log(`❌ Failed to watch ${project.name}: ${e.message}`, 'error');
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS DISPLAY
// ═══════════════════════════════════════════════════════════════════════════════

function showStatus() {
    console.clear();
    console.log(`
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                       ║
║     █████╗ ██╗   ██╗████████╗ ██████╗       ███████╗██╗   ██╗███╗   ██╗ ██████╗       ║
║    ██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗      ██╔════╝╚██╗ ██╔╝████╗  ██║██╔════╝       ║
║    ███████║██║   ██║   ██║   ██║   ██║█████╗███████╗ ╚████╔╝ ██╔██╗ ██║██║            ║
║    ██╔══██║██║   ██║   ██║   ██║   ██║╚════╝╚════██║  ╚██╔╝  ██║╚██╗██║██║            ║
║    ██║  ██║╚██████╔╝   ██║   ╚██████╔╝      ███████║   ██║   ██║ ╚████║╚██████╗       ║
║    ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝       ╚══════╝   ╚═╝   ╚═╝  ╚═══╝ ╚═════╝       ║
║                                                                                       ║
║                    QAntum Prime v35.0 - THE SINGULARITY                               ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝

   📡 STATUS: ACTIVE
   ⏰ Sync Interval: ${CONFIG.syncInterval / 1000}s
   📅 Last Sync: ${new Date(lastSync).toLocaleString()}
   🔄 Auto-Commit: ${CONFIG.autoCommit ? 'ON' : 'OFF'}
   📤 Auto-Push: ${CONFIG.autoPush ? 'ON' : 'OFF'}

   📁 MONITORING:
`);
    
    for (const project of CONFIG.projects) {
        const exists = fs.existsSync(project.path);
        const status = exists ? getGitStatus(project.path) : null;
        const changes = status ? status.changed.length + status.staged.length + status.untracked.length : 0;
        
        console.log(`      ${exists ? '✅' : '❌'} ${project.name}: ${changes > 0 ? `\x1b[33m${changes} changes\x1b[0m` : '\x1b[32mclean\x1b[0m'}`);
    }
    
    if (pendingConfirmations.length > 0) {
        console.log('\n   ⚠️  PENDING CONFIRMATIONS:');
        pendingConfirmations.forEach(pc => {
            console.log(`      - ${pc.project}: ${pc.files.join(', ')}`);
        });
    }
    
    console.log('\n   📜 RECENT LOG:');
    syncLog.slice(-5).forEach(entry => {
        const color = entry.type === 'success' ? '\x1b[32m' : 
                      entry.type === 'warning' ? '\x1b[33m' : 
                      entry.type === 'error' ? '\x1b[31m' : '\x1b[36m';
        console.log(`      ${color}${entry.message}\x1b[0m`);
    });
    
    console.log('\n   Commands: [q]uit | [s]ync now | [c]ommit all | [p]ush all');
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

function main() {
    console.log('🚀 Starting Auto-Sync Daemon...\n');
    
    // Initial sync
    runSyncCycle();
    
    // Start watchers
    startFileWatcher();
    
    // Periodic sync
    setInterval(() => {
        runSyncCycle();
        showStatus();
    }, CONFIG.syncInterval);
    
    // Show initial status
    showStatus();
    
    // Handle keyboard input
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', (key) => {
            const cmd = key.toString().toLowerCase();
            
            if (cmd === 'q' || cmd === '\u0003') {
                log('👋 Auto-Sync stopped', 'info');
                saveLog();
                process.exit(0);
            }
            
            if (cmd === 's') {
                runSyncCycle();
                showStatus();
            }
            
            if (cmd === 'c') {
                CONFIG.projects.forEach(p => {
                    if (fs.existsSync(p.path)) {
                        exec('git add -A && git commit -m "manual: sync all changes"', p.path);
                    }
                });
                log('📦 Manual commit completed', 'success');
                showStatus();
            }
            
            if (cmd === 'p') {
                CONFIG.projects.forEach(p => {
                    if (fs.existsSync(p.path)) {
                        exec('git push', p.path);
                    }
                });
                log('📤 Push completed', 'success');
                showStatus();
            }
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════════════════════

if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--once')) {
        // Single sync
        runSyncCycle();
        process.exit(0);
    }
    
    if (args.includes('--status')) {
        // Just show status
        for (const project of CONFIG.projects) {
            const status = getGitStatus(project.path);
            const total = status.changed.length + status.staged.length + status.untracked.length;
            console.log(`${project.name}: ${total} changes`);
            if (total > 0) {
                [...status.changed, ...status.staged, ...status.untracked].forEach(f => console.log(`  - ${f}`));
            }
        }
        process.exit(0);
    }
    
    // Start daemon
    main();
}

module.exports = { runSyncCycle, getGitStatus, CONFIG };
