---
description: Phase 3 Orchestration (Nodes I, K).
---

# Plan Workflow

This workflow translates the human decision into executable machine instructions.

## Pre-requisites
- `architecture/04-decision-record.md` exists.

## Steps

1. **Validate Decision**
   - Read `architecture/04-decision-record.md`.
   - Parse the `## Decision` section.
   - IF **ABORT**: Stop. Do not proceed.
   - IF **REFACTOR** or **REBUILD**: Continue.

2. **Node I: Generate Execution Plan**
   - Action: create a step-by-step plan.
   - Output: `execution-plan.json`.
   - **Schema Check**: Must validate against `schemas/execution-plan.schema.json`.
   - Content: Epics, Tasks, Acceptance Criteria.

3. **Node K: Context Slicing**
   - Action: Define the safety boundaries for the AI.
   - Output: `context-spec.json`.
   - **Schema Check**: Must validate against `schemas/context-spec.schema.json`.
   - Content: `read_only`, `read_write`, and `forbidden` paths.

4. **Completion**
   - Stop and respond: "Planning complete. `execution-plan.json` and `context-spec.json` have been generated. Run `/implement` to start coding."
