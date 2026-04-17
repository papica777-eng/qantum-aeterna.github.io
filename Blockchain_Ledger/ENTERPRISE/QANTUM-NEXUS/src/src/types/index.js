"use strict";
/**
 * 🧠 QANTUM HYBRID - Core Types
 * Всички типове на едно място
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = void 0;
// ============== DEFAULT CONFIG ==============
exports.DEFAULT_CONFIG = {
    baseUrl: 'http://localhost:3000',
    browser: {
        browser: 'chromium',
        headless: true,
        timeout: 30000,
        viewport: { width: 1280, height: 720 }
    },
    mode: 'local',
    retries: 3,
    selfHealing: true,
    parallel: {
        enabled: false,
        workers: 4
    },
    reporting: {
        screenshots: true,
        traces: true,
        har: false
    }
};
//# sourceMappingURL=index.js.map