# 🎬 Sales Demo Engine

> **Module:** `sales-demo`  
> **Version:** 1.0.0  
> **Status:** Production  
> **Layer:** 4 (Reality)

---

## 📋 Description

Autonomous demo generation and sales workflow engine. Analyzes prospects, generates tailored demos, handles objections, and integrates with CRM systems.

---

## 📁 Files

| File | Description |
|------|-------------|
| `index.ts` | Main SalesDemoEngine class |
| `demo.ts` | Demo script |

---

## 📦 Exports

```typescript
import {
  SalesDemoEngine,
  ProspectAnalyzer,
  DEMO_TEMPLATES
} from '@qantum/sales-demo';
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/demo/create` | POST | Create demo |
| `/api/demo/run` | POST | Run demo |
| `/api/demo/followup` | POST | Follow-up |

---

## 🎯 Usage

### Analyze Prospect

```typescript
import { SalesDemoEngine, ProspectAnalyzer } from '@qantum/sales-demo';

const analyzer = new ProspectAnalyzer();

const prospect = await analyzer.analyze({
  company: 'TechCorp',
  website: 'https://techcorp.com',
  industry: 'fintech',
  size: 'enterprise'
});

console.log('Pain Points:', prospect.painPoints);
console.log('Recommended Tier:', prospect.recommendedTier);
console.log('Demo Template:', prospect.suggestedTemplate);
```

### Generate Demo

```typescript
const engine = new SalesDemoEngine();

const demo = await engine.create({
  prospect: prospect,
  template: 'enterprise-fintech',
  duration: 45 // minutes
});

console.log('Demo ID:', demo.id);
console.log('Agenda:', demo.agenda);
console.log('Talking Points:', demo.talkingPoints);
```

### Handle Objections

```typescript
const response = engine.handleObjection({
  objection: 'price-too-high',
  context: prospect
});

console.log('Response:', response.script);
console.log('Discount Offer:', response.discount);
```

---

## 📋 Demo Templates

| Template | Industry | Duration | Focus |
|----------|----------|----------|-------|
| `startup-quick` | Any | 15 min | Speed & Cost |
| `enterprise-fintech` | Finance | 45 min | Security & Compliance |
| `enterprise-health` | Healthcare | 45 min | HIPAA & Reliability |
| `agency-demo` | Agencies | 30 min | Scale & White-label |

---

## 🔗 CRM Integration

```typescript
// HubSpot integration
const engine = new SalesDemoEngine({
  crm: {
    provider: 'hubspot',
    apiKey: process.env.HUBSPOT_API_KEY
  }
});

// Auto-sync prospect data
await engine.syncProspect(prospect);

// Log demo activity
await engine.logActivity({
  prospectId: prospect.id,
  type: 'demo-completed',
  outcome: 'positive',
  nextStep: 'send-proposal'
});
```

---

© 2025 Dimitar Prodromov. All rights reserved.
