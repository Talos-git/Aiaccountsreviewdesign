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
  PlayArrow,
  RadioButtonUnchecked,
  RemoveCircleOutline,
} from '@mui/icons-material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { BulkAction, Finding, QueueSortMode } from './types';
import { baseFontFamily, severityColors, statusColors } from './tokens';

interface QueuePanelProps {
  findings: Finding[];
  currentFindingId: string;
  sortMode: QueueSortMode;
  onSortModeChange: (mode: QueueSortMode) => void;
  selectedIds: string[];
  onToggleSelectFinding: (findingId: string) => void;
  onOpenFinding: (findingId: string) => void;
  onToggleSelectAllHigh: () => void;
  isAllHighSelected: boolean;
  isHighIndeterminate: boolean;
  onApplyBulkAction: (action: BulkAction) => void;
}

const rowHeight = 62;

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
  currentFindingId,
  sortMode,
  onSortModeChange,
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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 2, py: 1.5, borderBottom: '1px solid #D8E2F1' }}
      >
        <Typography
          sx={{
            fontFamily: baseFontFamily,
            fontSize: 13,
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Queue
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography sx={{ fontFamily: baseFontFamily, fontSize: 12, color: '#64748B' }}>
            Sort
          </Typography>
          <FormControl size="small">
            <Select
              value={sortMode}
              onChange={handleSortChange}
              sx={{
                minWidth: 128,
                height: 32,
                fontSize: 13,
                fontFamily: baseFontFamily,
                bgcolor: '#FFFFFF',
                borderRadius: 1.5,
              }}
            >
              <MenuItem value="severity">Severity</MenuItem>
              <MenuItem value="amount">Amount</MenuItem>
              <MenuItem value="account">Account</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <Box ref={listContainerRef} sx={{ flex: 1, minHeight: 0, overflow: 'hidden', bgcolor: '#F8FAFD' }}>
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

      <Box sx={{ px: 2, py: 1.25, bgcolor: '#FFFFFF' }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Checkbox
            size="small"
            checked={isAllHighSelected}
            indeterminate={isHighIndeterminate}
            onChange={onToggleSelectAllHigh}
            sx={{ p: 0.4 }}
          />
          <Typography sx={{ fontFamily: baseFontFamily, fontSize: 12, color: '#334155', fontWeight: 600 }}>
            Select all HIGH
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
                fontFamily: baseFontFamily,
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
              fontFamily: baseFontFamily,
              fontWeight: 700,
              borderRadius: 1.5,
              whiteSpace: 'nowrap',
              bgcolor: '#0F172A',
              '&:hover': {
                bgcolor: '#020617',
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
  const titleStyles: CSSProperties = {
    fontFamily: baseFontFamily,
    fontSize: 13,
    fontWeight: isCurrent ? 700 : 600,
    color: finding.status === 'irrelevant' ? '#94A3B8' : '#0F172A',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textDecoration: finding.status === 'irrelevant' ? 'line-through' : 'none',
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
        bgcolor: isCurrent ? '#EAF2FF' : '#FFFFFF',
        transition: 'background-color 180ms ease',
        '&:hover': {
          bgcolor: isCurrent ? '#E2EDFF' : '#F8FAFC',
        },
      }}
    >
      <Checkbox
        size="small"
        checked={isSelected}
        onClick={(event) => event.stopPropagation()}
        onChange={() => onToggleSelect(finding.id)}
        sx={{ p: 0.4 }}
      />

      <StatusGlyph status={finding.status} isCurrent={isCurrent} />

      <Box
        sx={{
          width: 9,
          height: 9,
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
            fontFamily: baseFontFamily,
            fontSize: 12,
            color: '#64748B',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
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

  if (isCurrent) {
    return <PlayArrow sx={{ fontSize: 18, color: statusColors.needs_action }} />;
  }

  return <RadioButtonUnchecked sx={{ fontSize: 17, color: statusColors.pending }} />;
};
