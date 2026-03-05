import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { defaultCurrentFindingId, mockReviewData } from './mockData';
import { FindingPanel } from './FindingPanel';
import { QueuePanel } from './QueuePanel';
import { ReviewPageHeader } from './ReviewPageHeader';
import { BulkAction, ConversationMessage, Finding, FindingStatus, QueuePathFilter, QueueSortMode, QueueStatusFilter } from './types';
import { uiFontFamily } from './tokens';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

const severityRank: Record<Finding['severity'], number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

const sortFindings = (findings: Finding[], sortMode: QueueSortMode): Finding[] => {
  const sorted = [...findings];

  sorted.sort((left, right) => {
    if (sortMode === 'amount') {
      return right.amount - left.amount;
    }

    if (sortMode === 'account') {
      return left.accountName.localeCompare(right.accountName);
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
  const [activeRole, setActiveRole] = useState<'accountant' | 'bookkeeper'>('accountant');
  const [statusFilter, setStatusFilter] = useState<QueueStatusFilter>('all');
  const [pathFilter, setPathFilter] = useState<QueuePathFilter>('all');

  const handleRoleChange = useCallback((role: 'accountant' | 'bookkeeper') => {
    setActiveRole(role);
    setStatusFilter(role === 'bookkeeper' ? 'sent_to_bookkeeper' : 'all');
  }, []);

  const sortedFindings = useMemo(() => sortFindings(findings, sortMode), [findings, sortMode]);
  const totalFindings = findings.length;

  const filteredFindings = useMemo(() => {
    return sortedFindings.filter((finding) => {
      if (statusFilter !== 'all' && finding.status !== statusFilter) return false;
      if (pathFilter !== 'all' && finding.section !== pathFilter) return false;
      return true;
    });
  }, [sortedFindings, statusFilter, pathFilter]);

  const currentFinding = useMemo(() => {
    return filteredFindings.find((finding) => finding.id === currentFindingId) ?? filteredFindings[0] ?? sortedFindings[0];
  }, [currentFindingId, filteredFindings, sortedFindings]);

  const currentIndex = useMemo(() => {
    return filteredFindings.findIndex((finding) => finding.id === currentFinding?.id);
  }, [currentFinding, filteredFindings]);

  const selectedFindingSet = useMemo(() => new Set(selectedFindingIds), [selectedFindingIds]);

  const counts = useMemo(() => {
    return findings.reduce(
      (accumulator, finding) => {
        if (finding.severity === 'critical') {
          accumulator.critical += 1;
        }

        if (finding.severity === 'warning') {
          accumulator.warning += 1;
        }

        if (finding.severity === 'info') {
          accumulator.info += 1;
        }

        if (finding.status === 'resolved' || finding.status === 'irrelevant') {
          accumulator.reviewed += 1;
        }

        return accumulator;
      },
      { critical: 0, warning: 0, info: 0, reviewed: 0 },
    );
  }, [findings]);

  const criticalSeverityIds = useMemo(() => {
    return filteredFindings.filter((finding) => finding.severity === 'critical').map((finding) => finding.id);
  }, [filteredFindings]);

  const isAllCriticalSelected = useMemo(() => {
    return criticalSeverityIds.length > 0 && criticalSeverityIds.every((findingId) => selectedFindingSet.has(findingId));
  }, [criticalSeverityIds, selectedFindingSet]);

  const isCriticalIndeterminate = useMemo(() => {
    return criticalSeverityIds.some((findingId) => selectedFindingSet.has(findingId)) && !isAllCriticalSelected;
  }, [criticalSeverityIds, isAllCriticalSelected, selectedFindingSet]);

  const updateFindingStatus = useCallback((findingId: string, status: FindingStatus) => {
    setFindings((previous) => {
      return updateFindingList(previous, findingId, (finding) => ({ ...finding, status }));
    });
  }, []);

  const addMessage = useCallback((findingId: string, text: string) => {
    const author: ConversationMessage['author'] = activeRole;
    const newMessage: ConversationMessage = {
      id: `msg-${findingId}-${Date.now()}`,
      author,
      text,
      timestamp: Date.now(),
    };

    setFindings((previous) => {
      return updateFindingList(previous, findingId, (finding) => ({
        ...finding,
        messages: [...finding.messages, newMessage],
      }));
    });
  }, [activeRole]);

  const handleSendToBookkeeper = useCallback(() => {
    updateFindingStatus(currentFinding.id, 'sent_to_bookkeeper');
  }, [currentFinding.id, updateFindingStatus]);

  const handleBookkeeperReply = useCallback(() => {
    updateFindingStatus(currentFinding.id, 'noted');
  }, [currentFinding.id, updateFindingStatus]);

  const handleNext = useCallback(() => {
    if (currentIndex < 0 || currentIndex >= filteredFindings.length - 1) {
      return;
    }

    setCurrentFindingId(filteredFindings[currentIndex + 1].id);
  }, [currentIndex, filteredFindings]);

  const handlePrev = useCallback(() => {
    if (currentIndex <= 0) {
      return;
    }

    setCurrentFindingId(filteredFindings[currentIndex - 1].id);
  }, [currentIndex, filteredFindings]);

  const handleToggleSelectFinding = useCallback((findingId: string) => {
    setSelectedFindingIds((previous) => {
      if (previous.includes(findingId)) {
        return previous.filter((id) => id !== findingId);
      }

      return [...previous, findingId];
    });
  }, []);

  const handleToggleSelectAllCritical = useCallback(() => {
    setSelectedFindingIds((previous) => {
      const selectedSet = new Set(previous);

      if (criticalSeverityIds.length > 0 && criticalSeverityIds.every((id) => selectedSet.has(id))) {
        return previous.filter((id) => !criticalSeverityIds.includes(id));
      }

      criticalSeverityIds.forEach((id) => selectedSet.add(id));
      return Array.from(selectedSet);
    });
  }, [criticalSeverityIds]);

  const handleApplyBulkAction = useCallback((action: BulkAction) => {
    if (selectedFindingIds.length === 0) {
      return;
    }

    const nextStatus: FindingStatus = action === 'mark_complete' ? 'resolved' : 'irrelevant';
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

  useKeyboardShortcuts({
    onNext: handleNext,
    onPrev: handlePrev,
    onMarkIrrelevant: () => updateFindingStatus(currentFinding.id, 'irrelevant'),
    onMarkComplete: () => updateFindingStatus(currentFinding.id, 'resolved'),
  });

  useEffect(() => {
    if (filteredFindings.length === 0) {
      return;
    }

    if (!filteredFindings.some((finding) => finding.id === currentFindingId)) {
      setCurrentFindingId(filteredFindings[0].id);
    }
  }, [currentFindingId, filteredFindings]);

  const queuePanel = (
    <QueuePanel
      findings={filteredFindings}
      allFindings={sortedFindings}
      currentFindingId={currentFinding?.id ?? ''}
      sortMode={sortMode}
      onSortModeChange={setSortMode}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      pathFilter={pathFilter}
      onPathFilterChange={setPathFilter}
      selectedIds={selectedFindingIds}
      onToggleSelectFinding={handleToggleSelectFinding}
      onOpenFinding={(findingId) => {
        setCurrentFindingId(findingId);
        if (isMobile) {
          setQueueDrawerOpen(false);
        }
      }}
      onToggleSelectAllCritical={handleToggleSelectAllCritical}
      isAllCriticalSelected={isAllCriticalSelected}
      isCriticalIndeterminate={isCriticalIndeterminate}
      onApplyBulkAction={handleApplyBulkAction}
    />
  );

  if (!currentFinding) {
    return null;
  }

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: uiFontFamily,
        bgcolor: '#FAFAFA',
        backgroundImage:
          'radial-gradient(circle at 15% -10%, rgba(0,82,255,0.07), transparent 45%), radial-gradient(circle at 100% 0%, rgba(77,124,255,0.06), transparent 40%)',
      }}
    >
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, flexDirection: isMobile ? 'column' : 'row' }}>
        {/* Left column: header + finding panel, scrolls together */}
        <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <ReviewPageHeader
            meta={mockReviewData.meta}
            totalFindings={totalFindings}
            reviewedCount={counts.reviewed}
            criticalCount={counts.critical}
            warningCount={counts.warning}
            infoCount={counts.info}
            isMobile={isMobile}
            onOpenQueue={() => setQueueDrawerOpen(true)}
            activeRole={activeRole}
            onRoleChange={handleRoleChange}
          />
          <FindingPanel
            finding={currentFinding}
            findingIndex={Math.max(currentIndex, 0)}
            totalFindings={filteredFindings.length}
            activeRole={activeRole}
            onMarkStatus={(status) => updateFindingStatus(currentFinding.id, status)}
            onAddMessage={(text) => addMessage(currentFinding.id, text)}
            onSendToBookkeeper={handleSendToBookkeeper}
            onBookkeeperReply={handleBookkeeperReply}
            canGoPrev={currentIndex > 0}
            canGoNext={currentIndex >= 0 && currentIndex < filteredFindings.length - 1}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </Box>

        {!isMobile ? (
          <Box
            sx={{
              width: '35%',
              minWidth: 340,
              maxWidth: 460,
              bgcolor: '#FFFFFF',
              borderLeft: '1px solid #E2E8F0',
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
            borderLeft: `1px solid #E2E8F0`,
            fontFamily: uiFontFamily,
          },
        }}
      >
        <Box sx={{ height: '100%', pt: 1 }}>{queuePanel}</Box>
      </Drawer>
    </Box>
  );
};
