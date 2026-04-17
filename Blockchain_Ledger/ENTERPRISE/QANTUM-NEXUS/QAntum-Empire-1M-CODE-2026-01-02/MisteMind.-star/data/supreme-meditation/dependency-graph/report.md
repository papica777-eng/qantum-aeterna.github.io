# Dependency Graph Analysis Report
Generated: 2025-12-31T22:23:21.563Z

## Overview
- **Total Files:** 141
- **Total Dependencies:** 107
- **Modules:** 36
- **Health Score:** 96/100

## Module Metrics
| Module | Files | Lines | Ca | Ce | Instability |
|--------|-------|-------|----|----|-------------|
| reality | 14 | 10151 | 2 | 1 | 0.33 |
| cognition | 12 | 7345 | 1 | 0 | 0.00 |
| biology | 10 | 9917 | 2 | 2 | 0.50 |
| security | 8 | 4746 | 1 | 0 | 0.00 |
| chronos | 6 | 3808 | 0 | 0 | 0.00 |
| core | 6 | 3464 | 0 | 0 | 0.00 |
| ghost | 6 | 3431 | 0 | 0 | 0.00 |
| performance | 6 | 2528 | 0 | 0 | 0.00 |
| synthesis | 5 | 2278 | 0 | 0 | 0.00 |
| ai | 4 | 2271 | 0 | 0 | 0.00 |
| data | 4 | 1577 | 0 | 0 | 0.00 |
| distributed | 4 | 1867 | 0 | 0 | 0.00 |
| physics | 4 | 3917 | 3 | 0 | 0.00 |
| reporter | 4 | 1811 | 0 | 0 | 0.00 |
| saas | 4 | 1772 | 0 | 0 | 0.00 |
| storage | 4 | 1694 | 0 | 0 | 0.00 |
| validation | 4 | 1628 | 0 | 0 | 0.00 |
| api | 3 | 1294 | 0 | 0 | 0.00 |
| config | 3 | 1624 | 0 | 0 | 0.00 |
| dashboard | 3 | 2828 | 0 | 2 | 1.00 |
| events | 3 | 1028 | 0 | 0 | 0.00 |
| extensibility | 3 | 1231 | 0 | 0 | 0.00 |
| integration | 3 | 1145 | 0 | 0 | 0.00 |
| visual | 3 | 1266 | 0 | 0 | 0.00 |
| accessibility | 2 | 821 | 0 | 0 | 0.00 |
| plugins | 2 | 775 | 0 | 0 | 0.00 |
| swarm | 2 | 2412 | 2 | 1 | 0.33 |
| docs | 1 | 964 | 1 | 0 | 0.00 |
| global-nexus | 1 | 266 | 0 | 4 | 1.00 |
| index.ts | 1 | 167 | 0 | 0 | 0.00 |
| licensing | 1 | 1299 | 0 | 0 | 0.00 |
| market-reaper.ts | 1 | 56 | 0 | 0 | 0.00 |
| math | 1 | 481 | 0 | 0 | 0.00 |
| oracle | 1 | 182 | 0 | 0 | 0.00 |
| sales | 1 | 1452 | 0 | 0 | 0.00 |
| sovereign-market | 1 | 335 | 0 | 2 | 1.00 |

## 🚨 Layer Violations
- **WARNING:** src/biology/evolution/index.ts (biology) → src/cognition/ContextInjector.ts (cognition)
  - Rule: Layer biology (level 2) should not import from cognition (level 3)
- **WARNING:** src/biology/evolution/SelfCorrectionLoop.ts (biology) → src/cognition/ContextInjector.ts (cognition)
  - Rule: Layer biology (level 2) should not import from cognition (level 3)

## Hub Files (Most Dependencies)
- **ArbitrageOrchestrator.ts:** 1 dependents, 5 dependencies
- **index.ts:** 0 dependents, 5 dependencies
- **SelfCorrectionLoop.ts:** 1 dependents, 4 dependencies
- **ContextInjector.ts:** 2 dependents, 3 dependencies
- **ArmedReaper.ts:** 0 dependents, 5 dependencies
- **index.ts:** 0 dependents, 5 dependencies
- **BrainRouter.ts:** 2 dependents, 2 dependencies
- **index.ts:** 0 dependents, 4 dependencies
- **index.ts:** 0 dependents, 4 dependencies
- **index.ts:** 0 dependents, 4 dependencies

## Orphan Files (No Dependencies)
- src/biology/evolution/HiveMind.ts
- src/biology/evolution/MarketBlueprint.ts
- src/biology/evolution/NeuralSelfEvolver.ts
- src/chronos/PredictiveScaler.ts
- src/chronos/PriceOracle.ts
- src/cognition/DependencyGraph.ts
- src/cognition/inference-engine.ts
- src/cognition/multi-perspective.ts
- src/cognition/semantic-memory.ts
- src/cognition/uncertainty.ts
- ... and 22 more