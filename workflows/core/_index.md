---
description: Core 8-phase SDLC governance workflows
---

# Core SDLC Workflows

The 8-phase governance framework for any code change.

## Entry Point
Start with `/bulkhead` to get guided through these phases, or invoke directly:

## Workflows

| Workflow | Command | Purpose |
|----------|---------|---------|
| [phase-0-triage](phase-0-triage.md) | `/phase-0-triage` | Classify risk (MAJOR/MINOR) |
| [phase-1-context](phase-1-context.md) | `/phase-1-context` | Gather requirements |
| [phase-2-design](phase-2-design.md) | `/phase-2-design` | Architecture decisions |
| [phase-3-security](phase-3-security.md) | `/phase-3-security` | Threat modeling |
| [phase-4-decision](phase-4-decision.md) | `/phase-4-decision` | Human approval gate ⚠️ |
| [phase-5-plan](phase-5-plan.md) | `/phase-5-plan` | Task breakdown |
| [phase-6-execute](phase-6-execute.md) | `/phase-6-execute` | Implementation |
| [phase-7-verify](phase-7-verify.md) | `/phase-7-verify` | Verification |

## Utilities

| Workflow | Command | Purpose |
|----------|---------|---------|
| [phase-checkpoint](phase-checkpoint.md) | `/phase-checkpoint` | Artifact validation gate |
| [phase-status](phase-status.md) | `/phase-status` | Read-only status dashboard |

## Flow

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 (🔒) → Phase 5 → Phase 6 → Phase 7
           ↑                                                              ↓
           └──────────────── (MINOR fast-track) ←─────────────────────────┘
```
