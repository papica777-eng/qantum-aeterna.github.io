# 🚀 Project Transcendence

> **Module:** `transcendence`  
> **Version:** 1.0.0  
> **Status:** Production  
> **Layer:** 4 (Reality)

---

## 📋 Description

Cross-platform distribution: Chrome Extension (Manifest V3) and Electron Desktop Application. Extends QAntum's reach beyond the command line.

---

## 📁 Files

| File | Description |
|------|-------------|
| `index.ts` | Build system and manifests |
| `demo.ts` | Demo script |

---

## 📦 Exports

```typescript
import {
  TranscendenceBuildSystem,
  CHROME_MANIFEST,
  ELECTRON_PACKAGE_JSON
} from '@qantum/transcendence';
```

---

## 🌐 Chrome Extension

### Manifest V3

```json
{
  "manifest_version": 3,
  "name": "QAntum",
  "version": "3.1.0",
  "description": "AI-powered test automation assistant",
  "permissions": [
    "activeTab",
    "storage",
    "scripting"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }]
}
```

### Features

- **Page Analysis** - Analyze any page for testability
- **Selector Generation** - Generate robust selectors
- **Recording** - Record user interactions
- **Quick Actions** - Run tests from browser
- **Oracle Scanner** - Security scan current page

### Build

```bash
npx tsx src/transcendence/build-chrome.ts
```

Output: `dist/chrome-extension/`

---

## 🖥️ Electron Desktop App

### Package Configuration

```json
{
  "name": "qantum-desktop",
  "version": "3.1.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder"
  },
  "build": {
    "appId": "dev.qantum.desktop",
    "productName": "QAntum",
    "mac": {
      "category": "public.app-category.developer-tools",
      "target": ["dmg", "zip"]
    },
    "win": {
      "target": ["nsis", "portable"]
    },
    "linux": {
      "target": ["AppImage", "deb"]
    }
  }
}
```

### Features

- **Dashboard** - Full dashboard experience
- **System Tray** - Quick access from tray
- **Auto-Update** - Automatic updates
- **Local Storage** - Encrypted local vault
- **CLI Integration** - Run from terminal

### Build

```bash
npx tsx src/transcendence/build-electron.ts
```

Output:
- `dist/QAntum-Setup.exe` (Windows)
- `dist/QAntum.dmg` (macOS)
- `dist/QAntum.AppImage` (Linux)

---

## 🎯 Usage

### Build System

```typescript
import { TranscendenceBuildSystem } from '@qantum/transcendence';

const builder = new TranscendenceBuildSystem();

// Build Chrome Extension
await builder.buildChrome({
  outputDir: './dist/chrome',
  minify: true,
  sourceMap: false
});

// Build Electron App
await builder.buildElectron({
  outputDir: './dist/electron',
  targets: ['win', 'mac', 'linux'],
  sign: true
});

// Build all
await builder.buildAll();
```

### Chrome Extension Content Script

```typescript
// content.ts - Injected into every page

class QAntumAssistant {
  analyze() {
    const elements = document.querySelectorAll('[data-testid], [id], [class]');
    return Array.from(elements).map(el => ({
      tag: el.tagName,
      testId: el.getAttribute('data-testid'),
      id: el.id,
      classes: el.className
    }));
  }
  
  generateSelector(element: Element): string {
    if (element.getAttribute('data-testid')) {
      return `[data-testid="${element.getAttribute('data-testid')}"]`;
    }
    if (element.id) {
      return `#${element.id}`;
    }
    // ... more strategies
  }
}
```

### Electron Main Process

```typescript
// main.ts - Electron main process

import { app, BrowserWindow, Tray, Menu } from 'electron';

let mainWindow: BrowserWindow;
let tray: Tray;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  
  mainWindow.loadURL('http://localhost:8888');
  
  tray = new Tray('icon.png');
  tray.setToolTip('QAntum');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Open Dashboard', click: () => mainWindow.show() },
    { label: 'Run Tests', click: () => runTests() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]));
});
```

---

## 📊 Distribution Plan

| Platform | Format | Size | Auto-Update |
|----------|--------|------|-------------|
| Chrome | .crx / Web Store | ~2MB | ✅ |
| Windows | .exe (NSIS) | ~85MB | ✅ |
| macOS | .dmg | ~90MB | ✅ |
| Linux | .AppImage | ~95MB | ✅ |

---

## 💰 Revenue Model

```
Chrome Extension:
├── FREE: Basic features
├── PRO: $4.99/mo - Full features
└── ENTERPRISE: Custom pricing

Desktop App:
├── FREE: Trial (14 days)
├── PRO: $9.99/mo
├── ENTERPRISE: $29.99/mo
└── Lifetime: $199 one-time
```

---

© 2025 Dimitar Prodromov. All rights reserved.
