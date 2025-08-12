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
      console.log('Starting to load telemetry data...');
      
      // Load metadata first
      console.log('Loading metadata from /data/raw/teledata_metadata.csv');
      const metadataResponse = await fetch('/data/raw/teledata_metadata.csv');
      if (!metadataResponse.ok) {
        throw new Error(`Failed to load metadata file: ${metadataResponse.status} ${metadataResponse.statusText}`);
      }
      const metadataText = await metadataResponse.text();
      console.log('Metadata raw text:', metadataText.substring(0, 200));
      
      const parsedMetadata = parseMetadata(metadataText);
      console.log('Parsed metadata:', parsedMetadata);
      setMetadata(parsedMetadata);

      // Load telemetry data
      console.log('Loading telemetry data from /data/raw/teledata.csv');
      const dataResponse = await fetch('/data/raw/teledata.csv');
      if (!dataResponse.ok) {
        throw new Error(`Failed to load telemetry data file: ${dataResponse.status} ${dataResponse.statusText}`);
      }
      const dataText = await dataResponse.text();
      console.log('Data file loaded, length:', dataText.length);
      
      const parsedData = parseTelemetryData(dataText);
      console.log('Parsed data points:', parsedData.length);
      setData(parsedData);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error loading telemetry data:', errorMessage);
      setError(`Failed to load telemetry data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const parseMetadata = (csvText: string): TelemetryMetadata => {
    console.log('Parsing metadata...');
    const lines = csvText.trim().split('\n');
    const metadataMap: Record<string, string> = {};

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      console.log(`Line ${index}: ${trimmedLine}`);
      
      // Handle the CSV format with trailing comma: "key","value",
      // Remove trailing comma first, then parse
      const cleanLine = trimmedLine.replace(/,$/, '');
      
      // Parse CSV format: "key","value"
      const match = cleanLine.match(/^"([^"]+)","([^"]*)"$/);
      if (match) {
        metadataMap[match[1]] = match[2];
        console.log(`Parsed: ${match[1]} = ${match[2]}`);
      } else {
        console.warn(`Failed to parse metadata line: ${cleanLine}`);
      }
    });

    console.log('Final metadata map:', metadataMap);

    // Extract numeric values
    const sampleRateStr = metadataMap['Sample Rate'] || '50.000Hz';
    const sampleRate = parseFloat(sampleRateStr.replace('Hz', ''));
    
    const durationStr = metadataMap['Duration'] || '0s';
    const duration = parseFloat(durationStr.replace('s', ''));

    const result = {
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
    
    console.log('Final parsed metadata:', result);
    return result;
  };

  const parseTelemetryData = (csvText: string): TelemetryData[] => {
    console.log('Parsing telemetry data...');
    const lines = csvText.trim().split('\n');
    console.log(`Found ${lines.length} lines`);
    
    // Find header line - it should contain column names
    let headerIndex = -1;
    let headers: string[] = [];
    
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i].trim();
      if (line.includes('Time') && line.includes('RPM')) {
        headerIndex = i;
        // Parse headers - they appear to be comma-separated without quotes
        headers = line.split(',').map(h => h.trim().replace(/"/g, ''));
        console.log(`Found headers at line ${i}:`, headers);
        break;
      }
    }

    if (headerIndex === -1) {
      // If no header found, assume standard MoTeC format based on CSV structure
      // From the sample data, it looks like: Time, Distance, Engine RPM, Throttle Pos, Brake Pos, Speed(m/s), Gear
      headers = ['Time', 'Distance', 'Engine RPM', 'Throttle Pos', 'Brake Pos', 'Speed', 'Gear'];
      headerIndex = 0; // Start from first line if no headers
      console.log('No headers found, using default:', headers);
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
    const speedIndex = getColumnIndex(['speed']);
    const gearIndex = getColumnIndex(['gear']);

    console.log('Column indices:', {
      time: timeIndex,
      distance: distanceIndex,
      rpm: rpmIndex,
      throttle: throttleIndex,
      brake: brakeIndex,
      speed: speedIndex,
      gear: gearIndex
    });

    const telemetryData: TelemetryData[] = [];
    
    // Parse data lines - start from line 1 (skip first line which may be headers or units)
    const startLine = Math.max(1, headerIndex + 1);
    console.log(`Starting to parse data from line ${startLine}`);
    
    for (let i = startLine; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Parse CSV values - handle quoted values and remove quotes
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      
      if (values.length < 6) continue; // Minimum expected columns

      const timestamp = timeIndex !== -1 ? parseFloat(values[timeIndex]) : 0;
      if (isNaN(timestamp)) continue;

      // Convert speed from m/s to MPH (multiply by 2.237)
      const speedMs = speedIndex !== -1 ? parseFloat(values[speedIndex]) || 0 : 0;
      const speedMph = speedMs * 2.237;

      telemetryData.push({
        timestamp,
        distance: distanceIndex !== -1 ? parseFloat(values[distanceIndex]) || 0 : 0,
        speed: speedMph,
        rpm: rpmIndex !== -1 ? parseFloat(values[rpmIndex]) || 0 : 0,
        gear: gearIndex !== -1 ? parseInt(values[gearIndex]) || 0 : 0,
        throttle: throttleIndex !== -1 ? parseFloat(values[throttleIndex]) || 0 : 0,
        brake: brakeIndex !== -1 ? parseFloat(values[brakeIndex]) || 0 : 0
      });
      
      // Log first few data points for debugging
      if (i < startLine + 3) {
        console.log(`Data point ${i - startLine + 1}:`, {
          timestamp,
          speed: speedMph,
          rpm: rpmIndex !== -1 ? parseFloat(values[rpmIndex]) : 0,
          gear: gearIndex !== -1 ? parseInt(values[gearIndex]) : 0
        });
      }
    }

    console.log(`Parsed ${telemetryData.length} data points`);
    
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