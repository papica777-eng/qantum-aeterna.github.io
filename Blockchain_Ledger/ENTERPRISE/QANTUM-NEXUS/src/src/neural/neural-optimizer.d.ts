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
 * Cache statistics
 */
export interface CacheStats {
    hits: number;
    misses: number;
    evictions: number;
    currentSize: number;
    maxSize: number;
    itemCount: number;
    hitRate: number;
    memoryUsage: number;
}
/**
 * Pattern for deduplication
 */
export interface Pattern {
    id: string;
    pattern: string;
    frequency: number;
    lastSeen: number;
    contexts: string[];
}
/**
 * Compressed heuristics structure
 */
export interface CompressedHeuristics {
    version: string;
    compressionRatio: number;
    patterns: Pattern[];
    selectors: Map<string, number>;
    metadata: {
        originalSize: number;
        compressedSize: number;
        patternCount: number;
        timestamp: number;
    };
}
/**
 * 🧠 LRUCache - Least Recently Used Cache Implementation
 *
 * High-performance cache with O(1) get/put operations.
 * Automatically evicts least recently used items when capacity is reached.
 */
export declare class LRUCache<K, V> extends EventEmitter {
    private capacity;
    private maxMemory;
    private cache;
    private head;
    private tail;
    private currentMemory;
    private stats;
    constructor(capacity?: number, maxMemoryMB?: number);
    /**
     * Get value from cache
     */
    get(key: K): V | undefined;
    /**
     * Put value in cache
     */
    put(key: K, value: V, sizeBytes?: number): void;
    /**
     * Check if key exists
     */
    has(key: K): boolean;
    /**
     * Delete key from cache
     */
    delete(key: K): boolean;
    /**
     * Clear the cache
     */
    clear(): void;
    /**
     * Get cache statistics
     */
    getStats(): CacheStats;
    /**
     * Get most frequently accessed items
     */
    getHotItems(count?: number): Array<{
        key: K;
        accessCount: number;
    }>;
    /**
     * Move node to head of list
     */
    private moveToHead;
    /**
     * Add node to head
     */
    private addToHead;
    /**
     * Remove node from list
     */
    private removeNode;
    /**
     * Check if eviction is needed
     */
    private shouldEvict;
    /**
     * Evict least recently used item
     */
    private evictLRU;
    /**
     * Update hit rate statistic
     */
    private updateHitRate;
    /**
     * Estimate size of value in bytes
     */
    private estimateSize;
    /**
     * Get current size
     */
    get size(): number;
}
/**
 * 🗜️ PatternDeduplicator - Compresses repetitive patterns
 *
 * Identifies and deduplicates common patterns in selector data
 * to reduce memory footprint and improve lookup speed.
 */
export declare class PatternDeduplicator extends EventEmitter {
    private patterns;
    private patternIndex;
    private nextPatternId;
    /**
     * Extract and deduplicate patterns from selectors
     */
    deduplicate(selectors: string[]): {
        compressed: Map<string, string>;
        patterns: Pattern[];
        compressionRatio: number;
    };
    /**
     * Extract patterns from a selector
     */
    private extractPatterns;
    /**
     * Get existing pattern or create new one
     */
    private getOrCreatePattern;
    /**
     * Simple hash function for patterns
     */
    private hashPattern;
    /**
     * Calculate compressed size
     */
    private calculateCompressedSize;
    /**
     * Get most common patterns
     */
    getTopPatterns(count?: number): Pattern[];
    /**
     * Clear all patterns
     */
    clear(): void;
}
/**
 * 🧠 NeuralOptimizer - Main Knowledge Optimization Engine
 *
 * Combines LRU caching and pattern deduplication for optimal
 * memory usage and fast selector lookups.
 */
export declare class NeuralOptimizer extends EventEmitter {
    private selectorCache;
    private heuristicsCache;
    private deduplicator;
    private compressionEnabled;
    constructor(options?: {
        selectorCacheSize?: number;
        heuristicsCacheSize?: number;
        maxMemoryMB?: number;
    });
    /**
     * Cache a selector mapping
     */
    cacheSelector(intent: string, selector: string): void;
    /**
     * Get cached selector
     */
    getSelector(intent: string): string | undefined;
    /**
     * Cache heuristic data
     */
    cacheHeuristic(key: string, data: unknown): void;
    /**
     * Get cached heuristic
     */
    getHeuristic(key: string): unknown | undefined;
    /**
     * Compress and optimize global_heuristics.json
     */
    optimizeHeuristicsFile(filePath: string): Promise<{
        originalSize: number;
        compressedSize: number;
        compressionRatio: number;
        patternCount: number;
    }>;
    /**
     * Load optimized heuristics file
     */
    loadOptimizedHeuristics(filePath: string): Promise<CompressedHeuristics>;
    /**
     * Extract selectors from heuristics object
     */
    private extractSelectorsFromHeuristics;
    /**
     * Gzip compress
     */
    private gzipCompress;
    /**
     * Gzip decompress
     */
    private gzipDecompress;
    /**
     * Get combined cache statistics
     */
    getStats(): {
        selectors: CacheStats;
        heuristics: CacheStats;
        topPatterns: Pattern[];
    };
    /**
     * Clear all caches
     */
    clear(): void;
    /**
     * Get hot selectors for preloading
     */
    getHotSelectors(count?: number): Array<{
        key: string;
        accessCount: number;
    }>;
    /**
     * Preload frequently used selectors
     */
    preload(selectors: Array<{
        intent: string;
        selector: string;
    }>): void;
}
export declare const neuralOptimizer: NeuralOptimizer;
//# sourceMappingURL=neural-optimizer.d.ts.map