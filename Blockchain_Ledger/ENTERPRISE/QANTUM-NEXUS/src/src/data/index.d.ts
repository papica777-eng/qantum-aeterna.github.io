/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: DATA MODULE INDEX
 * ═══════════════════════════════════════════════════════════════════════════════
 */
export { DatabaseHandler, createDatabaseHandler, createSQLiteHandler, type DatabaseConfig, type DatabaseType, type Account, type Card, type Proxy, type Email, type TaskRecord, type DatabaseStats } from './DatabaseHandler';
export { DataProvider, AccountProvider, CardProvider, ProxyProvider, EmailProvider, BaseProvider, type DataProviderConfig, type AccountProviderOptions, type CardProviderOptions, type ProxyProviderOptions, type EmailProviderOptions } from './DataProviders';
export { MindEngine, FingerprintGenerator, type MindEngineConfig, type FingerprintConfig, type AntiDetectionConfig, type BrowserName, type SessionState } from './MindEngine';
export { CaptchaSolver, TwoCaptchaSolver, AntiCaptchaSolver, CapMonsterSolver, BaseCaptchaSolver, createCaptchaSolver, type CaptchaSolverConfig, type CaptchaProvider, type CaptchaType, type CaptchaTask, type CaptchaSolution, type RecaptchaV2Task, type RecaptchaV3Task, type HCaptchaTask, type FunCaptchaTask, type ImageCaptchaTask, type TurnstileTask } from './CaptchaSolver';
export { MainExecutor, runAutomation, PredefinedTasks, type ExecutorConfig, type AutomationTask, type TaskContext, type TaskResult, type ExecutionStats } from './MainExecutor';
//# sourceMappingURL=index.d.ts.map