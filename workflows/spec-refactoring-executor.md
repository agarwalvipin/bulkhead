---
description: Executes phased refactoring plan from /spec-modernization with automated checkpoints and progress tracking
prerequisites: [modernization-plan.json]
routes_to:
  - bulkhead
  - int-pr-manager
outputs:
  human: .bulkhead/architecture/refactor-progress.md
  machine: .bulkhead/architecture/refactor-progress.json
---

# Refactoring Executor Workflow

**Goal:** Execute a phased refactoring plan created by `/spec-modernization`, running full governance for each component.

---

## Prerequisites

- `.bulkhead/architecture/modernization-plan.json` exists
- Decision is `REFACTOR` (not `REBUILD`)
- Plan has been approved (Phase 4 signature)

---

## Workflow Steps

### Step 1: Load Plan

// turbo
```bash
# Check modernization plan exists
cat .bulkhead/architecture/modernization-plan.json | jq '.decision'
```

If decision is `REBUILD`, stop and redirect to `/bulkhead start 0` for greenfield.

### Step 2: Initialize Progress Tracker

Create `.bulkhead/architecture/refactor-progress.json`:

```json
{
  "version": "1.0",
  "started": "YYYY-MM-DDTHH:MM:SS",
  "strategy": "strangler_fig|abstraction_layer|cleanup_in_place",
  "phases": [
    {
      "id": "P1",
      "title": "Preparation",
      "status": "pending",
      "epics": []
    }
  ],
  "current_phase": "P1",
  "current_epic": null
}
```

### Step 3: For Each Phase

Loop through `phases` in the modernization plan:

1. **Announce Phase Start**
   ```
   🔄 Starting Refactor Phase: [Phase Title]
   Duration Estimate: [X weeks]
   Tasks: [list]
   ```

2. **For Each Task in Phase**:
   - Create epic via `/int-github-project create-epic`
   - Run `/bulkhead start 0` for this epic
   - **Classification Check**:
     - If MINOR → Auto-bypass Phase 4
     - If MAJOR/CRITICAL → Require Phase 4 signature
   - Complete SDLC (Phase 0-7)
   - Run `/int-pr-manager` (prompt user for PR/merge)
   - Update progress tracker

3. **Phase Checkpoint**
   - Validate all tasks complete
   - Run integration tests
   - Update `refactor-progress.json`

### Step 4: Prompt for Next Phase

```
✅ Phase [N] Complete!

Completed tasks:
- [x] Task 1
- [x] Task 2

Next: Phase [N+1] - [Title]
Estimated duration: [X weeks]

Proceed to next phase? [y/n]
```

If yes → Continue to next phase
If no → Pause and save state

---

## Progress Tracking

### Human-Readable: `refactor-progress.md`

```markdown
# Refactoring Progress

## Current Status
- **Phase**: P2 - Isolation
- **Started**: 2024-01-01
- **Overall Progress**: 45%

## Completed Phases
### P1: Preparation ✅
- [x] Add test coverage
- [x] Setup linting
- [x] Document architecture

## In Progress
### P2: Isolation
- [x] Extract AuthModule
- [ ] Extract UserAPI ← Current
- [ ] Extract DataLayer

## Upcoming
### P3: Replacement
- [ ] Implement AuthModule v2
- [ ] Feature flag rollout
```

### Machine-Readable: `refactor-progress.json`

```json
{
  "current_phase": "P2",
  "current_epic": "extract-user-api",
  "overall_progress": 0.45,
  "phases": [
    {
      "id": "P1",
      "status": "complete",
      "completed_at": "2024-01-15T10:00:00Z"
    },
    {
      "id": "P2",
      "status": "in_progress",
      "epics": [
        {"id": "auth-module", "status": "complete"},
        {"id": "user-api", "status": "in_progress"},
        {"id": "data-layer", "status": "pending"}
      ]
    }
  ]
}
```

---

## Rollback Support

Each phase maintains rollback capability:

- **Feature Flags**: Toggle to revert behavior
- **Database Migrations**: Reversible migrations tracked
- **Git Tags**: Each phase completion is tagged

```bash
# Rollback to phase start
git checkout refactor-P2-start

# Disable feature flag
echo '{"extracted_auth": false}' > .bulkhead/feature-flags.json
```

---

## Error Handling

| Error | Action |
|-------|--------|
| Epic fails Phase 7 | Pause, prompt for fix or skip |
| Integration test fails | Block next phase, require resolution |
| User declines next phase | Save state, can resume later |
| Missing prerequisites | List requirements, block execution |

---

## Resume Support

// turbo
```bash
# Check for existing progress
if [ -f .bulkhead/architecture/refactor-progress.json ]; then
  CURRENT=$(cat .bulkhead/architecture/refactor-progress.json | jq -r '.current_phase')
  echo "Resuming from phase: $CURRENT"
fi
```

To resume:
```
/spec-refactoring-executor resume
```

---

## Routing

- **All phases complete** → Update changelog, final review
- **Blocked** → Save state, notify user
- **Rebuild required** → Redirect to `/bulkhead start 0`
