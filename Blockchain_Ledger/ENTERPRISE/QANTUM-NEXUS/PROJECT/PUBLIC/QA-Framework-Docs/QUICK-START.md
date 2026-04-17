# 🚀 Quick Start Guide

> Get started with QAntum in 5 minutes

---

## Installation

```bash
npm install qantum playwright
```

## First Test

Create `first-test.ts`:

```typescript
import { createQA } from 'qantum';

async function main() {
  // Initialize engine
  const engine = createQA();
  await engine.init({ browser: 'chromium', headless: false });
  
  // Get page
  const page = engine.getPage();
  
  // Navigate
  await page.goto('https://example.com');
  
  // Assert
  const title = await page.title();
  console.log(`✅ Page title: ${title}`);
  
  // Cleanup
  await engine.close();
}

main();
```

Run:

```bash
npx ts-node first-test.ts
```

---

## Page Object Pattern

Create `pages/LoginPage.ts`:

```typescript
import { BasePage } from 'qantum';

export class LoginPage extends BasePage {
  readonly url = '/login';
  
  readonly selectors = {
    username: '#username',
    password: '#password',
    submit: 'button[type="submit"]',
    error: '.error-message'
  };
  
  async login(username: string, password: string) {
    await this.fill(this.selectors.username, username);
    await this.fill(this.selectors.password, password);
    await this.click(this.selectors.submit);
  }
  
  async getErrorMessage() {
    return this.getText(this.selectors.error);
  }
}
```

Use it:

```typescript
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login('user@test.com', 'password123');
```

---

## Data Generation

```typescript
import { DataGenerator } from 'qantum';

const gen = new DataGenerator();

// Generate user
const user = {
  email: gen.email(),
  firstName: gen.firstName(),
  lastName: gen.lastName(),
  phone: gen.phone(),
  password: gen.password(12)
};

console.log(user);
// {
//   email: 'john.smith42@gmail.com',
//   firstName: 'John',
//   lastName: 'Smith',
//   phone: '+1234567890',
//   password: 'Xk9#mP2$vL3@'
// }
```

---

## Visual Testing

```typescript
import { createVisualComparator } from 'qantum';

const visual = createVisualComparator({
  threshold: 0.1,
  outputDir: './visual-diffs'
});

// Capture baseline (first run)
await visual.captureBaseline(page, 'homepage');

// Compare (subsequent runs)
const result = await visual.compare(page, 'homepage');

if (!result.match) {
  console.log(`❌ Visual difference: ${result.diffPercentage}%`);
  console.log(`Diff saved: ${result.diffPath}`);
} else {
  console.log('✅ Visual match!');
}
```

---

## Self-Healing Locators

```typescript
import { createSelfHealing } from 'qantum';

const healer = createSelfHealing();

// Register element with multiple strategies
healer.register('loginButton', {
  primary: '#login-btn',
  fallbacks: [
    'button[data-testid="login"]',
    'button:has-text("Sign In")',
    '.login-form button[type="submit"]'
  ],
  attributes: {
    text: 'Sign In',
    classes: ['btn', 'btn-primary']
  }
});

// Find element (auto-heals if primary fails)
const button = await healer.find(page, 'loginButton');
await button.click();
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - run: npm install
      
      - run: npx playwright install --with-deps
      
      - run: npm run test:e2e
      
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-results
          path: ./reports/
```

---

## Full Example

```typescript
import { 
  createQA, 
  DataGenerator,
  createSelfHealing,
  createVisualComparator 
} from 'qantum';

async function completeTest() {
  // Setup
  const engine = createQA();
  const gen = new DataGenerator();
  const healer = createSelfHealing();
  const visual = createVisualComparator();
  
  await engine.init({ headless: true });
  const page = engine.getPage();
  
  // Test data
  const user = {
    email: gen.email(),
    password: gen.password(10)
  };
  
  // Navigate
  await page.goto('https://app.example.com');
  
  // Visual baseline
  await visual.compare(page, 'landing');
  
  // Register elements
  healer.register('signupBtn', {
    primary: '[data-testid="signup"]',
    fallbacks: ['a:has-text("Sign Up")']
  });
  
  // Interact
  const signupBtn = await healer.find(page, 'signupBtn');
  await signupBtn.click();
  
  // Fill form
  await page.fill('#email', user.email);
  await page.fill('#password', user.password);
  await page.click('button[type="submit"]');
  
  // Assert
  await page.waitForURL('**/dashboard');
  console.log('✅ Signup successful!');
  
  // Cleanup
  await engine.close();
}

completeTest();
```

---

## Next Steps

- 📖 [API Reference](./API-REFERENCE.md)
- 🔌 [Integrations Guide](./INTEGRATIONS.md)
- 🎯 [Best Practices](./BEST-PRACTICES.md)
- 🐛 [Debugging Guide](./DEBUGGING.md)

---

© 2025 QAntum by DP Engineering
