import { Box, Button, Checkbox, Divider, Stack, Typography } from '@mui/material';
import { AccountTree, DoneAll, ReportOff, Send } from '@mui/icons-material';

import type { Finding } from './types';
import { FindingCard } from './FindingCard';

type FindingsPanelProps = {
  findings: Finding[];
  renderLimit: number;
  onLoadMore: () => void;
  showSectionsButton?: boolean;
  onOpenSections?: () => void;
  expandedFindingIds: Set<string>;
  selectedFindingIds: Set<string>;
  notesOpenFindingIds: Set<string>;
  selectedCountInFiltered: number;
  allSelectedInFiltered: boolean;
  partiallySelectedInFiltered: boolean;
  onToggleSelectAllFiltered: () => void;
  onBulkMarkIrrelevant: () => void;
  onBulkMarkComplete: () => void;
  onOpenSendDialog: () => void;
  sendEnabled: boolean;
  onToggleExpanded: (findingId: string) => void;
  onToggleSelected: (findingId: string) => void;
  onMarkIrrelevant: (findingId: string) => void;
  onMarkComplete: (findingId: string) => void;
  onToggleNotes: (findingId: string) => void;
  onChangeNotes: (findingId: string, notes: string) => void;
};

export function FindingsPanel({
  findings,
  renderLimit,
  onLoadMore,
  showSectionsButton,
  onOpenSections,
  expandedFindingIds,
  selectedFindingIds,
  notesOpenFindingIds,
  selectedCountInFiltered,
  allSelectedInFiltered,
  partiallySelectedInFiltered,
  onToggleSelectAllFiltered,
  onBulkMarkIrrelevant,
  onBulkMarkComplete,
  onOpenSendDialog,
  sendEnabled,
  onToggleExpanded,
  onToggleSelected,
  onMarkIrrelevant,
  onMarkComplete,
  onToggleNotes,
  onChangeNotes,
}: FindingsPanelProps) {
  const visibleFindings = findings.slice(0, renderLimit);
  const canLoadMore = findings.length > renderLimit;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0', bgcolor: 'white' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ flexWrap: 'wrap' }} useFlexGap>
          <Box>
            <Typography variant="subtitle2" sx={{ fontSize: 13, fontWeight: 700 }}>
              Findings ({findings.length})
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Selected: {selectedCountInFiltered}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }} useFlexGap>
            {showSectionsButton ? (
              <Button
                size="small"
                variant="outlined"
                startIcon={<AccountTree fontSize="small" />}
                onClick={onOpenSections}
                sx={{ textTransform: 'none' }}
              >
                Sections
              </Button>
            ) : null}

            <Checkbox
              checked={allSelectedInFiltered}
              indeterminate={partiallySelectedInFiltered}
              onChange={onToggleSelectAllFiltered}
              size="small"
            />
            <Typography variant="caption" sx={{ color: '#666', mr: 1 }}>
              Select all (filtered)
            </Typography>

            <Button
              size="small"
              variant="outlined"
              startIcon={<ReportOff fontSize="small" />}
              onClick={onBulkMarkIrrelevant}
              disabled={selectedCountInFiltered === 0}
              sx={{ textTransform: 'none' }}
            >
              Bulk irrelevant
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<DoneAll fontSize="small" />}
              onClick={onBulkMarkComplete}
              disabled={selectedCountInFiltered === 0}
              sx={{ textTransform: 'none' }}
            >
              Bulk complete
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<Send fontSize="small" />}
              onClick={onOpenSendDialog}
              disabled={!sendEnabled}
              sx={{ textTransform: 'none' }}
            >
              Send to Bookkeeper
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: '#fafafa' }}>
        {findings.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#666' }}>
            No findings for this section.
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {visibleFindings.map((finding) => (
              <FindingCard
                key={finding.id}
                finding={finding}
                expanded={expandedFindingIds.has(finding.id)}
                selected={selectedFindingIds.has(finding.id)}
                notesOpen={notesOpenFindingIds.has(finding.id)}
                onToggleExpanded={onToggleExpanded}
                onToggleSelected={onToggleSelected}
                onMarkIrrelevant={onMarkIrrelevant}
                onMarkComplete={onMarkComplete}
                onToggleNotes={onToggleNotes}
                onChangeNotes={onChangeNotes}
              />
            ))}

            {canLoadMore ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                <Button variant="outlined" onClick={onLoadMore} sx={{ textTransform: 'none' }}>
                  Load more
                </Button>
              </Box>
            ) : null}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
