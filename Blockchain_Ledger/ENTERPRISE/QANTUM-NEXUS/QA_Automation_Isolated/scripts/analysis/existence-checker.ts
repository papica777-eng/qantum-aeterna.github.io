#!/usr/bin/env npx ts-node
/**
 * 🔍 EXISTENCE CHECKER v34.1
 * =========================
 * 
 * "В QAntum не правим излишни неща."
 * 
 * Този скрипт проверява ПРЕДИ да се прави нещо ново:
 * 1. Дали задачата вече не е изпълнена
 * 2. Дали търсеното не съществува някъде
 * 3. Проверява локални, виртуални и скрити папки
 * 
 * Usage:
 *   npx ts-node scripts/existence-checker.ts --search "ganglion"
 *   npx ts-node scripts/existence-checker.ts --task "create nerve system"
 *   npx ts-node scripts/existence-checker.ts --module "Chronicler"
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const REPOS = [
    'C:\\MrMindQATool',
    'C:\\MisteMind',
    'C:\\MisterMindPage'
];

const HIDDEN_FOLDERS = [
    '.git',
    '.vscode',
    'node_modules',
    'dist',
    'dist-forge',
    'dist-protected',
    '.cache',
    '.temp'
];

const FILE_EXTENSIONS = ['.ts', '.js', '.json', '.md', '.html', '.css', '.bat', '.ps1', '.py'];

interface SearchResult {
    path: string;
    type: 'file' | 'folder' | 'class' | 'function' | 'variable' | 'export';
    match: string;
    context?: string;
    repo: string;
}

interface ExistenceReport {
    query: string;
    found: boolean;
    totalMatches: number;
    results: SearchResult[];
    suggestions: string[];
    duplicates: SearchResult[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// CORE SEARCH ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

class ExistenceChecker {
    private results: SearchResult[] = [];
    
    /**
     * Търси във всички репозитория
     */
    async searchEverything(query: string): Promise<ExistenceReport> {
        console.log(`\n🔍 Searching for: "${query}"\n`);
        this.results = [];
        
        for (const repo of REPOS) {
            if (fs.existsSync(repo)) {
                await this.searchDirectory(repo, query, path.basename(repo));
            }
        }
        
        // Търси в git history ако има
        this.searchGitHistory(query);
        
        // Анализ на резултатите
        const duplicates = this.findDuplicates();
        const suggestions = this.generateSuggestions(query);
        
        return {
            query,
            found: this.results.length > 0,
            totalMatches: this.results.length,
            results: this.results,
            suggestions,
            duplicates
        };
    }
    
    /**
     * Рекурсивно търсене в директория
     */
    private async searchDirectory(dir: string, query: string, repo: string): Promise<void> {
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                const relativePath = fullPath.replace(REPOS.find(r => fullPath.startsWith(r)) || '', '');
                
                // Проверка на име на файл/папка
                if (entry.name.toLowerCase().includes(query.toLowerCase())) {
                    this.results.push({
                        path: relativePath,
                        type: entry.isDirectory() ? 'folder' : 'file',
                        match: entry.name,
                        repo
                    });
                }
                
                if (entry.isDirectory()) {
                    // Търси и в скритите папки ако е нужно
                    const isHidden = HIDDEN_FOLDERS.some(h => entry.name === h);
                    if (!isHidden || entry.name === '.vscode') {
                        await this.searchDirectory(fullPath, query, repo);
                    }
                } else if (entry.isFile() && FILE_EXTENSIONS.some(ext => entry.name.endsWith(ext))) {
                    // Търсене вътре във файла
                    await this.searchInFile(fullPath, query, repo);
                }
            }
        } catch (e) {
            // Игнорираме грешки при достъп
        }
    }
    
    /**
     * Търсене в съдържанието на файл
     */
    private async searchInFile(filePath: string, query: string, repo: string): Promise<void> {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.split('\n');
            const relativePath = filePath.replace(REPOS.find(r => filePath.startsWith(r)) || '', '');
            
            // Търсене на класове
            const classRegex = new RegExp(`class\\s+(\\w*${query}\\w*)`, 'gi');
            let match;
            while ((match = classRegex.exec(content)) !== null) {
                const lineNum = content.substring(0, match.index).split('\n').length;
                this.results.push({
                    path: `${relativePath}:${lineNum}`,
                    type: 'class',
                    match: match[1],
                    context: lines[lineNum - 1]?.trim().substring(0, 100),
                    repo
                });
            }
            
            // Търсене на функции
            const funcRegex = new RegExp(`(?:function|async function|const|let|var)\\s+(\\w*${query}\\w*)\\s*[=(]`, 'gi');
            while ((match = funcRegex.exec(content)) !== null) {
                const lineNum = content.substring(0, match.index).split('\n').length;
                this.results.push({
                    path: `${relativePath}:${lineNum}`,
                    type: 'function',
                    match: match[1],
                    context: lines[lineNum - 1]?.trim().substring(0, 100),
                    repo
                });
            }
            
            // Търсене на exports
            const exportRegex = new RegExp(`export\\s+(?:class|function|const|interface|type)\\s+(\\w*${query}\\w*)`, 'gi');
            while ((match = exportRegex.exec(content)) !== null) {
                const lineNum = content.substring(0, match.index).split('\n').length;
                this.results.push({
                    path: `${relativePath}:${lineNum}`,
                    type: 'export',
                    match: match[1],
                    context: lines[lineNum - 1]?.trim().substring(0, 100),
                    repo
                });
            }
            
            // Общо съвпадение в текст (за документация, коментари)
            if (content.toLowerCase().includes(query.toLowerCase())) {
                const lineIndex = lines.findIndex(l => l.toLowerCase().includes(query.toLowerCase()));
                if (lineIndex >= 0 && !this.results.some(r => r.path.startsWith(relativePath))) {
                    this.results.push({
                        path: `${relativePath}:${lineIndex + 1}`,
                        type: 'variable',
                        match: query,
                        context: lines[lineIndex]?.trim().substring(0, 100),
                        repo
                    });
                }
            }
        } catch (e) {
            // Игнорираме грешки при четене
        }
    }
    
    /**
     * Търсене в Git история
     */
    private searchGitHistory(query: string): void {
        for (const repo of REPOS) {
            try {
                const result = execSync(
                    `git log --oneline --all --source -S "${query}" -- "*.ts" "*.js" 2>nul`,
                    { cwd: repo, encoding: 'utf-8', maxBuffer: 1024 * 1024 }
                );
                
                if (result.trim()) {
                    const commits = result.trim().split('\n').slice(0, 5);
                    commits.forEach(commit => {
                        this.results.push({
                            path: `[GIT HISTORY] ${commit.substring(0, 50)}`,
                            type: 'variable',
                            match: query,
                            context: 'Found in git history - may be deleted or renamed',
                            repo: path.basename(repo)
                        });
                    });
                }
            } catch (e) {
                // Git не е наличен или няма резултати
            }
        }
    }
    
    /**
     * Намира дубликати
     */
    private findDuplicates(): SearchResult[] {
        const seen = new Map<string, SearchResult[]>();
        
        for (const result of this.results) {
            const key = result.match.toLowerCase();
            if (!seen.has(key)) {
                seen.set(key, []);
            }
            seen.get(key)!.push(result);
        }
        
        const duplicates: SearchResult[] = [];
        seen.forEach((results, key) => {
            if (results.length > 1) {
                duplicates.push(...results);
            }
        });
        
        return duplicates;
    }
    
    /**
     * Генерира предложения
     */
    private generateSuggestions(query: string): string[] {
        const suggestions: string[] = [];
        
        if (this.results.length === 0) {
            suggestions.push(`No matches found for "${query}". You can create it.`);
            suggestions.push(`Try searching for similar terms or partial matches.`);
        } else {
            if (this.results.some(r => r.type === 'class')) {
                suggestions.push(`✅ Class already exists! Consider extending or importing it.`);
            }
            if (this.results.some(r => r.type === 'function')) {
                suggestions.push(`✅ Function already exists! Check if it does what you need.`);
            }
            if (this.results.length > 5) {
                suggestions.push(`⚠️ Multiple matches found. Review before creating duplicates.`);
            }
        }
        
        return suggestions;
    }
    
    /**
     * Проверява дали конкретен модул/клас съществува
     */
    async checkModule(moduleName: string): Promise<{exists: boolean, locations: string[]}> {
        const report = await this.searchEverything(moduleName);
        const locations = report.results
            .filter(r => r.type === 'class' || r.type === 'export')
            .map(r => `${r.repo}${r.path}`);
        
        return {
            exists: locations.length > 0,
            locations
        };
    }
    
    /**
     * Проверява свързаност между модули
     */
    async checkConnections(modules: string[]): Promise<Map<string, {found: boolean, importedBy: string[]}>> {
        const connections = new Map<string, {found: boolean, importedBy: string[]}>();
        
        for (const mod of modules) {
            const importers: string[] = [];
            
            for (const repo of REPOS) {
                try {
                    const result = execSync(
                        `findstr /s /i /m "import.*${mod}" *.ts *.js 2>nul`,
                        { cwd: repo, encoding: 'utf-8' }
                    );
                    
                    if (result.trim()) {
                        importers.push(...result.trim().split('\n').map(f => `${path.basename(repo)}/${f}`));
                    }
                } catch (e) {
                    // Няма резултати
                }
            }
            
            const exists = await this.checkModule(mod);
            connections.set(mod, {
                found: exists.exists,
                importedBy: importers
            });
        }
        
        return connections;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLI INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
    const args = process.argv.slice(2);
    const checker = new ExistenceChecker();
    
    console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║           🔍 EXISTENCE CHECKER v34.1                                         ║
║                                                                              ║
║         "В QAntum не правим излишни неща."                                   ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);

    if (args.includes('--search') || args.includes('-s')) {
        const searchIndex = args.indexOf('--search') !== -1 ? args.indexOf('--search') : args.indexOf('-s');
        const query = args[searchIndex + 1];
        
        if (!query) {
            console.log('❌ Please provide a search query: --search "ganglion"');
            process.exit(1);
        }
        
        const report = await checker.searchEverything(query);
        printReport(report);
        
    } else if (args.includes('--module') || args.includes('-m')) {
        const modIndex = args.indexOf('--module') !== -1 ? args.indexOf('--module') : args.indexOf('-m');
        const moduleName = args[modIndex + 1];
        
        if (!moduleName) {
            console.log('❌ Please provide a module name: --module "Chronicler"');
            process.exit(1);
        }
        
        console.log(`🔬 Checking module: ${moduleName}\n`);
        const result = await checker.checkModule(moduleName);
        
        if (result.exists) {
            console.log(`✅ MODULE EXISTS!\n`);
            console.log(`📍 Locations:`);
            result.locations.forEach(loc => console.log(`   ${loc}`));
        } else {
            console.log(`❌ Module NOT found. Safe to create.`);
        }
        
    } else if (args.includes('--check-connections') || args.includes('-c')) {
        // Проверява специфични модули за nervous system
        const nervousModules = ['Ganglion', 'Chronicler', 'PhysicsReflex', 'BiologyReflex', 'CognitionReflex'];
        
        console.log(`🔗 Checking Nervous System connections...\n`);
        const connections = await checker.checkConnections(nervousModules);
        
        console.log(`╔════════════════════════════════════════════════════════════════╗`);
        console.log(`║  MODULE CONNECTION STATUS                                      ║`);
        console.log(`╠════════════════════════════════════════════════════════════════╣`);
        
        connections.forEach((status, mod) => {
            const icon = status.found ? '✅' : '❌';
            const importCount = status.importedBy.length;
            console.log(`║  ${icon} ${mod.padEnd(20)} │ Found: ${status.found ? 'YES' : 'NO '.padEnd(3)} │ Imports: ${importCount.toString().padStart(2)}  ║`);
        });
        
        console.log(`╚════════════════════════════════════════════════════════════════╝`);
        
    } else if (args.includes('--list-all') || args.includes('-l')) {
        // Списък на всички класове и функции
        console.log(`📋 Listing all classes and exports...\n`);
        
        const report = await checker.searchEverything('class ');
        const classes = report.results.filter(r => r.type === 'class' || r.type === 'export');
        
        console.log(`Found ${classes.length} classes/exports:\n`);
        
        const byRepo = new Map<string, SearchResult[]>();
        classes.forEach(c => {
            if (!byRepo.has(c.repo)) byRepo.set(c.repo, []);
            byRepo.get(c.repo)!.push(c);
        });
        
        byRepo.forEach((items, repo) => {
            console.log(`\n📁 ${repo}:`);
            items.slice(0, 20).forEach(item => {
                console.log(`   ${item.type === 'class' ? '🔷' : '🔶'} ${item.match}`);
                console.log(`      ${item.path}`);
            });
            if (items.length > 20) {
                console.log(`   ... and ${items.length - 20} more`);
            }
        });
        
    } else {
        // Default: показва usage
        console.log(`
Usage:
  npx ts-node scripts/existence-checker.ts --search "query"    # Search everywhere
  npx ts-node scripts/existence-checker.ts --module "Name"     # Check if module exists
  npx ts-node scripts/existence-checker.ts --check-connections # Check nervous system
  npx ts-node scripts/existence-checker.ts --list-all          # List all classes

Examples:
  --search "ganglion"        # Find anything named ganglion
  --search "reflex"          # Find reflex-related code
  --module "Chronicler"      # Check if Chronicler class exists
  --check-connections        # Verify nervous system modules
`);
    }
}

function printReport(report: ExistenceReport): void {
    console.log(`\n╔══════════════════════════════════════════════════════════════════════════════╗`);
    console.log(`║  SEARCH RESULTS                                                              ║`);
    console.log(`╠══════════════════════════════════════════════════════════════════════════════╣`);
    console.log(`║  Query: ${report.query.padEnd(65)}║`);
    console.log(`║  Found: ${report.found ? 'YES ✅' : 'NO ❌'}                                                           ║`);
    console.log(`║  Matches: ${report.totalMatches.toString().padEnd(63)}║`);
    console.log(`╚══════════════════════════════════════════════════════════════════════════════╝\n`);
    
    if (report.results.length > 0) {
        console.log(`📍 Results:\n`);
        
        // Групиране по тип
        const byType = new Map<string, SearchResult[]>();
        report.results.forEach(r => {
            if (!byType.has(r.type)) byType.set(r.type, []);
            byType.get(r.type)!.push(r);
        });
        
        const typeIcons: Record<string, string> = {
            'class': '🔷 CLASSES',
            'function': '🔶 FUNCTIONS',
            'export': '📦 EXPORTS',
            'file': '📄 FILES',
            'folder': '📁 FOLDERS',
            'variable': '📝 REFERENCES'
        };
        
        byType.forEach((items, type) => {
            console.log(`\n${typeIcons[type] || type}:`);
            items.slice(0, 10).forEach(item => {
                console.log(`   [${item.repo}] ${item.match}`);
                console.log(`      Path: ${item.path}`);
                if (item.context) {
                    console.log(`      Context: ${item.context}`);
                }
            });
            if (items.length > 10) {
                console.log(`   ... and ${items.length - 10} more`);
            }
        });
    }
    
    if (report.duplicates.length > 0) {
        console.log(`\n⚠️  DUPLICATES DETECTED:`);
        report.duplicates.forEach(d => {
            console.log(`   ${d.match} in ${d.repo}${d.path}`);
        });
    }
    
    console.log(`\n💡 Suggestions:`);
    report.suggestions.forEach(s => console.log(`   ${s}`));
}

// Run
main().catch(console.error);
