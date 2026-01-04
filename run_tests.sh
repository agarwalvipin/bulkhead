#!/bin/bash
# Create venv if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install dependencies
pip install pytest jsonschema > /dev/null

echo "Running Bulkhead Automated Tests..."
pytest tests/ -v
