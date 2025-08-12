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
  Paper
} from '@mui/material';
import VideoPlayerWithOverlay from '../components/VideoPlayerWithOverlay';
import { useTelemetryData } from '../components/TelemetryDataService';

// Create MUI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export default function TelemetryOverlayApp() {
  const { data: telemetryData, metadata, loading, error } = useTelemetryData();

  // Video from assets directory
  const videoSrc = '/assets/video/lap2.mp4';

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6">Loading telemetry data...</Typography>
            <Typography variant="body2" color="text.secondary">
              Reading data/raw/teledata.csv and metadata
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6">Failed to Load Data</Typography>
            <Typography variant="body2">{error}</Typography>
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              Make sure the data files are accessible at /data/raw/ in your public directory
            </Typography>
          </Alert>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Telemetry Video Overlay
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          {metadata && (
            <>
              {metadata.venue} - {metadata.vehicle} - {metadata.driver} ({metadata.lapRange})
            </>
          )}
        </Typography>

        {/* Session Info */}
        {metadata && (
          <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'grey.50' }}>
            <Typography variant="body2" component="div">
              <strong>Session:</strong> {metadata.logDate} at {metadata.logTime} | 
              <strong> Duration:</strong> {metadata.duration}s | 
              <strong> Sample Rate:</strong> {metadata.sampleRate}Hz |
              <strong> Data Points:</strong> {telemetryData.length}
            </Typography>
          </Paper>
        )}

        {/* Video Player with Overlay */}
        <VideoPlayerWithOverlay 
          videoSrc={videoSrc}
          telemetryData={telemetryData}
        />
      </Container>
    </ThemeProvider>
  );
}