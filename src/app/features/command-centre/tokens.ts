import { FindingSeverity, FindingSource, FindingStatus } from './types';

export const severityColors: Record<FindingSeverity, string> = {
  high: '#EF4444',
  medium: '#F97316',
  low: '#EAB308',
};

export const sourceColors: Record<FindingSource, string> = {
  ai: '#3B82F6',
  code: '#8B5CF6',
};

export const statusColors: Record<FindingStatus, string> = {
  pending: '#9CA3AF',
  complete: '#22C55E',
  irrelevant: '#6B7280',
  needs_action: '#F59E0B',
};

export const assertionColors: Record<string, string> = {
  C: '#2563EB',
  E: '#16A34A',
  A: '#7C3AED',
};

export const baseFontFamily = `"Suisse Int'l", "Avenir Next", "Segoe UI", sans-serif`;
