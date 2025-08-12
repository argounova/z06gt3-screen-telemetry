'use client';

import React, { useState, useRef } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import SyncControls from './SyncControls';
import TelemetryOverlay from './TelemetryOverlay';

interface TelemetryData {
  timestamp: number;
  speed: number;
  rpm: number;
  gear: number;
  throttle: number;
  brake: number;
}

interface VideoPlayerProps {
  videoSrc: string;
  telemetryData: TelemetryData[];
}

const VideoPlayerWithOverlay: React.FC<VideoPlayerProps> = ({
  videoSrc,
  telemetryData
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoTime, setCurrentVideoTime] = useState<number>(0);
  const [syncOffset, setSyncOffset] = useState<number>(-1.090);
  const [showSyncControls, setShowSyncControls] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Calculate synchronized telemetry timestamp
  const getSyncedTelemetryTime = (videoTime: number): number => {
    return videoTime + syncOffset;
  };

  // Find current telemetry data based on synced time
  const getCurrentTelemetryData = (): TelemetryData | null => {
    const syncedTime = getSyncedTelemetryTime(currentVideoTime);
    
    // Find closest telemetry data point
    let closest = telemetryData[0];
    let minDiff = Math.abs(telemetryData[0]?.timestamp - syncedTime);

    for (const data of telemetryData) {
      const diff = Math.abs(data.timestamp - syncedTime);
      if (diff < minDiff) {
        minDiff = diff;
        closest = data;
      }
    }

    // Return null if difference is too large (more than 1 second)
    return minDiff <= 1.0 ? closest : null;
  };

  // Handle video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentVideoTime(videoRef.current.currentTime);
    }
  };

  // Handle play/pause
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle sync offset change
  const handleSyncOffsetChange = (offset: number) => {
    setSyncOffset(offset);
  };

  const currentTelemetry = getCurrentTelemetryData();

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Video Container */}
      <Paper elevation={3} sx={{ position: 'relative', backgroundColor: '#000' }}>
        <video
          ref={videoRef}
          width="100%"
          height="auto"
          controls
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          style={{ display: 'block' }}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Telemetry Overlay */}
        <TelemetryOverlay 
          telemetryData={currentTelemetry}
          isVisible={!!currentTelemetry}
        />
      </Paper>

      {/* Sync Controls - Show/Hide */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="outlined" 
          onClick={() => setShowSyncControls(!showSyncControls)}
          size="small"
        >
          {showSyncControls ? 'Hide' : 'Show'} Sync Controls
        </Button>
      </Box>

      {showSyncControls && (
        <Box sx={{ mt: 2 }}>
          <SyncControls
            currentVideoTime={currentVideoTime}
            syncOffset={syncOffset}
            onSyncOffsetChange={handleSyncOffsetChange}
            telemetryData={telemetryData}
          />
        </Box>
      )}

      {/* Debug Info */}
      <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="caption" component="div">
          Video Time: {currentVideoTime.toFixed(2)}s | 
          Sync Offset: {syncOffset.toFixed(2)}s | 
          Synced Time: {getSyncedTelemetryTime(currentVideoTime).toFixed(2)}s
        </Typography>
        {currentTelemetry && (
          <Typography variant="caption" component="div">
            Telemetry Timestamp: {currentTelemetry.timestamp.toFixed(2)}s
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default VideoPlayerWithOverlay;