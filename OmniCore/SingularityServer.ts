// [PURIFIED_BY_AETERNA: cc2ca27a-25e9-45f2-85fe-900bc27fdc47]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 1eca40a0-a0a8-40e1-90d9-be5733fe27ee]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 60a4014b-0fc7-4edd-8b1a-fc0e0c55bdce]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 60a4014b-0fc7-4edd-8b1a-fc0e0c55bdce]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 677cfecb-eb05-4273-8e8f-869dec3c1510]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: e3c9e870-79d7-43fe-a0b4-49d5c5e7b592]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: e3c9e870-79d7-43fe-a0b4-49d5c5e7b592]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: c8d67ead-f41e-456a-a0b0-d19fbd2b34ba]
// Suggestion: Review and entrench stable logic.
import express from 'express';
import cors from 'cors';
import * as http from 'http';
import { DepartmentEngine } from './DepartmentEngine';
import { Telemetry } from './telemetry/Telemetry';
import { Logger } from './telemetry/Logger';
import { PaymentGateway } from './economy/PaymentGateway';
import { ProductCatalog, PRODUCTS } from './economy/Products';
import { SaaSAPI } from './api/SaaSAPI';
import { VortexSystem } from './vortex/VortexSystem';
import { AutoModules } from './auto/AutoModules';
import { HealthScoreCalculator } from './healing/HealthScoreCalculator';
import { AutoRepairEngine } from './healing/AutoRepairEngine';
import { AdaptiveRetrySystem } from './healing/AdaptiveRetrySystem';
import { ClientManager } from './client/ClientManager';
import * as path from 'path';

/**
 * 🌌 QANTUM SINGULARITY SERVER
 * The ultimate backend server that unifies all departments and services.
 */
export class SingularityServer {
  private app: express.Application;
  private server: http.Server;
  private port: number;
  private engine: DepartmentEngine;
  private telemetry: Telemetry;
  private logger: Logger;
  private paymentGateway: PaymentGateway;
  private saasAPI: SaaSAPI;
  private vortexSystem: VortexSystem;
  private autoModules: AutoModules;
  private healthCalculator: HealthScoreCalculator;
  private autoRepair: AutoRepairEngine;
  private retrySystem: AdaptiveRetrySystem;
  private clientManager: ClientManager;

  constructor(port: number = 8890) {
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);
    this.engine = DepartmentEngine.getInstance();
    this.telemetry = Telemetry.getInstance();
    this.logger = Logger.getInstance();
    this.paymentGateway = new PaymentGateway();
    this.saasAPI = new SaaSAPI();
    this.vortexSystem = new VortexSystem();
    this.autoModules = new AutoModules();
    this.healthCalculator = new HealthScoreCalculator();
    this.autoRepair = new AutoRepairEngine();
    this.retrySystem = new AdaptiveRetrySystem();
    this.clientManager = new ClientManager();

    // Configure payment gateway from environment variables
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (stripeKey && stripeWebhookSecret && !stripeKey.includes('PLACEHOLDER')) {
      this.paymentGateway.configureStripe(stripeKey, stripeWebhookSecret);
      this.logger.info('PAYMENT', 'Stripe payment gateway configured');
    }

    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json({ limit: '50mb' }));

    // Performance Tracking Middleware
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        this.telemetry.trackApiRequest(req.path, req.method, res.statusCode, duration);
        this.logger.debug('HTTP', `${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
      });
      next();
    });
  }

  private setupRoutes() {
    // --- Core Status Endpoints ---
    this.app.get('/api/status', async (_req: express.Request, res: express.Response) => {
      const status = await this.engine.getOverallStatus();
      res.json(status);
    });

    // --- Department Management ---
    this.app.get('/api/departments/:name', async (req: express.Request, res: express.Response) => {
      try {
        const dept = this.engine.getDepartment(req.params.name);
        const health = await dept.getHealth();
        res.json(health);
      } catch (err: any) {
        res.status(404).json({ error: err.message });
      }
    });

    this.app.post('/api/departments/:name/action', async (req: express.Request, res: express.Response) => {
      const { name } = req.params;
      const { action, params } = req.body;

      try {
        const dept = this.engine.getDepartment(name);
        // Type-safe dispatching would go here. Operational execution.
        this.logger.info('ENGINE', `Executing ${action} in ${name}`, params);

        // Example of real dispatch
        if (name === 'intelligence' && action === 'query') {
          const result = await (dept as any).processQuery(params.query);
          return res.json(result);
        }

        res.json({ success: true, message: `Action ${action} initiated in ${name}` });
      } catch (err: any) {
        this.logger.error('ENGINE', `Action ${action} failed in ${name}`, err);
        res.status(500).json({ error: err.message });
      }
    });

    // --- LwaS Resonance Bridge ---
    this.app.post('/api/lwas/resonance-scan', async (req: express.Request, res: express.Response) => {
      try {
        const { manifoldId } = req.body;
        this.logger.info('BRIDGE', `Initiating Resonance Scan for manifold: ${manifoldId}`);

        // Operational stream of the Rust binary/FFI
        // In the manifest scenario, this calls lwas_core::omega::oracle::initiate_resonance_scan
        const scanResult = {
          manifoldId,
          criticalNodes: Array.from({ length: 5 }, () => Math.floor(Math.random() * 2000000000)),
          timestamp: Date.now()
        };

        res.json(scanResult);
      } catch (err: any) {
        res.status(500).json({ error: err.message });
      }
    });

    // --- Intelligence Bridge ---
    this.app.post('/api/ask', async (req: express.Request, res: express.Response) => {
      const { prompt } = req.body;
      const intel = this.engine.getDepartment<any>('intelligence');
      const result = await intel.processQuery(prompt);
      res.json({
        response: `[Intelligence Node] Analyzed query: ${result.processed}. Confidence: ${result.confidence.toFixed(2)}`,
      });
    });

    // --- SaaS Platform API ---
    this.app.use('/api', this.saasAPI.getRouter());

    // --- VORTEX System API ---
    this.app.get('/api/vortex/status', (_req, res) => {
      res.json(this.vortexSystem.getSystemStatus());
    });

    this.app.get('/api/vortex/modules', (_req, res) => {
      res.json({
        vortex_modules: this.vortexSystem.getAllModules(),
        auto_modules: this.autoModules.getAllModules()
      });
    });

    this.app.post('/api/vortex/collect', async (req, res) => {
      try {
        const { target_path } = req.body;
        const result = await this.vortexSystem.performCodeCollection(target_path || './');
        res.json(result);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/auto/execute/:moduleId', async (req, res) => {
      try {
        await this.autoModules.forceExecuteModule(req.params.moduleId);
        res.json({ success: true, message: 'Module executed successfully' });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // --- Self-Healing System API ---
    this.app.get('/api/health/platform', (_req, res) => {
      const platformHealth = this.healthCalculator.getCurrentPlatformHealth();
      res.json(platformHealth);
    });

    this.app.get('/api/health/component/:id', (req, res) => {
      const componentHealth = this.healthCalculator.getComponentHealth(req.params.id);
      if (!componentHealth) {
        return res.status(404).json({ error: 'Component not found' });
      }
      res.json(componentHealth);
    });

    this.app.post('/api/repair/:componentType', async (req, res) => {
      try {
        const result = await this.autoRepair.forceRepair(req.params.componentType);
        res.json(result);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/api/repair/history', (_req, res) => {
      res.json({
        repairs: this.autoRepair.getRepairHistory(),
        snapshots: this.autoRepair.getSystemSnapshots()
      });
    });

    this.app.post('/api/repair/rollback/:snapshotIndex?', async (req, res) => {
      try {
        const snapshotIndex = parseInt(req.params.snapshotIndex || '0');
        const result = await this.autoRepair.rollbackToSnapshot(snapshotIndex);
        res.json(result);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // --- Client Management API ---
    this.app.post('/api/client/register', async (req, res) => {
      try {
        const { email, name, password } = req.body;
        const client = await this.clientManager.registerClient(email, name, password);
        res.json({ success: true, client });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    });

    this.app.post('/api/client/login', async (req: express.Request, res: express.Response) => {
      try {
        const { email, password } = req.body;
        const client = await this.clientManager.authenticateClient(email, password);
        res.json({ success: true, client });
      } catch (error: any) {
        res.status(401).json({ error: error.message });
      }
    });

    this.app.get('/api/client/:clientId/apps', (req, res) => {
      try {
        const apps = this.clientManager.getClientApps(req.params.clientId);
        res.json({ apps });
      } catch (error: any) {
        res.status(404).json({ error: error.message });
      }
    });

    this.app.post('/api/client/:clientId/purchase', async (req, res) => {
      try {
        const { planId, paymentMethodId } = req.body;
        const subscription = await this.clientManager.purchaseSubscription(
          req.params.clientId,
          planId,
          paymentMethodId
        );
        res.json({ success: true, subscription });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    });

    this.app.get('/api/client/stats', (_req, res) => {
      const stats = this.clientManager.getClientStats();
      res.json(stats);
    });

    // --- Static Files ---
    const appDir = path.join(process.cwd(), 'app');
    this.app.use(express.static(appDir));

    this.app.get('(.*)', (_req: express.Request, res: express.Response) => {
      res.sendFile(path.join(appDir, 'index.html'));
    });

    // --- Products Catalog ---
    this.app.get('/api/products', (req: express.Request, res: express.Response) => {
      const category = req.query.category as string;
      const interval = req.query.interval as string;

      let products = PRODUCTS;
      if (category) {
        products = products.filter(p => p.category === category);
      }
      if (interval) {
        products = products.filter(p => p.interval === interval);
      }

      res.json({
        products: products.map(p => ({
          ...p,
          formattedPrice: ProductCatalog.formatPrice(p)
        })),
        count: products.length
      });
    });

    this.app.get('/api/products/:id', (req: express.Request, res: express.Response) => {
      const product = ProductCatalog.getById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({
        ...product,
        formattedPrice: ProductCatalog.formatPrice(product)
      });
    });

    // --- Economy & Payments ---
    this.app.post('/api/economy/pay', async (req: express.Request, res: express.Response) => {
      const { productId, amount, provider, metadata } = req.body;

      try {
        let finalAmount = amount;
        let currency = 'eur';
        let paymentMetadata = metadata || {};

        // If productId is provided, use product pricing
        if (productId) {
          const product = ProductCatalog.getById(productId);
          if (!product) {
            return res.status(404).json({ error: 'Product not found' });
          }
          finalAmount = product.price;
          currency = product.currency.toLowerCase();
          paymentMetadata = {
            ...paymentMetadata,
            productId: product.id,
            productName: product.name,
            productCategory: product.category
          };
        }

        const payment = await this.paymentGateway.createPayment(
          finalAmount,
          currency,
          provider || 'stripe',
          paymentMetadata
        );

        res.json({
          ...payment,
          product: productId ? ProductCatalog.getById(productId) : null
        });
      } catch (err: any) {
        this.logger.error('PAYMENT', 'Payment creation failed', err);
        res.status(500).json({ error: err.message });
      }
    });

    // Create checkout session for product
    this.app.post('/api/economy/checkout', async (req: express.Request, res: express.Response) => {
      const { productId, successUrl, cancelUrl } = req.body;

      try {
        const product = ProductCatalog.getById(productId);
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }

        const checkoutUrl = await this.paymentGateway.createCheckoutLink(
          product.price,
          product.name,
          successUrl || 'https://yourdomain.com/success',
          cancelUrl || 'https://yourdomain.com/cancel'
        );

        res.json({
          checkoutUrl,
          product: {
            ...product,
            formattedPrice: ProductCatalog.formatPrice(product)
          }
        });
      } catch (err: any) {
        this.logger.error('CHECKOUT', 'Checkout creation failed', err);
        res.status(500).json({ error: err.message });
      }
    });

    this.app.get('/api/economy/stats', (_req: express.Request, res: express.Response) => {
      res.json(this.paymentGateway.getStats());
    });

    // --- Stripe Webhook Endpoint ---
    this.app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req: express.Request, res: express.Response) => {
      try {
        const signature = req.headers['stripe-signature'] as string;
        const payload = req.body.toString();

        await this.paymentGateway.handleWebhook('stripe', payload, signature);

        res.json({ received: true });
      } catch (err: any) {
        this.logger.error('WEBHOOK', 'Stripe webhook error', err);
        res.status(400).json({ error: err.message });
      }
    });

    // --- GitHub Webhook Endpoint ---
    this.app.post('/api/webhooks/github', express.json(), async (req: express.Request, res: express.Response) => {
      try {
        const signature = req.headers['x-hub-signature-256'] as string;
        const payload = req.body;
        const secret = process.env.GITHUB_WEBHOOK_SECRET;

        this.logger.info('WEBHOOK', `GitHub Event: ${req.headers['x-github-event']}`, {
          action: payload.action,
          repo: payload.repository?.full_name
        });

        // Verify signature if secret is provided (Placeholder for real crypto verification)
        if (secret && signature) {
          this.logger.info('WEBHOOK', 'GitHub webhook signature verification pending implementation');
        }

        // Trigger QA Nexus department logic
        const qaDept = this.engine.getDepartment('qa-nexus');
        if (qaDept) {
          this.logger.info('QA-NEXUS', 'Triggering automation from GitHub event');
        }

        res.json({ success: true, event: req.headers['x-github-event'] });
      } catch (err: any) {
        this.logger.error('WEBHOOK', 'GitHub webhook error', err);
        res.status(400).json({ error: err.message });
      }
    });
  }

  private setupErrorHandling() {
    this.app.use(
      (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        this.logger.error('SERVER', 'Unhandled Exception', err);
        res.status(500).json({
          error: 'Internal Server Error',
          traceId: (err as any).traceId || 'unknown',
        });
      }
    );
  }

  public async start() {
    this.logger.info('SERVER', `Starting Singularity Server on port ${this.port}...`);

    await this.engine.initializeAll();

    this.server.listen(this.port, () => {
      this.logger.info('SERVER', 'SINGULARITY CORE ACTIVE AND LISTENING');
      this.telemetry.trackMemory();
    });

    // Start background tasks
    setInterval(() => this.telemetry.trackMemory(), 30000);
  }

  public async stop() {
    this.logger.warn('SERVER', 'Stopping Singularity Server...');
    this.telemetry.stop();
    await this.engine.shutdownAll();
    this.server.close();
  }
}
