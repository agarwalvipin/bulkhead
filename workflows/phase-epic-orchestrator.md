---
description: Orchestrates large codebase development with multiple epics per phase and nested governance
prerequisites: [modernization-plan.json OR manual phase definition]
routes_to:
  - bulkhead
  - int-github-project
  - int-pr-manager
outputs:
  human: .bulkhead/architecture/project-progress.md
  machine: .bulkhead/architecture/project-progress.json
---

# Phase Epic Orchestrator Workflow

**Goal:** Manage large codebase development where modernization phases contain multiple epics, each running full governance SDLC.

---

## When to Use

- Large codebase modernization (100K+ LOC)
- Multi-month projects with distinct phases
- Teams working on multiple parallel epics
- When you need phase gating (P2 starts only after P1 complete)

---

## Concepts

### Hierarchy

```
Project
├── Phase P1: [Theme]
│   ├── Epic 1.1: [Component A] → Full SDLC (0-7)
│   ├── Epic 1.2: [Component B] → Full SDLC (0-7)
│   └── Epic 1.3: [Component C] → Full SDLC (0-7)
├── Phase P2: [Theme]
│   └── ...
└── Phase P3: [Theme]
    └── ...
```

### Governance Rules

1. **Each Epic = Full SDLC**: Every epic runs Phase 0-7
2. **Classification Per Epic**: MINOR/MAJOR/CRITICAL independently
3. **MINOR Auto-Bypass**: MINOR epics skip Phase 4
4. **Phase Gate**: All epics in phase must complete before next phase
5. **User Control**: Always prompt before phase transitions

---

## Usage

```bash
/phase-epic-orchestrator init        # Initialize from modernization plan
/phase-epic-orchestrator status      # Show project progress
/phase-epic-orchestrator start P1    # Start a phase
/phase-epic-orchestrator epic E1.1   # Start specific epic
/phase-epic-orchestrator complete    # Mark current epic complete
/phase-epic-orchestrator next        # Move to next epic/phase
```

---

## Workflow: Initialize

### From Modernization Plan

// turbo
```bash
# Check for existing modernization plan
if [ -f .bulkhead/architecture/modernization-plan.json ]; then
  echo "Found modernization plan"
  cat .bulkhead/architecture/modernization-plan.json | jq '.phases'
fi
```

### Manual Initialization

If no plan exists, prompt for phase structure:

```
📋 Define Project Phases

Enter phases (one per line, empty to finish):
> P1: Infrastructure Modernization
> P2: Core Feature Rebuild
> P3: API Unification
> P4: Performance & Polish
> [empty]

Phases registered:
- P1: Infrastructure Modernization
- P2: Core Feature Rebuild
- P3: API Unification
- P4: Performance & Polish

Now define epics for P1...
```

### Create Project Structure

```json
{
  "version": "1.0",
  "project_name": "Codebase Modernization",
  "created": "2024-01-01",
  "phases": [
    {
      "id": "P1",
      "title": "Infrastructure Modernization",
      "status": "pending",
      "epics": [
        {
          "id": "E1.1",
          "title": "Database Migration",
          "classification": "MAJOR",
          "status": "pending",
          "branch": null,
          "pr": null
        }
      ]
    }
  ],
  "current_phase": null,
  "current_epic": null
}
```

---

## Workflow: Start Phase

```
/phase-epic-orchestrator start P1
```

### Step 1: Validate Phase Prerequisites

```
🔍 Checking Phase P1 Prerequisites...

Previous Phase: None (this is the first phase)
Status: ✅ Ready to start

Epics in P1:
1. E1.1: Database Migration (MAJOR)
2. E1.2: API Gateway (MAJOR)
3. E1.3: Auth Service (CRITICAL)

Start Phase P1? [y/n]
```

### Step 2: Initialize Phase Tracking

// turbo
```bash
# Create phase directory
mkdir -p .bulkhead/phases/P1

# Update progress
cat .bulkhead/architecture/project-progress.json | \
  jq '.current_phase = "P1" | .phases[0].status = "in_progress"' > tmp.json
mv tmp.json .bulkhead/architecture/project-progress.json
```

### Step 3: Create GitHub Epics

For each epic in phase:
```bash
/int-github-project create-epic "P1-E1.1: Database Migration"
```

### Step 4: Start First Epic

```
📍 Starting Epic E1.1: Database Migration

Classification: MAJOR
  → Phase 4 human gate REQUIRED

Branch: feature/p1-database-migration
GitHub Issue: #42

Running /bulkhead start 0 for this epic...
```

---

## Workflow: Epic Execution

Each epic runs the full SDLC:

```
Epic E1.1: Database Migration
├── Phase 0: Triage → MAJOR classification
├── Phase 1: Context → Scope documented
├── Phase 2: Design → Architecture decided
├── Phase 3: Security → Threat model complete
├── Phase 4: Decision → ✅ Human approved (MAJOR)
├── Phase 5: Plan → Tasks created
├── Phase 6: Execute → Code written
├── Phase 7: Verify → Tests passed
└── PR Manager → User prompted, merged
```

### MINOR Epic Fast-Track

For MINOR epics:
```
Epic E1.4: Update Dependencies

Classification: MINOR
  → Phase 4 AUTO-BYPASSED

Skipping human gate...
Proceeding to Phase 5: Plan
```

---

## Workflow: Epic Complete

After PR merge:

```
✅ Epic E1.1 Complete!

Branch: feature/p1-database-migration (deleted)
PR #45: Merged to main
Duration: 3 days

Phase P1 Progress: 1/3 epics (33%)

Remaining in P1:
- [ ] E1.2: API Gateway
- [ ] E1.3: Auth Service

Start next epic? [y/list/skip]
```

**Options:**
- `y` → Start next epic (E1.2)
- `list` → Show all remaining epics
- `skip` → Pause, can resume later

---

## Workflow: Phase Gate

When all epics in a phase complete:

```
🎉 Phase P1 Complete!

All epics merged:
- [x] E1.1: Database Migration
- [x] E1.2: API Gateway
- [x] E1.3: Auth Service

Total commits: 47
Total PRs: 3
Duration: 2 weeks

Phase Gate Validation:
✅ All epics merged
✅ Integration tests passing
✅ No P1 regressions in main

Ready to proceed to Phase P2: Core Feature Rebuild

Start Phase P2? [y/n/pause]
```

If user selects `pause`:
```
⏸️ Project paused after P1

To resume later:
/phase-epic-orchestrator start P2

Progress saved to:
.bulkhead/architecture/project-progress.json
```

---

## Progress Dashboard

```
/phase-epic-orchestrator status
```

Output:
```
📊 Project Progress Dashboard

Project: Codebase Modernization
Started: 2024-01-01
Overall: 42% complete

┌─────────────────────────────────────────┐
│ P1: Infrastructure     ████████████ 100%│
│ P2: Core Features      ██████░░░░░░  50%│
│ P3: API Unification    ░░░░░░░░░░░░   0%│
│ P4: Performance        ░░░░░░░░░░░░   0%│
└─────────────────────────────────────────┘

Current: P2 - Epic E2.2 (User Permissions)
Status: Phase 6 - Executing

Recent Activity:
- E2.1: User Management ✅ Merged 2h ago
- E1.3: Auth Service ✅ Merged 3d ago
```

---

## Artifact Structure

```
.bulkhead/
├── architecture/
│   ├── project-progress.json      # Overall tracking
│   ├── project-progress.md        # Human-readable
│   └── modernization-plan.json    # Source plan
├── phases/
│   ├── P1/
│   │   ├── summary.md             # Phase rollup
│   │   ├── E1.1/                  # Epic artifacts
│   │   │   ├── 00-triage.md
│   │   │   ├── 01-context.md
│   │   │   └── ...
│   │   ├── E1.2/
│   │   └── E1.3/
│   └── P2/
│       └── ...
└── config.yaml
```

---

## Error Handling

| Scenario | Action |
|----------|--------|
| Epic fails Phase 7 | Block phase, prompt for fix |
| User skips epic | Mark as skipped, warn about dependencies |
| Phase gate fails | List failing conditions, block P2 |
| Parallel epic conflict | Detect merge conflicts early, prompt resolution |
| User abandons | Save state, can resume anytime |

---

## Integration

### With `/int-github-project`
- Create GitHub Project for the modernization
- Each phase = Milestone
- Each epic = Issue with labels

### With `/bulkhead`
- Each epic runs full `/bulkhead` SDLC
- Artifacts stored in `phases/Px/Ex.x/`

### With `/int-pr-manager`
- Prompt user for each epic's PR
- Prompt user for merge

---

## Configuration

In `.bulkhead/config.yaml`:

```yaml
phase_orchestrator:
  require_phase_gate: true       # Enforce phase completion
  parallel_epics: false          # Allow parallel epic work
  auto_create_branches: true     # Create feature branches
  epic_naming: "feature/p{phase}-{epic}"
  
  # Classification thresholds
  minor_bypass_phase4: true      # Auto-approve MINOR
```
