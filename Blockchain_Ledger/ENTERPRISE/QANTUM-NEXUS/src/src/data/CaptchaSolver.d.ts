/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: CAPTCHA SOLVER
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Universal captcha solving with support for multiple providers:
 * - 2Captcha (reCAPTCHA v2/v3, hCaptcha, FunCaptcha, image captcha)
 * - AntiCaptcha
 * - CapMonster
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
import { Page } from 'playwright';
export type CaptchaProvider = '2captcha' | 'anticaptcha' | 'capmonster' | 'capsolver';
export type CaptchaType = 'recaptcha_v2' | 'recaptcha_v3' | 'hcaptcha' | 'funcaptcha' | 'image' | 'text' | 'turnstile';
export interface CaptchaSolverConfig {
    provider: CaptchaProvider;
    apiKey: string;
    timeout?: number;
    pollingInterval?: number;
    softId?: string;
    debug?: boolean;
}
export interface RecaptchaV2Task {
    type: 'recaptcha_v2';
    siteKey: string;
    pageUrl: string;
    isInvisible?: boolean;
    dataS?: string;
    proxyType?: string;
    proxyAddress?: string;
    proxyPort?: number;
    proxyLogin?: string;
    proxyPassword?: string;
}
export interface RecaptchaV3Task {
    type: 'recaptcha_v3';
    siteKey: string;
    pageUrl: string;
    action?: string;
    minScore?: number;
}
export interface HCaptchaTask {
    type: 'hcaptcha';
    siteKey: string;
    pageUrl: string;
    isInvisible?: boolean;
}
export interface FunCaptchaTask {
    type: 'funcaptcha';
    publicKey: string;
    pageUrl: string;
    serviceUrl?: string;
}
export interface ImageCaptchaTask {
    type: 'image';
    base64Image: string;
    phrase?: boolean;
    caseSensitive?: boolean;
    numeric?: 0 | 1 | 2;
    minLength?: number;
    maxLength?: number;
}
export interface TurnstileTask {
    type: 'turnstile';
    siteKey: string;
    pageUrl: string;
}
export type CaptchaTask = RecaptchaV2Task | RecaptchaV3Task | HCaptchaTask | FunCaptchaTask | ImageCaptchaTask | TurnstileTask;
export interface CaptchaSolution {
    taskId: string;
    solution: string;
    cost?: number;
    solveTime?: number;
    ip?: string;
}
export declare abstract class BaseCaptchaSolver extends EventEmitter {
    protected config: CaptchaSolverConfig;
    protected baseUrl: string;
    constructor(config: CaptchaSolverConfig);
    /**
     * Solve any captcha type
     */
    solve(task: CaptchaTask): Promise<CaptchaSolution>;
    /**
     * Create captcha task
     */
    protected abstract createTask(task: CaptchaTask): Promise<string>;
    /**
     * Get task result
     */
    protected abstract getResult(taskId: string): Promise<string | null>;
    /**
     * Wait for result with polling
     */
    protected waitForResult(taskId: string): Promise<string>;
    /**
     * Get balance
     */
    abstract getBalance(): Promise<number>;
    /**
     * Report incorrect captcha
     */
    abstract reportIncorrect(taskId: string): Promise<void>;
    /**
     * Sleep helper
     */
    protected sleep(ms: number): Promise<void>;
    /**
     * HTTP request helper
     */
    protected request(url: string, options?: RequestInit): Promise<any>;
    /**
     * Debug log
     */
    protected log(...args: any[]): void;
}
export declare class TwoCaptchaSolver extends BaseCaptchaSolver {
    protected baseUrl: string;
    protected createTask(task: CaptchaTask): Promise<string>;
    protected getResult(taskId: string): Promise<string | null>;
    getBalance(): Promise<number>;
    reportIncorrect(taskId: string): Promise<void>;
}
export declare class AntiCaptchaSolver extends BaseCaptchaSolver {
    protected baseUrl: string;
    protected createTask(task: CaptchaTask): Promise<string>;
    protected getResult(taskId: string): Promise<string | null>;
    getBalance(): Promise<number>;
    reportIncorrect(taskId: string): Promise<void>;
}
export declare class CapMonsterSolver extends BaseCaptchaSolver {
    protected baseUrl: string;
    protected createTask(task: CaptchaTask): Promise<string>;
    protected getResult(taskId: string): Promise<string | null>;
    getBalance(): Promise<number>;
    reportIncorrect(taskId: string): Promise<void>;
}
export declare class CaptchaSolver extends EventEmitter {
    private solver;
    private page;
    constructor(config: CaptchaSolverConfig);
    /**
     * Set page for auto-detection
     */
    setPage(page: Page): void;
    /**
     * Solve reCAPTCHA v2
     */
    solveRecaptchaV2(siteKey: string, pageUrl: string, isInvisible?: boolean): Promise<string>;
    /**
     * Solve reCAPTCHA v3
     */
    solveRecaptchaV3(siteKey: string, pageUrl: string, action?: string, minScore?: number): Promise<string>;
    /**
     * Solve hCaptcha
     */
    solveHCaptcha(siteKey: string, pageUrl: string): Promise<string>;
    /**
     * Solve FunCaptcha
     */
    solveFunCaptcha(publicKey: string, pageUrl: string, serviceUrl?: string): Promise<string>;
    /**
     * Solve Cloudflare Turnstile
     */
    solveTurnstile(siteKey: string, pageUrl: string): Promise<string>;
    /**
     * Solve image captcha
     */
    solveImage(base64Image: string, options?: Partial<ImageCaptchaTask>): Promise<string>;
    /**
     * Auto-detect and solve captcha on current page
     */
    autoSolve(): Promise<string | null>;
    /**
     * Inject solution into page
     */
    injectSolution(solution: string, type?: 'recaptcha' | 'hcaptcha' | 'turnstile'): Promise<void>;
    private detectRecaptcha;
    private isRecaptchaV3;
    private isInvisibleRecaptcha;
    private detectHCaptcha;
    private detectTurnstile;
    /**
     * Get account balance
     */
    getBalance(): Promise<number>;
    /**
     * Report incorrect solution
     */
    reportIncorrect(taskId: string): Promise<void>;
}
export declare function createCaptchaSolver(provider: CaptchaProvider, apiKey: string): CaptchaSolver;
export default CaptchaSolver;
//# sourceMappingURL=CaptchaSolver.d.ts.map