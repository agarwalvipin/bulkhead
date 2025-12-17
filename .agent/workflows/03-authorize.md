---
description: Phase 2 Governance Gate (Node H).
---

# Authorize Workflow

This workflow guides the HUMAN governance decision. It produces the binding `04-decision-record.md`.

## Pre-requisites
- Phase 1 artifacts (00, 01, 02, 03) must exist in `architecture/`.

## Steps

1. **Review Summary**
   - Read `architecture/02-refactor-analysis.md` and `architecture/03-security-report.md`.
   - Present a concise summary of "Cost vs Risk" to the user.

2. **Draft Decision Record**
   - Create a template file at `architecture/04-decision-record.md`.
   - **Schema**: Follow "Schema A" from `governance/FLOW_AND_GOVERNANCE.md`.

   ```markdown
   # Strategic Decision: [Feature Name]
   **Date:** YYYY-MM-DD
   **Author:** [User Name]

   ## Decision
   [ ] **REFACTOR**
   [ ] **REBUILD**
   [ ] **ABORT**

   ## Rationale
   ...
   
   ## Approval
   ...
   ```

3. **Wait for Approval**
   - Stop and respond: "I have drafted `architecture/04-decision-record.md`. Please edit this file to mark your decision (REFACTOR/REBUILD/ABORT) and save it. Then run `/plan`."
