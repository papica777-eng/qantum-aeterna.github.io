# 🧠 QANTUM HYBRID v26.0 - MASTER IMPLEMENTATION PLAN
## 110 Steps to Enterprise-Grade Automation Framework

> **Цел:** Изграждане на production-ready automation framework, комбиниращ:
> - 🟢 **Cypress** - Fluent API, auto-waiting, simple syntax
> - 🟣 **Playwright** - Speed, Shadow DOM, Network interception  
> - 🔴 **Selenium** - Enterprise scale, Grid support, legacy compatibility

---

## 📊 НАЛИЧНИ РЕСУРСИ В РЕПОТО

| Компонент | Файл | Статус |
|-----------|------|--------|
| BasePage POM | `training-framework/architecture/pom-base.js` | ✅ Готов |
| BaseElement | `training-framework/architecture/pom-base.js` | ✅ Готов |
| Self-Healing | `qantum-v8.js` lines 1365+ | ✅ Частично |
| Shadow DOM | `shadow-visual-engines.js` | ✅ Готов |
| Deep Search | `shadow-visual-engines.js` ShadowDOMPenetrator | ✅ Готов |
| Network Intercept | `playwright-professor.js` | ✅ Частично |
| PageFactory | `training-framework/architecture/pom-base.js` | ✅ Готов |
| LocatorFactory | `training-framework/architecture/pom-base.js` | ✅ Готов |
| Тестове | `test/*.test.js` | ✅ 1000+ теста |

---

# ═══════════════════════════════════════════════════════════════
# ФАЗА 0: ПОДГОТОВКА И SETUP (Стъпки 1-10)
# ═══════════════════════════════════════════════════════════════

## Стъпка 1: Инициализация на проекта
- [x] Създай `qantum-hybrid/` директория
- [x] Инициализирай `package.json` с всички dependencies
- [x] Създай `tsconfig.json` за strict TypeScript

## Стъпка 2: Дефиниране на типове
- [x] Създай `src/types/index.ts`
- [x] Дефинирай `BrowserConfig`, `MMConfig`, `MMElement`
- [x] Дефинирай `InterceptConfig`, `TestResult`

## Стъпка 3: Конфигурация по подразбиране
- [x] `DEFAULT_CONFIG` с разумни стойности
- [x] Environment variables support
- [x] Config validation

## Стъпка 4: Проектна структура
- [x] `src/core/` - основни класове
- [x] `src/adapters/` - Selenium/Cypress compatibility
- [x] `src/types/` - TypeScript типове
- [ ] `src/reporters/` - HTML/JSON reporters
- [ ] `src/cli/` - Command line interface
- [ ] `src/examples/` - Demo tests

## Стъпка 5: Dependencies инсталация
- [x] Playwright
- [x] Selenium WebDriver
- [x] Mochawesome
- [ ] Allure reporter
- [ ] Commander (CLI)

## Стъпка 6: Build система
- [x] TypeScript compilation
- [x] Source maps
- [ ] Watch mode
- [ ] Bundle for npm

## Стъпка 7: Тестова инфраструктура
- [ ] Jest/Mocha setup
- [ ] Test fixtures
- [ ] Mock servers

## Стъпка 8: CI/CD конфигурация
- [ ] GitHub Actions workflow
- [ ] Automated testing
- [ ] NPM publish workflow

## Стъпка 9: Documentation setup
- [ ] JSDoc comments
- [ ] API documentation generator
- [ ] README templates

## Стъпка 10: Lint и форматиране
- [x] ESLint config
- [ ] Prettier config
- [ ] Pre-commit hooks

---

# ═══════════════════════════════════════════════════════════════
# ФАЗА 1: CORE ARCHITECTURE - POM (Стъпки 11-30)
# ═══════════════════════════════════════════════════════════════

## Стъпка 11: BaseElement клас
```typescript
// Миграция от training-framework/architecture/pom-base.js
class BaseElement {
  locator: LocatorStrategy;
  alternativeLocators: LocatorStrategy[];
  options: ElementOptions;
  metadata: ElementMetadata;
  state: ElementState;
}
```
- [ ] Порт на TypeScript
- [ ] Добави Playwright интеграция
- [ ] Добави event emitter

## Стъпка 12: LocatorStrategy
```typescript
interface LocatorStrategy {
  type: 'css' | 'xpath' | 'testId' | 'text' | 'role';
  value: string;
  priority: number;
}
```
- [ ] CSS селектори
- [ ] XPath
- [ ] data-testid
- [ ] Text content
- [ ] ARIA roles

## Стъпка 13: BasePage клас
```typescript
// От pom-base.js lines 216+
class BasePage extends EventEmitter {
  elements: Map<string, BaseElement>;
  components: Map<string, BaseComponent>;
  actions: Map<string, Function>;
}
```
- [ ] Element registration
- [ ] Component composition
- [ ] Action handlers

## Стъпка 14: PageFactory
```typescript
// От pom-base.js lines 555+
class PageFactory {
  pages: Map<string, typeof BasePage>;
  instances: Map<string, BasePage>;
}
```
- [ ] Page registration
- [ ] Lazy instantiation
- [ ] Singleton pattern option

## Стъпка 15: BaseComponent
```typescript
class BaseComponent extends BasePage {
  root: BaseElement;
  scope: string;
}
```
- [ ] Scoped element search
- [ ] Nested components
- [ ] Component lifecycle

## Стъпка 16: LocatorFactory
```typescript
const By = {
  css: (selector: string) => ({ type: 'css', value: selector }),
  xpath: (path: string) => ({ type: 'xpath', value: path }),
  testId: (id: string) => ({ type: 'testId', value: id }),
  text: (text: string) => ({ type: 'text', value: text }),
  role: (role: string, name?: string) => ({ type: 'role', value: role, name })
};
```
- [ ] Всички locator типове
- [ ] Chaining support
- [ ] Validation

## Стъпка 17: Element Methods
```typescript
interface ElementMethods {
  click(): Promise<void>;
  type(text: string): Promise<void>;
  clear(): Promise<void>;
  hover(): Promise<void>;
  focus(): Promise<void>;
  scrollIntoView(): Promise<void>;
}
```
- [ ] Всички Selenium методи
- [ ] Error handling
- [ ] Auto-wait интеграция

## Стъпка 18: Element Getters
```typescript
interface ElementGetters {
  getText(): Promise<string>;
  getValue(): Promise<string>;
  getAttribute(name: string): Promise<string>;
  getCssValue(property: string): Promise<string>;
  getRect(): Promise<DOMRect>;
}
```
- [ ] Text extraction
- [ ] Attribute access
- [ ] Style properties

## Стъпка 19: Element State
```typescript
interface ElementState {
  isVisible(): Promise<boolean>;
  isEnabled(): Promise<boolean>;
  isSelected(): Promise<boolean>;
  isChecked(): Promise<boolean>;
  exists(): Promise<boolean>;
}
```
- [ ] Visibility check
- [ ] Enabled state
- [ ] Selection state

## Стъпка 20: Page Navigation
```typescript
class BasePage {
  async navigate(url?: string): Promise<void>;
  async reload(): Promise<void>;
  async goBack(): Promise<void>;
  async goForward(): Promise<void>;
  async waitForNavigation(): Promise<void>;
}
```
- [ ] URL navigation
- [ ] History navigation
- [ ] Wait for load

## Стъпка 21: Page Properties
```typescript
interface PageProperties {
  getTitle(): Promise<string>;
  getUrl(): string;
  getSource(): Promise<string>;
  getCookies(): Promise<Cookie[]>;
}
```
- [ ] Title access
- [ ] URL access
- [ ] HTML source
- [ ] Cookie management

## Стъпка 22: Window Management
```typescript
interface WindowManager {
  maximize(): Promise<void>;
  minimize(): Promise<void>;
  setSize(width: number, height: number): Promise<void>;
  getSize(): Promise<{width: number, height: number}>;
  switchTo(handle: string): Promise<void>;
}
```
- [ ] Window sizing
- [ ] Multi-window support
- [ ] Tab management

## Стъпка 23: Alert Handling
```typescript
interface AlertHandler {
  accept(): Promise<void>;
  dismiss(): Promise<void>;
  getText(): Promise<string>;
  sendKeys(text: string): Promise<void>;
}
```
- [ ] Alert detection
- [ ] Prompt handling
- [ ] Confirm dialogs

## Стъпка 24: Form Helpers
```typescript
interface FormHelpers {
  fill(data: Record<string, string>): Promise<void>;
  submit(): Promise<void>;
  reset(): Promise<void>;
  validate(): Promise<ValidationResult>;
}
```
- [ ] Batch fill
- [ ] Form submission
- [ ] Validation helpers

## Стъпка 25: Table Helpers
```typescript
interface TableHelpers {
  getRows(): Promise<TableRow[]>;
  getCell(row: number, col: number): Promise<string>;
  findRow(predicate: (row: TableRow) => boolean): Promise<TableRow>;
  sort(column: string): Promise<void>;
}
```
- [ ] Row extraction
- [ ] Cell access
- [ ] Sorting support

## Стъпка 26: Dropdown Helpers
```typescript
interface DropdownHelpers {
  selectByValue(value: string): Promise<void>;
  selectByText(text: string): Promise<void>;
  selectByIndex(index: number): Promise<void>;
  getOptions(): Promise<string[]>;
  getSelected(): Promise<string>;
}
```
- [ ] Select element support
- [ ] Multi-select
- [ ] Custom dropdowns

## Стъпка 27: File Upload
```typescript
interface FileUpload {
  upload(filePath: string | string[]): Promise<void>;
  dragAndDrop(filePath: string): Promise<void>;
}
```
- [ ] File input
- [ ] Drag and drop
- [ ] Multiple files

## Стъпка 28: Keyboard Actions
```typescript
interface KeyboardActions {
  press(key: string): Promise<void>;
  type(text: string, delay?: number): Promise<void>;
  shortcut(...keys: string[]): Promise<void>;
}
```
- [ ] Key press
- [ ] Key combinations
- [ ] Special keys

## Стъпка 29: Mouse Actions
```typescript
interface MouseActions {
  click(x?: number, y?: number): Promise<void>;
  doubleClick(): Promise<void>;
  rightClick(): Promise<void>;
  drag(target: BaseElement): Promise<void>;
  hover(): Promise<void>;
}
```
- [ ] Click variants
- [ ] Drag and drop
- [ ] Coordinates support

## Стъпка 30: Touch Actions (Mobile)
```typescript
interface TouchActions {
  tap(): Promise<void>;
  doubleTap(): Promise<void>;
  longPress(duration?: number): Promise<void>;
  swipe(direction: 'up' | 'down' | 'left' | 'right'): Promise<void>;
  pinch(scale: number): Promise<void>;
}
```
- [ ] Touch gestures
- [ ] Swipe
- [ ] Pinch/zoom

---

# ═══════════════════════════════════════════════════════════════
# ФАЗА 2: SELF-HEALING ENGINE (Стъпки 31-50)
# ═══════════════════════════════════════════════════════════════

## Стъпка 31: HealingEngine клас
```typescript
// Миграция от qantum-v8.js lines 1365+
class SelfHealingEngine {
  strategies: HealingStrategy[];
  history: Map<string, HealingRecord>;
  mlRanker?: MLRanker;
}
```
- [ ] Strategy registration
- [ ] History tracking
- [ ] ML integration готовност

## Стъпка 32: HealingStrategy интерфейс
```typescript
interface HealingStrategy {
  name: string;
  priority: number;
  canHeal(selector: string): boolean;
  heal(page: Page, selector: string): Promise<HealingResult>;
}
```
- [ ] Strategy pattern
- [ ] Priority ordering
- [ ] Conditional healing

## Стъпка 33: Strategy 1 - data-testid
```typescript
class TestIdStrategy implements HealingStrategy {
  priority = 100;
  
  async heal(page, selector) {
    // Търси data-testid от оригиналния селектор
    const testId = extractTestId(selector);
    return page.locator(`[data-testid="${testId}"]`);
  }
}
```
- [ ] Extract testid
- [ ] Fallback to similar testids
- [ ] Fuzzy matching

## Стъпка 34: Strategy 2 - data-qa / data-cy
```typescript
class DataAttributeStrategy implements HealingStrategy {
  priority = 95;
  attributes = ['data-qa', 'data-cy', 'data-automation', 'data-test'];
}
```
- [ ] Multiple data attributes
- [ ] Priority ordering
- [ ] Custom attributes support

## Стъпка 35: Strategy 3 - ID селектор
```typescript
class IdStrategy implements HealingStrategy {
  priority = 90;
  
  async heal(page, selector) {
    // Търси id от оригиналния елемент
    const id = extractId(selector);
    return page.locator(`#${id}`);
  }
}
```
- [ ] Exact ID match
- [ ] Partial ID match
- [ ] Generated ID detection

## Стъпка 36: Strategy 4 - Name атрибут
```typescript
class NameStrategy implements HealingStrategy {
  priority = 85;
}
```
- [ ] Form element names
- [ ] Unique name validation

## Стъпка 37: Strategy 5 - ARIA label
```typescript
class AriaLabelStrategy implements HealingStrategy {
  priority = 80;
  
  async heal(page, selector) {
    return page.getByRole('button', { name: ariaLabel });
  }
}
```
- [ ] aria-label
- [ ] aria-labelledby
- [ ] aria-describedby

## Стъпка 38: Strategy 6 - Placeholder
```typescript
class PlaceholderStrategy implements HealingStrategy {
  priority = 75;
}
```
- [ ] Input placeholders
- [ ] Textarea placeholders

## Стъпка 39: Strategy 7 - Text Content
```typescript
class TextContentStrategy implements HealingStrategy {
  priority = 70;
  
  async heal(page, selector) {
    const text = extractText(selector);
    return page.getByText(text, { exact: false });
  }
}
```
- [ ] Exact text match
- [ ] Partial text match
- [ ] Normalized whitespace

## Стъпка 40: Strategy 8 - CSS Class
```typescript
class CssClassStrategy implements HealingStrategy {
  priority = 65;
  
  async heal(page, selector) {
    // Комбинирай уникални класове
    const classes = extractClasses(selector);
    return page.locator(`.${classes.join('.')}`);
  }
}
```
- [ ] Single class
- [ ] Multiple classes
- [ ] Unique class detection

## Стъпка 41: Strategy 9 - XPath Text
```typescript
class XPathTextStrategy implements HealingStrategy {
  priority = 60;
  
  async heal(page, selector) {
    const text = extractText(selector);
    return page.locator(`xpath=//*[contains(text(),'${text}')]`);
  }
}
```
- [ ] Text contains
- [ ] Normalized text
- [ ] Case insensitive

## Стъпка 42: Strategy 10 - XPath Contains
```typescript
class XPathContainsStrategy implements HealingStrategy {
  priority = 55;
}
```
- [ ] Attribute contains
- [ ] Class contains
- [ ] Multiple conditions

## Стъпка 43: Strategy 11 - Relative Position
```typescript
class RelativePositionStrategy implements HealingStrategy {
  priority = 50;
  
  async heal(page, selector) {
    // Намери по позиция спрямо известен елемент
    return page.locator('form').locator('input').first();
  }
}
```
- [ ] Near element
- [ ] Inside container
- [ ] Sibling relations

## Стъпка 44: Strategy 12 - Parent-Child
```typescript
class ParentChildStrategy implements HealingStrategy {
  priority = 45;
}
```
- [ ] Direct child
- [ ] Descendant
- [ ] Ancestor lookup

## Стъпка 45: Strategy 13 - Sibling Relation
```typescript
class SiblingStrategy implements HealingStrategy {
  priority = 40;
}
```
- [ ] Previous sibling
- [ ] Next sibling
- [ ] Following/preceding

## Стъпка 46: Strategy 14 - Visual Similarity
```typescript
class VisualSimilarityStrategy implements HealingStrategy {
  priority = 35;
  
  async heal(page, selector, screenshot) {
    // AI-based visual matching
    return await this.aiMatcher.findSimilar(page, screenshot);
  }
}
```
- [ ] Screenshot comparison
- [ ] AI matching (future)
- [ ] Color/shape analysis

## Стъпка 47: Strategy 15 - Semantic Match
```typescript
class SemanticMatchStrategy implements HealingStrategy {
  priority = 30;
  
  async heal(page, selector) {
    // Семантично търсене по роля
    const role = inferRole(selector);
    return page.getByRole(role);
  }
}
```
- [ ] Role inference
- [ ] Semantic HTML
- [ ] ARIA roles

## Стъпка 48: HealingHistory
```typescript
interface HealingRecord {
  originalSelector: string;
  healedSelector: string;
  strategy: string;
  timestamp: Date;
  success: boolean;
  page: string;
}
```
- [ ] Record all healings
- [ ] Success tracking
- [ ] Analytics

## Стъпка 49: HealingReport
```typescript
class HealingReporter {
  generateReport(): HealingReport;
  exportToJSON(): string;
  exportToHTML(): string;
}
```
- [ ] Summary report
- [ ] Detailed log
- [ ] Recommendations

## Стъпка 50: ML Ranker (Future)
```typescript
class MLRanker {
  rank(strategies: HealingStrategy[], context: Context): HealingStrategy[];
  train(history: HealingRecord[]): void;
}
```
- [ ] Strategy ranking
- [ ] Learning from history
- [ ] Context awareness

---

# ═══════════════════════════════════════════════════════════════
# ФАЗА 3: DEEP SEARCH ENGINE (Стъпки 51-65)
# ═══════════════════════════════════════════════════════════════

## Стъпка 51: DeepSearchEngine клас
```typescript
// Миграция от shadow-visual-engines.js
class DeepSearchEngine {
  maxDepth: number;
  shadowRoots: ShadowRoot[];
  iframes: Frame[];
}
```
- [ ] Port to TypeScript
- [ ] Playwright integration
- [ ] Caching

## Стъпка 52: Shadow DOM Discovery
```typescript
async discoverShadowRoots(): Promise<ShadowRoot[]> {
  return page.evaluate(() => {
    const roots = [];
    // Рекурсивно търси Shadow DOM
    function findShadowRoots(node) {
      if (node.shadowRoot) roots.push(node);
      node.querySelectorAll('*').forEach(findShadowRoots);
    }
    findShadowRoots(document);
    return roots;
  });
}
```
- [ ] Recursive discovery
- [ ] Depth tracking
- [ ] Cache invalidation

## Стъпка 53: Shadow DOM Penetration
```typescript
async findInShadow(selector: string): Promise<DeepSearchResult> {
  // Playwright's >> syntax за Shadow DOM
  return page.locator(`${hostSelector} >> ${selector}`);
}
```
- [ ] Piercing selectors
- [ ] Nested shadows
- [ ] Closed shadows handling

## Стъпка 54: Iframe Discovery
```typescript
async discoverIframes(): Promise<IframeInfo[]> {
  const iframes = await page.locator('iframe').all();
  return iframes.map(async (iframe, index) => ({
    index,
    src: await iframe.getAttribute('src'),
    visible: await iframe.isVisible(),
    accessible: await this.checkAccessibility(iframe)
  }));
}
```
- [ ] All iframes list
- [ ] Visibility check
- [ ] Cross-origin detection

## Стъпка 55: Iframe Context Switch
```typescript
async switchToFrame(identifier: string | number): Promise<void> {
  if (typeof identifier === 'number') {
    await page.frameLocator(`iframe >> nth=${identifier}`);
  } else {
    await page.frameLocator(`iframe[name="${identifier}"]`);
  }
}
```
- [ ] By index
- [ ] By name
- [ ] By selector

## Стъпка 56: Nested Iframe Support
```typescript
async findInNestedIframe(path: number[], selector: string): Promise<Locator> {
  let frame = page;
  for (const index of path) {
    frame = frame.frameLocator(`iframe >> nth=${index}`);
  }
  return frame.locator(selector);
}
```
- [ ] Multi-level iframes
- [ ] Path tracking
- [ ] Return to main

## Стъпка 57: Unified Deep Find
```typescript
async deepFind(selector: string): Promise<DeepSearchResult> {
  // 1. Main DOM
  // 2. Shadow DOM (all levels)
  // 3. Iframes (all levels)
  // 4. Shadow inside Iframes
}
```
- [ ] Priority order
- [ ] Parallel search option
- [ ] Timeout handling

## Стъпка 58: Deep Click
```typescript
async deepClick(selector: string): Promise<void> {
  const result = await this.deepFind(selector);
  if (result.inShadow) {
    await page.evaluate((sel) => {
      // JS click in shadow
    }, result.shadowPath);
  } else {
    await result.locator.click();
  }
}
```
- [ ] Shadow click
- [ ] Iframe click
- [ ] Fallback JS click

## Стъпка 59: Deep Type
```typescript
async deepType(selector: string, text: string): Promise<void> {
  const result = await this.deepFind(selector);
  // Handle shadow/iframe context
}
```
- [ ] Shadow type
- [ ] Iframe type
- [ ] Clear before type option

## Стъпка 60: Cross-Origin Iframe Handling
```typescript
class CrossOriginHandler {
  async handleCrossOrigin(iframe: Frame): Promise<void> {
    // Strategies for cross-origin iframes
  }
}
```
- [ ] Detection
- [ ] Workarounds
- [ ] Error messages

## Стъпка 61: Shadow DOM Event Dispatch
```typescript
async dispatchEvent(selector: string, event: string): Promise<void> {
  await page.evaluate(({ sel, evt }) => {
    const el = document.querySelector(sel).shadowRoot.querySelector('...');
    el.dispatchEvent(new Event(evt));
  }, { sel: selector, evt: event });
}
```
- [ ] Custom events
- [ ] Bubbling
- [ ] Composed events

## Стъпка 62: Web Components Support
```typescript
class WebComponentHelper {
  async getProperty(selector: string, prop: string): Promise<any>;
  async setProperty(selector: string, prop: string, value: any): Promise<void>;
  async callMethod(selector: string, method: string, ...args: any[]): Promise<any>;
}
```
- [ ] Property access
- [ ] Method invocation
- [ ] Event listeners

## Стъпка 63: LitElement/Stencil Support
```typescript
class LitElementHelper {
  async waitForUpdate(selector: string): Promise<void>;
  async getState(selector: string): Promise<any>;
}
```
- [ ] Lit update cycle
- [ ] Stencil lifecycle
- [ ] React shadow support

## Стъпка 64: Shadow DOM Mutations
```typescript
class ShadowMutationObserver {
  observe(selector: string, callback: MutationCallback): void;
  disconnect(): void;
}
```
- [ ] Observe changes
- [ ] Auto-refresh cache
- [ ] Performance optimization

## Стъпка 65: Deep Search Reporting
```typescript
interface DeepSearchReport {
  totalShadowRoots: number;
  totalIframes: number;
  searchPath: string[];
  timeTaken: number;
}
```
- [ ] Search statistics
- [ ] Path visualization
- [ ] Performance metrics

---

# ═══════════════════════════════════════════════════════════════
# ФАЗА 4: NETWORK INTERCEPTION (Стъпки 66-80)
# ═══════════════════════════════════════════════════════════════

## Стъпка 66: NetworkInterceptor клас
```typescript
// Миграция от playwright-professor.js
class NetworkInterceptor {
  routes: Map<string, RouteConfig>;
  requests: InterceptedRequest[];
  responses: InterceptedResponse[];
}
```
- [ ] Route management
- [ ] Request logging
- [ ] Response logging

## Стъпка 67: Route Configuration
```typescript
interface RouteConfig {
  url: string | RegExp;
  method?: HttpMethod | '*';
  handler: RouteHandler;
}
```
- [ ] URL matching
- [ ] Method filtering
- [ ] Handler function

## Стъпка 68: Request Interception
```typescript
async intercept(config: InterceptConfig): Promise<void> {
  await page.route(config.url, async (route) => {
    const request = route.request();
    // Log, modify, or block
  });
}
```
- [ ] Request logging
- [ ] Header modification
- [ ] Body modification

## Стъпка 69: Response Stubbing
```typescript
async stub(url: string, response: StubResponse): Promise<void> {
  await page.route(url, (route) => {
    route.fulfill({
      status: response.status || 200,
      body: JSON.stringify(response.body),
      headers: response.headers
    });
  });
}
```
- [ ] JSON responses
- [ ] Status codes
- [ ] Custom headers

## Стъпка 70: Request Blocking
```typescript
async block(patterns: string[]): Promise<void> {
  for (const pattern of patterns) {
    await page.route(pattern, (route) => route.abort());
  }
}
```
- [ ] Block by URL
- [ ] Block by type (images, scripts)
- [ ] Block ads/tracking

## Стъпка 71: Request Modification
```typescript
async modifyRequest(url: string, modifier: RequestModifier): Promise<void> {
  await page.route(url, async (route) => {
    const request = route.request();
    const modifiedRequest = await modifier(request);
    await route.continue(modifiedRequest);
  });
}
```
- [ ] Add headers
- [ ] Modify body
- [ ] Change URL

## Стъпка 72: Response Modification
```typescript
async modifyResponse(url: string, modifier: ResponseModifier): Promise<void> {
  await page.route(url, async (route) => {
    const response = await route.fetch();
    const modifiedBody = await modifier(await response.json());
    await route.fulfill({ body: JSON.stringify(modifiedBody) });
  });
}
```
- [ ] Modify JSON
- [ ] Inject data
- [ ] Remove fields

## Стъпка 73: Wait for Request
```typescript
async waitForRequest(url: string | RegExp): Promise<InterceptedRequest> {
  return new Promise((resolve) => {
    page.on('request', (request) => {
      if (matches(request.url(), url)) {
        resolve(extractRequestInfo(request));
      }
    });
  });
}
```
- [ ] Wait with timeout
- [ ] Multiple requests
- [ ] Request validation

## Стъпка 74: Wait for Response
```typescript
async waitForResponse(url: string | RegExp): Promise<InterceptedResponse> {
  const response = await page.waitForResponse(url);
  return {
    status: response.status(),
    body: await response.json(),
    headers: response.headers()
  };
}
```
- [ ] Wait with timeout
- [ ] Status validation
- [ ] Body extraction

## Стъпка 75: HAR Recording
```typescript
class HARRecorder {
  async start(): Promise<void>;
  async stop(): Promise<HAR>;
  async save(path: string): Promise<void>;
}
```
- [ ] Start/stop recording
- [ ] HAR format export
- [ ] Filtering options

## Стъпка 76: API Assertions
```typescript
interface ApiAssertions {
  expectStatus(status: number): Promise<void>;
  expectBody(matcher: BodyMatcher): Promise<void>;
  expectHeader(name: string, value: string): Promise<void>;
  expectTiming(maxMs: number): Promise<void>;
}
```
- [ ] Status assertions
- [ ] Body validation
- [ ] Header checks
- [ ] Performance checks

## Стъпка 77: GraphQL Support
```typescript
class GraphQLInterceptor {
  async stubQuery(operationName: string, response: any): Promise<void>;
  async stubMutation(operationName: string, response: any): Promise<void>;
  async waitForQuery(operationName: string): Promise<GraphQLRequest>;
}
```
- [ ] Query stubbing
- [ ] Mutation stubbing
- [ ] Operation matching

## Стъпка 78: WebSocket Support
```typescript
class WebSocketInterceptor {
  async intercept(url: string): Promise<WebSocketConnection>;
  async send(message: string): Promise<void>;
  async waitForMessage(matcher: MessageMatcher): Promise<string>;
}
```
- [ ] WS connection
- [ ] Message send/receive
- [ ] Event handling

## Стъпка 79: Request Queue
```typescript
class RequestQueue {
  getAll(): InterceptedRequest[];
  filter(predicate: RequestPredicate): InterceptedRequest[];
  clear(): void;
  waitForCount(count: number): Promise<void>;
}
```
- [ ] Queue management
- [ ] Filtering
- [ ] Wait for count

## Стъпка 80: Network Reporting
```typescript
interface NetworkReport {
  totalRequests: number;
  failedRequests: number;
  stubbedRequests: number;
  blockedRequests: number;
  averageResponseTime: number;
}
```
- [ ] Statistics
- [ ] Error summary
- [ ] Performance metrics

---

# ═══════════════════════════════════════════════════════════════
# ФАЗА 5: FLUENT API (Стъпки 81-95)
# ═══════════════════════════════════════════════════════════════

## Стъпка 81: FluentChain клас
```typescript
// Cypress-style chaining
class FluentChain {
  private page: Page;
  private locator?: Locator;
  
  get(selector: string): FluentChain;
  click(): Promise<FluentChain>;
  type(text: string): Promise<FluentChain>;
  should(assertion: string, expected?: any): Promise<FluentChain>;
}
```
- [x] Basic chaining
- [x] Action methods
- [x] Assertion methods

## Стъпка 82: Chainable Actions
```typescript
interface ChainableActions {
  click(): Promise<FluentChain>;
  dblclick(): Promise<FluentChain>;
  rightclick(): Promise<FluentChain>;
  type(text: string): Promise<FluentChain>;
  clear(): Promise<FluentChain>;
  check(): Promise<FluentChain>;
  uncheck(): Promise<FluentChain>;
  select(value: string): Promise<FluentChain>;
  hover(): Promise<FluentChain>;
  focus(): Promise<FluentChain>;
  blur(): Promise<FluentChain>;
}
```
- [x] Click variants
- [x] Input actions
- [x] Focus management

## Стъпка 83: Chainable Navigation
```typescript
interface ChainableNavigation {
  first(): FluentChain;
  last(): FluentChain;
  eq(index: number): FluentChain;
  filter(selector: string): FluentChain;
  find(selector: string): FluentChain;
  parent(): FluentChain;
  children(): FluentChain;
  siblings(): FluentChain;
}
```
- [ ] Index selection
- [ ] Filtering
- [ ] DOM traversal

## Стъпка 84: Chainable Assertions
```typescript
interface ChainableAssertions {
  should(assertion: string, expected?: any): Promise<FluentChain>;
  and(assertion: string, expected?: any): Promise<FluentChain>;
}

// Supported assertions:
// 'be.visible', 'be.hidden', 'exist', 'not.exist'
// 'be.enabled', 'be.disabled', 'be.checked'
// 'have.text', 'contain.text', 'have.value'
// 'have.attr', 'have.class', 'have.count'
// 'have.length', 'have.css', 'match'
```
- [x] Basic assertions
- [ ] Advanced assertions
- [ ] Custom assertions

## Стъпка 85: Auto-Retry Logic
```typescript
class RetryableChain extends FluentChain {
  private retries: number = 3;
  private retryDelay: number = 500;
  
  async executeWithRetry<T>(action: () => Promise<T>): Promise<T> {
    for (let i = 0; i < this.retries; i++) {
      try {
        return await action();
      } catch (error) {
        if (i === this.retries - 1) throw error;
        await this.delay(this.retryDelay);
      }
    }
  }
}
```
- [ ] Configurable retries
- [ ] Exponential backoff
- [ ] Error filtering

## Стъпка 86: Command Queue
```typescript
class CommandQueue {
  private commands: Command[] = [];
  
  enqueue(command: Command): void;
  async execute(): Promise<void>;
  async executeParallel(): Promise<void>;
}
```
- [ ] Queue management
- [ ] Sequential execution
- [ ] Parallel execution

## Стъпка 87: Alias System
```typescript
interface AliasSystem {
  as(alias: string): FluentChain;
  get(alias: string): FluentChain;
}

// Usage:
mm.get('button').as('submitBtn');
mm.get('@submitBtn').click();
```
- [ ] Element aliases
- [ ] Request aliases
- [ ] Value aliases

## Стъпка 88: Custom Commands
```typescript
mm.addCommand('login', async (username: string, password: string) => {
  await mm.get('#username').type(username);
  await mm.get('#password').type(password);
  await mm.get('button[type="submit"]').click();
});

// Usage:
await mm.login('user@test.com', 'password123');
```
- [ ] Command registration
- [ ] Type safety
- [ ] Overwriting

## Стъпка 89: Yielding Values
```typescript
interface Yieldable {
  then<T>(callback: (value: T) => void): Promise<FluentChain>;
  its(property: string): FluentChain;
  invoke(method: string, ...args: any[]): FluentChain;
}

// Usage:
await mm.get('input').its('value').should('equal', 'test');
```
- [ ] Value extraction
- [ ] Property access
- [ ] Method invocation

## Стъпка 90: Conditional Commands
```typescript
interface ConditionalCommands {
  if(condition: () => Promise<boolean>): FluentChain;
  else(): FluentChain;
  endif(): FluentChain;
}
```
- [ ] Conditional execution
- [ ] Branching
- [ ] Short-circuit

## Стъпка 91: Batch Operations
```typescript
interface BatchOperations {
  each(callback: (el: FluentChain, index: number) => Promise<void>): Promise<FluentChain>;
  map<T>(callback: (el: FluentChain) => Promise<T>): Promise<T[]>;
  reduce<T>(callback: (acc: T, el: FluentChain) => Promise<T>, initial: T): Promise<T>;
}
```
- [ ] Iterate elements
- [ ] Map/reduce
- [ ] Async handling

## Стъпка 92: Debugging Helpers
```typescript
interface DebuggingHelpers {
  debug(): FluentChain;  // Pause and open devtools
  log(): FluentChain;    // Log current element
  screenshot(name?: string): Promise<FluentChain>;
  pause(ms: number): Promise<FluentChain>;
}
```
- [ ] Debug mode
- [ ] Logging
- [ ] Screenshots

## Стъпка 93: Context Preservation
```typescript
class FluentContext {
  private subject: Locator;
  private withinScope?: Locator;
  
  within(selector: string): FluentChain {
    this.withinScope = this.page.locator(selector);
    return this;
  }
}
```
- [ ] Scope preservation
- [ ] within() support
- [ ] Context reset

## Стъпка 94: Time Travel Debugging
```typescript
interface TimeTravel {
  snapshot(): string;
  restore(snapshotId: string): Promise<void>;
  getHistory(): Command[];
}
```
- [ ] Command history
- [ ] State snapshots
- [ ] Replay support

## Стъпка 95: Fluent API Documentation
```typescript
// JSDoc comments for IntelliSense
/**
 * Select an element by CSS selector
 * @param selector - CSS selector string
 * @returns FluentChain for method chaining
 * @example
 * mm.get('button.submit').click();
 */
get(selector: string): FluentChain;
```
- [ ] Full JSDoc
- [ ] Examples
- [ ] Type hints

---

# ═══════════════════════════════════════════════════════════════
# ФАЗА 6: RESILIENCE & WAITS (Стъпки 96-105)
# ═══════════════════════════════════════════════════════════════

## Стъпка 96: FluentWait клас
```typescript
class FluentWait<T> {
  private timeout: number;
  private pollingInterval: number;
  private ignoredExceptions: ErrorConstructor[];
  
  async until(condition: () => Promise<T>): Promise<T>;
}
```
- [ ] Configurable timeout
- [ ] Polling interval
- [ ] Exception handling

## Стъпка 97: Wait Conditions
```typescript
const until = {
  elementVisible: (selector: string) => async (page: Page) => {
    return await page.locator(selector).isVisible();
  },
  elementHidden: (selector: string) => async (page: Page) => {
    return !(await page.locator(selector).isVisible());
  },
  textPresent: (selector: string, text: string) => async (page: Page) => {
    return (await page.locator(selector).textContent())?.includes(text);
  },
  urlContains: (text: string) => async (page: Page) => {
    return page.url().includes(text);
  },
  // ... 20+ more conditions
};
```
- [ ] Element conditions
- [ ] Text conditions
- [ ] URL conditions
- [ ] Custom conditions

## Стъпка 98: Smart Auto-Wait
```typescript
class SmartWait {
  private static defaultTimeout = 30000;
  
  static async forElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: this.defaultTimeout });
  }
  
  static async forStable(locator: Locator): Promise<void> {
    // Wait for element to stop moving
    let lastRect = await locator.boundingBox();
    while (true) {
      await this.delay(100);
      const newRect = await locator.boundingBox();
      if (this.rectsEqual(lastRect, newRect)) break;
      lastRect = newRect;
    }
  }
}
```
- [ ] Visibility wait
- [ ] Stability wait
- [ ] Animation wait

## Стъпка 99: Network Idle Wait
```typescript
async waitForNetworkIdle(timeout = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}
```
- [ ] Network idle
- [ ] DOM content loaded
- [ ] Full load

## Стъпка 100: Retry Mechanism
```typescript
class Retry {
  static async withBackoff<T>(
    operation: () => Promise<T>,
    options: RetryOptions
  ): Promise<T> {
    const { retries, baseDelay, maxDelay, exponential } = options;
    
    for (let i = 0; i < retries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === retries - 1) throw error;
        
        const delay = exponential 
          ? Math.min(baseDelay * Math.pow(2, i), maxDelay)
          : baseDelay;
          
        await this.sleep(delay);
      }
    }
  }
}
```
- [ ] Configurable retries
- [ ] Exponential backoff
- [ ] Jitter option

## Стъпка 101: Error Classification
```typescript
enum ErrorType {
  ELEMENT_NOT_FOUND = 'element_not_found',
  ELEMENT_NOT_VISIBLE = 'element_not_visible',
  ELEMENT_NOT_INTERACTABLE = 'element_not_interactable',
  TIMEOUT = 'timeout',
  NETWORK = 'network',
  ASSERTION = 'assertion',
  UNKNOWN = 'unknown'
}

class ErrorClassifier {
  classify(error: Error): ErrorType;
  isRetryable(error: Error): boolean;
  getSuggestion(error: Error): string;
}
```
- [ ] Error types
- [ ] Retryable detection
- [ ] Fix suggestions

## Стъпка 102: Automatic Screenshot on Failure
```typescript
class FailureCapture {
  async captureOnFailure(error: Error, context: TestContext): Promise<FailureReport> {
    return {
      screenshot: await this.takeScreenshot(),
      domSnapshot: await this.captureDOM(),
      consoleLogs: await this.getConsoleLogs(),
      networkLogs: await this.getNetworkLogs(),
      timestamp: Date.now(),
      error: error.message
    };
  }
}
```
- [ ] Screenshot
- [ ] DOM snapshot
- [ ] Console logs
- [ ] Network logs

## Стъпка 103: Console Log Capture
```typescript
class ConsoleCapture {
  private logs: ConsoleMessage[] = [];
  
  start(): void {
    page.on('console', (msg) => this.logs.push({
      type: msg.type(),
      text: msg.text(),
      timestamp: Date.now()
    }));
  }
  
  getLogs(): ConsoleMessage[];
  getErrors(): ConsoleMessage[];
  clear(): void;
}
```
- [ ] All console types
- [ ] Filtering
- [ ] Export

## Стъпка 104: Performance Monitoring
```typescript
class PerformanceMonitor {
  async getMetrics(): Promise<PerformanceMetrics> {
    return await page.evaluate(() => ({
      domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      load: performance.timing.loadEventEnd - performance.timing.navigationStart,
      firstPaint: performance.getEntriesByType('paint')[0]?.startTime,
      firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime
    }));
  }
}
```
- [ ] Core web vitals
- [ ] Custom metrics
- [ ] Thresholds

## Стъпка 105: Health Check
```typescript
class HealthCheck {
  async checkBrowser(): Promise<boolean>;
  async checkPage(): Promise<boolean>;
  async checkNetwork(): Promise<boolean>;
  async selfHeal(): Promise<void>;
}
```
- [ ] Browser health
- [ ] Page responsiveness
- [ ] Auto-recovery

---

# ═══════════════════════════════════════════════════════════════
# ФАЗА 7: ENTERPRISE FEATURES (Стъпки 106-110)
# ═══════════════════════════════════════════════════════════════

## Стъпка 106: HTML Reporter
```typescript
class HTMLReporter {
  generate(results: TestResult[]): string;
  
  // Features:
  // - Summary dashboard
  // - Test timeline
  // - Screenshots gallery
  // - Video playback
  // - Error details
  // - Trends chart
}
```
- [ ] Mochawesome integration
- [ ] Custom template
- [ ] Interactive features

## Стъпка 107: Parallel Execution
```typescript
class ParallelRunner {
  workers: number;  // Use all 16 Ryzen threads
  sharding: ShardConfig;
  
  async run(tests: TestFile[]): Promise<TestResult[]> {
    const shards = this.createShards(tests, this.workers);
    return await Promise.all(
      shards.map(shard => this.runShard(shard))
    );
  }
}
```
- [ ] Worker pool
- [ ] Test sharding
- [ ] Result aggregation

## Стъпка 108: Selenium Grid Bridge
```typescript
class RemoteOrchestrator {
  async connectToGrid(url: string): Promise<void>;
  async connectToBrowserStack(config: BrowserStackConfig): Promise<void>;
  async connectToSauceLabs(config: SauceLabsConfig): Promise<void>;
  
  // Switch between local and remote with config flag
  mode: 'local' | 'grid' | 'browserstack' | 'saucelabs';
}
```
- [ ] Grid connection
- [ ] BrowserStack
- [ ] SauceLabs
- [ ] Capability management

## Стъпка 109: CLI Tool
```bash
# Commands:
mm init                    # Initialize new project
mm run                     # Run all tests
mm run --spec login.spec   # Run specific test
mm run --parallel 16       # Run with 16 workers
mm run --grid              # Run on Selenium Grid
mm report                  # Generate HTML report
mm open                    # Open interactive mode
```
- [ ] Commander setup
- [ ] All commands
- [ ] Interactive mode

## Стъпка 110: NPM Package
```json
{
  "name": "qantum-hybrid",
  "version": "1.0.0-QANTUM-PRIME",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "bin": {
    "mm": "dist/cli/index.js"
  }
}
```
- [ ] Package structure
- [ ] Version management
- [ ] Publish workflow

---

# ═══════════════════════════════════════════════════════════════
# PROGRESS TRACKER
# ═══════════════════════════════════════════════════════════════

## Фаза 0: Подготовка ████████░░ 80% (8/10)
## Фаза 1: Core Architecture ██░░░░░░░░ 20% (4/20)
## Фаза 2: Self-Healing ░░░░░░░░░░ 0% (0/20)
## Фаза 3: Deep Search ██░░░░░░░░ 20% (3/15)
## Фаза 4: Network ██░░░░░░░░ 20% (3/15)
## Фаза 5: Fluent API ████░░░░░░ 40% (6/15)
## Фаза 6: Resilience ░░░░░░░░░░ 0% (0/10)
## Фаза 7: Enterprise ░░░░░░░░░░ 0% (0/5)

**OVERALL: ██░░░░░░░░ 22% (24/110 стъпки)**

---

# СЛЕДВАЩА СТЪПКА

Да започнем с **Фаза 1: Core Architecture** - портваме готовия `BasePage` и `BaseElement` от `training-framework/architecture/pom-base.js` към TypeScript и интегрираме с Playwright?
