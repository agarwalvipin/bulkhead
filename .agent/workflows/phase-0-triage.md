---
description: Phase 0 Triage (Economic Control).
---

# Phase 0: Triage

**Goal:** Classify risk (MAJOR vs MINOR) and assign Complexity Score to prevent over-engineering.

## Protocol

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

### 3. Execution (Double-Write)
Generate the following artifacts in `architecture/`:

#### A. Human-Readable: `architecture/00-triage.md`
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

#### B. Machine-Enforceable: `architecture/00-triage.json`
*Must validate against `schemas/triage-decision.schema.json`*
```json
{
  "complexity_score": 5,
  "classification": "MAJOR",
  "reason": "Modifies core business logic",
  "override_by_human": false
}
```

## Routing
- **If MINOR**: Initialize `architecture/05-plan.json` with a simple verification task and proceed to **Phase 7**.
- **If MAJOR**: Proceed to **Phase 1**.