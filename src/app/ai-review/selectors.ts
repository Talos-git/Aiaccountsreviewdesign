import type {
  Assertion,
  Finding,
  FindingStatus,
  FindingsSummary,
  FinancialStatement,
  SectionNode,
  SelectedSection,
  Severity,
} from './types';

function encodePart(value: string): string {
  return encodeURIComponent(value);
}

export function makeSectionId(section: SelectedSection): string {
  const parts: string[] = [];

  if (section.statement) {
    parts.push(`st:${section.statement}`);
  }
  if (section.category) {
    parts.push(`cat:${encodePart(section.category)}`);
  }
  if (section.account) {
    parts.push(`acc:${encodePart(section.account)}`);
  }

  return parts.join('::');
}

export function buildSectionTree(findings: Finding[]): SectionNode[] {
  const byStatement = new Map<FinancialStatement, Finding[]>();
  for (const finding of findings) {
    const st = finding.section.statement;
    const existing = byStatement.get(st);
    if (existing) {
      existing.push(finding);
    } else {
      byStatement.set(st, [finding]);
    }
  }

  const statementOrder: FinancialStatement[] = ['balance_sheet', 'pl'];

  return statementOrder
    .filter((st) => byStatement.has(st))
    .map((st) => {
      const statementFindings = byStatement.get(st) ?? [];

      const byCategory = new Map<string, Finding[]>();
      for (const finding of statementFindings) {
        const cat = finding.section.category;
        const existing = byCategory.get(cat);
        if (existing) {
          existing.push(finding);
        } else {
          byCategory.set(cat, [finding]);
        }
      }

      const categoryNodes: SectionNode[] = Array.from(byCategory.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([category, categoryFindings]) => {
          const byAccount = new Map<string, Finding[]>();
          for (const finding of categoryFindings) {
            const acc = finding.section.account;
            const existing = byAccount.get(acc);
            if (existing) {
              existing.push(finding);
            } else {
              byAccount.set(acc, [finding]);
            }
          }

          const accountNodes: SectionNode[] = Array.from(byAccount.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([account, accountFindings]) => {
              const section: SelectedSection = { statement: st, category, account };
              return {
                id: makeSectionId(section),
                label: account,
                count: accountFindings.length,
                section,
                children: [],
              };
            });

          const section: SelectedSection = { statement: st, category };
          return {
            id: makeSectionId(section),
            label: category,
            count: categoryFindings.length,
            section,
            children: accountNodes,
          };
        });

      const section: SelectedSection = { statement: st };
      return {
        id: makeSectionId(section),
        label: st === 'balance_sheet' ? 'Balance Sheet' : 'P&L',
        count: statementFindings.length,
        section,
        children: categoryNodes,
      };
    });
}

export function flattenSectionIds(nodes: SectionNode[]): string[] {
  const ids: string[] = [];

  const walk = (nodeList: SectionNode[]) => {
    for (const node of nodeList) {
      ids.push(node.id);
      if (node.children.length > 0) {
        walk(node.children);
      }
    }
  };

  walk(nodes);
  return ids;
}

export function isFindingInSelectedSection(finding: Finding, selected: SelectedSection): boolean {
  if (selected.statement && finding.section.statement !== selected.statement) return false;
  if (selected.category && finding.section.category !== selected.category) return false;
  if (selected.account && finding.section.account !== selected.account) return false;
  return true;
}

export function filterFindings(findings: Finding[], selected: SelectedSection): Finding[] {
  if (!selected.statement && !selected.category && !selected.account) return findings;
  return findings.filter((f) => isFindingInSelectedSection(f, selected));
}

export function emptySummary(): FindingsSummary {
  const bySeverity: Record<Severity, number> = { high: 0, medium: 0, low: 0 };
  const byAssertion: Record<Assertion, number> = { C: 0, E: 0, A: 0 };
  const byStatus: Record<FindingStatus, number> = { pending: 0, irrelevant: 0, complete: 0, needs_action: 0 };

  return { total: 0, bySeverity, byAssertion, byStatus };
}

export function buildFindingsSummary(findings: Finding[]): FindingsSummary {
  const summary = emptySummary();

  for (const f of findings) {
    summary.total += 1;
    summary.bySeverity[f.severity] += 1;
    summary.byAssertion[f.assertion] += 1;
    summary.byStatus[f.status] += 1;
  }

  return summary;
}

