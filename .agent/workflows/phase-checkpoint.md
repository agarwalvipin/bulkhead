---
description: Validates that all required Bulkhead artifacts exist and are complete before proceeding to Phase 6 Execution.
prerequisites:
  - phase-4-decision
routes_to:
  - phase-6-execute
---

# Phase Checkpoint Workflow

**Goal:** Ensure all governance artifacts are in place before coding begins.

---

## Protocol

### 0. Read Rigor Profile

// turbo
```bash
# Check config for rigor profile
if [ -f .bulkhead/config.yaml ]; then
    RIGOR=$(grep rigor_profile .bulkhead/config.yaml | cut -d: -f2 | tr -d ' "')
else
    RIGOR="standard"
fi
echo "📋 Rigor Profile: $RIGOR"
```

**Rigor determines artifact requirements:**
- `sandbox`: Lightweight JSON allowed, merge restrictions apply
- `standard`: Full JSON for key phases (0, 4), lightweight for others
- `maximum`: Full JSON for all phases, no exceptions

---

### 0.1 Sandbox Merge Check

If rigor is `sandbox`, check branch protection:

```bash
BRANCH=$(git branch --show-current)
BLOCKED_BRANCHES="main master develop"

if [[ "$RIGOR" == "sandbox" ]]; then
    for blocked in $BLOCKED_BRANCHES; do
        if [[ "$BRANCH" == "$blocked" || "$BRANCH" == release/* ]]; then
            echo "❌ SANDBOX VIOLATION: Cannot merge to $BRANCH"
            echo "   Run /bulkhead promote to upgrade to standard rigor first"
            exit 1
        fi
    done
    echo "⚠️  Sandbox mode: Code cannot merge to protected branches"
fi
```

---

### 1. Artifact Validation

Check that all required files exist in `.bulkhead/architecture/`:

```bash
# Required artifacts before Phase 6
REQUIRED=(
    "00-triage.md"
    "00-triage.json"
    "01-context.md"
    "01-context.json"
    "02-design.md"
    "02-design.json"
    "03-security.md"
    "03-security.json"
    "04-decision.md"
    "04-decision.json"
    "05-plan.md"
    "05-plan.json"
)

for file in "${REQUIRED[@]}"; do
    if [[ ! -f ".bulkhead/architecture/$file" ]]; then
        echo "❌ MISSING: $file"
        exit 1
    fi
done
echo "✅ All artifacts present"
```

### 2. Decision Gate Check

Verify Phase 4 approval exists:

```bash
# Check decision.json
DECISION=$(jq -r '.decision' .bulkhead/architecture/04-decision.json)
if [[ "$DECISION" == "ABORT" ]]; then
    echo "❌ Decision was ABORT - cannot proceed"
    exit 1
fi

SIGNATURE=$(jq -r '.human_signature' .bulkhead/architecture/04-decision.json)
if [[ -z "$SIGNATURE" || "$SIGNATURE" == "null" ]]; then
    echo "❌ No human signature - Phase 4 approval required"
    exit 1
fi
echo "✅ Approved by: $SIGNATURE"
```

### 3. Schema Validation

Validate all JSON artifacts against schemas:

```bash
for json_file in .bulkhead/architecture/*.json; do
    base=$(basename "$json_file" .json)
    schema=".bulkhead/schemas/${base}.schema.json"
    if [[ -f "$schema" ]]; then
        python -c "
import json
from jsonschema import validate
with open('$json_file') as f: data = json.load(f)
with open('$schema') as f: schema = json.load(f)
validate(data, schema)
print('✅ $json_file validates against schema')
"
    fi
done
```

### 4. Output

Generate checkpoint report:

```markdown
# Phase Checkpoint Report

## Status: ✅ PASSED / ❌ FAILED

## Artifacts
| File | Status |
|------|--------|
| 00-triage.md | ✅ |
| 01-context.md | ✅ |
| ... | ... |

## Decision
- **Outcome**: REFACTOR
- **Approved By**: VIPIN-2025-01-06

## Ready for Phase 6: YES / NO
```

---

## Routing

- **PASSED** → Proceed to Phase 6: Execution
- **FAILED** → Return to missing phase
