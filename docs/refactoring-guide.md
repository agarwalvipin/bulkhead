# Large Codebase Refactoring Guide

A comprehensive guide to refactoring large codebases using Bulkhead governance workflows.

---

## Quick Start

```bash
# 1. Assess and plan
/spec-modernization

# 2. Initialize project structure
/phase-epic-orchestrator init

# 3. Start first phase
/phase-epic-orchestrator start P1

# 4. Check status anytime
/phase-status

# 5. Resume work
/bulkhead continue
```

---

## Project Structure

```
Modernization Project
├── Phase P1: Infrastructure
│   ├── Epic 1.1: Database Migration → SDLC 0-7
│   ├── Epic 1.2: API Gateway → SDLC 0-7
│   └── Epic 1.3: Auth Service → SDLC 0-7
├── Phase P2: Core Features
│   ├── Epic 2.1: User Management → SDLC 0-7
│   └── Epic 2.2: Permissions → SDLC 0-7
└── Phase P3: Polish
    └── Epic 3.1: Performance → SDLC 0-7
```

Each epic runs the complete 8-phase SDLC with full governance.

---

## Artifact Flow

### Project-Level Artifacts

| Artifact | Purpose | Created By |
|----------|---------|------------|
| `modernization-plan.json` | Master plan with phases/epics | `/spec-modernization` |
| `project-progress.json` | Status tracking | `/phase-epic-orchestrator` |
| `current_phase` | Resume marker | `/bulkhead` |

### Per-Epic Artifacts (SDLC Phases 0-7)

| Phase | Artifact | Contents | Used By Next Phase |
|-------|----------|----------|-------------------|
| **0: Triage** | `00-triage.json` | MINOR/MAJOR/CRITICAL classification | Phase 4 bypass decision |
| **1: Context** | `01-context.json` | Scope, dependencies, blast radius | Phase 2 design scope |
| **2: Design** | `02-design.json` | Architecture decisions | Phase 3 security review |
| **3: Security** | `03-security.json` | Threat model, mitigations | Phase 4 decision |
| **4: Decision** | `04-decision-record.md` | Human approval (or auto-bypass) | Phase 5 gate |
| **5: Plan** | `05-plan.json` | Tasks, GitHub issues | Phase 6 execution |
| **6: Execute** | `06-report.md` | Implementation notes | Phase 7 verification |
| **7: Verify** | `07-verify.json` | Test results, coverage | PR creation |

### Dependency Chain

```
Triage → Context → Design → Security → Decision → Plan → Execute → Verify
   │        │         │         │          │         │        │         │
   └──────────────────────────────────────────────────────────────────────┘
                              All feed into: project-progress.json
```

---

## Directory Structure

```
.bulkhead/
├── .bulkhead/architecture/
│   ├── modernization-plan.md          # Human-readable plan
│   ├── modernization-plan.json        # Machine-readable (automation)
│   ├── project-progress.json          # STATUS TRACKER
│   └── project-progress.md            # Human dashboard
├── phases/
│   ├── P1/
│   │   ├── summary.md                  # Phase rollup
│   │   ├── E1.1/                       # Epic 1.1 artifacts
│   │   │   ├── 00-triage.json
│   │   │   ├── 01-context.json
│   │   │   ├── 02-design.json
│   │   │   ├── 03-security.json
│   │   │   ├── 04-decision-record.md
│   │   │   ├── 05-plan.json
│   │   │   ├── 06-report.md
│   │   │   └── 07-verify.json
│   │   └── E1.2/
│   │       └── ...
│   └── P2/
│       └── ...
├── current_phase                       # Resume marker
└── config.yaml                         # Project configuration
```

---

## Checking Status

### Command
```bash
/phase-epic-orchestrator status
```

### Example Output
```
📊 Project Progress Dashboard

Project: Codebase Modernization
Started: 2024-01-01
Overall: 42% complete

┌─────────────────────────────────────────┐
│ P1: Infrastructure     ████████████ 100%│
│ P2: Core Features      ██████░░░░░░  50%│
│ P3: API Unification    ░░░░░░░░░░░░   0%│
└─────────────────────────────────────────┘

Current: P2 - Epic E2.2 (User Permissions)
SDLC Phase: 6 - Executing
Branch: feature/p2-user-permissions

Recent Activity:
- E2.1: User Management ✅ Merged 2h ago
- E1.3: Auth Service ✅ Merged 3d ago
```

### Progress JSON
```json
{
  "current_phase": "P2",
  "current_epic": "E2.2",
  "current_sdlc_phase": 6,
  "overall_progress": 0.42,
  "phases": [
    {
      "id": "P1",
      "status": "complete",
      "completed_at": "2024-01-15T10:00:00Z",
      "epics": [
        {"id": "E1.1", "status": "complete", "pr": 45},
        {"id": "E1.2", "status": "complete", "pr": 47}
      ]
    },
    {
      "id": "P2",
      "status": "in_progress",
      "epics": [
        {"id": "E2.1", "status": "complete", "pr": 52},
        {"id": "E2.2", "status": "in_progress", "sdlc_phase": 6}
      ]
    }
  ]
}
```

---

## Resuming Work

### Automatic Detection
Every workflow checks for existing progress on startup.

### Resume Commands

| Scenario | Command |
|----------|---------|
| Continue current epic | `/bulkhead continue` |
| Start specific epic | `/phase-epic-orchestrator epic E2.2` |
| Move to next epic | `/phase-epic-orchestrator next` |
| Start specific phase | `/phase-epic-orchestrator start P2` |

### How Resume Works

1. **Reads** `current_phase` marker file
2. **Loads** `project-progress.json`
3. **Finds** last incomplete item
4. **Jumps** to correct SDLC phase
5. **Restores** branch context
6. **Continues** execution

### Example
```bash
# Left off at Phase 6 of Epic 2.2 yesterday
/bulkhead continue

# Output:
📍 Resuming work...

Epic: E2.2 - User Permissions
SDLC Phase: 6 (Execute) - In Progress
Branch: feature/p2-user-permissions
Last activity: 18h ago

Switching to branch...
Ready to continue coding.
```

---

## Phase Gating

**Rule:** All epics in a phase must complete before the next phase can start.

### Gate Check
```
Phase P1 Complete?
├── E1.1: ✅ Merged
├── E1.2: ✅ Merged
└── E1.3: ✅ Merged
    └── All done → P2 unlocked
```

### Gate Prompt
```
🎉 Phase P1 Complete!

All epics merged:
- [x] E1.1: Database Migration (PR #45)
- [x] E1.2: API Gateway (PR #47)
- [x] E1.3: Auth Service (PR #49)

Total commits: 47
Duration: 2 weeks

Ready to start Phase P2: Core Features

Proceed? [y/n/pause]
```

---

## Classification & Automation

| Classification | Phase 4 Gate | Human Intervention |
|---------------|--------------|-------------------|
| **MINOR** | Auto-bypassed ✅ | Just PR confirmation |
| **MAJOR** | Required ⚠️ | Review + Decision + PR |
| **CRITICAL** | Required 🔒 | Full review + Multiple approvals |

### MINOR Fast-Track
```
Epic classified as MINOR
  ↓
Skip Phases 1-4
  ↓
Jump to Phase 5 (Plan)
  ↓
Execute → Verify → PR
```

---

## Project Management Integration

Bulkhead offers flexibility in how you track project progress. You can choose your mode during onboarding.

### Modes

| Mode | Description | Artifact Source of Truth |
|------|-------------|-------------------------|
| **Implicit** (Default) | Use Bulkhead artifacts (`project-progress.json`) only. No external tools required. | ✅ Full Tracking |
| **GitHub** | Sync epics and tasks to GitHub Projects/Issues. | 🔸 Status/Tasks from GitHub |
| **Jira/Linear** | (Future) Sync with external enterprise tools. | 🔸 Status/Tasks from Tool |

### Configuration (`.bulkhead/config.yaml`)

```yaml
integrations:
  project_management:
    mode: github  # implicit | github | jira | linear
    project_number: 1
```

### Implicit Mode vs. External Mode

- **Implicit**: `05-plan.json` contains the tasks. Update progress by editing JSON or running workflows.
- **External**: `05-plan.json` generates issues *once*. Then you move cards on the board to update status.

---

## Workflow Commands Reference

| Command | Purpose |
|---------|---------|
| `/spec-modernization` | Initial assessment, refactor vs rebuild |
| `/phase-epic-orchestrator init` | Create project structure |
| `/phase-epic-orchestrator start Pn` | Begin a phase |
| `/phase-epic-orchestrator epic En.n` | Start specific epic |
| `/phase-epic-orchestrator status` | View progress dashboard |
| `/phase-epic-orchestrator next` | Move to next epic |
| `/bulkhead start n` | Start SDLC phase n |
| `/bulkhead continue` | Resume current work |
| `/phase-status` | Quick status check |
| `/phase-checkpoint` | Validate artifacts |
| `/int-pr-manager` | Create/merge PR with confirmation |

---

## Best Practices

1. **Start with assessment** - Always run `/spec-modernization` first
2. **Define clear phases** - Group related epics together
3. **Use MINOR for small changes** - Reduces overhead
4. **Check status daily** - `/phase-status` keeps you oriented
5. **Commit artifacts** - Version control all `.bulkhead/` files
6. **Review at gates** - Phase gates are checkpoints to reflect

---

## Troubleshooting

### "Phase gate blocked"
All epics in the current phase must be complete. Check status and complete pending epics.

### "Cannot find progress"
Ensure `.bulkhead/architecture/project-progress.json` exists. Run `/phase-epic-orchestrator init` if missing.

### "Artifacts missing"
Run `/phase-checkpoint` to see which artifacts are missing, then complete those phases.

### "Wrong branch"
The orchestrator tracks branches. Use `/phase-epic-orchestrator epic En.n` to switch context.
