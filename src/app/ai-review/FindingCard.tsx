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
import { CheckCircle, ExpandLess, ExpandMore } from '@mui/icons-material';

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
      return { bgcolor: '#f44336', color: 'white' };
    case 'medium':
      return { bgcolor: '#fb8c00', color: 'white' };
    case 'low':
      return { bgcolor: '#fdd835', color: '#333' };
    default:
      return {};
  }
}

function assertionChipSx(assertion: Finding['assertion']) {
  switch (assertion) {
    case 'C':
      return { bgcolor: '#1976d2', color: 'white' };
    case 'E':
      return { bgcolor: '#2e7d32', color: 'white' };
    case 'A':
      return { bgcolor: '#7b1fa2', color: 'white' };
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
      return { bgcolor: '#2e7d32', color: 'white' };
    case 'needs_action':
      return { bgcolor: '#fb8c00', color: 'white' };
    case 'irrelevant':
      return { bgcolor: '#9e9e9e', color: 'white' };
    case 'pending':
      return { bgcolor: '#bdbdbd', color: '#333' };
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
      sx={{
        borderColor: '#e0e0e0',
        bgcolor: isIrrelevant ? '#fafafa' : 'white',
        opacity: isIrrelevant ? 0.7 : 1,
      }}
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
                    color: '#333',
                    textDecoration: isIrrelevant ? 'line-through' : 'none',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={finding.title}
                >
                  {finding.title}
                </Typography>
                {isComplete ? <CheckCircle sx={{ color: '#2e7d32', fontSize: 18 }} /> : null}
              </Stack>

              <Typography variant="caption" sx={{ display: 'block', color: '#666', mt: 0.25 }}>
                {sectionPathLabel}
              </Typography>
            </Box>

            <IconButton size="small" onClick={() => onToggleExpanded(finding.id)} aria-label={expanded ? 'Collapse' : 'Expand'}>
              {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }} useFlexGap>
            <Chip size="small" label={finding.severity.toUpperCase()} sx={{ height: 20, fontSize: 12, ...severityChipSx(finding.severity) }} />
            <Chip size="small" label={`Assertion ${finding.assertion}`} sx={{ height: 20, fontSize: 12, ...assertionChipSx(finding.assertion) }} />
            <Chip size="small" label={statusLabel(finding.status)} sx={{ height: 20, fontSize: 12, ...statusChipSx(finding.status) }} />
            <Chip size="small" variant="outlined" label={finding.source} sx={{ height: 20, fontSize: 12 }} />
          </Stack>
        </Box>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <Box sx={{ p: 1.5 }}>
          <Typography variant="body2" sx={{ fontSize: 13, color: '#333', mb: 1 }}>
            {finding.description}
          </Typography>

          <Stack spacing={1}>
            {typeof finding.amount === 'number' ? (
              <Typography variant="body2" sx={{ fontSize: 13, color: '#666' }}>
                <b>Amount:</b> {finding.amount.toLocaleString()}
              </Typography>
            ) : null}
            {finding.context ? (
              <Typography variant="body2" sx={{ fontSize: 13, color: '#666' }}>
                <b>Context:</b> {finding.context}
              </Typography>
            ) : null}
            {finding.actionRequired ? (
              <Typography variant="body2" sx={{ fontSize: 13, color: '#666' }}>
                <b>Action required:</b> {finding.actionRequired}
              </Typography>
            ) : null}
            {finding.supportingData ? (
              <Box>
                <Typography variant="body2" sx={{ fontSize: 13, color: '#666', mb: 0.5 }}>
                  <b>Supporting data:</b>
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                  {Object.entries(finding.supportingData).map(([k, v]) => (
                    <li key={k}>
                      <Typography variant="body2" sx={{ fontSize: 13, color: '#666' }}>
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

      <Divider />

      <Box sx={{ px: 1.5, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
          <Button size="small" variant="outlined" onClick={() => onMarkIrrelevant(finding.id)} sx={{ textTransform: 'none' }}>
            {finding.status === 'irrelevant' ? 'Unmark Irrelevant' : 'Mark Irrelevant'}
          </Button>
          <Button size="small" variant="outlined" onClick={() => onMarkComplete(finding.id)} sx={{ textTransform: 'none' }}>
            {finding.status === 'complete' ? 'Undo Complete' : 'Mark Complete'}
          </Button>
          <Button size="small" variant="contained" onClick={() => onToggleNotes(finding.id)} sx={{ textTransform: 'none' }}>
            {notesOpen ? 'Hide Notes' : 'Add Notes'}
          </Button>
        </Stack>

        <Typography variant="caption" sx={{ color: '#666' }}>
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
            sx={{ bgcolor: 'white' }}
          />
        </Box>
      ) : null}
    </Card>
  );
}

