---
description: Phase 0 Triage (Economic Control).
---

# Phase 0: Triage

**Goal:** Classify risk (MAJOR vs MINOR) and assign Complexity Score to prevent over-engineering.

## Protocol

### 0. Clear Previous Artifacts

// turbo
```bash
# Archive and clear previous artifacts before new triage
if [ -d ".bulkhead/architecture" ] && [ "$(ls -A .bulkhead/architecture 2>/dev/null)" ]; then
    echo "🧹 Clearing previous artifacts..."
    
    # Archive to timestamped backup (optional)
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    mkdir -p .bulkhead/archive
    mv .bulkhead/architecture .bulkhead/archive/architecture_$TIMESTAMP
    
    # Create fresh architecture directory
    mkdir -p .bulkhead/architecture
    
    echo "📦 Previous artifacts archived to .bulkhead/archive/architecture_$TIMESTAMP"
else
    mkdir -p .bulkhead/architecture
fi

# Preserve audit.log (append mode)
echo "$(date -Iseconds) TRIAGE_START new_session" >> .bulkhead/audit.log
```

### 1. Analysis
Analyze the user request to determine the scope and risk.
- **Complexity Score (1-10)**:
  - **1-3**: Simple textual changes, typos, comments.
  - **4-6**: Single function logic, adding a test, minor refactor.
  - **7-10**: New features, schema changes, architectural changes, auth/security updates.

### 2. Classification
- **MINOR** (Fast Track):
  - Documentation fixes (typos, README).
  - CSS/UI styling tweaks.
  - Adding/Updating comments.
  - *Action*: Jump to Phase 7 (Verification).
- **MAJOR** (Full Governance):
  - Logic changes (> 10 lines).
  - New dependencies.
  - Database schema changes.
  - modifications to `auth`, `payment`, or `security` modules.
  - *Action*: Proceed to Phase 1 (Context).

### 3. Execution (Rigor-Conditional)

Check rigor profile to determine artifact output:
```bash
RIGOR=$(grep rigor_profile .bulkhead/config.yaml 2>/dev/null | cut -d: -f2 | tr -d ' "' || echo "standard")
```

#### A. Human-Readable (ALWAYS): `.bulkhead/architecture/00-triage.md`
```markdown
# Phase 0: Triage

## Analysis
- **Request**: [User's original request]
- **Scope**: [List of affected areas]

## Classification
- **Score**: [1-10]
- **Type**: [MAJOR/MINOR]
- **Rationale**: [Why this classification?]
```

#### B. Machine-Enforceable (standard/maximum only): `.bulkhead/architecture/00-triage.json`

> **Skip if `RIGOR=sandbox`**

*Validates against `schemas/triage-decision.schema.json`*
```json
{
  "complexity_score": 5,
  "classification": "MAJOR",
  "reason": "Modifies core business logic",
  "override_by_human": false
}
```

## Routing
- **If MINOR**: Proceed to **Phase 7**.
- **If MAJOR**: Proceed to **Phase 1**.