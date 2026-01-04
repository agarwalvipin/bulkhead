---
description: Specialized single-purpose workflows
---

# Specialized Workflows

Focused workflows for specific tasks outside the main SDLC flow.

## Workflows

| Workflow | Command | Purpose |
|----------|---------|---------|
| [code-review](code-review.md) | `/review` | Architecture, code, or security reviews |
| [refactoring-executor](refactoring-executor.md) | `/refactor-execute` | Execute phased refactoring plan |
| [promote](promote.md) | `/promote` | Upgrade rigor from sandbox to standard |

## Usage Notes

### Code Review
Supports subcommands:
- `/review architecture` - Evaluate architectural options
- `/review code` - Review PR/diff for correctness
- `/review security` - Deep-dive threat modeling

### Refactoring Executor
Requires a modernization plan from `/orchestrators/modernization` with decision = `REFACTOR`.

### Promote
Use when ready to merge sandbox work to protected branches (main, develop).
