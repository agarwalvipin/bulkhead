---
description: Bulkhead SDLC orchestrator - guides through 8-phase workflow with unified entry point
---

# Bulkhead Orchestrator Workflow

Meta-workflow providing a single entry point to the Bulkhead SDLC.

---

## Commands

### `/bulkhead start <phase-id>`

Initialize a new workstream or phase.

// turbo
1. Check prerequisites:
   ```bash
   # Verify architecture folder exists
   ls .bulkhead/architecture/ 2>/dev/null || mkdir -p .bulkhead/architecture
   
   # Check git status
   git status --porcelain
   ```

2. Validate phase dependencies:
   - If starting Phase 1+, verify Phase 0 artifacts exist
   - If starting Phase 2+, verify Phase 1 artifacts exist
   - Continue this check up the chain

3. Initialize phase:
   ```bash
   # Set phase marker
   echo "<phase-id>" > .bulkhead/current_phase
   
   # Log start
   echo "$(date -Iseconds) START <phase-id>" >> .bulkhead/audit.log
   ```

4. Invoke the appropriate phase workflow:
   - `/phase-0-triage` for Phase 0
   - `/phase-1-context` for Phase 1
   - Continue through `/phase-7-verify`

5. After phase workflow completes:
   - Prompt user to run `/bulkhead continue` for next phase
   - Highlight if next phase is Phase 4 (Human Gate)

---

### `/bulkhead continue`

Transition to the next phase.

// turbo
1. Read current phase:
   ```bash
   CURRENT=$(cat .bulkhead/current_phase 2>/dev/null || echo "none")
   ```

2. Validate current phase is complete:
   - Run `/phase-checkpoint` for current phase
   - If checkpoint fails, stop and report missing artifacts

3. Calculate next phase:
   - Phase 0 → Phase 1 (or Phase 5 if MINOR classification)
   - Phase 1 → Phase 2
   - Phase 2 → Phase 3
   - Phase 3 → Phase 4
   - Phase 4 → Phase 5 (requires human signature)
   - Phase 5 → Phase 6
   - Phase 6 → Phase 7
   - Phase 7 → Complete

4. If next phase is Phase 4:
   ```
   ⚠️  HUMAN GATE AHEAD
   Phase 4 requires human review and signature.
   The AI cannot proceed past this point without approval.
   ```

5. Invoke `/bulkhead start <next-phase>`

---

### `/bulkhead status`

Display current governance status. Invoke `/phase-status` workflow.

---

## Configuration

The orchestrator respects `.bulkhead/config.yaml` if present:

```yaml
version: "2.0"
rigor_profile: standard  # sandbox | standard | maximum
```

If no config exists, defaults to `standard` rigor.

---

## Error Recovery

- **Missing prerequisites**: Stop and list what's missing
- **Checkpoint failure**: Offer to backtrack or fix
- **Human gate pending**: Remind user to sign `04-decision.md`

---

## Integration

This workflow integrates with:
- `/phase-checkpoint` for validation
- `/phase-status` for dashboard
- `/github-project` for issue tracking (if enabled)
