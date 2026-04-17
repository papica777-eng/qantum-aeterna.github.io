# 📚 Self-Generating Documentation

> **Module:** `doc-generator`  
> **Version:** 1.0.0  
> **Status:** Production  
> **Layer:** 2 (Intelligence)

---

## 📋 Description

Auto-documentation system that generates comprehensive documentation from TypeScript code analysis. Produces Markdown, OpenAPI specs, and changelogs automatically.

---

## 📁 Files

| File | Description |
|------|-------------|
| `index.ts` | Main DocGenerator class |
| `typescript-analyzer.ts` | AST parsing and analysis |
| `openapi-generator.ts` | OpenAPI 3.0 spec generation |
| `markdown-builder.ts` | Markdown document builder |
| `changelog-tracker.ts` | Git-based changelog |
| `demo.ts` | Demo script |

---

## 📦 Exports

```typescript
import {
  DocGenerator,
  TypeScriptAnalyzer,
  OpenAPIGenerator,
  MarkdownBuilder,
  ChangelogTracker
} from '@qantum/doc-generator';
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/docs/generate` | POST | Generate docs |
| `/api/docs/openapi` | GET | OpenAPI spec |
| `/api/docs/changelog` | GET | Changelog |

---

## 🎯 Usage

```typescript
import { DocGenerator } from '@qantum/doc-generator';

const docGen = new DocGenerator({
  sourcePaths: ['./src'],
  outputPath: './docs',
  formats: ['markdown', 'openapi', 'html']
});

// Generate all documentation
await docGen.generateAll();

// Generate specific format
await docGen.generateMarkdown();
await docGen.generateOpenAPI();
await docGen.generateChangelog();
```

---

© 2025 Dimitar Prodromov. All rights reserved.
