import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(ms?: number) {
  if (!ms) return '0s';
  const s = Math.round(ms / 1000);
  return `${s}s`;
}

export function formatDate(dateStr?: string | Date) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString();
}

export function getStatusColor(status?: string) {
  switch (status?.toUpperCase()) {
    case 'PASSED': return 'text-emerald-500';
    case 'FAILED': return 'text-red-500';
    case 'RUNNING': return 'text-amber-500';
    default: return 'text-slate-500';
  }
}

export function getStatusBg(status?: string) {
  switch (status?.toUpperCase()) {
    case 'PASSED': return 'bg-emerald-500/10 border-emerald-500/20';
    case 'FAILED': return 'bg-red-500/10 border-red-500/20';
    case 'RUNNING': return 'bg-amber-500/10 border-amber-500/20';
    default: return 'bg-slate-500/10 border-slate-500/20';
  }
}

export function formatPercentage(val?: number) {
  if (val === undefined) return '0%';
  return `${val.toFixed(1)}%`;
}
