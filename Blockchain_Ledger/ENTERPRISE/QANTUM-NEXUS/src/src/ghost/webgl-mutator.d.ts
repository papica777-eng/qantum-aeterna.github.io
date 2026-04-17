/**
 * 👻 GHOST v1.0.0 - WebGL Mutator
 *
 * Visual Stealth Module - Makes every Swarm worker appear as a unique machine.
 *
 * Anti-detection systems (Datadome, Akamai, Cloudflare Turnstile) check WebGL
 * fingerprints to identify headless browsers. This module injects scripts that
 * override getParameter() and getExtension() to report fake GPU hardware.
 *
 * Features:
 * - Unique GPU fingerprint per Neural Fingerprint
 * - Canvas hash mutation
 * - Renderer/Vendor spoofing
 * - WebGL2 support detection masking
 * - Audio context fingerprint randomization
 *
 * @version 1.0.0 "Ghost in the Machine"
 * @author QANTUM AI Architect
 */
import { EventEmitter } from 'events';
export interface WebGLProfile {
    profileId: string;
    vendor: string;
    renderer: string;
    unmaskedVendor: string;
    unmaskedRenderer: string;
    maxTextureSize: number;
    maxViewportDims: [number, number];
    maxRenderbufferSize: number;
    aliasedLineWidthRange: [number, number];
    aliasedPointSizeRange: [number, number];
    maxVertexAttribs: number;
    maxVaryingVectors: number;
    maxFragmentUniformVectors: number;
    maxVertexUniformVectors: number;
    supportedExtensions: string[];
    shaHash: string;
}
export interface CanvasProfile {
    noiseScale: number;
    colorShift: [number, number, number];
    fontRenderingVariance: number;
    textBaselineJitter: number;
}
export interface AudioProfile {
    sampleRate: number;
    channelCount: number;
    oscillatorType: OscillatorType;
    noiseAmplitude: number;
}
type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';
interface GhostVisualConfig {
    seed?: string;
    consistentPerSession: boolean;
    gpuPool: GPUDefinition[];
    enableCanvasMutation: boolean;
    enableAudioMutation: boolean;
    debugMode: boolean;
}
interface GPUDefinition {
    vendor: string;
    unmaskedVendor: string;
    renderer: string;
    unmaskedRenderer: string;
    tier: 'low' | 'mid' | 'high' | 'ultra';
    marketShare: number;
}
declare const GPU_DATABASE: GPUDefinition[];
export declare class WebGLMutator extends EventEmitter {
    private config;
    private profileCache;
    private canvasCache;
    private audioCache;
    constructor(config?: Partial<GhostVisualConfig>);
    /**
     * 🚀 Initialize the WebGL Mutator
     */
    initialize(): Promise<void>;
    /**
     * 🎭 Generate WebGL profile for a Neural Fingerprint
     *
     * @param neuralFingerprintId - Unique ID from Neural Fingerprinting engine
     * @param workerIndex - Optional worker index for deterministic generation
     */
    generateWebGLProfile(neuralFingerprintId: string, workerIndex?: number): WebGLProfile;
    /**
     * 🖼️ Generate Canvas mutation profile
     */
    generateCanvasProfile(neuralFingerprintId: string): CanvasProfile;
    /**
     * 🔊 Generate Audio fingerprint profile
     */
    generateAudioProfile(neuralFingerprintId: string): AudioProfile;
    /**
     * 💉 Generate injection script for Playwright/Puppeteer
     *
     * This script overrides WebGL methods to report fake hardware info
     */
    generateInjectionScript(profile: WebGLProfile, canvasProfile?: CanvasProfile, audioProfile?: AudioProfile): string;
    private selectGPUByMarketShare;
    private getMaxTextureSize;
    private getMaxViewportDims;
    private getMaxRenderbufferSize;
    private getAliasedLineWidthRange;
    private getAliasedPointSizeRange;
    private getMaxVertexAttribs;
    private getMaxVaryingVectors;
    private getMaxFragmentUniformVectors;
    private getMaxVertexUniformVectors;
    private getSupportedExtensions;
    private generateShaHash;
    private generateCanvasInjection;
    private generateAudioInjection;
    /**
     * 🔄 Clear profile caches (use when rotating fingerprints)
     */
    clearCache(): void;
    /**
     * 📊 Get statistics
     */
    getStats(): {
        webglProfiles: number;
        canvasProfiles: number;
        audioProfiles: number;
    };
}
export declare function createWebGLMutator(config?: Partial<GhostVisualConfig>): WebGLMutator;
export { GPU_DATABASE };
//# sourceMappingURL=webgl-mutator.d.ts.map