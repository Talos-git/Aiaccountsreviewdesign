export type FinancialStatement = 'balance_sheet' | 'pl';

export type Severity = 'high' | 'medium' | 'low';

export type Assertion = 'C' | 'E' | 'A';

export type FindingStatus = 'pending' | 'irrelevant' | 'complete' | 'needs_action';

export type FindingSource = 'AI' | 'Code';

export type SectionPath = {
  statement: FinancialStatement;
  category: string;
  account: string;
};

export type SelectedSection = Partial<SectionPath>;

export type Finding = {
  id: string;
  section: SectionPath;
  title: string;
  description: string;
  severity: Severity;
  assertion: Assertion;
  source: FindingSource;
  status: FindingStatus;
  accountantNotes: string;
  amount?: number;
  context?: string;
  actionRequired?: string;
  supportingData?: Record<string, string>;
};

export type ReviewStatus = 'in_review' | 'awaiting_bookkeeper_fixes';

export type ReviewMeta = {
  companyName: string;
  periodLabel: string;
  version: string;
  createdDateIso: string;
  status: ReviewStatus;
};

export type SectionNode = {
  id: string;
  label: string;
  count: number;
  section: SelectedSection;
  children: SectionNode[];
};

export type FindingsSummary = {
  total: number;
  bySeverity: Record<Severity, number>;
  byAssertion: Record<Assertion, number>;
  byStatus: Record<FindingStatus, number>;
};

