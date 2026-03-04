import { RefObject } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Finding, FindingStatus } from './types';
import { assertionColors, baseFontFamily, severityColors, sourceColors, statusColors } from './tokens';

interface FindingPanelProps {
  finding: Finding;
  findingIndex: number;
  totalFindings: number;
  notesInputRef: RefObject<HTMLTextAreaElement | null>;
  onMarkStatus: (status: FindingStatus) => void;
  onNotesChange: (value: string) => void;
  onNotesBlur: () => void;
  onSendToBookkeeper: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  lastSavedLabel: string;
}

const toTitleCase = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const FindingPanel = ({
  finding,
  findingIndex,
  totalFindings,
  notesInputRef,
  onMarkStatus,
  onNotesChange,
  onNotesBlur,
  onSendToBookkeeper,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  lastSavedLabel,
}: FindingPanelProps) => {
  const severityLabel = toTitleCase(finding.severity);
  const sourceLabel = finding.source === 'ai' ? 'AI' : 'Code';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        flex: 1,
        minWidth: 0,
        borderRight: { xs: 'none', lg: '1px solid #D8E2F1' },
      }}
    >
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: { xs: 1.5, md: 3 }, py: { xs: 2, md: 2.5 } }}>
        <Typography
          sx={{
            fontFamily: baseFontFamily,
            fontSize: 13,
            fontWeight: 600,
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            mb: 1.25,
          }}
        >
          Finding {findingIndex + 1} of {totalFindings}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 1.25 }}>
          <Chip
            label={`${severityLabel}`}
            size="small"
            sx={{
              bgcolor: `${severityColors[finding.severity]}20`,
              color: severityColors[finding.severity],
              fontFamily: baseFontFamily,
              fontWeight: 700,
              borderRadius: 1,
              border: `1px solid ${severityColors[finding.severity]}55`,
            }}
          />
          <Chip
            label={`${finding.assertion} - ${finding.assertionLabel}`}
            size="small"
            sx={{
              bgcolor: `${assertionColors[finding.assertion]}1A`,
              color: assertionColors[finding.assertion],
              fontFamily: baseFontFamily,
              fontWeight: 700,
              borderRadius: 1,
              border: `1px solid ${assertionColors[finding.assertion]}50`,
            }}
          />
          <Chip
            label={`Source: ${sourceLabel}`}
            size="small"
            sx={{
              bgcolor: `${sourceColors[finding.source]}1A`,
              color: sourceColors[finding.source],
              fontFamily: baseFontFamily,
              fontWeight: 700,
              borderRadius: 1,
              border: `1px solid ${sourceColors[finding.source]}50`,
            }}
          />
          <Chip
            label={`Status: ${finding.status.replace('_', ' ')}`}
            size="small"
            sx={{
              bgcolor: `${statusColors[finding.status]}1A`,
              color: statusColors[finding.status],
              fontFamily: baseFontFamily,
              fontWeight: 700,
              borderRadius: 1,
              border: `1px solid ${statusColors[finding.status]}50`,
            }}
          />
        </Stack>

        <Typography sx={{ fontFamily: baseFontFamily, fontSize: 13, color: '#475569', mb: 1.5 }}>
          {finding.pathLabel}
        </Typography>

        <Typography
          sx={{
            fontFamily: baseFontFamily,
            fontSize: { xs: 20, md: 24 },
            fontWeight: 700,
            color: '#0F172A',
            lineHeight: 1.2,
          }}
        >
          {finding.title}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
            gap: 1,
            mb: 2,
          }}
        >
          <DataField label="Amount" value={finding.amountLabel} />
          <DataField label="Account" value={finding.accountLabel} />
          <DataField label="Period" value={finding.periodLabel} />
          <DataField label="Fix" value={finding.fixLabel} />
        </Box>

        <Box
          sx={{
            border: '1px solid #DCE5F2',
            borderRadius: 2,
            p: 1.5,
            bgcolor: '#F8FAFD',
            mb: 2.25,
          }}
        >
          <Typography
            sx={{
              fontFamily: baseFontFamily,
              fontSize: 12,
              fontWeight: 700,
              color: '#334155',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 0.75,
            }}
          >
            Supporting
          </Typography>
          <Typography sx={{ fontFamily: baseFontFamily, fontSize: 14, color: '#0F172A' }}>
            {finding.supportingRefs.join(', ')}
          </Typography>
          <Typography sx={{ fontFamily: baseFontFamily, fontSize: 12, color: '#64748B', mt: 0.5 }}>
            No additional receipts found in linked storage.
          </Typography>
        </Box>

        <Typography sx={{ fontFamily: baseFontFamily, fontSize: 14, fontWeight: 700, color: '#0F172A', mb: 0.75 }}>
          Notes
        </Typography>
        <TextField
          inputRef={notesInputRef}
          multiline
          minRows={5}
          fullWidth
          placeholder="Add accountant context before sending to bookkeeper"
          value={finding.notes}
          onChange={(event) => onNotesChange(event.target.value)}
          onBlur={onNotesBlur}
          sx={{
            mb: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              fontFamily: baseFontFamily,
              bgcolor: '#FFFFFF',
              '& textarea': {
                fontFamily: baseFontFamily,
                fontSize: 14,
              },
            },
          }}
        />

        <Typography sx={{ fontFamily: baseFontFamily, fontSize: 12, color: '#64748B', mb: 2 }}>
          {lastSavedLabel}
        </Typography>

        <Stack direction="row" spacing={1.25} sx={{ mb: 1.25 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => onMarkStatus('irrelevant')}
            sx={{
              textTransform: 'none',
              borderColor: '#CBD5E1',
              color: '#334155',
              fontFamily: baseFontFamily,
              fontWeight: 700,
              py: 1,
              borderRadius: 2,
            }}
          >
            Irrelevant
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => onMarkStatus('complete')}
            sx={{
              textTransform: 'none',
              bgcolor: '#16A34A',
              color: '#FFFFFF',
              fontFamily: baseFontFamily,
              fontWeight: 700,
              py: 1,
              borderRadius: 2,
              '&:hover': {
                bgcolor: '#15803D',
              },
            }}
          >
            Complete
          </Button>
        </Stack>

        <Button
          fullWidth
          variant="contained"
          disabled={finding.notes.trim().length === 0}
          onClick={onSendToBookkeeper}
          sx={{
            textTransform: 'none',
            fontFamily: baseFontFamily,
            fontWeight: 700,
            borderRadius: 2,
            py: 1,
            bgcolor: '#2563EB',
            '&:hover': {
              bgcolor: '#1D4ED8',
            },
            '&.Mui-disabled': {
              bgcolor: '#CBD5E1',
              color: '#64748B',
            },
          }}
        >
          Send to Bookkeeper
        </Button>
      </Box>

      <Divider />

      <Box sx={{ px: { xs: 1.5, md: 3 }, py: 1.5, bgcolor: '#F8FAFD' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Button
            size="small"
            onClick={onPrev}
            disabled={!canGoPrev}
            startIcon={<ChevronLeft />}
            sx={{
              textTransform: 'none',
              fontFamily: baseFontFamily,
              fontWeight: 700,
            }}
          >
            Prev
          </Button>
          <Typography sx={{ fontFamily: baseFontFamily, fontSize: 12, color: '#64748B', fontWeight: 600 }}>
            J/K navigate, I mark irrelevant, C complete, N note
          </Typography>
          <Button
            size="small"
            onClick={onNext}
            disabled={!canGoNext}
            endIcon={<ChevronRight />}
            sx={{
              textTransform: 'none',
              fontFamily: baseFontFamily,
              fontWeight: 700,
            }}
          >
            Next
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

interface DataFieldProps {
  label: string;
  value: string;
}

const DataField = ({ label, value }: DataFieldProps) => {
  return (
    <Box
      sx={{
        border: '1px solid #E2E8F0',
        borderRadius: 2,
        px: 1.25,
        py: 1,
        bgcolor: '#FFFFFF',
      }}
    >
      <Typography
        sx={{
          fontFamily: baseFontFamily,
          fontSize: 11,
          fontWeight: 700,
          color: '#64748B',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          mb: 0.35,
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontFamily: baseFontFamily, fontSize: 14, color: '#0F172A', fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  );
};
