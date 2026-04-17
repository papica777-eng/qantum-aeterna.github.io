/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🚀 QANTUM v1.0.0.1 - PRODUCTION LAUNCHER
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * "Quantum" Edition - Production-Ready Configuration
 *
 * Features enabled by default:
 * - Stale Lock Watchdog (200ms timeout)
 * - Adaptive Batching (auto-scale at 50k+ msg/sec)
 * - Hot-Standby Pool (50 pre-warmed workers)
 *
 * Usage: npm run production:launch
 *
 * @version 1.0.0
 * @codename Quantum
 * @author Димитър Продромов (Meta-Architect)
 * @copyright 2025. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */
interface ProductionConfig {
    staleLockWatchdog: {
        enabled: boolean;
        timeout_ms: number;
        checkInterval_ms: number;
    };
    adaptiveBatching: {
        enabled: boolean;
        baseInterval_ms: number;
        maxInterval_ms: number;
        throughputThreshold: number;
    };
    hotStandby: {
        enabled: boolean;
        poolSize: number;
        warmupOnStart: boolean;
    };
    memory: {
        enableGC: boolean;
        maxHeapSize_MB: number;
    };
}
declare const PRODUCTION_CONFIG: ProductionConfig;
export { PRODUCTION_CONFIG, ProductionConfig };
//# sourceMappingURL=production-launcher.d.ts.map