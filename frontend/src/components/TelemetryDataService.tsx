'use client';

import { useState, useEffect } from 'react';

interface TelemetryData {
  timestamp: number;
  speed: number;
  rpm: number;
  gear: number;
  throttle: number;
  brake: number;
  distance: number;
}

interface TelemetryMetadata {
  format: string;
  venue: string;
  vehicle: string;
  driver: string;
  logDate: string;
  logTime: string;
  sampleRate: number;
  duration: number;
  lapRange: string;
}

export const useTelemetryData = () => {
  const [data, setData] = useState<TelemetryData[]>([]);
  const [metadata, setMetadata] = useState<TelemetryMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadTelemetryData();
  }, []);

  const loadTelemetryData = async () => {
    try {
      setLoading(true);
      
      // Load metadata first
      const metadataResponse = await fetch('/data/raw/teledata_metadata.csv');
      if (!metadataResponse.ok) {
        throw new Error('Failed to load metadata file');
      }
      const metadataText = await metadataResponse.text();
      const parsedMetadata = parseMetadata(metadataText);
      setMetadata(parsedMetadata);

      // Load telemetry data
      const dataResponse = await fetch('/data/raw/teledata.csv');
      if (!dataResponse.ok) {
        throw new Error('Failed to load telemetry data file');
      }
      const dataText = await dataResponse.text();
      const parsedData = parseTelemetryData(dataText);
      setData(parsedData);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to load telemetry data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const parseMetadata = (csvText: string): TelemetryMetadata => {
    const lines = csvText.trim().split('\n');
    const metadataMap: Record<string, string> = {};

    lines.forEach(line => {
      // Parse CSV format: "key","value"
      const match = line.match(/^"([^"]+)","([^"]+)"$/);
      if (match) {
        metadataMap[match[1]] = match[2];
      }
    });

    // Extract numeric values
    const sampleRateStr = metadataMap['Sample Rate'] || '50.000Hz';
    const sampleRate = parseFloat(sampleRateStr.replace('Hz', ''));
    
    const durationStr = metadataMap['Duration'] || '0s';
    const duration = parseFloat(durationStr.replace('s', ''));

    return {
      format: metadataMap['Format'] || '',
      venue: metadataMap['Venue'] || '',
      vehicle: metadataMap['Vehicle'] || '',
      driver: metadataMap['Driver'] || '',
      logDate: metadataMap['Log Date'] || '',
      logTime: metadataMap['Log Time'] || '',
      sampleRate,
      duration,
      lapRange: metadataMap['Range'] || ''
    };
  };

  const parseTelemetryData = (csvText: string): TelemetryData[] => {
    const lines = csvText.trim().split('\n');
    
    // Find header line - it should contain column names
    let headerIndex = -1;
    let headers: string[] = [];
    
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i].trim();
      if (line.includes('Time') && line.includes('RPM')) {
        headerIndex = i;
        // Parse headers - they appear to be comma-separated without quotes
        headers = line.split(',').map(h => h.trim().replace(/"/g, ''));
        break;
      }
    }

    if (headerIndex === -1) {
      // If no header found, assume standard MoTeC format based on CSV structure
      headers = ['Time', 'Distance', 'Engine RPM', 'Throttle Pos', 'Brake Pos', 'Speed_MS', 'Gear'];
      headerIndex = 0; // Start from first line if no headers
    }

    // Find column indices
    const getColumnIndex = (possibleNames: string[]): number => {
      for (const name of possibleNames) {
        const index = headers.findIndex(h => 
          h.toLowerCase().includes(name.toLowerCase())
        );
        if (index !== -1) return index;
      }
      return -1;
    };

    const timeIndex = getColumnIndex(['time']);
    const distanceIndex = getColumnIndex(['distance']);
    const rpmIndex = getColumnIndex(['rpm', 'engine rpm']);
    const throttleIndex = getColumnIndex(['throttle', 'tps']);
    const brakeIndex = getColumnIndex(['brake']);
    const speedIndex = getColumnIndex(['speed', 'ms', 'velocity']);
    const gearIndex = getColumnIndex(['gear']);

    const telemetryData: TelemetryData[] = [];
    
    // Parse data lines (skip header + 1 line for units if present)
    const startLine = headerIndex === 0 ? 1 : headerIndex + 2;
    
    for (let i = startLine; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Parse CSV values - handle quoted values
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      
      if (values.length < headers.length) continue;

      const timestamp = timeIndex !== -1 ? parseFloat(values[timeIndex]) : 0;
      if (isNaN(timestamp)) continue;

      // Convert speed from m/s to MPH
      const speedMs = speedIndex !== -1 ? parseFloat(values[speedIndex]) || 0 : 0;
      const speedMph = speedMs * 2.237; // Convert m/s to MPH

      telemetryData.push({
        timestamp,
        distance: distanceIndex !== -1 ? parseFloat(values[distanceIndex]) || 0 : 0,
        speed: speedMph,
        rpm: rpmIndex !== -1 ? parseFloat(values[rpmIndex]) || 0 : 0,
        gear: gearIndex !== -1 ? parseInt(values[gearIndex]) || 0 : 0,
        throttle: throttleIndex !== -1 ? parseFloat(values[throttleIndex]) || 0 : 0,
        brake: brakeIndex !== -1 ? parseFloat(values[brakeIndex]) || 0 : 0
      });
    }

    // Sort by timestamp to ensure proper order
    return telemetryData.sort((a, b) => a.timestamp - b.timestamp);
  };

  return {
    data,
    metadata,
    loading,
    error,
    reload: loadTelemetryData
  };
};