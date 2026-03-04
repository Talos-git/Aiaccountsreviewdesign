import type { Assertion, Finding, FindingSource, FindingStatus, ReviewMeta, SectionPath, Severity } from './types';

export const reviewMetaFixture: ReviewMeta = {
  companyName: 'Royale Infinite Pte. Ltd.',
  periodLabel: '1 Jan - 31 Dec 2023',
  version: 'v1',
  createdDateIso: '2026-01-30T03:53:42.948Z',
  status: 'in_review',
};

const sectionPaths: SectionPath[] = [
  { statement: 'balance_sheet', category: 'Current Assets', account: 'Cash & Bank' },
  { statement: 'balance_sheet', category: 'Current Assets', account: 'Accounts Receivable' },
  { statement: 'balance_sheet', category: 'Current Assets', account: 'Inventory' },
  { statement: 'balance_sheet', category: 'Current Assets', account: 'Prepayments' },
  { statement: 'balance_sheet', category: 'Non-Current Assets', account: 'Property, Plant & Equipment' },
  { statement: 'balance_sheet', category: 'Non-Current Assets', account: 'Intangibles' },
  { statement: 'balance_sheet', category: 'Current Liabilities', account: 'Accounts Payable' },
  { statement: 'balance_sheet', category: 'Current Liabilities', account: 'Accruals' },
  { statement: 'balance_sheet', category: 'Equity', account: 'Share Capital' },
  { statement: 'balance_sheet', category: 'Equity', account: 'Retained Earnings' },
  { statement: 'pl', category: 'Revenue', account: 'Sales' },
  { statement: 'pl', category: 'Revenue', account: 'Sales Returns' },
  { statement: 'pl', category: 'Cost of Sales', account: 'COGS' },
  { statement: 'pl', category: 'Operating Expenses', account: 'Salaries' },
  { statement: 'pl', category: 'Operating Expenses', account: 'Rent' },
  { statement: 'pl', category: 'Other Income', account: 'Interest Income' },
];

const titleTemplates = [
  'Unexpected variance detected',
  'Balance does not reconcile to supporting document',
  'Unusual journal entry pattern',
  'Missing supporting document',
  'Potential classification issue',
  'Cutoff appears incorrect',
  'Possible duplicate transaction',
  'Outlier amount vs historical trend',
];

const assertionCycle: Assertion[] = ['C', 'E', 'A'];
const severityCycle: Severity[] = ['high', 'medium', 'low'];
const sourceCycle: FindingSource[] = ['AI', 'Code'];

function buildStatus(i: number): FindingStatus {
  if (i % 23 === 0) return 'irrelevant';
  if (i % 17 === 0) return 'complete';
  if (i % 11 === 0) return 'needs_action';
  return 'pending';
}

export function buildFindingsFixture(count = 60): Finding[] {
  const findings: Finding[] = [];

  for (let i = 1; i <= count; i += 1) {
    const section = sectionPaths[(i - 1) % sectionPaths.length];
    const title = titleTemplates[(i - 1) % titleTemplates.length];
    const status = buildStatus(i);
    const severity = severityCycle[(i - 1) % severityCycle.length];
    const assertion = assertionCycle[(i - 1) % assertionCycle.length];
    const source = sourceCycle[(i - 1) % sourceCycle.length];

    findings.push({
      id: `F-${i}`,
      section,
      title: `${title} (${section.account})`,
      description:
        'Review the transactions and ensure the financial statement presentation is accurate and supported by source documents.',
      severity,
      assertion,
      source,
      status,
      accountantNotes: status === 'needs_action' ? 'Please verify and revert with explanation.' : '',
      amount: Math.round(1250 * i * (severity === 'high' ? 1.6 : severity === 'medium' ? 1.1 : 0.6)),
      context: i % 2 === 0 ? 'Detected based on year-over-year variance and anomaly checks.' : undefined,
      actionRequired: i % 3 === 0 ? 'Confirm classification and provide supporting document(s).' : undefined,
      supportingData:
        i % 5 === 0
          ? {
              'Ledger Entries': `${10 + (i % 7)}`,
              'Last Updated': '2026-01-30',
            }
          : undefined,
    });
  }

  return findings;
}

