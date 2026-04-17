# 🤖 AI-to-AI Negotiation

> **Module:** `ai-negotiation`  
> **Version:** 1.0.0  
> **Status:** Production  
> **Layer:** 5 (Singularity)

---

## 📋 Description

Multi-agent orchestration system for autonomous business negotiations. AI agents negotiate deals, contracts, and pricing with other AI systems.

---

## 📁 Files

| File | Description |
|------|-------------|
| `index.ts` | Main NegotiationEngine class |
| `demo.ts` | Demo script |

---

## 📦 Exports

```typescript
import {
  NegotiationEngine,
  AgentFactory,
  NegotiationAgent
} from '@qantum/ai-negotiation';
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/negotiate/session` | POST | New session |
| `/api/negotiate/run` | POST | Run round |
| `/api/negotiate/transcript` | GET | Get transcript |

---

## 🎯 Usage

### Create Negotiation Session

```typescript
import { NegotiationEngine, AgentFactory } from '@qantum/ai-negotiation';

const engine = new NegotiationEngine();
const factory = new AgentFactory();

// Create agents
const seller = factory.create({
  role: 'seller',
  persona: 'qantum-sales',
  goals: ['maximize-revenue', 'close-deal'],
  constraints: ['min-price-80%', 'max-discount-20%']
});

const buyer = factory.create({
  role: 'buyer',
  persona: 'enterprise-procurement',
  goals: ['minimize-cost', 'maximize-value'],
  budget: 25000
});

// Create session
const session = await engine.createSession({
  agents: [seller, buyer],
  subject: 'enterprise-license',
  context: {
    product: 'QAntum Enterprise',
    listPrice: 29900,
    seats: 100
  }
});

console.log('Session ID:', session.id);
```

### Run Negotiation

```typescript
// Run negotiation rounds
const result = await engine.negotiate(session.id, {
  maxRounds: 10,
  timeout: 60000
});

console.log('Outcome:', result.outcome); // 'deal' | 'no-deal'
console.log('Final Price:', result.agreedPrice);
console.log('Discount:', result.discount);
console.log('Rounds:', result.rounds);
```

### Get Transcript

```typescript
const transcript = await engine.getTranscript(session.id);

transcript.rounds.forEach((round, i) => {
  console.log(`\n=== Round ${i + 1} ===`);
  round.messages.forEach(msg => {
    console.log(`[${msg.agent}]: ${msg.content}`);
  });
});
```

---

## 🤖 Agent Personas

### QAntum Sales Agent

```typescript
const salesAgent = {
  persona: 'qantum-sales',
  traits: {
    assertiveness: 0.8,
    flexibility: 0.6,
    patience: 0.7
  },
  strategies: [
    'value-selling',
    'anchoring',
    'bundling',
    'urgency'
  ],
  constraints: {
    minPrice: 0.8, // 80% of list price
    maxDiscount: 0.2 // 20% max
  }
};
```

### Enterprise Buyer Agent

```typescript
const buyerAgent = {
  persona: 'enterprise-procurement',
  traits: {
    assertiveness: 0.9,
    flexibility: 0.4,
    patience: 0.8
  },
  strategies: [
    'competitive-bidding',
    'volume-leverage',
    'multi-year-discount'
  ],
  constraints: {
    maxBudget: 25000,
    requiredFeatures: ['compliance', 'support']
  }
};
```

### Mediator Agent

```typescript
const mediatorAgent = {
  persona: 'neutral-mediator',
  traits: {
    assertiveness: 0.3,
    flexibility: 0.9,
    patience: 1.0
  },
  strategies: [
    'find-common-ground',
    'reframe-positions',
    'propose-alternatives'
  ]
};
```

---

## 📊 Negotiation Strategies

| Strategy | Description | Best For |
|----------|-------------|----------|
| Value-Selling | Emphasize ROI and value | High-price products |
| Anchoring | Set high initial price | Price negotiations |
| Bundling | Package multiple items | Upselling |
| Volume-Leverage | Discount for quantity | Large deals |
| Multi-Year | Lock-in for discount | Recurring revenue |
| Competitive-Bidding | Reference competitors | Price pressure |

---

## 📈 Example Transcript

```
=== Round 1 ===
[QAntum Sales]: Thank you for your interest in QAntum Enterprise.
                Our solution will save your team 500+ hours annually.
                List price for 100 seats is $29,900/year.

[Enterprise Buyer]: We've been evaluating multiple solutions.
                    Our budget is $25,000 max.
                    Can you do better on pricing?

=== Round 2 ===
[QAntum Sales]: I understand budget constraints. Given your volume,
                I can offer a 10% discount: $26,910/year.
                This includes priority support worth $3,000.

[Enterprise Buyer]: That's still above budget. We need 15% off
                    or we'll have to consider alternatives.

=== Round 3 ===
[QAntum Sales]: For a 2-year commitment, I can authorize 15% off:
                $25,415/year, plus 3 months free implementation.

[Enterprise Buyer]: If you can do $25,000 flat for 2 years,
                    we can sign today.

=== Round 4 ===
[QAntum Sales]: Deal. $25,000/year for 2 years with all Enterprise
                features and priority support. Sending contract now.

[Enterprise Buyer]: Agreed. Looking forward to the partnership.

=== OUTCOME: DEAL ===
Final Price: $25,000/year
Discount: 16.4%
Term: 2 years
Total Contract Value: $50,000
```

---

## 🔧 Configuration

```typescript
const engine = new NegotiationEngine({
  llm: {
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.7
  },
  rules: {
    maxRounds: 20,
    timeoutPerRound: 30000,
    requireConsensus: true
  },
  logging: {
    enabled: true,
    detailed: true
  }
});
```

---

© 2025 Dimitar Prodromov. All rights reserved.
