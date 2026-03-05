import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import {
  CheckCircle,
  HourglassEmpty,
  PlayArrow,
  RadioButtonUnchecked,
  RemoveCircleOutline,
  SwapHoriz,
} from '@mui/icons-material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { BulkAction, Finding, QueuePathFilter, QueueSortMode, QueueStatusFilter } from './types';
import { accentColor, accentGradient, monoFontFamily, severityColors, shadowAccent, statusColors, uiFontFamily } from './tokens';

interface QueuePanelProps {
  findings: Finding[];
  allFindings: Finding[];
  currentFindingId: string;
  sortMode: QueueSortMode;
  onSortModeChange: (mode: QueueSortMode) => void;
  statusFilter: QueueStatusFilter;
  onStatusFilterChange: (filter: QueueStatusFilter) => void;
  pathFilter: QueuePathFilter;
  onPathFilterChange: (filter: QueuePathFilter) => void;
  selectedIds: string[];
  onToggleSelectFinding: (findingId: string) => void;
  onOpenFinding: (findingId: string) => void;
  onToggleSelectAllHigh: () => void;
  isAllHighSelected: boolean;
  isHighIndeterminate: boolean;
  onApplyBulkAction: (action: BulkAction) => void;
}

const rowHeight = 76;

interface VirtualRowData {
  findings: Finding[];
  currentFindingId: string;
  selectedIdSet: Set<string>;
  onToggleSelectFinding: (findingId: string) => void;
  onOpenFinding: (findingId: string) => void;
}

const VirtualQueueRow = ({ index, style, data }: ListChildComponentProps<VirtualRowData>) => {
  const finding = data.findings[index];

  return (
    <div style={style}>
      <QueueItem
        finding={finding}
        isCurrent={finding.id === data.currentFindingId}
        isSelected={data.selectedIdSet.has(finding.id)}
        onToggleSelect={data.onToggleSelectFinding}
        onOpenFinding={data.onOpenFinding}
      />
    </div>
  );
};

export const QueuePanel = ({
  findings,
  allFindings,
  currentFindingId,
  sortMode,
  onSortModeChange,
  statusFilter,
  onStatusFilterChange,
  pathFilter,
  onPathFilterChange,
  selectedIds,
  onToggleSelectFinding,
  onOpenFinding,
  onToggleSelectAllHigh,
  isAllHighSelected,
  isHighIndeterminate,
  onApplyBulkAction,
}: QueuePanelProps) => {
  const [bulkAction, setBulkAction] = useState<BulkAction>('mark_complete');
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  // Derive unique COA paths from all findings (unfiltered), grouped by top-level segment
  const pathOptions = useMemo(() => {
    const seen = new Set<string>();
    const paths: string[] = [];
    allFindings.forEach((f) => {
      if (!seen.has(f.pathLabel)) {
        seen.add(f.pathLabel);
        paths.push(f.pathLabel);
      }
    });
    return paths.sort();
  }, [allFindings]);

  // Group paths by top-level segment (BS / PL)
  const pathGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};
    pathOptions.forEach((path) => {
      const segment = path.split(' > ')[0];
      if (!groups[segment]) {
        groups[segment] = [];
      }
      groups[segment].push(path);
    });
    return groups;
  }, [pathOptions]);
  const listRef = useRef<FixedSizeList | null>(null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const listContainerRef = useRef<HTMLDivElement | null>(null);
  const [listHeight, setListHeight] = useState(360);

  const useVirtualization = findings.length > 100;
  const currentIndex = findings.findIndex((finding) => finding.id === currentFindingId);

  useEffect(() => {
    if (!listContainerRef.current) {
      return;
    }

    const container = listContainerRef.current;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      setListHeight(Math.max(220, Math.floor(entry.contentRect.height)));
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (currentIndex < 0) {
      return;
    }

    if (useVirtualization && listRef.current) {
      listRef.current.scrollToItem(currentIndex, 'smart');
      return;
    }

    const element = rowRefs.current[currentFindingId];
    element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [currentFindingId, currentIndex, useVirtualization]);

  const handleSortChange = (event: SelectChangeEvent) => {
    onSortModeChange(event.target.value as QueueSortMode);
  };

  const virtualRowData: VirtualRowData = {
    findings,
    currentFindingId,
    selectedIdSet,
    onToggleSelectFinding,
    onOpenFinding,
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
      {/* Queue header — two rows */}
      <Box sx={{ px: 2, pt: 1.5, pb: 1, borderBottom: '1px solid #E2E8F0' }}>
        {/* Row 1: Queue badge + finding count */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.6,
              border: `1px solid ${accentColor}33`,
              bgcolor: `${accentColor}0D`,
              borderRadius: 999,
              px: 1.25,
              py: 0.3,
            }}
          >
            <Typography
              sx={{
                fontFamily: monoFontFamily,
                fontSize: 11,
                fontWeight: 600,
                color: accentColor,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Queue
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: monoFontFamily, fontSize: 11, color: '#94A3B8' }}>
            {findings.length} finding{findings.length !== 1 ? 's' : ''}
          </Typography>
        </Stack>

        {/* Row 2: COA path filter + Status filter + Sort */}
        <Stack direction="row" alignItems="center" spacing={0.75} flexWrap="wrap" useFlexGap>
          <FormControl size="small">
            <Select
              value={pathFilter}
              onChange={(event) => onPathFilterChange(event.target.value as QueuePathFilter)}
              displayEmpty
              sx={{
                minWidth: 130,
                height: 28,
                fontSize: 12,
                fontFamily: uiFontFamily,
                bgcolor: '#FFFFFF',
                borderRadius: 1.5,
              }}
            >
              <MenuItem value="all" sx={{ fontFamily: uiFontFamily, fontSize: 12 }}>All paths</MenuItem>
              {Object.entries(pathGroups).map(([segment, paths]) => [
                <MenuItem
                  key={`group-${segment}`}
                  disabled
                  sx={{ fontFamily: monoFontFamily, fontSize: 10, fontWeight: 700, color: accentColor, letterSpacing: '0.06em', textTransform: 'uppercase', py: 0.5, opacity: '1 !important' }}
                >
                  {segment}
                </MenuItem>,
                ...paths.map((path) => {
                  // Show only the last two segments to keep it compact: "Operating Expenses > Depreciation"
                  const parts = path.split(' > ');
                  const label = parts.slice(1).join(' > ');
                  return (
                    <MenuItem key={path} value={path} sx={{ fontFamily: uiFontFamily, fontSize: 12, pl: 3 }}>
                      {label}
                    </MenuItem>
                  );
                }),
              ])}
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select
              value={statusFilter}
              onChange={(event) => onStatusFilterChange(event.target.value as QueueStatusFilter)}
              sx={{
                minWidth: 110,
                height: 28,
                fontSize: 12,
                fontFamily: uiFontFamily,
                bgcolor: '#FFFFFF',
                borderRadius: 1.5,
              }}
            >
              <MenuItem value="all" sx={{ fontFamily: uiFontFamily, fontSize: 12 }}>All status</MenuItem>
              <MenuItem value="draft_ai" sx={{ fontFamily: uiFontFamily, fontSize: 12 }}>Draft (AI)</MenuItem>
              <MenuItem value="draft_human" sx={{ fontFamily: uiFontFamily, fontSize: 12 }}>Draft (Manual)</MenuItem>
              <MenuItem value="needs_action" sx={{ fontFamily: uiFontFamily, fontSize: 12 }}>Needs Action</MenuItem>
              <MenuItem value="in_review" sx={{ fontFamily: uiFontFamily, fontSize: 12 }}>In Review</MenuItem>
              <MenuItem value="complete" sx={{ fontFamily: uiFontFamily, fontSize: 12 }}>Complete</MenuItem>
              <MenuItem value="irrelevant" sx={{ fontFamily: uiFontFamily, fontSize: 12 }}>Irrelevant</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select
              value={sortMode}
              onChange={handleSortChange}
              sx={{
                minWidth: 90,
                height: 28,
                fontSize: 12,
                fontFamily: uiFontFamily,
                bgcolor: '#FFFFFF',
                borderRadius: 1.5,
              }}
            >
              <MenuItem value="severity" sx={{ fontFamily: uiFontFamily, fontSize: 12 }}>Severity</MenuItem>
              <MenuItem value="amount" sx={{ fontFamily: uiFontFamily, fontSize: 12 }}>Amount</MenuItem>
              <MenuItem value="account" sx={{ fontFamily: uiFontFamily, fontSize: 12 }}>Account</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Queue list */}
      <Box ref={listContainerRef} sx={{ flex: 1, minHeight: 0, overflow: 'hidden', bgcolor: '#FAFAFA' }}>
        {useVirtualization ? (
          <FixedSizeList
            ref={listRef}
            height={listHeight}
            width="100%"
            itemSize={rowHeight}
            itemCount={findings.length}
            itemData={virtualRowData}
          >
            {VirtualQueueRow}
          </FixedSizeList>
        ) : (
          <Box sx={{ height: '100%', overflowY: 'auto' }}>
            {findings.map((finding) => {
              return (
                <div
                  key={finding.id}
                  ref={(element) => {
                    rowRefs.current[finding.id] = element;
                  }}
                >
                  <QueueItem
                    finding={finding}
                    isCurrent={finding.id === currentFindingId}
                    isSelected={selectedIdSet.has(finding.id)}
                    onToggleSelect={onToggleSelectFinding}
                    onOpenFinding={onOpenFinding}
                  />
                </div>
              );
            })}
          </Box>
        )}
      </Box>

      <Divider />

      {/* Bulk action footer */}
      <Box sx={{ px: 2, py: 1.25, bgcolor: '#FFFFFF' }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Checkbox
            size="small"
            checked={isAllHighSelected}
            indeterminate={isHighIndeterminate}
            onChange={onToggleSelectAllHigh}
            sx={{
              p: 0.4,
              color: '#CBD5E1',
              '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: accentColor },
            }}
          />
          <Typography sx={{ fontFamily: uiFontFamily, fontSize: 12, color: '#0F172A', fontWeight: 600 }}>
            Select all{' '}
            <Box component="span" sx={{ color: '#EF4444', fontWeight: 700 }}>
              HIGH
            </Box>
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <FormControl size="small" fullWidth>
            <Select
              value={bulkAction}
              onChange={(event) => setBulkAction(event.target.value as BulkAction)}
              sx={{
                height: 34,
                fontSize: 13,
                fontFamily: uiFontFamily,
                bgcolor: '#FFFFFF',
                borderRadius: 1.5,
              }}
            >
              <MenuItem value="mark_complete">Mark Complete</MenuItem>
              <MenuItem value="mark_irrelevant">Mark Irrelevant</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={() => onApplyBulkAction(bulkAction)}
            disabled={selectedIds.length === 0}
            sx={{
              textTransform: 'none',
              fontFamily: uiFontFamily,
              fontWeight: 700,
              borderRadius: 1.5,
              whiteSpace: 'nowrap',
              background: accentGradient,
              boxShadow: 'none',
              transition: 'all 180ms ease',
              '&:hover': {
                background: accentGradient,
                boxShadow: shadowAccent,
              },
              '&.Mui-disabled': {
                background: 'none',
                bgcolor: '#E2E8F0',
                color: '#94A3B8',
              },
            }}
          >
            Apply
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

interface QueueItemProps {
  finding: Finding;
  isCurrent: boolean;
  isSelected: boolean;
  onToggleSelect: (findingId: string) => void;
  onOpenFinding: (findingId: string) => void;
}

const QueueItem = ({ finding, isCurrent, isSelected, onToggleSelect, onOpenFinding }: QueueItemProps) => {
  const isIrrelevant = finding.status === 'irrelevant';

  const titleStyles: CSSProperties = {
    fontFamily: uiFontFamily,
    fontSize: 13,
    fontWeight: isCurrent ? 700 : 600,
    color: isIrrelevant ? '#94A3B8' : '#0F172A',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textDecoration: isIrrelevant ? 'line-through' : 'none',
    opacity: isIrrelevant ? 0.5 : 1,
  };

  return (
    <Box
      onClick={() => onOpenFinding(finding.id)}
      sx={{
        display: 'grid',
        gridTemplateColumns: '24px 24px 10px 1fr',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        py: 1.1,
        cursor: 'pointer',
        borderBottom: '1px solid #E2E8F0',
        borderLeft: isCurrent ? `3px solid ${accentColor}` : '3px solid transparent',
        bgcolor: isCurrent ? `rgba(0,82,255,0.06)` : '#FFFFFF',
        transition: 'all 180ms ease',
        '&:hover': {
          bgcolor: isCurrent ? `rgba(0,82,255,0.09)` : '#F8FAFC',
          boxShadow: isCurrent ? '0 2px 8px rgba(0,82,255,0.1)' : 'none',
        },
      }}
    >
      <Checkbox
        size="small"
        checked={isSelected}
        onClick={(event) => event.stopPropagation()}
        onChange={() => onToggleSelect(finding.id)}
        sx={{
          p: 0.4,
          color: '#CBD5E1',
          '&.Mui-checked': { color: accentColor },
        }}
      />

      <StatusGlyph status={finding.status} isCurrent={isCurrent} />

      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          bgcolor: severityColors[finding.severity],
        }}
      />

      <Box sx={{ minWidth: 0 }}>
        <Typography component="p" style={titleStyles}>
          {finding.title}
        </Typography>
        <Typography
          sx={{
            fontFamily: monoFontFamily,
            fontSize: 10,
            color: '#94A3B8',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            opacity: isIrrelevant ? 0.5 : 1,
            letterSpacing: '0.02em',
          }}
        >
          {finding.pathLabel}
        </Typography>
        <Typography
          sx={{
            fontFamily: monoFontFamily,
            fontSize: 11,
            color: isCurrent ? accentColor : '#64748B',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            opacity: isIrrelevant ? 0.5 : 1,
          }}
        >
          {finding.amountLabel}
        </Typography>
      </Box>
    </Box>
  );
};

interface StatusGlyphProps {
  status: Finding['status'];
  isCurrent: boolean;
}

const StatusGlyph = ({ status, isCurrent }: StatusGlyphProps) => {
  if (status === 'complete') {
    return <CheckCircle sx={{ fontSize: 18, color: statusColors.complete }} />;
  }

  if (status === 'irrelevant') {
    return <RemoveCircleOutline sx={{ fontSize: 18, color: statusColors.irrelevant }} />;
  }

  if (status === 'needs_action') {
    return <HourglassEmpty sx={{ fontSize: 17, color: statusColors.needs_action }} />;
  }

  if (status === 'in_review') {
    return <SwapHoriz sx={{ fontSize: 18, color: statusColors.in_review }} />;
  }

  if (isCurrent) {
    return <PlayArrow sx={{ fontSize: 18, color: accentColor }} />;
  }

  return <RadioButtonUnchecked sx={{ fontSize: 17, color: statusColors.draft_ai }} />;
};
