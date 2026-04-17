# ADR-006: Universal Synthesis - 5-Layer Architecture

## Status
**Accepted** - Implemented 2025-01

## Context

QAntum Framework evolved organically from a simple test framework to a complex autonomous system with:
- 45 domains
- 82,489 lines of code
- 151 files

The Big Lens Report revealed:
- **18 architectural violations** (layer violations, orphan domains)
- **31 domains classified as CHEMISTRY** (overloaded middle layer)
- **Only 1 MATH domain** (weak foundation)
- **5 REALITY domains** (good, but disorganized)

The codebase had no formal architectural model, leading to:
- Circular dependencies
- Unclear responsibilities
- Difficulty reasoning about change impact
- No clear import/export contracts

## Decision

We adopt the **Universal Synthesis** architecture - a 5-layer model inspired by the natural world:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  [5] REALITY    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│      └── The Output to the World (CLI, Reports, UI, Notifications)         │
│          ↓ CONSUMES: Biology, Chemistry, Physics, Math                      │
│                                                                             │
│  [4] BIOLOGY    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│      └── Self-Organizing Systems (Learning, Healing, Evolution)            │
│          ↓ CONSUMES: Chemistry, Physics, Math                               │
│                                                                             │
│  [3] CHEMISTRY  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│      └── Reactive Transformations (Adapters, Validators, Pipelines)        │
│          ↓ CONSUMES: Physics, Math                                          │
│                                                                             │
│  [2] PHYSICS    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│      └── Interaction Rules (Queues, Rate Limiting, Scheduling)             │
│          ↓ CONSUMES: Math                                                   │
│                                                                             │
│  [1] MATH       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│      └── The DNA of the Universe (Algorithms, Graph Theory, Probability)   │
│          ↓ CONSUMES: Nothing (Pure Foundation)                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

#### Layer 1: MATH (Foundation)
**Philosophy:** "Математиката е езикът, на който Бог е написал Вселената." — Галилео

- Pure algorithms, no side effects
- Deterministic outputs for identical inputs
- Zero dependencies on other layers
- Immutable data structures

**Contains:**
- Temporal algorithms (Chronos core)
- Graph algorithms (cycle detection, topological sort)
- Probability (Bayesian inference)
- Hashing (content addressing)

#### Layer 2: PHYSICS (Interaction Rules)
**Philosophy:** "За всяко действие има равно и противоположно противодействие." — Нютон

- Defines HOW entities interact
- Depends only on MATH
- Manages queues, scheduling, flow control

**Contains:**
- Queue Engine (priority queues with time decay)
- Swarm Physics (Boids algorithm)
- Rate Limiters (token bucket, sliding window)
- Performance Trackers

#### Layer 3: CHEMISTRY (Transformations)
**Philosophy:** "Химията е изкуството на трансформацията." — Лавоазие

- Pure transformations (input → output)
- Composable pipelines
- Type-safe bindings

**Contains:**
- Transform Pipelines
- Adapters (format converters)
- Validators (schema validation)
- Protocol Bindings (HTTP, etc.)

#### Layer 4: BIOLOGY (Self-Organization)
**Philosophy:** "Животът намира път." — Джурасик Парк

- Self-organizing systems
- Learning from experience
- Autonomous healing

**Contains:**
- Cognitive Core (working/long-term memory)
- Oracle (prediction engine)
- Self-Healing Organism
- Evolution Engine (genetic algorithms)

#### Layer 5: REALITY (Output)
**Philosophy:** "Думите създават реалности." — Витгенщайн

- Final output to the world
- Human-readable always
- Exports nothing to other layers

**Contains:**
- CLI Output (colors, progress bars, tables)
- Report Generator (markdown, HTML, JSON)
- Notification System
- Reality Orchestrator

### Dependency Rules (Immutable)

```typescript
// These rules are ALWAYS enforced:

// 1. Lower layers NEVER import from higher layers
MATH.import(PHYSICS)     // ❌ FORBIDDEN
PHYSICS.import(BIOLOGY)   // ❌ FORBIDDEN
CHEMISTRY.import(REALITY) // ❌ FORBIDDEN

// 2. Each layer may only import from layers below it
PHYSICS.import(MATH)     // ✅ ALLOWED
BIOLOGY.import(MATH)     // ✅ ALLOWED (skip layers OK)
REALITY.import(MATH)     // ✅ ALLOWED

// 3. MATH is the foundation - imports nothing
MATH.import(*)           // ❌ FORBIDDEN (except Node.js primitives)

// 4. REALITY is terminal - exports nothing to code
*.import(REALITY)        // ❌ FORBIDDEN
```

### Validation

The `DomainMapper` in `src/core/domain-mapper.ts` automatically:
1. Scans all domains
2. Infers layer assignment based on content
3. Detects layer violations
4. Generates `.domain.json` manifests
5. Produces Big Lens Report with health score

## Consequences

### Positive
- **No circular dependencies by design** - Impossible if rules followed
- **Clear responsibilities** - Each layer has defined scope
- **Easy to test** - Lower layers have no dependencies
- **Scales infinitely** - Add domains within any layer
- **Mirrors reality** - Intuitive mental model

### Negative
- **Migration effort** - Existing 45 domains must be refactored
- **Strict discipline** - Developers must understand layer rules
- **Some code duplication** - Can't share utilities "up" the stack

### Neutral
- **Learning curve** - New metaphor, but intuitive once understood

## Implementation

### Phase 1: Foundation (Complete)
- [x] Create `src/layers/` directory
- [x] Implement MATH layer with pure algorithms
- [x] Implement PHYSICS layer with queues, rate limiters
- [x] Implement CHEMISTRY layer with transformations
- [x] Implement BIOLOGY layer with learning systems
- [x] Implement REALITY layer with CLI, reports
- [x] Create barrel export with validation functions

### Phase 2: Migration (Pending)
- [ ] Map existing 45 domains to layers
- [ ] Refactor `chronos` from MATH (has ghost dependency)
- [ ] Refactor `swarm` from PHYSICS (has api dependency)
- [ ] Create migration scripts
- [ ] Update all imports to use layer paths

### Phase 3: Enforcement (Pending)
- [ ] Add ESLint rule for layer violations
- [ ] CI/CD gate for Big Lens health score
- [ ] Automatic `.domain.json` generation on commit

## Related Decisions

- [ADR-001: Chronos Paradox Engine](./001-chronos-paradox-engine.md) - Now part of MATH layer
- [ADR-003: THE ORACLE](./003-the-oracle-autonomous-discovery.md) - Now part of BIOLOGY layer
- [ADR-004: Neural Backpack](./004-neural-backpack-context-persistence.md) - Spans MATH + BIOLOGY

## References

- Feynman, R. - "Everything is made of atoms and mathematics"
- Clean Architecture by Robert C. Martin
- Hexagonal Architecture by Alistair Cockburn
- Domain-Driven Design by Eric Evans

---

*"Структурата на Реалността в Код"*
