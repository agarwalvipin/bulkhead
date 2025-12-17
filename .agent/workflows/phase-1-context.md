---
description: Phase 1 Context (Blast Radius).
---

# Phase 1: Context

**Goal:** Identify dependencies and lock file permissions.

## Protocol
1.  **Scan Codebase**:
    - Map dependencies of the modified files.
    - Identify the "Blast Radius".
2.  **Generate Artifacts (Double-Write)**:
    - `architecture/01-context.md`: Description of the environment.
    - `architecture/01-context.json`: Strict defining of `read_write` vs `read_only`.
    - **Schema:** `schemas/context-spec.schema.json`.
