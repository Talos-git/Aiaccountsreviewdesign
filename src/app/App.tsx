import { useMemo, useRef, useState } from 'react';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  Link,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  ArrowBack,
  BarChart,
  ChatBubble,
  Close,
  Dashboard,
  Description,
  Folder,
  Home,
  KeyboardArrowDown,
  Launch,
  MenuBook,
  Person,
  Search,
  Send,
  Settings,
  Undo,
} from '@mui/icons-material';
import './ai-review.css';

// Checklist data
const checklistItems = [
  { id: 1, text: 'Functional currency of current year management report is similar to previous year', height: 55 },
  { id: 2, text: 'Issued and paid up capital is accurate', height: 55 },
  {
    id: 3,
    text: 'Revenues are recorded correctly where any debit entries (if any) are accurate and supported by relevant credit notes',
    height: 75,
  },
  {
    id: 4,
    text: 'Cost of sales are recorded correctly where any credit entries (if any) are accurate and supported by relevant credit notes',
    height: 75,
  },
  { id: 5, text: 'Ensure accounts do not show a gross loss in profit and loss statement', height: 55 },
  {
    id: 6,
    text: 'Other income does not consist of any debit entries; and only income from activities not related to the main business',
    height: 75,
  },
  { id: 7, text: 'All expenses year on year are consistent and accurate', height: 55 },
  { id: 8, text: 'Closing bank balance reconciles to bank statement at end of financial year', height: 55 },
  {
    id: 9,
    text: 'All investments are recorded accurately with correct share quantities verified with agreements',
    height: 75,
  },
  { id: 10, text: 'Depreciation or amortisation is done for the year', height: 55 },
  { id: 11, text: 'Inventory or stock is verified against client stock movement or inventory list', height: 55 },
  {
    id: 12,
    text: 'Prepayments, accruals and any interest on loans are recognised correctly with schedules',
    height: 75,
  },
  {
    id: 13,
    text: 'Amounts due to or due from director are recorded in their correct currency and are indeed reimbursable',
    height: 75,
  },
];

type Severity = 'high' | 'medium' | 'low';
type FindingSource = 'ai' | 'code';
type FindingStatus = 'pending' | 'needs_action' | 'complete' | 'irrelevant';

type Finding = {
  id: string;
  title: string;
  amount?: string;
  section: string;
  assertion: 'A' | 'C' | 'E';
  source: FindingSource;
  severity: Severity;
  status: FindingStatus;
  note?: string;
  description: string;
  account: string;
  period: string;
  fixRequired: string;
  supportingData: string;
};

const STATUS_ORDER: FindingStatus[] = ['pending', 'needs_action', 'complete', 'irrelevant'];
const ACCOUNTANT_ID = 'acct-2041';
const REVIEW_ID = 'review-fy2024-q3';
const MOBILE_SWIPE_THRESHOLD = 46;

const severityOrder: Record<Severity, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const statusMeta: Record<FindingStatus, { label: string; color: string; muted?: boolean }> = {
  pending: { label: 'Pending', color: '#6B7280' },
  needs_action: { label: 'Needs Action', color: '#F59E0B' },
  complete: { label: 'Complete', color: '#22C55E' },
  irrelevant: { label: 'Irrelevant', color: '#9CA3AF', muted: true },
};

const sourceMeta: Record<FindingSource, { label: string; icon: string; color: string }> = {
  ai: { label: 'AI', icon: '🤖', color: '#3B82F6' },
  code: { label: 'Code', icon: '⚙', color: '#8B5CF6' },
};

const severityMeta: Record<Severity, { label: string; icon: string; color: string }> = {
  high: { label: 'HIGH', icon: '🔴', color: '#EF4444' },
  medium: { label: 'MED', icon: '🟠', color: '#F97316' },
  low: { label: 'LOW', icon: '🟡', color: '#EAB308' },
};

const seedFindings: Finding[] = [
  {
    id: 'f-001',
    title: 'AR overstated',
    amount: '$12,400',
    section: 'BS › AR',
    assertion: 'C',
    source: 'ai',
    severity: 'high',
    status: 'pending',
    description: 'Accounts receivable aging differs from trial balance detail by customer cohort.',
    account: '1200 Accounts Receivable',
    period: '2024-09',
    fixRequired: 'Validate September invoice matching and reverse duplicate entries where required.',
    supportingData: 'Aging report v2, TB export, invoice ledger extracts',
  },
  {
    id: 'f-002',
    title: 'Revenue without invoice match',
    amount: '$8,610',
    section: 'P&L › Revenue',
    assertion: 'E',
    source: 'code',
    severity: 'high',
    status: 'needs_action',
    note: 'Check Sept batch against invoice exports before posting.',
    description: 'Revenue lines posted to GL have no corresponding invoice IDs in the source feed.',
    account: '4100 Service Revenue',
    period: '2024-09',
    fixRequired: 'Cross-check missing invoice IDs and correct source mappings.',
    supportingData: 'GL entries 98211-98247 and invoice table join audit',
  },
  {
    id: 'f-003',
    title: 'Depreciation mismatch',
    amount: '$3,200',
    section: 'BS › Assets',
    assertion: 'A',
    source: 'ai',
    severity: 'medium',
    status: 'complete',
    description: 'Depreciation schedule does not reconcile to accumulated depreciation movements.',
    account: '1700 Fixed Assets',
    period: '2024-Q3',
    fixRequired: 'Schedule recalculated and adjusting journal validated.',
    supportingData: 'Fixed asset register v5 and posted adjustment AJ-107',
  },
  {
    id: 'f-004',
    title: 'Rounding adjustment below threshold',
    amount: '$34',
    section: 'BS › AP',
    assertion: 'C',
    source: 'ai',
    severity: 'low',
    status: 'irrelevant',
    description: 'Difference is immaterial and caused by display precision mismatch.',
    account: '2100 Accounts Payable',
    period: '2024-09',
    fixRequired: 'No accounting action required.',
    supportingData: 'Precision config logs and AP summary extract',
  },
  {
    id: 'f-005',
    title: 'Duplicate invoice INV-2241',
    amount: '$4,200',
    section: 'P&L › Cost of Sales',
    assertion: 'E',
    source: 'code',
    severity: 'high',
    status: 'pending',
    description: 'Invoice INV-2241 appears twice with identical metadata and posted dates.',
    account: '5100 Cost of Goods Sold',
    period: '2024-09',
    fixRequired: 'Void duplicate invoice posting and update ingestion dedupe rule.',
    supportingData: 'Invoice sync log and duplicate detection report',
  },
  {
    id: 'f-006',
    title: 'Prepaid not amortised',
    amount: '$1,940',
    section: 'BS › Prepayments',
    assertion: 'C',
    source: 'ai',
    severity: 'medium',
    status: 'needs_action',
    note: 'Fix in October close and attach revised amortisation schedule.',
    description: 'Prepaid software cost remained in full balance with no periodic amortisation entry.',
    account: '1450 Prepayments',
    period: '2024-Q3',
    fixRequired: 'Post amortisation entries for elapsed service period.',
    supportingData: 'Contract terms, prepaid ledger, monthly posting history',
  },
  {
    id: 'f-007',
    title: 'Aging discrepancy',
    amount: '$980',
    section: 'BS › AR',
    assertion: 'A',
    source: 'ai',
    severity: 'medium',
    status: 'pending',
    description: 'Aging bucket totals do not match customer-level detail for one cohort.',
    account: '1200 Accounts Receivable',
    period: '2024-08',
    fixRequired: 'Rebuild aging snapshot and validate post-close adjustments.',
    supportingData: 'Customer aging detail and AR reconciliation workbook',
  },
  {
    id: 'f-008',
    title: 'Accrual timing immaterial',
    amount: '$71',
    section: 'P&L › Expenses',
    assertion: 'C',
    source: 'ai',
    severity: 'low',
    status: 'complete',
    description: 'Timing difference auto-reversed in the next period and is below materiality.',
    account: '6400 Operating Expenses',
    period: '2024-09',
    fixRequired: 'No additional action required.',
    supportingData: 'Auto-reversal journal pair AJ-202 and AJ-203',
  },
  {
    id: 'f-009',
    title: 'Test adjustment in prior period',
    amount: '$112',
    section: 'P&L › Revenue',
    assertion: 'C',
    source: 'code',
    severity: 'low',
    status: 'irrelevant',
    description: 'Legacy test entry is isolated and reversed before reporting cut-off.',
    account: '4100 Service Revenue',
    period: '2023-12',
    fixRequired: 'No action required in current review period.',
    supportingData: 'Historical adjustments ledger',
  },
];

function buildGeneratedFindings(status: FindingStatus, count: number, offset: number): Finding[] {
  const sections = ['BS › AR', 'BS › Assets', 'P&L › Revenue', 'P&L › Expenses'];
  const assertions: Array<'A' | 'C' | 'E'> = ['A', 'C', 'E'];
  const severities: Severity[] = ['high', 'medium', 'low'];

  return Array.from({ length: count }, (_unused, index) => {
    const suffix = offset + index + 1;
    const severity = severities[suffix % severities.length];
    const section = sections[suffix % sections.length];
    const assertion = assertions[suffix % assertions.length];

    return {
      id: `g-${status}-${suffix}`,
      title: `${capitalize(statusMeta[status].label)} variance #${suffix}`,
      amount: severity === 'low' ? undefined : `$${(suffix * 87).toLocaleString()}`,
      section,
      assertion,
      source: suffix % 2 === 0 ? 'ai' : 'code',
      severity,
      status,
      note: status === 'needs_action' ? `Please validate source mapping in batch ${suffix}.` : undefined,
      description: `Auto-detected ${statusMeta[status].label.toLowerCase()} finding generated for reconciliation scenario ${suffix}.`,
      account: suffix % 2 === 0 ? '1200 Accounts Receivable' : '4100 Service Revenue',
      period: '2024-Q3',
      fixRequired: 'Review source records, validate amount, and post adjustment if required.',
      supportingData: `Evidence bundle ${suffix} (ledger + source export + mapping audit).`,
    };
  });
}

const initialFindings: Finding[] = [
  ...seedFindings,
  ...buildGeneratedFindings('pending', 33, 100),
  ...buildGeneratedFindings('needs_action', 5, 200),
  ...buildGeneratedFindings('complete', 6, 300),
  ...buildGeneratedFindings('irrelevant', 2, 400),
];

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function truncate(value: string, maxChars: number): string {
  if (value.length <= maxChars) {
    return value;
  }

  return `${value.slice(0, maxChars - 1)}…`;
}

function logPatchFinding(findingId: string, status: FindingStatus, note?: string): void {
  console.info('PATCH /api/mr-review/findings/:findingId', {
    findingId,
    status,
    accountant_notes: note,
    accountant_id: ACCOUNTANT_ID,
    timestamp: new Date().toISOString(),
  });
}

function logSendToBookkeeper(findingIds: string[]): void {
  console.info('POST /api/mr-review/:reviewId/send-to-bookkeeper', {
    reviewId: REVIEW_ID,
    finding_ids: findingIds,
    notes: 'Sent from Kanban board',
    accountant_id: ACCOUNTANT_ID,
    timestamp: new Date().toISOString(),
  });
}

type FindingCardProps = {
  finding: Finding;
  isSelectable: boolean;
  isSelected: boolean;
  isInlineNoteOpen: boolean;
  noteDraft: string;
  wasMoved: boolean;
  onOpenDetail: (findingId: string) => void;
  onToggleSelection: (findingId: string) => void;
  onMove: (findingId: string, status: FindingStatus) => void;
  onOpenInlineNote: (findingId: string) => void;
  onCloseInlineNote: () => void;
  onInlineNoteChange: (findingId: string, value: string) => void;
  onSaveInlineNote: (findingId: string) => void;
};

function FindingCard({
  finding,
  isSelectable,
  isSelected,
  isInlineNoteOpen,
  noteDraft,
  wasMoved,
  onOpenDetail,
  onToggleSelection,
  onMove,
  onOpenInlineNote,
  onCloseInlineNote,
  onInlineNoteChange,
  onSaveInlineNote,
}: FindingCardProps) {
  const sourceConfig = sourceMeta[finding.source];
  const severityConfig = severityMeta[finding.severity];
  const isTerminal = finding.status === 'complete' || finding.status === 'irrelevant';
  const cardClassNames = [
    'finding-card',
    finding.status,
    finding.status === 'irrelevant' ? 'is-muted' : '',
    wasMoved ? 'moved' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={cardClassNames}>
      <header className="finding-top-row">
        <span className="badge severity-badge" style={{ color: severityConfig.color }}>
          {`${severityConfig.icon} ${severityConfig.label}`}
        </span>
        <span className="badge assertion-badge">[{finding.assertion}]</span>
      </header>

      <button className="finding-title-button" type="button" onClick={() => onOpenDetail(finding.id)}>
        <span className="finding-title-text">{finding.title}</span>
      </button>

      {finding.amount ? <p className="finding-amount">{finding.amount}</p> : null}
      <p className="finding-section">{finding.section}</p>

      <span className="badge source-badge" style={{ backgroundColor: `${sourceConfig.color}1F`, color: sourceConfig.color }}>
        {`${sourceConfig.icon} ${sourceConfig.label}`}
      </span>

      {finding.status === 'needs_action' && finding.note ? <p className="finding-note-preview">{truncate(finding.note, 68)}</p> : null}

      {!isTerminal ? (
        <div className="finding-actions" role="group" aria-label="Finding actions">
          {isSelectable ? (
            <button
              type="button"
              className={`action-chip selection ${isSelected ? 'active' : ''}`}
              onClick={() => onToggleSelection(finding.id)}
            >
              {isSelected ? '☑ Selected' : '☐ Select'}
            </button>
          ) : null}

          <button type="button" className="action-chip" onClick={() => onMove(finding.id, 'irrelevant')}>
            ✗ Irrelevant
          </button>
          <button type="button" className="action-chip" onClick={() => onMove(finding.id, 'complete')}>
            ✓ Complete
          </button>
          <button type="button" className="action-chip note" onClick={() => onOpenInlineNote(finding.id)}>
            📝 Note
          </button>
        </div>
      ) : (
        <div className="finding-actions">
          <button type="button" className="action-chip" onClick={() => onMove(finding.id, 'pending')}>
            <Undo fontSize="inherit" /> Undo
          </button>
        </div>
      )}

      {isInlineNoteOpen ? (
        <div className="inline-note-input">
          <TextField
            value={noteDraft}
            onChange={(event) => onInlineNoteChange(finding.id, event.target.value)}
            placeholder="Add note for bookkeeper..."
            multiline
            minRows={2}
            size="small"
            fullWidth
          />
          <div className="inline-note-actions">
            <Button size="small" variant="outlined" onClick={onCloseInlineNote}>
              Cancel
            </Button>
            <Button size="small" variant="contained" color="warning" onClick={() => onSaveInlineNote(finding.id)}>
              Save to Needs Action
            </Button>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function AiReviewTab() {
  const isMobile = useMediaQuery('(max-width:1100px)');
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const [findings, setFindings] = useState<Finding[]>(initialFindings);
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<FindingSource | 'all'>('all');
  const [searchText, setSearchText] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [drawerFindingId, setDrawerFindingId] = useState<string | null>(null);
  const [recentlyMovedFindingId, setRecentlyMovedFindingId] = useState<string | null>(null);
  const [bulkMoveValue, setBulkMoveValue] = useState<'none' | 'complete' | 'irrelevant'>('none');
  const [isBulkNoteDialogOpen, setIsBulkNoteDialogOpen] = useState(false);
  const [bulkNoteText, setBulkNoteText] = useState('');
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [mobileColumnIndex, setMobileColumnIndex] = useState(0);

  const drawerFinding = useMemo(
    () => findings.find((finding) => finding.id === drawerFindingId) ?? null,
    [findings, drawerFindingId],
  );

  const sections = useMemo(
    () => Array.from(new Set(findings.map((finding) => finding.section))).sort((a, b) => a.localeCompare(b)),
    [findings],
  );

  const needsActionFindings = useMemo(
    () => findings.filter((finding) => finding.status === 'needs_action'),
    [findings],
  );

  const filteredFindings = useMemo(
    () =>
      findings.filter((finding) => {
        const matchesSection = sectionFilter === 'all' || finding.section === sectionFilter;
        const matchesSeverity = severityFilter === 'all' || finding.severity === severityFilter;
        const matchesSource = sourceFilter === 'all' || finding.source === sourceFilter;
        const matchesSearch =
          searchText.trim().length === 0 ||
          finding.title.toLowerCase().includes(searchText.toLowerCase().trim()) ||
          finding.section.toLowerCase().includes(searchText.toLowerCase().trim());

        return matchesSection && matchesSeverity && matchesSource && matchesSearch;
      }),
    [findings, sectionFilter, severityFilter, sourceFilter, searchText],
  );

  const findingsByStatus = useMemo(() => {
    const byStatus = {
      pending: [] as Finding[],
      needs_action: [] as Finding[],
      complete: [] as Finding[],
      irrelevant: [] as Finding[],
    };

    filteredFindings.forEach((finding) => {
      byStatus[finding.status].push(finding);
    });

    STATUS_ORDER.forEach((status) => {
      byStatus[status].sort((left, right) => {
        const severityDiff = severityOrder[left.severity] - severityOrder[right.severity];
        if (severityDiff !== 0) {
          return severityDiff;
        }

        return left.title.localeCompare(right.title);
      });
    });

    return byStatus;
  }, [filteredFindings]);

  const selectableVisibleIds = useMemo(
    () => filteredFindings.filter((finding) => finding.status === 'pending' || finding.status === 'needs_action').map((finding) => finding.id),
    [filteredFindings],
  );

  const allVisibleSelected =
    selectableVisibleIds.length > 0 && selectableVisibleIds.every((findingId) => selectedIds.includes(findingId));

  const activeMobileStatus = STATUS_ORDER[mobileColumnIndex];
  const columnOrder = isMobile ? [activeMobileStatus] : STATUS_ORDER;

  const markRecentlyMoved = (findingId: string): void => {
    setRecentlyMovedFindingId(findingId);
    window.setTimeout(() => {
      setRecentlyMovedFindingId((previous) => (previous === findingId ? null : previous));
    }, 220);
  };

  const updateFindingStatus = (findingId: string, nextStatus: FindingStatus, nextNote?: string): void => {
    setFindings((current) =>
      current.map((finding) => {
        if (finding.id !== findingId) {
          return finding;
        }

        return {
          ...finding,
          status: nextStatus,
          note: nextNote !== undefined ? nextNote : finding.note,
        };
      }),
    );
    logPatchFinding(findingId, nextStatus, nextNote);
    markRecentlyMoved(findingId);

    if (nextStatus === 'complete' || nextStatus === 'irrelevant') {
      setSelectedIds((current) => current.filter((id) => id !== findingId));
    }
  };

  const toggleFindingSelection = (findingId: string): void => {
    setSelectedIds((current) =>
      current.includes(findingId) ? current.filter((id) => id !== findingId) : [...current, findingId],
    );
  };

  const toggleSelectAll = (): void => {
    if (allVisibleSelected) {
      setSelectedIds((current) => current.filter((id) => !selectableVisibleIds.includes(id)));
      return;
    }

    setSelectedIds((current) => {
      const merged = new Set([...current, ...selectableVisibleIds]);
      return Array.from(merged);
    });
  };

  const openInlineNote = (findingId: string): void => {
    const targetFinding = findings.find((finding) => finding.id === findingId);
    setExpandedNoteId(findingId);
    setNoteDrafts((current) => ({
      ...current,
      [findingId]: current[findingId] ?? targetFinding?.note ?? '',
    }));
  };

  const closeInlineNote = (): void => {
    setExpandedNoteId(null);
  };

  const saveInlineNote = (findingId: string): void => {
    const draftNote = (noteDrafts[findingId] ?? '').trim();
    if (!draftNote) {
      setExpandedNoteId(null);
      return;
    }

    updateFindingStatus(findingId, 'needs_action', draftNote);
    setExpandedNoteId(null);
  };

  const applyBulkMove = (targetStatus: 'complete' | 'irrelevant'): void => {
    if (selectedIds.length === 0) {
      return;
    }

    setFindings((current) =>
      current.map((finding) => {
        if (!selectedIds.includes(finding.id)) {
          return finding;
        }

        logPatchFinding(finding.id, targetStatus, finding.note);
        return {
          ...finding,
          status: targetStatus,
        };
      }),
    );

    setSelectedIds([]);
    setBulkMoveValue('none');
  };

  const applyBulkNote = (): void => {
    const trimmedNote = bulkNoteText.trim();
    if (!trimmedNote || selectedIds.length === 0) {
      return;
    }

    setFindings((current) =>
      current.map((finding) => {
        if (!selectedIds.includes(finding.id)) {
          return finding;
        }

        logPatchFinding(finding.id, 'needs_action', trimmedNote);
        return {
          ...finding,
          status: 'needs_action',
          note: trimmedNote,
        };
      }),
    );

    setBulkNoteText('');
    setIsBulkNoteDialogOpen(false);
  };

  const confirmSendToBookkeeper = (): void => {
    if (needsActionFindings.length === 0) {
      return;
    }

    const findingIds = needsActionFindings.map((finding) => finding.id);
    logSendToBookkeeper(findingIds);

    setFindings((current) =>
      current.map((finding) => {
        if (!findingIds.includes(finding.id)) {
          return finding;
        }

        return {
          ...finding,
          status: 'complete',
        };
      }),
    );

    setSelectedIds((current) => current.filter((id) => !findingIds.includes(id)));
    setIsSendDialogOpen(false);
  };

  const handleDrawerNoteSave = (): void => {
    if (!drawerFinding) {
      return;
    }

    const drawerDraft = (noteDrafts[drawerFinding.id] ?? drawerFinding.note ?? '').trim();
    if (!drawerDraft) {
      return;
    }

    updateFindingStatus(drawerFinding.id, 'needs_action', drawerDraft);
  };

  const handleBoardTouchStart = (event: React.TouchEvent<HTMLDivElement>): void => {
    if (!isMobile) {
      return;
    }

    const touch = event.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleBoardTouchEnd = (event: React.TouchEvent<HTMLDivElement>): void => {
    if (!isMobile || touchStartX.current === null || touchStartY.current === null) {
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = Math.abs(touch.clientY - touchStartY.current);

    if (Math.abs(deltaX) > MOBILE_SWIPE_THRESHOLD && deltaY < 60) {
      if (deltaX < 0) {
        setMobileColumnIndex((current) => Math.min(current + 1, STATUS_ORDER.length - 1));
      } else {
        setMobileColumnIndex((current) => Math.max(current - 1, 0));
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <Box className={`ai-review-root ${isMobile ? 'mobile' : ''}`}>
      <Box className="review-page-header">
        <Box>
          <Typography className="review-title">Accounts Review</Typography>
          <Typography className="review-subtitle">Acme Corp · FY2024 Q3 · v2</Typography>
        </Box>

        <Button
          className="send-button"
          variant="contained"
          startIcon={<Send />}
          onClick={() => setIsSendDialogOpen(true)}
          disabled={needsActionFindings.length === 0}
        >
          {`Send to Bookkeeper (${needsActionFindings.length})`}
        </Button>
      </Box>

      <Box className="filter-bar">
        <FormControl size="small" className="filter-control">
          <Select value={sectionFilter} onChange={(event) => setSectionFilter(event.target.value)}>
            <MenuItem value="all">Section: All</MenuItem>
            {sections.map((section) => (
              <MenuItem key={section} value={section}>{`Section: ${section}`}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" className="filter-control">
          <Select
            value={severityFilter}
            onChange={(event) => setSeverityFilter(event.target.value as Severity | 'all')}
          >
            <MenuItem value="all">Severity: All</MenuItem>
            <MenuItem value="high">Severity: High</MenuItem>
            <MenuItem value="medium">Severity: Medium</MenuItem>
            <MenuItem value="low">Severity: Low</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" className="filter-control">
          <Select
            value={sourceFilter}
            onChange={(event) => setSourceFilter(event.target.value as FindingSource | 'all')}
          >
            <MenuItem value="all">Source: All</MenuItem>
            <MenuItem value="ai">Source: AI</MenuItem>
            <MenuItem value="code">Source: Code</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          placeholder="Search findings..."
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          className="search-input"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {isMobile ? (
        <Box className="mobile-column-tabs" role="tablist" aria-label="Kanban columns">
          {STATUS_ORDER.map((status, index) => (
            <button
              key={status}
              type="button"
              className={`mobile-column-tab ${mobileColumnIndex === index ? 'active' : ''}`}
              onClick={() => setMobileColumnIndex(index)}
            >
              {`${statusMeta[status].label} (${findingsByStatus[status].length})`}
            </button>
          ))}
        </Box>
      ) : null}

      <Box className="kanban-board-grid" onTouchStart={handleBoardTouchStart} onTouchEnd={handleBoardTouchEnd}>
        {columnOrder.map((status) => (
          <section className={`kanban-column ${status}`} key={status}>
            <header className="kanban-column-header">
              <div>
                <p className="kanban-column-label">{statusMeta[status].label}</p>
                <p className="kanban-column-caption">{`${findingsByStatus[status].length} findings`}</p>
              </div>
            </header>

            <div className="kanban-column-list">
              {findingsByStatus[status].length === 0 ? (
                <p className="empty-column-message">No findings match the selected filters.</p>
              ) : (
                findingsByStatus[status].map((finding) => (
                  <FindingCard
                    key={finding.id}
                    finding={finding}
                    isSelectable={finding.status === 'pending' || finding.status === 'needs_action'}
                    isSelected={selectedIds.includes(finding.id)}
                    isInlineNoteOpen={expandedNoteId === finding.id}
                    noteDraft={noteDrafts[finding.id] ?? finding.note ?? ''}
                    wasMoved={recentlyMovedFindingId === finding.id}
                    onOpenDetail={setDrawerFindingId}
                    onToggleSelection={toggleFindingSelection}
                    onMove={updateFindingStatus}
                    onOpenInlineNote={openInlineNote}
                    onCloseInlineNote={closeInlineNote}
                    onInlineNoteChange={(findingId, value) =>
                      setNoteDrafts((current) => ({
                        ...current,
                        [findingId]: value,
                      }))
                    }
                    onSaveInlineNote={saveInlineNote}
                  />
                ))
              )}
            </div>
          </section>
        ))}
      </Box>

      <Box className="bulk-action-bar">
        <div className="bulk-actions-left">
          <Checkbox checked={allVisibleSelected} onChange={toggleSelectAll} />
          <Typography variant="body2">Select All Visible</Typography>
          <Typography variant="body2" className="selected-count">{`${selectedIds.length} selected`}</Typography>
        </div>

        <div className="bulk-actions-right">
          <FormControl size="small" className="bulk-select">
            <Select
              value={bulkMoveValue}
              onChange={(event) => {
                const nextValue = event.target.value as 'none' | 'complete' | 'irrelevant';
                setBulkMoveValue(nextValue);
                if (nextValue !== 'none') {
                  applyBulkMove(nextValue);
                }
              }}
            >
              <MenuItem value="none">Bulk Move</MenuItem>
              <MenuItem value="complete">Move to Complete</MenuItem>
              <MenuItem value="irrelevant">Move to Irrelevant</MenuItem>
            </Select>
          </FormControl>

          <Button
            size="small"
            variant="outlined"
            onClick={() => setIsBulkNoteDialogOpen(true)}
            disabled={selectedIds.length === 0}
          >
            Bulk Note
          </Button>

          <Button
            size="small"
            variant="contained"
            onClick={() => setIsSendDialogOpen(true)}
            startIcon={<Send fontSize="small" />}
            disabled={needsActionFindings.length === 0}
          >
            {`Send to BK (${needsActionFindings.length})`}
          </Button>
        </div>
      </Box>

      <Drawer
        anchor="right"
        open={Boolean(drawerFinding)}
        onClose={() => setDrawerFindingId(null)}
        PaperProps={{ className: 'finding-drawer-paper' }}
      >
        {drawerFinding ? (
          <Box className="drawer-content">
            <Box className="drawer-header">
              <Typography className="drawer-title">{drawerFinding.title}</Typography>
              <IconButton onClick={() => setDrawerFindingId(null)}>
                <Close />
              </IconButton>
            </Box>

            <Box className="drawer-body">
              <p className="drawer-chip" style={{ color: severityMeta[drawerFinding.severity].color }}>
                {`${severityMeta[drawerFinding.severity].icon} ${severityMeta[drawerFinding.severity].label}`}
              </p>
              <p className="drawer-line">{`Amount: ${drawerFinding.amount ?? 'N/A'}`}</p>
              <p className="drawer-line">{`Section: ${drawerFinding.section}`}</p>
              <p className="drawer-line">{`Account: ${drawerFinding.account}`}</p>
              <p className="drawer-line">{`Period: ${drawerFinding.period}`}</p>

              <Typography variant="subtitle2" className="drawer-subheading">
                Description
              </Typography>
              <Typography variant="body2" className="drawer-paragraph">
                {drawerFinding.description}
              </Typography>

              <Typography variant="subtitle2" className="drawer-subheading">
                Fix Required
              </Typography>
              <Typography variant="body2" className="drawer-paragraph">
                {drawerFinding.fixRequired}
              </Typography>

              <Typography variant="subtitle2" className="drawer-subheading">
                Supporting Data
              </Typography>
              <Typography variant="body2" className="drawer-paragraph">
                {drawerFinding.supportingData}
              </Typography>

              <TextField
                multiline
                minRows={4}
                label="Notes"
                value={noteDrafts[drawerFinding.id] ?? drawerFinding.note ?? ''}
                onChange={(event) =>
                  setNoteDrafts((current) => ({
                    ...current,
                    [drawerFinding.id]: event.target.value,
                  }))
                }
                fullWidth
              />

              <Button variant="contained" color="warning" onClick={handleDrawerNoteSave}>
                Save note to Needs Action
              </Button>
            </Box>
          </Box>
        ) : null}
      </Drawer>

      <Dialog open={isBulkNoteDialogOpen} onClose={() => setIsBulkNoteDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Bulk Note</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Add one shared note to all selected findings and move them to Needs Action.
          </Typography>
          <TextField
            autoFocus
            value={bulkNoteText}
            onChange={(event) => setBulkNoteText(event.target.value)}
            multiline
            minRows={3}
            fullWidth
            placeholder="Add shared instructions for bookkeeper..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsBulkNoteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={applyBulkNote} disabled={bulkNoteText.trim().length === 0 || selectedIds.length === 0}>
            Apply note
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isSendDialogOpen} onClose={() => setIsSendDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{`Send ${needsActionFindings.length} finding(s) to Bookkeeper`}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            These findings are currently in Needs Action and will be moved to Complete after sending.
          </Typography>
          <Box className="send-review-list">
            {needsActionFindings.map((finding) => (
              <Box key={finding.id} className="send-review-item">
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {finding.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {finding.note ? truncate(finding.note, 80) : 'No note added yet'}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSendDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={confirmSendToBookkeeper} disabled={needsActionFindings.length === 0}>
            Confirm & Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedItem, setSelectedItem] = useState(1);
  const [checkStatus, setCheckStatus] = useState('not-checked');
  const [note, setNote] = useState('');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  // Render content based on selected tab
  const renderTabContent = () => {
    switch (selectedTab) {
      case 0: // Ticket tab
        return (
          <>
            {/* Middle Panel - Checklist */}
            <Box
              sx={{
                width: 637.5,
                borderRight: '1px solid #e0e0e0',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  height: 63.75,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #e0e0e0',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                  Make sure all checks are confirmed (0/13 done)
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<KeyboardArrowDown />}
                  sx={{ textTransform: 'none', fontSize: 13, color: '#666', borderColor: '#e0e0e0' }}
                >
                  Confirm all
                </Button>
              </Box>

              {/* Scrollable List */}
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                <List sx={{ p: 0 }}>
                  {checklistItems.map((item, index) => (
                    <ListItem
                      key={item.id}
                      onClick={() => setSelectedItem(item.id)}
                      sx={{
                        height: item.height,
                        borderBottom: '1px solid #e0e0e0',
                        bgcolor: index === 0 ? '#e3f2fd' : selectedItem === item.id ? '#e3f2fd' : 'white',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: '#f5f5f5',
                        },
                        px: 2,
                        gap: 2,
                      }}
                    >
                      <Badge
                        badgeContent="!"
                        sx={{
                          '& .MuiBadge-badge': {
                            bgcolor: '#f44336',
                            color: 'white',
                            width: 20,
                            height: 20,
                            borderRadius: '10px',
                            fontSize: 12,
                            fontWeight: 600,
                          },
                        }}
                      />
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          sx: { fontSize: 14, color: '#333', lineHeight: 1.5 },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>

            {/* Right Panel - Details */}
            <Box
              sx={{
                flex: 1,
                bgcolor: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Selected Item Header */}
              <Box
                sx={{
                  height: 55,
                  px: 2,
                  bgcolor: 'white',
                  borderBottom: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Badge
                  badgeContent="!"
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: '#f44336',
                      color: 'white',
                      width: 20,
                      height: 20,
                      borderRadius: '10px',
                      fontSize: 12,
                      fontWeight: 600,
                    },
                  }}
                />
                <Typography variant="body2" sx={{ fontSize: 14, color: '#333' }}>
                  {checklistItems[0].text}
                </Typography>
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                {/* Action Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
                    Action
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 13, color: '#666', mb: 1 }}>
                    To ensure consistent currency presentation and usage
                  </Typography>
                  <Link
                    href="#"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontSize: 13,
                      textDecoration: 'none',
                    }}
                  >
                    <Launch sx={{ fontSize: 16 }} />
                    How to work with this check
                  </Link>
                </Box>

                {/* Status Dropdown */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Select
                    value={checkStatus}
                    onChange={(event) => setCheckStatus(event.target.value)}
                    displayEmpty
                    sx={{
                      bgcolor: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                    }}
                  >
                    <MenuItem value="not-checked">Not checked</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>

                {/* Settings Icon */}
                <IconButton size="small" sx={{ color: '#666', mb: 2 }}>
                  <Settings sx={{ fontSize: 18 }} />
                </IconButton>

                {/* Note Section */}
                <Box>
                  <Typography variant="body2" sx={{ fontSize: 13, color: '#333', mb: 1 }}>
                    Note
                  </Typography>
                  <TextField
                    multiline
                    rows={5}
                    fullWidth
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Add a note..."
                    sx={{
                      bgcolor: 'white',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.23)',
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </>
        );

      case 1: // AI Review tab
        return <AiReviewTab />;

      default:
        return (
          <Box
            sx={{
              flex: 1,
              bgcolor: '#fafafa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Content coming soon
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'white' }}>
      {/* Top AppBar */}
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar sx={{ minHeight: '61.5px !important', px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <IconButton
              sx={{
                bgcolor: '#1976d2',
                color: 'white',
                width: 36,
                height: 36,
                '&:hover': { bgcolor: '#1565c0' },
              }}
            >
              <ArrowBack sx={{ fontSize: 20 }} />
            </IconButton>
            <Typography variant="body2" sx={{ fontSize: 14 }}>
              Royale Infinite Pte. Ltd.: Review with Accountant for 1 Jan - 31 Dec 2023
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{
              textTransform: 'none',
              px: 3,
              height: 36.5,
            }}
          >
            Done
          </Button>
        </Toolbar>
      </AppBar>

      {/* Tabs */}
      <Box sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          sx={{
            minHeight: 48,
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              fontSize: 14,
            },
          }}
        >
          <Tab label="Ticket" />
          <Tab label="AI Review" />
          <Tab label="Company" />
          <Tab label="Chat" />
          <Tab label="Notes" />
        </Tabs>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar - Persists across tabs */}
        <Box
          sx={{
            width: 64,
            bgcolor: '#fafafa',
            borderRight: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 2,
            gap: 1,
          }}
        >
          <IconButton sx={{ color: '#666' }}>
            <Home />
          </IconButton>
          <IconButton sx={{ color: '#666' }}>
            <ChatBubble />
          </IconButton>
          <IconButton sx={{ color: '#666' }}>
            <Person />
          </IconButton>
          <IconButton sx={{ color: '#666' }}>
            <Description />
          </IconButton>
          <IconButton sx={{ color: '#666' }}>
            <Folder />
          </IconButton>
          <IconButton sx={{ color: '#666' }}>
            <MenuBook />
          </IconButton>
          <IconButton sx={{ color: '#666' }}>
            <BarChart />
          </IconButton>
          <IconButton sx={{ color: '#666' }}>
            <Dashboard />
          </IconButton>
          <IconButton sx={{ color: '#666' }}>
            <Settings />
          </IconButton>
        </Box>

        {/* Dynamic Tab Content */}
        {renderTabContent()}
      </Box>
    </Box>
  );
}
