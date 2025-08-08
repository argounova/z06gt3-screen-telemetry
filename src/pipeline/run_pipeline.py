"""
run_pipeline.py - Simple script to run the telemetry pipeline
"""

from pathlib import Path
import sys

# Add parent directory to path if running from scripts folder
sys.path.append(str(Path(__file__).parent.parent))

from processor import TelemetryProcessor


def run_pipeline(input_dir: str = 'data/raw', output_dir: str = 'data/processed'):
    """
    Run the telemetry processing pipeline
    
    Args:
        input_dir: Directory containing raw telemetry files
        output_dir: Directory for processed output files
    """
    
    # Initialize processor
    processor = TelemetryProcessor(data_dir=Path(input_dir))
    
    # Set output directory
    processor.output_dir = Path(output_dir)
    
    # Run pipeline
    result = processor.run()
    
    # Print summary
    print("\n" + "="*50)
    print("TELEMETRY PIPELINE RESULTS")
    print("="*50)
    
    if result['status'] == 'success':
        print("✓ Pipeline completed successfully\n")
        
        # Print statistics
        print("Session Statistics:")
        stats = result['stats']
        print(f"  Duration: {stats['duration_s']:.1f} seconds")
        print(f"  Distance: {stats['total_distance_m']:.0f} meters")
        print(f"  Max Speed: {stats['max_speed_kph']:.1f} km/h")
        print(f"  Avg Speed: {stats['avg_speed_kph']:.1f} km/h")
        print(f"  Max RPM: {stats['max_rpm']:.0f}")
        print(f"  Samples: {stats['num_samples']}")
        
        print("\nOutput Files:")
        for file_type, path in result['outputs'].items():
            print(f"  {file_type}: {path}")
    else:
        print(f"✗ Pipeline failed: {result['error']}")
    
    print("="*50)
    return result


if __name__ == "__main__":
    # Run with default directories
    run_pipeline()