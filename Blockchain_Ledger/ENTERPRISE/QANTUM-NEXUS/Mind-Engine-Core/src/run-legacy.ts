/**
 * 🧠 QANTUM HYBRID - Run Existing Tests
 * Пуска съществуващите 1000+ теста с новия engine
 */

import { Builder, By } from './adapters/legacy-adapter.js';

import { logger } from './api/unified/utils/logger';
/**
 * Пример: Пуска hybrid.test.js логиката с Playwright engine
 */
async function runLegacyTests() {
  logger.debug('═══════════════════════════════════════════════════════════════');
  logger.debug('  🧠 QANTUM HYBRID - Running Legacy Tests with PW Engine');
  logger.debug('═══════════════════════════════════════════════════════════════\n');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions({ headless: true })
    .build();

  let passed = 0;
  let failed = 0;

  try {
    // ============== TEST 1: Visit Page ==============
    logger.debug('📝 Test 1: Visit JSONPlaceholder API');
    try {
      await driver.get('https://jsonplaceholder.typicode.com/posts/1');
      const title = await driver.getTitle();
      logger.debug(`   Title: ${title}`);
      passed++;
      logger.debug('   ✅ PASSED\n');
    } catch (e) {
      failed++;
      logger.debug(`   ❌ FAILED: ${e}\n`);
    }

    // ============== TEST 2: Visit Google ==============
    logger.debug('📝 Test 2: Visit Google');
    try {
      await driver.get('https://www.google.com');
      const title = await driver.getTitle();
      logger.debug(`   Title: ${title}`);
      passed++;
      logger.debug('   ✅ PASSED\n');
    } catch (e) {
      failed++;
      logger.debug(`   ❌ FAILED: ${e}\n`);
    }

    // ============== TEST 3: Find Element ==============
    logger.debug('📝 Test 3: Find Search Input');
    try {
      await driver.get('https://www.google.com');
      // Google search input
      const searchInput = driver.findElement(By.name('q'));
      const isVisible = await searchInput.isDisplayed();
      logger.debug(`   Search input visible: ${isVisible}`);
      passed++;
      logger.debug('   ✅ PASSED\n');
    } catch (e) {
      failed++;
      logger.debug(`   ❌ FAILED: ${e}\n`);
    }

    // ============== TEST 4: Type & Search ==============
    logger.debug('📝 Test 4: Type in Search');
    try {
      await driver.get('https://www.google.com');
      const searchInput = driver.findElement(By.name('q'));
      await searchInput.sendKeys('QANTUM QA Framework');
      logger.debug('   Typed: "QANTUM QA Framework"');
      passed++;
      logger.debug('   ✅ PASSED\n');
    } catch (e) {
      failed++;
      logger.debug(`   ❌ FAILED: ${e}\n`);
    }

    // ============== TEST 5: Example.com ==============
    logger.debug('📝 Test 5: Example.com Basic');
    try {
      await driver.get('https://example.com');
      const h1 = driver.findElement(By.css('h1'));
      const text = await h1.getText();
      logger.debug(`   H1 Text: ${text}`);
      if (text.includes('Example')) {
        passed++;
        logger.debug('   ✅ PASSED\n');
      } else {
        failed++;
        logger.debug('   ❌ FAILED: Wrong text\n');
      }
    } catch (e) {
      failed++;
      logger.debug(`   ❌ FAILED: ${e}\n`);
    }

    // ============== TEST 6: Screenshot ==============
    logger.debug('📝 Test 6: Take Screenshot');
    try {
      await driver.get('https://example.com');
      const path = await driver.takeScreenshot();
      logger.debug(`   Screenshot: ${path}`);
      passed++;
      logger.debug('   ✅ PASSED\n');
    } catch (e) {
      failed++;
      logger.debug(`   ❌ FAILED: ${e}\n`);
    }

  } finally {
    await driver.quit();
  }

  // ============== SUMMARY ==============
  logger.debug('═══════════════════════════════════════════════════════════════');
  logger.debug(`  📊 Results: ${passed} passed, ${failed} failed`);
  logger.debug('═══════════════════════════════════════════════════════════════\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runLegacyTests().catch(console.error);
