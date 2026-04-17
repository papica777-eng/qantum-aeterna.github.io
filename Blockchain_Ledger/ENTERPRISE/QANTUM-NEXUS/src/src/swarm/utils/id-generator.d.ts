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
 * For licensing inquiries: dimitar.papazov@QAntum.dev
 * ═══════════════════════════════════════════════════════════════════════════════
 */
/**
 * Generate a unique trace ID (128-bit, W3C Trace Context format)
 * Format: 32 hex characters
 */
export declare function generateTraceId(): string;
/**
 * Generate a unique span ID (64-bit)
 * Format: 16 hex characters
 */
export declare function generateSpanId(): string;
/**
 * Generate a unique task ID
 * Format: task_XXXXXXXXXX
 */
export declare function generateTaskId(): string;
/**
 * Generate a unique message ID
 * Format: msg_XXXXXXXXXX
 */
export declare function generateMessageId(): string;
/**
 * Generate a unique agent ID
 * Format: agent_XXXXXX
 */
export declare function generateAgentId(): string;
/**
 * Generate a unique entry ID
 * Format: entry_XXXXXXXXXX
 */
export declare function generateEntryId(): string;
/**
 * Generate a unique browser context ID
 * Format: ctx_XXXXXX
 */
export declare function generateContextId(): string;
/**
 * Generate a unique plan ID
 * Format: plan_XXXXXXXX
 */
export declare function generatePlanId(): string;
/**
 * Generate a unique feedback ID
 * Format: fb_XXXXXXXX
 */
export declare function generateFeedbackId(): string;
declare const _default: {
    generateTraceId: typeof generateTraceId;
    generateSpanId: typeof generateSpanId;
    generateTaskId: typeof generateTaskId;
    generateMessageId: typeof generateMessageId;
    generateAgentId: typeof generateAgentId;
    generateEntryId: typeof generateEntryId;
    generateContextId: typeof generateContextId;
    generatePlanId: typeof generatePlanId;
    generateFeedbackId: typeof generateFeedbackId;
};
export default _default;
//# sourceMappingURL=id-generator.d.ts.map