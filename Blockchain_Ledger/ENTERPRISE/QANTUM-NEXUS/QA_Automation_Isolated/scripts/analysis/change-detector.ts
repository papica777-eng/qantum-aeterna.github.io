#!/usr/bin/env npx ts-node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔍 CHANGE DETECTOR - Automatic Change Detection & Documentation
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Този скрипт автоматично:
 * 1. Засича всички промени във файлове
 * 2. Определя към кой ОТДЕЛ принадлежи промяната
 * 3. Записва промяната в CHANGE-LOG-LIVE.md
 * 4. Праща сигнал до Nerve Center
 * 
 * Usage:
 *   npx ts-node scripts/change-detector.ts --watch      # Watch mode
 *   npx ts-node scripts/change-detector.ts --scan       # Single scan
 *   npx ts-node scripts/change-detector.ts --commit     # Scan + commit
 * 
 * @author Димитър Продромов / Mister Mind
 * @version 34.0.0
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // Repositories to scan
  repositories: [
    { path: 'c:\\MrMindQATool', name: 'QAntum Core' },
    { path: 'c:\\MisteMind', name: 'MisteMind' },
    { path: 'c:\\MisterMindPage', name: 'MisterMindPage' }
  ],
  
  // Department mapping by path patterns
  departmentMapping: [
    { pattern: /intelligence|ai|neural|scanner/i, department: 'INTELLIGENCE', icon: '🧠' },
    { pattern: /omega|chronos|warp|magnet|entangle/i, department: 'OMEGA', icon: '⚡' },
    { pattern: /physics|gravity|atom|core/i, department: 'PHYSICS', icon: '🔬' },
    { pattern: /security|bastion|vault|crypto|evidence/i, department: 'FORTRESS', icon: '🏰' },
    { pattern: /cognition|mnemosyne|memory|evolut/i, department: 'BIOLOGY', icon: '🧬' },
    { pattern: /guardian|watch|monitor|health/i, department: 'GUARDIANS', icon: '🛡️' },
    { pattern: /reality|hunter|lead|value|outreach/i, department: 'REALITY', icon: '🌐' },
    { pattern: /sync|harmoni|bond|chemistry/i, department: 'CHEMISTRY', icon: '🔗' }
  ],
  
  // Output files
  changeLogPath: 'c:\\MisteMind\\CHANGE-LOG-LIVE.md',
  signalsPath: 'c:\\MisteMind\\data\\nerve-signals',
  historyPath: 'c:\\MisteMind\\data\\change-history.json'
};

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface DetectedChange {
  id: string;
  timestamp: Date;
  repository: string;
  filePath: string;
  fileName: string;
  department: string;
  departmentIcon: string;
  changeType: 'added' | 'modified' | 'deleted' | 'renamed';
  linesAdded: number;
  linesRemoved: number;
  description: string;
  gitStatus: string;
  author?: string;
}

interface ChangeHistory {
  lastScan: Date;
  totalChanges: number;
  byDepartment: Record<string, number>;
  recentChanges: DetectedChange[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHANGE DETECTOR ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

class ChangeDetector {
  private history: ChangeHistory;
  private watchInterval: ReturnType<typeof setInterval> | null = null;
  
  constructor() {
    this.history = this.loadHistory();
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // DETECTION
  // ─────────────────────────────────────────────────────────────────────────────
  
  async detectChanges(): Promise<DetectedChange[]> {
    console.log('\n🔍 Scanning for changes across all repositories...\n');
    
    const allChanges: DetectedChange[] = [];
    
    for (const repo of CONFIG.repositories) {
      if (!fs.existsSync(repo.path)) {
        console.log(`   ⚠️ Repository not found: ${repo.path}`);
        continue;
      }
      
      const changes = this.detectRepoChanges(repo.path, repo.name);
      allChanges.push(...changes);
    }
    
    // Update history
    this.history.lastScan = new Date();
    this.history.totalChanges += allChanges.length;
    
    for (const change of allChanges) {
      this.history.byDepartment[change.department] = 
        (this.history.byDepartment[change.department] || 0) + 1;
    }
    
    // Keep last 100 changes
    this.history.recentChanges = [...allChanges, ...this.history.recentChanges].slice(0, 100);
    
    this.saveHistory();
    
    return allChanges;
  }
  
  private detectRepoChanges(repoPath: string, repoName: string): DetectedChange[] {
    const changes: DetectedChange[] = [];
    
    try {
      // Get git status
      const statusOutput = execSync('git status --porcelain', { 
        cwd: repoPath, 
        encoding: 'utf-8' 
      });
      
      const lines = statusOutput.trim().split('\n').filter(l => l);
      
      for (const line of lines) {
        const status = line.substring(0, 2).trim();
        const filePath = line.substring(3).trim();
        
        // Skip certain files
        if (filePath.includes('node_modules') || 
            filePath.includes('.git') ||
            filePath.endsWith('.lock')) continue;
        
        const changeType = this.parseGitStatus(status);
        const department = this.determineDepartment(filePath);
        const fullPath = path.join(repoPath, filePath);
        
        // Get line changes if file exists
        let linesAdded = 0, linesRemoved = 0;
        if (fs.existsSync(fullPath) && changeType !== 'deleted') {
          try {
            const diffOutput = execSync(`git diff --numstat "${filePath}"`, {
              cwd: repoPath,
              encoding: 'utf-8'
            });
            const match = diffOutput.match(/^(\d+)\s+(\d+)/);
            if (match) {
              linesAdded = parseInt(match[1]) || 0;
              linesRemoved = parseInt(match[2]) || 0;
            }
          } catch {}
        }
        
        const change: DetectedChange = {
          id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          repository: repoName,
          filePath: fullPath,
          fileName: path.basename(filePath),
          department: department.name,
          departmentIcon: department.icon,
          changeType,
          linesAdded,
          linesRemoved,
          description: this.generateDescription(changeType, filePath, department.name),
          gitStatus: status
        };
        
        changes.push(change);
        
        console.log(`   ${department.icon} [${department.name}] ${changeType}: ${filePath}`);
      }
      
      if (changes.length === 0) {
        console.log(`   ✅ ${repoName}: No uncommitted changes`);
      } else {
        console.log(`   📊 ${repoName}: ${changes.length} changes detected`);
      }
      
    } catch (error) {
      console.log(`   ⚠️ Could not scan ${repoName}: ${error}`);
    }
    
    return changes;
  }
  
  private parseGitStatus(status: string): 'added' | 'modified' | 'deleted' | 'renamed' {
    if (status.includes('A') || status === '??') return 'added';
    if (status.includes('D')) return 'deleted';
    if (status.includes('R')) return 'renamed';
    return 'modified';
  }
  
  private determineDepartment(filePath: string): { name: string; icon: string } {
    for (const mapping of CONFIG.departmentMapping) {
      if (mapping.pattern.test(filePath)) {
        return { name: mapping.department, icon: mapping.icon };
      }
    }
    return { name: 'GENERAL', icon: '📁' };
  }
  
  private generateDescription(
    changeType: string, 
    filePath: string, 
    department: string
  ): string {
    const fileName = path.basename(filePath);
    const extension = path.extname(filePath);
    
    const typeDescriptions: Record<string, string> = {
      added: 'Added new file',
      modified: 'Modified file',
      deleted: 'Deleted file',
      renamed: 'Renamed file'
    };
    
    return `${typeDescriptions[changeType] || 'Changed'} in ${department} department: ${fileName}`;
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // DOCUMENTATION
  // ─────────────────────────────────────────────────────────────────────────────
  
  async updateChangeLog(changes: DetectedChange[]): Promise<void> {
    if (changes.length === 0) {
      console.log('\n📝 No changes to document');
      return;
    }
    
    console.log('\n📝 Updating CHANGE-LOG-LIVE.md...');
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];
    
    // Group changes by department
    const byDepartment: Record<string, DetectedChange[]> = {};
    for (const change of changes) {
      if (!byDepartment[change.department]) {
        byDepartment[change.department] = [];
      }
      byDepartment[change.department].push(change);
    }
    
    // Generate new entry
    let newEntry = `\n## 📅 ${dateStr} ${timeStr}\n\n`;
    newEntry += `**Total Changes:** ${changes.length}\n\n`;
    
    for (const [dept, deptChanges] of Object.entries(byDepartment)) {
      const icon = deptChanges[0].departmentIcon;
      newEntry += `### ${icon} ${dept}\n\n`;
      
      for (const change of deptChanges) {
        const typeEmoji = {
          added: '➕',
          modified: '✏️',
          deleted: '🗑️',
          renamed: '📝'
        }[change.changeType] || '📄';
        
        newEntry += `- ${typeEmoji} \`${change.fileName}\``;
        if (change.linesAdded || change.linesRemoved) {
          newEntry += ` (+${change.linesAdded}/-${change.linesRemoved})`;
        }
        newEntry += `\n`;
        newEntry += `  - ${change.description}\n`;
        newEntry += `  - Repository: ${change.repository}\n`;
      }
      
      newEntry += '\n';
    }
    
    newEntry += '---\n';
    
    // Read existing or create new
    let existingContent = '';
    if (fs.existsSync(CONFIG.changeLogPath)) {
      existingContent = fs.readFileSync(CONFIG.changeLogPath, 'utf-8');
    } else {
      existingContent = `# 📜 CHANGE LOG LIVE - QAntum Empire

> **Автоматично генериран log на всички промени**
> 
> Този файл се обновява автоматично от \`change-detector.ts\`

---

## 📊 Statistics

| Метрика | Стойност |
|---------|----------|
| Last Scan | ${now.toISOString()} |
| Total Changes | ${this.history.totalChanges} |

---

`;
    }
    
    // Insert new entry after header
    const headerEndIndex = existingContent.indexOf('---\n', existingContent.indexOf('Statistics'));
    if (headerEndIndex !== -1) {
      const beforeEntry = existingContent.substring(0, headerEndIndex + 4);
      const afterEntry = existingContent.substring(headerEndIndex + 4);
      existingContent = beforeEntry + newEntry + afterEntry;
    } else {
      existingContent += newEntry;
    }
    
    fs.writeFileSync(CONFIG.changeLogPath, existingContent);
    console.log(`   ✅ Updated: ${CONFIG.changeLogPath}`);
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // SIGNALING
  // ─────────────────────────────────────────────────────────────────────────────
  
  async signalChanges(changes: DetectedChange[]): Promise<void> {
    if (changes.length === 0) return;
    
    console.log('\n📡 Sending signals to Nerve Center...');
    
    // Ensure signals directory exists
    if (!fs.existsSync(CONFIG.signalsPath)) {
      fs.mkdirSync(CONFIG.signalsPath, { recursive: true });
    }
    
    // Create signal file
    const signal = {
      timestamp: new Date(),
      changeCount: changes.length,
      byDepartment: {} as Record<string, number>,
      changes: changes.slice(0, 20) // Limit for performance
    };
    
    for (const change of changes) {
      signal.byDepartment[change.department] = 
        (signal.byDepartment[change.department] || 0) + 1;
    }
    
    const signalPath = path.join(CONFIG.signalsPath, `${Date.now()}-changes.json`);
    fs.writeFileSync(signalPath, JSON.stringify(signal, null, 2));
    
    console.log(`   ✅ Signal sent: ${signalPath}`);
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // GIT COMMIT
  // ─────────────────────────────────────────────────────────────────────────────
  
  async commitChanges(changes: DetectedChange[]): Promise<void> {
    if (changes.length === 0) {
      console.log('\n📦 No changes to commit');
      return;
    }
    
    console.log('\n📦 Committing changes...');
    
    // Group by repo
    const byRepo: Record<string, DetectedChange[]> = {};
    for (const change of changes) {
      if (!byRepo[change.repository]) {
        byRepo[change.repository] = [];
      }
      byRepo[change.repository].push(change);
    }
    
    for (const [repoName, repoChanges] of Object.entries(byRepo)) {
      const repo = CONFIG.repositories.find(r => r.name === repoName);
      if (!repo) continue;
      
      try {
        // Generate commit message
        const departments = [...new Set(repoChanges.map(c => c.department))];
        const deptIcons = [...new Set(repoChanges.map(c => c.departmentIcon))];
        
        const commitMsg = `${deptIcons.join('')} [${departments.join(', ')}] Auto-commit: ${repoChanges.length} changes

Changes by department:
${departments.map(d => {
  const count = repoChanges.filter(c => c.department === d).length;
  const icon = repoChanges.find(c => c.department === d)?.departmentIcon;
  return `- ${icon} ${d}: ${count} files`;
}).join('\n')}

Auto-documented by change-detector.ts`;
        
        // Stage all changes
        execSync('git add -A', { cwd: repo.path });
        
        // Commit
        execSync(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`, { 
          cwd: repo.path 
        });
        
        console.log(`   ✅ ${repoName}: Committed ${repoChanges.length} changes`);
        
      } catch (error) {
        console.log(`   ⚠️ ${repoName}: Could not commit - ${error}`);
      }
    }
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // WATCH MODE
  // ─────────────────────────────────────────────────────────────────────────────
  
  startWatch(intervalMs: number = 30000): void {
    console.log(`\n👁️ Starting watch mode (checking every ${intervalMs / 1000}s)...`);
    console.log('   Press Ctrl+C to stop\n');
    
    // Initial scan
    this.runScanCycle();
    
    // Set up interval
    this.watchInterval = setInterval(() => {
      this.runScanCycle();
    }, intervalMs);
  }
  
  stopWatch(): void {
    if (this.watchInterval) {
      clearInterval(this.watchInterval);
      this.watchInterval = null;
      console.log('\n👁️ Watch mode stopped');
    }
  }
  
  private async runScanCycle(): Promise<void> {
    const changes = await this.detectChanges();
    await this.updateChangeLog(changes);
    await this.signalChanges(changes);
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // HISTORY
  // ─────────────────────────────────────────────────────────────────────────────
  
  private loadHistory(): ChangeHistory {
    try {
      if (fs.existsSync(CONFIG.historyPath)) {
        return JSON.parse(fs.readFileSync(CONFIG.historyPath, 'utf-8'));
      }
    } catch {}
    
    return {
      lastScan: new Date(),
      totalChanges: 0,
      byDepartment: {},
      recentChanges: []
    };
  }
  
  private saveHistory(): void {
    const dir = path.dirname(CONFIG.historyPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG.historyPath, JSON.stringify(this.history, null, 2));
  }
  
  getHistory(): ChangeHistory {
    return this.history;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);
  const detector = new ChangeDetector();
  
  console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║           🔍 CHANGE DETECTOR v34.0 - Automatic Documentation                 ║
║                                                                              ║
║         "Нищо не се забравя. Всичко се документира автоматично."             ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
  `);
  
  if (args.includes('--watch')) {
    // Watch mode
    detector.startWatch(30000);
    
    // Handle shutdown
    process.on('SIGINT', () => {
      detector.stopWatch();
      process.exit(0);
    });
    
  } else if (args.includes('--commit')) {
    // Scan and commit
    const changes = await detector.detectChanges();
    await detector.updateChangeLog(changes);
    await detector.signalChanges(changes);
    await detector.commitChanges(changes);
    
  } else {
    // Single scan (default)
    const changes = await detector.detectChanges();
    await detector.updateChangeLog(changes);
    await detector.signalChanges(changes);
    
    // Show summary
    console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║  📊 SCAN COMPLETE                                                            ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Changes detected: ${String(changes.length).padEnd(54)}  ║
║  Log updated: CHANGE-LOG-LIVE.md                                             ║
║  Signals sent: ${String(changes.length > 0 ? 'Yes' : 'No').padEnd(58)}  ║
╚══════════════════════════════════════════════════════════════════════════════╝

Usage:
  npx ts-node scripts/change-detector.ts              # Single scan
  npx ts-node scripts/change-detector.ts --watch      # Watch mode
  npx ts-node scripts/change-detector.ts --commit     # Scan + commit
    `);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { ChangeDetector, DetectedChange, ChangeHistory };
