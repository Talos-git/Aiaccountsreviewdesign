import { ConversationMessage, Finding, FindingSeverity, FindingStatus, ReviewData } from './types';

const severityByIndex = (index: number): FindingSeverity => {
  if (index < 12) {
    return 'critical';
  }

  if (index < 40) {
    return 'warning';
  }

  return 'info';
};

const accountPool = [
  { accountName: 'Accounts Receivable', section: 'Balance Sheet', category: 'Current Assets > Accounts Receivable' },
  { accountName: 'Service Revenue', section: 'Profit & Loss', category: 'Revenue > Service Revenue' },
  { accountName: 'Depreciation Expense', section: 'Profit & Loss', category: 'Operating Expenses > Depreciation' },
  { accountName: 'Prepaid Expenses', section: 'Balance Sheet', category: 'Current Assets > Prepaid Expenses' },
  { accountName: 'Accrued Liabilities', section: 'Balance Sheet', category: 'Current Liabilities > Accruals' },
  { accountName: 'FX Clearing', section: 'Profit & Loss', category: 'Other Income/Expense > FX Gain/Loss' },
  { accountName: 'Accounts Payable', section: 'Balance Sheet', category: 'Current Liabilities > Accounts Payable' },
  { accountName: 'Administrative Expense', section: 'Profit & Loss', category: 'Operating Expenses > Admin Expense' },
  { accountName: 'Deferred Revenue', section: 'Balance Sheet', category: 'Current Liabilities > Deferred Revenue' },
  { accountName: 'Cost of Sales', section: 'Profit & Loss', category: 'Cost of Sales > Direct Costs' },
];

const templates = [
  {
    title: 'AR balance overstated by $12,400',
    amount: 12400,
    description: 'AR aging report shows a $12,400 discrepancy against the GL balance. Three invoices (INV-2241, INV-2289) appear duplicated in the sub-ledger, inflating the current AR balance.',
    actionRequired: 'Reconcile aging report vs GL and adjust write-offs',
    evidence: { refs: ['INV-2241', 'INV-2289'] },
    findingType: 'discrepancy',
    assertion: 'Completeness',
    source: 'ai' as const,
  },
  {
    title: 'Revenue posted without invoice support',
    amount: 9800,
    description: 'Revenue of $9,800 posted under JE-1194 lacks a supporting invoice. SO-2081 references a delivery not yet completed, indicating premature revenue recognition.',
    actionRequired: 'Attach invoice pack and reverse unsupported journals',
    evidence: { refs: ['JE-1194', 'SO-2081'] },
    findingType: 'classification',
    assertion: 'Existence',
    source: 'ai' as const,
  },
  {
    title: 'Duplicate INV-2241 posted across periods',
    amount: 12400,
    description: 'INV-2241 has been posted twice: once in Jul and again in Sep under AR-ROLL-2024Q3. The duplicate creates a $12,400 overstatement in the current AR balance.',
    actionRequired: 'Void duplicate entry and re-run AR rollforward',
    evidence: { refs: ['INV-2241', 'AR-ROLL-2024Q3'] },
    findingType: 'discrepancy',
    assertion: 'Accuracy',
    source: 'ai' as const,
  },
  {
    title: 'Depreciation schedule mismatch to fixed asset register',
    amount: 6400,
    description: 'Depreciation schedule shows useful life of 5 years for Asset Group B, but the fixed asset register records 7 years. This creates a $6,400 annual overstatement of depreciation expense.',
    actionRequired: 'Update asset useful life assumptions and rerun depreciation',
    evidence: { refs: ['FAR-SEP', 'DEP-SCHED-09'] },
    findingType: 'discrepancy',
    assertion: 'Accuracy',
    source: 'code' as const,
  },
  {
    title: 'Prepaid insurance not amortised in current quarter',
    amount: 5200,
    description: 'Prepaid insurance balance of $5,200 has not been amortised for Jul-Sep 2024. Monthly amortisation of approximately $433 should have been posted each month.',
    actionRequired: 'Post monthly amortisation entries for Jul-Sep',
    evidence: { refs: ['PPD-INS-001', 'JE-1203'] },
    findingType: 'timing',
    assertion: 'Completeness',
    source: 'code' as const,
  },
  {
    title: 'Aging bucket discrepancy against AR control account',
    amount: 4380,
    description: 'AR aging bucket movements do not reconcile to the AR control account for the period. The unreconciled difference of $4,380 spans the 61-90 day and 90+ day buckets.',
    actionRequired: 'Tie bucket movements to customer statement exports',
    evidence: { refs: ['AR-AGING-0930', 'CUS-STMT-EXPORT'] },
    findingType: 'discrepancy',
    assertion: 'Completeness',
    source: 'ai' as const,
  },
  {
    title: 'Accrual timing mismatch for payroll liabilities',
    amount: 3700,
    description: 'Payroll accrual of $3,700 was posted in the wrong month. The accrual relates to August payroll but was recorded in September, distorting both months.',
    actionRequired: 'Move accrual to correct month and update support memo',
    evidence: { refs: ['PAY-ACCR-SEP', 'JE-1178'] },
    findingType: 'timing',
    assertion: 'Accuracy',
    source: 'code' as const,
  },
  {
    title: 'FX rounding variance exceeds threshold',
    amount: 48,
    description: 'FX revaluation run on 30-Sep produced a residual rounding variance of $48 that was not posted. This exceeds the $25 materiality threshold for FX rounding entries.',
    actionRequired: 'Post residual rounding true-up entry',
    evidence: { refs: ['FX-REVAL-0930'] },
    findingType: 'discrepancy',
    assertion: 'Accuracy',
    source: 'ai' as const,
  },
  {
    title: 'Supplier statement unmatched against AP ledger',
    amount: 6850,
    description: 'Supplier statement from Vendor 77 shows $6,850 in invoices not reflected in the AP sub-ledger. Two invoices are missing and one shows a different amount.',
    actionRequired: 'Resolve unmatched invoices and update AP reconciliation',
    evidence: { refs: ['SUP-STMT-77', 'AP-RECON-SEP'] },
    findingType: 'discrepancy',
    assertion: 'Completeness',
    source: 'code' as const,
  },
  {
    title: 'Admin expense classified to cost of sales',
    amount: 2590,
    description: 'A $2,590 administrative expense (office supplies, JE-1242) was incorrectly classified under Cost of Sales. This understates gross profit and overstates operating expenses.',
    actionRequired: 'Reclass to admin expense category and document rationale',
    evidence: { refs: ['JE-1242'] },
    findingType: 'classification',
    assertion: 'Classification',
    source: 'ai' as const,
  },
  {
    title: 'Deferred revenue recognised before service delivery',
    amount: 8125,
    description: 'Deferred revenue of $8,125 was recognised in the period before the corresponding service delivery was completed. Delivery log shows service scheduled for Oct 2024.',
    actionRequired: 'Reverse premature recognition and align with delivery log',
    evidence: { refs: ['REV-DEF-032', 'DELIVERY-LOG-Q3'] },
    findingType: 'timing',
    assertion: 'Existence',
    source: 'code' as const,
  },
  {
    title: 'Missing supporting file for manual journal',
    amount: 1490,
    description: 'Manual journal JE-1267 for $1,490 has no supporting worksheet attached. The journal description references an intercompany allocation but no backing document exists in the file store.',
    actionRequired: 'Attach supporting worksheet and reviewer sign-off',
    evidence: { refs: ['JE-1267', 'MANUAL-JE-CHECK'] },
    findingType: 'classification',
    assertion: 'Existence',
    source: 'ai' as const,
  },
];

const initialReviewedIndices = new Set([0, 1, 5, 8, 11, 14, 19, 25, 30, 34, 40, 45]);

const statusForIndex = (index: number): FindingStatus => {
  if (!initialReviewedIndices.has(index)) {
    return 'open';
  }

  return index % 2 === 0 ? 'irrelevant' : 'resolved';
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
  1: 'sent_to_bookkeeper',
  2: 'noted',
  3: 'sent_to_bookkeeper',
  4: 'noted',
};

const seededAccountantNotes: Record<number, string> = {
  1: 'Client confirmed invoice posted in error. Awaiting corrected invoice pack from customer.',
  3: 'Agreed with bookkeeper — 7-year life is correct per purchase agreement. Comparative period update still pending.',
  4: 'Amortisation entries missing for Jul, Aug, Sep. Bookkeeper to post $433/month for each month.',
};

const buildFinding = (index: number): Finding => {
  const template = templates[index % templates.length];
  const account = accountPool[index % accountPool.length];
  const adjustedAmount = template.amount + Math.round(index * 63.4);

  const baseStatus = statusForIndex(index);
  const status = seededStatuses[index] ?? baseStatus;
  const messages: ConversationMessage[] = seededMessages[index] ?? [];
  const accountantNote = seededAccountantNotes[index] ?? '';

  return {
    id: `finding-${index + 1}`,
    title: index < templates.length ? template.title : `${template.title} (${index + 1})`,
    severity: severityByIndex(index),
    status,
    source: index === 4 ? 'code' : template.source,
    section: account.section,
    accountName: account.accountName,
    category: account.category,
    assertion: template.assertion,
    findingType: template.findingType,
    amount: adjustedAmount,
    description: template.description,
    actionRequired: template.actionRequired,
    accountantNote,
    evidence: { refs: template.evidence.refs },
    checkId: `check-${(index % 20) + 1}`,
    messages,
  };
};

export const mockReviewData: ReviewData = {
  meta: {
    reviewId: 'review-fy2024-q3',
    title: 'Accounts Review',
    clientName: 'Acme Corp',
    periodStart: '2024-01-01',
    periodEnd: '2024-09-30',
    versionLabel: 'v2',
  },
  findings: Array.from({ length: 52 }, (_, index) => buildFinding(index)),
};

export const defaultCurrentFindingId = 'finding-3';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};
