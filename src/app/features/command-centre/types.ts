export type FindingSeverity = 'high' | 'medium' | 'low';

export type FindingStatus = 'draft_ai' | 'draft_human' | 'needs_action' | 'in_review' | 'complete' | 'irrelevant';

export type FindingSource = 'ai' | 'code';

export type AssertionType = 'C' | 'E' | 'A';

export type QueueSortMode = 'severity' | 'amount' | 'account';

export type QueueStatusFilter = 'all' | FindingStatus;

export type QueuePathFilter = 'all' | string;

export type BulkAction = 'mark_irrelevant' | 'mark_complete';

export type MessageAuthor = 'ai' | 'accountant' | 'bookkeeper';

export interface ConversationMessage {
  id: string;
  author: MessageAuthor;
  text: string;
  timestamp: number;
}

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
  messages: ConversationMessage[];
}

export interface ReviewData {
  meta: ReviewMeta;
  findings: Finding[];
}
