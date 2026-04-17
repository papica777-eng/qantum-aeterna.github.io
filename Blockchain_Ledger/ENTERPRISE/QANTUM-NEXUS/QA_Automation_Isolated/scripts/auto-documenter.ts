#!/usr/bin/env npx ts-node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔄 QANTUM AUTO-DOCUMENTER v1.0.0
 * 
 * Автоматично документира ЦЕЛИЯ проект - никога не губи напредъка!
 * 
 * Usage:
 *   npx ts-node scripts/auto-documenter.ts
 *   npx ts-node scripts/auto-documenter.ts --watch
 * 
 * Created: December 31, 2025
 * Author: DIMITAR PRODROMOV
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as fs from 'fs';
import * as path from 'path';

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const ROOT = process.cwd();
const CONFIG = {
    // Папки за сканиране — по подразбиране текущият проект; за multi-root задай AUTO_DOC_ROOTS=path1,path2
    scanPaths: process.env.AUTO_DOC_ROOTS
        ? process.env.AUTO_DOC_ROOTS.split(',').map((p: string) => p.trim())
        : [ROOT],

    // Папки за игнориране (съвместими с vortex-config)
    ignoreDirs: [
        'node_modules', 'dist', 'dist-protected', '.git', '.venv', 'coverage',
        '.next', 'build', '_BACKUPS', '_ARCHIVE', 'analysis-output', '.cursor'
    ],

    // Файлови разширения за броене
    codeExtensions: ['.ts', '.js', '.tsx', '.jsx'],
    dataExtensions: ['.json'],
    docExtensions: ['.md', '.html', '.css'],

    // Output — в analysis-output/auto-docs за единен изход с останалите репорти
    outputDir: path.join(ROOT, 'analysis-output', 'auto-docs'),
    inventoryFile: 'project-inventory.json',
    reportFile: 'PROJECT-STATS.md',
    historyFile: 'stats-history.json'
};

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface FileStats {
    path: string;
    lines: number;
    size: number;
    extension: string;
    category: string;
    lastModified: string;
}

interface FolderStats {
    path: string;
    files: number;
    lines: number;
    size: number;
    breakdown: Record<string, { files: number; lines: number }>;
}

interface ProjectInventory {
    generated: string;
    version: string;
    totals: {
        files: number;
        lines: number;
        size: number;
        folders: number;
    };
    byExtension: Record<string, { files: number; lines: number; size: number }>;
    byCategory: Record<string, { files: number; lines: number }>;
    topFolders: FolderStats[];
    topFiles: FileStats[];
    privateStats: {
        files: number;
        lines: number;
        folders: string[];
    };
    publicStats: {
        files: number;
        lines: number;
    };
}

interface HistoryEntry {
    date: string;
    lines: number;
    files: number;
    privateLines: number;
    publicLines: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCANNER CLASS
// ═══════════════════════════════════════════════════════════════════════════════

class AutoDocumenter {
    private allFiles: FileStats[] = [];
    private folderStats: Map<string, FolderStats> = new Map();
    
    constructor() {
        console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                    🔄 QANTUM AUTO-DOCUMENTER v1.0.0                           ║
║                                                                               ║
║     "Никога не забравяй. Никога не губи напредък."                            ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`);
    }
    
    /**
     * Главна функция - сканира и генерира документация
     */
    async run(): Promise<void> {
        const startTime = Date.now();
        
        console.log('📁 Сканиране на папки...\n');
        
        for (const scanPath of CONFIG.scanPaths) {
            if (fs.existsSync(scanPath)) {
                console.log(`   Сканиране: ${scanPath}`);
                await this.scanDirectory(scanPath);
            }
        }
        
        console.log(`\n✅ Сканирането завърши за ${((Date.now() - startTime) / 1000).toFixed(2)}s\n`);
        
        // Генериране на инвентар
        const inventory = this.generateInventory();
        
        // Записване
        await this.saveInventory(inventory);
        await this.generateReport(inventory);
        await this.updateHistory(inventory);
        
        // Финален отчет
        this.printSummary(inventory);
    }
    
    /**
     * Рекурсивно сканиране на директория
     */
    private async scanDirectory(dirPath: string): Promise<void> {
        try {
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);
                
                // Пропускане на игнорирани папки
                if (entry.isDirectory()) {
                    if (CONFIG.ignoreDirs.includes(entry.name)) continue;
                    await this.scanDirectory(fullPath);
                } else if (entry.isFile()) {
                    const stats = this.analyzeFile(fullPath);
                    if (stats) {
                        this.allFiles.push(stats);
                        this.updateFolderStats(dirPath, stats);
                    }
                }
            }
        } catch (error) {
            // Пропускане на недостъпни папки
        }
    }
    
    /**
     * Анализира един файл
     */
    private analyzeFile(filePath: string): FileStats | null {
        try {
            const ext = path.extname(filePath).toLowerCase();
            const allExtensions = [
                ...CONFIG.codeExtensions,
                ...CONFIG.dataExtensions,
                ...CONFIG.docExtensions
            ];
            
            if (!allExtensions.includes(ext)) return null;
            
            const stat = fs.statSync(filePath);
            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.split('\n').length;
            
            let category = 'other';
            if (CONFIG.codeExtensions.includes(ext)) category = 'code';
            else if (CONFIG.dataExtensions.includes(ext)) category = 'data';
            else if (CONFIG.docExtensions.includes(ext)) category = 'docs';
            
            return {
                path: filePath,
                lines,
                size: stat.size,
                extension: ext,
                category,
                lastModified: stat.mtime.toISOString()
            };
        } catch {
            return null;
        }
    }
    
    /**
     * Обновява статистиката за папка
     */
    private updateFolderStats(dirPath: string, file: FileStats): void {
        // Определи root папката (MisteMind или QAntumQATool)
        const rootMatch = dirPath.match(/c:\\(MisteMind|QAntumQATool)/i);
        if (!rootMatch) return;
        
        const rootPath = `c:\\${rootMatch[1]}`;
        const relativePath = dirPath.replace(rootPath, '').split('\\').filter(Boolean);
        
        // Актуализирай статистиката за всяко ниво
        let currentPath = rootPath;
        for (let i = 0; i <= Math.min(relativePath.length, 2); i++) {
            if (i > 0) currentPath = path.join(currentPath, relativePath[i - 1]);
            
            if (!this.folderStats.has(currentPath)) {
                this.folderStats.set(currentPath, {
                    path: currentPath,
                    files: 0,
                    lines: 0,
                    size: 0,
                    breakdown: {}
                });
            }
            
            const stats = this.folderStats.get(currentPath)!;
            stats.files++;
            stats.lines += file.lines;
            stats.size += file.size;
            
            if (!stats.breakdown[file.extension]) {
                stats.breakdown[file.extension] = { files: 0, lines: 0 };
            }
            stats.breakdown[file.extension].files++;
            stats.breakdown[file.extension].lines += file.lines;
        }
    }
    
    /**
     * Генерира пълен инвентар
     */
    private generateInventory(): ProjectInventory {
        const byExtension: Record<string, { files: number; lines: number; size: number }> = {};
        const byCategory: Record<string, { files: number; lines: number }> = {};
        
        let privateLines = 0;
        let privateFiles = 0;
        let publicLines = 0;
        let publicFiles = 0;
        const privateFolders: Set<string> = new Set();
        
        for (const file of this.allFiles) {
            // По extension
            if (!byExtension[file.extension]) {
                byExtension[file.extension] = { files: 0, lines: 0, size: 0 };
            }
            byExtension[file.extension].files++;
            byExtension[file.extension].lines += file.lines;
            byExtension[file.extension].size += file.size;
            
            // По category
            if (!byCategory[file.category]) {
                byCategory[file.category] = { files: 0, lines: 0 };
            }
            byCategory[file.category].files++;
            byCategory[file.category].lines += file.lines;
            
            // Private vs Public
            if (file.path.toLowerCase().includes('private')) {
                privateLines += file.lines;
                privateFiles++;
                const folderMatch = file.path.match(/PRIVATE\\([^\\]+)/i);
                if (folderMatch) privateFolders.add(folderMatch[1]);
            } else {
                publicLines += file.lines;
                publicFiles++;
            }
        }
        
        // Топ папки по редове код
        const topFolders = Array.from(this.folderStats.values())
            .sort((a, b) => b.lines - a.lines)
            .slice(0, 20);
        
        // Топ файлове по редове
        const topFiles = [...this.allFiles]
            .sort((a, b) => b.lines - a.lines)
            .slice(0, 30);
        
        return {
            generated: new Date().toISOString(),
            version: 'v27.1.0-IMMORTAL',
            totals: {
                files: this.allFiles.length,
                lines: this.allFiles.reduce((sum, f) => sum + f.lines, 0),
                size: this.allFiles.reduce((sum, f) => sum + f.size, 0),
                folders: this.folderStats.size
            },
            byExtension,
            byCategory,
            topFolders,
            topFiles,
            privateStats: {
                files: privateFiles,
                lines: privateLines,
                folders: Array.from(privateFolders)
            },
            publicStats: {
                files: publicFiles,
                lines: publicLines
            }
        };
    }
    
    /**
     * Записва инвентара в JSON
     */
    private async saveInventory(inventory: ProjectInventory): Promise<void> {
        const outputDir = CONFIG.outputDir;
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        const filePath = path.join(outputDir, CONFIG.inventoryFile);
        fs.writeFileSync(filePath, JSON.stringify(inventory, null, 2));
        console.log(`📄 Инвентар записан: ${filePath}`);
    }
    
    /**
     * Генерира Markdown отчет
     */
    private async generateReport(inventory: ProjectInventory): Promise<void> {
        const report = `# 📊 QANTUM PROJECT STATISTICS
## Auto-generated: ${new Date().toLocaleString('bg-BG')}

---

## 🏆 ОБЩА СТАТИСТИКА

\`\`\`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                        QANTUM PRIME ${inventory.version}                              ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║   📁 ОБЩО ФАЙЛОВЕ:        ${inventory.totals.files.toLocaleString().padEnd(10)} файла                            ║
║   📝 ОБЩО РЕДОВЕ КОД:     ${inventory.totals.lines.toLocaleString().padEnd(10)} реда                             ║
║   💾 ОБЩ РАЗМЕР:          ${(inventory.totals.size / 1024 / 1024).toFixed(2).padEnd(10)} MB                              ║
║   📂 ПАПКИ:               ${inventory.totals.folders.toLocaleString().padEnd(10)} папки                           ║
║                                                                               ║
║   🔒 PRIVATE КОД:         ${inventory.privateStats.lines.toLocaleString().padEnd(10)} реда (${((inventory.privateStats.lines / inventory.totals.lines) * 100).toFixed(1)}%)               ║
║   🌐 PUBLIC КОД:          ${inventory.publicStats.lines.toLocaleString().padEnd(10)} реда (${((inventory.publicStats.lines / inventory.totals.lines) * 100).toFixed(1)}%)                ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
\`\`\`

---

## 📂 ПО ТИП ФАЙЛ

| Extension | Файлове | Редове | Размер |
|-----------|---------|--------|--------|
${Object.entries(inventory.byExtension)
    .sort((a, b) => b[1].lines - a[1].lines)
    .map(([ext, stats]) => `| ${ext} | ${stats.files.toLocaleString()} | ${stats.lines.toLocaleString()} | ${(stats.size / 1024).toFixed(0)} KB |`)
    .join('\n')}

---

## 🏛️ ТОП 20 ПАПКИ ПО РЕДОВЕ КОД

| Папка | Файлове | Редове |
|-------|---------|--------|
${inventory.topFolders
    .map(f => `| ${f.path.replace(/c:\\\\/gi, '')} | ${f.files.toLocaleString()} | ${f.lines.toLocaleString()} |`)
    .join('\n')}

---

## 📄 ТОП 30 ФАЙЛОВЕ ПО РЕДОВЕ

| Файл | Редове | Категория |
|------|--------|-----------|
${inventory.topFiles
    .map(f => `| ${path.basename(f.path)} | ${f.lines.toLocaleString()} | ${f.category} |`)
    .join('\n')}

---

## 🔒 PRIVATE ПАПКИ

${inventory.privateStats.folders.map(f => `- \`${f}\``).join('\n')}

**Общо PRIVATE:** ${inventory.privateStats.files.toLocaleString()} файла, ${inventory.privateStats.lines.toLocaleString()} реда

---

## 🇧🇬 СЪЗДАДЕНО В БЪЛГАРИЯ

**Автор:** DIMITAR PRODROMOV  
**Дата:** ${new Date().toLocaleDateString('bg-BG')}  
**Версия:** ${inventory.version}

---

*Този отчет е автоматично генериран от \`auto-documenter.ts\`*
`;
        
        const filePath = path.join(CONFIG.outputDir, CONFIG.reportFile);
        fs.writeFileSync(filePath, report);
        console.log(`📄 Отчет записан: ${filePath}`);
        
        // Копирай и в главната папка
        const mainReportPath = 'c:\\MisteMind\\PROJECT-STATS.md';
        fs.writeFileSync(mainReportPath, report);
        console.log(`📄 Главен отчет: ${mainReportPath}`);
    }
    
    /**
     * Обновява историята на статистиките
     */
    private async updateHistory(inventory: ProjectInventory): Promise<void> {
        const historyPath = path.join(CONFIG.outputDir, CONFIG.historyFile);
        
        let history: HistoryEntry[] = [];
        if (fs.existsSync(historyPath)) {
            try {
                history = JSON.parse(fs.readFileSync(historyPath, 'utf-8'));
            } catch {}
        }
        
        // Добави нов запис
        history.push({
            date: new Date().toISOString(),
            lines: inventory.totals.lines,
            files: inventory.totals.files,
            privateLines: inventory.privateStats.lines,
            publicLines: inventory.publicStats.lines
        });
        
        // Запази последните 100 записа
        if (history.length > 100) {
            history = history.slice(-100);
        }
        
        fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
        console.log(`📈 История обновена: ${history.length} записа`);
    }
    
    /**
     * Принтира финално обобщение
     */
    private printSummary(inventory: ProjectInventory): void {
        console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                         📊 ФИНАЛНА СТАТИСТИКА                                 ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║   📁 ОБЩО ФАЙЛОВЕ:        ${inventory.totals.files.toLocaleString().padStart(10)}                                  ║
║   📝 ОБЩО РЕДОВЕ:         ${inventory.totals.lines.toLocaleString().padStart(10)}                                  ║
║                                                                               ║
║   🔒 PRIVATE:             ${inventory.privateStats.lines.toLocaleString().padStart(10)} реда (${((inventory.privateStats.lines / inventory.totals.lines) * 100).toFixed(1)}%)                ║
║   🌐 PUBLIC:              ${inventory.publicStats.lines.toLocaleString().padStart(10)} реда (${((inventory.publicStats.lines / inventory.totals.lines) * 100).toFixed(1)}%)                 ║
║                                                                               ║
║   📂 TypeScript:          ${(inventory.byExtension['.ts']?.lines || 0).toLocaleString().padStart(10)} реда                         ║
║   📂 JavaScript:          ${(inventory.byExtension['.js']?.lines || 0).toLocaleString().padStart(10)} реда                         ║
║   📂 JSON:                ${(inventory.byExtension['.json']?.lines || 0).toLocaleString().padStart(10)} реда                         ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝

✅ Документацията е актуализирана!
📄 Виж: c:\\MisteMind\\PROJECT-STATS.md
📄 JSON: c:\\MisteMind\\data\\auto-docs\\project-inventory.json
`);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

const documenter = new AutoDocumenter();
documenter.run().catch(console.error);
