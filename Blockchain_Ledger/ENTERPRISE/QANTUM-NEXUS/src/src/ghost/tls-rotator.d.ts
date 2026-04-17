/**
 * 👻 GHOST v1.0.0 - TLS Rotator
 *
 * Network Invisibility Module - Makes TLS fingerprints match real browsers.
 *
 * Anti-bot systems use JA3/JA4 fingerprinting to identify headless browsers.
 * JA3 is computed from:
 * - TLS version
 * - Accepted cipher suites
 * - Extension list
 * - Elliptic curves
 * - EC point formats
 *
 * This module rotates TLS configurations to match legitimate Chrome/Firefox browsers.
 *
 * Supported fingerprints:
 * - Chrome 121+ (Windows/Mac/Linux)
 * - Firefox 121+ (Windows/Mac/Linux)
 * - Safari 17+ (Mac)
 * - Edge 121+ (Windows)
 *
 * @version 1.0.0 "Ghost in the Machine"
 * @author QANTUM AI Architect
 */
import * as tls from 'tls';
import { EventEmitter } from 'events';
export interface TLSProfile {
    profileId: string;
    browser: string;
    browserVersion: string;
    os: string;
    ja3Hash: string;
    ja3Full: string;
    ciphers: string[];
    minVersion: tls.SecureVersion;
    maxVersion: tls.SecureVersion;
    sigalgs: string;
    ecdhCurves: string;
    alpnProtocols: string[];
    sessionTimeout: number;
}
export interface TLSRotatorConfig {
    rotationStrategy: 'static' | 'per-session' | 'per-request' | 'adaptive';
    preferredBrowsers: BrowserType[];
    preferredOS: OSType[];
    consistentPerWorker: boolean;
    enableHTTP2: boolean;
    enableSessionResumption: boolean;
}
type BrowserType = 'chrome' | 'firefox' | 'safari' | 'edge';
type OSType = 'windows' | 'macos' | 'linux';
interface JA3Components {
    tlsVersion: number;
    ciphers: number[];
    extensions: number[];
    ellipticCurves: number[];
    ecPointFormats: number[];
}
declare const TLS_PROFILES: TLSProfile[];
declare const MARKET_SHARE: Record<string, number>;
export declare class TLSRotator extends EventEmitter {
    private config;
    private profileCache;
    private rotationCounter;
    private lastProfile;
    constructor(config?: Partial<TLSRotatorConfig>);
    /**
     * 🚀 Initialize the TLS Rotator
     */
    initialize(): Promise<void>;
    /**
     * 🎭 Get TLS profile for a Neural Fingerprint
     */
    getProfile(neuralFingerprintId: string, workerIndex?: number): TLSProfile;
    /**
     * 🔧 Get TLS options for Node.js https/tls
     */
    getTLSOptions(profile: TLSProfile): tls.SecureContextOptions;
    /**
     * 🎭 Get Playwright context options for TLS configuration
     *
     * Note: Playwright uses Chromium's TLS stack, so direct cipher control
     * is limited. This returns browser launch args for best compatibility.
     */
    getPlaywrightArgs(profile: TLSProfile): string[];
    /**
     * 🔄 Generate HTTP headers that match the TLS profile
     */
    getMatchingHeaders(profile: TLSProfile): Record<string, string>;
    /**
     * 📊 Calculate JA3 hash from components
     */
    calculateJA3(components: JA3Components): string;
    private getStaticProfile;
    private getRandomProfile;
    private getDeterministicProfile;
    private getAdaptiveProfile;
    private filterProfiles;
    /**
     * 🔄 Clear profile cache (force rotation)
     */
    clearCache(): void;
    /**
     * 📊 Get rotation statistics
     */
    getStats(): {
        rotations: number;
        cachedProfiles: number;
        lastProfile: string | null;
    };
    /**
     * 🔍 Verify TLS fingerprint matches expected
     */
    verifyFingerprint(actual: string, expected: string): boolean;
}
export declare function createTLSRotator(config?: Partial<TLSRotatorConfig>): TLSRotator;
export { TLS_PROFILES, MARKET_SHARE };
//# sourceMappingURL=tls-rotator.d.ts.map