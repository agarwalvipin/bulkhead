---
description: Initial request handling and classification (Node B).
---

# Triage Workflow

This workflow is the entry point for all requests. It classifies the work and determines the appropriate pipeline.

## Steps

1. **Analyze Request**:
   - Read the user's request.
   - Evaluate complexity (High/Low) and Risk (High/Low).
   - *Criteria*: 
     - "Major" if > 3 files changed, schema changes, auth changes, infra changes, or structural refactoring.
     - "Minor" if typo, content update, one-line CSS fix, or simple bug fix.

2. **Generate Triage Decision**:
   - Create a file named `triage-decision.json` in the root (or read existing if continuing).
   - **Schema Validation**: Must match `schemas/triage-decision.schema.json`.
   
   ```json
   {
     "request_summary": "...",
     "classification": "MAJOR" | "MINOR",
     "confidence_score": 0-10,
     "rationale": "..."
   }
   ```

3. **Routing**:
   - **IF MAJOR**:
     - Stop and respond: "Governance: request classified as MAJOR. Please run `/analyze` to begin Phase 1 Analysis."
   - **IF MINOR**:
     - Stop and respond: "Governance: request classified as MINOR. You may proceed with fast-tracked execution."