/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🌉 NEXUS BRIDGE — The Nervous System of QANTUM Platform
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Connects: BullMQ (SaaS API) ↔ SelfHealingEngine (Mind-Engine-Core)
 *
 * Flow:
 *   1. BullMQ Job arrives (broken selector / failed test)
 *   2. NexusBridge initializes SelfHealingEngine with Playwright Page
 *   3. SelfHealingEngine runs 15+ healing strategies
 *   4. Result recorded to Prisma (HealingJob)
 *   5. LivenessToken emitted as proof of vitality
 *   6. Dashboard receives real-time update via WebSocket
 *
 * // Complexity: O(n) where n = number of healing strategies (max 15, bounded)
 *
 * @module NexusBridge
 */

import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { PrismaClient } from '@prisma/client';
import { EventEmitter } from 'events';
import * as crypto from 'crypto';
import * as path from 'path';

// ── Mind Engine Import (local monorepo path) ──────────────────────────────
// Mind-Engine-Core is co-located in the QANTUM-NEXUS workspace
// Relative path from apps/worker/src/bridge/ → Mind-Engine-Core/src/healing/
const MIND_ENGINE_PATH = path.resolve(__dirname, '../../../../Mind-Engine-Core/src/healing/SelfHealingEngine');

let SelfHealingEngine: any;
let NeuralMapper: any;

async function loadMindEngine() {
  try {
    const healingModule = await import(MIND_ENGINE_PATH);
    SelfHealingEngine = healingModule.SelfHealingEngine;
    console.log('✅ [NexusBridge] SelfHealingEngine loaded from Mind-Engine-Core');
  } catch (err) {
    console.error('❌ [NexusBridge] Failed to load SelfHealingEngine:', err);
    // Fallback: use a minimal inline healer
    SelfHealingEngine = class InlineFallbackHealer {
      private page: any;
      setPage(p: any) { this.page = p; return this; }
      async findWithHealing(selector: string) {
        if (!this.page) return null;
        try { return this.page.locator(selector); } catch { return null; }
      }
      async heal(selector: string) {
        return { success: false, originalSelector: selector, attempts: 0, timeMs: 0 };
      }
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UIHealingJob {
  domain: 'UI';
  tenantId: string;
  projectId?: string;
  testRunId?: string;
  targetUrl: string;
  originalSelector: string;
  action?: 'click' | 'fill' | 'assert' | 'navigate';
  expectedText?: string;
  ghostMode?: boolean;
}

export interface NetworkHealingJob {
  domain: 'NETWORK';
  tenantId: string;
  proxyId: string;
  targetUrl: string;
}

export interface LogicHealingJob {
  domain: 'LOGIC';
  tenantId: string;
  projectId?: string;
  filePath: string;
  error: string;
  failedCode?: string;
}

export type AnyHealingJob = UIHealingJob | NetworkHealingJob | LogicHealingJob;

export interface BridgeResult {
  success: boolean;
  domain: string;
  strategy?: string;
  artifact?: any;
  healedSelector?: string;
  attempts?: number;
  duration: number;
  livenessToken: string;
  dbRecordId: string;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// NEXUS BRIDGE CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class NexusBridge extends EventEmitter {
  private static instance: NexusBridge;
  private prisma: PrismaClient;
  private browser: Browser | null = null;
  private readonly TOKEN_SECRET: string;
  private initialized = false;

  private constructor() {
    super();
    this.prisma = new PrismaClient();
    this.TOKEN_SECRET = process.env.LIVENESS_SECRET || crypto.randomBytes(32).toString('hex');
  }

  public static getInstance(): NexusBridge {
    if (!NexusBridge.instance) {
      NexusBridge.instance = new NexusBridge();
    }
    return NexusBridge.instance;
  }

  // ─── Initialization ───────────────────────────────────────────────────────

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    await loadMindEngine();

    // Launch shared browser instance (Ghost Mode ready)
    this.browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
      ],
    });

    this.initialized = true;
    console.log('🌉 [NexusBridge] Initialized. Browser & Mind Engine ONLINE.');
    this.emit('bridge:ready');
  }

  // ─── Main Dispatch ────────────────────────────────────────────────────────

  /**
   * Process any healing job. Routes to correct domain handler.
   * // Complexity: O(1) dispatch
   */
  public async process(job: AnyHealingJob): Promise<BridgeResult> {
    const startTime = Date.now();

    // Create DB record immediately
    const dbRecord = await this.prisma.healingJob.create({
      data: {
        tenantId:   job.tenantId,
        projectId:  (job as any).projectId ?? null,
        testRunId:  (job as any).testRunId ?? null,
        domain:     job.domain,
        status:     'RUNNING',
        originalSelector: (job as UIHealingJob).originalSelector ?? null,
        targetUrl:  (job as UIHealingJob).targetUrl ?? null,
        failureError: (job as LogicHealingJob).error ?? null,
      },
    });

    try {
      let result: BridgeResult;

      switch (job.domain) {
        case 'UI':
          result = await this.handleUIHealing(job as UIHealingJob, dbRecord.id, startTime);
          break;
        case 'LOGIC':
          result = await this.handleLogicHealing(job as LogicHealingJob, dbRecord.id, startTime);
          break;
        default:
          throw new Error(`Unsupported domain: ${job.domain}`);
      }

      // ── Update DB record with result ──────────────────────────────────
      await this.prisma.healingJob.update({
        where: { id: dbRecord.id },
        data: {
          status:          result.success ? 'SUCCESS' : 'FAILED',
          strategy:        result.strategy ?? null,
          healedSelector:  result.healedSelector ?? null,
          attempts:        result.attempts ?? 0,
          livenessToken:   result.livenessToken,
          duration:        result.duration,
          artifact:        result.artifact ? JSON.stringify(result.artifact) : undefined,
          completedAt:     new Date(),
          rollbackAvailable: result.success,
        },
      });

      // ── Telemetry ─────────────────────────────────────────────────────
      await this.emitTelemetry(job.tenantId, 'HEALING_EVENT', {
        domain:   job.domain,
        success:  result.success,
        strategy: result.strategy,
        duration: result.duration,
      });

      this.emit('bridge:result', result);
      return result;

    } catch (error: any) {
      const duration = Date.now() - startTime;

      await this.prisma.healingJob.update({
        where: { id: dbRecord.id },
        data: {
          status:       'FAILED',
          failureError: error.message,
          duration,
          completedAt:  new Date(),
        },
      });

      const failResult: BridgeResult = {
        success: false,
        domain: job.domain,
        duration,
        livenessToken: this.generateLivenessToken(dbRecord.id, 'CRITICAL'),
        dbRecordId: dbRecord.id,
        error: error.message,
      };

      this.emit('bridge:error', failResult);
      return failResult;
    }
  }

  // ─── UI Healing ───────────────────────────────────────────────────────────

  /**
   * UI healing: Launch browser, navigate to URL, run 15-strategy SelfHealingEngine
   * // Complexity: O(n) where n ≤ 15 strategies
   */
  private async handleUIHealing(
    job: UIHealingJob,
    dbId: string,
    startTime: number
  ): Promise<BridgeResult> {
    if (!this.browser) throw new Error('Browser not initialized');

    let context: BrowserContext | null = null;
    let page: Page | null = null;

    try {
      // ── Ghost Mode Context ─────────────────────────────────────────────
      context = await this.browser.newContext({
        userAgent: job.ghostMode
          ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
          : undefined,
        viewport: { width: 1920, height: 1080 },
        javaScriptEnabled: true,
        // Anti-detection: hide Playwright signatures
        extraHTTPHeaders: job.ghostMode ? {
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control':   'no-cache',
        } : {},
      });

      page = await context.newPage();

      // Remove automation traces in ghost mode
      if (job.ghostMode) {
        await page.addInitScript(() => {
          Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
          (window as any).chrome = { runtime: {} };
        });
      }

      // Navigate
      await page.goto(job.targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

      // ── Init SelfHealingEngine ─────────────────────────────────────────
      const engine = new SelfHealingEngine({
        enabled:          true,
        maxAttempts:      15,
        timeout:          30000,
        learnFromSuccess: true,
        learnFromFailure: true,
      });
      engine.setPage(page);

      // ── Execute healing ────────────────────────────────────────────────
      const healResult = await engine.heal(job.originalSelector);
      const duration = Date.now() - startTime;

      return {
        success:        healResult.success,
        domain:         'UI',
        strategy:       healResult.strategyUsed,
        healedSelector: healResult.healedSelector,
        attempts:       healResult.attempts,
        artifact:       { healedSelector: healResult.healedSelector, context: healResult.context },
        duration,
        livenessToken:  this.generateLivenessToken(dbId, healResult.success ? 'HEALTHY' : 'CRITICAL'),
        dbRecordId:     dbId,
        error:          healResult.success ? undefined : `Healing failed after ${healResult.attempts} attempts`,
      };

    } finally {
      await page?.close().catch(() => {});
      await context?.close().catch(() => {});
    }
  }

  // ─── Logic Healing ────────────────────────────────────────────────────────

  /**
   * Logic healing: Analyze and patch failing code
   * // Complexity: O(n) where n = file size / average line length
   */
  private async handleLogicHealing(
    job: LogicHealingJob,
    dbId: string,
    startTime: number
  ): Promise<BridgeResult> {
    // TODO: Wire to EvolutionaryHardening from Mind-Engine-Core when available
    // For now: basic pattern-matching repair

    const duration = Date.now() - startTime;

    return {
      success: false,
      domain: 'LOGIC',
      duration,
      livenessToken: this.generateLivenessToken(dbId, 'RECOVERING'),
      dbRecordId: dbId,
      error: 'LOGIC healing: EvolutionaryHardening integration pending',
    };
  }

  // ─── Liveness Token (mirrors VortexHealingNexus) ──────────────────────────

  /**
   * Generate HMAC-SHA256 signed LivenessToken
   * // Complexity: O(1) — HMAC is constant time
   */
  public generateLivenessToken(
    moduleId: string,
    status: 'HEALTHY' | 'RECOVERING' | 'CRITICAL' = 'HEALTHY'
  ): string {
    const timestamp = Date.now();
    const payload   = `${moduleId}:${timestamp}:${status}`;
    const signature = crypto
      .createHmac('sha256', this.TOKEN_SECRET)
      .update(payload)
      .digest('hex');
    return Buffer.from(`${payload}:${signature}`).toString('base64');
  }

  // ─── Telemetry ────────────────────────────────────────────────────────────

  private async emitTelemetry(
    tenantId: string,
    type: string,
    payload: Record<string, any>
  ): Promise<void> {
    try {
      await this.prisma.telemetry.create({
        data: {
          tenantId,
          type,
          severity: payload.success === false ? 'HIGH' : 'LOW',
          payload,
          source: 'NexusBridge',
        },
      });
    } catch {
      // Silently ignore telemetry failures — never crash the healing path
    }
  }

  // ─── Graceful Shutdown ────────────────────────────────────────────────────

  public async shutdown(): Promise<void> {
    await this.browser?.close();
    await this.prisma.$disconnect();
    this.initialized = false;
    console.log('🌉 [NexusBridge] Graceful shutdown complete.');
  }
}

export default NexusBridge.getInstance();
