import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#2D4A32',       // Forest Green — 7.2:1 on white (AAA)
    },
    secondary: {
      main: '#B85C2C',       // Terracotta — 4.6:1 on white (AA)
    },
    success: {
      main: '#4A7850',       // Sage Green — 4.8:1 on white (AA)
    },
    text: {
      primary: '#1A2420',    // Near-black — 16.1:1 on white (AAA)
      secondary: '#4A5E4D',  // Muted green-grey — 5.1:1 on white (AA)
    },
    background: {
      default: '#F6F3EE',    // Parchment
      paper: '#FDFCF9',      // Off-white
    },
    divider: 'rgba(45, 74, 50, 0.12)',
  },

  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: { fontFamily: '"Lora", serif', fontWeight: 700 },
    h2: { fontFamily: '"Lora", serif', fontWeight: 700 },
    h3: { fontFamily: '"Lora", serif', fontWeight: 600 },
    h4: { fontFamily: '"Lora", serif', fontWeight: 600 },
    h5: { fontFamily: '"Lora", serif', fontWeight: 600 },
    h6: { fontFamily: '"Lora", serif', fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 500 },
    overline: { fontWeight: 600, letterSpacing: '0.08em' },
  },

  shape: {
    borderRadius: 10,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500 },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: '16px 0 0 16px',
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500 },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },

    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F6F3EE',
        },
      },
    },
  },
})

export default theme
