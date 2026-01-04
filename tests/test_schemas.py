import json
import os
from pathlib import Path

import pytest
from jsonschema import ValidationError, validate

# Map of test file prefixes to schema filenames
SCHEMA_MAPPING = {
    "00-triage": "triage-decision.schema.json",
    "01-context": "context-spec.schema.json",
    "02-design": "design-spec.schema.json",
    "03-security": "security-report.schema.json",
    "04-decision": "decision-record.schema.json",
    "05-plan": "execution-plan.schema.json",
}


def get_test_files(subdir):
    """Yields (filename, full_path) for all json files in tests/schemas/{subdir}"""
    base_path = Path(__file__).parent / "schemas" / subdir
    if not base_path.exists():
        return

    for f in os.listdir(base_path):
        if f.endswith(".json"):
            yield f, base_path / f


@pytest.mark.parametrize("filename,filepath", get_test_files("valid"))
def test_valid_schemas(load_schema, filename, filepath):
    """Test that valid examples pass schema validation"""
    # Determine which schema to use based on filename prefix
    schema_file = None
    for prefix, schema in SCHEMA_MAPPING.items():
        if filename.startswith(prefix):
            schema_file = schema
            break

    if not schema_file:
        pytest.fail(f"Could not map test file {filename} to a known schema")

    schema = load_schema(schema_file)
    with open(filepath) as f:
        instance = json.load(f)

    try:
        validate(instance=instance, schema=schema)
    except ValidationError as e:
        pytest.fail(f"Valid file {filename} failed validation: {e.message}")


@pytest.mark.parametrize("filename,filepath", get_test_files("invalid"))
def test_invalid_schemas(load_schema, filename, filepath):
    """Test that invalid examples fail schema validation"""
    # Determine which schema to use based on filename prefix
    schema_file = None
    for prefix, schema in SCHEMA_MAPPING.items():
        if filename.startswith(prefix):
            schema_file = schema
            break

    if not schema_file:
        pytest.fail(f"Could not map test file {filename} to a known schema")

    schema = load_schema(schema_file)
    with open(filepath) as f:
        instance = json.load(f)

    with pytest.raises(ValidationError):
        validate(instance=instance, schema=schema)
