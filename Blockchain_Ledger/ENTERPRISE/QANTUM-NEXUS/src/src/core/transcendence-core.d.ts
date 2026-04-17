/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * QAntum
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * @copyright 2025 Димитър Продромов (Dimitar Prodromov). All Rights Reserved.
 * @license PROPRIETARY AND CONFIDENTIAL
 *
 * This file is part of QAntum.
 * Unauthorized copying, modification, distribution, or use of this file,
 * via any medium, is strictly prohibited without express written permission.
 *
 * For licensing inquiries: dimitar.prodromov@QAntum.dev
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
/**
 * Paradox types supported by the system
 */
export type ParadoxType = 'godel' | 'catuskoti' | 'liar' | 'barber' | 'zeno' | 'newcomb' | 'unexpected' | 'sorites';
/**
 * Paradox instance
 */
export interface Paradox {
    id: string;
    type: ParadoxType;
    description: string;
    proposition: string;
    negation: string;
    resolution?: ParadoxResolution;
    depth: number;
    selfReferential: boolean;
    undecidable: boolean;
}
/**
 * Paradox resolution attempt
 */
export interface ParadoxResolution {
    method: 'transcend' | 'embrace' | 'dissolve' | 'weaponize';
    outcome: 'resolved' | 'perpetual' | 'trapped' | 'transcended';
    cognitiveLoad: number;
    description: string;
}
/**
 * Gödelian Trap - A construct that halts hostile analyzers
 */
export interface GodelianTrap {
    id: string;
    code: string;
    truthValue: 'true' | 'false' | 'undecidable' | 'both' | 'neither';
    selfReference: string;
    infiniteRegress: boolean;
    haltsAnalyzer: boolean;
    complexity: number;
    generatedAt: number;
}
/**
 * Catuskoti State - Four-cornered truth value
 */
export interface CatuskotiState {
    affirmation: boolean;
    negation: boolean;
    both: boolean;
    neither: boolean;
    dominant: 'A' | 'N' | 'B' | 'X';
}
/**
 * Shield Configuration
 */
export interface ShieldConfig {
    /** Enable Gödelian trap generation */
    enableGodelTraps: boolean;
    /** Enable Catuskoti logic shields */
    enableCatuskoti: boolean;
    /** Trap complexity level (1-10) */
    trapComplexity: number;
    /** Maximum paradox depth before auto-transcend */
    maxParadoxDepth: number;
    /** Auto-generate traps on hostile detection */
    autoDefense: boolean;
    /** Verbose logging */
    verbose: boolean;
}
/**
 * Analysis threat detection
 */
export interface ThreatAnalysis {
    source: string;
    type: 'scanner' | 'decompiler' | 'ai' | 'fuzzer' | 'manual';
    hostility: number;
    depth: number;
    patterns: string[];
    timestamp: number;
}
/**
 * TranscendenceCore - Active Paradox Resolution System
 *
 * The core doesn't just describe paradoxes - it USES them as defensive shields.
 * When a hostile analyzer attempts to understand the system, the core generates
 * Gödelian traps that are logically valid but computationally undecidable,
 * effectively "jamming" the attacker's cognitive processes.
 */
export declare class TranscendenceCore extends EventEmitter {
    private paradoxes;
    private traps;
    private threats;
    private config;
    private nextParadoxId;
    private nextTrapId;
    private shieldsActive;
    private activeTrapCount;
    private hostileDetections;
    constructor(config?: Partial<ShieldConfig>);
    /**
     * Activate paradox shields
     */
    activateShields(): void;
    /**
     * Deactivate shields
     */
    deactivateShields(): void;
    /**
     * Check if shields are active
     */
    areShieldsActive(): boolean;
    /**
     * Generate a Gödelian Trap
     *
     * Creates a self-referential code construct that is logically valid
     * but computationally undecidable, designed to halt hostile analyzers.
     */
    generateGodelianTrap(): GodelianTrap;
    /**
     * Generate self-referential code
     */
    private generateSelfReferentialCode;
    /**
     * Evaluate a proposition using Catuskoti (four-corner) logic
     *
     * In Buddhist logic, a proposition P can be:
     * 1. True (A)
     * 2. False (N)
     * 3. Both true and false (B)
     * 4. Neither true nor false (X)
     */
    evaluateCatuskoti(proposition: string): CatuskotiState;
    /**
     * Convert Catuskoti state to truth value
     */
    private catuskotiToTruthValue;
    /**
     * Detect self-reference in proposition
     */
    private detectSelfReference;
    /**
     * Detect negation in proposition
     */
    private detectNegation;
    /**
     * Detect infinite regress patterns
     */
    private detectInfiniteRegress;
    /**
     * Analyze and respond to potential threat
     */
    analyzeThreat(analysis: Omit<ThreatAnalysis, 'timestamp'>): GodelianTrap | null;
    /**
     * Deploy defensive trap against threat
     */
    deployDefense(threat: ThreatAnalysis): GodelianTrap;
    /**
     * Get trap to serve to analyzer
     */
    getTrapForAnalyzer(): GodelianTrap | null;
    /**
     * Initialize core paradoxes
     */
    private initializeParadoxes;
    /**
     * Register a new paradox
     */
    registerParadox(paradox: Omit<Paradox, 'id'>): Paradox;
    /**
     * Attempt to resolve a paradox
     */
    resolveParadox(paradoxId: string): ParadoxResolution | null;
    /**
     * Get all paradoxes
     */
    getParadoxes(): Paradox[];
    /**
     * Get all traps
     */
    getTraps(): GodelianTrap[];
    /**
     * Get system status
     */
    getStatus(): {
        shieldsActive: boolean;
        activeTrapCount: number;
        paradoxCount: number;
        hostileDetections: number;
        threatCount: number;
        config: ShieldConfig;
    };
    /**
     * Get threat history
     */
    getThreatHistory(): ThreatAnalysis[];
    /**
     * Clear all traps
     */
    clearTraps(): void;
    /**
     * Update configuration
     */
    updateConfig(config: Partial<ShieldConfig>): void;
    /**
     * Log message if verbose
     */
    private log;
}
export declare function getTranscendenceCore(): TranscendenceCore;
export default TranscendenceCore;
//# sourceMappingURL=transcendence-core.d.ts.map