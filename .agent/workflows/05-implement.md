---
description: Phase 4 Delivery Loop (Nodes L, M, N).
---

# Implement Workflow

This workflow executes the plan generated in Phase 3.

## Pre-requisites
- `execution-plan.json` exists.
- `context-spec.json` exists.

## Steps

1. **Load Context**
   - Read `execution-plan.json` to understand tasks.
   - Read `context-spec.json` to load boundaries.

2. **Enforcement**
   - **Strict Rule**: You may NOT edit files listed in `forbidden` or outside of `read_write`.
   - If the plan requires editing a forbidden file, STOP and request a `context-spec.json` update.

3. **Execution Loop (Iterate through Tasks)**
   - For each Task in the inputs:
     1. **TDD Setup**: Write the test case first (if applicable).
     2. **Implementation**: Write the code.
     3. **Verification**: Run tests/linting.
     4. **Commit**: (Simulated) Save the state.

4. **Final Verification**
   - Run the full project test suite.
   - If all pass, respond: "Implementation complete and verified."
   - If failed, attempt self-repair or ask for user guidance.
