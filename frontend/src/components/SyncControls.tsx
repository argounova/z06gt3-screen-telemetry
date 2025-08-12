'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Slider,
  Grid
} from '@mui/material';

interface TelemetryData {
  timestamp: number;
  speed: number;
  rpm: number;
  gear: number;
  throttle: number;
  brake: number;
}

interface SyncControlsProps {
  currentVideoTime: number;
  syncOffset: number;
  onSyncOffsetChange: (offset: number) => void;
  telemetryData: TelemetryData[];
}

const SyncControls: React.FC<SyncControlsProps> = ({
  currentVideoTime,
  syncOffset,
  onSyncOffsetChange,
  telemetryData
}) => {
  const [videoTimestamp, setVideoTimestamp] = useState<string>('');
  const [telemetryTimestamp, setTelemetryTimestamp] = useState<string>('');

  // Get telemetry time range for reference
  const minTelemetryTime = telemetryData.length > 0 ? 
    Math.min(...telemetryData.map(d => d.timestamp)) : 0;
  const maxTelemetryTime = telemetryData.length > 0 ? 
    Math.max(...telemetryData.map(d => d.timestamp)) : 0;

  // Calculate sync offset from manual timestamps
  const handleManualSync = () => {
    const videoTime = parseFloat(videoTimestamp);
    const telemetryTime = parseFloat(telemetryTimestamp);
    
    if (!isNaN(videoTime) && !isNaN(telemetryTime)) {
      // Offset = telemetry_time - video_time
      const newOffset = telemetryTime - videoTime;
      onSyncOffsetChange(newOffset);
    }
  };

  // Set current video time as reference point
  const useCurrentVideoTime = () => {
    setVideoTimestamp(currentVideoTime.toFixed(2));
  };

  // Quick offset adjustments
  const adjustOffset = (delta: number) => {
    onSyncOffsetChange(syncOffset + delta);
  };

  // Reset sync
  const resetSync = () => {
    onSyncOffsetChange(0);
    setVideoTimestamp('');
    setTelemetryTimestamp('');
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Manual Synchronization Controls
      </Typography>
      
      <Grid container spacing={3}>
        {/* Manual Sync Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Manual Sync Points
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Video Timestamp (seconds)"
              value={videoTimestamp}
              onChange={(e) => setVideoTimestamp(e.target.value)}
              type="number"
              size="small"
              fullWidth
              InputProps={{
                endAdornment: (
                  <Button 
                    size="small" 
                    onClick={useCurrentVideoTime}
                    sx={{ ml: 1 }}
                  >
                    Use Current
                  </Button>
                )
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              label="Telemetry Timestamp (seconds)"
              value={telemetryTimestamp}
              onChange={(e) => setTelemetryTimestamp(e.target.value)}
              type="number"
              size="small"
              fullWidth
              helperText={`Range: ${minTelemetryTime.toFixed(1)}s - ${maxTelemetryTime.toFixed(1)}s`}
            />
          </Box>

          <Button 
            variant="contained" 
            onClick={handleManualSync}
            disabled={!videoTimestamp || !telemetryTimestamp}
            fullWidth
          >
            Apply Sync
          </Button>
        </Grid>

        {/* Fine Tune Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Fine Tune Offset
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Current Offset: {syncOffset.toFixed(3)}s
            </Typography>
            
            <Slider
              value={syncOffset}
              onChange={(_, value) => onSyncOffsetChange(value as number)}
              min={-10}
              max={10}
              step={0.1}
              marks={[
                { value: -10, label: '-10s' },
                { value: 0, label: '0s' },
                { value: 10, label: '+10s' }
              ]}
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => adjustOffset(-1)}
            >
              -1.0s
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => adjustOffset(-0.1)}
            >
              -0.1s
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => adjustOffset(0.1)}
            >
              +0.1s
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => adjustOffset(1)}
            >
              +1.0s
            </Button>
          </Box>

          <Button 
            variant="outlined" 
            onClick={resetSync}
            fullWidth
          >
            Reset Sync
          </Button>
        </Grid>
      </Grid>

      {/* Status Display */}
      <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="caption" component="div">
          <strong>Sync Status:</strong> Video {currentVideoTime.toFixed(2)}s → 
          Telemetry {(currentVideoTime + syncOffset).toFixed(2)}s
        </Typography>
        <Typography variant="caption" component="div">
          <strong>Data Points:</strong> {telemetryData.length} telemetry samples loaded
        </Typography>
      </Box>
    </Paper>
  );
};

export default SyncControls;