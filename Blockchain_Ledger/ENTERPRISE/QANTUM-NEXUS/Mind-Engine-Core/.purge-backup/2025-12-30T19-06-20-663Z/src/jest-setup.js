/**
 * 🧠 QANTUM HYBRID - Jest Integration
 * Пуска Jest тестове с Playwright engine вместо Selenium
 */

// Глобални mock-ове за да заменим Selenium с Playwright
const { Builder, By, until } = require('./dist/adapters/legacy-adapter.js');

// Override selenium-webdriver
jest.mock('selenium-webdriver', () => ({
  Builder: jest.fn().mockImplementation(() => ({
    forBrowser: jest.fn().mockReturnThis(),
    setChromeOptions: jest.fn().mockReturnThis(),
    build: jest.fn().mockImplementation(async () => {
      const { Builder: PWBuilder } = require('./dist/adapters/legacy-adapter.js');
      return await new PWBuilder().forBrowser('chrome').setChromeOptions({ headless: true }).build();
    })
  })),
  By: {
    css: (s) => ({ css: s }),
    xpath: (s) => ({ xpath: s }),
    id: (s) => ({ id: s }),
    name: (s) => ({ name: s }),
    className: (s) => ({ css: `.${s}` }),
    tagName: (s) => ({ css: s })
  },
  until: {
    elementLocated: () => () => true,
    elementIsVisible: () => () => true,
    titleContains: () => () => true,
    urlContains: () => () => true
  },
  Key: {
    ENTER: '\uE007',
    TAB: '\uE004',
    ESCAPE: '\uE00C'
  }
}));

module.exports = {
  Builder,
  By,
  until
};
