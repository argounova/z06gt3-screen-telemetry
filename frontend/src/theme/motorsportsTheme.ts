import { createTheme, ThemeOptions } from '@mui/material/styles';

// Motorsports-focused theme with racing aesthetics
export const motorsportsTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff4444', // Racing red
      light: '#ff6666',
      dark: '#cc3333',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#00ff00', // Racing green
      light: '#33ff33',
      dark: '#00cc00',
      contrastText: '#000000'
    },
    background: {
      default: '#0a0a0a', // Almost black
      paper: '#1a1a1a'    // Dark gray
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc'
    },
    error: {
      main: '#ff0000'
    },
    warning: {
      main: '#ffaa00'
    },
    info: {
      main: '#0088ff'
    },
    success: {
      main: '#00ff00'
    }
  },
  typography: {
    fontFamily: '"Roboto Mono", "Monaco", "Menlo", monospace',
    h1: {
      fontWeight: 700,
      letterSpacing: '0.02em'
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '0.02em'
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '0.02em',
      color: '#ff4444'
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '0.02em'
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '0.02em'
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '0.02em'
    },
    body1: {
      fontSize: '0.95rem',
      letterSpacing: '0.01em'
    },
    body2: {
      fontSize: '0.85rem',
      letterSpacing: '0.01em'
    },
    caption: {
      fontSize: '0.75rem',
      letterSpacing: '0.05em',
      textTransform: 'uppercase'
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, rgba(26,26,26,0.9), rgba(10,10,10,0.9))',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 600,
          '&:hover': {
            boxShadow: '0 4px 20px rgba(255,68,68,0.3)'
          }
        },
        contained: {
          background: 'linear-gradient(45deg, #ff4444, #ff6666)',
          '&:hover': {
            background: 'linear-gradient(45deg, #ff6666, #ff8888)'
          }
        },
        outlined: {
          borderColor: '#ff4444',
          color: '#ff4444',
          '&:hover': {
            borderColor: '#ff6666',
            backgroundColor: 'rgba(255,68,68,0.1)'
          }
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontFamily: 'monospace'
        },
        standardError: {
          backgroundColor: 'rgba(255,0,0,0.1)',
          border: '1px solid rgba(255,0,0,0.3)',
          color: '#ff6666'
        }
      }
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#ff4444'
        }
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          background: 'radial-gradient(ellipse at center, rgba(10,10,10,1) 0%, rgba(0,0,0,1) 100%)'
        }
      }
    }
  }
} as ThemeOptions);

// Export additional utility functions for motorsports styling
export const motorsportsColors = {
  racing: {
    red: '#ff4444',
    green: '#00ff00',
    yellow: '#ffff00',
    orange: '#ff8800',
    blue: '#0088ff',
    white: '#ffffff',
    black: '#000000'
  },
  telemetry: {
    speed: '#ff4444',
    rpm: '#ffaa00',
    gear: '#00ff00',
    throttle: '#00aa00',
    brake: '#ff0000',
    background: 'rgba(0,0,0,0.9)',
    border: 'rgba(255,255,255,0.2)'
  },
  status: {
    live: '#00ff00',
    warning: '#ffaa00',
    error: '#ff0000',
    inactive: '#666666'
  }
};

export const motorsportsAnimations = {
  pulse: {
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
      '0%': { opacity: 1 },
      '50%': { opacity: 0.3 },
      '100%': { opacity: 1 }
    }
  },
  glow: {
    boxShadow: '0 0 20px rgba(255,68,68,0.5)',
    transition: 'box-shadow 0.3s ease'
  },
  slideIn: {
    '@keyframes slideIn': {
      '0%': { transform: 'translateX(100%)', opacity: 0 },
      '100%': { transform: 'translateX(0)', opacity: 1 }
    }
  }
};