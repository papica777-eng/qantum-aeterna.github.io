# ADR-003: THE ORACLE Autonomous Discovery System

**Status:** Accepted  
**Date:** 2024-12-30  
**Author:** QAntum AI Architect

## Context

Users want to test web applications but manually writing test cases is time-consuming and error-prone. The goal was to create a system where the user provides only a URL, and the system automatically discovers, analyzes, and tests everything.

**Motto:** "Дай URL. Получи всичко."

## Decision

We implemented **THE ORACLE** - a four-module autonomous discovery system:

### Module 1: Site Mapper (`site-mapper.ts`)
- AI-powered crawling with intelligent link following
- Form discovery with field type detection
- API endpoint interception
- Screenshot capture and security header analysis
- Page graph generation for navigation paths

### Module 2: Logic Discovery (`logic-discovery.ts`)
- Chronos-Paradox path simulation
- Form validation testing with varied test data
- Authentication flow mapping
- Transaction flow discovery
- User journey generation

### Module 3: Auto Test Factory (`auto-test-factory.ts`)
- E2E navigation tests
- Form validation tests (valid, invalid, empty)
- API endpoint tests
- Visual regression tests
- Performance tests (Core Web Vitals)
- Security tests (XSS, headers, auth)
- Flow tests from discovered transactions

### Module 4: Report Generator (`report-generator.ts`)
- Supreme QA Report with executive summary
- Security analysis with scoring
- Performance metrics
- Test coverage analysis
- Recommendations with priority

## Architecture

```
URL Input
    │
    ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  SITE       │───►│  LOGIC      │───►│  AUTO TEST  │───►│  REPORT     │
│  MAPPER     │    │  DISCOVERY  │    │  FACTORY    │    │  GENERATOR  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
    │                    │                  │                   │
    ▼                    ▼                  ▼                   ▼
  SiteMap          BusinessLogic       TestPackage        SupremeQAReport
  - Pages          - Validations       - 6 Test Types     - HTML/MD/JSON
  - Forms          - Auth Flows        - Playwright Code  - Scores
  - APIs           - Transactions      - Ghost Protocol   - Recommendations
```

## Consequences

### Positive
- Zero manual test writing required
- Complete application coverage
- Consistent test quality
- Business logic automatically documented
- Reports ready for stakeholders

### Negative
- Initial scan can take 2-5 minutes
- AI purpose detection may need refinement
- Large sites may hit crawl limits

### Neutral
- Tests may need customization for edge cases
- Report format preferences may vary

## Alternatives Considered

1. **Record-and-Playback Tools**: Limited to recorded paths
2. **API-only Testing**: Misses UI interactions
3. **Manual Test Case Writing**: Time-consuming, incomplete

## Implementation

Location: `src/oracle/` (4,500+ lines across 5 files)

Usage:
```typescript
import { createOracle } from './src/oracle';

const oracle = createOracle({ headless: true });
const result = await oracle.explore('https://example.com');
// result: { siteMap, logic, journeys, flows, testPackage, report }
```
