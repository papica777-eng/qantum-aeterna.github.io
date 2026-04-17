/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CRYPTO-RUST TYPESCRIPT FALLBACK
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Pure TypeScript implementation of crypto operations.
 * Used when Rust binary is not available (missing build tools, cross-platform).
 *
 * Performance: ~10-20x slower than Rust, but fully functional.
 * Security: Uses Node.js crypto module (OpenSSL-backed).
 *
 * This fallback ensures the system works even without:
 * - Rust toolchain
 * - C++ Build Tools / MSVC linker
 * - Platform-specific binaries
 */
/**
 * Encrypt data using AES-256-GCM
 * Equivalent to Rust: aes_gcm::encrypt
 *
 * @param data - Plaintext data to encrypt
 * @param secret - Encryption key/password
 * @returns Encrypted data as hex string (iv:authTag:ciphertext)
 */
export declare function encrypt(data: string, secret: string): string;
/**
 * Decrypt data using AES-256-GCM
 * Equivalent to Rust: aes_gcm::decrypt
 *
 * @param encryptedData - Encrypted data (iv:authTag:ciphertext)
 * @param secret - Decryption key/password
 * @returns Decrypted plaintext string
 */
export declare function decrypt(encryptedData: string, secret: string): string;
/**
 * Calculate BLAKE3 hash
 * Note: Node.js doesn't have native BLAKE3, using SHA3-256 as secure alternative
 * When Rust is available, true BLAKE3 will be used (faster)
 *
 * @param data - Data to hash
 * @returns Hash as hex string
 */
export declare function blake3_hash(data: string): string;
/**
 * Hash password using Argon2-like method
 * Uses PBKDF2 with high iterations as secure fallback
 * When Rust is available, true Argon2id will be used
 *
 * @param password - Password to hash
 * @returns Hashed password (salt:hash)
 */
export declare function hash_password(password: string): Promise<string>;
/**
 * Verify password against hash
 *
 * @param password - Password to verify
 * @param hash - Stored hash (salt:hash)
 * @returns true if password matches
 */
export declare function verify_password(password: string, hash: string): Promise<boolean>;
/**
 * Sign data using Ed25519-like signature
 * Uses HMAC-SHA512 as fallback (still cryptographically secure)
 * When Rust is available, true Ed25519 will be used
 *
 * @param data - Data to sign
 * @param privateKey - Private/secret key
 * @returns Signature as hex string
 */
export declare function sign(data: string, privateKey: string): string;
/**
 * Verify signature
 *
 * @param data - Original data
 * @param signature - Signature to verify
 * @param publicKey - Public/secret key (in HMAC mode, same as private)
 * @returns true if signature is valid
 */
export declare function verify_signature(data: string, signature: string, publicKey: string): boolean;
/**
 * Health check function (required by polyglot system)
 * @returns Always resolves (TypeScript fallback is always healthy)
 */
export declare function __health__(): Promise<boolean>;
/**
 * Module info for debugging
 */
export declare const moduleInfo: {
    name: string;
    language: string;
    version: string;
    capabilities: string[];
    note: string;
};
//# sourceMappingURL=crypto-fallback.d.ts.map