#!/usr/bin/env node
/**
 * @file circular-deps.ts
 * @description Circular Dependency Guard - Pre-commit hook за откриване на циклични зависимости
 * @version 1.0.0
 * @author QANTUM AI
 * @phase Phase 2: Architectural Design (The DNA)
 * 
 * @usage
 * ```bash
 * npx ts-node scripts/lint/circular-deps.ts
 * # or as pre-commit hook
 * npm run lint:circular
 * ```
 * 
 * @example
 * Output:
 * ✅ No circular dependencies found
 * or
 * ❌ CIRCULAR DEPENDENCY DETECTED:
 *    src/biology/ghost.ts → src/physics/browser.ts → src/biology/ghost.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

interface Config {
  /** Root directory to scan */
  rootDir: string;
  /** File extensions to analyze */
  extensions: string[];
  /** Directories to ignore */
  ignoreDirs: string[];
  /** Files to ignore */
  ignoreFiles: string[];
  /** Layer hierarchy (higher index = higher layer) */
  layers: LayerDefinition[];
  /** Exit with error code on violation */
  failOnViolation: boolean;
  /** Verbose output */
  verbose: boolean;
}

interface LayerDefinition {
  name: string;
  pattern: RegExp;
  level: number;
}

const CONFIG: Config = {
  rootDir: path.resolve(__dirname, '../../src'),
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  ignoreDirs: ['node_modules', 'dist', 'build', '.git', 'coverage', '__tests__'],
  ignoreFiles: ['*.test.ts', '*.spec.ts', '*.d.ts'],
  layers: [
    { name: 'Mathematics', pattern: /\/math\//, level: 1 },
    { name: 'Logic', pattern: /\/logic\//, level: 2 },
    { name: 'Physics', pattern: /\/physics\//, level: 3 },
    { name: 'Biology', pattern: /\/biology\//, level: 4 },
    { name: 'Reality', pattern: /\/reality\//, level: 5 },
  ],
  failOnViolation: true,
  verbose: process.argv.includes('--verbose') || process.argv.includes('-v'),
};

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface FileNode {
  path: string;
  imports: string[];
  layer?: LayerDefinition;
}

interface DependencyGraph {
  nodes: Map<string, FileNode>;
  edges: Map<string, Set<string>>;
}

interface CircularDependency {
  cycle: string[];
  severity: 'ERROR' | 'WARNING';
}

interface LayerViolation {
  from: FileNode;
  to: FileNode;
  message: string;
}

interface AnalysisResult {
  circularDeps: CircularDependency[];
  layerViolations: LayerViolation[];
  totalFiles: number;
  totalImports: number;
  analysisTime: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const log = {
  info: (msg: string) => console.log(`ℹ️  ${msg}`),
  success: (msg: string) => console.log(`✅ ${msg}`),
  warn: (msg: string) => console.log(`⚠️  ${msg}`),
  error: (msg: string) => console.log(`❌ ${msg}`),
  verbose: (msg: string) => CONFIG.verbose && console.log(`   ${msg}`),
  header: (msg: string) => console.log(`\n${'═'.repeat(60)}\n${msg}\n${'═'.repeat(60)}`),
};

function shouldIgnoreDir(dirPath: string): boolean {
  return CONFIG.ignoreDirs.some(ignore => dirPath.includes(ignore));
}

function shouldIgnoreFile(filePath: string): boolean {
  return CONFIG.ignoreFiles.some(pattern => {
    const regex = new RegExp(pattern.replace('*', '.*'));
    return regex.test(path.basename(filePath));
  });
}

function isValidExtension(filePath: string): boolean {
  return CONFIG.extensions.includes(path.extname(filePath));
}

function getFileLayer(filePath: string): LayerDefinition | undefined {
  return CONFIG.layers.find(layer => layer.pattern.test(filePath));
}

// ═══════════════════════════════════════════════════════════════════════════════
// FILE SCANNING
// ═══════════════════════════════════════════════════════════════════════════════

function scanDirectory(dirPath: string): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dirPath)) {
    log.warn(`Directory not found: ${dirPath}`);
    return files;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (!shouldIgnoreDir(fullPath)) {
        files.push(...scanDirectory(fullPath));
      }
    } else if (entry.isFile()) {
      if (isValidExtension(fullPath) && !shouldIgnoreFile(fullPath)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

// ═══════════════════════════════════════════════════════════════════════════════
// IMPORT EXTRACTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Regex patterns for different import styles
 */
const IMPORT_PATTERNS = [
  // ES6 imports: import X from 'Y'
  /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*\s+from\s+)?['"]([^'"]+)['"]/g,
  // Dynamic imports: import('Y')
  /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  // Require: require('Y')
  /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  // Re-exports: export * from 'Y'
  /export\s+(?:\*|\{[^}]*\})\s+from\s+['"]([^'"]+)['"]/g,
];

function extractImports(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const imports: Set<string> = new Set();
  const fileDir = path.dirname(filePath);

  for (const pattern of IMPORT_PATTERNS) {
    let match;
    // Reset regex state
    pattern.lastIndex = 0;
    
    while ((match = pattern.exec(content)) !== null) {
      const importPath = match[1];
      
      // Skip external packages (not starting with . or /)
      if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
        continue;
      }

      // Resolve relative path
      let resolvedPath = path.resolve(fileDir, importPath);

      // Add extension if missing
      if (!path.extname(resolvedPath)) {
        for (const ext of CONFIG.extensions) {
          const withExt = resolvedPath + ext;
          if (fs.existsSync(withExt)) {
            resolvedPath = withExt;
            break;
          }
          // Check for index file
          const indexPath = path.join(resolvedPath, `index${ext}`);
          if (fs.existsSync(indexPath)) {
            resolvedPath = indexPath;
            break;
          }
        }
      }

      if (fs.existsSync(resolvedPath)) {
        imports.add(resolvedPath);
      }
    }
  }

  return Array.from(imports);
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEPENDENCY GRAPH
// ═══════════════════════════════════════════════════════════════════════════════

function buildDependencyGraph(files: string[]): DependencyGraph {
  const nodes = new Map<string, FileNode>();
  const edges = new Map<string, Set<string>>();

  for (const file of files) {
    const imports = extractImports(file);
    const layer = getFileLayer(file);

    nodes.set(file, {
      path: file,
      imports,
      layer,
    });

    edges.set(file, new Set(imports.filter(imp => files.includes(imp))));
  }

  return { nodes, edges };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CIRCULAR DEPENDENCY DETECTION (Tarjan's Algorithm)
// ═══════════════════════════════════════════════════════════════════════════════

function findCircularDependencies(graph: DependencyGraph): CircularDependency[] {
  const cycles: CircularDependency[] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const path: string[] = [];

  function dfs(node: string): void {
    visited.add(node);
    recursionStack.add(node);
    path.push(node);

    const neighbors = graph.edges.get(node) || new Set();

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      } else if (recursionStack.has(neighbor)) {
        // Cycle detected
        const cycleStart = path.indexOf(neighbor);
        const cycle = path.slice(cycleStart);
        cycle.push(neighbor); // Close the cycle

        cycles.push({
          cycle: cycle.map(p => path.relative(CONFIG.rootDir, p)),
          severity: 'ERROR',
        });
      }
    }

    path.pop();
    recursionStack.delete(node);
  }

  for (const node of graph.nodes.keys()) {
    if (!visited.has(node)) {
      dfs(node);
    }
  }

  return cycles;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYER VIOLATION DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

function findLayerViolations(graph: DependencyGraph): LayerViolation[] {
  const violations: LayerViolation[] = [];

  for (const [filePath, node] of graph.nodes) {
    if (!node.layer) continue;

    for (const importPath of node.imports) {
      const importedNode = graph.nodes.get(importPath);
      if (!importedNode?.layer) continue;

      // Check if lower layer imports from higher layer
      if (node.layer.level < importedNode.layer.level) {
        violations.push({
          from: node,
          to: importedNode,
          message: `Layer violation: ${node.layer.name} (L${node.layer.level}) cannot import from ${importedNode.layer.name} (L${importedNode.layer.level})`,
        });
      }
    }
  }

  return violations;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYSIS & REPORTING
// ═══════════════════════════════════════════════════════════════════════════════

function analyze(): AnalysisResult {
  const startTime = Date.now();

  log.header('🔍 CIRCULAR DEPENDENCY GUARD v1.0');
  log.info(`Scanning: ${CONFIG.rootDir}`);

  // Scan files
  const files = scanDirectory(CONFIG.rootDir);
  log.verbose(`Found ${files.length} files`);

  // Build graph
  const graph = buildDependencyGraph(files);
  const totalImports = Array.from(graph.edges.values()).reduce((sum, set) => sum + set.size, 0);
  log.verbose(`Total imports: ${totalImports}`);

  // Find issues
  const circularDeps = findCircularDependencies(graph);
  const layerViolations = findLayerViolations(graph);

  return {
    circularDeps,
    layerViolations,
    totalFiles: files.length,
    totalImports,
    analysisTime: Date.now() - startTime,
  };
}

function printReport(result: AnalysisResult): void {
  console.log('\n');

  // Circular Dependencies
  if (result.circularDeps.length > 0) {
    log.header('❌ CIRCULAR DEPENDENCIES DETECTED');
    for (const dep of result.circularDeps) {
      console.log(`\n  ${dep.severity}: Cycle found:`);
      console.log(`    ${dep.cycle.join('\n    → ')}`);
    }
  } else {
    log.success('No circular dependencies found');
  }

  // Layer Violations
  if (result.layerViolations.length > 0) {
    log.header('❌ LAYER VIOLATIONS DETECTED');
    for (const violation of result.layerViolations) {
      console.log(`\n  ${violation.message}`);
      console.log(`    From: ${path.relative(CONFIG.rootDir, violation.from.path)}`);
      console.log(`    To:   ${path.relative(CONFIG.rootDir, violation.to.path)}`);
    }
  } else {
    log.success('No layer violations found');
  }

  // Summary
  log.header('📊 SUMMARY');
  console.log(`  Files analyzed:     ${result.totalFiles}`);
  console.log(`  Import statements:  ${result.totalImports}`);
  console.log(`  Circular deps:      ${result.circularDeps.length}`);
  console.log(`  Layer violations:   ${result.layerViolations.length}`);
  console.log(`  Analysis time:      ${result.analysisTime}ms`);
  console.log('');
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRE-COMMIT HOOK INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

function setupPreCommitHook(): void {
  const gitHooksDir = path.resolve(__dirname, '../../.git/hooks');
  const preCommitPath = path.join(gitHooksDir, 'pre-commit');

  const hookScript = `#!/bin/sh
# QAntum Circular Dependency Guard
# Automatically generated - do not edit

echo "🔍 Running Circular Dependency Guard..."

npx ts-node scripts/lint/circular-deps.ts

if [ $? -ne 0 ]; then
  echo "❌ Commit blocked: Fix circular dependencies first"
  exit 1
fi

echo "✅ Dependency check passed"
exit 0
`;

  if (!fs.existsSync(gitHooksDir)) {
    log.warn('Git hooks directory not found. Is this a git repository?');
    return;
  }

  fs.writeFileSync(preCommitPath, hookScript, { mode: 0o755 });
  log.success(`Pre-commit hook installed at ${preCommitPath}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ENTRY POINT
// ═══════════════════════════════════════════════════════════════════════════════

function main(): void {
  // Check for setup flag
  if (process.argv.includes('--setup') || process.argv.includes('-s')) {
    setupPreCommitHook();
    return;
  }

  // Run analysis
  const result = analyze();
  printReport(result);

  // Exit with appropriate code
  const hasErrors = result.circularDeps.length > 0 || result.layerViolations.length > 0;

  if (hasErrors && CONFIG.failOnViolation) {
    log.error('Commit blocked due to dependency issues');
    process.exit(1);
  }

  if (!hasErrors) {
    log.success('All dependency checks passed! 🎉');
  }

  process.exit(0);
}

// Run if executed directly
main();

// Export for programmatic use
export {
  analyze,
  buildDependencyGraph,
  findCircularDependencies,
  findLayerViolations,
  setupPreCommitHook,
  AnalysisResult,
  CircularDependency,
  LayerViolation,
  Config,
};
