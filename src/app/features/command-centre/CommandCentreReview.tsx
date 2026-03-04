import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { defaultCurrentFindingId, mockReviewData } from './mockData';
import { FindingPanel } from './FindingPanel';
import { QueuePanel } from './QueuePanel';
import { ReviewPageHeader } from './ReviewPageHeader';
import { BulkAction, Finding, FindingStatus, QueueSortMode } from './types';
import { baseFontFamily } from './tokens';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

const severityRank: Record<Finding['severity'], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const sortFindings = (findings: Finding[], sortMode: QueueSortMode): Finding[] => {
  const sorted = [...findings];

  sorted.sort((left, right) => {
    if (sortMode === 'amount') {
      return right.amount - left.amount;
    }

    if (sortMode === 'account') {
      return left.accountLabel.localeCompare(right.accountLabel);
    }

    const severityDelta = severityRank[left.severity] - severityRank[right.severity];
    if (severityDelta !== 0) {
      return severityDelta;
    }

    return right.amount - left.amount;
  });

  return sorted;
};

const updateFindingList = (
  findings: Finding[],
  findingId: string,
  update: (finding: Finding) => Finding,
): Finding[] => {
  return findings.map((finding) => (finding.id === findingId ? update(finding) : finding));
};

export const CommandCentreReview = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const [findings, setFindings] = useState<Finding[]>(mockReviewData.findings);
  const [currentFindingId, setCurrentFindingId] = useState(defaultCurrentFindingId);
  const [sortMode, setSortMode] = useState<QueueSortMode>('severity');
  const [selectedFindingIds, setSelectedFindingIds] = useState<string[]>([]);
  const [isQueueDrawerOpen, setQueueDrawerOpen] = useState(false);
  const [lastSavedEpochById, setLastSavedEpochById] = useState<Record<string, number>>({});

  const autosaveTimeoutByIdRef = useRef<Map<string, ReturnType<typeof window.setTimeout>>>(new Map());
  const notesInputRef = useRef<HTMLTextAreaElement | null>(null);

  const sortedFindings = useMemo(() => sortFindings(findings, sortMode), [findings, sortMode]);
  const totalFindings = findings.length;

  const currentFinding = useMemo(() => {
    return sortedFindings.find((finding) => finding.id === currentFindingId) ?? sortedFindings[0];
  }, [currentFindingId, sortedFindings]);

  const currentIndex = useMemo(() => {
    return sortedFindings.findIndex((finding) => finding.id === currentFinding.id);
  }, [currentFinding.id, sortedFindings]);

  const selectedFindingSet = useMemo(() => new Set(selectedFindingIds), [selectedFindingIds]);

  const counts = useMemo(() => {
    return findings.reduce(
      (accumulator, finding) => {
        if (finding.severity === 'high') {
          accumulator.high += 1;
        }

        if (finding.severity === 'medium') {
          accumulator.medium += 1;
        }

        if (finding.severity === 'low') {
          accumulator.low += 1;
        }

        if (finding.status !== 'pending') {
          accumulator.reviewed += 1;
        }

        return accumulator;
      },
      { high: 0, medium: 0, low: 0, reviewed: 0 },
    );
  }, [findings]);

  const highSeverityIds = useMemo(() => {
    return sortedFindings.filter((finding) => finding.severity === 'high').map((finding) => finding.id);
  }, [sortedFindings]);

  const isAllHighSelected = useMemo(() => {
    return highSeverityIds.length > 0 && highSeverityIds.every((findingId) => selectedFindingSet.has(findingId));
  }, [highSeverityIds, selectedFindingSet]);

  const isHighIndeterminate = useMemo(() => {
    return highSeverityIds.some((findingId) => selectedFindingSet.has(findingId)) && !isAllHighSelected;
  }, [highSeverityIds, isAllHighSelected, selectedFindingSet]);

  const flushAutosave = useCallback((findingId: string) => {
    const pendingTimeout = autosaveTimeoutByIdRef.current.get(findingId);
    if (pendingTimeout) {
      window.clearTimeout(pendingTimeout);
      autosaveTimeoutByIdRef.current.delete(findingId);
    }

    setLastSavedEpochById((previous) => ({ ...previous, [findingId]: Date.now() }));
  }, []);

  const scheduleAutosave = useCallback(
    (findingId: string) => {
      const pendingTimeout = autosaveTimeoutByIdRef.current.get(findingId);
      if (pendingTimeout) {
        window.clearTimeout(pendingTimeout);
      }

      const timeout = window.setTimeout(() => {
        autosaveTimeoutByIdRef.current.delete(findingId);
        setLastSavedEpochById((previous) => ({ ...previous, [findingId]: Date.now() }));
      }, 500);

      autosaveTimeoutByIdRef.current.set(findingId, timeout);
    },
    [],
  );

  const updateFindingStatus = useCallback((findingId: string, status: FindingStatus) => {
    setFindings((previous) => {
      return updateFindingList(previous, findingId, (finding) => ({ ...finding, status }));
    });
  }, []);

  const updateCurrentFindingNotes = useCallback(
    (value: string) => {
      setFindings((previous) => {
        return updateFindingList(previous, currentFinding.id, (finding) => ({ ...finding, notes: value }));
      });
      scheduleAutosave(currentFinding.id);
    },
    [currentFinding.id, scheduleAutosave],
  );

  const handleSendToBookkeeper = useCallback(() => {
    if (currentFinding.notes.trim().length === 0) {
      return;
    }

    updateFindingStatus(currentFinding.id, 'needs_action');
    flushAutosave(currentFinding.id);
  }, [currentFinding.id, currentFinding.notes, flushAutosave, updateFindingStatus]);

  const handleNext = useCallback(() => {
    if (currentIndex < 0 || currentIndex >= sortedFindings.length - 1) {
      return;
    }

    setCurrentFindingId(sortedFindings[currentIndex + 1].id);
  }, [currentIndex, sortedFindings]);

  const handlePrev = useCallback(() => {
    if (currentIndex <= 0) {
      return;
    }

    setCurrentFindingId(sortedFindings[currentIndex - 1].id);
  }, [currentIndex, sortedFindings]);

  const handleToggleSelectFinding = useCallback((findingId: string) => {
    setSelectedFindingIds((previous) => {
      if (previous.includes(findingId)) {
        return previous.filter((id) => id !== findingId);
      }

      return [...previous, findingId];
    });
  }, []);

  const handleToggleSelectAllHigh = useCallback(() => {
    setSelectedFindingIds((previous) => {
      const selectedSet = new Set(previous);

      if (highSeverityIds.length > 0 && highSeverityIds.every((id) => selectedSet.has(id))) {
        return previous.filter((id) => !highSeverityIds.includes(id));
      }

      highSeverityIds.forEach((id) => selectedSet.add(id));
      return Array.from(selectedSet);
    });
  }, [highSeverityIds]);

  const handleApplyBulkAction = useCallback((action: BulkAction) => {
    if (selectedFindingIds.length === 0) {
      return;
    }

    const nextStatus: FindingStatus = action === 'mark_complete' ? 'complete' : 'irrelevant';
    const selectedSet = new Set(selectedFindingIds);

    setFindings((previous) => {
      return previous.map((finding) => {
        if (!selectedSet.has(finding.id)) {
          return finding;
        }

        return {
          ...finding,
          status: nextStatus,
        };
      });
    });

    setSelectedFindingIds([]);
  }, [selectedFindingIds]);

  const focusNotes = useCallback(() => {
    notesInputRef.current?.focus();
  }, []);

  useKeyboardShortcuts({
    onNext: handleNext,
    onPrev: handlePrev,
    onMarkIrrelevant: () => updateFindingStatus(currentFinding.id, 'irrelevant'),
    onMarkComplete: () => updateFindingStatus(currentFinding.id, 'complete'),
    onFocusNotes: focusNotes,
  });

  useEffect(() => {
    if (sortedFindings.length === 0) {
      return;
    }

    if (!sortedFindings.some((finding) => finding.id === currentFindingId)) {
      setCurrentFindingId(sortedFindings[0].id);
    }
  }, [currentFindingId, sortedFindings]);

  useEffect(() => {
    return () => {
      autosaveTimeoutByIdRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      autosaveTimeoutByIdRef.current.clear();
    };
  }, []);

  const lastSavedLabel = lastSavedEpochById[currentFinding.id]
    ? `Autosaved at ${format(new Date(lastSavedEpochById[currentFinding.id]), 'HH:mm:ss')}`
    : 'Autosave pending';

  const queuePanel = (
    <QueuePanel
      findings={sortedFindings}
      currentFindingId={currentFinding.id}
      sortMode={sortMode}
      onSortModeChange={setSortMode}
      selectedIds={selectedFindingIds}
      onToggleSelectFinding={handleToggleSelectFinding}
      onOpenFinding={(findingId) => {
        setCurrentFindingId(findingId);
        if (isMobile) {
          setQueueDrawerOpen(false);
        }
      }}
      onToggleSelectAllHigh={handleToggleSelectAllHigh}
      isAllHighSelected={isAllHighSelected}
      isHighIndeterminate={isHighIndeterminate}
      onApplyBulkAction={handleApplyBulkAction}
    />
  );

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: baseFontFamily,
        bgcolor: '#F3F7FD',
        backgroundImage:
          'radial-gradient(circle at 15% -10%, rgba(37,99,235,0.12), transparent 45%), radial-gradient(circle at 100% 0%, rgba(14,165,233,0.11), transparent 40%)',
      }}
    >
      <ReviewPageHeader
        meta={mockReviewData.meta}
        totalFindings={totalFindings}
        reviewedCount={counts.reviewed}
        highCount={counts.high}
        mediumCount={counts.medium}
        lowCount={counts.low}
        isMobile={isMobile}
        onOpenQueue={() => setQueueDrawerOpen(true)}
      />

      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, flexDirection: isMobile ? 'column' : 'row' }}>
        <FindingPanel
          finding={currentFinding}
          findingIndex={Math.max(currentIndex, 0)}
          totalFindings={sortedFindings.length}
          notesInputRef={notesInputRef}
          onMarkStatus={(status) => updateFindingStatus(currentFinding.id, status)}
          onNotesChange={updateCurrentFindingNotes}
          onNotesBlur={() => flushAutosave(currentFinding.id)}
          onSendToBookkeeper={handleSendToBookkeeper}
          canGoPrev={currentIndex > 0}
          canGoNext={currentIndex >= 0 && currentIndex < sortedFindings.length - 1}
          onPrev={handlePrev}
          onNext={handleNext}
          lastSavedLabel={lastSavedLabel}
        />

        {!isMobile ? (
          <Box
            sx={{
              width: '35%',
              minWidth: 340,
              maxWidth: 460,
              bgcolor: '#FFFFFF',
              minHeight: 0,
            }}
          >
            {queuePanel}
          </Box>
        ) : null}
      </Box>

      <Drawer
        anchor="right"
        open={isQueueDrawerOpen && isMobile}
        onClose={() => setQueueDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 'min(92vw, 380px)',
            bgcolor: '#FFFFFF',
            borderLeft: '1px solid #D8E2F1',
            fontFamily: baseFontFamily,
          },
        }}
      >
        <Box sx={{ height: '100%', pt: 1 }}>{queuePanel}</Box>
      </Drawer>
    </Box>
  );
};
