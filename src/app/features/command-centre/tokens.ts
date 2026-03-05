import { FindingSeverity, FindingSource, FindingStatus } from './types';

export const severityColors: Record<FindingSeverity, string> = {
  high: '#EF4444',
  medium: '#F97316',
  low: '#EAB308',
};

export const sourceColors: Record<FindingSource, string> = {
  ai: '#0052FF',
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

export const accentColor = '#0052FF';
export const accentSecondary = '#4D7CFF';
export const accentGradient = 'linear-gradient(135deg, #0052FF, #4D7CFF)';

export const displayFontFamily = '"Calistoga", Georgia, serif';
export const uiFontFamily = '"Inter", system-ui, sans-serif';
export const monoFontFamily = '"JetBrains Mono", monospace';

export const baseFontFamily = uiFontFamily;

export const shadowAccent = '0 4px 14px rgba(0,82,255,0.25)';
export const shadowAccentLg = '0 8px 24px rgba(0,82,255,0.35)';
export const shadowMd = '0 4px 6px rgba(0,0,0,0.07)';
