/**
 * 🧠 NEURAL FINGERPRINTING ENGINE
 *
 * Advanced Practice #3: Unique human-like behavioral profiles for each test session.
 *
 * Uses neuro-sentinel patterns to create realistic user fingerprints that
 * bypass bot detection while maintaining consistent behavioral signatures.
 *
 * Features:
 * - Behavioral biometrics simulation
 * - Device fingerprint generation
 * - Mouse/keyboard pattern synthesis
 * - Session persistence across tests
 * - Anti-bot evasion techniques
 *
 * @version 1.0.0
 * @phase Future Practices - Beyond Phase 100
 * @author QANTUM AI Architect
 */
import { EventEmitter } from 'events';
interface NeuralFingerprint {
    fingerprintId: string;
    sessionId: string;
    createdAt: number;
    expiresAt: number;
    device: DeviceFingerprint;
    behavior: BehavioralProfile;
    network: NetworkProfile;
    browser: BrowserProfile;
    stats: FingerprintStats;
}
interface DeviceFingerprint {
    screenResolution: {
        width: number;
        height: number;
    };
    colorDepth: number;
    pixelRatio: number;
    timezone: string;
    timezoneOffset: number;
    language: string;
    languages: string[];
    platform: string;
    hardwareConcurrency: number;
    deviceMemory: number;
    maxTouchPoints: number;
    vendor: string;
    renderer: string;
    webglHash: string;
    canvasHash: string;
    audioHash: string;
    fontsHash: string;
}
interface BehavioralProfile {
    mouseSpeed: {
        min: number;
        max: number;
        avg: number;
    };
    mouseAcceleration: {
        min: number;
        max: number;
    };
    clickDuration: {
        min: number;
        max: number;
        avg: number;
    };
    doubleClickSpeed: number;
    scrollSpeed: {
        min: number;
        max: number;
    };
    scrollPattern: 'smooth' | 'stepped' | 'variable';
    typingSpeed: {
        wpm: number;
        variance: number;
    };
    keyHoldDuration: {
        min: number;
        max: number;
    };
    keyInterval: {
        min: number;
        max: number;
    };
    errorRate: number;
    correctionPattern: 'backspace' | 'select-delete' | 'mixed';
    readingSpeed: number;
    dwellTime: {
        min: number;
        max: number;
    };
    tabSwitchFrequency: number;
    hesitationProbability: number;
    microPauseDuration: {
        min: number;
        max: number;
    };
    frustrationIndicators: string[];
}
interface NetworkProfile {
    connectionType: 'wifi' | '4g' | '5g' | 'ethernet' | 'unknown';
    effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
    downlink: number;
    rtt: number;
    saveData: boolean;
    ipGeolocation: {
        country: string;
        region: string;
        city: string;
        isp: string;
    };
}
interface BrowserProfile {
    userAgent: string;
    appVersion: string;
    vendor: string;
    product: string;
    productSub: string;
    buildID: string;
    cookieEnabled: boolean;
    doNotTrack: string | null;
    plugins: PluginInfo[];
    mimeTypes: string[];
    webRTC: {
        enabled: boolean;
        localIPs: string[];
    };
    canvas: {
        supported: boolean;
        hash: string;
    };
    webGL: {
        supported: boolean;
        vendor: string;
        renderer: string;
        hash: string;
    };
    audio: {
        supported: boolean;
        hash: string;
    };
    features: BrowserFeatures;
}
interface PluginInfo {
    name: string;
    filename: string;
    description: string;
}
interface BrowserFeatures {
    webAssembly: boolean;
    webWorkers: boolean;
    serviceWorkers: boolean;
    webSockets: boolean;
    webRTC: boolean;
    indexedDB: boolean;
    localStorage: boolean;
    sessionStorage: boolean;
    notifications: boolean;
    geolocation: boolean;
    mediaDevices: boolean;
    bluetooth: boolean;
    usb: boolean;
    payment: boolean;
}
interface FingerprintStats {
    sessionsUsed: number;
    testsExecuted: number;
    pagesVisited: number;
    detectionsEvaded: number;
    avgSessionDuration: number;
    lastUsed: number;
}
interface FingerprintConfig {
    basePersonality: 'casual' | 'professional' | 'power-user' | 'novice';
    deviceCategory: 'desktop' | 'laptop' | 'tablet' | 'mobile';
    region: string;
    sessionDuration: number;
    persistFingerprint: boolean;
    rotationStrategy: 'fixed' | 'per-session' | 'time-based';
    rotationInterval?: number;
}
export declare class NeuralFingerprintingEngine extends EventEmitter {
    private config;
    private fingerprints;
    private activeFingerprint;
    private static readonly USER_AGENTS;
    private static readonly SCREEN_RESOLUTIONS;
    private static readonly TIMEZONES;
    private static readonly LANGUAGES;
    private static readonly GPU_VENDORS;
    private static readonly GPU_RENDERERS;
    constructor(config?: Partial<FingerprintConfig>);
    /**
     * 🚀 Initialize fingerprinting engine
     */
    initialize(): Promise<void>;
    /**
     * 🎭 Generate new neural fingerprint
     */
    generateFingerprint(sessionId?: string): Promise<NeuralFingerprint>;
    /**
     * 📱 Generate device fingerprint
     */
    private generateDeviceFingerprint;
    /**
     * 🎭 Generate behavioral profile based on personality
     */
    private generateBehavioralProfile;
    /**
     * 🌐 Generate network profile
     */
    private generateNetworkProfile;
    /**
     * Generate geolocation based on region
     */
    private generateGeolocation;
    /**
     * 🖥️ Generate browser profile
     */
    private generateBrowserProfile;
    /**
     * Generate realistic plugin list
     */
    private generatePlugins;
    /**
     * Generate browser features
     */
    private generateBrowserFeatures;
    /**
     * 🎮 Simulate human-like mouse movement
     */
    generateMousePath(start: {
        x: number;
        y: number;
    }, end: {
        x: number;
        y: number;
    }, options?: {
        steps?: number;
        includeOvershoot?: boolean;
    }): {
        x: number;
        y: number;
        timestamp: number;
    }[];
    /**
     * Cubic Bezier interpolation
     */
    private cubicBezier;
    /**
     * ⌨️ Simulate human-like typing
     */
    generateTypingSequence(text: string, options?: {
        includeErrors?: boolean;
        includeCorrections?: boolean;
    }): {
        char: string;
        delay: number;
        isBackspace?: boolean;
    }[];
    /**
     * 📜 Simulate human-like scrolling
     */
    generateScrollSequence(totalDistance: number, direction: 'up' | 'down'): {
        delta: number;
        timestamp: number;
    }[];
    /**
     * 🔄 Rotate fingerprint
     */
    rotateFingerprint(): Promise<NeuralFingerprint>;
    /**
     * 📊 Get fingerprint for injection
     */
    getFingerprintPayload(): Record<string, any>;
    /**
     * Get active fingerprint
     */
    getActiveFingerprint(): NeuralFingerprint | null;
    /**
     * Update fingerprint stats
     */
    updateStats(updates: Partial<FingerprintStats>): void;
    private pickRandom;
    private randomInRange;
    private generateHash;
    private getTimezoneOffset;
    private getPlatformForCategory;
    private detectVendorFromUA;
    private generateBuildId;
}
export declare function createNeuralFingerprinting(config?: Partial<FingerprintConfig>): NeuralFingerprintingEngine;
export type { NeuralFingerprint, DeviceFingerprint, BehavioralProfile, NetworkProfile, BrowserProfile, FingerprintConfig };
//# sourceMappingURL=neural-fingerprinting.d.ts.map