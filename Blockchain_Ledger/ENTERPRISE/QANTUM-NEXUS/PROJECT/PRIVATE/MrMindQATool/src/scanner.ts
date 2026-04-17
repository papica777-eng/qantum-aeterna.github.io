/**
 * QAntum QA Tool - Project Scanner
 * Discovers tests and generates new ones
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { chromium } from 'playwright';
import { TestCase } from './runner.js';

// ============================================================================
// TYPES
// ============================================================================

export interface ScannerConfig {
  testsDir?: string;
  testPattern?: string;
  exclude?: string[];
}

export interface PageInfo {
  url: string;
  title: string;
  forms: FormInfo[];
  links: string[];
  buttons: ElementInfo[];
  inputs: ElementInfo[];
}

export interface FormInfo {
  action: string;
  method: string;
  fields: ElementInfo[];
}

export interface ElementInfo {
  selector: string;
  type?: string;
  text?: string;
  attributes: Record<string, string>;
}

export interface BrokenSelector {
  file: string;
  line: number;
  selector: string;
  suggestion: string;
}

// ============================================================================
// PROJECT SCANNER
// ============================================================================

export class ProjectScanner {
  private config: ScannerConfig;
  
  constructor(config: ScannerConfig) {
    this.config = {
      testsDir: config.testsDir || './tests',
      testPattern: config.testPattern || '**/*.test.{ts,js}',
      exclude: config.exclude || ['node_modules', 'dist']
    };
  }
  
  // --------------------------------------------------------------------------
  // FIND TESTS
  // --------------------------------------------------------------------------
  
  async findTests(filePath?: string, tag?: string): Promise<TestCase[]> {
    const tests: TestCase[] = [];
    
    if (filePath) {
      // Single file
      const fileTests = await this.loadTestFile(filePath);
      tests.push(...fileTests);
    } else {
      // Discover all
      const files = await this.discoverTestFiles();
      
      for (const file of files) {
        const fileTests = await this.loadTestFile(file);
        tests.push(...fileTests);
      }
    }
    
    // Filter by tag
    if (tag) {
      return tests.filter(t => t.tags.includes(tag));
    }
    
    return tests;
  }
  
  private async discoverTestFiles(): Promise<string[]> {
    const files: string[] = [];
    
    async function scan(dir: string, pattern: RegExp): Promise<void> {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            await scan(fullPath, pattern);
          } else if (pattern.test(entry.name)) {
            files.push(fullPath);
          }
        }
      } catch {}
    }
    
    const pattern = /\.(test|spec)\.(ts|js)$/;
    await scan(this.config.testsDir!, pattern);
    
    return files;
  }
  
  private async loadTestFile(filePath: string): Promise<TestCase[]> {
    // Dynamic import of test file
    // In production, this would parse and load the test definitions
    return [];
  }
  
  // --------------------------------------------------------------------------
  // CRAWL SITE
  // --------------------------------------------------------------------------
  
  async crawlSite(url: string, depth: number): Promise<PageInfo[]> {
    const pages: PageInfo[] = [];
    const visited = new Set<string>();
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      await this.crawlPage(page, url, depth, visited, pages);
    } finally {
      await browser.close();
    }
    
    return pages;
  }
  
  private async crawlPage(
    page: any,
    url: string,
    depth: number,
    visited: Set<string>,
    pages: PageInfo[]
  ): Promise<void> {
    if (depth < 0 || visited.has(url)) return;
    visited.add(url);
    
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      
      // Extract page info
      const info = await this.extractPageInfo(page, url);
      pages.push(info);
      
      // Crawl links
      if (depth > 0) {
        const baseUrl = new URL(url);
        const sameDomainLinks = info.links.filter(link => {
          try {
            const linkUrl = new URL(link, url);
            return linkUrl.hostname === baseUrl.hostname;
          } catch {
            return false;
          }
        });
        
        for (const link of sameDomainLinks.slice(0, 10)) {
          await this.crawlPage(page, link, depth - 1, visited, pages);
        }
      }
    } catch {}
  }
  
  private async extractPageInfo(page: any, url: string): Promise<PageInfo> {
    const title = await page.title();
    
    // Extract forms
    const forms = await page.$$eval('form', (forms: any[]) => 
      forms.map(form => ({
        action: form.action || '',
        method: form.method || 'GET',
        fields: Array.from(form.querySelectorAll('input, select, textarea')).map(
          (el: any) => ({
            selector: el.id ? `#${el.id}` : el.name ? `[name="${el.name}"]` : '',
            type: el.type || el.tagName.toLowerCase(),
            text: el.placeholder || '',
            attributes: {}
          })
        )
      }))
    );
    
    // Extract links
    const links = await page.$$eval('a[href]', (anchors: any[]) =>
      anchors.map(a => a.href).filter(Boolean)
    );
    
    // Extract buttons
    const buttons = await page.$$eval('button, [role="button"], input[type="submit"]', 
      (btns: any[]) => btns.map(btn => ({
        selector: btn.id ? `#${btn.id}` : btn.className ? `.${btn.className.split(' ')[0]}` : 'button',
        type: 'button',
        text: btn.textContent?.trim() || '',
        attributes: {}
      }))
    );
    
    // Extract inputs
    const inputs = await page.$$eval('input:not([type="hidden"]), select, textarea',
      (els: any[]) => els.map(el => ({
        selector: el.id ? `#${el.id}` : el.name ? `[name="${el.name}"]` : '',
        type: el.type || el.tagName.toLowerCase(),
        text: el.placeholder || '',
        attributes: {}
      }))
    );
    
    return { url, title, forms, links, buttons, inputs };
  }
  
  // --------------------------------------------------------------------------
  // GENERATE TESTS
  // --------------------------------------------------------------------------
  
  async generateTests(pages: PageInfo[], outputDir: string): Promise<number> {
    await fs.mkdir(outputDir, { recursive: true });
    
    let count = 0;
    
    for (const pageInfo of pages) {
      const testCode = this.generateTestCode(pageInfo);
      const fileName = this.urlToFileName(pageInfo.url);
      const filePath = path.join(outputDir, `${fileName}.test.ts`);
      
      await fs.writeFile(filePath, testCode, 'utf-8');
      count++;
    }
    
    return count;
  }
  
  private generateTestCode(pageInfo: PageInfo): string {
    const testName = pageInfo.title || 'Page';
    
    let code = `/**
 * Auto-generated test for: ${pageInfo.url}
 * Generated by QAntum QA Tool
 */

import { test, expect } from '@playwright/test';

test.describe('${testName}', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('${pageInfo.url}');
  });

  test('should load page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/${testName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/i);
  });
`;
    
    // Generate form tests
    for (const form of pageInfo.forms) {
      if (form.fields.length > 0) {
        code += `
  test('should submit form', async ({ page }) => {
`;
        for (const field of form.fields) {
          if (field.selector && field.type !== 'submit') {
            code += `    await page.fill('${field.selector}', 'test');\n`;
          }
        }
        code += `    await page.click('button[type="submit"], input[type="submit"]');
  });
`;
      }
    }
    
    // Generate button tests
    if (pageInfo.buttons.length > 0) {
      code += `
  test('should have clickable buttons', async ({ page }) => {
`;
      for (const btn of pageInfo.buttons.slice(0, 5)) {
        if (btn.selector) {
          code += `    await expect(page.locator('${btn.selector}').first()).toBeVisible();\n`;
        }
      }
      code += `  });
`;
    }
    
    code += `});
`;
    
    return code;
  }
  
  private urlToFileName(url: string): string {
    try {
      const parsed = new URL(url);
      const path = parsed.pathname.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
      return path === '-' ? 'index' : path.replace(/^-|-$/g, '');
    } catch {
      return 'test';
    }
  }
  
  // --------------------------------------------------------------------------
  // BROKEN SELECTORS
  // --------------------------------------------------------------------------
  
  async findBrokenSelectors(filePath?: string): Promise<BrokenSelector[]> {
    // In production: analyze test files and verify selectors against live pages
    return [];
  }
  
  async applyFixes(broken: BrokenSelector[]): Promise<void> {
    // In production: update files with suggested selectors
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export function createScanner(config?: ScannerConfig): ProjectScanner {
  return new ProjectScanner(config || {});
}
