export type FindingSeverity = 'critical' | 'warning' | 'info';

export type FindingStatus = 'open' | 'noted' | 'resolved' | 'sent_to_bookkeeper' | 'irrelevant';

export type FindingSource = 'ai' | 'code';

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
  periodStart: string;
  periodEnd: string;
  versionLabel: string;
}

export interface Finding {
  id: string;
  title: string;
  severity: FindingSeverity;
  status: FindingStatus;
  source: FindingSource;
  section: string;
  accountName: string;
  category: string;
  assertion: string;
  findingType: string;
  amount: number;
  description: string;
  actionRequired: string;
  accountantNote: string;
  evidence: { refs: string[]; note?: string };
  checkId?: string;
  messages: ConversationMessage[];
}

export interface ReviewData {
  meta: ReviewMeta;
  findings: Finding[];
}
