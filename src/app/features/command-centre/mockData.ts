import { ConversationMessage, Finding, FindingSeverity, FindingStatus, ReviewData } from './types';

const severityByIndex = (index: number): FindingSeverity => {
  if (index < 12) {
    return 'high';
  }

  if (index < 40) {
    return 'medium';
  }

  return 'low';
};

const assertionCycle = ['C', 'E', 'A'] as const;
const assertionLabelByType: Record<(typeof assertionCycle)[number], string> = {
  C: 'Completeness',
  E: 'Existence',
  A: 'Accuracy',
};

const accountPool = [
  '1200 - Accounts Receivable',
  '4100 - Service Revenue',
  '5100 - Depreciation Expense',
  '1300 - Prepaid Expenses',
  '2150 - Accrued Liabilities',
  '1405 - FX Clearing',
  '2200 - Accounts Payable',
  '6100 - Administrative Expense',
  '2500 - Deferred Revenue',
  '8100 - Cost of Sales',
];

const pathByAccount: Record<string, string> = {
  '1200 - Accounts Receivable': 'BS > Current Assets > AR',
  '4100 - Service Revenue': 'PL > Revenue > Service Revenue',
  '5100 - Depreciation Expense': 'PL > Operating Expenses > Depreciation',
  '1300 - Prepaid Expenses': 'BS > Current Assets > Prepayments',
  '2150 - Accrued Liabilities': 'BS > Current Liabilities > Accruals',
  '1405 - FX Clearing': 'PL > Other Income/Expense > FX Gain/Loss',
  '2200 - Accounts Payable': 'BS > Current Liabilities > AP',
  '6100 - Administrative Expense': 'PL > Operating Expenses > Admin Expense',
  '2500 - Deferred Revenue': 'BS > Current Liabilities > Deferred Revenue',
  '8100 - Cost of Sales': 'PL > Cost of Sales > Direct Costs',
};

const templates = [
  {
    title: 'AR balance overstated by $12,400',
    amount: 12400,
    fixLabel: 'Reconcile aging report vs GL and adjust write-offs',
    refs: ['INV-2241', 'INV-2289'],
    source: 'ai' as const,
  },
  {
    title: 'Revenue posted without invoice support',
    amount: 9800,
    fixLabel: 'Attach invoice pack and reverse unsupported journals',
    refs: ['JE-1194', 'SO-2081'],
    source: 'ai' as const,
  },
  {
    title: 'Duplicate INV-2241 posted across periods',
    amount: 12400,
    fixLabel: 'Void duplicate entry and re-run AR rollforward',
    refs: ['INV-2241', 'AR-ROLL-2024Q3'],
    source: 'ai' as const,
  },
  {
    title: 'Depreciation schedule mismatch to fixed asset register',
    amount: 6400,
    fixLabel: 'Update asset useful life assumptions and rerun depreciation',
    refs: ['FAR-SEP', 'DEP-SCHED-09'],
    source: 'code' as const,
  },
  {
    title: 'Prepaid insurance not amortised in current quarter',
    amount: 5200,
    fixLabel: 'Post monthly amortisation entries for Jul-Sep',
    refs: ['PPD-INS-001', 'JE-1203'],
    source: 'code' as const,
  },
  {
    title: 'Aging bucket discrepancy against AR control account',
    amount: 4380,
    fixLabel: 'Tie bucket movements to customer statement exports',
    refs: ['AR-AGING-0930', 'CUS-STMT-EXPORT'],
    source: 'ai' as const,
  },
  {
    title: 'Accrual timing mismatch for payroll liabilities',
    amount: 3700,
    fixLabel: 'Move accrual to correct month and update support memo',
    refs: ['PAY-ACCR-SEP', 'JE-1178'],
    source: 'code' as const,
  },
  {
    title: 'FX rounding variance exceeds threshold',
    amount: 48,
    fixLabel: 'Post residual rounding true-up entry',
    refs: ['FX-REVAL-0930'],
    source: 'ai' as const,
  },
  {
    title: 'Supplier statement unmatched against AP ledger',
    amount: 6850,
    fixLabel: 'Resolve unmatched invoices and update AP reconciliation',
    refs: ['SUP-STMT-77', 'AP-RECON-SEP'],
    source: 'code' as const,
  },
  {
    title: 'Admin expense classified to cost of sales',
    amount: 2590,
    fixLabel: 'Reclass to admin expense category and document rationale',
    refs: ['JE-1242'],
    source: 'ai' as const,
  },
  {
    title: 'Deferred revenue recognised before service delivery',
    amount: 8125,
    fixLabel: 'Reverse premature recognition and align with delivery log',
    refs: ['REV-DEF-032', 'DELIVERY-LOG-Q3'],
    source: 'code' as const,
  },
  {
    title: 'Missing supporting file for manual journal',
    amount: 1490,
    fixLabel: 'Attach supporting worksheet and reviewer sign-off',
    refs: ['JE-1267', 'MANUAL-JE-CHECK'],
    source: 'ai' as const,
  },
];

const initialReviewedIndices = new Set([0, 1, 5, 8, 11, 14, 19, 25, 30, 34, 40, 45]);

const statusForIndex = (index: number): FindingStatus => {
  if (!initialReviewedIndices.has(index)) {
    return 'draft_ai';
  }

  return index % 2 === 0 ? 'irrelevant' : 'complete';
};

const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Pre-seeded conversations for first 5 findings
const BASE_TIME = 1725000000000; // ~Aug 2024

const aiNote = (id: string, text: string): ConversationMessage => ({
  id,
  author: 'ai',
  text,
  timestamp: BASE_TIME,
});

const accountantMsg = (id: string, text: string, offsetMs = 3600000): ConversationMessage => ({
  id,
  author: 'accountant',
  text,
  timestamp: BASE_TIME + offsetMs,
});

const bookkeeperMsg = (id: string, text: string, offsetMs = 7200000): ConversationMessage => ({
  id,
  author: 'bookkeeper',
  text,
  timestamp: BASE_TIME + offsetMs,
});

const seededMessages: Record<number, ConversationMessage[]> = {
  0: [
    aiNote('msg-0-1', 'AR aging report shows $12,400 discrepancy against GL balance. Three invoices (INV-2241, INV-2289) appear duplicated in the sub-ledger. Recommend reconciling aging buckets and reversing duplicate entries.'),
  ],
  1: [
    aiNote('msg-1-1', 'Revenue of $9,800 posted under JE-1194 lacks supporting invoice. SO-2081 references a delivery not yet completed. This appears to be premature revenue recognition.'),
    accountantMsg('msg-1-2', 'Confirmed — client acknowledged the invoice was posted in error. Please reverse JE-1194 and hold until invoice pack is received from the customer. Expected by end of week.'),
  ],
  2: [
    aiNote('msg-2-1', 'INV-2241 has been posted twice: once in Jul and again in Sep under AR-ROLL-2024Q3. The duplicate creates a $12,400 overstatement in current AR balance.'),
    accountantMsg('msg-2-2', 'Please void the Sep entry and re-run the AR rollforward. Note the original Jul entry is correct and should remain.'),
    bookkeeperMsg('msg-2-3', 'Done — Sep entry voided under JE-1301. AR rollforward re-run and balance now agrees to aging report. Attaching updated reconciliation.'),
  ],
  3: [
    aiNote('msg-3-1', 'Depreciation schedule shows useful life of 5 years for Asset Group B, but fixed asset register records 7 years. This creates a $6,400 annual overstatement of depreciation expense.'),
    accountantMsg('msg-3-2', 'The 7-year life is correct per the original purchase agreement. Please update the depreciation schedule to match FAR and rerun for the quarter.'),
    bookkeeperMsg('msg-3-3', 'Updated DEP-SCHED-09 to reflect 7-year life. Depreciation rerun — quarterly charge reduced by $1,600. Journal adjustment posted as JE-1308.'),
    accountantMsg('msg-3-4', 'Reviewed JE-1308 — looks correct. However please also update the comparative period in the working papers so the prior quarter disclosure is consistent.'),
  ],
  4: [
    aiNote('msg-4-1', 'Prepaid insurance balance of $5,200 has not been amortised for Jul-Sep 2024. Monthly amortisation of approximately $433 should have been posted each month.'),
  ],
};

const seededStatuses: Record<number, FindingStatus> = {
  1: 'needs_action',
  2: 'in_review',
  3: 'needs_action',
  4: 'draft_human',
};

const buildFinding = (index: number): Finding => {
  const template = templates[index % templates.length];
  const assertion = assertionCycle[index % assertionCycle.length];
  const accountLabel = accountPool[index % accountPool.length];
  const adjustedAmount = template.amount + Math.round(index * 63.4);

  const baseStatus = statusForIndex(index);
  const status = seededStatuses[index] ?? baseStatus;
  const messages: ConversationMessage[] = seededMessages[index] ?? [];

  return {
    id: `finding-${index + 1}`,
    title: index < templates.length ? template.title : `${template.title} (${index + 1})`,
    severity: severityByIndex(index),
    assertion,
    assertionLabel: assertionLabelByType[assertion],
    pathLabel: pathByAccount[accountLabel],
    source: index === 4 ? 'code' : template.source,
    amount: adjustedAmount,
    amountLabel: formatAmount(adjustedAmount),
    accountLabel,
    periodLabel: 'Jul-Sep 2024',
    fixLabel: template.fixLabel,
    supportingRefs: template.refs,
    status,
    messages,
  };
};

export const mockReviewData: ReviewData = {
  meta: {
    reviewId: 'review-fy2024-q3',
    title: 'Accounts Review',
    clientName: 'Acme Corp',
    periodLabel: 'FY2024 Q3',
    versionLabel: 'v2',
  },
  findings: Array.from({ length: 52 }, (_, index) => buildFinding(index)),
};

export const defaultCurrentFindingId = 'finding-3';
