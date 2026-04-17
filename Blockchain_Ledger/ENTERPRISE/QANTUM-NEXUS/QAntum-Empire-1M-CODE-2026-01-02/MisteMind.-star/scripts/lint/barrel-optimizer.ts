/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                               ║
 * ║   QANTUM BARREL FILE OPTIMIZER                                                ║
 * ║   "Анализ и оптимизация на index.ts файлове"                                 ║
 * ║                                                                               ║
 * ║   TODO B #2 от V28-SUPREMACY-AUDIT                                            ║
 * ║                                                                               ║
 * ║   © 2025-2026 QAntum | Dimitar Prodromov                                        ║
 * ║                                                                               ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

import * as fs from 'fs';
import * as path from 'path';

// ═══════════════════════════════════════════════════════════════════════════════
// ТИПОВЕ
// ═══════════════════════════════════════════════════════════════════════════════

export interface BarrelAnalysis {
    file: string;
    exports: ExportInfo[];
    unusedExports: string[];
    reexports: ReexportInfo[];
    circularRisk: boolean;
    recommendations: string[];
    optimizedSize: number;
    originalSize: number;
    savings: number;
}

export interface ExportInfo {
    name: string;
    type: 'function' | 'class' | 'interface' | 'type' | 'const' | 'enum' | 'default' | 'namespace';
    isUsed: boolean;
    usageCount: number;
    sourceFile?: string;
}

export interface ReexportInfo {
    from: string;
    exports: string[];
    isWildcard: boolean;
}

export interface OptimizationReport {
    barrels: BarrelAnalysis[];
    totalUnused: number;
    potentialSavings: number;
    recommendations: string[];
    timestamp: string;
}

export interface OptimizerConfig {
    rootDir: string;
    outputPath: string;
    checkUsage: boolean;
    autoFix: boolean;
    verbose: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BARREL OPTIMIZER
// ═══════════════════════════════════════════════════════════════════════════════

export class BarrelOptimizer {
    private config: OptimizerConfig;
    private allFiles: string[] = [];
    private allImports: Map<string, Set<string>> = new Map();

    constructor(config: Partial<OptimizerConfig> = {}) {
        this.config = {
            rootDir: process.cwd(),
            outputPath: './reports/barrel-optimization.json',
            checkUsage: true,
            autoFix: false,
            verbose: true,
            ...config
        };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ГЛАВЕН МЕТОД: OPTIMIZE
    // ─────────────────────────────────────────────────────────────────────────

    async optimize(): Promise<OptimizationReport> {
        this.log('\n' + '═'.repeat(70));
        this.log('📦 BARREL FILE OPTIMIZER');
        this.log('═'.repeat(70) + '\n');

        // Стъпка 1: Намиране на всички файлове
        this.log('📁 Step 1: Scanning files...');
        this.allFiles = this.scanFiles(this.config.rootDir);
        this.log(`   Found ${this.allFiles.length} TypeScript/JavaScript files`);

        // Стъпка 2: Намиране на barrel файлове (index.ts)
        this.log('\n🛢️ Step 2: Finding barrel files...');
        const barrelFiles = this.allFiles.filter(f => 
            f.endsWith('index.ts') || f.endsWith('index.js')
        );
        this.log(`   Found ${barrelFiles.length} barrel files`);

        // Стъпка 3: Събиране на всички импорти
        if (this.config.checkUsage) {
            this.log('\n🔍 Step 3: Analyzing imports...');
            this.collectAllImports();
            this.log(`   Analyzed ${this.allImports.size} import sources`);
        }

        // Стъпка 4: Анализ на всеки barrel
        this.log('\n📊 Step 4: Analyzing barrels...');
        const analyses: BarrelAnalysis[] = [];
        for (const barrel of barrelFiles) {
            const analysis = this.analyzeBarrel(barrel);
            analyses.push(analysis);
            if (analysis.unusedExports.length > 0) {
                this.log(`   ⚠️ ${path.relative(this.config.rootDir, barrel)}: ${analysis.unusedExports.length} unused`);
            }
        }

        // Стъпка 5: Генериране на репорт
        this.log('\n📝 Step 5: Generating report...');
        const report = this.generateReport(analyses);

        // Стъпка 6: Auto-fix ако е включен
        if (this.config.autoFix) {
            this.log('\n🔧 Step 6: Applying fixes...');
            await this.applyFixes(analyses);
        }

        // Запазване на репорта
        await this.saveReport(report);

        // Показване на резюме
        this.printSummary(report);

        return report;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SCANNING
    // ─────────────────────────────────────────────────────────────────────────

    private scanFiles(dir: string): string[] {
        const files: string[] = [];
        
        const walk = (d: string): void => {
            try {
                const entries = fs.readdirSync(d, { withFileTypes: true });
                for (const entry of entries) {
                    const fullPath = path.join(d, entry.name);
                    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') {
                        continue;
                    }
                    if (entry.isDirectory()) {
                        walk(fullPath);
                    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.js')) {
                        if (!entry.name.endsWith('.d.ts') && !entry.name.endsWith('.test.ts') && !entry.name.endsWith('.spec.ts')) {
                            files.push(fullPath);
                        }
                    }
                }
            } catch (e) {}
        };

        walk(dir);
        return files;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // IMPORT COLLECTION
    // ─────────────────────────────────────────────────────────────────────────

    private collectAllImports(): void {
        for (const file of this.allFiles) {
            try {
                const content = fs.readFileSync(file, 'utf-8');
                const imports = this.extractImports(content);
                
                for (const imp of imports) {
                    const resolved = this.resolveImport(file, imp.from);
                    if (resolved) {
                        if (!this.allImports.has(resolved)) {
                            this.allImports.set(resolved, new Set());
                        }
                        for (const name of imp.names) {
                            this.allImports.get(resolved)!.add(name);
                        }
                    }
                }
            } catch (e) {}
        }
    }

    private extractImports(content: string): { from: string; names: string[] }[] {
        const imports: { from: string; names: string[] }[] = [];
        
        // Named imports: import { a, b } from './module'
        const namedRegex = /import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g;
        let match;
        while ((match = namedRegex.exec(content)) !== null) {
            const names = match[1].split(',').map(n => n.trim().split(' as ')[0].trim());
            imports.push({ from: match[2], names });
        }

        // Default imports: import X from './module'
        const defaultRegex = /import\s+(\w+)\s+from\s*['"]([^'"]+)['"]/g;
        while ((match = defaultRegex.exec(content)) !== null) {
            imports.push({ from: match[2], names: ['default'] });
        }

        // Namespace imports: import * as X from './module'
        const namespaceRegex = /import\s*\*\s*as\s+(\w+)\s+from\s*['"]([^'"]+)['"]/g;
        while ((match = namespaceRegex.exec(content)) !== null) {
            imports.push({ from: match[2], names: ['*'] });
        }

        return imports;
    }

    private resolveImport(fromFile: string, importPath: string): string | null {
        if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
            return null; // External package
        }

        const dir = path.dirname(fromFile);
        let resolved = path.resolve(dir, importPath);
        
        const extensions = ['.ts', '.js', '/index.ts', '/index.js'];
        for (const ext of extensions) {
            const withExt = resolved + ext;
            if (fs.existsSync(withExt)) {
                return withExt;
            }
        }
        
        return fs.existsSync(resolved) ? resolved : null;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BARREL ANALYSIS
    // ─────────────────────────────────────────────────────────────────────────

    private analyzeBarrel(barrelPath: string): BarrelAnalysis {
        const content = fs.readFileSync(barrelPath, 'utf-8');
        const originalSize = content.length;

        // Извличане на експорти
        const exports = this.extractExports(content);

        // Извличане на реекспорти
        const reexports = this.extractReexports(content);

        // Проверка за използване
        const usedExports = this.allImports.get(barrelPath) || new Set();
        
        for (const exp of exports) {
            exp.isUsed = usedExports.has(exp.name) || usedExports.has('*');
            exp.usageCount = exp.isUsed ? 1 : 0;
        }

        const unusedExports = exports
            .filter(e => !e.isUsed && e.name !== 'default')
            .map(e => e.name);

        // Проверка за циклични рискове
        const circularRisk = this.checkCircularRisk(barrelPath, reexports);

        // Препоръки
        const recommendations = this.generateBarrelRecommendations(
            barrelPath, exports, reexports, unusedExports, circularRisk
        );

        // Изчисляване на потенциално спестяване
        const optimizedContent = this.generateOptimizedBarrel(exports.filter(e => e.isUsed), reexports);
        const optimizedSize = optimizedContent.length;

        return {
            file: path.relative(this.config.rootDir, barrelPath),
            exports,
            unusedExports,
            reexports,
            circularRisk,
            recommendations,
            optimizedSize,
            originalSize,
            savings: Math.max(0, originalSize - optimizedSize)
        };
    }

    private extractExports(content: string): ExportInfo[] {
        const exports: ExportInfo[] = [];

        // Named exports
        const patterns: [RegExp, ExportInfo['type']][] = [
            [/export\s+function\s+(\w+)/g, 'function'],
            [/export\s+class\s+(\w+)/g, 'class'],
            [/export\s+interface\s+(\w+)/g, 'interface'],
            [/export\s+type\s+(\w+)/g, 'type'],
            [/export\s+const\s+(\w+)/g, 'const'],
            [/export\s+enum\s+(\w+)/g, 'enum'],
        ];

        for (const [regex, type] of patterns) {
            let match;
            while ((match = regex.exec(content)) !== null) {
                exports.push({
                    name: match[1],
                    type,
                    isUsed: false,
                    usageCount: 0
                });
            }
        }

        // Default export
        if (/export\s+default/.test(content)) {
            exports.push({
                name: 'default',
                type: 'default',
                isUsed: true, // Assume default is always used
                usageCount: 1
            });
        }

        return exports;
    }

    private extractReexports(content: string): ReexportInfo[] {
        const reexports: ReexportInfo[] = [];

        // export { a, b } from './module'
        const namedReexport = /export\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g;
        let match;
        while ((match = namedReexport.exec(content)) !== null) {
            const exports = match[1].split(',').map(n => n.trim().split(' as ')[0].trim());
            reexports.push({
                from: match[2],
                exports,
                isWildcard: false
            });
        }

        // export * from './module'
        const wildcardReexport = /export\s*\*\s*from\s*['"]([^'"]+)['"]/g;
        while ((match = wildcardReexport.exec(content)) !== null) {
            reexports.push({
                from: match[1],
                exports: ['*'],
                isWildcard: true
            });
        }

        return reexports;
    }

    private checkCircularRisk(barrelPath: string, reexports: ReexportInfo[]): boolean {
        // Wildcard reexports увеличават риска от цикли
        const wildcardCount = reexports.filter(r => r.isWildcard).length;
        return wildcardCount > 2;
    }

    private generateBarrelRecommendations(
        barrelPath: string,
        exports: ExportInfo[],
        reexports: ReexportInfo[],
        unused: string[],
        circularRisk: boolean
    ): string[] {
        const recommendations: string[] = [];

        if (unused.length > 0) {
            recommendations.push(`Remove ${unused.length} unused exports: ${unused.slice(0, 3).join(', ')}${unused.length > 3 ? '...' : ''}`);
        }

        if (circularRisk) {
            recommendations.push('Consider explicit named exports instead of wildcards to reduce circular dependency risk');
        }

        if (reexports.filter(r => r.isWildcard).length > 3) {
            recommendations.push('Too many wildcard re-exports. Consider selective exports for better tree-shaking');
        }

        if (exports.length > 50) {
            recommendations.push('Large barrel file. Consider splitting into domain-specific sub-barrels');
        }

        return recommendations;
    }

    private generateOptimizedBarrel(usedExports: ExportInfo[], reexports: ReexportInfo[]): string {
        let content = '// Optimized barrel file\n\n';
        
        // Group reexports by source
        for (const reexport of reexports) {
            if (reexport.isWildcard) {
                content += `export * from '${reexport.from}';\n`;
            } else {
                content += `export { ${reexport.exports.join(', ')} } from '${reexport.from}';\n`;
            }
        }

        return content;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // REPORT GENERATION
    // ─────────────────────────────────────────────────────────────────────────

    private generateReport(analyses: BarrelAnalysis[]): OptimizationReport {
        const totalUnused = analyses.reduce((sum, a) => sum + a.unusedExports.length, 0);
        const potentialSavings = analyses.reduce((sum, a) => sum + a.savings, 0);

        const recommendations: string[] = [];
        
        if (totalUnused > 10) {
            recommendations.push(`Remove ${totalUnused} unused exports across ${analyses.filter(a => a.unusedExports.length > 0).length} files`);
        }

        const riskyBarrels = analyses.filter(a => a.circularRisk);
        if (riskyBarrels.length > 0) {
            recommendations.push(`${riskyBarrels.length} barrel files have high circular dependency risk`);
        }

        return {
            barrels: analyses,
            totalUnused,
            potentialSavings,
            recommendations,
            timestamp: new Date().toISOString()
        };
    }

    private async saveReport(report: OptimizationReport): Promise<void> {
        const dir = path.dirname(this.config.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(this.config.outputPath, JSON.stringify(report, null, 2));
    }

    private printSummary(report: OptimizationReport): void {
        console.log('\n' + '═'.repeat(70));
        console.log('📊 BARREL OPTIMIZATION SUMMARY');
        console.log('═'.repeat(70));

        console.log(`\n📦 Barrels analyzed: ${report.barrels.length}`);
        console.log(`⚠️ Unused exports: ${report.totalUnused}`);
        console.log(`💾 Potential savings: ${(report.potentialSavings / 1024).toFixed(1)} KB`);

        if (report.recommendations.length > 0) {
            console.log('\n💡 Recommendations:');
            for (const rec of report.recommendations) {
                console.log(`   • ${rec}`);
            }
        }

        // Top offenders
        const withUnused = report.barrels
            .filter(b => b.unusedExports.length > 0)
            .sort((a, b) => b.unusedExports.length - a.unusedExports.length)
            .slice(0, 5);

        if (withUnused.length > 0) {
            console.log('\n🔴 Top files with unused exports:');
            for (const b of withUnused) {
                console.log(`   ${b.file}: ${b.unusedExports.length} unused`);
            }
        }

        console.log('\n' + '═'.repeat(70));
        console.log(`💾 Report saved to: ${this.config.outputPath}`);
        console.log('═'.repeat(70) + '\n');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // AUTO-FIX
    // ─────────────────────────────────────────────────────────────────────────

    private async applyFixes(analyses: BarrelAnalysis[]): Promise<void> {
        for (const analysis of analyses) {
            if (analysis.unusedExports.length > 0 && analysis.recommendations.length > 0) {
                this.log(`   Fixing: ${analysis.file}`);
                // TODO: Implement actual file modification
                // For now, just log what would be done
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // UTILITIES
    // ─────────────────────────────────────────────────────────────────────────

    private log(message: string): void {
        if (this.config.verbose) {
            console.log(`[BarrelOptimizer] ${message}`);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export const createBarrelOptimizer = (config?: Partial<OptimizerConfig>): BarrelOptimizer => {
    return new BarrelOptimizer(config);
};

export default BarrelOptimizer;

// ═══════════════════════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════════════════════

if (require.main === module) {
    const optimizer = new BarrelOptimizer({
        rootDir: process.argv[2] || process.cwd(),
        verbose: true
    });
    
    optimizer.optimize()
        .then(report => {
            process.exit(report.totalUnused > 20 ? 1 : 0);
        })
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}
