/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ⚛️ QANTUM: CLI TOOL
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Command-line interface for QAntum
 * Test running, config generation, reporting
 *
 * @author dp
 * @organization QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
export interface CLIOptions {
    command: string;
    args: string[];
    flags: Record<string, string | boolean>;
    cwd: string;
}
export interface Command {
    name: string;
    description: string;
    aliases?: string[];
    options?: Array<{
        flag: string;
        alias?: string;
        description: string;
        type: 'string' | 'boolean' | 'number';
        default?: any;
        required?: boolean;
    }>;
    action: (options: CLIOptions) => Promise<void>;
}
export declare class CLIEngine {
    private name;
    private version;
    private commands;
    private aliases;
    constructor(name: string, version: string);
    /**
     * Register command
     */
    register(command: Command): this;
    /**
     * Parse arguments
     */
    parse(argv: string[]): CLIOptions;
    /**
     * Run CLI
     */
    run(argv: string[]): Promise<void>;
    private resolveCommand;
    private registerBuiltins;
    private showHelp;
    private showCommandHelp;
    private showVersion;
}
export declare const runCommand: Command;
export declare const initCommand: Command;
export declare const reportCommand: Command;
export declare const ciCommand: Command;
export declare const showCommand: Command;
export declare const debugCommand: Command;
export declare function createCLI(): CLIEngine;
export declare function main(): Promise<void>;
declare const _default: {
    CLIEngine: typeof CLIEngine;
    createCLI: typeof createCLI;
    main: typeof main;
    runCommand: Command;
    initCommand: Command;
    reportCommand: Command;
    ciCommand: Command;
    showCommand: Command;
    debugCommand: Command;
};
export default _default;
//# sourceMappingURL=CLI.d.ts.map