/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ENTERPRISE SECURITY SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * God Mode Security with:
 * - Input validation and sanitization (OWASP protection)
 * - Rate limiting and DDoS protection
 * - Request validation with schema enforcement
 * - Security headers (Helmet-style)
 * - CSRF/XSS protection
 * - SQL injection prevention
 * - Secure secret management
 * - Cryptographic operations
 * - Audit logging
 */
/**
 * Input Sanitizer - Prevents XSS and injection attacks
 */
export declare class InputSanitizer {
    private static readonly XSS_PATTERNS;
    private static readonly SQL_PATTERNS;
    /**
     * Sanitize input to prevent XSS attacks
     */
    static sanitizeXSS(input: string): string;
    /**
     * Detect potential SQL injection attempts
     */
    static detectSQLInjection(input: string): boolean;
    /**
     * Validate and sanitize object recursively
     */
    static sanitizeObject(obj: Record<string, unknown>): Record<string, unknown>;
}
/**
 * Schema Validator - Type-safe input validation
 */
export interface ValidationSchema {
    [key: string]: {
        type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'email' | 'url';
        required?: boolean;
        min?: number;
        max?: number;
        pattern?: RegExp;
        enum?: unknown[];
        schema?: ValidationSchema;
    };
}
export declare class SchemaValidator {
    /**
     * Validate data against schema
     */
    static validate(data: unknown, schema: ValidationSchema): {
        valid: boolean;
        errors: Record<string, string[]>;
    };
    private static checkType;
}
/**
 * Rate Limiter - Prevents abuse and DDoS attacks
 */
export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    keyGenerator?: (identifier: string) => string;
}
export declare class RateLimiter {
    private config;
    private requests;
    private cleanupInterval;
    constructor(config: RateLimitConfig);
    /**
     * Check if request is allowed
     */
    checkLimit(identifier: string): boolean;
    /**
     * Get remaining requests for identifier
     */
    getRemaining(identifier: string): number;
    private cleanup;
    destroy(): void;
}
/**
 * Security Headers - HTTP security headers
 */
export declare class SecurityHeaders {
    static getSecureHeaders(): Record<string, string>;
}
/**
 * Cryptographic Operations
 */
export declare class CryptoService {
    private static readonly ALGORITHM;
    private static readonly KEY_LENGTH;
    private static readonly IV_LENGTH;
    private static readonly AUTH_TAG_LENGTH;
    private static readonly SALT_LENGTH;
    private static readonly ITERATIONS;
    /**
     * Generate secure random string
     */
    static generateSecureToken(length?: number): string;
    /**
     * Hash password with salt (use bcrypt in production)
     */
    static hashPassword(password: string): Promise<string>;
    /**
     * Verify password
     */
    static verifyPassword(password: string, hash: string): Promise<boolean>;
    /**
     * Encrypt data
     */
    static encrypt(data: string, secret: string): string;
    /**
     * Decrypt data
     */
    static decrypt(encryptedData: string, secret: string): string;
    /**
     * Generate HMAC signature
     */
    static generateSignature(data: string, secret: string): string;
    /**
     * Verify HMAC signature
     */
    static verifySignature(data: string, signature: string, secret: string): boolean;
}
/**
 * Secret Manager - Secure secret storage (in-memory for now)
 * In production, integrate with HashiCorp Vault, AWS Secrets Manager, etc.
 */
export declare class SecretManager {
    private static secrets;
    private static encrypted;
    private static masterKey?;
    /**
     * Initialize with master key for encryption
     */
    static initialize(masterKey?: string): void;
    /**
     * Store secret
     */
    static setSecret(key: string, value: string): void;
    /**
     * Retrieve secret
     */
    static getSecret(key: string): string | undefined;
    /**
     * Delete secret
     */
    static deleteSecret(key: string): boolean;
    /**
     * Rotate secret
     */
    static rotateSecret(key: string, newValue: string): void;
}
/**
 * Audit Logger - Security event logging
 */
export declare class AuditLogger {
    static logSecurityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', details: Record<string, unknown>): void;
    static logAccessEvent(resource: string, action: string, userId?: string, result?: 'success' | 'failure'): void;
    static logDataModification(resource: string, operation: 'create' | 'update' | 'delete', userId?: string, changes?: Record<string, unknown>): void;
}
//# sourceMappingURL=enterprise-security.d.ts.map