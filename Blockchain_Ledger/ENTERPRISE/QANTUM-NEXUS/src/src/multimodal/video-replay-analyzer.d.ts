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
 * Sovereign Goal - High-level test objective extracted from video
 */
export interface SovereignGoal {
    /** Unique goal identifier */
    id: string;
    /** Human-readable goal description */
    description: string;
    /** Goal type */
    type: GoalType;
    /** Priority level */
    priority: 'critical' | 'high' | 'medium' | 'low';
    /** Extracted action sequence */
    actions: ExtractedAction[];
    /** UI elements involved */
    elements: UIElement[];
    /** Confidence in goal extraction */
    confidence: number;
    /** Time range in video */
    timeRange: {
        start: number;
        end: number;
    };
    /** Generated test code */
    generatedCode?: string;
    /** Metadata */
    metadata: GoalMetadata;
}
/**
 * Goal type classification
 */
export type GoalType = 'authentication' | 'form_submission' | 'navigation' | 'search' | 'crud_operation' | 'checkout' | 'file_upload' | 'data_validation' | 'user_settings' | 'custom';
/**
 * Extracted action from video frame
 */
export interface ExtractedAction {
    /** Action type */
    type: ActionType;
    /** Target element */
    target: UIElement;
    /** Action value (for typing, selecting) */
    value?: string;
    /** Timestamp in video (ms) */
    timestamp: number;
    /** Duration of action (ms) */
    duration: number;
    /** Confidence score */
    confidence: number;
    /** Screenshot frame reference */
    frameIndex: number;
}
/**
 * Action types detectable in video
 */
export type ActionType = 'click' | 'double_click' | 'right_click' | 'type' | 'scroll' | 'drag' | 'drop' | 'hover' | 'focus' | 'blur' | 'select' | 'upload' | 'wait' | 'navigation';
/**
 * UI Element detected in frame
 */
export interface UIElement {
    /** Element type */
    type: ElementType;
    /** Bounding box coordinates */
    boundingBox: BoundingBox;
    /** Generated selector */
    selector: string;
    /** Visible text content */
    text?: string;
    /** Element attributes */
    attributes: Record<string, string>;
    /** Visual features */
    visualFeatures: VisualFeatures;
    /** Confidence in detection */
    confidence: number;
}
/**
 * Element types
 */
export type ElementType = 'button' | 'link' | 'input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'image' | 'icon' | 'menu' | 'modal' | 'card' | 'list_item' | 'table_cell' | 'tab' | 'unknown';
/**
 * Bounding box for element location
 */
export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}
/**
 * Visual features of element
 */
export interface VisualFeatures {
    /** Primary color */
    primaryColor: string;
    /** Background color */
    backgroundColor: string;
    /** Has border */
    hasBorder: boolean;
    /** Has shadow */
    hasShadow: boolean;
    /** Is highlighted/focused */
    isHighlighted: boolean;
    /** Estimated z-index */
    zIndex: number;
}
/**
 * Goal metadata
 */
export interface GoalMetadata {
    /** Video file info */
    video: {
        filename: string;
        duration: number;
        resolution: {
            width: number;
            height: number;
        };
        fps: number;
        size: number;
    };
    /** Analysis timing */
    analysis: {
        startTime: number;
        endTime: number;
        framesAnalyzed: number;
        modelUsed: string;
    };
    /** Session info */
    session: {
        url?: string;
        browser?: string;
        viewport?: {
            width: number;
            height: number;
        };
    };
}
/**
 * Video Analyzer configuration
 */
export interface VideoAnalyzerConfig {
    /** Vision API key (Gemini) */
    apiKey: string;
    /** Vision model to use */
    model: 'gemini-2.0-flash' | 'gemini-1.5-pro-vision';
    /** Frames per second to analyze */
    analysisFrameRate: number;
    /** Minimum action confidence threshold */
    confidenceThreshold: number;
    /** Enable OCR for text extraction */
    enableOCR: boolean;
    /** Enable element detection */
    enableElementDetection: boolean;
    /** Custom prompts for goal extraction */
    customPrompts?: Record<string, string>;
}
export declare class VideoReplayAnalyzer extends EventEmitter {
    private config;
    private analysisHistory;
    private frameCache;
    constructor();
    /**
     * Configure the Video Analyzer
     */
    configure(config: Partial<VideoAnalyzerConfig>): void;
    /**
     * Analyze MP4 video file and extract Sovereign Goals
     */
    analyzeVideo(videoBuffer: ArrayBuffer, filename?: string): Promise<SovereignGoal[]>;
    /**
     * Extract video metadata
     */
    private extractVideoMetadata;
    /**
     * Extract frames from video at specified rate
     */
    private extractFrames;
    /**
     * Analyze single frame using Vision AI
     */
    private analyzeFrame;
    /**
     * Build prompt for frame analysis
     */
    private buildFrameAnalysisPrompt;
    /**
     * Call Gemini Vision API
     */
    private callVisionAPI;
    /**
     * Parse Vision API response
     */
    private parseVisionResponse;
    /**
     * Parse elements from Vision response
     */
    private parseElements;
    /**
     * Generate CSS selector for element
     */
    private generateSelector;
    /**
     * Detect changes between frames
     */
    private detectFrameChanges;
    /**
     * Extract action sequences from frame analyses
     */
    private extractActionSequences;
    /**
     * Find element at cursor position
     */
    private findElementAtPosition;
    /**
     * Estimate action duration
     */
    private estimateActionDuration;
    /**
     * Merge consecutive similar actions
     */
    private mergeConsecutiveActions;
    /**
     * Extract Sovereign Goals from action sequences
     */
    private extractSovereignGoals;
    /**
     * Group actions into logical sequences
     */
    private groupActionsIntoSequences;
    /**
     * Create Sovereign Goal from action sequence
     */
    private createSovereignGoal;
    /**
     * Classify goal type based on actions
     */
    private classifyGoalType;
    /**
     * Generate human-readable goal description
     */
    private generateGoalDescription;
    /**
     * Determine goal priority
     */
    private determineGoalPriority;
    /**
     * Collect unique elements from actions
     */
    private collectUniqueElements;
    /**
     * Calculate goal confidence
     */
    private calculateGoalConfidence;
    /**
     * Generate test code from Sovereign Goal
     */
    generateTestCode(goal: SovereignGoal): string;
    /**
     * Generate code for single action
     */
    private generateActionCode;
    private uint8ArrayToBase64;
    private generateGoalId;
    /**
     * Get analysis history
     */
    getHistory(): SovereignGoal[];
    /**
     * Get statistics
     */
    getStats(): {
        totalGoals: number;
        byType: Record<GoalType, number>;
        averageConfidence: number;
        averageActionsPerGoal: number;
    };
    /**
     * Clear history and cache
     */
    clear(): void;
}
export default VideoReplayAnalyzer;
//# sourceMappingURL=video-replay-analyzer.d.ts.map