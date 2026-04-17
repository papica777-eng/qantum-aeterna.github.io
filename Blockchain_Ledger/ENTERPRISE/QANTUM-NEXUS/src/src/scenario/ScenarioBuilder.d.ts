/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: SCENARIO BUILDER & DSL
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Declarative scenario definition, step registry, conditional flows
 * Loop constructs, data-driven scenarios
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export type StepAction = (ctx: ScenarioContext) => Promise<void | any>;
export interface StepDefinition {
    name: string;
    description?: string;
    action: StepAction;
    timeout?: number;
    retries?: number;
    onError?: 'continue' | 'abort' | 'skip';
    tags?: string[];
}
export interface ScenarioStep {
    type: 'action' | 'condition' | 'loop' | 'parallel' | 'wait' | 'assert' | 'log';
    name: string;
    args?: Record<string, any>;
    condition?: (ctx: ScenarioContext) => boolean | Promise<boolean>;
    then?: ScenarioStep[];
    else?: ScenarioStep[];
    items?: any[] | ((ctx: ScenarioContext) => any[] | Promise<any[]>);
    itemName?: string;
    steps?: ScenarioStep[];
    duration?: number;
    message?: string | ((ctx: ScenarioContext) => string);
    assertion?: (ctx: ScenarioContext) => boolean | Promise<boolean>;
    assertMessage?: string;
}
export interface ScenarioDefinition {
    name: string;
    description?: string;
    tags?: string[];
    setup?: ScenarioStep[];
    steps: ScenarioStep[];
    teardown?: ScenarioStep[];
    timeout?: number;
    retries?: number;
    variables?: Record<string, any>;
    data?: any[] | (() => any[] | Promise<any[]>);
}
export interface ScenarioContext {
    scenario: ScenarioDefinition;
    variables: Record<string, any>;
    page?: any;
    browser?: any;
    currentStep?: ScenarioStep;
    stepIndex: number;
    iteration?: number;
    data?: any;
    results: ScenarioResult[];
    startTime: Date;
    emit: (event: string, data?: any) => void;
}
export interface ScenarioResult {
    stepName: string;
    status: 'passed' | 'failed' | 'skipped';
    duration: number;
    error?: Error;
    output?: any;
}
export interface ScenarioRunOptions {
    variables?: Record<string, any>;
    data?: any[];
    parallel?: number;
    stopOnError?: boolean;
    hooks?: {
        beforeScenario?: (ctx: ScenarioContext) => Promise<void>;
        afterScenario?: (ctx: ScenarioContext) => Promise<void>;
        beforeStep?: (step: ScenarioStep, ctx: ScenarioContext) => Promise<void>;
        afterStep?: (step: ScenarioStep, result: ScenarioResult, ctx: ScenarioContext) => Promise<void>;
    };
}
export declare class StepRegistry extends EventEmitter {
    private steps;
    private aliases;
    /**
     * Register step
     */
    register(name: string, definition: Omit<StepDefinition, 'name'>): void;
    /**
     * Register step with decorator-like syntax
     */
    step(name: string, options?: Omit<StepDefinition, 'name' | 'action'>): (action: StepAction) => void;
    /**
     * Create alias for step
     */
    alias(aliasName: string, stepName: string): void;
    /**
     * Get step by name
     */
    get(name: string): StepDefinition | undefined;
    /**
     * Check if step exists
     */
    has(name: string): boolean;
    /**
     * List all steps
     */
    list(filter?: {
        tag?: string;
    }): StepDefinition[];
    /**
     * Execute step
     */
    execute(name: string, ctx: ScenarioContext, args?: Record<string, any>): Promise<any>;
    /**
     * Register common browser steps
     */
    registerBrowserSteps(): void;
}
export declare const globalStepRegistry: StepRegistry;
export declare class ScenarioBuilder {
    private scenario;
    private registry;
    constructor(registry?: StepRegistry);
    /**
     * Set scenario name
     */
    name(name: string): this;
    /**
     * Set description
     */
    description(desc: string): this;
    /**
     * Add tags
     */
    tags(...tags: string[]): this;
    /**
     * Set variables
     */
    variables(vars: Record<string, any>): this;
    /**
     * Set timeout
     */
    timeout(ms: number): this;
    /**
     * Set retries
     */
    retries(count: number): this;
    /**
     * Add setup step
     */
    setup(stepOrSteps: ScenarioStep | ScenarioStep[]): this;
    /**
     * Add teardown step
     */
    teardown(stepOrSteps: ScenarioStep | ScenarioStep[]): this;
    /**
     * Add action step
     */
    step(name: string, args?: Record<string, any>): this;
    /**
     * Navigate to URL
     */
    navigate(url: string): this;
    /**
     * Click element
     */
    click(selector: string): this;
    /**
     * Fill input
     */
    fill(selector: string, value: string): this;
    /**
     * Type text
     */
    type(selector: string, text: string, delay?: number): this;
    /**
     * Wait for selector
     */
    waitFor(selector: string, timeout?: number): this;
    /**
     * Wait for duration
     */
    wait(ms: number): this;
    /**
     * Take screenshot
     */
    screenshot(path?: string): this;
    /**
     * Log message
     */
    log(message: string | ((ctx: ScenarioContext) => string)): this;
    /**
     * Add assertion
     */
    assert(assertion: (ctx: ScenarioContext) => boolean | Promise<boolean>, message?: string): this;
    /**
     * Add conditional branch
     */
    if(condition: (ctx: ScenarioContext) => boolean | Promise<boolean>): ConditionalBuilder;
    /**
     * Add loop
     */
    forEach(items: any[] | ((ctx: ScenarioContext) => any[] | Promise<any[]>), itemName?: string): LoopBuilder;
    /**
     * Repeat steps
     */
    repeat(times: number): LoopBuilder;
    /**
     * Add parallel steps
     */
    parallel(...steps: ScenarioStep[]): this;
    /**
     * Add raw step
     */
    addStep(step: ScenarioStep): this;
    /**
     * Set data for data-driven testing
     */
    data(data: any[] | (() => any[] | Promise<any[]>)): this;
    /**
     * Build scenario definition
     */
    build(): ScenarioDefinition;
}
export declare class ConditionalBuilder {
    private parent;
    private condition;
    private thenSteps;
    private elseSteps;
    constructor(parent: ScenarioBuilder, condition: (ctx: ScenarioContext) => boolean | Promise<boolean>);
    /**
     * Add steps for true condition
     */
    then(stepOrSteps: ScenarioStep | ScenarioStep[] | ((b: ScenarioBuilder) => ScenarioBuilder)): this;
    /**
     * Add steps for false condition
     */
    else(stepOrSteps: ScenarioStep | ScenarioStep[] | ((b: ScenarioBuilder) => ScenarioBuilder)): this;
    /**
     * End conditional and return to parent
     */
    endIf(): ScenarioBuilder;
}
export declare class LoopBuilder {
    private parent;
    private items;
    private itemName;
    private loopSteps;
    constructor(parent: ScenarioBuilder, items: any[] | ((ctx: ScenarioContext) => any[] | Promise<any[]>), itemName?: string);
    /**
     * Add step to loop
     */
    do(stepOrSteps: ScenarioStep | ScenarioStep[] | ((b: ScenarioBuilder) => ScenarioBuilder)): this;
    /**
     * End loop and return to parent
     */
    endLoop(): ScenarioBuilder;
}
export declare class ScenarioRunner extends EventEmitter {
    private registry;
    private defaultTimeout;
    constructor(registry?: StepRegistry);
    /**
     * Run scenario
     */
    run(scenario: ScenarioDefinition, options?: ScenarioRunOptions): Promise<{
        success: boolean;
        results: ScenarioResult[];
        duration: number;
    }>;
    /**
     * Run single iteration
     */
    private runSingle;
    /**
     * Execute single step
     */
    private executeStep;
    private executeAction;
    private executeCondition;
    private executeLoop;
    private executeParallel;
    private executeAssert;
}
export declare function scenario(name: string): ScenarioBuilder;
export declare function defineStep(name: string, action: StepAction, options?: Omit<StepDefinition, 'name' | 'action'>): void;
export declare function runScenario(scenario: ScenarioDefinition | ScenarioBuilder, options?: ScenarioRunOptions): Promise<{
    success: boolean;
    results: ScenarioResult[];
    duration: number;
}>;
export declare class ScenarioSuite extends EventEmitter {
    private scenarios;
    private name;
    private runner;
    constructor(name: string);
    /**
     * Add scenario
     */
    add(scenario: ScenarioDefinition | ScenarioBuilder): this;
    /**
     * Run all scenarios
     */
    run(options?: ScenarioRunOptions & {
        parallel?: boolean;
    }): Promise<{
        name: string;
        totalDuration: number;
        passed: number;
        failed: number;
        results: Array<{
            scenario: string;
            success: boolean;
            duration: number;
            results: ScenarioResult[];
        }>;
    }>;
}
declare const _default: {
    ScenarioBuilder: typeof ScenarioBuilder;
    ScenarioRunner: typeof ScenarioRunner;
    ScenarioSuite: typeof ScenarioSuite;
    StepRegistry: typeof StepRegistry;
    globalStepRegistry: StepRegistry;
    scenario: typeof scenario;
    defineStep: typeof defineStep;
    runScenario: typeof runScenario;
};
export default _default;
//# sourceMappingURL=ScenarioBuilder.d.ts.map