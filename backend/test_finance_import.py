import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

try:
    from app.services import finance
    print(f"Successfully imported finance: {finance}")
    print(f"Functions available: {[f for f in dir(finance) if not f.startswith('_')]}")
    
    # Test a few exports
    assert hasattr(finance, 'fetch_market_data')
    assert hasattr(finance, 'fetch_peer_data_bundle')
    assert hasattr(finance, 'fetch_market_context')
    print("All required functions found in finance package.")
except Exception as e:
    print(f"Import failed: {e}")
    sys.exit(1)
