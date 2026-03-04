import { useMemo, useReducer, useState } from 'react';
import { Box, Drawer, Snackbar, useMediaQuery } from '@mui/material';

import { buildFindingsFixture, reviewMetaFixture } from './fixtures';
import { buildFindingsSummary, buildSectionTree, filterFindings, flattenSectionIds, makeSectionId } from './selectors';
import { FindingsPanel } from './FindingsPanel';
import { SectionTree } from './SectionTree';
import { SendToBookkeeperDialog } from './SendToBookkeeperDialog';
import { SummaryPanel } from './SummaryPanel';
import type { FindingStatus, ReviewMeta, SelectedSection, Finding } from './types';

type State = {
  review: ReviewMeta;
  findings: Finding[];
  selectedSection: SelectedSection;
  expandedSectionIds: Set<string>;
  expandedFindingIds: Set<string>;
  notesOpenFindingIds: Set<string>;
  selectedFindingIds: Set<string>;
  sendDialogOpen: boolean;
  sendNotes: string;
  toastMessage: string | null;
  renderLimit: number;
};

type Action =
  | { type: 'select_section'; section: SelectedSection }
  | { type: 'clear_section' }
  | { type: 'toggle_section_expand'; id: string }
  | { type: 'set_section_expanded'; ids: string[] }
  | { type: 'clear_section_expanded' }
  | { type: 'toggle_finding_expand'; id: string }
  | { type: 'toggle_finding_selected'; id: string }
  | { type: 'select_many'; ids: string[] }
  | { type: 'clear_many'; ids: string[] }
  | { type: 'clear_all_selection' }
  | { type: 'set_status'; id: string; status: FindingStatus }
  | { type: 'bulk_set_status'; ids: string[]; status: FindingStatus }
  | { type: 'toggle_notes'; id: string }
  | { type: 'set_notes'; id: string; notes: string }
  | { type: 'open_send_dialog' }
  | { type: 'close_send_dialog' }
  | { type: 'set_send_notes'; notes: string }
  | { type: 'confirm_send'; ids: string[] }
  | { type: 'hide_toast' }
  | { type: 'load_more' };

const DEFAULT_RENDER_LIMIT = 50;
const LOAD_MORE_STEP = 50;

function toggleId(set: Set<string>, id: string): Set<string> {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

function addMany(set: Set<string>, ids: string[]): Set<string> {
  const next = new Set(set);
  for (const id of ids) next.add(id);
  return next;
}

function removeMany(set: Set<string>, ids: string[]): Set<string> {
  const next = new Set(set);
  for (const id of ids) next.delete(id);
  return next;
}

function updateFinding(findings: Finding[], id: string, updater: (f: Finding) => Finding): Finding[] {
  return findings.map((f) => (f.id === id ? updater(f) : f));
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'select_section':
      return {
        ...state,
        selectedSection: action.section,
        renderLimit: DEFAULT_RENDER_LIMIT,
        expandedFindingIds: new Set(),
        notesOpenFindingIds: new Set(),
        selectedFindingIds: new Set(),
      };
    case 'clear_section':
      return {
        ...state,
        selectedSection: {},
        renderLimit: DEFAULT_RENDER_LIMIT,
        expandedFindingIds: new Set(),
        notesOpenFindingIds: new Set(),
        selectedFindingIds: new Set(),
      };
    case 'toggle_section_expand':
      return { ...state, expandedSectionIds: toggleId(state.expandedSectionIds, action.id) };
    case 'set_section_expanded':
      return { ...state, expandedSectionIds: new Set(action.ids) };
    case 'clear_section_expanded':
      return { ...state, expandedSectionIds: new Set() };
    case 'toggle_finding_expand':
      return { ...state, expandedFindingIds: toggleId(state.expandedFindingIds, action.id) };
    case 'toggle_finding_selected':
      return { ...state, selectedFindingIds: toggleId(state.selectedFindingIds, action.id) };
    case 'select_many':
      return { ...state, selectedFindingIds: addMany(state.selectedFindingIds, action.ids) };
    case 'clear_many':
      return { ...state, selectedFindingIds: removeMany(state.selectedFindingIds, action.ids) };
    case 'clear_all_selection':
      return { ...state, selectedFindingIds: new Set() };
    case 'set_status':
      return {
        ...state,
        findings: updateFinding(state.findings, action.id, (f) => ({ ...f, status: action.status })),
      };
    case 'bulk_set_status':
      // Keep this reducer pure and avoid quadratic checks for large lists.
      // This still stays simple and readable for prototype data sizes.
      return {
        ...state,
        findings: (() => {
          const idSet = new Set(action.ids);
          return state.findings.map((f) => (idSet.has(f.id) ? { ...f, status: action.status } : f));
        })(),
      };
    case 'toggle_notes': {
      const wasOpen = state.notesOpenFindingIds.has(action.id);
      const nextSet = toggleId(state.notesOpenFindingIds, action.id);

      if (wasOpen) {
        return { ...state, notesOpenFindingIds: nextSet };
      }

      // Opening notes sets status to needs_action unless already complete.
      return {
        ...state,
        notesOpenFindingIds: nextSet,
        findings: updateFinding(state.findings, action.id, (f) => (f.status === 'complete' ? f : { ...f, status: 'needs_action' })),
      };
    }
    case 'set_notes':
      return {
        ...state,
        findings: updateFinding(state.findings, action.id, (f) => ({ ...f, accountantNotes: action.notes })),
      };
    case 'open_send_dialog':
      return { ...state, sendDialogOpen: true };
    case 'close_send_dialog':
      return { ...state, sendDialogOpen: false, sendNotes: '' };
    case 'set_send_notes':
      return { ...state, sendNotes: action.notes };
    case 'confirm_send':
      return {
        ...state,
        review: { ...state.review, status: 'awaiting_bookkeeper_fixes' },
        findings: (() => {
          const idSet = new Set(action.ids);
          return state.findings.map((f) => (idSet.has(f.id) ? { ...f, status: 'needs_action' } : f));
        })(),
        selectedFindingIds: new Set(),
        sendDialogOpen: false,
        sendNotes: '',
        toastMessage: 'Sent to bookkeeper (prototype). MR status updated to awaiting fixes.',
      };
    case 'hide_toast':
      return { ...state, toastMessage: null };
    case 'load_more':
      return { ...state, renderLimit: state.renderLimit + LOAD_MORE_STEP };
    default:
      return state;
  }
}

export function AiReviewTab() {
  const [sectionsDrawerOpen, setSectionsDrawerOpen] = useState(false);
  const isNarrow = useMediaQuery('(max-width:1200px)');

  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    review: reviewMetaFixture,
    findings: buildFindingsFixture(60),
    selectedSection: {},
    expandedSectionIds: new Set(['st:balance_sheet', 'st:pl']),
    expandedFindingIds: new Set(),
    notesOpenFindingIds: new Set(),
    selectedFindingIds: new Set(),
    sendDialogOpen: false,
    sendNotes: '',
    toastMessage: null,
    renderLimit: DEFAULT_RENDER_LIMIT,
  }));

  const tree = useMemo(() => buildSectionTree(state.findings), [state.findings]);
  const allSectionIds = useMemo(() => flattenSectionIds(tree), [tree]);

  const selectedSectionId = useMemo(() => {
    if (!state.selectedSection.statement && !state.selectedSection.category && !state.selectedSection.account) return null;
    return makeSectionId(state.selectedSection);
  }, [state.selectedSection]);

  const filteredFindings = useMemo(() => filterFindings(state.findings, state.selectedSection), [state.findings, state.selectedSection]);

  const summaryAll = useMemo(() => buildFindingsSummary(state.findings), [state.findings]);
  const summaryFiltered = useMemo(() => buildFindingsSummary(filteredFindings), [filteredFindings]);

  const filteredIds = useMemo(() => filteredFindings.map((f) => f.id), [filteredFindings]);
  const selectedCountInFiltered = useMemo(() => {
    let count = 0;
    for (const id of filteredIds) {
      if (state.selectedFindingIds.has(id)) count += 1;
    }
    return count;
  }, [filteredIds, state.selectedFindingIds]);

  const allSelectedInFiltered = filteredIds.length > 0 && selectedCountInFiltered === filteredIds.length;
  const partiallySelectedInFiltered = selectedCountInFiltered > 0 && selectedCountInFiltered < filteredIds.length;
  const sendEnabled = state.selectedFindingIds.size > 0;

  const selectedFindings = useMemo(() => state.findings.filter((f) => state.selectedFindingIds.has(f.id)), [state.findings, state.selectedFindingIds]);

  const onToggleSelectAllFiltered = () => {
    if (filteredIds.length === 0) return;
    if (allSelectedInFiltered) {
      dispatch({ type: 'clear_many', ids: filteredIds });
    } else {
      dispatch({ type: 'select_many', ids: filteredIds });
    }
  };

  const onBulkSetStatus = (status: FindingStatus) => {
    if (filteredIds.length === 0) return;
    const idsToUpdate = filteredIds.filter((id) => state.selectedFindingIds.has(id));
    if (idsToUpdate.length === 0) return;
    dispatch({ type: 'bulk_set_status', ids: idsToUpdate, status });
  };

  const onMarkIrrelevant = (findingId: string) => {
    const finding = state.findings.find((f) => f.id === findingId);
    if (!finding) return;
    const nextStatus: FindingStatus = finding.status === 'irrelevant' ? 'pending' : 'irrelevant';
    dispatch({ type: 'set_status', id: findingId, status: nextStatus });
  };

  const onMarkComplete = (findingId: string) => {
    const finding = state.findings.find((f) => f.id === findingId);
    if (!finding) return;
    const nextStatus: FindingStatus = finding.status === 'complete' ? 'pending' : 'complete';
    dispatch({ type: 'set_status', id: findingId, status: nextStatus });
  };

  const onConfirmSend = () => {
    const ids = selectedFindings.map((f) => f.id);
    if (ids.length === 0) return;

    // Payload shape from MIND-415 (prototype only).
    // POST /api/mr-review/{review_id}/send-to-bookkeeper
    // Body: { finding_ids: [...], notes: "..." }
    // eslint-disable-next-line no-console
    console.log('send-to-bookkeeper payload', { finding_ids: ids, notes: state.sendNotes });

    dispatch({ type: 'confirm_send', ids });
  };

  const sectionsPanel = (
    <SectionTree
      tree={tree}
      expandedIds={state.expandedSectionIds}
      selectedSectionId={selectedSectionId}
      onSelectSection={(section) => dispatch({ type: 'select_section', section })}
      onToggleExpanded={(id) => dispatch({ type: 'toggle_section_expand', id })}
      onExpandAll={() => dispatch({ type: 'set_section_expanded', ids: allSectionIds })}
      onCollapseAll={() => dispatch({ type: 'clear_section_expanded' })}
      onClearSelection={() => dispatch({ type: 'clear_section' })}
    />
  );

  return (
    <Box sx={{ position: 'relative', flex: 1, overflow: 'hidden', bgcolor: 'background.default' }}>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(900px circle at 0% 0%, rgba(20,184,166,0.18) 0%, rgba(20,184,166,0) 60%), radial-gradient(900px circle at 100% 0%, rgba(56,189,248,0.16) 0%, rgba(56,189,248,0) 55%), linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
        }}
      />

      <Box sx={{ position: 'relative', display: 'flex', flex: 1, minHeight: 0, p: 2, gap: 2, overflow: 'hidden' }}>
        {isNarrow ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 2 }}>
              <Box
                sx={{
                  flex: '0 0 auto',
                  maxHeight: 280,
                  overflow: 'auto',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.70)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 18px 45px rgba(2,6,23,0.08)',
                }}
              >
                <SummaryPanel review={state.review} summaryAll={summaryAll} summaryFiltered={summaryFiltered} />
              </Box>

              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  overflow: 'hidden',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.70)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 18px 45px rgba(2,6,23,0.08)',
                }}
              >
                <FindingsPanel
                  findings={filteredFindings}
                  renderLimit={state.renderLimit}
                  onLoadMore={() => dispatch({ type: 'load_more' })}
                  showSectionsButton
                  onOpenSections={() => setSectionsDrawerOpen(true)}
                  expandedFindingIds={state.expandedFindingIds}
                  selectedFindingIds={state.selectedFindingIds}
                  notesOpenFindingIds={state.notesOpenFindingIds}
                  selectedCountInFiltered={selectedCountInFiltered}
                  allSelectedInFiltered={allSelectedInFiltered}
                  partiallySelectedInFiltered={partiallySelectedInFiltered}
                  onToggleSelectAllFiltered={onToggleSelectAllFiltered}
                  onBulkMarkIrrelevant={() => onBulkSetStatus('irrelevant')}
                  onBulkMarkComplete={() => onBulkSetStatus('complete')}
                  onOpenSendDialog={() => dispatch({ type: 'open_send_dialog' })}
                  sendEnabled={sendEnabled}
                  onToggleExpanded={(id) => dispatch({ type: 'toggle_finding_expand', id })}
                  onToggleSelected={(id) => dispatch({ type: 'toggle_finding_selected', id })}
                  onMarkIrrelevant={onMarkIrrelevant}
                  onMarkComplete={onMarkComplete}
                  onToggleNotes={(id) => dispatch({ type: 'toggle_notes', id })}
                  onChangeNotes={(id, notes) => dispatch({ type: 'set_notes', id, notes })}
                />
              </Box>

              <Drawer
                anchor="left"
                open={sectionsDrawerOpen}
                onClose={() => setSectionsDrawerOpen(false)}
                PaperProps={{ sx: { background: 'transparent', boxShadow: 'none' } }}
              >
                <Box sx={{ width: 360, height: '100%', p: 2 }}>
                  <Box
                    sx={{
                      height: '100%',
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      borderRadius: 4,
                      overflow: 'hidden',
                      backgroundColor: 'rgba(255,255,255,0.80)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 18px 45px rgba(2,6,23,0.10)',
                    }}
                  >
                    {sectionsPanel}
                  </Box>
                </Box>
              </Drawer>
          </Box>
        ) : (
          <>
              <Box
                sx={{
                  width: 320,
                  minHeight: 0,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 4,
                  overflow: 'hidden',
                  backgroundColor: 'rgba(255,255,255,0.70)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 18px 45px rgba(2,6,23,0.08)',
                }}
              >
                {sectionsPanel}
              </Box>

              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  overflow: 'hidden',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.70)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 18px 45px rgba(2,6,23,0.08)',
                }}
              >
                <FindingsPanel
                  findings={filteredFindings}
                  renderLimit={state.renderLimit}
                  onLoadMore={() => dispatch({ type: 'load_more' })}
                  expandedFindingIds={state.expandedFindingIds}
                  selectedFindingIds={state.selectedFindingIds}
                  notesOpenFindingIds={state.notesOpenFindingIds}
                  selectedCountInFiltered={selectedCountInFiltered}
                  allSelectedInFiltered={allSelectedInFiltered}
                  partiallySelectedInFiltered={partiallySelectedInFiltered}
                  onToggleSelectAllFiltered={onToggleSelectAllFiltered}
                  onBulkMarkIrrelevant={() => onBulkSetStatus('irrelevant')}
                  onBulkMarkComplete={() => onBulkSetStatus('complete')}
                  onOpenSendDialog={() => dispatch({ type: 'open_send_dialog' })}
                  sendEnabled={sendEnabled}
                  onToggleExpanded={(id) => dispatch({ type: 'toggle_finding_expand', id })}
                  onToggleSelected={(id) => dispatch({ type: 'toggle_finding_selected', id })}
                  onMarkIrrelevant={onMarkIrrelevant}
                  onMarkComplete={onMarkComplete}
                  onToggleNotes={(id) => dispatch({ type: 'toggle_notes', id })}
                  onChangeNotes={(id, notes) => dispatch({ type: 'set_notes', id, notes })}
                />
              </Box>

              <Box
                sx={{
                  width: 340,
                  minHeight: 0,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 4,
                  overflow: 'hidden',
                  backgroundColor: 'rgba(255,255,255,0.70)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 18px 45px rgba(2,6,23,0.08)',
                }}
              >
                <SummaryPanel review={state.review} summaryAll={summaryAll} summaryFiltered={summaryFiltered} />
              </Box>
          </>
        )}
      </Box>

      <SendToBookkeeperDialog
        open={state.sendDialogOpen}
        selectedFindings={selectedFindings}
        consolidatedNotes={state.sendNotes}
        onChangeConsolidatedNotes={(notes) => dispatch({ type: 'set_send_notes', notes })}
        onClose={() => dispatch({ type: 'close_send_dialog' })}
        onConfirm={onConfirmSend}
      />

      <Snackbar
        open={Boolean(state.toastMessage)}
        autoHideDuration={3500}
        onClose={() => dispatch({ type: 'hide_toast' })}
        message={state.toastMessage ?? ''}
      />
    </Box>
  );
}
