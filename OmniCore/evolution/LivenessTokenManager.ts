// [PURIFIED_BY_AETERNA: 5519ca0c-a0c0-49cc-9fcd-9a01d558aad3]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 4e1e4f7c-5525-47c6-a9bc-134f0bb7772d]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: bd372e1a-6cb0-49e5-ad8d-65e12881a542]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: bd372e1a-6cb0-49e5-ad8d-65e12881a542]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 4dcd5aaa-fdfa-42f8-ad9d-5553bb392e49]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 9615b7b9-94c5-4c8b-a48a-26c84a409f7e]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 9615b7b9-94c5-4c8b-a48a-26c84a409f7e]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 6a985406-283c-412f-952d-c21ddd063ad2]
// Suggestion: Review and entrench stable logic.
/**
 * 🔐 LIVENESS TOKEN MANAGER - Shared Secret Management
 * 
 * Centralized secret management for LivenessToken cryptographic operations.
 * Ensures VortexHealingNexus and ApoptosisModule use the same secret key.
 * 
 * SECURITY FEATURES:
 * ✅ Single source of truth for TOKEN_SECRET
 * ✅ Lazy initialization with env var fallback
 * ✅ Singleton pattern prevents multiple secrets
 * ✅ Future: Support for key rotation
 * 
 * @module LivenessTokenManager
 * @critical This is essential for token verification to work correctly
 */

import * as crypto from 'crypto';

export class LivenessTokenManager {
    private static instance: LivenessTokenManager;
    private TOKEN_SECRET: string;
    private oldSecrets: Array<{ secret: string; expiresAt: number }> = [];
    private readonly GRACE_PERIOD_MS = 24 * 60 * 60 * 1000; // 24 hours
    private secretInitializedAt: number;

    private constructor() {
        // Load from environment or generate ephemeral secret
        this.TOKEN_SECRET = process.env.LIVENESS_TOKEN_SECRET || this.generateEphemeralSecret();
        this.secretInitializedAt = Date.now();

        if (!process.env.LIVENESS_TOKEN_SECRET) {
            console.warn('⚠️ [LIVENESS-TOKEN] LIVENESS_TOKEN_SECRET not set! Using ephemeral secret.');
            console.warn('⚠️ Tokens will become invalid on restart. Set LIVENESS_TOKEN_SECRET in .env for persistence.');
        } else {
            console.log('✅ [LIVENESS-TOKEN] Secret loaded from environment');
        }
    }

    public static getInstance(): LivenessTokenManager {
        if (!LivenessTokenManager.instance) {
            LivenessTokenManager.instance = new LivenessTokenManager();
        }
        return LivenessTokenManager.instance;
    }

    /**
     * Get the shared TOKEN_SECRET
     */
    public getSecret(): string {
        return this.TOKEN_SECRET;
    }

    /**
     * Generate cryptographically strong ephemeral secret
     */
    private generateEphemeralSecret(): string {
        const secret = crypto.randomBytes(32).toString('hex');
        console.log(`🔑 [LIVENESS-TOKEN] Generated ephemeral secret (length: ${secret.length})`);
        return secret;
    }

    /**
     * Get secret metadata (for debugging)
     */
    public getMetadata(): {
        isEphemeral: boolean;
        secretAge: number;
        secretLength: number;
    } {
        return {
            isEphemeral: !process.env.LIVENESS_TOKEN_SECRET,
            secretAge: Date.now() - this.secretInitializedAt,
            secretLength: this.TOKEN_SECRET.length
        };
    }

    /**
     * Future: Support for key rotation
     * 
     * This would be used to rotate the secret every 90 days as recommended.
     * For now, this is a placeholder.
     */
    public async rotateSecret(newSecret: string): Promise<void> {
        if (!newSecret || newSecret.length < 32) {
            throw new Error('New secret must be at least 32 characters long');
        }

        console.log(`🔄 [LIVENESS-TOKEN] Rotating secret. Old secret valid for ${this.GRACE_PERIOD_MS / 3600000} hours.`);

        // Store old secret for grace period
        this.oldSecrets.push({
            secret: this.TOKEN_SECRET,
            expiresAt: Date.now() + this.GRACE_PERIOD_MS
        });

        // Set new secret
        this.TOKEN_SECRET = newSecret;
        this.secretInitializedAt = Date.now();
    }

    /**
     * Get all active secrets (current + unexpired old secrets)
     */
    public getActiveSecrets(): string[] {
        const now = Date.now();

        // Clean up expired secrets
        this.oldSecrets = this.oldSecrets.filter(s => s.expiresAt > now);

        // Return current and valid old secrets
        return [this.TOKEN_SECRET, ...this.oldSecrets.map(s => s.secret)];
    }
}

// Singleton export
export default LivenessTokenManager.getInstance();
