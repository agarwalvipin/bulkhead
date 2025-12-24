---
description: Display current Bulkhead governance status - read-only dashboard showing phase progress and artifact state
---

# Phase Status Dashboard

Read-only view of current governance state.

---

## Usage

```bash
/phase-status
```

---

## Implementation

// turbo
1. Read current phase:
   ```bash
   CURRENT_PHASE=$(cat .bulkhead/current_phase 2>/dev/null || echo "not started")
   ```

2. Read config (if exists):
   ```bash
   if [ -f .bulkhead/config.yaml ]; then
     RIGOR=$(grep rigor_profile .bulkhead/config.yaml | cut -d: -f2 | tr -d ' "')
   else
     RIGOR="standard (default)"
   fi
   ```

3. List architecture artifacts:
   ```bash
   ls -la .bulkhead/architecture/*.md 2>/dev/null | awk '{print $NF}'
   ls -la .bulkhead/architecture/*.json 2>/dev/null | awk '{print $NF}'
   ```

4. Get git branch:
   ```bash
   BRANCH=$(git branch --show-current)
   ```

5. Generate status report:

```
📊 Bulkhead Governance Status
═══════════════════════════════════════════════════

Project:      <project-name>
Branch:       <branch>
Rigor Level:  <rigor-profile>
Current Phase: <phase>

Phase Progress:
───────────────
✅ Phase 0: Triage      [00-triage.md] [00-triage.json]
✅ Phase 1: Context     [01-context.md] [01-context.json]
🟡 Phase 2: Design      [02-design.md] [MISSING: json]
⬜ Phase 3: Security    
⬜ Phase 4: Decision    ← Human Gate
⬜ Phase 5: Plan        
⬜ Phase 6: Execute     
⬜ Phase 7: Verify      

Legend: ✅ Complete | 🟡 In Progress | ⬜ Pending | ❌ Failed

───────────────
Next Step: Complete Phase 2 design artifacts
Command:   /phase-2-design
```

---

## Status Icons

| Symbol | Meaning |
|--------|---------|
| ✅ | Phase complete (both .md and .json present) |
| 🟡 | Phase in progress (partial artifacts) |
| ⬜ | Phase not started |
| ❌ | Phase failed validation |
| 🔒 | Phase 4 - Human gate |

---

## Artifact Checks

For each phase, check:
- [ ] `.md` file exists
- [ ] `.json` file exists (except Phase 6, 7)
- [ ] JSON validates against schema

Report missing or invalid artifacts clearly.

---

## Notes

- This is a **read-only** workflow
- Does not modify any files
- Safe to run at any time
