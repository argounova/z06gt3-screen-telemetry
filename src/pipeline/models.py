"""
models.py - Data models and structures
"""

from dataclasses import dataclass
from pathlib import Path


@dataclass
class TelemetryMetadata:
    """Metadata for telemetry session"""
    format: str
    venue: str
    vehicle: str
    driver: str
    log_date: str
    log_time: str
    sample_rate: float  # Hz
    duration: float  # seconds
    lap_range: str
    
    @classmethod
    def from_csv(cls, filepath: Path) -> 'TelemetryMetadata':
        """Parse metadata from MoTeC CSV header file"""
        metadata_dict = {}
        
        with open(filepath, 'r') as f:
            for line in f:
                if line.strip():
                    # Parse the CSV format: "key","value"
                    parts = line.strip().strip('"').split('","')
                    if len(parts) == 2:
                        key = parts[0].strip('"')
                        value = parts[1].strip('",')
                        metadata_dict[key] = value
        
        # Extract numeric values from strings
        sample_rate_str = metadata_dict.get('Sample Rate', '50.000Hz')
        sample_rate = float(sample_rate_str.replace('Hz', ''))
        
        duration_str = metadata_dict.get('Duration', '0s')
        duration = float(duration_str.replace('s', ''))
        
        return cls(
            format=metadata_dict.get('Format', ''),
            venue=metadata_dict.get('Venue', ''),
            vehicle=metadata_dict.get('Vehicle', ''),
            driver=metadata_dict.get('Driver', ''),
            log_date=metadata_dict.get('Log Date', ''),
            log_time=metadata_dict.get('Log Time', ''),
            sample_rate=sample_rate,
            duration=duration,
            lap_range=metadata_dict.get('Range', '')
        )