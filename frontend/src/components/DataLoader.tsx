'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Alert,
  LinearProgress
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

interface TelemetryData {
  timestamp: number;
  speed: number;
  rpm: number;
  gear: number;
  throttle: number;
  brake: number;
}

interface DataLoaderProps {
  onDataLoaded: (data: TelemetryData[]) => void;
  onError: (error: string) => void;
}

const DataLoader: React.FC<DataLoaderProps> = ({
  onDataLoaded,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  // Parse CSV data
  const parseCSV = (csvText: string): TelemetryData[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Map common header variations
    const getColumnIndex = (possibleNames: string[]): number => {
      for (const name of possibleNames) {
        const index = headers.findIndex(h => h.includes(name));
        if (index !== -1) return index;
      }
      return -1;
    };

    const timestampIndex = getColumnIndex(['timestamp', 'time', 't']);
    const speedIndex = getColumnIndex(['speed', 'velocity', 'mph', 'kph']);
    const rpmIndex = getColumnIndex(['rpm', 'engine_rpm', 'revs']);
    const gearIndex = getColumnIndex(['gear', 'transmission']);
    const throttleIndex = getColumnIndex(['throttle', 'tps', 'accel']);
    const brakeIndex = getColumnIndex(['brake', 'brakes', 'brake_pressure']);

    if (timestampIndex === -1) {
      throw new Error('Timestamp column not found. Expected headers: timestamp, time, or t');
    }

    const data: TelemetryData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length < headers.length) continue;

      const timestamp = parseFloat(values[timestampIndex]);
      if (isNaN(timestamp)) continue;

      data.push({
        timestamp,
        speed: speedIndex !== -1 ? parseFloat(values[speedIndex]) || 0 : 0,
        rpm: rpmIndex !== -1 ? parseFloat(values[rpmIndex]) || 0 : 0,
        gear: gearIndex !== -1 ? parseInt(values[gearIndex]) || 0 : 0,
        throttle: throttleIndex !== -1 ? parseFloat(values[throttleIndex]) || 0 : 0,
        brake: brakeIndex !== -1 ? parseFloat(values[brakeIndex]) || 0 : 0
      });
    }

    return data.sort((a, b) => a.timestamp - b.timestamp);
  };

  // Handle file selection
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);

    try {
      const text = await file.text();
      
      let data: TelemetryData[];
      
      if (file.name.toLowerCase().endsWith('.csv')) {
        data = parseCSV(text);
      } else if (file.name.toLowerCase().endsWith('.json')) {
        const jsonData = JSON.parse(text);
        data = Array.isArray(jsonData) ? jsonData : [jsonData];
      } else {
        throw new Error('Unsupported file format. Please use CSV or JSON.');
      }

      if (data.length === 0) {
        throw new Error('No valid telemetry data found in file.');
      }

      onDataLoaded(data);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      onError(`Failed to load telemetry data: ${errorMessage}`);
      setFileName('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Load Telemetry Data
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
          disabled={isLoading}
          fullWidth
        >
          {fileName ? `Selected: ${fileName}` : 'Choose CSV or JSON File'}
          <input
            type="file"
            accept=".csv,.json"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </Button>
      </Box>

      {isLoading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            Processing telemetry data...
          </Typography>
        </Box>
      )}

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Expected CSV Format:</strong><br />
          Headers should include: timestamp/time, speed, rpm, gear, throttle, brake<br />
          <strong>JSON Format:</strong> Array of objects with same properties
        </Typography>
      </Alert>
    </Paper>
  );
};

export default DataLoader;