export type FindingSeverity = 'high' | 'medium' | 'low';

export type FindingStatus = 'pending' | 'complete' | 'irrelevant' | 'needs_action';

export type FindingSource = 'ai' | 'code';

export type AssertionType = 'C' | 'E' | 'A';

export type QueueSortMode = 'severity' | 'amount' | 'account';

export type BulkAction = 'mark_irrelevant' | 'mark_complete';

export interface ReviewMeta {
  reviewId: string;
  title: string;
  clientName: string;
  periodLabel: string;
  versionLabel: string;
}

export interface Finding {
  id: string;
  title: string;
  severity: FindingSeverity;
  assertion: AssertionType;
  assertionLabel: string;
  pathLabel: string;
  source: FindingSource;
  amount: number;
  amountLabel: string;
  accountLabel: string;
  periodLabel: string;
  fixLabel: string;
  supportingRefs: string[];
  status: FindingStatus;
  notes: string;
}

export interface ReviewData {
  meta: ReviewMeta;
  findings: Finding[];
}
