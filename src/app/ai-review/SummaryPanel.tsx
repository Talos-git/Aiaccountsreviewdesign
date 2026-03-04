import { Box, Chip, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

import type { FindingsSummary, ReviewMeta } from './types';

type SummaryPanelProps = {
  review: ReviewMeta;
  summaryAll: FindingsSummary;
  summaryFiltered: FindingsSummary;
};

function formatReviewStatus(status: ReviewMeta['status']): string {
  switch (status) {
    case 'in_review':
      return 'In review';
    case 'awaiting_bookkeeper_fixes':
      return 'Awaiting bookkeeper fixes';
    default:
      return status;
  }
}

export function SummaryPanel({ review, summaryAll, summaryFiltered }: SummaryPanelProps) {
  const createdLabel = new Date(review.createdDateIso).toLocaleString();

  const severityChips = [
    { label: `High: ${summaryAll.bySeverity.high}`, sx: { bgcolor: 'rgba(225, 29, 72, 0.14)', borderColor: 'rgba(225, 29, 72, 0.26)', color: '#BE123C' } },
    {
      label: `Medium: ${summaryAll.bySeverity.medium}`,
      sx: { bgcolor: 'rgba(249, 115, 22, 0.14)', borderColor: 'rgba(249, 115, 22, 0.26)', color: '#C2410C' },
    },
    { label: `Low: ${summaryAll.bySeverity.low}`, sx: { bgcolor: 'rgba(245, 158, 11, 0.16)', borderColor: 'rgba(245, 158, 11, 0.26)', color: '#92400E' } },
  ] as const;

  const assertionChips = [
    { label: `C: ${summaryAll.byAssertion.C}`, sx: { bgcolor: 'rgba(14, 165, 233, 0.14)', borderColor: 'rgba(14, 165, 233, 0.26)', color: '#075985' } },
    { label: `E: ${summaryAll.byAssertion.E}`, sx: { bgcolor: 'rgba(34, 197, 94, 0.14)', borderColor: 'rgba(34, 197, 94, 0.26)', color: '#166534' } },
    { label: `A: ${summaryAll.byAssertion.A}`, sx: { bgcolor: 'rgba(168, 85, 247, 0.12)', borderColor: 'rgba(168, 85, 247, 0.24)', color: '#6D28D9' } },
  ] as const;

  const statusChips = [
    { label: `Pending: ${summaryAll.byStatus.pending}`, sx: { bgcolor: 'rgba(15, 23, 42, 0.05)', borderColor: 'rgba(15, 23, 42, 0.12)', color: '#334155' } },
    { label: `Needs action: ${summaryAll.byStatus.needs_action}`, sx: { bgcolor: 'rgba(249, 115, 22, 0.14)', borderColor: 'rgba(249, 115, 22, 0.26)', color: '#9A3412' } },
    { label: `Complete: ${summaryAll.byStatus.complete}`, sx: { bgcolor: 'rgba(34, 197, 94, 0.14)', borderColor: 'rgba(34, 197, 94, 0.26)', color: '#166534' } },
    { label: `Irrelevant: ${summaryAll.byStatus.irrelevant}`, sx: { bgcolor: 'rgba(15, 23, 42, 0.06)', borderColor: 'rgba(15, 23, 42, 0.14)', color: '#475569' } },
  ] as const;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Box
        sx={(theme) => ({
          px: 2,
          py: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.25),
        })}
      >
        <Typography variant="overline" sx={{ letterSpacing: 1.2, fontWeight: 700, color: 'text.secondary' }}>
          AI Review
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.15, color: 'text.primary' }}>
          {review.companyName}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 13, color: 'text.secondary', mt: 0.5 }}>
          Period: {review.periodLabel}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }} useFlexGap>
          <Chip
            size="small"
            variant="outlined"
            label={formatReviewStatus(review.status)}
            sx={(theme) => ({
              fontSize: 12,
              bgcolor: alpha(theme.palette.primary.main, 0.10),
              borderColor: alpha(theme.palette.primary.main, 0.24),
              color: theme.palette.primary.dark,
            })}
          />
          <Chip
            size="small"
            variant="outlined"
            label={`Version ${review.version}`}
            sx={(theme) => ({
              fontSize: 12,
              bgcolor: alpha(theme.palette.text.primary, 0.03),
              borderColor: alpha(theme.palette.text.primary, 0.12),
              color: theme.palette.text.secondary,
            })}
          />
        </Stack>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', p: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Total findings
            </Typography>
            <Stack direction="row" spacing={1} alignItems="baseline">
              <Typography variant="h3" sx={{ fontWeight: 700, letterSpacing: -1, color: 'text.primary' }}>
                {summaryAll.total}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 13, color: 'text.secondary' }}>
                filtered {summaryFiltered.total}
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Created {createdLabel}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
              Severity
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
              {severityChips.map((c) => (
                <Chip key={c.label} size="small" variant="outlined" label={c.label} sx={{ fontSize: 12, ...c.sx }} />
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
              Assertion
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
              {assertionChips.map((c) => (
                <Chip key={c.label} size="small" variant="outlined" label={c.label} sx={{ fontSize: 12, ...c.sx }} />
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
              Status
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
              {statusChips.map((c) => (
                <Chip key={c.label} size="small" variant="outlined" label={c.label} sx={{ fontSize: 12, ...c.sx }} />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
