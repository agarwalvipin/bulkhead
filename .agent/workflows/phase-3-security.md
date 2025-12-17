---
description: Phase 3 Security (Threat Modeling).
---

# Phase 3: Security

**Goal:** Scan the Design for vulnerabilities.

## Protocol
1.  **Threat Model**:
    - Analyze `02-design.json`.
    - Identify broken auth, data leaks, or permission escalation.
2.  **Generate Artifacts (Double-Write)**:
    - `architecture/03-security.md`: Human readable report.
    - `architecture/03-security.json`: Risk score and status.
    - **Schema:** `schemas/security-report.schema.json`.
