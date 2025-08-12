'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

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

  // Calculate RPM percentage for visual bars
  const rpmPercentage = Math.min((telemetryData.rpm / 8000) * 100, 100);
  
  // Determine RPM color based on percentage
  const getRpmColor = (percentage: number): string => {
    if (percentage < 60) return '#00ff00'; // Green
    if (percentage < 80) return '#ffff00'; // Yellow
    if (percentage < 95) return '#ff8800'; // Orange
    return '#ff0000'; // Red
  };

  const rpmColor = getRpmColor(rpmPercentage);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        fontFamily: 'monospace'
      }}
    >
      {/* Live Telemetry Indicator - Top Left */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          left: -180,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            backgroundColor: '#00ff00',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }}
        />
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#00ff00', 
            fontSize: '10px', 
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}
        >
          TELEMETRY LIVE
        </Typography>
      </Box>

      {/* Speed Display - Smaller size */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(20,20,20,0.9))',
          border: '2px solid #ff4444',
          borderRadius: '8px',
          padding: '12px 16px',
          minWidth: 120,
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(255,68,68,0.3)'
        }}
      >
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#ff4444', 
            fontSize: '10px', 
            fontWeight: 'bold',
            letterSpacing: '2px'
          }}
        >
          SPEED
        </Typography>
        <Typography 
          sx={{ 
            color: '#ffffff', 
            fontSize: '26px', 
            fontWeight: 'bold',
            lineHeight: 1,
            fontFamily: 'monospace'
          }}
        >
          {Math.round(telemetryData.speed)}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#cccccc', 
            fontSize: '9px',
            letterSpacing: '1px'
          }}
        >
          MPH
        </Typography>
      </Box>

      {/* RPM Display with Visual Bar */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(20,20,20,0.9))',
          border: '2px solid #444444',
          borderRadius: '8px',
          padding: '12px 16px',
          minWidth: 140,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* RPM Background Bar */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: `${rpmPercentage}%`,
            background: `linear-gradient(0deg, ${rpmColor}22, transparent)`,
            transition: 'height 0.1s ease-out'
          }}
        />
        
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#888888', 
            fontSize: '10px', 
            fontWeight: 'bold',
            letterSpacing: '2px',
            position: 'relative',
            zIndex: 2
          }}
        >
          ENGINE RPM
        </Typography>
        <Typography 
          sx={{ 
            color: rpmColor, 
            fontSize: '20px', 
            fontWeight: 'bold',
            lineHeight: 1,
            fontFamily: 'monospace',
            position: 'relative',
            zIndex: 2
          }}
        >
          {Math.round(telemetryData.rpm).toLocaleString()}
        </Typography>
        
        {/* RPM Bar Indicator */}
        <Box
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            bottom: 8,
            width: 4,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 2
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: `${rpmPercentage}%`,
              background: rpmColor,
              borderRadius: 2,
              transition: 'height 0.1s ease-out'
            }}
          />
        </Box>
      </Box>

      {/* Gear Display */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(20,20,20,0.9))',
          border: '2px solid #00aa00',
          borderRadius: '8px',
          padding: '12px 16px',
          minWidth: 140,
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,170,0,0.2)'
        }}
      >
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#00aa00', 
            fontSize: '10px', 
            fontWeight: 'bold',
            letterSpacing: '2px'
          }}
        >
          GEAR
        </Typography>
        <Typography 
          sx={{ 
            color: '#ffffff', 
            fontSize: '28px', 
            fontWeight: 'bold',
            lineHeight: 1,
            fontFamily: 'monospace'
          }}
        >
          {telemetryData.gear === 0 ? 'N' : telemetryData.gear}
        </Typography>
      </Box>

      {/* Throttle and Brake - Taller with Better Contrast */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {/* Throttle */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(0,80,0,0.95), rgba(0,40,0,0.95))',
            border: '2px solid #00aa00',
            borderRadius: '6px',
            padding: '10px 14px',
            flex: 1,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 100
          }}
        >
          {/* Throttle Fill Bar - Enhanced contrast */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: `${telemetryData.throttle}%`,
              background: 'linear-gradient(0deg, rgba(0,255,0,0.9), rgba(0,255,0,0.6))',
              transition: 'height 0.1s ease-out',
              borderRadius: '0 0 4px 4px'
            }}
          />
          
          {/* Empty state background for contrast */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(0deg, rgba(0,40,0,0.3), rgba(0,20,0,0.1))',
              borderRadius: '4px'
            }}
          />
          
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#ffffff', 
              fontSize: '10px', 
              fontWeight: 'bold',
              letterSpacing: '1px',
              position: 'relative',
              zIndex: 2
            }}
          >
            THR
          </Typography>
          <Typography 
            sx={{ 
              color: '#ffffff', 
              fontSize: '18px', 
              fontWeight: 'bold',
              lineHeight: 1,
              fontFamily: 'monospace',
              position: 'relative',
              zIndex: 2,
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}
          >
            {Math.round(telemetryData.throttle)}%
          </Typography>
        </Box>

        {/* Brake */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(80,0,0,0.95), rgba(40,0,0,0.95))',
            border: '2px solid #aa0000',
            borderRadius: '6px',
            padding: '10px 14px',
            flex: 1,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 100
          }}
        >
          {/* Brake Fill Bar - Enhanced contrast */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: `${telemetryData.brake}%`,
              background: 'linear-gradient(0deg, rgba(255,0,0,0.9), rgba(255,0,0,0.6))',
              transition: 'height 0.1s ease-out',
              borderRadius: '0 0 4px 4px'
            }}
          />
          
          {/* Empty state background for contrast */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(0deg, rgba(40,0,0,0.3), rgba(20,0,0,0.1))',
              borderRadius: '4px'
            }}
          />
          
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#ffffff', 
              fontSize: '10px', 
              fontWeight: 'bold',
              letterSpacing: '1px',
              position: 'relative',
              zIndex: 2
            }}
          >
            BRK
          </Typography>
          <Typography 
            sx={{ 
              color: '#ffffff', 
              fontSize: '18px', 
              fontWeight: 'bold',
              lineHeight: 1,
              fontFamily: 'monospace',
              position: 'relative',
              zIndex: 2,
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}
          >
            {Math.round(telemetryData.brake)}%
          </Typography>
        </Box>
      </Box>



      {/* CSS Animation */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default TelemetryOverlay;