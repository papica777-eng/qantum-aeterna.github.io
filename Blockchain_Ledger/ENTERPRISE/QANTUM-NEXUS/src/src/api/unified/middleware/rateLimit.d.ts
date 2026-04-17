/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: RATE LIMITER MIDDLEWARE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Token bucket algorithm with sliding window
 * Per-user and per-IP rate limiting
 *
 * @author Dimitar Prodromov
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import type { IncomingMessage } from 'http';
export interface RateLimitConfig {
    /** Time window in milliseconds */
    windowMs: number;
    /** Max requests per window */
    max: number;
    /** Message when rate limited */
    message?: string;
    /** Header prefix for rate limit headers */
    headerPrefix?: string;
    /** Skip rate limiting for certain conditions */
    skip?: (req: IncomingMessage) => boolean;
    /** Key generator function */
    keyGenerator?: (req: IncomingMessage) => string;
    /** Behavior when rate limit exceeded */
    onRateLimited?: (req: IncomingMessage, result: RateLimitResult) => void;
}
export interface RateLimitResult {
    allowed: boolean;
    limit: number;
    remaining: number;
    resetTime: number;
    retryAfter: number;
}
interface TokenBucket {
    tokens: number;
    lastRefill: number;
    windowStart: number;
    requestCount: number;
}
export declare class RateLimiter {
    private buckets;
    private config;
    private cleanupInterval;
    constructor(config: RateLimitConfig);
    /**
     * Check rate limit for request
     */
    check(req: IncomingMessage, customLimit?: number): RateLimitResult;
    /**
     * Get rate limit headers
     */
    getHeaders(result: RateLimitResult): Record<string, string>;
    /**
     * Reset rate limit for key
     */
    reset(key: string): void;
    /**
     * Get current status for key
     */
    getStatus(key: string): TokenBucket | undefined;
    /**
     * Stop cleanup interval
     */
    destroy(): void;
    /**
     * Default key generator using IP
     */
    private defaultKeyGenerator;
    /**
     * Get client IP from request
     */
    private getClientIP;
    /**
     * Cleanup expired buckets
     */
    private cleanup;
}
export declare class SlidingWindowRateLimiter {
    private windows;
    private config;
    private cleanupInterval;
    constructor(config: RateLimitConfig);
    /**
     * Check rate limit using sliding window
     */
    check(req: IncomingMessage, customLimit?: number): RateLimitResult;
    /**
     * Get rate limit headers
     */
    getHeaders(result: RateLimitResult): Record<string, string>;
    reset(key: string): void;
    destroy(): void;
    private defaultKeyGenerator;
    private cleanup;
}
export interface TieredRateLimitConfig {
    windowMs: number;
    tiers: {
        anonymous: number;
        free: number;
        pro: number;
        enterprise: number;
    };
    headerPrefix?: string;
}
export declare class TieredRateLimiter {
    private limiter;
    private tiers;
    constructor(config: TieredRateLimitConfig);
    /**
     * Check rate limit for specific tier
     */
    check(req: IncomingMessage, tier: keyof TieredRateLimitConfig['tiers']): RateLimitResult;
    getHeaders(result: RateLimitResult): Record<string, string>;
    destroy(): void;
}
export declare function createRateLimiter(config: RateLimitConfig): RateLimiter;
export declare function createSlidingWindowRateLimiter(config: RateLimitConfig): SlidingWindowRateLimiter;
export declare function createTieredRateLimiter(config: TieredRateLimitConfig): TieredRateLimiter;
export default RateLimiter;
//# sourceMappingURL=rateLimit.d.ts.map