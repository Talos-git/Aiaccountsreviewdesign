import { Box, Chip, Divider, Stack, Typography } from '@mui/material';

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'white' }}>
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="subtitle2" sx={{ fontSize: 13, fontWeight: 700 }}>
          Summary
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700 }}>
              Review
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 13, color: '#666' }}>
              {review.companyName}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 13, color: '#666' }}>
              Period: {review.periodLabel}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 13, color: '#666' }}>
              Version: {review.version}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 13, color: '#666' }}>
              Created: {createdLabel}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 13, color: '#666' }}>
              Status: <b>{formatReviewStatus(review.status)}</b>
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
              Totals
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
              <Chip label={`All: ${summaryAll.total}`} />
              <Chip label={`Filtered: ${summaryFiltered.total}`} variant="outlined" />
            </Stack>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
              Severity
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
              <Chip label={`High: ${summaryAll.bySeverity.high}`} sx={{ bgcolor: '#f44336', color: 'white' }} />
              <Chip label={`Medium: ${summaryAll.bySeverity.medium}`} sx={{ bgcolor: '#fb8c00', color: 'white' }} />
              <Chip label={`Low: ${summaryAll.bySeverity.low}`} sx={{ bgcolor: '#fdd835', color: '#333' }} />
            </Stack>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
              Assertion
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
              <Chip label={`C: ${summaryAll.byAssertion.C}`} sx={{ bgcolor: '#1976d2', color: 'white' }} />
              <Chip label={`E: ${summaryAll.byAssertion.E}`} sx={{ bgcolor: '#2e7d32', color: 'white' }} />
              <Chip label={`A: ${summaryAll.byAssertion.A}`} sx={{ bgcolor: '#7b1fa2', color: 'white' }} />
            </Stack>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
              Status
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
              <Chip label={`Pending: ${summaryAll.byStatus.pending}`} />
              <Chip label={`Needs action: ${summaryAll.byStatus.needs_action}`} sx={{ bgcolor: '#fb8c00', color: 'white' }} />
              <Chip label={`Complete: ${summaryAll.byStatus.complete}`} sx={{ bgcolor: '#2e7d32', color: 'white' }} />
              <Chip label={`Irrelevant: ${summaryAll.byStatus.irrelevant}`} sx={{ bgcolor: '#9e9e9e', color: 'white' }} />
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

