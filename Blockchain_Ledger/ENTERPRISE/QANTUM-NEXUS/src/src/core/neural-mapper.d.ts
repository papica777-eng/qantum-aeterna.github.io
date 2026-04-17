/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🧠 NEURAL MAPPER - THE BRAIN MAP
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * v1.0.0 "Quantum" Edition - Living System Protocol
 *
 * This module creates a complete dependency graph of the entire codebase using
 * Abstract Syntax Tree (AST) parsing. It enables QANTUM to "understand"
 * the code structure instantly without reading files as text.
 *
 * Features:
 * - AST-based function/class/interface extraction
 * - Dependency graph generation
 * - Import/Export relationship mapping
 * - Cyclomatic complexity analysis
 * - Call graph visualization
 * - Context Pulse snapshots
 *
 * @version 1.0.0
 * @codename Quantum
 * @author Димитър Продромов (Meta-Architect)
 * @copyright 2025. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */
interface ASTNode {
    type: 'function' | 'class' | 'interface' | 'variable' | 'import' | 'export' | 'method';
    name: string;
    filePath: string;
    line: number;
    column: number;
    complexity: number;
    dependencies: string[];
    dependents: string[];
    signature?: string;
    docComment?: string;
}
interface FileNode {
    path: string;
    relativePath: string;
    hash: string;
    size: number;
    lastModified: Date;
    imports: ImportNode[];
    exports: ExportNode[];
    functions: FunctionNode[];
    classes: ClassNode[];
    interfaces: InterfaceNode[];
    complexity: number;
    healthScore: number;
}
interface ImportNode {
    source: string;
    specifiers: string[];
    isRelative: boolean;
    resolvedPath?: string;
    line: number;
}
interface ExportNode {
    name: string;
    type: 'named' | 'default' | 'all';
    line: number;
}
interface FunctionNode {
    name: string;
    params: string[];
    returnType?: string;
    isAsync: boolean;
    isExported: boolean;
    complexity: number;
    calls: string[];
    line: number;
    endLine: number;
}
interface ClassNode {
    name: string;
    extends?: string;
    implements: string[];
    methods: MethodNode[];
    properties: string[];
    isExported: boolean;
    line: number;
    endLine: number;
}
interface MethodNode {
    name: string;
    params: string[];
    returnType?: string;
    isAsync: boolean;
    isStatic: boolean;
    visibility: 'public' | 'private' | 'protected';
    complexity: number;
    line: number;
}
interface InterfaceNode {
    name: string;
    extends: string[];
    properties: PropertyNode[];
    methods: MethodSignature[];
    isExported: boolean;
    line: number;
}
interface PropertyNode {
    name: string;
    type: string;
    optional: boolean;
}
interface MethodSignature {
    name: string;
    params: string[];
    returnType?: string;
}
interface DependencyEdge {
    from: string;
    to: string;
    type: 'import' | 'call' | 'extends' | 'implements';
    weight: number;
}
interface BrainMap {
    version: string;
    generatedAt: Date;
    snapshotHash: string;
    stats: {
        totalFiles: number;
        totalLines: number;
        totalFunctions: number;
        totalClasses: number;
        totalInterfaces: number;
        avgComplexity: number;
        healthScore: number;
    };
    files: Map<string, FileNode>;
    nodes: Map<string, ASTNode>;
    edges: DependencyEdge[];
    hotspots: string[];
    orphans: string[];
}
interface ContextPulse {
    timestamp: Date;
    memoryUsage: NodeJS.MemoryUsage;
    brainMapHash: string;
    changedFiles: string[];
    healthDelta: number;
    alerts: string[];
}
export declare class NeuralMapper {
    private brainMap;
    private pulseHistory;
    private rootDir;
    private excludeDirs;
    private includeExtensions;
    constructor(rootDir: string);
    /**
     * Generate complete Brain Map of the codebase
     */
    generateBrainMap(): Promise<BrainMap>;
    /**
     * Take a Context Pulse snapshot
     */
    takeContextPulse(): Promise<ContextPulse>;
    /**
     * Export Brain Map to JSON file
     */
    exportBrainMap(outputPath: string): Promise<void>;
    /**
     * Query the Brain Map
     */
    query(question: string): any;
    private scanDirectory;
    private parseFile;
    private extractImports;
    private extractExports;
    private extractFunctions;
    private extractClasses;
    private extractMethods;
    private extractProperties;
    private extractInterfaces;
    private extractInterfaceProperties;
    private extractInterfaceMethods;
    private extractFunctionCalls;
    private findClosingBrace;
    private calculateComplexity;
    private calculateFileHealth;
    private calculateHealthScore;
    private countLines;
    private hashContent;
    private generateSnapshotHash;
    private printStats;
}
export { BrainMap, FileNode, ASTNode, ContextPulse };
//# sourceMappingURL=neural-mapper.d.ts.map