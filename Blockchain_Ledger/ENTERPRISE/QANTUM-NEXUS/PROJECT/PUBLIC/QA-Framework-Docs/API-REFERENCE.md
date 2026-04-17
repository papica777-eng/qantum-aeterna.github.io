# 📚 QAntum API Reference

> Complete API documentation for QAntum v26.0.0

---

## Core Module

### QAntum

Main entry point for the framework.

```typescript
import { createQA, QAntum } from 'qantum';

const engine = createQA();
await engine.init(options);
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `init(options)` | `QAntumOptions` | `Promise<this>` | Initialize browser |
| `goto(url)` | `string` | `Promise<this>` | Navigate to URL |
| `getPage()` | - | `Page` | Get Playwright page |
| `getContext()` | - | `BrowserContext` | Get browser context |
| `getBrowser()` | - | `Browser` | Get browser instance |
| `close()` | - | `Promise<void>` | Close browser |

#### Options

```typescript
interface QAntumOptions {
  browser?: 'chromium' | 'firefox' | 'webkit';
  headless?: boolean;
  viewport?: { width: number; height: number };
  launchOptions?: Record<string, any>;
  contextOptions?: Record<string, any>;
}
```

---

### BasePage

Base class for Page Object Model.

```typescript
import { BasePage } from 'qantum';

class MyPage extends BasePage {
  // Implementation
}
```

#### Methods

| Method | Description |
|--------|-------------|
| `goto(path)` | Navigate to page |
| `fill(selector, value)` | Fill input field |
| `click(selector)` | Click element |
| `getText(selector)` | Get element text |
| `isVisible(selector)` | Check visibility |
| `waitForSelector(selector)` | Wait for element |

---

### SelfHealingLocator

AI-powered element finding.

```typescript
import { createSelfHealing } from 'qantum';

const healer = createSelfHealing();
```

#### Methods

| Method | Description |
|--------|-------------|
| `register(id, config)` | Register element |
| `find(page, id)` | Find element |
| `learn(id, selector, success)` | Train AI |
| `getStats()` | Get healing stats |

---

## Data Module

### DataGenerator

Generate test data.

```typescript
import { DataGenerator } from 'qantum';

const gen = new DataGenerator();
```

#### Methods

| Method | Returns | Example |
|--------|---------|---------|
| `email()` | `string` | `"john42@gmail.com"` |
| `firstName()` | `string` | `"John"` |
| `lastName()` | `string` | `"Smith"` |
| `fullName()` | `string` | `"John Smith"` |
| `phone()` | `string` | `"+1234567890"` |
| `address()` | `string` | `"123 Main St"` |
| `uuid()` | `string` | `"a1b2c3d4-..."` |
| `password(length)` | `string` | `"Xk9#mP2$"` |

---

## Visual Module

### VisualComparator

Screenshot comparison.

```typescript
import { createVisualComparator } from 'qantum';

const visual = createVisualComparator({
  threshold: 0.1,
  outputDir: './diffs'
});
```

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `captureBaseline(page, name)` | `Promise<string>` | Save baseline |
| `compare(page, name)` | `Promise<CompareResult>` | Compare screenshots |
| `generateReport()` | `Promise<string>` | HTML report |

#### CompareResult

```typescript
interface CompareResult {
  match: boolean;
  diffPercentage: number;
  diffPath?: string;
  dimensions: { width: number; height: number };
}
```

---

## Security Module

### SecurityScanner

Vulnerability detection.

```typescript
import { createSecurityScanner } from 'qantum';

const scanner = createSecurityScanner();
```

#### Sub-scanners

| Scanner | Methods |
|---------|---------|
| `xss` | `scan(page, inputs)` |
| `sqli` | `scan(page, inputs)` |
| `csrf` | `analyze(page)` |
| `headers` | `analyze(url)` |

#### Full Scan

```typescript
const report = await scanner.fullScan(page, {
  xss: true,
  sqli: true,
  csrf: true,
  headers: true
});
```

---

## Performance Module

### WebVitalsCollector

Core Web Vitals measurement.

```typescript
import { createWebVitalsCollector } from 'qantum';

const collector = createWebVitalsCollector();
const vitals = await collector.collect(page);
```

#### Metrics

| Metric | Description | Good |
|--------|-------------|------|
| `lcp` | Largest Contentful Paint | < 2.5s |
| `fid` | First Input Delay | < 100ms |
| `cls` | Cumulative Layout Shift | < 0.1 |
| `fcp` | First Contentful Paint | < 1.8s |
| `ttfb` | Time to First Byte | < 600ms |

---

## Mobile Module

### MobileEmulator

Device emulation.

```typescript
import { createMobileEmulator, DEVICES } from 'qantum';

const emulator = createMobileEmulator();
await emulator.emulate(page, DEVICES.iPhone14Pro);
```

#### Available Devices

```typescript
DEVICES = {
  iPhone14Pro: { width: 393, height: 852, ... },
  iPhone14ProMax: { width: 430, height: 932, ... },
  Pixel7: { width: 412, height: 915, ... },
  GalaxyS23: { width: 360, height: 780, ... },
  iPadPro: { width: 1024, height: 1366, ... },
  // ... 20+ devices
}
```

---

## Integrations Module

### JiraIntegration

```typescript
import { createJiraIntegration } from 'qantum';

const jira = createJiraIntegration({
  apiUrl: 'https://your-domain.atlassian.net',
  email: 'your@email.com',
  apiToken: 'your-token',
  projectKey: 'PROJ'
});

await jira.createBug({
  title: 'Test Failure',
  description: 'Details...',
  priority: 'high'
});
```

### SlackIntegration

```typescript
import { createSlackIntegration } from 'qantum';

const slack = createSlackIntegration({
  webhookUrl: 'https://hooks.slack.com/...',
  channel: '#qa-alerts'
});

await slack.sendTestSummary({
  suiteName: 'E2E Tests',
  passed: 45,
  failed: 2,
  total: 47
});
```

---

## Reporters Module

### HTMLReporter

```typescript
import { createHTMLReporter } from 'qantum';

const reporter = createHTMLReporter({
  outputPath: './reports/report.html',
  includeScreenshots: true
});

await reporter.generate(results);
```

### JUnitReporter

```typescript
import { createJUnitReporter } from 'qantum';

const reporter = createJUnitReporter({
  outputPath: './reports/junit.xml'
});

await reporter.generate(results);
```

---

## Types

### TestResult

```typescript
interface TestResult {
  testId: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  screenshots?: string[];
}
```

### BugReport

```typescript
interface BugReport {
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  steps: string[];
  expectedResult: string;
  actualResult: string;
  attachments?: string[];
}
```

---

© 2025 QAntum by DP Engineering
