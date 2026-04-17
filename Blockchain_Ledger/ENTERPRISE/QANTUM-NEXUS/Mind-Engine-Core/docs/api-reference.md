# QAntum API Reference

> version: 1.0.2
> Generated: 2025-12-30T19:24:17.991Z

## legacy-adapter

**File:** `src\adapters\legacy-adapter.ts`

**Exports:**
- `SeleniumAdapter`
- `CypressAdapter`
- `Builder`
- `By`
- `until`

---

## SeleniumAdapter

**File:** `src\adapters\SeleniumAdapter.ts`

**Exports:**
- `By`
- `Key`
- `WebElement`
- `until`
- `Alert`
- `Actions`
- `TargetLocator`
- `Options`
- `Timeouts`
- `WindowOptions`
- `Navigation`
- `WebDriverOptions`
- `WebDriver`
- `Builder`

---

## AIIntegration

**File:** `src\ai\AIIntegration.ts`

**Exports:**
- `ElementFeatures`
- `SelectorPrediction`
- `AnomalyResult`
- `PredictionResult`
- `TrainingData`
- `SmartSelectorAI`
- `AnomalyDetector`
- `PredictiveHealing`
- `MLModelTrainer`
- `createSmartSelectorAI`
- `createAnomalyDetector`
- `createPredictiveHealing`
- `createMLTrainer`

---

## APIServer

**File:** `src\api\APIServer.ts`

**Exports:**
- `APIServerConfig`
- `Request`
- `Response`
- `RouteHandler`
- `Middleware`
- `APIServer`
- `MindEngineAPI`
- `createAPI`

---

## index

**File:** `src\api\unified\index.ts`

**Exports:**
- `quickStart`

---

## auth

**File:** `src\api\unified\middleware\auth.ts`

**Exports:**
- `AuthStrategy`
- `AuthConfig`
- `ApiKeyInfo`
- `UserInfo`
- `AuthResult`
- `AuthenticatedUser`
- `JWTPayload`
- `AuthMiddleware`
- `createApiKey`
- `createUser`
- `createJWT`

---

## errorHandler

**File:** `src\api\unified\middleware\errorHandler.ts`

**Exports:**
- `AppError`
- `BadRequestError`
- `UnauthorizedError`
- `ForbiddenError`
- `NotFoundError`
- `ConflictError`
- `TooManyRequestsError`
- `InternalServerError`
- `ServiceUnavailableError`
- `ErrorResponse`
- `ErrorHandlerConfig`
- `ErrorHandler`
- `asyncHandler`
- `createErrorHandler`

---

## logging

**File:** `src\api\unified\middleware\logging.ts`

**Exports:**
- `RequestLogConfig`
- `RequestLog`
- `ResponseLog`
- `RequestLogger`
- `ResponseTimeTracker`
- `createRequestLogger`
- `createResponseTimeTracker`

---

## rateLimit

**File:** `src\api\unified\middleware\rateLimit.ts`

**Exports:**
- `RateLimitConfig`
- `RateLimitResult`
- `RateLimiter`
- `SlidingWindowRateLimiter`
- `TieredRateLimitConfig`
- `TieredRateLimiter`
- `createRateLimiter`
- `createSlidingWindowRateLimiter`
- `createTieredRateLimiter`

---

## server

**File:** `src\api\unified\server.ts`

**Exports:**
- `ServerConfig`
- `CorsConfig`
- `Request`
- `Response`
- `RouteHandler`
- `Middleware`
- `UnifiedServer`
- `createServer`

---

## logger

**File:** `src\api\unified\utils\logger.ts`

**Exports:**
- `LogLevel`
- `LogEntry`
- `LoggerConfig`
- `Logger`
- `getLogger`
- `createLogger`
- `logger`

---

## validation

**File:** `src\api\unified\utils\validation.ts`

**Exports:**
- `ValidationResult`
- `ValidationError`
- `Schema`
- `SchemaInfer`
- `ValidationException`
- `CommonSchemas`
- `RequestSchemas`
- `v`

---

## BehaviorAnalysis

**File:** `src\behavior\BehaviorAnalysis.ts`

**Exports:**
- `UserAction`
- `FlowStep`
- `ElementInfo`
- `FlowAnalysis`
- `FlowPattern`
- `HeatmapData`
- `AttentionZone`
- `SessionRecording`
- `RecordedAction`
- `UserFlowAnalyzer`
- `HeatmapGenerator`
- `SessionRecorder`
- `BehaviorReporter`
- `createFlowAnalyzer`
- `createHeatmapGenerator`
- `createSessionRecorder`
- `createBehaviorReporter`

---

## BrowserOrchestrator

**File:** `src\browser\BrowserOrchestrator.ts`

**Exports:**
- `BrowserType`
- `BrowserConfig`
- `BrowserInstance`
- `PoolConfig`
- `OrchestratorConfig`
- `BrowserPool`
- `BrowserOrchestrator`
- `BrowserMatrix`
- `MatrixConfig`
- `MatrixContext`
- `MatrixResult`
- `createOrchestrator`
- `createPool`

---

## CIIntegration

**File:** `src\ci\CIIntegration.ts`

**Exports:**
- `CIProvider`
- `CIConfig`
- `PipelineStep`
- `CIDetector`
- `GitHubActionsGenerator`
- `GitLabCIGenerator`
- `JenkinsfileGenerator`
- `AzurePipelinesGenerator`
- `CIConfigManager`
- `CIReporter`

---

## CLI

**File:** `src\cli\CLI.ts`

**Exports:**
- `CLIOptions`
- `Command`
- `CLIEngine`
- `runCommand`
- `initCommand`
- `reportCommand`
- `ciCommand`
- `showCommand`
- `debugCommand`
- `createCLI`

---

## InteractiveMode

**File:** `src\cli\InteractiveMode.ts`

**Exports:**
- `InteractiveCommand`
- `InteractiveContext`
- `InteractiveConfig`
- `InteractiveMode`
- `createInteractiveMode`

---

## auto-test-factory

**File:** `src\cognitive\auto-test-factory.ts`

**Exports:**
- `AutoTestFactory`
- `TestDataFactory`
- `test`
- `API_BASE`
- `createTestFactory`

---

## autonomous-explorer

**File:** `src\cognitive\autonomous-explorer.ts`

**Exports:**
- `AutonomousExplorer`
- `createExplorer`

---

## index

**File:** `src\cognitive\index.ts`

**Exports:**
- `CognitiveOrchestrator`
- `createCognitiveOrchestrator`

---

## neural-map-engine

**File:** `src\cognitive\neural-map-engine.ts`

**Exports:**
- `NeuralMapEngine`
- `createNeuralMap`

---

## self-healing-v2

**File:** `src\cognitive\self-healing-v2.ts`

**Exports:**
- `SelfHealingV2`
- `createSelfHealing`

---

## branding

**File:** `src\core\branding.ts`

**Exports:**
- `QANTUM_IDENTITY`
- `AUTHOR_LOGO`
- `AUTHOR_LOGO_MINIMAL`
- `AUTHOR_LOGO_INLINE`
- `QANTUM_LOGO`
- `QANTUM_LOGO_COMPACT`
- `QANTUM_BANNER`
- `QANTUM_FOOTER`
- `printBanner`
- `printHeader`
- `printFooter`
- `getVersionString`
- `getCopyright`
- `COLORS`
- `styled`

---

## deep-search

**File:** `src\core\deep-search.ts`

**Exports:**
- `DeepSearchResult`
- `DeepSearchEngine`
- `deepSearch`

---

## fluent-chain

**File:** `src\core\fluent-chain.ts`

**Exports:**
- `FluentChain`

---

## network-interceptor

**File:** `src\core\network-interceptor.ts`

**Exports:**
- `InterceptedRequest`
- `NetworkInterceptor`
- `networkInterceptor`

---

## neural-mapper

**File:** `src\core\neural-mapper.ts`

**Exports:**
- `NeuralMapper`

---

## qantum

**File:** `src\core\qantum.ts`

**Exports:**
- `QAntum`
- `createQA`
- `createMM`

---

## self-healing

**File:** `src\core\self-healing.ts`

**Exports:**
- `HealingResult`
- `SelfHealingEngine`
- `selfHealer`

---

## CaptchaSolver

**File:** `src\data\CaptchaSolver.ts`

**Exports:**
- `CaptchaProvider`
- `CaptchaType`
- `CaptchaSolverConfig`
- `RecaptchaV2Task`
- `RecaptchaV3Task`
- `HCaptchaTask`
- `FunCaptchaTask`
- `ImageCaptchaTask`
- `TurnstileTask`
- `CaptchaTask`
- `CaptchaSolution`
- `TwoCaptchaSolver`
- `AntiCaptchaSolver`
- `CapMonsterSolver`
- `CaptchaSolver`
- `createCaptchaSolver`

---

## DatabaseHandler

**File:** `src\data\DatabaseHandler.ts`

**Exports:**
- `DatabaseType`
- `DatabaseConfig`
- `Account`
- `Card`
- `Proxy`
- `Email`
- `TaskRecord`
- `DatabaseStats`
- `DatabaseHandler`
- `createDatabaseHandler`
- `createSQLiteHandler`

---

## DataProviders

**File:** `src\data\DataProviders.ts`

**Exports:**
- `AccountProviderOptions`
- `AccountProvider`
- `CardProviderOptions`
- `CardProvider`
- `ProxyProviderOptions`
- `ProxyProvider`
- `EmailProviderOptions`
- `EmailProvider`
- `DataProviderConfig`
- `DataProvider`

---

## MainExecutor

**File:** `src\data\MainExecutor.ts`

**Exports:**
- `AutomationTask`
- `TaskContext`
- `TaskResult`
- `ExecutorConfig`
- `ExecutionStats`
- `MainExecutor`
- `PredefinedTasks`

---

## MindEngine

**File:** `src\data\MindEngine.ts`

**Exports:**
- `BrowserName`
- `FingerprintConfig`
- `AntiDetectionConfig`
- `MindEngineConfig`
- `SessionState`
- `FingerprintGenerator`
- `MindEngine`

---

## ErrorHandler

**File:** `src\error\ErrorHandler.ts`

**Exports:**
- `ErrorCategory`
- `ErrorSeverity`
- `ClassifiedError`
- `RecoveryAction`
- `RetryConfig`
- `DeadLetterItem`
- `ErrorClassifier`
- `RetryManager`
- `RecoveryContext`
- `RecoveryStrategies`
- `DeadLetterQueue`
- `CircuitState`
- `CircuitBreaker`
- `ErrorHandler`

---

## FluentChain

**File:** `src\fluent\FluentChain.ts`

**Exports:**
- `ChainCallback`
- `ShouldCallback`
- `ChainOptions`
- `FluentChain`

---

## FormAutomation

**File:** `src\forms\FormAutomation.ts`

**Exports:**
- `FormField`
- `ValidationRule`
- `FormData`
- `FillResult`
- `FieldError`
- `FormStep`
- `SmartFormFiller`
- `FormValidator`
- `MultiStepFormHandler`
- `FormDataGenerator`
- `FormTemplateBuilder`
- `FormTemplate`
- `FORM_TEMPLATES`
- `createSmartFormFiller`
- `createFormValidator`
- `createMultiStepHandler`
- `createDataGenerator`
- `createTemplateBuilder`

---

