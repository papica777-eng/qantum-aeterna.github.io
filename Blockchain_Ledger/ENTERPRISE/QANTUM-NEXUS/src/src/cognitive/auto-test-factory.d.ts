/**
 * 🏭 AUTO TEST FACTORY - Self-Writing Test Generator
 *
 * Transforms discovered site maps into ready-to-run tests.
 * Generates both Ghost-API tests and Playwright-UI tests.
 *
 * "QANTUM writes its own tests!"
 *
 * @version 1.0.0
 * @phase 87-88
 */
import { SiteMap } from './autonomous-explorer';
interface TestFactoryConfig {
    outputDir: string;
    generateGhostTests: boolean;
    generatePlaywrightTests: boolean;
    generateApiTests: boolean;
    generateE2ETests: boolean;
    testFramework: 'playwright' | 'jest' | 'mocha';
    language: 'typescript' | 'javascript';
    includeComments: boolean;
    generateDataFactories: boolean;
}
interface GeneratedTest {
    id: string;
    name: string;
    type: 'ghost-api' | 'playwright-ui' | 'api' | 'e2e';
    filePath: string;
    code: string;
    estimatedDuration: number;
    coverage: string[];
}
interface TestSuite {
    name: string;
    description: string;
    tests: GeneratedTest[];
    setupCode: string;
    teardownCode: string;
}
export declare class AutoTestFactory {
    private config;
    private generatedTests;
    constructor(config?: Partial<TestFactoryConfig>);
    /**
     * 🏭 Generate all tests from sitemap
     */
    generateFromSiteMap(siteMap: SiteMap): Promise<TestSuite[]>;
    /**
     * 👻 Generate Ghost-API tests
     * These tests convert UI actions to direct API calls for 100x speed
     */
    private generateGhostTests;
    /**
     * Generate Ghost test for a form
     */
    private generateGhostFormTest;
    /**
     * Generate Ghost test for an API endpoint
     */
    private generateGhostApiTest;
    /**
     * 🎭 Generate Playwright UI tests
     */
    private generatePlaywrightTests;
    /**
     * Generate page test
     */
    private generatePageTest;
    /**
     * Generate form UI test
     */
    private generateFormUITest;
    /**
     * 🔌 Generate pure API tests
     */
    private generateApiTests;
    /**
     * Generate API endpoint test
     */
    private generateApiEndpointTest;
    /**
     * 🔄 Generate E2E flow tests
     */
    private generateE2ETests;
    /**
     * Generate flow test
     */
    private generateFlowTest;
    /**
     * 📦 Generate data factories
     */
    private generateDataFactories;
    private generateGhostSetup;
    private generateGhostTeardown;
    private generatePlaywrightSetup;
    private generatePlaywrightTeardown;
    private generateApiSetup;
    private generateE2ESetup;
    private generateE2ETeardown;
    private generateFieldValue;
    private getFieldSelector;
    private getFieldFillMethod;
    private getFactoryMethod;
    private urlToTestName;
    private capitalize;
    private escapeRegex;
    /**
     * Write tests to disk
     */
    private writeTestsToDisk;
    /**
     * Print summary
     */
    private printSummary;
}
export declare function createTestFactory(config?: Partial<TestFactoryConfig>): AutoTestFactory;
export {};
//# sourceMappingURL=auto-test-factory.d.ts.map