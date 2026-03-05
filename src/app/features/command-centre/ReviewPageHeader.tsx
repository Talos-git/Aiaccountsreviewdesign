import { format, parseISO } from 'date-fns';
import { Box, Button, Divider, LinearProgress, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { ReviewMeta } from './types';
import { accentColor, accentGradient, accentSecondary, displayFontFamily, monoFontFamily, roleColors, severityColors, shadowMd, uiFontFamily } from './tokens';

interface ReviewPageHeaderProps {
  meta: ReviewMeta;
  totalFindings: number;
  reviewedCount: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  isMobile: boolean;
  onOpenQueue: () => void;
  activeRole: 'accountant' | 'bookkeeper';
  onRoleChange: (role: 'accountant' | 'bookkeeper') => void;
}

interface StatTileProps {
  value: string;
  label: string;
  valueColor?: string;
}

const StatTile = ({ value, label, valueColor = '#0F172A' }: StatTileProps) => {
  const hasSeverityColor = valueColor !== '#0F172A';
  return (
    <Box
      sx={{
        border: '1px solid #E2E8F0',
        borderTop: hasSeverityColor ? `3px solid ${valueColor}` : '1px solid #E2E8F0',
        borderRadius: 2,
        px: 1.5,
        py: 1.25,
        minHeight: 74,
        bgcolor: '#FFFFFF',
        boxShadow: shadowMd,
      }}
    >
      <Typography
        sx={{
          fontFamily: uiFontFamily,
          fontSize: 26,
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
          fontFamily: monoFontFamily,
          fontSize: 11,
          fontWeight: 600,
          color: '#64748B',
          letterSpacing: '0.08em',
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
  criticalCount,
  warningCount,
  infoCount,
  isMobile,
  onOpenQueue,
  activeRole,
  onRoleChange,
}: ReviewPageHeaderProps) => {
  const progressPercent = totalFindings === 0 ? 0 : Math.round((reviewedCount / totalFindings) * 100);

  const periodLabel = `${format(parseISO(meta.periodStart), 'MMM yyyy')} – ${format(parseISO(meta.periodEnd), 'MMM yyyy')}`;

  return (
    <Box
      sx={{
        px: { xs: 1.5, md: 2.5 },
        pt: 1.5,
        pb: 1.25,
        borderBottom: '1px solid #E2E8F0',
        bgcolor: 'rgba(250,250,250,0.96)',
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
          {/* Section label badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              border: `1px solid ${accentColor}33`,
              bgcolor: `${accentColor}0D`,
              borderRadius: 999,
              px: 1.25,
              py: 0.35,
              mb: 0.75,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: accentGradient,
                flexShrink: 0,
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.6, transform: 'scale(0.8)' },
                },
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <Typography
              sx={{
                fontFamily: monoFontFamily,
                fontSize: 10,
                fontWeight: 600,
                color: accentColor,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              AI Review
            </Typography>
          </Box>

          <Typography
            sx={{
              fontFamily: displayFontFamily,
              fontSize: { xs: 20, md: 22 },
              fontWeight: 'normal',
              color: '#0F172A',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.2,
            }}
          >
            {meta.title}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            divider={<Divider orientation="vertical" flexItem sx={{ borderColor: '#CBD5E1', my: 0.25 }} />}
            sx={{ mt: 0.25, overflow: 'hidden' }}
          >
            {[meta.clientName, periodLabel, meta.versionLabel].filter(Boolean).map((v) => (
              <Typography
                key={v}
                sx={{
                  fontFamily: uiFontFamily,
                  fontSize: 13,
                  color: '#64748B',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flexShrink: 0,
                }}
              >
                {v}
              </Typography>
            ))}
          </Stack>
        </Box>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          {/* Role switcher */}
          <ToggleButtonGroup
            value={activeRole}
            exclusive
            onChange={(_, v) => { if (v) onRoleChange(v); }}
            size="small"
            sx={{
              bgcolor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 999,
              overflow: 'hidden',
              p: 0.25,
              '& .MuiToggleButtonGroup-grouped': {
                border: 0,
                borderRadius: '999px !important',
                mx: 0.25,
              },
            }}
          >
            {(['accountant', 'bookkeeper'] as const).map((role) => {
              const color = roleColors[role];
              return (
                <ToggleButton
                  key={role}
                  value={role}
                  sx={{
                    textTransform: 'none',
                    fontFamily: uiFontFamily,
                    fontWeight: 600,
                    fontSize: 12,
                    px: 1.5,
                    py: 0.5,
                    color: '#64748B',
                    transition: 'all 180ms ease',
                    '&.Mui-selected': {
                      color: '#FFFFFF',
                      bgcolor: color,
                      '&:hover': { bgcolor: color },
                    },
                    '&:hover': { bgcolor: `${color}12`, color: color },
                  }}
                >
                  {role === 'accountant' ? 'Accountant' : 'Bookkeeper'}
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>

          {isMobile ? (
            <Button
              size="small"
              onClick={onOpenQueue}
              startIcon={<MenuIcon sx={{ fontSize: 16 }} />}
              sx={{
                textTransform: 'none',
                fontFamily: uiFontFamily,
                fontSize: 12,
                fontWeight: 600,
                color: '#FFFFFF',
                background: accentGradient,
                borderRadius: 999,
                px: 1.75,
                '&:hover': {
                  boxShadow: '0 4px 14px rgba(0,82,255,0.25)',
                },
              }}
            >
              Queue
            </Button>
          ) : null}
          <Typography
            sx={{
              fontFamily: uiFontFamily,
              color: '#475569',
              fontSize: 13,
              fontWeight: 500,
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
        <StatTile value={String(criticalCount)} label="Critical" valueColor={severityColors.critical} />
        <StatTile value={String(warningCount)} label="Warning" valueColor={severityColors.warning} />
        <StatTile value={String(infoCount)} label="Info" valueColor={severityColors.info} />

        <Box
          sx={{
            border: '1px solid #E2E8F0',
            borderRadius: 2,
            px: 1.5,
            py: 1.25,
            bgcolor: '#FFFFFF',
            minHeight: 74,
            boxShadow: shadowMd,
          }}
        >
          <Typography
            sx={{
              fontFamily: monoFontFamily,
              fontSize: 11,
              fontWeight: 600,
              color: '#64748B',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              mb: 0.4,
            }}
          >
            Reviewed
          </Typography>
          <Typography
            sx={{
              fontFamily: uiFontFamily,
              fontSize: 18,
              fontWeight: 700,
              mb: 0.75,
            }}
          >
            <Box
              component="span"
              sx={{
                background: accentGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {reviewedCount}
            </Box>
            <Box component="span" sx={{ color: '#94A3B8', fontWeight: 500, fontSize: 16 }}>
              {' '}/ {totalFindings}
            </Box>
            <Box component="span" sx={{ color: '#64748B', fontWeight: 500, fontSize: 14 }}>
              {' '}({progressPercent}%)
            </Box>
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              height: 6,
              borderRadius: 999,
              bgcolor: '#E2E8F0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 999,
                background: `linear-gradient(to right, ${accentColor}, ${accentSecondary})`,
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
