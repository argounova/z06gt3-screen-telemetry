'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface TelemetryData {
  timestamp: number;
  speed: number;
  rpm: number;
  gear: number;
  throttle: number;
  brake: number;
}

interface TelemetryOverlayProps {
  telemetryData: TelemetryData | null;
  isVisible: boolean;
}

const TelemetryOverlay: React.FC<TelemetryOverlayProps> = ({
  telemetryData,
  isVisible
}) => {
  if (!isVisible || !telemetryData) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
        pointerEvents: 'none'
      }}
    >
      {/* Speed Display - Large and prominent */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          minWidth: 120,
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {Math.round(telemetryData.speed)}
        </Typography>
        <Typography variant="caption" component="div">
          MPH
        </Typography>
      </Paper>

      {/* RPM Display */}
      <Paper
        elevation={2}
        sx={{
          p: 1.5,
          mb: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          minWidth: 120,
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {Math.round(telemetryData.rpm)}
        </Typography>
        <Typography variant="caption" component="div">
          RPM
        </Typography>
      </Paper>

      {/* Gear Display */}
      <Paper
        elevation={2}
        sx={{
          p: 1.5,
          mb: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          minWidth: 120,
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {telemetryData.gear === 0 ? 'N' : telemetryData.gear}
        </Typography>
        <Typography variant="caption" component="div">
          GEAR
        </Typography>
      </Paper>

      {/* Throttle and Brake - Side by side */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Paper
          elevation={2}
          sx={{
            p: 1,
            backgroundColor: 'rgba(0, 128, 0, 0.8)',
            color: 'white',
            flex: 1,
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>
            {Math.round(telemetryData.throttle)}%
          </Typography>
          <Typography variant="caption" component="div">
            THR
          </Typography>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            p: 1,
            backgroundColor: 'rgba(192, 0, 0, 0.8)',
            color: 'white',
            flex: 1,
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>
            {Math.round(telemetryData.brake)}%
          </Typography>
          <Typography variant="caption" component="div">
            BRK
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default TelemetryOverlay;