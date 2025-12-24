---
description: Phase 7 Verification (Quality Gate).
---

# Phase 7: Verification

**Goal:** Verify that the implementation matches the Plan and Design.

## Protocol

### 1. Verification
Run the acceptance criteria defined in `05-plan.json`.
- **Automated Tests**: Run `npm test`, `pytest`, etc.
- **Manual Verification**: Check UI, formatting, etc.

### 2. Execution (Double-Write)
Generate the following artifact:

#### A. Human-Readable: `architecture/07-verify.md`
```markdown
# Phase 7: Verification Report

## Status
- **Result**: PASSED / FAILED
- **Verified By**: [Agent Name / User Name]

## Evidence
- [x] Test Suite: 45/45 Passed
- [x] Linting: Passed
- [x] Manual Check: Login works

## Final Sign-off
Ready for merge/deployment.
```

## Routing
- **PASSED**: Task Complete.
- **FAILED**: Return to **Phase 6** for fixes, or **Phase 2** if architectural issue.
