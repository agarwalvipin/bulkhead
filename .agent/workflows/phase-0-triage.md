---
description: Phase 0 Triage (Economic Control).
---

# Phase 0: Triage

**Goal:** Classify risk (MAJOR vs MINOR) and assign Complexity Score.

## Protocol
1.  **Analyze Request**:
    - If > 3 files, Schema Change, Infra change, or Auth Change => **MAJOR**.
    - If Typo, CSS, One-line Fix => **MINOR**.
2.  **Generate Artifacts (Double-Write)**:
    - `architecture/00-triage.md`: Human readable reasoning.
    - `architecture/00-triage.json`: Machine valid JSON.
    - **Schema:** `schemas/triage-decision.schema.json`.

## Routing
- **MAJOR**: Proceed to Phase 1.
- **MINOR**: Jump to Phase 7 (Fast-Track).