/**
 * 🏰 THE FORTRESS - Code Obfuscation Engine
 *
 * Protects intellectual property by transforming readable code
 * into functionally equivalent but unreadable form.
 *
 * Techniques:
 * - Variable/function name mangling
 * - String encryption
 * - Control flow flattening
 * - Dead code injection
 * - Self-defending code
 *
 * @version 1.0.0
 * @phase 71-72
 */
interface ObfuscationConfig {
    target: 'browser' | 'node';
    sourceMapEnabled: boolean;
    mangleNames: boolean;
    reservedNames: string[];
    encryptStrings: boolean;
    stringEncryptionThreshold: number;
    flattenControlFlow: boolean;
    controlFlowFlatteningThreshold: number;
    injectDeadCode: boolean;
    deadCodeInjectionThreshold: number;
    selfDefending: boolean;
    debugProtection: boolean;
    disableConsoleOutput: boolean;
    domainLock: string[];
    domainLockRedirectUrl?: string;
}
interface ObfuscationResult {
    success: boolean;
    originalSize: number;
    obfuscatedSize: number;
    compressionRatio: number;
    filesProcessed: number;
    protectionLevel: 'basic' | 'standard' | 'maximum' | 'paranoid';
    timestamp: number;
}
export declare class ObfuscationEngine {
    private config;
    private encryptionKey;
    private processedFiles;
    constructor(config?: Partial<ObfuscationConfig>);
    /**
     * Obfuscate entire dist directory
     */
    obfuscateDirectory(distPath: string): Promise<ObfuscationResult>;
    /**
     * Obfuscate single code string
     */
    obfuscateCode(code: string, filename?: string): Promise<string>;
    /**
     * Mangle variable and function names
     */
    private mangleVariableNames;
    /**
     * Encrypt string literals
     */
    private encryptStrings;
    /**
     * Flatten control flow to make decompilation harder
     */
    private flattenControlFlow;
    /**
     * Inject dead code to confuse reverse engineers
     */
    private injectDeadCode;
    /**
     * Add self-defending code that breaks if modified
     */
    private addSelfDefending;
    /**
     * Add debug protection
     */
    private addDebugProtection;
    /**
     * Add fortress header with metadata
     */
    private addFortressHeader;
    private generateMachineKey;
    private encryptString;
    private generateDecryptor;
    private findJsFiles;
    private isAlreadyObfuscated;
    private getProtectionLevel;
    private generateIntegrityManifest;
}
export declare function obfuscateDist(distPath: string, config?: Partial<ObfuscationConfig>): Promise<void>;
export {};
//# sourceMappingURL=obfuscation-engine.d.ts.map