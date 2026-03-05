import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { ConversationMessage, Finding, FindingStatus } from './types';
import { accentColor, accentGradient, assertionColors, displayFontFamily, monoFontFamily, roleColors, severityColors, shadowAccentLg, sourceColors, statusColors, uiFontFamily } from './tokens';
import { ConversationThread } from './ConversationThread';

interface FindingPanelProps {
  finding: Finding;
  findingIndex: number;
  totalFindings: number;
  activeRole: 'accountant' | 'bookkeeper';
  onMarkStatus: (status: FindingStatus) => void;
  onAddMessage: (text: string) => void;
  onSendToBookkeeper: () => void;
  onBookkeeperReply: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const toTitleCase = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const FindingPanel = ({
  finding,
  findingIndex,
  totalFindings,
  activeRole,
  onMarkStatus,
  onAddMessage,
  onSendToBookkeeper,
  onBookkeeperReply,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
}: FindingPanelProps) => {
  const severityLabel = toTitleCase(finding.severity);
  const sourceLabel = finding.source === 'ai' ? 'AI' : 'Code';
  const isAiSource = finding.source === 'ai';

  const handleSendMessage = (text: string) => {
    onAddMessage(text);
  };

  const hasMessages = finding.messages.length > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minWidth: 0,
        borderRight: { xs: 'none', lg: '1px solid #E2E8F0' },
      }}
    >
      <Box sx={{ px: { xs: 1.5, md: 3 }, py: { xs: 2, md: 2.5 } }}>
        {/* Finding counter */}
        <Typography
          sx={{
            fontFamily: monoFontFamily,
            fontSize: 11,
            fontWeight: 600,
            color: accentColor,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            mb: 1.25,
          }}
        >
          Finding {findingIndex + 1} of {totalFindings}
        </Typography>

        {/* Chips */}
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 1.25 }}>
          <Chip
            label={severityLabel}
            size="small"
            sx={{
              bgcolor: `${severityColors[finding.severity]}18`,
              color: severityColors[finding.severity],
              fontFamily: uiFontFamily,
              fontWeight: 600,
              borderRadius: 999,
              border: `1px solid ${severityColors[finding.severity]}55`,
            }}
          />
          <Chip
            label={`${finding.assertion} — ${finding.assertionLabel}`}
            size="small"
            sx={{
              bgcolor: `${assertionColors[finding.assertion]}1A`,
              color: assertionColors[finding.assertion],
              fontFamily: uiFontFamily,
              fontWeight: 600,
              borderRadius: 999,
              border: `1px solid ${assertionColors[finding.assertion]}50`,
            }}
          />
          <Chip
            label={`Source: ${sourceLabel}`}
            size="small"
            sx={{
              bgcolor: isAiSource ? `${accentColor}12` : `${sourceColors[finding.source]}1A`,
              color: isAiSource ? accentColor : sourceColors[finding.source],
              fontFamily: uiFontFamily,
              fontWeight: 600,
              borderRadius: 999,
              border: `1px solid ${isAiSource ? accentColor : sourceColors[finding.source]}50`,
            }}
          />
          <Chip
            label={`Status: ${finding.status.replace(/_/g, ' ')}`}
            size="small"
            sx={{
              bgcolor: `${statusColors[finding.status]}1A`,
              color: statusColors[finding.status],
              fontFamily: uiFontFamily,
              fontWeight: 600,
              borderRadius: 999,
              border: `1px solid ${statusColors[finding.status]}50`,
            }}
          />
        </Stack>

        {/* Path label */}
        <Typography sx={{ fontFamily: uiFontFamily, fontSize: 13, color: '#64748B', mb: 1.5 }}>
          {finding.pathLabel}
        </Typography>

        {/* Finding title with severity left border */}
        <Box
          sx={{
            borderLeft: `3px solid ${severityColors[finding.severity]}`,
            pl: 1.5,
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: displayFontFamily,
              fontSize: { xs: 22, md: 28 },
              fontWeight: 'normal',
              color: '#0F172A',
              lineHeight: 1.2,
            }}
          >
            {finding.title}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Data fields */}
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

        {/* Supporting refs */}
        <Box
          sx={{
            border: '1px solid #E2E8F0',
            borderLeft: `4px solid ${accentColor}`,
            borderRadius: 2,
            p: 1.5,
            bgcolor: '#FAFAFA',
            mb: 2.25,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <Typography
            sx={{
              fontFamily: monoFontFamily,
              fontSize: 11,
              fontWeight: 600,
              color: accentColor,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              mb: 0.75,
            }}
          >
            Supporting
          </Typography>
          <Typography sx={{ fontFamily: uiFontFamily, fontSize: 14, color: '#0F172A' }}>
            {finding.supportingRefs.join(', ')}
          </Typography>
          <Typography sx={{ fontFamily: uiFontFamily, fontSize: 12, color: '#64748B', mt: 0.5 }}>
            No additional receipts found in linked storage.
          </Typography>
        </Box>

        {/* Conversation thread */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Typography sx={{ fontFamily: uiFontFamily, fontSize: 14, fontWeight: 600, color: '#0F172A' }}>
            Thread
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              bgcolor: activeRole === 'accountant' ? `${roleColors.accountant}12` : `${roleColors.bookkeeper}12`,
              border: `1px solid ${activeRole === 'accountant' ? roleColors.accountant : roleColors.bookkeeper}30`,
              borderRadius: 999,
              px: 1,
              py: 0.2,
            }}
          >
            <Typography
              sx={{
                fontFamily: monoFontFamily,
                fontSize: 10,
                fontWeight: 700,
                color: activeRole === 'accountant' ? roleColors.accountant : roleColors.bookkeeper,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {activeRole === 'accountant' ? 'Accountant' : 'Bookkeeper'}
            </Typography>
          </Box>
        </Stack>

        <ConversationThread
          messages={finding.messages}
          activeRole={activeRole}
          onSendMessage={handleSendMessage}
        />

        {/* Action buttons */}
        {activeRole === 'accountant' ? (
          <>
            <Stack direction="row" spacing={1.25} sx={{ mt: 1.5, mb: 1.25 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => onMarkStatus('irrelevant')}
                sx={{
                  textTransform: 'none',
                  borderColor: '#CBD5E1',
                  color: '#475569',
                  fontFamily: uiFontFamily,
                  fontWeight: 600,
                  py: 1,
                  borderRadius: 2,
                  transition: 'all 180ms ease',
                  '&:hover': {
                    borderColor: `${accentColor}55`,
                    color: '#334155',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    bgcolor: 'transparent',
                  },
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
                  background: 'linear-gradient(135deg, #16A34A, #22C55E)',
                  color: '#FFFFFF',
                  fontFamily: uiFontFamily,
                  fontWeight: 600,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #15803D, #16A34A)',
                    boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
                  },
                }}
              >
                Complete
              </Button>
            </Stack>

            <Button
              fullWidth
              variant="contained"
              disabled={!hasMessages}
              onClick={onSendToBookkeeper}
              sx={{
                textTransform: 'none',
                fontFamily: uiFontFamily,
                fontWeight: 600,
                borderRadius: 2,
                py: 1,
                background: accentGradient,
                boxShadow: 'none',
                transition: 'all 180ms ease',
                '&:hover': {
                  background: accentGradient,
                  boxShadow: shadowAccentLg,
                },
                '&.Mui-disabled': {
                  bgcolor: '#E2E8F0',
                  background: 'none',
                  color: '#94A3B8',
                },
              }}
            >
              Send to Bookkeeper
            </Button>
          </>
        ) : (
          <Button
            fullWidth
            variant="contained"
            onClick={onBookkeeperReply}
            sx={{
              mt: 1.5,
              textTransform: 'none',
              fontFamily: uiFontFamily,
              fontWeight: 600,
              borderRadius: 2,
              py: 1,
              background: `linear-gradient(135deg, #7C3AED, #9F5FF1)`,
              boxShadow: 'none',
              transition: 'all 180ms ease',
              '&:hover': {
                background: `linear-gradient(135deg, #6D28D9, #7C3AED)`,
                boxShadow: '0 8px 24px rgba(124,58,237,0.35)',
              },
            }}
          >
            Send to Accountant
          </Button>
        )}
      </Box>

      <Divider />

      {/* Navigation footer — inverted dark */}
      <Box sx={{ px: { xs: 1.5, md: 3 }, py: 1.5, bgcolor: '#0F172A' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Button
            size="small"
            onClick={onPrev}
            disabled={!canGoPrev}
            startIcon={<ChevronLeft />}
            sx={{
              textTransform: 'none',
              fontFamily: uiFontFamily,
              fontWeight: 600,
              color: '#E2E8F0',
              '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.08)' },
              '&.Mui-disabled': { color: '#475569' },
            }}
          >
            Prev
          </Button>

          {/* Keyboard shortcuts badge */}
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {['J/K nav', 'I irrelevant', 'C complete'].map((shortcut) => (
              <Box
                key={shortcut}
                sx={{
                  fontFamily: monoFontFamily,
                  fontSize: 10,
                  fontWeight: 500,
                  color: '#64748B',
                  bgcolor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 1,
                  px: 0.75,
                  py: 0.25,
                  letterSpacing: '0.03em',
                }}
              >
                {shortcut}
              </Box>
            ))}
          </Box>

          <Button
            size="small"
            onClick={onNext}
            disabled={!canGoNext}
            endIcon={<ChevronRight />}
            sx={{
              textTransform: 'none',
              fontFamily: uiFontFamily,
              fontWeight: 600,
              color: '#E2E8F0',
              '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.08)' },
              '&.Mui-disabled': { color: '#475569' },
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
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <Typography
        sx={{
          fontFamily: monoFontFamily,
          fontSize: 10,
          fontWeight: 600,
          color: accentColor,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          mb: 0.35,
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontFamily: uiFontFamily, fontSize: 14, color: '#0F172A', fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  );
};
