import { test, expect } from '@playwright/test';

test('Command Palette opens and navigates', async ({ page }) => {
  // Mock the API endpoint that the app might hit on load
  await page.route('**/telemetry', route => route.fulfill({ json: { metrics: [] } }));

  await page.goto('http://localhost:1420');

  // Wait for the app to load and a known element to be visible
  await page.waitForSelector('text=Landing');

  // Press Ctrl+K to open Command Palette
  await page.keyboard.press('Control+k');

  // Wait for Command Palette to be visible
  await page.waitForSelector('input[placeholder="Type a command or search..."]');

  // Type 'telemetry'
  await page.fill('input[placeholder="Type a command or search..."]', 'telemetry');

  // Wait for the 'Go to Telemetry Dashboard' option to be visible
  await page.waitForSelector('text=Go to Telemetry Dashboard');

  // Press ArrowDown to select the option
  await page.keyboard.press('ArrowDown');

  // Press Enter to navigate
  await page.keyboard.press('Enter');

  // Wait a little bit for state update
  await page.waitForTimeout(1000);
});
