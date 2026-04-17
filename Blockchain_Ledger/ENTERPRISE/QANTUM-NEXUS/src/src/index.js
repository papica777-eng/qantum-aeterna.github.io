"use strict";
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *     ██████╗  █████╗ ███╗   ██╗████████╗██╗   ██╗███╗   ███╗
 *    ██╔═══██╗██╔══██╗████╗  ██║╚══██╔══╝██║   ██║████╗ ████║
 *    ██║   ██║███████║██╔██╗ ██║   ██║   ██║   ██║██╔████╔██║
 *    ██║▄▄ ██║██╔══██║██║╚██╗██║   ██║   ██║   ██║██║╚██╔╝██║
 *    ╚██████╔╝██║  ██║██║ ╚████║   ██║   ╚██████╔╝██║ ╚═╝ ██║
 *     ╚══▀▀═╝ ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝
 *
 *                        ⚛️ VERSION 1.0.0 ⚛️
 *              "The Autonomous QA Agent - Quantum Grade"
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * QAntum - Beyond Classical Testing
 * AI-Powered • Self-Healing • Ghost Mode • Swarm Execution
 *
 * Core Capabilities:
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚛️ QUANTUM CORE      - AI-powered test intelligence
 * 🧬 SELF-HEALING      - Autonomous locator recovery
 * 👻 GHOST MODE        - Undetectable browser automation
 * 🐝 SWARM EXECUTION   - 16,000+ parallel tests
 * 🔮 PREDICTIVE AI     - Anticipates failures before they happen
 * 🛡️ FORTRESS MODE     - Production-grade isolation
 * 📊 NEURAL MAPPING    - Learns your application's DNA
 *
 * @author QAntum Labs
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CODENAME = exports.VERSION = exports.mm = exports.FluentChain = exports.networkInterceptor = exports.NetworkInterceptor = exports.deepSearch = exports.DeepSearchEngine = exports.selfHealer = exports.SelfHealingEngine = exports.createQA = exports.QAntum = void 0;
// ═══════════════════════════════════════════════════════════════════════════════
// QANTUM CORE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════
var qantum_js_1 = require("./core/qantum.js");
Object.defineProperty(exports, "QAntum", { enumerable: true, get: function () { return qantum_js_1.QAntum; } });
Object.defineProperty(exports, "createQA", { enumerable: true, get: function () { return qantum_js_1.createQA; } });
var self_healing_js_1 = require("./core/self-healing.js");
Object.defineProperty(exports, "SelfHealingEngine", { enumerable: true, get: function () { return self_healing_js_1.SelfHealingEngine; } });
Object.defineProperty(exports, "selfHealer", { enumerable: true, get: function () { return self_healing_js_1.selfHealer; } });
var deep_search_js_1 = require("./core/deep-search.js");
Object.defineProperty(exports, "DeepSearchEngine", { enumerable: true, get: function () { return deep_search_js_1.DeepSearchEngine; } });
Object.defineProperty(exports, "deepSearch", { enumerable: true, get: function () { return deep_search_js_1.deepSearch; } });
var network_interceptor_js_1 = require("./core/network-interceptor.js");
Object.defineProperty(exports, "NetworkInterceptor", { enumerable: true, get: function () { return network_interceptor_js_1.NetworkInterceptor; } });
Object.defineProperty(exports, "networkInterceptor", { enumerable: true, get: function () { return network_interceptor_js_1.networkInterceptor; } });
var fluent_chain_js_1 = require("./core/fluent-chain.js");
Object.defineProperty(exports, "FluentChain", { enumerable: true, get: function () { return fluent_chain_js_1.FluentChain; } });
// Types
__exportStar(require("./types/index.js"), exports);
// ═══════════════════════════════════════════════════════════════════════════════
// NEW MODULE EXPORTS - ФАЗА 1-100
// ═══════════════════════════════════════════════════════════════════════════════
// Data Module
__exportStar(require("./data/index.js"), exports);
// Verification Module
__exportStar(require("./verification/index.js"), exports);
// Error Handling Module
__exportStar(require("./error/index.js"), exports);
// Session Module
__exportStar(require("./session/index.js"), exports);
// Scenarios Module
__exportStar(require("./scenario/index.js"), exports);
// Reporters Module
// export * from './reporters';
// Visual Testing Module
__exportStar(require("./visual/index.js"), exports);
// CI/CD Module
__exportStar(require("./ci/index.js"), exports);
// CLI Module
__exportStar(require("./cli/index.js"), exports);
// API Module
__exportStar(require("./api/index.js"), exports);
// Plugins Module
__exportStar(require("./plugins/index.js"), exports);
// Scheduler Module
__exportStar(require("./scheduler/index.js"), exports);
// Metrics Module
__exportStar(require("./metrics/index.js"), exports);
// Browser Module
// export * from './browser/index.js';
// Mobile Module
__exportStar(require("./mobile/index.js"), exports);
// Performance Module
__exportStar(require("./performance/index.js"), exports);
// Security Module
__exportStar(require("./security/index.js"), exports);
// AI Module
__exportStar(require("./ai/index.js"), exports);
// Behavior Module
__exportStar(require("./behavior/index.js"), exports);
// Forms Module
__exportStar(require("./forms/index.js"), exports);
// Integrations Module
// export * from './integrations';
// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════
const qantum_js_2 = require("./core/qantum.js");
exports.mm = (0, qantum_js_2.createMM)();
// ═══════════════════════════════════════════════════════════════════════════════
// VERSION INFO
// ═══════════════════════════════════════════════════════════════════════════════
exports.VERSION = '27.2.0';
exports.CODENAME = 'GHOST_IN_THE_MACHINE';
// ═══════════════════════════════════════════════════════════════════════════════
// GHOST v27.2.0 - ZERO-DETECTION AUTOMATION
// ═══════════════════════════════════════════════════════════════════════════════
__exportStar(require("./ghost/index.js"), exports);
//# sourceMappingURL=index.js.map