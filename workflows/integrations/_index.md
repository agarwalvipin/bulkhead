---
description: External tool and service integrations
---

# Integration Workflows

Workflows that connect Bulkhead to external tools and services.

## Workflows

| Workflow | Command | Purpose |
|----------|---------|---------|
| [github-project](github-project.md) | `/github-project` | Create/manage GitHub Projects, Epics, Stories |
| [pr-manager](pr-manager.md) | `/pr-manager` | Create PRs, manage merge with user confirmation |
| [changelog](changelog.md) | `/changelog` | Update CHANGELOG.md and version bumps |
| [feedback-loop](feedback-loop.md) | `/feedback-loop` | Capture learnings and update governance docs |

## When to Use

- **After Phase 5**: Create GitHub issues from plan → `/github-project`
- **After Phase 7**: Create PR → `/pr-manager`
- **After PR merge**: Update changelog → `/changelog`
- **After any phase**: Capture learnings → `/feedback-loop`

## Integration Flow

```
Phase 5 Plan → /github-project (create issues)
                     ↓
Phase 6-7 Execute & Verify
                     ↓
            /pr-manager (create PR)
                     ↓
            /changelog (update version)
                     ↓
            /feedback-loop (capture learnings)
```
