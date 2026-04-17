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
 * Memory segment configuration
 */
export interface MemorySegmentConfig {
    /** Segment name */
    name: string;
    /** Size in bytes */
    size: number;
    /** Initial value pattern */
    initialValue?: number;
    /** Alignment in bytes (default: 64 for cache line) */
    alignment?: number;
}
/**
 * Shared memory statistics
 */
export interface SharedMemoryStats {
    totalAllocated: number;
    totalSegments: number;
    readOperations: number;
    writeOperations: number;
    casOperations: number;
    contentionCount: number;
    avgLatencyNs: number;
    peakLatencyNs: number;
}
/**
 * Memory operation result
 */
export interface MemoryOpResult<T = number> {
    success: boolean;
    value?: T;
    previousValue?: T;
    latencyNs: number;
}
/**
 * Memory segment with atomic operations
 */
export interface MemorySegment {
    id: string;
    name: string;
    buffer: SharedArrayBuffer;
    view: Int32Array;
    size: number;
    alignment: number;
    createdAt: number;
    lastAccess: number;
    accessCount: number;
}
/**
 * SharedMemoryV2 - Lock-Free High-Performance Memory Manager
 *
 * Features:
 * - Zero GC pressure through SharedArrayBuffer
 * - Lock-free atomic operations via Atomics
 * - Cache-line aligned allocations for Ryzen L3 optimization
 * - Deadlock-free spinlocks with exponential backoff
 * - Real-time performance telemetry
 */
export declare class SharedMemoryV2 extends EventEmitter {
    private segments;
    private segmentNameIndex;
    private nextSegmentId;
    private stats;
    private latencyBuffer;
    private readonly MAX_LATENCY_SAMPLES;
    private readonly CACHE_LINE_SIZE;
    constructor();
    /**
     * Allocate a new memory segment
     */
    allocateSegment(config: MemorySegmentConfig): MemorySegment;
    /**
     * Get segment by ID
     */
    getSegment(id: string): MemorySegment | undefined;
    /**
     * Get segment by name
     */
    getSegmentByName(name: string): MemorySegment | undefined;
    /**
     * Deallocate a segment
     */
    deallocateSegment(id: string): boolean;
    /**
     * Atomic read operation
     */
    atomicRead(segmentId: string, index: number): MemoryOpResult;
    /**
     * Atomic write operation
     */
    atomicWrite(segmentId: string, index: number, value: number): MemoryOpResult;
    /**
     * Compare-and-swap (CAS) operation - Foundation for lock-free algorithms
     */
    compareAndSwap(segmentId: string, index: number, expectedValue: number, newValue: number): MemoryOpResult;
    /**
     * Atomic add operation
     */
    atomicAdd(segmentId: string, index: number, addend: number): MemoryOpResult;
    /**
     * Atomic bitwise OR operation
     */
    atomicOr(segmentId: string, index: number, mask: number): MemoryOpResult;
    /**
     * Atomic bitwise AND operation
     */
    atomicAnd(segmentId: string, index: number, mask: number): MemoryOpResult;
    /**
     * Acquire spinlock with exponential backoff
     * Returns lock acquisition time in nanoseconds
     */
    acquireSpinlock(segmentId: string, lockIndex: number, maxSpins?: number): MemoryOpResult;
    /**
     * Release spinlock
     */
    releaseSpinlock(segmentId: string, lockIndex: number): MemoryOpResult;
    /**
     * Wait for lock with timeout
     */
    waitForLock(segmentId: string, lockIndex: number, timeoutMs?: number): MemoryOpResult;
    /**
     * Create a lock-free ring buffer segment
     * Layout: [head (4 bytes), tail (4 bytes), size (4 bytes), data...]
     */
    createRingBuffer(name: string, capacity: number): MemorySegment;
    /**
     * Push to ring buffer (lock-free)
     */
    ringBufferPush(segmentId: string, value: number): boolean;
    /**
     * Pop from ring buffer (lock-free)
     */
    ringBufferPop(segmentId: string): MemoryOpResult;
    /**
     * Bulk read operation (returns copy)
     */
    bulkRead(segmentId: string, startIndex: number, length: number): MemoryOpResult<Int32Array>;
    /**
     * Bulk write operation
     */
    bulkWrite(segmentId: string, startIndex: number, data: Int32Array): MemoryOpResult;
    /**
     * Get current statistics
     */
    getStats(): SharedMemoryStats;
    /**
     * Get detailed segment info
     */
    getSegmentInfo(segmentId: string): {
        id: string;
        name: string;
        size: number;
        alignment: number;
        accessCount: number;
        createdAt: number;
        lastAccess: number;
    } | undefined;
    /**
     * Get all segment names
     */
    getSegmentNames(): string[];
    /**
     * Reset statistics
     */
    resetStats(): void;
    /**
     * Align size to cache line
     */
    private alignSize;
    /**
     * Get high-resolution time in nanoseconds
     */
    private getHighResTime;
    /**
     * Record latency for statistics
     */
    private recordLatency;
    /**
     * CPU spin wait (reduces bus contention)
     */
    private spinWait;
    /**
     * Cleanup all segments
     */
    cleanup(): void;
}
export declare function getSharedMemoryV2(): SharedMemoryV2;
export default SharedMemoryV2;
//# sourceMappingURL=shared-memory-v2.d.ts.map