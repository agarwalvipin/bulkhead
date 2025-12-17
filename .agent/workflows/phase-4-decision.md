---
description: Phase 4 Governance (Decision Gate).
---

# Phase 4: Decision

**Goal:** Strategic choice (REFACTOR vs REBUILD).

## Protocol
1.  **Present Options**: Show User the Design (Phase 2) and Risk (Phase 3).
2.  **Wait for Signature**:
    - User must edit `architecture/04-decision.md` to sign off.
3.  **Generate Artifacts (Double-Write)**:
    - `architecture/04-decision.md`: Signed document.
    - `architecture/04-decision.json`: Binding decision record.
    - **Schema:** `schemas/decision-record.schema.json`.

## Enforcement
- If **ABORT**: Stop.
- If **APPROVED**: Proceed to Phase 5.
