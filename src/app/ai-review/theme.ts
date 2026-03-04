import { alpha, createTheme } from '@mui/material/styles';

export const aiReviewTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0F766E',
      dark: '#0B5D59',
      light: '#14B8A6',
    },
    secondary: {
      main: '#334155',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    background: {
      default: '#F6F7FB',
      paper: '#FFFFFF',
    },
    divider: 'rgba(15, 23, 42, 0.10)',
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily:
      '"Space Grotesk", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 999,
          fontWeight: 600,
          letterSpacing: 0,
          borderColor: alpha(theme.palette.text.primary, 0.12),
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 999,
          fontWeight: 600,
          borderColor: alpha(theme.palette.text.primary, 0.12),
        }),
        sizeSmall: {
          height: 22,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 18,
          borderColor: alpha(theme.palette.text.primary, 0.10),
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
        },
      },
    },
  },
});

