# ADR-004: Neural Backpack Context Persistence

**Status:** Accepted  
**Date:** 2024-12-30  
**Author:** QAntum AI Architect

## Context

AI agents suffer from "dementia" - they lose context across sessions and conversations. This leads to:
- Repeated questions about already-discussed topics
- Contradictory responses (hallucinations)
- Loss of project history and decisions
- Wasted time re-establishing context

**Motto:** "Раницата винаги е на гърба ми. Нулева забрава. Невъзможност за объркване."

## Decision

We implemented the **Neural Backpack** - a "second brain" for AI agents with four core components:

### Component 1: FIFO Buffer
- Exactly 10-message capacity (configurable)
- Generic type support (`FIFOBuffer<T>`)
- Automatic oldest-message eviction
- Methods: `push()`, `getAll()`, `getLast()`, `getOldest()`, `getNewest()`

### Component 2: Persistence Layer
- Auto-save to `storage/backpack.json`
- 1-second debouncing to prevent disk thrashing
- Automatic restore on startup
- Graceful error handling

### Component 3: Context Injector
- Generates `[CRITICAL_CONTEXT_LAST_10_STEPS]` header
- Markdown-formatted context block
- Ready for prompt injection
- Preserves chronological order

### Component 4: Hallucination Guard
- Checks new responses against last 3 messages
- Detects contradictions using pattern matching
- Reports confidence score and conflicts
- Prevents AI from contradicting itself

## Architecture

```
                    ┌────────────────────────────┐
                    │      NEURAL BACKPACK       │
                    │   "Second Brain for AI"    │
                    └────────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FIFO BUFFER   │    │   PERSISTENCE   │    │  HALLUCINATION  │
│   (10 slots)    │    │     LAYER       │    │     GUARD       │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ [1] Message     │    │ Auto-save       │    │ Check against   │
│ [2] Message     │◄──►│ Debounce 1s     │    │ last 3 messages │
│ [3] Message     │    │ JSON storage    │    │ Detect conflicts│
│ ...             │    │                 │    │ Report issues   │
│ [10] Message    │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│ CONTEXT INJECTOR│
├─────────────────┤
│ Generate header │
│ for AI prompts  │
└─────────────────┘
```

## Consequences

### Positive
- Zero context loss across sessions
- AI cannot contradict previous statements
- Persistent memory survives restarts
- Clean prompt injection mechanism

### Negative
- 10-message limit may miss older context
- Storage file needs backup strategy
- Slight overhead for hallucination checks

### Neutral
- Developers must decide what constitutes a "message"
- Formatting of context header is opinionated

## Alternatives Considered

1. **Full Conversation Storage**: Too much data, slow lookup
2. **Vector Database**: Overkill for 10 messages
3. **Redis Cache**: External dependency, complexity

## Implementation

Location: `src/intelligence/neural-backpack.ts` (861 lines)

Usage:
```typescript
import { getNeuralBackpack } from './src/intelligence';

const backpack = getNeuralBackpack();

// Add message
backpack.addMessage({ role: 'user', content: 'Test login' });

// Get context for prompts
const header = backpack.getContextHeader();

// Check for hallucinations
const check = backpack.checkConsistency('New response text');
if (!check.isConsistent) {
  console.warn('Potential hallucination:', check.conflicts);
}
```

## Singleton Pattern

Neural Backpack implements the Singleton pattern to ensure a single source of truth:

```typescript
let globalInstance: NeuralBackpack | null = null;

export function getNeuralBackpack(): NeuralBackpack {
  if (!globalInstance) {
    globalInstance = new NeuralBackpack();
  }
  return globalInstance;
}
```
