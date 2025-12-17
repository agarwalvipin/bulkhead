---
description: Phase 1 Deep Analysis (Nodes C, D, E, F).
---

# Analysis Workflow

This workflow performs the deep analysis required for MAJOR changes. It populates the `architecture/` ledger.

## Pre-requisites
- `triage-decision.json` exists and is classified as "MAJOR" (or user override).
- `architecture/` directory exists.

## Steps

1. **Node C: Context Capture**
   - Action: Scan the codebase to understand dependencies and current state.
   - Output: Create/Overwrite `architecture/00-context.md`.
   - Content: Deep map of affected files, data flows, and "Blast Radius".

2. **Node D: Architect Review**
   - Action: Propose architectural changes based on the user request and context.
   - Output: Create `architecture/01-architect-review.md`.
   - Content: High-level design, component diagrams, technology choices.

3. **Node E: Refactor Analysis**
   - Action: Analyze impact of the proposed architecture on existing code.
   - Output: Create `architecture/02-refactor-analysis.md`.
   - Content: List of breaking changes, migration steps, cost estimation.

4. **Node F: Security Gate**
   - Action: Perform threat modeling on the changes.
   - Output: Create `architecture/03-security-report.md`.
   - Content: Attack surface analysis, auth checks, data exposure risks.

5. **Completion**
   - Stop and respond: "Phase 1 Analysis Complete. Please review the artifacts in `architecture/`. When ready, run `/authorize` to make a strategic decision."
