// Complexity: O(1) for all utility functions
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// ── Core class utility ────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Formatting utilities ──────────────────────────────────────────────────

/**
 * Format duration in milliseconds to human-readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}m ${Math.floor((ms % 60_000) / 1000)}s`;
  return `${Math.floor(ms / 3_600_000)}h ${Math.floor((ms % 3_600_000) / 60_000)}m`;
}

/**
 * Format a date to relative or absolute human-readable string
 */
export function formatDate(date: string | Date, relative = true): string {
  const d = new Date(date);
  if (relative) {
    const now = Date.now();
    const diff = now - d.getTime();

    if (diff < 60_000) return 'just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return `${Math.floor(diff / 86_400_000)}d ago`;
  }
  return d.toLocaleString();
}

/**
 * Format a percentage number (0-100) with % symbol
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// ── Status color utilities ────────────────────────────────────────────────

type StatusKey = 'SUCCESS' | 'FAILED' | 'PENDING' | 'RUNNING' | 'HEALED' | 'SKIPPED' | string;

const STATUS_TEXT_COLORS: Record<string, string> = {
  SUCCESS: 'text-emerald-400',
  HEALED:  'text-cyan-400',
  PENDING: 'text-gray-400',
  RUNNING: 'text-blue-400',
  FAILED:  'text-red-400',
  SKIPPED: 'text-amber-400',
};

const STATUS_BG_COLORS: Record<string, string> = {
  SUCCESS: 'bg-emerald-500/10 border-emerald-500/30',
  HEALED:  'bg-cyan-500/10 border-cyan-500/30',
  PENDING: 'bg-gray-500/10 border-gray-500/30',
  RUNNING: 'bg-blue-500/10 border-blue-500/30',
  FAILED:  'bg-red-500/10 border-red-500/30',
  SKIPPED: 'bg-amber-500/10 border-amber-500/30',
};

/**
 * Get Tailwind text color class for a run status
 */
export function getStatusColor(status: StatusKey): string {
  return STATUS_TEXT_COLORS[status.toUpperCase()] ?? 'text-gray-400';
}

/**
 * Get Tailwind bg color class for a run status badge
 */
export function getStatusBg(status: StatusKey): string {
  return STATUS_BG_COLORS[status.toUpperCase()] ?? 'bg-gray-500/10 border-gray-500/30';
}

// ── Numeric utilities ─────────────────────────────────────────────────────

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Format large numbers with K/M/B suffix
 */
export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
