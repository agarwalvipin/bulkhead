import json
from pathlib import Path

import pytest

# Root directory of the project
ROOT_DIR = Path(__file__).parent.parent
SCHEMAS_DIR = ROOT_DIR / ".bulkhead" / "schemas"

# Fallback to local schemas if .bulkhead doesn't exist (e.g. in repo root)
if not SCHEMAS_DIR.exists():
    SCHEMAS_DIR = ROOT_DIR / "schemas"


@pytest.fixture
def load_schema():
    def _load(schema_name):
        path = SCHEMAS_DIR / schema_name
        if not path.exists():
            raise FileNotFoundError(f"Schema not found: {path}")
        with open(path) as f:
            return json.load(f)

    return _load
