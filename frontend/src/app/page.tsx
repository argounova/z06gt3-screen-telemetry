'use client';

import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Alert,
  ThemeProvider,
  createTheme,
  CssBaseline,
  CircularProgress,
  Paper,
  Chip
} from '@mui/material';
import VideoPlayerWithOverlay from '../components/VideoPlayerWithOverlay';
import { useTelemetryData } from '../components/TelemetryDataService';

// Motorsports theme
const motorsportsTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff4444',
      light: '#ff6666',
      dark: '#cc3333',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#00ff00',
      light: '#33ff33',
      dark: '#00cc00',
      contrastText: '#000000'
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a'
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
          fontWeight: 600
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
    }
  }
});

export default function TelemetryOverlayApp() {
  const { data: telemetryData, metadata, loading, error } = useTelemetryData();

  // Video from assets directory
  const videoSrc = '/assets/video/lap2.mp4';

  if (loading) {
    return (
      <ThemeProvider theme={motorsportsTheme}>
        <CssBaseline />
        <Box 
          sx={{ 
            minHeight: '100vh',
            background: 'radial-gradient(ellipse at center, rgba(26,26,26,1) 0%, rgba(0,0,0,1) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Container maxWidth="xl" sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
              <CircularProgress size={80} thickness={4} sx={{ mb: 3 }} />
              <Typography variant="h5" sx={{ color: '#ff4444', fontWeight: 'bold', mb: 1 }}>
                INITIALIZING TELEMETRY
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                Reading data/raw/teledata.csv and metadata
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, bgcolor: '#ff4444', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                <Box sx={{ width: 8, height: 8, bgcolor: '#ff4444', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }} />
                <Box sx={{ width: 8, height: 8, bgcolor: '#ff4444', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }} />
              </Box>
            </Box>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={motorsportsTheme}>
        <CssBaseline />
        <Box 
          sx={{ 
            minHeight: '100vh',
            background: 'radial-gradient(ellipse at center, rgba(26,26,26,1) 0%, rgba(0,0,0,1) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                ✗ TELEMETRY SYSTEM FAILURE
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 2 }}>
                {error}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }}>
                DIAGNOSTIC: Check browser console for details. Ensure data files exist in public/data/raw/
              </Typography>
            </Alert>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={motorsportsTheme}>
      <CssBaseline />
      <Box 
        sx={{ 
          minHeight: '100vh',
          background: 'radial-gradient(ellipse at center, rgba(26,26,26,1) 0%, rgba(0,0,0,1) 100%)'
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header Section - Reduced footprint */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #ff4444, #ff8888)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                letterSpacing: '0.1em'
              }}
            >
              TELEMETRY OVERLAY SYSTEM
            </Typography>
          </Box>

          {/* Session Telemetry Summary - Compact */}
          {metadata && (
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2, 
                mb: 3, 
                background: 'linear-gradient(135deg, rgba(26,26,26,0.9), rgba(10,10,10,0.9))',
                border: '1px solid rgba(255,68,68,0.3)',
                borderRadius: 2
              }}
            >              
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                    VENUE
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {metadata.venue}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                    VEHICLE
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {metadata.vehicle}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                    DRIVER
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {metadata.driver}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                    SESSION
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {metadata.lapRange}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                    DURATION
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {metadata.duration}s
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                    DATA POINTS
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {telemetryData.length.toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                    STATUS
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box 
                      sx={{ 
                        width: 6, 
                        height: 6, 
                        bgcolor: '#00ff00', 
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite'
                      }} 
                    />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#00ff00', fontSize: '0.85rem' }}>
                      LIVE
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Video Player with Enhanced Overlay */}
          <Paper 
            elevation={4}
            sx={{ 
              background: 'linear-gradient(135deg, rgba(26,26,26,0.9), rgba(10,10,10,0.9))',
              border: '2px solid rgba(255,68,68,0.3)',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(255,68,68,0.2)'
            }}
          >
            <VideoPlayerWithOverlay 
              videoSrc={videoSrc}
              telemetryData={telemetryData}
            />
          </Paper>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 3, opacity: 0.5 }}>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', letterSpacing: '0.1em', fontSize: '0.7rem' }}>
              MOTORSPORTS TELEMETRY ANALYSIS SYSTEM v2.0
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </ThemeProvider>
  );
}