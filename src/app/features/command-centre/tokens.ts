import { FindingSeverity, FindingSource, FindingStatus } from './types';

export const statusLabel: Record<FindingStatus, string> = {
  draft_ai: 'Draft (AI)',
  draft_human: 'Draft (Manual)',
  needs_action: 'Needs Action',
  in_review: 'In Review',
  complete: 'Complete',
  irrelevant: 'Irrelevant',
};

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
  draft_ai: '#9CA3AF',
  draft_human: '#60A5FA',
  needs_action: '#F59E0B',
  in_review: '#8B5CF6',
  complete: '#22C55E',
  irrelevant: '#6B7280',
};

export const roleColors = {
  accountant: '#0052FF',
  bookkeeper: '#7C3AED',
};

export const assertionColors: Record<string, string> = {
  C: '#2563EB',
  E: '#16A34A',
  A: '#7C3AED',
};

export const accentColor = '#0052FF';
export const accentSecondary = '#4D7CFF';
export const accentGradient = 'linear-gradient(135deg, #0052FF, #4D7CFF)';

export const displayFontFamily = '"Open Sans", system-ui, sans-serif';
export const uiFontFamily = '"Open Sans", system-ui, sans-serif';
export const monoFontFamily = '"Open Sans", system-ui, sans-serif';

export const baseFontFamily = uiFontFamily;

export const shadowAccent = '0 4px 14px rgba(0,82,255,0.25)';
export const shadowAccentLg = '0 8px 24px rgba(0,82,255,0.35)';
export const shadowMd = '0 4px 6px rgba(0,0,0,0.07)';
