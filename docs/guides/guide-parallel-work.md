# Parallel Work Management Guide

Orchestrating multiple teams and features simultaneously without collisions.

---

## Quick Start

```bash
# Each team uses the same entry point
/bulkhead
```

The orchestrator detects your specific branch/state and isolates your work automatically.

---

## Strategies

### Isolation Strategy
Bulkhead uses **Phased Isolation** to prevent collisions.

- **Rule**: Each Epic runs in its own branch `feature/pX-epic-title`
- **Enforcement**: Artifacts are namespaced (`phases/P1/E1.1/`)
- **Benefit**: Team A can be in Phase 6 (Execute) while Team B is still in Phase 2 (Design)

### Merge Strategy
Collisions happen at the Phase Gate.

1. **Continuous Integration**: Merge to `develop` frequently (daily)
2. **Feature Flags**: Use flags for incomplete features (don't break build)
3. **Changelog**: Run `/bulkhead` > Select **[2] Update changelog** (Post-Completion Menu) to handle concurrent entries automatically

### Security Overlay
Security audits run orthogonal to features.

1. Auditor runs `/bulkhead` on `develop` branch
2. Select **[1] Start new SDLC workflow** (Initiate specific security audit cycle)
3. Identifies vulnerabilities
4. Injects blocking "CRITICAL" issues into `project-progress.json`
5. Blocks Phase 4 Gate for all ongoing Epics until resolved

---

## Automation
- **Conflict Detection**: CI pipeline runs code review on every PR
- **Dependency Guard**: `01-context.json` declares dependencies upfront. If E1.1 depends on E1.2, the orchestrator warns you
