---
description: Large-scale project orchestration workflows
---

# Orchestrator Workflows

Workflows for managing multi-phase, multi-epic projects.

## When to Use

- Large codebase modernization (100K+ LOC)
- Multi-month projects with distinct phases
- Teams working on multiple parallel epics
- When you need phase gating between major milestones

## Workflows

| Workflow | Command | Purpose |
|----------|---------|---------|
| [epic-orchestrator](epic-orchestrator.md) | `/epic-orchestrator` | Manage multiple epics per phase with nested governance |
| [modernization](modernization.md) | `/modernization` | Evaluate REFACTOR vs REBUILD, produce phased plan |

## Relationship

```
/modernization → Produces plan → /epic-orchestrator → Runs full SDLC per epic
```

Both orchestrators invoke the core SDLC phases (`/core/phase-*`) for each unit of work.
