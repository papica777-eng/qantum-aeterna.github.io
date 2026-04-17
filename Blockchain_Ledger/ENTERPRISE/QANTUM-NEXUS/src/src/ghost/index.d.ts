/**
 * 👻 GHOST v1.0.0 - "The Ghost in the Machine"
 *
 * Zero-Detection Automation Layer - Makes QANTUM invisible to anti-bot systems.
 *
 * This module integrates:
 * - WebGL Mutator: Unique GPU fingerprints per worker
 * - Biometric Jitter: Human-like mouse/keyboard behavior
 * - TLS Rotator: Browser-matching TLS fingerprints
 *
 * Together, these create a "Ghost Profile" for each of the 199 Swarm workers,
 * making them indistinguishable from real human users.
 *
 * @version 1.0.0 "Ghost in the Machine"
 * @author QANTUM AI Architect
 */
export { WebGLMutator, createWebGLMutator, GPU_DATABASE, type WebGLProfile, type CanvasProfile, type AudioProfile } from './webgl-mutator';
export { BiometricJitter, createBiometricJitter, createBiometricProfile, BIOMETRIC_PRESETS, type BiometricProfile, type MotionConfig, type Point2D } from './biometric-jitter';
export { TLSRotator, createTLSRotator, TLS_PROFILES, MARKET_SHARE, type TLSProfile, type TLSRotatorConfig } from './tls-rotator';
import { EventEmitter } from 'events';
import { WebGLProfile, CanvasProfile, AudioProfile } from './webgl-mutator';
import { BiometricJitter, BiometricProfile } from './biometric-jitter';
import { TLSProfile } from './tls-rotator';
export interface GhostProfile {
    ghostId: string;
    neuralFingerprintId: string;
    workerIndex: number;
    createdAt: number;
    webgl: WebGLProfile;
    canvas: CanvasProfile;
    audio: AudioProfile;
    biometric: BiometricProfile;
    tls: TLSProfile;
    injectionScript: string;
}
export interface GhostEngineConfig {
    enableWebGL: boolean;
    enableCanvas: boolean;
    enableAudio: boolean;
    enableBiometric: boolean;
    enableTLS: boolean;
    debugMode: boolean;
}
export declare class GhostEngine extends EventEmitter {
    private config;
    private webglMutator;
    private biometricJitter;
    private tlsRotator;
    private profileCache;
    private initialized;
    constructor(config?: Partial<GhostEngineConfig>);
    /**
     * 🚀 Initialize the Ghost Engine
     */
    initialize(): Promise<void>;
    /**
     * 🎭 Create Ghost Profile for a Swarm Worker
     *
     * @param neuralFingerprintId - ID from Neural Fingerprinting engine
     * @param workerIndex - Worker index (0-198 for 199 workers)
     */
    createGhostProfile(neuralFingerprintId: string, workerIndex: number): GhostProfile;
    /**
     * 💉 Get Playwright browser launch options with Ghost profile
     */
    getPlaywrightOptions(profile: GhostProfile): any;
    /**
     * 📝 Get context options for Playwright with matching headers
     */
    getContextOptions(profile: GhostProfile): any;
    /**
     * 🖱️ Get Biometric Jitter instance for human-like interactions
     */
    getBiometricJitter(profile: GhostProfile): BiometricJitter;
    /**
     * 📊 Get engine statistics
     */
    getStats(): {
        profilesCreated: number;
        webglStats: any;
        tlsStats: any;
    };
    /**
     * 🔄 Clear all caches (force new fingerprints)
     */
    clearCache(): void;
    private generateCombinedScript;
    private getUserAgent;
    private getDefaultWebGL;
    private getDefaultCanvas;
    private getDefaultAudio;
    private getDefaultBiometric;
    private getDefaultTLS;
}
export declare function createGhostEngine(config?: Partial<GhostEngineConfig>): GhostEngine;
export default GhostEngine;
//# sourceMappingURL=index.d.ts.map