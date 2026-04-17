/**
 * 👻 GHOST v1.0.0 - Biometric Jitter Engine
 *
 * Human Motion Simulation - Makes automation movements indistinguishable from real humans.
 *
 * Anti-bot systems detect automation by analyzing:
 * - Mouse trajectory (straight lines = bot)
 * - Acceleration patterns (constant speed = bot)
 * - Click precision (pixel-perfect = bot)
 * - Timing consistency (identical delays = bot)
 *
 * This module uses real biometric data to simulate:
 * - Bezier curve mouse movements with natural jitter
 * - Hand tremor (micro-oscillations ~8-12Hz)
 * - Fatigue-induced drift over time
 * - Hesitation before important actions
 * - "Overshoot and correct" targeting behavior
 *
 * Uses Atomics for lock-free synchronization to avoid blocking the Event Loop.
 *
 * @version 1.0.0 "Ghost in the Machine"
 * @author QANTUM AI Architect
 */
import { EventEmitter } from 'events';
export interface Point2D {
    x: number;
    y: number;
}
export interface MotionConfig {
    curveComplexity: 'minimal' | 'natural' | 'complex';
    tremorEnabled: boolean;
    tremorFrequency: number;
    tremorAmplitude: number;
    fatigueEnabled: boolean;
    fatigueOnsetTime: number;
    fatigueDriftRate: number;
    minSpeed: number;
    maxSpeed: number;
    accelerationCurve: 'ease-in' | 'ease-out' | 'ease-in-out' | 'natural';
    hesitationProbability: number;
    hesitationDuration: {
        min: number;
        max: number;
    };
    overshootEnabled: boolean;
    overshootDistance: {
        min: number;
        max: number;
    };
    overshootCorrectTime: {
        min: number;
        max: number;
    };
    clickDriftRadius: number;
    doubleClickVariance: number;
    scrollStepVariance: number;
    scrollPauseChance: number;
}
export interface BiometricProfile {
    profileId: string;
    handedness: 'left' | 'right';
    skillLevel: 'novice' | 'intermediate' | 'expert';
    ageGroup: 'young' | 'middle' | 'senior';
    deviceType: 'mouse' | 'trackpad' | 'touchscreen';
    config: MotionConfig;
}
interface MovementStep {
    x: number;
    y: number;
    timestamp: number;
    pressure?: number;
    velocity: number;
}
interface ClickEvent {
    x: number;
    y: number;
    button: 'left' | 'right' | 'middle';
    duration: number;
    pressure: number;
}
declare const BIOMETRIC_PRESETS: Record<string, Partial<MotionConfig>>;
export declare class BiometricJitter extends EventEmitter {
    private profile;
    private sessionStartTime;
    private lastPosition;
    private movementHistory;
    private sharedBuffer;
    private atomicView;
    constructor(profile?: Partial<BiometricProfile>);
    /**
     * 🚀 Initialize Atomics for lock-free synchronization
     */
    private initializeAtomics;
    /**
     * 🚀 Initialize the Biometric Jitter Engine
     */
    initialize(): Promise<void>;
    /**
     * 🎭 Apply a preset biometric profile
     */
    applyPreset(presetName: keyof typeof BIOMETRIC_PRESETS): void;
    /**
     * 🖱️ Generate humanized mouse movement path
     *
     * @param from Starting point
     * @param to Target point
     * @returns Array of movement steps with timing
     */
    generateMousePath(from: Point2D, to: Point2D): MovementStep[];
    /**
     * 🖱️ Generate humanized click event
     */
    generateClick(target: Point2D, button?: 'left' | 'right' | 'middle'): ClickEvent;
    /**
     * 🖱️ Generate double-click with natural timing variance
     */
    generateDoubleClick(target: Point2D): {
        click1: ClickEvent;
        click2: ClickEvent;
        delay: number;
    };
    /**
     * 📜 Generate humanized scroll behavior
     */
    generateScroll(amount: number, direction: 'up' | 'down'): {
        steps: number[];
        delays: number[];
    };
    /**
     * ⌨️ Generate humanized typing pattern
     */
    generateTypingPattern(text: string): {
        chars: string[];
        delays: number[];
    };
    private calculateDistance;
    private calculateStepCount;
    private generateBezierControlPoints;
    private calculateBezierPoint;
    private applyTremor;
    private applyFatigueDrift;
    private calculateVelocity;
    private getAccelerationFactor;
    private generateOvershoot;
    /**
     * 📊 Get current fatigue level (0-1)
     */
    getFatigueLevel(): number;
    /**
     * 🔄 Reset session (clears fatigue)
     */
    resetSession(): void;
    /**
     * 📊 Get movement statistics
     */
    getStats(): {
        totalMovements: number;
        avgVelocity: number;
        fatigueLevel: number;
    };
    /**
     * 💉 Generate injection script for Playwright
     */
    generateInjectionScript(): string;
}
export declare function createBiometricJitter(profile?: Partial<BiometricProfile>): BiometricJitter;
export declare function createBiometricProfile(neuralFingerprintId: string, workerIndex?: number): BiometricProfile;
export { BIOMETRIC_PRESETS };
//# sourceMappingURL=biometric-jitter.d.ts.map