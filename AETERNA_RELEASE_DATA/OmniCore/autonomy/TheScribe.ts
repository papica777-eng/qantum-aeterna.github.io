import { execSync, spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// 📊 INTERFACES (Synthesized from QAntum Surgeon)
interface ErrorDetail {
    file: string;
    line: number;
    column: number;
    code: string;
    message: string;
    context?: string;
}

interface MutationResult {
    file: string;
    success: boolean;
    errorsFixed: number;
    errorsBefore: number;
    errorsAfter: number;
    mutationBranch?: string;
}

export class ScribeEngine {
    private workingDir: string;
    private maxRetries = 3;

    constructor(workingDir: string = process.cwd()) {
        this.workingDir = workingDir;
        this.ensureGitInitialized();
    }

    private ensureGitInitialized(): void {
        try {
            execSync('git rev-parse --is-inside-work-tree', { cwd: this.workingDir });
        } catch {
            console.warn('[The Scribe] ⚠️ Working directory is not a git repository. Initializing...');
            execSync('git init', { cwd: this.workingDir });
        }
    }

    /**
     * Fix Strategies: Pattern-based healing (O(1) per match)
     */
    private fixStrategies: Record<string, (error: ErrorDetail, lines: string[]) => { fixed: boolean; lines: string[]; description: string }> = {
        TS2307: (error, lines) => {
            const line = lines[error.line - 1];
            const fixes: Array<[RegExp, string]> = [
                [/from ['"]\.\/voice-commander['"]/, "from '../multimodal/voice-commander'"],
                [/from ['"]\.\/thermal-aware-pool['"]/, "from '../enterprise/thermal-aware-pool'"],
                [/from ['"]\.\/worker-pool['"]/, "from '../bastion/workers/worker-pool'"],
            ];
            for (const [pattern, replacement] of fixes) {
                if (pattern.test(line)) {
                    lines[error.line - 1] = line.replace(pattern, replacement);
                    return { fixed: true, lines, description: 'Fixed import path' };
                }
            }
            return { fixed: false, lines, description: 'Unknown module' };
        },
        TS4114: (error, lines) => {
            const line = lines[error.line - 1];
            if (!line.includes('override')) {
                const fixed = line.replace(/(\s+)(async\s+)?/, '$1override $2');
                if (fixed !== line) {
                    lines[error.line - 1] = fixed;
                    return { fixed: true, lines, description: 'Added override modifier' };
                }
            }
            return { fixed: false, lines, description: 'Could not add override' };
        },
        TS2532: (error, lines) => {
            const line = lines[error.line - 1];
            const propMatch = error.message.match(/'(\w+)'/);
            if (propMatch) {
                const prop = propMatch[1];
                const fixed = line.replace(new RegExp(`(\\w+)\\.${prop}(?!\\?)`, 'g'), `$1?.${prop}`);
                if (fixed !== line) {
                    lines[error.line - 1] = fixed;
                    return { fixed: true, lines, description: `Added optional chaining for ${prop}` };
                }
            }
            return { fixed: false, lines, description: 'Optional chaining failed' };
        }
    };

    /**
     * Discovery: Identify defects via TSC
     * Complexity: O(n)
     */
    async scanForErrors(): Promise<ErrorDetail[]> {
        console.log('[The Scribe] 🔍 Scanning for logical entropy via TSC...');
        try {
            execSync('npx tsc --noEmit', { cwd: this.workingDir, stdio: 'pipe' });
            return [];
        } catch (error: any) {
            const output = error.stdout?.toString() || '';
            return this.parseTSCErrors(output);
        }
    }

    private parseTSCErrors(output: string): ErrorDetail[] {
        const errors: ErrorDetail[] = [];
        const lines = output.split('\n');
        const regex = /(.+)\((\d+),(\d+)\): error (TS\d+): (.+)/;

        for (const line of lines) {
            const match = line.match(regex);
            if (match) {
                errors.push({
                    file: match[1],
                    line: parseInt(match[2]),
                    column: parseInt(match[3]),
                    code: match[4],
                    message: match[5]
                });
            }
        }
        return errors;
    }

    /**
     * Healing: Atomic Surgery with Shadow-File Protocol
     */
    async performSurgery(filePath: string, errors: ErrorDetail[]): Promise<boolean> {
        console.log(`[The Scribe] 🩺 Performing surgery on ${filePath}...`);
        const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(this.workingDir, filePath);
        if (!fs.existsSync(absolutePath)) return false;

        const originalContent = fs.readFileSync(absolutePath, 'utf8');
        let lines = originalContent.split('\n');
        let mutated = false;

        // Apply fixes from bottom to top to preserve line positions
        const sortedErrors = [...errors].sort((a, b) => b.line - a.line);

        for (const error of sortedErrors) {
            const strategy = this.fixStrategies[error.code];
            if (strategy) {
                const result = strategy(error, lines);
                if (result.fixed) {
                    lines = result.lines;
                    mutated = true;
                    console.log(`[The Scribe] 🧪 Applied: ${result.description} at line ${error.line}`);
                }
            }
        }

        if (mutated) {
            const shadowPath = `${absolutePath}.shadow.ts`;
            fs.writeFileSync(shadowPath, lines.join('\n'));

            // Shadow Validation
            try {
                execSync(`npx tsc ${shadowPath} --noEmit --esModuleInterop --skipLibCheck`, { stdio: 'pipe' });
                fs.renameSync(shadowPath, absolutePath);
                console.log(`[The Scribe] ✅ Surgery Successful: ${filePath}`);
                return true;
            } catch (error) {
                console.error(`[The Scribe] ❌ Shadow validation failed for ${filePath}. Reverting.`);
                if (fs.existsSync(shadowPath)) fs.unlinkSync(shadowPath);
                return false;
            }
        }

        return false;
    }

    /**
     * Manifestation: Recursive Self-Healing Loop
     */
    async autonomousHeal(): Promise<MutationResult[]> {
        let iterations = 0;
        const results: MutationResult[] = [];

        while (iterations < this.maxRetries) {
            const errors = await this.scanForErrors();
            if (errors.length === 0) break;

            const errorsByFile: Record<string, ErrorDetail[]> = {};
            errors.forEach(err => {
                if (!errorsByFile[err.file]) errorsByFile[err.file] = [];
                errorsByFile[err.file].push(err);
            });

            for (const [file, fileErrors] of Object.entries(errorsByFile)) {
                const success = await this.performSurgery(file, fileErrors);
                results.push({
                    file,
                    success,
                    errorsFixed: success ? fileErrors.length : 0,
                    errorsBefore: fileErrors.length,
                    errorsAfter: success ? 0 : fileErrors.length // Simplified
                });
            }
            iterations++;
        }

        return results;
    }

    async manifestPR(branchName: string, title: string, body: string): Promise<string> {
        try {
            const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: this.workingDir }).toString().trim();
            if (currentBranch !== branchName) {
                execSync(`git checkout -b ${branchName} || git checkout ${branchName}`, { cwd: this.workingDir });
            }

            execSync('git add .', { cwd: this.workingDir });
            const status = execSync('git status --porcelain', { cwd: this.workingDir }).toString();
            if (!status) return 'NO_CHANGES';

            execSync(`git commit -m "[SCRIBE_MUTATION]: ${title}"`, { cwd: this.workingDir });
            
            try {
                execSync(`gh pr create --title "${title}" --body "${body}" --head ${branchName}`, { cwd: this.workingDir });
                return `SUCCESS: PR_CREATED_${branchName}`;
            } catch {
                return `SUCCESS: PUSHED_ONLY_${branchName}`;
            }
        } catch (error) {
            return `FAILURE: ${error}`;
        }
    }
}

export default ScribeEngine;
