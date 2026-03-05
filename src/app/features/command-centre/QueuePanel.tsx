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
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AccountTree,
  CheckCircle,
  FilterList,
  HourglassEmpty,
  PlayArrow,
  RadioButtonUnchecked,
  RemoveCircleOutline,
  Sort,
  SwapHoriz,
} from '@mui/icons-material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { BulkAction, Finding, QueuePathFilter, QueueSortMode, QueueStatusFilter } from './types';
import { accentColor, accentGradient, monoFontFamily, severityColors, shadowAccent, statusColors, statusLabel, uiFontFamily } from './tokens';

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
  onToggleSelectAllCritical: () => void;
  isAllCriticalSelected: boolean;
  isCriticalIndeterminate: boolean;
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
  onToggleSelectAllCritical,
  isAllCriticalSelected,
  isCriticalIndeterminate,
  onApplyBulkAction,
}: QueuePanelProps) => {
  const [bulkAction, setBulkAction] = useState<BulkAction>('mark_complete');
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  // Derive unique sections from all findings (unfiltered)
  const sectionOptions = useMemo(() => {
    const seen = new Set<string>();
    const sections: string[] = [];
    allFindings.forEach((f) => {
      if (!seen.has(f.section)) {
        seen.add(f.section);
        sections.push(f.section);
      }
    });
    return sections.sort();
  }, [allFindings]);

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
              gap: 0.75,
              border: `1px solid ${accentColor}33`,
              bgcolor: `${accentColor}0D`,
              borderRadius: 999,
              px: 1.25,
              py: 0.3,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: accentColor,
                flexShrink: 0,
                '@keyframes queuePulse': {
                  '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.6, transform: 'scale(0.8)' },
                },
                animation: 'queuePulse 2s ease-in-out infinite',
              }}
            />
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

        {/* Row 2: Section filter + Status filter + Sort */}
        <Stack direction="row" alignItems="flex-end" spacing={0.75} flexWrap="wrap" useFlexGap>
          <Box>
            <Stack direction="row" alignItems="center" spacing={0.4} sx={{ mb: 0.4 }}>
              <AccountTree sx={{ fontSize: 10, color: '#94A3B8' }} />
              <Typography sx={{ fontFamily: monoFontFamily, fontSize: 9, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Section</Typography>
            </Stack>
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
                <MenuItem value="all" sx={{ fontFamily: uiFontFamily, fontSize: 12 }}>All sections</MenuItem>
                {sectionOptions.map((section) => (
                  <MenuItem key={section} value={section} sx={{ fontFamily: uiFontFamily, fontSize: 12 }}>
                    {section}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Stack direction="row" alignItems="center" spacing={0.4} sx={{ mb: 0.4 }}>
              <FilterList sx={{ fontSize: 10, color: '#94A3B8' }} />
              <Typography sx={{ fontFamily: monoFontFamily, fontSize: 9, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Status</Typography>
            </Stack>
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
                <MenuItem value="open" sx={{ fontFamily: uiFontFamily, fontSize: 12 }}>{statusLabel.open}</MenuItem>
                <MenuItem value="noted" sx={{ fontFamily: uiFontFamily, fontSize: 12 }}>{statusLabel.noted}</MenuItem>
                <MenuItem value="sent_to_bookkeeper" sx={{ fontFamily: uiFontFamily, fontSize: 12 }}>{statusLabel.sent_to_bookkeeper}</MenuItem>
                <MenuItem value="resolved" sx={{ fontFamily: uiFontFamily, fontSize: 12 }}>{statusLabel.resolved}</MenuItem>
                <MenuItem value="irrelevant" sx={{ fontFamily: uiFontFamily, fontSize: 12 }}>{statusLabel.irrelevant}</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Stack direction="row" alignItems="center" spacing={0.4} sx={{ mb: 0.4 }}>
              <Sort sx={{ fontSize: 10, color: '#94A3B8' }} />
              <Typography sx={{ fontFamily: monoFontFamily, fontSize: 9, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Sort</Typography>
            </Stack>
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
          </Box>
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
            checked={isAllCriticalSelected}
            indeterminate={isCriticalIndeterminate}
            onChange={onToggleSelectAllCritical}
            sx={{
              p: 0.4,
              color: '#CBD5E1',
              '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: accentColor },
            }}
          />
          <Typography sx={{ fontFamily: uiFontFamily, fontSize: 12, color: '#0F172A', fontWeight: 600 }}>
            Select all{' '}
            <Box component="span" sx={{ color: severityColors.critical, fontWeight: 700 }}>
              CRITICAL
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
              <MenuItem value="mark_complete">Mark Resolved</MenuItem>
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

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

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
        gridTemplateColumns: '24px 24px 18px 1fr',
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

      <Tooltip title={`${finding.severity} severity`} placement="top" arrow>
        <Box
          sx={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            bgcolor: severityColors[finding.severity],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontFamily: monoFontFamily,
              fontSize: 8,
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1,
            }}
          >
            {finding.severity[0].toUpperCase()}
          </Typography>
        </Box>
      </Tooltip>

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
          {finding.category}
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
          {formatCurrency(finding.amount)}
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
  if (status === 'resolved') {
    return <CheckCircle sx={{ fontSize: 18, color: statusColors.resolved }} />;
  }

  if (status === 'irrelevant') {
    return <RemoveCircleOutline sx={{ fontSize: 18, color: statusColors.irrelevant }} />;
  }

  if (status === 'sent_to_bookkeeper') {
    return <HourglassEmpty sx={{ fontSize: 17, color: statusColors.sent_to_bookkeeper }} />;
  }

  if (status === 'noted') {
    return <SwapHoriz sx={{ fontSize: 18, color: statusColors.noted }} />;
  }

  if (isCurrent) {
    return <PlayArrow sx={{ fontSize: 18, color: accentColor }} />;
  }

  return <RadioButtonUnchecked sx={{ fontSize: 17, color: statusColors.open }} />;
};
