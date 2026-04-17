"use strict";
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🧠 QANTUM HYBRID v1.0.0 - POM Module
 * Page Object Model exports
 * ═══════════════════════════════════════════════════════════════════════════════
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterComponent = exports.RegisterPage = exports.definePages = exports.definePage = exports.getPage = exports.getFactory = exports.PageFactory = exports.locator = exports.LocatorBuilder = exports.By = exports.LocatorFactory = exports.DropdownComponent = exports.TableComponent = exports.FormComponent = exports.ModalComponent = exports.FooterComponent = exports.HeaderComponent = exports.BaseComponent = exports.BasePage = exports.BaseElement = void 0;
// Base classes
var BaseElement_1 = require("./BaseElement");
Object.defineProperty(exports, "BaseElement", { enumerable: true, get: function () { return BaseElement_1.BaseElement; } });
var BasePage_1 = require("./BasePage");
Object.defineProperty(exports, "BasePage", { enumerable: true, get: function () { return BasePage_1.BasePage; } });
var BaseComponent_1 = require("./BaseComponent");
Object.defineProperty(exports, "BaseComponent", { enumerable: true, get: function () { return BaseComponent_1.BaseComponent; } });
Object.defineProperty(exports, "HeaderComponent", { enumerable: true, get: function () { return BaseComponent_1.HeaderComponent; } });
Object.defineProperty(exports, "FooterComponent", { enumerable: true, get: function () { return BaseComponent_1.FooterComponent; } });
Object.defineProperty(exports, "ModalComponent", { enumerable: true, get: function () { return BaseComponent_1.ModalComponent; } });
Object.defineProperty(exports, "FormComponent", { enumerable: true, get: function () { return BaseComponent_1.FormComponent; } });
Object.defineProperty(exports, "TableComponent", { enumerable: true, get: function () { return BaseComponent_1.TableComponent; } });
Object.defineProperty(exports, "DropdownComponent", { enumerable: true, get: function () { return BaseComponent_1.DropdownComponent; } });
// Locator utilities
var LocatorFactory_1 = require("./LocatorFactory");
Object.defineProperty(exports, "LocatorFactory", { enumerable: true, get: function () { return LocatorFactory_1.LocatorFactory; } });
Object.defineProperty(exports, "By", { enumerable: true, get: function () { return LocatorFactory_1.By; } });
Object.defineProperty(exports, "LocatorBuilder", { enumerable: true, get: function () { return LocatorFactory_1.LocatorBuilder; } });
Object.defineProperty(exports, "locator", { enumerable: true, get: function () { return LocatorFactory_1.locator; } });
// Page Factory
var PageFactory_1 = require("./PageFactory");
Object.defineProperty(exports, "PageFactory", { enumerable: true, get: function () { return PageFactory_1.PageFactory; } });
Object.defineProperty(exports, "getFactory", { enumerable: true, get: function () { return PageFactory_1.getFactory; } });
Object.defineProperty(exports, "getPage", { enumerable: true, get: function () { return PageFactory_1.getPage; } });
Object.defineProperty(exports, "definePage", { enumerable: true, get: function () { return PageFactory_1.definePage; } });
Object.defineProperty(exports, "definePages", { enumerable: true, get: function () { return PageFactory_1.definePages; } });
Object.defineProperty(exports, "RegisterPage", { enumerable: true, get: function () { return PageFactory_1.RegisterPage; } });
Object.defineProperty(exports, "RegisterComponent", { enumerable: true, get: function () { return PageFactory_1.RegisterComponent; } });
//# sourceMappingURL=index.js.map