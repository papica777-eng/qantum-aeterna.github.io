/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: AUTHENTICATION MIDDLEWARE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Multi-strategy authentication: API Key, JWT, Basic Auth
 * Rate limiting per authentication level
 *
 * @author Dimitar Prodromov
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import type { IncomingMessage } from 'http';
export type AuthStrategy = 'none' | 'apikey' | 'jwt' | 'basic' | 'bearer';
export interface AuthConfig {
    strategy: AuthStrategy;
    apiKeys?: Map<string, ApiKeyInfo>;
    jwtSecret?: string;
    jwtIssuer?: string;
    jwtAudience?: string;
    users?: Map<string, UserInfo>;
    publicPaths?: string[];
    rateLimits?: {
        anonymous: number;
        authenticated: number;
        premium: number;
    };
}
export interface ApiKeyInfo {
    key: string;
    name: string;
    tier: 'free' | 'pro' | 'enterprise';
    rateLimit: number;
    permissions: string[];
    createdAt: Date;
    expiresAt?: Date;
}
export interface UserInfo {
    username: string;
    passwordHash: string;
    tier: 'free' | 'pro' | 'enterprise';
    permissions: string[];
}
export interface AuthResult {
    success: boolean;
    error?: string;
    errorCode?: string;
    user?: AuthenticatedUser;
}
export interface AuthenticatedUser {
    id: string;
    type: 'apikey' | 'jwt' | 'basic';
    name: string;
    tier: 'free' | 'pro' | 'enterprise' | 'anonymous';
    permissions: string[];
    rateLimit: number;
}
export interface JWTPayload {
    sub: string;
    name: string;
    tier: string;
    permissions: string[];
    iat: number;
    exp: number;
    iss?: string;
    aud?: string;
}
declare class JWTUtil {
    /**
     * Decode JWT without verification (for debugging)
     */
    static decode(token: string): JWTPayload | null;
    /**
     * Verify JWT signature using HMAC-SHA256
     */
    static verify(token: string, secret: string): JWTPayload | null;
    /**
     * Create JWT token
     */
    static create(payload: Omit<JWTPayload, 'iat'>, secret: string, expiresIn?: number): string;
}
declare class PasswordUtil {
    /**
     * Hash password with salt using PBKDF2
     */
    static hash(password: string, salt?: string): string;
    /**
     * Verify password against hash
     */
    static verify(password: string, storedHash: string): boolean;
}
export declare class AuthMiddleware {
    private config;
    private defaultRateLimits;
    constructor(config: AuthConfig);
    /**
     * Authenticate request
     */
    authenticate(req: IncomingMessage, path: string): AuthResult;
    /**
     * Authenticate using API Key
     */
    private authenticateApiKey;
    /**
     * Authenticate using JWT
     */
    private authenticateJWT;
    /**
     * Authenticate using Basic Auth
     */
    private authenticateBasic;
    /**
     * Check if path is public
     */
    private isPublicPath;
    /**
     * Create anonymous user
     */
    private createAnonymousUser;
    /**
     * Get rate limit for tier
     */
    private getRateLimitForTier;
    /**
     * Check if user has permission
     */
    hasPermission(user: AuthenticatedUser, permission: string): boolean;
}
/**
 * Create API key
 */
export declare function createApiKey(name: string, tier?: 'free' | 'pro' | 'enterprise', permissions?: string[], expiresInDays?: number): ApiKeyInfo;
/**
 * Create user
 */
export declare function createUser(username: string, password: string, tier?: 'free' | 'pro' | 'enterprise', permissions?: string[]): UserInfo;
/**
 * Create JWT token
 */
export declare function createJWT(secret: string, payload: {
    sub: string;
    name: string;
    tier?: string;
    permissions?: string[];
}, expiresIn?: number): string;
export { JWTUtil, PasswordUtil };
export default AuthMiddleware;
//# sourceMappingURL=auth.d.ts.map