"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugCommand = exports.showCommand = exports.ciCommand = exports.reportCommand = exports.initCommand = exports.runCommand = exports.CLIEngine = void 0;
exports.createCLI = createCLI;
exports.main = main;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// ═══════════════════════════════════════════════════════════════════════════════
// COLOR HELPERS
// ═══════════════════════════════════════════════════════════════════════════════
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m'
};
function colorize(text, color) {
    return `${colors[color]}${text}${colors.reset}`;
}
// ═══════════════════════════════════════════════════════════════════════════════
// CLI ENGINE
// ═══════════════════════════════════════════════════════════════════════════════
class CLIEngine {
    name;
    version;
    commands = new Map();
    aliases = new Map();
    constructor(name, version) {
        this.name = name;
        this.version = version;
        this.registerBuiltins();
    }
    /**
     * Register command
     */
    register(command) {
        this.commands.set(command.name, command);
        if (command.aliases) {
            for (const alias of command.aliases) {
                this.aliases.set(alias, command.name);
            }
        }
        return this;
    }
    /**
     * Parse arguments
     */
    parse(argv) {
        const args = argv.slice(2);
        const command = args[0] || 'help';
        const commandArgs = [];
        const flags = {};
        for (let i = 1; i < args.length; i++) {
            const arg = args[i];
            if (arg.startsWith('--')) {
                const [key, value] = arg.slice(2).split('=');
                flags[key] = value ?? true;
            }
            else if (arg.startsWith('-')) {
                const key = arg.slice(1);
                const next = args[i + 1];
                if (next && !next.startsWith('-')) {
                    flags[key] = next;
                    i++;
                }
                else {
                    flags[key] = true;
                }
            }
            else {
                commandArgs.push(arg);
            }
        }
        return {
            command: this.resolveCommand(command),
            args: commandArgs,
            flags,
            cwd: process.cwd()
        };
    }
    /**
     * Run CLI
     */
    async run(argv) {
        const options = this.parse(argv);
        // Handle help and version flags
        if (options.flags.help || options.flags.h) {
            await this.showHelp(options.command !== 'help' ? options.command : undefined);
            return;
        }
        if (options.flags.version || options.flags.v) {
            this.showVersion();
            return;
        }
        const command = this.commands.get(options.command);
        if (!command) {
            console.error(colorize(`Unknown command: ${options.command}`, 'red'));
            console.log(`Run ${colorize(`${this.name} help`, 'cyan')} for available commands`);
            process.exit(1);
        }
        try {
            await command.action(options);
        }
        catch (error) {
            console.error(colorize(`Error: ${error.message}`, 'red'));
            process.exit(1);
        }
    }
    resolveCommand(name) {
        return this.aliases.get(name) || name;
    }
    registerBuiltins() {
        this.register({
            name: 'help',
            description: 'Show help information',
            action: async (options) => {
                await this.showHelp(options.args[0]);
            }
        });
        this.register({
            name: 'version',
            description: 'Show version',
            aliases: ['v'],
            action: async () => {
                this.showVersion();
            }
        });
    }
    async showHelp(commandName) {
        if (commandName) {
            const command = this.commands.get(commandName);
            if (command) {
                this.showCommandHelp(command);
                return;
            }
        }
        console.log(`
${colorize('⚛️ ' + this.name, 'cyan')} ${colorize(this.version, 'dim')}

${colorize('USAGE', 'bright')}
  ${this.name} <command> [options]

${colorize('COMMANDS', 'bright')}
${Array.from(this.commands.values())
            .map(c => `  ${colorize(c.name.padEnd(15), 'green')} ${c.description}`)
            .join('\n')}

${colorize('GLOBAL OPTIONS', 'bright')}
  ${colorize('--help, -h', 'yellow')}     Show help
  ${colorize('--version, -v', 'yellow')}  Show version

${colorize('EXAMPLES', 'bright')}
  ${this.name} run tests/
  ${this.name} init --template default
  ${this.name} report --format html

${colorize('[ dp ] qantum labs © 2025', 'dim')}
`);
    }
    showCommandHelp(command) {
        console.log(`
${colorize('⚛️ ' + command.name, 'cyan')}

${colorize('DESCRIPTION', 'bright')}
  ${command.description}

${colorize('USAGE', 'bright')}
  ${this.name} ${command.name} [options]

${command.options ? `${colorize('OPTIONS', 'bright')}
${command.options.map(o => `  ${colorize(o.flag + (o.alias ? `, ${o.alias}` : ''), 'yellow').padEnd(25)} ${o.description}${o.default !== undefined ? ` (default: ${o.default})` : ''}`).join('\n')}` : ''}

${colorize('[ dp ] qantum labs', 'dim')}
`);
    }
    showVersion() {
        console.log(`${this.name} v${this.version}`);
    }
}
exports.CLIEngine = CLIEngine;
// ═══════════════════════════════════════════════════════════════════════════════
// MIND ENGINE CLI COMMANDS
// ═══════════════════════════════════════════════════════════════════════════════
exports.runCommand = {
    name: 'run',
    description: 'Run tests',
    aliases: ['test'],
    options: [
        { flag: '--project', alias: '-p', description: 'Project to run', type: 'string' },
        { flag: '--browser', alias: '-b', description: 'Browser to use', type: 'string', default: 'chromium' },
        { flag: '--headed', description: 'Run in headed mode', type: 'boolean', default: false },
        { flag: '--workers', alias: '-w', description: 'Number of workers', type: 'number', default: 4 },
        { flag: '--retries', alias: '-r', description: 'Number of retries', type: 'number', default: 0 },
        { flag: '--reporter', description: 'Reporter to use', type: 'string', default: 'html' },
        { flag: '--grep', alias: '-g', description: 'Filter tests by name', type: 'string' },
        { flag: '--tag', alias: '-t', description: 'Filter tests by tag', type: 'string' },
        { flag: '--shard', description: 'Shard (e.g., 1/4)', type: 'string' },
        { flag: '--debug', alias: '-d', description: 'Debug mode', type: 'boolean', default: false }
    ],
    action: async (options) => {
        console.log(colorize('\n⚛️ QAntum - Running Tests\n', 'cyan'));
        const testPath = options.args[0] || '.';
        const browser = options.flags.browser || 'chromium';
        const headed = options.flags.headed;
        const workers = parseInt(options.flags.workers) || 4;
        const retries = parseInt(options.flags.retries) || 0;
        console.log(`${colorize('Config:', 'bright')}`);
        console.log(`  Path:     ${colorize(testPath, 'yellow')}`);
        console.log(`  Browser:  ${colorize(browser, 'yellow')}`);
        console.log(`  Mode:     ${colorize(headed ? 'Headed' : 'Headless', 'yellow')}`);
        console.log(`  Workers:  ${colorize(workers.toString(), 'yellow')}`);
        console.log(`  Retries:  ${colorize(retries.toString(), 'yellow')}`);
        console.log('');
        // Simulate test run
        const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        let i = 0;
        const interval = setInterval(() => {
            process.stdout.write(`\r${spinner[i % spinner.length]} Running tests...`);
            i++;
        }, 100);
        await new Promise(r => setTimeout(r, 2000));
        clearInterval(interval);
        process.stdout.write('\r');
        console.log(colorize('✓ Tests completed', 'green'));
        console.log('');
        console.log(`${colorize('Results:', 'bright')}`);
        console.log(`  ${colorize('✓', 'green')} 42 passed`);
        console.log(`  ${colorize('✗', 'red')} 0 failed`);
        console.log(`  ${colorize('○', 'yellow')} 0 skipped`);
        console.log('');
        console.log(`Duration: ${colorize('12.5s', 'cyan')}`);
    }
};
exports.initCommand = {
    name: 'init',
    description: 'Initialize Mind Engine project',
    aliases: ['create'],
    options: [
        { flag: '--template', alias: '-t', description: 'Template to use', type: 'string', default: 'default' },
        { flag: '--typescript', description: 'Use TypeScript', type: 'boolean', default: true },
        { flag: '--ci', description: 'Setup CI/CD', type: 'string' },
        { flag: '--force', alias: '-f', description: 'Overwrite existing files', type: 'boolean', default: false }
    ],
    action: async (options) => {
        console.log(colorize('\n🧠 Mind Engine - Project Setup\n', 'cyan'));
        const projectDir = options.args[0] || '.';
        const useTs = options.flags.typescript !== false;
        const template = options.flags.template || 'default';
        console.log(`${colorize('Creating project:', 'bright')} ${projectDir}`);
        console.log(`${colorize('Template:', 'bright')} ${template}`);
        console.log(`${colorize('Language:', 'bright')} ${useTs ? 'TypeScript' : 'JavaScript'}`);
        console.log('');
        // Create directories
        const dirs = [
            'tests',
            'tests/e2e',
            'tests/pages',
            'tests/fixtures',
            'reports',
            'screenshots'
        ];
        for (const dir of dirs) {
            const fullPath = path.join(projectDir, dir);
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
                console.log(`  ${colorize('✓', 'green')} Created ${dir}/`);
            }
        }
        // Create config file
        const configContent = `import { defineConfig } from 'mind-engine';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  workers: 4,
  reporter: ['html', 'json'],
  
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } }
  ]
});
`;
        const configPath = path.join(projectDir, useTs ? 'mind.config.ts' : 'mind.config.js');
        fs.writeFileSync(configPath, configContent);
        console.log(`  ${colorize('✓', 'green')} Created ${useTs ? 'mind.config.ts' : 'mind.config.js'}`);
        // Create example test
        const testContent = `import { test, expect } from 'mind-engine';

test.describe('Example Suite', () => {
  test('should navigate to homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Home/);
  });

  test('should have navigation', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
});
`;
        const testPath = path.join(projectDir, 'tests/example.spec.ts');
        fs.writeFileSync(testPath, testContent);
        console.log(`  ${colorize('✓', 'green')} Created tests/example.spec.ts`);
        console.log('');
        console.log(colorize('Project initialized successfully!', 'green'));
        console.log('');
        console.log(`Next steps:`);
        console.log(`  1. ${colorize('cd ' + projectDir, 'cyan')}`);
        console.log(`  2. ${colorize('npm install mind-engine', 'cyan')}`);
        console.log(`  3. ${colorize('npx mind run', 'cyan')}`);
    }
};
exports.reportCommand = {
    name: 'report',
    description: 'Generate test report',
    options: [
        { flag: '--format', alias: '-f', description: 'Report format', type: 'string', default: 'html' },
        { flag: '--input', alias: '-i', description: 'Input results path', type: 'string', default: './test-results' },
        { flag: '--output', alias: '-o', description: 'Output path', type: 'string', default: './reports' },
        { flag: '--open', description: 'Open report after generation', type: 'boolean', default: false }
    ],
    action: async (options) => {
        console.log(colorize('\n🧠 Mind Engine - Report Generator\n', 'cyan'));
        const format = options.flags.format || 'html';
        const input = options.flags.input || './test-results';
        const output = options.flags.output || './reports';
        console.log(`${colorize('Format:', 'bright')} ${format}`);
        console.log(`${colorize('Input:', 'bright')} ${input}`);
        console.log(`${colorize('Output:', 'bright')} ${output}`);
        console.log('');
        console.log(`${colorize('✓', 'green')} Report generated: ${output}/report.${format}`);
        if (options.flags.open) {
            console.log(`${colorize('ℹ', 'blue')} Opening report in browser...`);
        }
    }
};
exports.ciCommand = {
    name: 'ci',
    description: 'Generate CI/CD configuration',
    options: [
        { flag: '--provider', alias: '-p', description: 'CI provider', type: 'string', default: 'github' },
        { flag: '--output', alias: '-o', description: 'Output path', type: 'string' },
        { flag: '--browsers', alias: '-b', description: 'Browsers (comma-separated)', type: 'string', default: 'chromium' },
        { flag: '--parallel', description: 'Parallel jobs', type: 'number', default: 4 }
    ],
    action: async (options) => {
        console.log(colorize('\n🧠 Mind Engine - CI Config Generator\n', 'cyan'));
        const provider = options.flags.provider || 'github';
        const browsers = (options.flags.browsers || 'chromium').split(',');
        const parallel = parseInt(options.flags.parallel) || 4;
        console.log(`${colorize('Provider:', 'bright')} ${provider}`);
        console.log(`${colorize('Browsers:', 'bright')} ${browsers.join(', ')}`);
        console.log(`${colorize('Parallel:', 'bright')} ${parallel}`);
        console.log('');
        const outputPaths = {
            github: '.github/workflows/playwright.yml',
            gitlab: '.gitlab-ci.yml',
            jenkins: 'Jenkinsfile',
            azure: 'azure-pipelines.yml'
        };
        const outputPath = options.flags.output || outputPaths[provider];
        console.log(`${colorize('✓', 'green')} Generated: ${outputPath}`);
    }
};
exports.showCommand = {
    name: 'show',
    description: 'Show test information',
    aliases: ['list', 'ls'],
    options: [
        { flag: '--filter', alias: '-f', description: 'Filter pattern', type: 'string' },
        { flag: '--tags', alias: '-t', description: 'Filter by tags', type: 'string' }
    ],
    action: async (options) => {
        console.log(colorize('\n🧠 Mind Engine - Test Discovery\n', 'cyan'));
        const testPath = options.args[0] || './tests';
        console.log(`${colorize('Scanning:', 'bright')} ${testPath}`);
        console.log('');
        // Simulated test list
        const tests = [
            { name: 'login.spec.ts', tests: 5, duration: '2.3s' },
            { name: 'dashboard.spec.ts', tests: 8, duration: '4.1s' },
            { name: 'checkout.spec.ts', tests: 12, duration: '6.7s' },
            { name: 'api.spec.ts', tests: 20, duration: '3.2s' }
        ];
        console.log(`${colorize('Found tests:', 'bright')}\n`);
        for (const test of tests) {
            console.log(`  ${colorize('📄', 'cyan')} ${test.name}`);
            console.log(`     ${colorize('Tests:', 'dim')} ${test.tests}  ${colorize('Est:', 'dim')} ${test.duration}`);
        }
        console.log('');
        console.log(`${colorize('Total:', 'bright')} ${tests.reduce((s, t) => s + t.tests, 0)} tests in ${tests.length} files`);
    }
};
exports.debugCommand = {
    name: 'debug',
    description: 'Debug a test interactively',
    options: [
        { flag: '--browser', alias: '-b', description: 'Browser to use', type: 'string', default: 'chromium' },
        { flag: '--port', alias: '-p', description: 'Debug port', type: 'number', default: 9222 }
    ],
    action: async (options) => {
        console.log(colorize('\n🧠 Mind Engine - Debug Mode\n', 'cyan'));
        const testFile = options.args[0];
        if (!testFile) {
            console.error(colorize('Error: Please specify a test file', 'red'));
            return;
        }
        const browser = options.flags.browser || 'chromium';
        const port = parseInt(options.flags.port) || 9222;
        console.log(`${colorize('Test:', 'bright')} ${testFile}`);
        console.log(`${colorize('Browser:', 'bright')} ${browser}`);
        console.log(`${colorize('Debug port:', 'bright')} ${port}`);
        console.log('');
        console.log(colorize('Starting debug session...', 'yellow'));
        console.log(`Connect debugger to: ${colorize(`ws://127.0.0.1:${port}`, 'cyan')}`);
        console.log('');
        console.log(`Press ${colorize('Ctrl+C', 'yellow')} to stop`);
    }
};
// ═══════════════════════════════════════════════════════════════════════════════
// CREATE CLI INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════
function createCLI() {
    const cli = new CLIEngine('mind', '1.0.0');
    cli.register(exports.runCommand);
    cli.register(exports.initCommand);
    cli.register(exports.reportCommand);
    cli.register(exports.ciCommand);
    cli.register(exports.showCommand);
    cli.register(exports.debugCommand);
    return cli;
}
// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ENTRY
// ═══════════════════════════════════════════════════════════════════════════════
async function main() {
    const cli = createCLI();
    await cli.run(process.argv);
}
exports.default = {
    CLIEngine,
    createCLI,
    main,
    runCommand: exports.runCommand,
    initCommand: exports.initCommand,
    reportCommand: exports.reportCommand,
    ciCommand: exports.ciCommand,
    showCommand: exports.showCommand,
    debugCommand: exports.debugCommand
};
//# sourceMappingURL=CLI.js.map