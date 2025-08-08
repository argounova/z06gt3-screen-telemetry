"""
processor.py - Main telemetry data processor
Simplified version for MVP
"""

import pandas as pd
import numpy as np
from pathlib import Path
from typing import Dict, Optional, Tuple
import logging

from models import TelemetryMetadata
from exporters import export_to_csv, export_to_json

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class TelemetryProcessor:
    """Main telemetry data processor"""
    
    def __init__(self, data_dir: Path = Path('data/raw')):
        self.data_dir = data_dir
        self.metadata: Optional[TelemetryMetadata] = None
        self.data: Optional[pd.DataFrame] = None
        
    def load_data(self) -> Tuple[TelemetryMetadata, pd.DataFrame]:
        """Load metadata and telemetry data"""
        logger.info("Loading telemetry data...")
        
        # Load metadata
        metadata_file = self.data_dir / 'teledata_metadata.csv'
        if metadata_file.exists():
            self.metadata = TelemetryMetadata.from_csv(metadata_file)
            logger.info(f"✓ Loaded metadata: {self.metadata.venue} - {self.metadata.vehicle}")
        else:
            raise FileNotFoundError(f"Metadata file not found: {metadata_file}")
        
        # Load telemetry data
        data_file = self.data_dir / 'teledata.csv'
        if data_file.exists():
            # Skip the header row with units
            self.data = pd.read_csv(data_file, skiprows=[1])
            logger.info(f"✓ Loaded {len(self.data)} telemetry samples")
        else:
            raise FileNotFoundError(f"Data file not found: {data_file}")
            
        return self.metadata, self.data
    
    def process_data(self) -> pd.DataFrame:
        """Basic data processing and unit conversions"""
        logger.info("Processing data...")
        
        df = self.data.copy()
        
        # Convert units
        df['Speed_KPH'] = df['Speed'] * 3.6  # m/s to km/h
        # df['Speed_MPH'] = df['Speed'] * 2.23694  # m/s to mph
        
        # Ensure Gear is integer (0 for neutral)
        df['Gear'] = df['Gear'].fillna(0).astype(int)
        
        # Round percentages to 1 decimal place
        df['Throttle Pos'] = df['Throttle Pos'].round(1)
        df['Brake Pos'] = df['Brake Pos'].round(1)
        
        self.data = df
        logger.info(f"✓ Processed {len(df)} samples")
        
        return df
    
    def get_summary_stats(self) -> Dict:
        """Calculate summary statistics"""
        if self.data is None:
            return {}
        
        return {
            'max_speed_kph': float(self.data['Speed_KPH'].max()),
            'avg_speed_kph': float(self.data['Speed_KPH'].mean()),
            'max_rpm': float(self.data['Engine RPM'].max()),
            'avg_rpm': float(self.data['Engine RPM'].mean()),
            'total_distance_m': float(self.data['Distance'].max()),
            'duration_s': float(self.data['Time'].max()),
            'num_samples': len(self.data)
        }
    
    def export(self, output_dir: Path = Path('data/processed')) -> Dict[str, str]:
        """Export processed data"""
        output_dir.mkdir(parents=True, exist_ok=True)
        
        logger.info("Exporting processed data...")
        
        outputs = {}
        
        # Export as CSV
        csv_path = export_to_csv(self.data, output_dir / 'telemetry_processed.csv')
        outputs['csv'] = str(csv_path)
        
        # Export as JSON (with metadata and stats)
        json_data = {
            'metadata': self.metadata.__dict__ if self.metadata else {},
            'stats': self.get_summary_stats()
        }
        json_path = export_to_json(self.data, json_data, output_dir / 'telemetry.json')
        outputs['json'] = str(json_path)
        
        logger.info("✓ Export complete")
        return outputs
    
    def run(self) -> Dict:
        """Execute the pipeline"""
        logger.info("Starting telemetry pipeline...")
        
        try:
            # Load
            self.load_data()
            
            # Process
            self.process_data()
            
            # Export
            output_files = self.export()
            
            # Get summary
            stats = self.get_summary_stats()
            
            logger.info("✓ Pipeline completed successfully")
            
            return {
                'status': 'success',
                'outputs': output_files,
                'stats': stats
            }
            
        except Exception as e:
            logger.error(f"✗ Pipeline failed: {str(e)}")
            return {
                'status': 'error',
                'error': str(e)
            }


def main():
    """Main execution function"""
    processor = TelemetryProcessor(data_dir=Path('data/raw'))
    result = processor.run()
    
    print("\n" + "="*50)
    print("PIPELINE EXECUTION SUMMARY")
    print("="*50)
    
    if result['status'] == 'success':
        print("✓ Status: SUCCESS")
        print("\nStatistics:")
        for key, value in result['stats'].items():
            if isinstance(value, float):
                print(f"  {key}: {value:.2f}")
            else:
                print(f"  {key}: {value}")
        print("\nOutput Files:")
        for key, path in result['outputs'].items():
            print(f"  - {key}: {path}")
    else:
        print(f"✗ Status: FAILED")
        print(f"✗ Error: {result['error']}")
    
    print("="*50)


if __name__ == "__main__":
    main()