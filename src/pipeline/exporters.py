"""
exporters.py - Data export functions for different formats
"""

import pandas as pd
import json
from pathlib import Path
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)


def export_to_csv(data: pd.DataFrame, filepath: Path) -> Path:
    """Export dataframe to CSV"""
    data.to_csv(filepath, index=False)
    logger.info(f"✓ Exported CSV: {filepath}")
    return filepath


def export_to_json(data: pd.DataFrame, metadata: Dict[str, Any], filepath: Path) -> Path:
    """
    Export telemetry data to JSON format optimized for web overlay
    
    Args:
        data: Processed telemetry dataframe
        metadata: Dictionary containing metadata and stats
        filepath: Output file path
    """
    
    # Sample data to reduce file size (every 5th row = 10Hz from 50Hz)
    sample_rate = 5
    sampled_data = data.iloc[::sample_rate].copy()
    
    # Build JSON structure
    json_output = {
        'metadata': metadata.get('metadata', {}),
        'stats': metadata.get('stats', {}),
        'telemetry': []
    }
    
    # Convert telemetry data to list of dicts
    for _, row in sampled_data.iterrows():
        frame = {
            'time': round(row['Time'], 3),
            'distance': round(row['Distance'], 1),
            'speed_kph': round(row.get('Speed_KPH', 0), 1),
            'rpm': round(row['Engine RPM'], 0),
            'throttle': round(row['Throttle Pos'], 1),
            'brake': round(row['Brake Pos'], 1),
            'gear': int(row['Gear'])
        }
        json_output['telemetry'].append(frame)
    
    # Write JSON file
    with open(filepath, 'w') as f:
        json.dump(json_output, f, indent=2)
    
    logger.info(f"✓ Exported JSON: {filepath} ({len(json_output['telemetry'])} samples)")
    return filepath


def export_to_parquet(data: pd.DataFrame, filepath: Path) -> Path:
    """
    Export to Parquet format for efficient storage and faster loading
    (Optional - requires pyarrow or fastparquet)
    """
    try:
        data.to_parquet(filepath, index=False, compression='snappy')
        logger.info(f"✓ Exported Parquet: {filepath}")
        return filepath
    except ImportError:
        logger.warning("Parquet export skipped - install pyarrow or fastparquet")
        return None