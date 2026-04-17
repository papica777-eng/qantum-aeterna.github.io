"use strict";
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: ADAPTERS INDEX
 * ═══════════════════════════════════════════════════════════════════════════════
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selenium = exports.TargetLocator = exports.Navigation = exports.WindowOptions = exports.Timeouts = exports.Options = exports.Alert = exports.Actions = exports.WebElement = exports.WebDriver = exports.until = exports.Key = exports.By = exports.Builder = void 0;
// Selenium Adapter - Full WebDriver API compatibility
var SeleniumAdapter_1 = require("./SeleniumAdapter");
Object.defineProperty(exports, "Builder", { enumerable: true, get: function () { return SeleniumAdapter_1.Builder; } });
Object.defineProperty(exports, "By", { enumerable: true, get: function () { return SeleniumAdapter_1.By; } });
Object.defineProperty(exports, "Key", { enumerable: true, get: function () { return SeleniumAdapter_1.Key; } });
Object.defineProperty(exports, "until", { enumerable: true, get: function () { return SeleniumAdapter_1.until; } });
Object.defineProperty(exports, "WebDriver", { enumerable: true, get: function () { return SeleniumAdapter_1.WebDriver; } });
Object.defineProperty(exports, "WebElement", { enumerable: true, get: function () { return SeleniumAdapter_1.WebElement; } });
Object.defineProperty(exports, "Actions", { enumerable: true, get: function () { return SeleniumAdapter_1.Actions; } });
Object.defineProperty(exports, "Alert", { enumerable: true, get: function () { return SeleniumAdapter_1.Alert; } });
Object.defineProperty(exports, "Options", { enumerable: true, get: function () { return SeleniumAdapter_1.Options; } });
Object.defineProperty(exports, "Timeouts", { enumerable: true, get: function () { return SeleniumAdapter_1.Timeouts; } });
Object.defineProperty(exports, "WindowOptions", { enumerable: true, get: function () { return SeleniumAdapter_1.WindowOptions; } });
Object.defineProperty(exports, "Navigation", { enumerable: true, get: function () { return SeleniumAdapter_1.Navigation; } });
Object.defineProperty(exports, "TargetLocator", { enumerable: true, get: function () { return SeleniumAdapter_1.TargetLocator; } });
// Re-export as default for drop-in replacement
var SeleniumAdapter_2 = require("./SeleniumAdapter");
Object.defineProperty(exports, "selenium", { enumerable: true, get: function () { return __importDefault(SeleniumAdapter_2).default; } });
//# sourceMappingURL=index.js.map