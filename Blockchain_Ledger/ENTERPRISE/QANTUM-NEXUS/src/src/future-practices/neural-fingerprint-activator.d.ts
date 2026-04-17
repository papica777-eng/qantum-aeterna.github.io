/**
 * 🔐 NEURAL FINGERPRINT ACTIVATOR
 *
 * v1.0.0.0 Future Practice: Activate unique behavioral profiles for ALL accounts
 *
 * This module bridges the NeuralFingerprintingEngine with account databases,
 * ensuring every single account has its own unique behavioral DNA:
 * - Typing speed jitter (unique per-account variation)
 * - Mouse path randomness (bezier curve signatures)
 * - Scroll patterns (unique acceleration/deceleration)
 * - Click timing signatures
 * - Hesitation patterns
 *
 * "Every account is a unique human - no two behave the same"
 *
 * @version 1.0.0
 * @phase Future Practices - Neural Activation Layer
 * @author QANTUM AI Architect
 */
import { EventEmitter } from 'events';
/**
 * 🧬 Behavioral Jitter Configuration
 * Defines the unique variance patterns for human-like behavior
 */
export interface IBehavioralJitter {
    /** Typing speed variance in milliseconds */
    typingSpeedVariance: number;
    /** Mouse inertia factor (0-1 scale) */
    mouseInertia: number;
    /** Click delay range [min, max] in ms */
    clickDelayRange: [number, number];
    /** Scroll speed variance */
    scrollSpeedVariance: number;
    /** Hesitation probability (0-1) */
    hesitationProbability: number;
}
/**
 * 🪪 Fingerprint Profile Interface
 * Complete behavioral profile for an account
 */
export interface IFingerprintProfile {
    id: string;
    identity: {
        userAgent: string;
        platform: string;
        language: string;
        timezone: string;
        screenResolution: [number, number];
    };
    behavior: IBehavioralJitter;
    isActivated: boolean;
    lastUsed: Date;
    usageCount: number;
    createdAt: Date;
}
/**
 * 🔄 Activation Options
 */
export interface IActivationOptions {
    regenerate?: boolean;
    validateExisting?: boolean;
    applyImmediately?: boolean;
    logActivation?: boolean;
}
/**
 * 📊 Activation Result
 */
export interface IActivationResult {
    success: boolean;
    profileId: string;
    message: string;
    profile?: IFingerprintProfile;
    previousProfile?: IFingerprintProfile;
}
export interface AccountBehavioralDNA {
    accountId: string;
    dnaHash: string;
    createdAt: number;
    lastActivated: number;
    typing: TypingDNA;
    mouse: MouseDNA;
    interaction: InteractionDNA;
    session: SessionDNA;
    activated: boolean;
    usageCount: number;
}
export interface TypingDNA {
    baseWPM: number;
    wpmJitter: number;
    keyHoldMean: number;
    keyHoldStdDev: number;
    keyIntervalMean: number;
    keyIntervalStdDev: number;
    charTimingOffsets: Map<string, number>;
    bigramTimings: Map<string, number>;
    errorProbability: number;
    commonMistakes: string[];
    correctionStyle: 'backspace-each' | 'backspace-all' | 'select-replace' | 'mixed';
    correctionDelay: number;
    burstLength: number;
    burstPauseDuration: number;
    fatigueOnset: number;
    fatigueMultiplier: number;
}
export interface MouseDNA {
    baseSpeed: number;
    speedJitter: number;
    accelerationCurve: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'custom';
    accelerationFactor: number;
    decelerationFactor: number;
    bezierControlPointJitter: number;
    pathOvershootProbability: number;
    overshootMagnitude: number;
    microMovementAmplitude: number;
    microMovementFrequency: number;
    clickDurationMean: number;
    clickDurationStdDev: number;
    doubleClickInterval: number;
    clickPositionJitter: number;
    scrollStyle: 'smooth' | 'stepped' | 'inertial';
    scrollSpeedBase: number;
    scrollAcceleration: number;
    scrollOverscrollProbability: number;
    hoverDwellTime: number;
    hoverMicroMovements: boolean;
}
export interface InteractionDNA {
    hesitationProbability: number;
    hesitationDuration: {
        min: number;
        max: number;
    };
    hesitationTriggers: string[];
    readingSpeed: number;
    scanPattern: 'f-pattern' | 'z-pattern' | 'random' | 'sequential';
    regressionProbability: number;
    focusShiftFrequency: number;
    tabSwitchingRate: number;
    multitaskingScore: number;
    reactionTimeBase: number;
    reactionTimeVariance: number;
    frustrationThreshold: number;
    frustrationBehaviors: ('rapid-click' | 'erratic-mouse' | 'scroll-spam')[];
}
export interface SessionDNA {
    activeHours: number[];
    sessionDurationMean: number;
    sessionDurationStdDev: number;
    microBreakFrequency: number;
    microBreakDuration: number;
    longBreakThreshold: number;
    energyCurve: 'constant' | 'declining' | 'u-shaped' | 'variable';
    peakEnergyTime: number;
}
export interface ActivatorConfig {
    databasePath: string;
    autoActivateNewAccounts: boolean;
    persistProfiles: boolean;
    profileStoragePath: string;
    regenerateExisting: boolean;
    batchSize: number;
}
export interface ActivationReport {
    totalAccounts: number;
    newlyActivated: number;
    alreadyActivated: number;
    failed: number;
    duration: number;
    timestamp: number;
}
export declare class NeuralFingerprintActivator extends EventEmitter {
    private config;
    private activatedProfiles;
    private profilesLoaded;
    private static readonly TYPING_WPM_DISTRIBUTION;
    private static readonly COMMON_TYPOS;
    private static readonly HESITATION_TRIGGERS;
    constructor(config?: Partial<ActivatorConfig>);
    /**
     * 🚀 Initialize Neural Fingerprint Activator
     */
    initialize(): Promise<void>;
    /**
     * Load persisted profiles from disk
     */
    private loadPersistedProfiles;
    /**
     * 🎯 Activate ALL accounts from database
     */
    activateAllAccounts(accounts: Array<{
        id: string;
        [key: string]: any;
    }>): Promise<ActivationReport>;
    /**
     * 🧬 Generate unique behavioral DNA for account
     */
    generateBehavioralDNA(accountId: string): Promise<AccountBehavioralDNA>;
    /**
     * ⌨️ Generate unique typing DNA
     */
    private generateTypingDNA;
    /**
     * 🖱️ Generate unique mouse DNA
     */
    private generateMouseDNA;
    /**
     * 🎯 Generate unique interaction DNA
     */
    private generateInteractionDNA;
    /**
     * 📅 Generate unique session DNA
     */
    private generateSessionDNA;
    /**
     * 🔍 Get behavioral DNA for account
     */
    getAccountDNA(accountId: string): AccountBehavioralDNA | undefined;
    /**
     * 🎲 Simulate typing sequence with account's DNA
     */
    simulateTypingSequence(accountId: string, text: string): Array<{
        char: string;
        timestamp: number;
        keyHoldDuration: number;
    }>;
    /**
     * 🖱️ Simulate mouse path with account's DNA
     */
    simulateMousePath(accountId: string, from: {
        x: number;
        y: number;
    }, to: {
        x: number;
        y: number;
    }): Array<{
        x: number;
        y: number;
        timestamp: number;
    }>;
    /**
     * 💾 Persist profile to disk
     */
    private persistProfile;
    /**
     * 📊 Get activation statistics
     */
    getStats(): {
        totalActivated: number;
        avgTypingWPM: number;
        avgMouseSpeed: number;
        profileDistribution: Record<string, number>;
    };
    private createSeededRandom;
    private gaussianRandom;
    private pickRandomWeighted;
    private shuffleArray;
}
export declare function createNeuralFingerprintActivator(config?: Partial<ActivatorConfig>): NeuralFingerprintActivator;
//# sourceMappingURL=neural-fingerprint-activator.d.ts.map