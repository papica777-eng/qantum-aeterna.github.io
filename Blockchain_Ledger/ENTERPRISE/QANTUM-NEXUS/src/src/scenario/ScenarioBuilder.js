"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScenarioSuite = exports.ScenarioRunner = exports.LoopBuilder = exports.ConditionalBuilder = exports.ScenarioBuilder = exports.globalStepRegistry = exports.StepRegistry = void 0;
exports.scenario = scenario;
exports.defineStep = defineStep;
exports.runScenario = runScenario;
const events_1 = require("events");
// ═══════════════════════════════════════════════════════════════════════════════
// STEP REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════
class StepRegistry extends events_1.EventEmitter {
    steps = new Map();
    aliases = new Map();
    /**
     * Register step
     */
    register(name, definition) {
        this.steps.set(name, { name, ...definition });
        this.emit('step:registered', { name });
    }
    /**
     * Register step with decorator-like syntax
     */
    step(name, options) {
        return (action) => {
            this.register(name, { ...options, action });
        };
    }
    /**
     * Create alias for step
     */
    alias(aliasName, stepName) {
        if (!this.steps.has(stepName)) {
            throw new Error(`Step "${stepName}" not found`);
        }
        this.aliases.set(aliasName, stepName);
    }
    /**
     * Get step by name
     */
    get(name) {
        const resolvedName = this.aliases.get(name) || name;
        return this.steps.get(resolvedName);
    }
    /**
     * Check if step exists
     */
    has(name) {
        const resolvedName = this.aliases.get(name) || name;
        return this.steps.has(resolvedName);
    }
    /**
     * List all steps
     */
    list(filter) {
        let steps = Array.from(this.steps.values());
        if (filter?.tag) {
            steps = steps.filter(s => s.tags?.includes(filter.tag));
        }
        return steps;
    }
    /**
     * Execute step
     */
    async execute(name, ctx, args) {
        const step = this.get(name);
        if (!step) {
            throw new Error(`Step "${name}" not found in registry`);
        }
        // Merge args into context variables
        if (args) {
            Object.assign(ctx.variables, args);
        }
        const startTime = Date.now();
        try {
            this.emit('step:start', { name, args });
            const result = await step.action(ctx);
            this.emit('step:complete', { name, duration: Date.now() - startTime, result });
            return result;
        }
        catch (error) {
            this.emit('step:error', { name, error, duration: Date.now() - startTime });
            throw error;
        }
    }
    /**
     * Register common browser steps
     */
    registerBrowserSteps() {
        this.register('navigate', {
            description: 'Navigate to URL',
            action: async (ctx) => {
                await ctx.page.goto(ctx.variables.url || ctx.variables.to);
            }
        });
        this.register('click', {
            description: 'Click element',
            action: async (ctx) => {
                await ctx.page.click(ctx.variables.selector || ctx.variables.on);
            }
        });
        this.register('fill', {
            description: 'Fill input field',
            action: async (ctx) => {
                await ctx.page.fill(ctx.variables.selector || ctx.variables.field, ctx.variables.value || ctx.variables.with);
            }
        });
        this.register('type', {
            description: 'Type text with delay',
            action: async (ctx) => {
                await ctx.page.type(ctx.variables.selector, ctx.variables.text, {
                    delay: ctx.variables.delay || 50
                });
            }
        });
        this.register('wait', {
            description: 'Wait for selector or time',
            action: async (ctx) => {
                if (ctx.variables.selector) {
                    await ctx.page.waitForSelector(ctx.variables.selector, {
                        timeout: ctx.variables.timeout || 30000
                    });
                }
                else if (ctx.variables.ms || ctx.variables.duration) {
                    await new Promise(r => setTimeout(r, ctx.variables.ms || ctx.variables.duration));
                }
            }
        });
        this.register('screenshot', {
            description: 'Take screenshot',
            action: async (ctx) => {
                await ctx.page.screenshot({
                    path: ctx.variables.path || `screenshot_${Date.now()}.png`,
                    fullPage: ctx.variables.fullPage || false
                });
            }
        });
        this.register('assert', {
            description: 'Assert element exists',
            action: async (ctx) => {
                const exists = await ctx.page.locator(ctx.variables.selector).count() > 0;
                if (!exists && !ctx.variables.not) {
                    throw new Error(`Assertion failed: ${ctx.variables.selector} not found`);
                }
                if (exists && ctx.variables.not) {
                    throw new Error(`Assertion failed: ${ctx.variables.selector} should not exist`);
                }
            }
        });
        this.register('getText', {
            description: 'Get element text',
            action: async (ctx) => {
                const text = await ctx.page.locator(ctx.variables.selector).textContent();
                if (ctx.variables.as) {
                    ctx.variables[ctx.variables.as] = text;
                }
                return text;
            }
        });
        this.register('getValue', {
            description: 'Get input value',
            action: async (ctx) => {
                const value = await ctx.page.locator(ctx.variables.selector).inputValue();
                if (ctx.variables.as) {
                    ctx.variables[ctx.variables.as] = value;
                }
                return value;
            }
        });
        this.register('select', {
            description: 'Select dropdown option',
            action: async (ctx) => {
                await ctx.page.selectOption(ctx.variables.selector, ctx.variables.value);
            }
        });
        this.register('check', {
            description: 'Check checkbox',
            action: async (ctx) => {
                await ctx.page.check(ctx.variables.selector);
            }
        });
        this.register('uncheck', {
            description: 'Uncheck checkbox',
            action: async (ctx) => {
                await ctx.page.uncheck(ctx.variables.selector);
            }
        });
        this.register('hover', {
            description: 'Hover over element',
            action: async (ctx) => {
                await ctx.page.hover(ctx.variables.selector);
            }
        });
        this.register('press', {
            description: 'Press keyboard key',
            action: async (ctx) => {
                await ctx.page.keyboard.press(ctx.variables.key);
            }
        });
        this.register('upload', {
            description: 'Upload file',
            action: async (ctx) => {
                await ctx.page.setInputFiles(ctx.variables.selector, ctx.variables.file || ctx.variables.files);
            }
        });
        this.register('evaluate', {
            description: 'Execute JavaScript',
            action: async (ctx) => {
                const result = await ctx.page.evaluate(ctx.variables.script || ctx.variables.fn);
                if (ctx.variables.as) {
                    ctx.variables[ctx.variables.as] = result;
                }
                return result;
            }
        });
        this.register('log', {
            description: 'Log message',
            action: async (ctx) => {
                const message = ctx.variables.message || ctx.variables.msg;
                console.log(`[Scenario] ${message}`);
                ctx.emit('log', { message });
            }
        });
    }
}
exports.StepRegistry = StepRegistry;
// Global step registry
exports.globalStepRegistry = new StepRegistry();
exports.globalStepRegistry.registerBrowserSteps();
// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO BUILDER
// ═══════════════════════════════════════════════════════════════════════════════
class ScenarioBuilder {
    scenario = {
        steps: [],
        variables: {}
    };
    registry;
    constructor(registry = exports.globalStepRegistry) {
        this.registry = registry;
    }
    /**
     * Set scenario name
     */
    name(name) {
        this.scenario.name = name;
        return this;
    }
    /**
     * Set description
     */
    description(desc) {
        this.scenario.description = desc;
        return this;
    }
    /**
     * Add tags
     */
    tags(...tags) {
        this.scenario.tags = [...(this.scenario.tags || []), ...tags];
        return this;
    }
    /**
     * Set variables
     */
    variables(vars) {
        this.scenario.variables = { ...this.scenario.variables, ...vars };
        return this;
    }
    /**
     * Set timeout
     */
    timeout(ms) {
        this.scenario.timeout = ms;
        return this;
    }
    /**
     * Set retries
     */
    retries(count) {
        this.scenario.retries = count;
        return this;
    }
    /**
     * Add setup step
     */
    setup(stepOrSteps) {
        if (!this.scenario.setup)
            this.scenario.setup = [];
        if (Array.isArray(stepOrSteps)) {
            this.scenario.setup.push(...stepOrSteps);
        }
        else {
            this.scenario.setup.push(stepOrSteps);
        }
        return this;
    }
    /**
     * Add teardown step
     */
    teardown(stepOrSteps) {
        if (!this.scenario.teardown)
            this.scenario.teardown = [];
        if (Array.isArray(stepOrSteps)) {
            this.scenario.teardown.push(...stepOrSteps);
        }
        else {
            this.scenario.teardown.push(stepOrSteps);
        }
        return this;
    }
    /**
     * Add action step
     */
    step(name, args) {
        this.scenario.steps.push({
            type: 'action',
            name,
            args
        });
        return this;
    }
    /**
     * Navigate to URL
     */
    navigate(url) {
        return this.step('navigate', { url });
    }
    /**
     * Click element
     */
    click(selector) {
        return this.step('click', { selector });
    }
    /**
     * Fill input
     */
    fill(selector, value) {
        return this.step('fill', { selector, value });
    }
    /**
     * Type text
     */
    type(selector, text, delay) {
        return this.step('type', { selector, text, delay });
    }
    /**
     * Wait for selector
     */
    waitFor(selector, timeout) {
        return this.step('wait', { selector, timeout });
    }
    /**
     * Wait for duration
     */
    wait(ms) {
        this.scenario.steps.push({
            type: 'wait',
            name: 'wait',
            duration: ms
        });
        return this;
    }
    /**
     * Take screenshot
     */
    screenshot(path) {
        return this.step('screenshot', { path });
    }
    /**
     * Log message
     */
    log(message) {
        this.scenario.steps.push({
            type: 'log',
            name: 'log',
            message
        });
        return this;
    }
    /**
     * Add assertion
     */
    assert(assertion, message) {
        this.scenario.steps.push({
            type: 'assert',
            name: 'assert',
            assertion,
            assertMessage: message
        });
        return this;
    }
    /**
     * Add conditional branch
     */
    if(condition) {
        return new ConditionalBuilder(this, condition);
    }
    /**
     * Add loop
     */
    forEach(items, itemName) {
        return new LoopBuilder(this, items, itemName);
    }
    /**
     * Repeat steps
     */
    repeat(times) {
        const items = Array.from({ length: times }, (_, i) => i);
        return new LoopBuilder(this, items, 'index');
    }
    /**
     * Add parallel steps
     */
    parallel(...steps) {
        this.scenario.steps.push({
            type: 'parallel',
            name: 'parallel',
            steps
        });
        return this;
    }
    /**
     * Add raw step
     */
    addStep(step) {
        this.scenario.steps.push(step);
        return this;
    }
    /**
     * Set data for data-driven testing
     */
    data(data) {
        this.scenario.data = data;
        return this;
    }
    /**
     * Build scenario definition
     */
    build() {
        if (!this.scenario.name) {
            throw new Error('Scenario name is required');
        }
        return this.scenario;
    }
}
exports.ScenarioBuilder = ScenarioBuilder;
// ═══════════════════════════════════════════════════════════════════════════════
// CONDITIONAL BUILDER
// ═══════════════════════════════════════════════════════════════════════════════
class ConditionalBuilder {
    parent;
    condition;
    thenSteps = [];
    elseSteps = [];
    constructor(parent, condition) {
        this.parent = parent;
        this.condition = condition;
    }
    /**
     * Add steps for true condition
     */
    then(stepOrSteps) {
        if (typeof stepOrSteps === 'function') {
            const builder = new ScenarioBuilder();
            stepOrSteps(builder);
            this.thenSteps = builder.build().steps;
        }
        else if (Array.isArray(stepOrSteps)) {
            this.thenSteps = stepOrSteps;
        }
        else {
            this.thenSteps = [stepOrSteps];
        }
        return this;
    }
    /**
     * Add steps for false condition
     */
    else(stepOrSteps) {
        if (typeof stepOrSteps === 'function') {
            const builder = new ScenarioBuilder();
            stepOrSteps(builder);
            this.elseSteps = builder.build().steps;
        }
        else if (Array.isArray(stepOrSteps)) {
            this.elseSteps = stepOrSteps;
        }
        else {
            this.elseSteps = [stepOrSteps];
        }
        return this;
    }
    /**
     * End conditional and return to parent
     */
    endIf() {
        this.parent.addStep({
            type: 'condition',
            name: 'if',
            condition: this.condition,
            then: this.thenSteps,
            else: this.elseSteps
        });
        return this.parent;
    }
}
exports.ConditionalBuilder = ConditionalBuilder;
// ═══════════════════════════════════════════════════════════════════════════════
// LOOP BUILDER
// ═══════════════════════════════════════════════════════════════════════════════
class LoopBuilder {
    parent;
    items;
    itemName;
    loopSteps = [];
    constructor(parent, items, itemName = 'item') {
        this.parent = parent;
        this.items = items;
        this.itemName = itemName;
    }
    /**
     * Add step to loop
     */
    do(stepOrSteps) {
        if (typeof stepOrSteps === 'function') {
            const builder = new ScenarioBuilder();
            stepOrSteps(builder);
            this.loopSteps = builder.build().steps;
        }
        else if (Array.isArray(stepOrSteps)) {
            this.loopSteps = stepOrSteps;
        }
        else {
            this.loopSteps = [stepOrSteps];
        }
        return this;
    }
    /**
     * End loop and return to parent
     */
    endLoop() {
        this.parent.addStep({
            type: 'loop',
            name: 'forEach',
            items: this.items,
            itemName: this.itemName,
            steps: this.loopSteps
        });
        return this.parent;
    }
}
exports.LoopBuilder = LoopBuilder;
// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO RUNNER
// ═══════════════════════════════════════════════════════════════════════════════
class ScenarioRunner extends events_1.EventEmitter {
    registry;
    defaultTimeout = 30000;
    constructor(registry = exports.globalStepRegistry) {
        super();
        this.registry = registry;
    }
    /**
     * Run scenario
     */
    async run(scenario, options = {}) {
        const startTime = Date.now();
        const results = [];
        // Get data for data-driven testing
        let dataSet = options.data || [];
        if (!dataSet.length && scenario.data) {
            dataSet = typeof scenario.data === 'function'
                ? await scenario.data()
                : scenario.data;
        }
        // Run without data or with data
        if (dataSet.length === 0) {
            const result = await this.runSingle(scenario, options, undefined, 0);
            results.push(...result.results);
        }
        else {
            // Run for each data item
            for (let i = 0; i < dataSet.length; i++) {
                this.emit('iteration:start', { index: i, data: dataSet[i] });
                const result = await this.runSingle(scenario, options, dataSet[i], i);
                results.push(...result.results);
                if (!result.success && options.stopOnError) {
                    break;
                }
                this.emit('iteration:complete', { index: i, results: result.results });
            }
        }
        const duration = Date.now() - startTime;
        const success = results.every(r => r.status !== 'failed');
        this.emit('scenario:complete', { scenario: scenario.name, success, duration, results });
        return { success, results, duration };
    }
    /**
     * Run single iteration
     */
    async runSingle(scenario, options, data, iteration) {
        const results = [];
        // Create context
        const ctx = {
            scenario,
            variables: { ...scenario.variables, ...options.variables, data },
            stepIndex: 0,
            iteration,
            data,
            results,
            startTime: new Date(),
            emit: (event, eventData) => this.emit(event, eventData)
        };
        try {
            // Before scenario hook
            if (options.hooks?.beforeScenario) {
                await options.hooks.beforeScenario(ctx);
            }
            // Setup
            if (scenario.setup) {
                for (const step of scenario.setup) {
                    await this.executeStep(step, ctx, options, results);
                }
            }
            // Main steps
            for (const step of scenario.steps) {
                const result = await this.executeStep(step, ctx, options, results);
                if (result.status === 'failed' && options.stopOnError) {
                    break;
                }
                ctx.stepIndex++;
            }
        }
        finally {
            // Teardown (always runs)
            if (scenario.teardown) {
                for (const step of scenario.teardown) {
                    try {
                        await this.executeStep(step, ctx, options, results);
                    }
                    catch {
                        // Ignore teardown errors
                    }
                }
            }
            // After scenario hook
            if (options.hooks?.afterScenario) {
                await options.hooks.afterScenario(ctx);
            }
        }
        const success = results.every(r => r.status !== 'failed');
        return { success, results };
    }
    /**
     * Execute single step
     */
    async executeStep(step, ctx, options, results) {
        const startTime = Date.now();
        ctx.currentStep = step;
        // Before step hook
        if (options.hooks?.beforeStep) {
            await options.hooks.beforeStep(step, ctx);
        }
        this.emit('step:start', { step: step.name, type: step.type });
        let result;
        try {
            switch (step.type) {
                case 'action':
                    await this.executeAction(step, ctx);
                    break;
                case 'condition':
                    await this.executeCondition(step, ctx, options, results);
                    break;
                case 'loop':
                    await this.executeLoop(step, ctx, options, results);
                    break;
                case 'parallel':
                    await this.executeParallel(step, ctx, options, results);
                    break;
                case 'wait':
                    await new Promise(r => setTimeout(r, step.duration || 1000));
                    break;
                case 'assert':
                    await this.executeAssert(step, ctx);
                    break;
                case 'log':
                    const message = typeof step.message === 'function'
                        ? step.message(ctx)
                        : step.message;
                    console.log(`[${ctx.scenario.name}] ${message}`);
                    break;
            }
            result = {
                stepName: step.name,
                status: 'passed',
                duration: Date.now() - startTime
            };
        }
        catch (error) {
            result = {
                stepName: step.name,
                status: 'failed',
                duration: Date.now() - startTime,
                error: error
            };
            this.emit('step:error', { step: step.name, error });
        }
        results.push(result);
        // After step hook
        if (options.hooks?.afterStep) {
            await options.hooks.afterStep(step, result, ctx);
        }
        this.emit('step:complete', { step: step.name, result });
        return result;
    }
    async executeAction(step, ctx) {
        if (step.args) {
            Object.assign(ctx.variables, step.args);
        }
        await this.registry.execute(step.name, ctx, step.args);
    }
    async executeCondition(step, ctx, options, results) {
        const conditionResult = step.condition ? await step.condition(ctx) : false;
        const stepsToRun = conditionResult ? step.then : step.else;
        if (stepsToRun) {
            for (const subStep of stepsToRun) {
                await this.executeStep(subStep, ctx, options, results);
            }
        }
    }
    async executeLoop(step, ctx, options, results) {
        const items = typeof step.items === 'function'
            ? await step.items(ctx)
            : step.items || [];
        const itemName = step.itemName || 'item';
        for (let i = 0; i < items.length; i++) {
            ctx.variables[itemName] = items[i];
            ctx.variables[`${itemName}Index`] = i;
            if (step.steps) {
                for (const subStep of step.steps) {
                    await this.executeStep(subStep, ctx, options, results);
                }
            }
        }
    }
    async executeParallel(step, ctx, options, results) {
        if (!step.steps)
            return;
        await Promise.all(step.steps.map(subStep => this.executeStep(subStep, ctx, options, results)));
    }
    async executeAssert(step, ctx) {
        if (!step.assertion)
            return;
        const passed = await step.assertion(ctx);
        if (!passed) {
            throw new Error(step.assertMessage || `Assertion failed in step "${step.name}"`);
        }
    }
}
exports.ScenarioRunner = ScenarioRunner;
// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO DSL (HELPER FUNCTIONS)
// ═══════════════════════════════════════════════════════════════════════════════
function scenario(name) {
    return new ScenarioBuilder().name(name);
}
function defineStep(name, action, options) {
    exports.globalStepRegistry.register(name, { ...options, action });
}
function runScenario(scenario, options) {
    const runner = new ScenarioRunner();
    const scenarioDefinition = scenario instanceof ScenarioBuilder ? scenario.build() : scenario;
    return runner.run(scenarioDefinition, options);
}
// ═══════════════════════════════════════════════════════════════════════════════
// SCENARIO SUITE
// ═══════════════════════════════════════════════════════════════════════════════
class ScenarioSuite extends events_1.EventEmitter {
    scenarios = [];
    name;
    runner;
    constructor(name) {
        super();
        this.name = name;
        this.runner = new ScenarioRunner();
    }
    /**
     * Add scenario
     */
    add(scenario) {
        const def = scenario instanceof ScenarioBuilder ? scenario.build() : scenario;
        this.scenarios.push(def);
        return this;
    }
    /**
     * Run all scenarios
     */
    async run(options = {}) {
        const startTime = Date.now();
        const allResults = [];
        this.emit('suite:start', { name: this.name, scenarios: this.scenarios.length });
        if (options.parallel) {
            const results = await Promise.all(this.scenarios.map(s => this.runner.run(s, options)));
            this.scenarios.forEach((s, i) => {
                allResults.push({
                    scenario: s.name,
                    ...results[i]
                });
            });
        }
        else {
            for (const scenario of this.scenarios) {
                this.emit('scenario:start', { name: scenario.name });
                const result = await this.runner.run(scenario, options);
                allResults.push({
                    scenario: scenario.name,
                    ...result
                });
                if (!result.success && options.stopOnError) {
                    break;
                }
            }
        }
        const passed = allResults.filter(r => r.success).length;
        const failed = allResults.length - passed;
        this.emit('suite:complete', {
            name: this.name,
            passed,
            failed,
            duration: Date.now() - startTime
        });
        return {
            name: this.name,
            totalDuration: Date.now() - startTime,
            passed,
            failed,
            results: allResults
        };
    }
}
exports.ScenarioSuite = ScenarioSuite;
exports.default = {
    ScenarioBuilder,
    ScenarioRunner,
    ScenarioSuite,
    StepRegistry,
    globalStepRegistry: exports.globalStepRegistry,
    scenario,
    defineStep,
    runScenario
};
//# sourceMappingURL=ScenarioBuilder.js.map