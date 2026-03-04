import { format } from 'date-fns';
import { Box, Button, LinearProgress, Stack, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { ReviewMeta } from './types';
import { baseFontFamily, severityColors } from './tokens';

interface ReviewPageHeaderProps {
  meta: ReviewMeta;
  totalFindings: number;
  reviewedCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  isMobile: boolean;
  onOpenQueue: () => void;
}

interface StatTileProps {
  value: string;
  label: string;
  valueColor?: string;
}

const StatTile = ({ value, label, valueColor = '#0F172A' }: StatTileProps) => {
  return (
    <Box
      sx={{
        border: '1px solid #D9E3F2',
        borderRadius: 2,
        px: 1.5,
        py: 1.25,
        minHeight: 74,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(4px)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
      }}
    >
      <Typography
        sx={{
          fontFamily: baseFontFamily,
          fontSize: 24,
          lineHeight: 1,
          fontWeight: 700,
          color: valueColor,
          mb: 0.8,
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontFamily: baseFontFamily,
          fontSize: 12,
          fontWeight: 600,
          color: '#334155',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export const ReviewPageHeader = ({
  meta,
  totalFindings,
  reviewedCount,
  highCount,
  mediumCount,
  lowCount,
  isMobile,
  onOpenQueue,
}: ReviewPageHeaderProps) => {
  const progressPercent = totalFindings === 0 ? 0 : Math.round((reviewedCount / totalFindings) * 100);

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 4,
        px: { xs: 1.5, md: 2.5 },
        pt: 1.5,
        pb: 1.25,
        borderBottom: '1px solid #D6E0EF',
        bgcolor: 'rgba(244, 248, 255, 0.94)',
        backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0.7), rgba(235,243,255,0.85))',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1.5}
        sx={{ mb: 1.5 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: baseFontFamily,
              fontSize: { xs: 16, md: 18 },
              fontWeight: 700,
              color: '#0F172A',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {meta.title}
          </Typography>
          <Typography
            sx={{
              fontFamily: baseFontFamily,
              fontSize: 13,
              color: '#475569',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {meta.clientName} | {meta.periodLabel} | {meta.versionLabel}
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          {isMobile ? (
            <Button
              size="small"
              variant="outlined"
              onClick={onOpenQueue}
              startIcon={<MenuIcon sx={{ fontSize: 16 }} />}
              sx={{
                textTransform: 'none',
                fontFamily: baseFontFamily,
                borderColor: '#C9D6EA',
                color: '#0F172A',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Queue
            </Button>
          ) : null}
          <Typography
            sx={{
              fontFamily: baseFontFamily,
              color: '#334155',
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {format(new Date(), 'EEE d MMM yyyy')}
          </Typography>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(5, minmax(0, 1fr))',
          },
          gap: 1,
        }}
      >
        <StatTile value={String(totalFindings)} label="Findings" />
        <StatTile value={String(highCount)} label="High" valueColor={severityColors.high} />
        <StatTile value={String(mediumCount)} label="Medium" valueColor={severityColors.medium} />
        <StatTile value={String(lowCount)} label="Low" valueColor={severityColors.low} />

        <Box
          sx={{
            border: '1px solid #D9E3F2',
            borderRadius: 2,
            px: 1.5,
            py: 1.25,
            bgcolor: 'rgba(255,255,255,0.86)',
            minHeight: 74,
          }}
        >
          <Typography
            sx={{
              fontFamily: baseFontFamily,
              fontSize: 12,
              fontWeight: 600,
              color: '#334155',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Reviewed
          </Typography>
          <Typography
            sx={{
              fontFamily: baseFontFamily,
              fontSize: 20,
              fontWeight: 700,
              color: '#0F172A',
              mb: 0.75,
            }}
          >
            {reviewedCount} / {totalFindings} ({progressPercent}%)
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              height: 8,
              borderRadius: 999,
              bgcolor: '#DFE8F8',
              '& .MuiLinearProgress-bar': {
                borderRadius: 999,
                bgcolor: '#2563EB',
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
