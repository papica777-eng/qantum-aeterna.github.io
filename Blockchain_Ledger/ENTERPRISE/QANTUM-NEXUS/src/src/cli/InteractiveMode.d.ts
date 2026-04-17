/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: INTERACTIVE MODE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Interactive REPL for Mind Engine
 * Real-time test execution and debugging
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export interface InteractiveCommand {
    name: string;
    aliases?: string[];
    description: string;
    usage?: string;
    execute: (args: string[], context: InteractiveContext) => Promise<string | void>;
}
export interface InteractiveContext {
    browser?: any;
    page?: any;
    history: string[];
    variables: Map<string, any>;
    workDir: string;
}
export interface InteractiveConfig {
    prompt?: string;
    historySize?: number;
    autoComplete?: boolean;
}
export declare class InteractiveMode extends EventEmitter {
    private commands;
    private aliases;
    private context;
    private rl?;
    private config;
    private running;
    constructor(config?: InteractiveConfig);
    /**
     * Register command
     */
    register(command: InteractiveCommand): this;
    /**
     * Start interactive mode
     */
    start(): Promise<void>;
    /**
     * Stop interactive mode
     */
    stop(): void;
    private loop;
    private prompt;
    private execute;
    private parseInput;
    private completer;
    private printBanner;
    private registerBuiltins;
}
export declare function createInteractiveMode(config?: InteractiveConfig): InteractiveMode;
declare const _default: {
    InteractiveMode: typeof InteractiveMode;
    createInteractiveMode: typeof createInteractiveMode;
};
export default _default;
//# sourceMappingURL=InteractiveMode.d.ts.map