import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { CheckCircle, EditNote, ExpandLess, ExpandMore, ReportOff, TaskAlt } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

import type { Finding, FindingStatus } from './types';

type FindingCardProps = {
  finding: Finding;
  expanded: boolean;
  selected: boolean;
  notesOpen: boolean;
  onToggleExpanded: (findingId: string) => void;
  onToggleSelected: (findingId: string) => void;
  onMarkIrrelevant: (findingId: string) => void;
  onMarkComplete: (findingId: string) => void;
  onToggleNotes: (findingId: string) => void;
  onChangeNotes: (findingId: string, notes: string) => void;
};

function severityChipSx(severity: Finding['severity']) {
  switch (severity) {
    case 'high':
      return { bgcolor: 'rgba(225, 29, 72, 0.14)', borderColor: 'rgba(225, 29, 72, 0.26)', color: '#BE123C' };
    case 'medium':
      return { bgcolor: 'rgba(249, 115, 22, 0.14)', borderColor: 'rgba(249, 115, 22, 0.26)', color: '#C2410C' };
    case 'low':
      return { bgcolor: 'rgba(245, 158, 11, 0.16)', borderColor: 'rgba(245, 158, 11, 0.26)', color: '#92400E' };
    default:
      return {};
  }
}

function assertionChipSx(assertion: Finding['assertion']) {
  switch (assertion) {
    case 'C':
      return { bgcolor: 'rgba(14, 165, 233, 0.14)', borderColor: 'rgba(14, 165, 233, 0.26)', color: '#075985' };
    case 'E':
      return { bgcolor: 'rgba(34, 197, 94, 0.14)', borderColor: 'rgba(34, 197, 94, 0.26)', color: '#166534' };
    case 'A':
      return { bgcolor: 'rgba(168, 85, 247, 0.12)', borderColor: 'rgba(168, 85, 247, 0.24)', color: '#6D28D9' };
    default:
      return {};
  }
}

function statusLabel(status: FindingStatus): string {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'irrelevant':
      return 'Irrelevant';
    case 'complete':
      return 'Complete';
    case 'needs_action':
      return 'Needs action';
    default:
      return status;
  }
}

function statusChipSx(status: FindingStatus) {
  switch (status) {
    case 'complete':
      return { bgcolor: 'rgba(34, 197, 94, 0.14)', borderColor: 'rgba(34, 197, 94, 0.26)', color: '#166534' };
    case 'needs_action':
      return { bgcolor: 'rgba(249, 115, 22, 0.14)', borderColor: 'rgba(249, 115, 22, 0.26)', color: '#9A3412' };
    case 'irrelevant':
      return { bgcolor: 'rgba(15, 23, 42, 0.06)', borderColor: 'rgba(15, 23, 42, 0.14)', color: '#475569' };
    case 'pending':
      return { bgcolor: 'rgba(15, 23, 42, 0.05)', borderColor: 'rgba(15, 23, 42, 0.12)', color: '#334155' };
    default:
      return {};
  }
}

export function FindingCard({
  finding,
  expanded,
  selected,
  notesOpen,
  onToggleExpanded,
  onToggleSelected,
  onMarkIrrelevant,
  onMarkComplete,
  onToggleNotes,
  onChangeNotes,
}: FindingCardProps) {
  const isIrrelevant = finding.status === 'irrelevant';
  const isComplete = finding.status === 'complete';

  const sectionPathLabel = `${finding.section.statement === 'balance_sheet' ? 'BS' : 'P&L'} > ${finding.section.category} > ${
    finding.section.account
  }`;

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        borderColor: selected ? alpha(theme.palette.primary.main, 0.35) : alpha(theme.palette.text.primary, 0.10),
        backgroundColor: alpha(theme.palette.background.paper, isIrrelevant ? 0.55 : 0.85),
        backdropFilter: 'blur(8px)',
        opacity: isIrrelevant ? 0.85 : 1,
        boxShadow: selected ? '0 18px 45px rgba(2,6,23,0.10)' : '0 12px 30px rgba(2,6,23,0.06)',
        transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background-color 160ms ease',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 22px 60px rgba(2,6,23,0.10)',
        },
      })}
    >
      <Box sx={{ p: 1.5, display: 'flex', gap: 1.5 }}>
        <Checkbox checked={selected} onChange={() => onToggleSelected(finding.id)} sx={{ pt: 0.5 }} />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'text.primary',
                    textDecoration: isIrrelevant ? 'line-through' : 'none',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={finding.title}
                >
                  {finding.title}
                </Typography>
                {isComplete ? <CheckCircle sx={{ color: 'success.main', fontSize: 18 }} /> : null}
              </Stack>

              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 0.25 }}>
                {sectionPathLabel}
              </Typography>
            </Box>

            <IconButton size="small" onClick={() => onToggleExpanded(finding.id)} aria-label={expanded ? 'Collapse' : 'Expand'}>
              {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }} useFlexGap>
            <Chip
              size="small"
              variant="outlined"
              label={finding.severity.toUpperCase()}
              sx={{ fontSize: 12, ...severityChipSx(finding.severity) }}
            />
            <Chip
              size="small"
              variant="outlined"
              label={`Assertion ${finding.assertion}`}
              sx={{ fontSize: 12, ...assertionChipSx(finding.assertion) }}
            />
            <Chip size="small" variant="outlined" label={statusLabel(finding.status)} sx={{ fontSize: 12, ...statusChipSx(finding.status) }} />
            <Chip
              size="small"
              variant="outlined"
              label={finding.source}
              sx={(theme) => ({ fontSize: 12, color: theme.palette.text.secondary, backgroundColor: alpha(theme.palette.text.primary, 0.02) })}
            />
          </Stack>
        </Box>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider sx={{ borderColor: (theme) => theme.palette.divider }} />
        <Box sx={{ p: 1.5 }}>
          <Typography variant="body2" sx={{ fontSize: 13, color: 'text.primary', mb: 1 }}>
            {finding.description}
          </Typography>

          <Stack spacing={1}>
            {typeof finding.amount === 'number' ? (
              <Typography variant="body2" sx={{ fontSize: 13, color: 'text.secondary' }}>
                <b>Amount:</b> {finding.amount.toLocaleString()}
              </Typography>
            ) : null}
            {finding.context ? (
              <Typography variant="body2" sx={{ fontSize: 13, color: 'text.secondary' }}>
                <b>Context:</b> {finding.context}
              </Typography>
            ) : null}
            {finding.actionRequired ? (
              <Typography variant="body2" sx={{ fontSize: 13, color: 'text.secondary' }}>
                <b>Action required:</b> {finding.actionRequired}
              </Typography>
            ) : null}
            {finding.supportingData ? (
              <Box>
                <Typography variant="body2" sx={{ fontSize: 13, color: 'text.secondary', mb: 0.5 }}>
                  <b>Supporting data:</b>
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                  {Object.entries(finding.supportingData).map(([k, v]) => (
                    <li key={k}>
                      <Typography variant="body2" sx={{ fontSize: 13, color: 'text.secondary' }}>
                        {k}: {v}
                      </Typography>
                    </li>
                  ))}
                </Box>
              </Box>
            ) : null}
          </Stack>
        </Box>
      </Collapse>

      <Divider sx={{ borderColor: (theme) => theme.palette.divider }} />

      <Box sx={{ px: 1.5, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
          <Button
            size="small"
            variant="text"
            startIcon={<ReportOff fontSize="small" />}
            onClick={() => onMarkIrrelevant(finding.id)}
            sx={{ textTransform: 'none', color: 'text.secondary' }}
          >
            {finding.status === 'irrelevant' ? 'Unmark Irrelevant' : 'Mark Irrelevant'}
          </Button>
          <Button
            size="small"
            variant="text"
            startIcon={<TaskAlt fontSize="small" />}
            onClick={() => onMarkComplete(finding.id)}
            sx={{ textTransform: 'none', color: 'text.secondary' }}
          >
            {finding.status === 'complete' ? 'Undo Complete' : 'Mark Complete'}
          </Button>
          <Button size="small" variant="contained" startIcon={<EditNote fontSize="small" />} onClick={() => onToggleNotes(finding.id)}>
            {notesOpen ? 'Hide Notes' : 'Add Notes'}
          </Button>
        </Stack>

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {isIrrelevant ? 'Marked as irrelevant (reversible)' : isComplete ? 'Marked complete' : ''}
        </Typography>
      </Box>

      {notesOpen ? (
        <Box sx={{ px: 1.5, pb: 1.5 }}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={finding.accountantNotes}
            onChange={(e) => onChangeNotes(finding.id, e.target.value)}
            placeholder="Add accountant notes..."
            sx={(theme) => ({
              backgroundColor: alpha(theme.palette.background.paper, 0.70),
              borderRadius: 3,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha(theme.palette.text.primary, 0.12) },
            })}
          />
        </Box>
      ) : null}
    </Card>
  );
}
