# Parallel Work Management Guide

Orchestrating multiple teams and features simultaneously without collisions.

---

## Quick Start
```bash
# 1. Feature Team A (isolate)
/phase-epic-orchestrator epic E1.1

# 2. Feature Team B (isolate)
/phase-epic-orchestrator epic E1.2

# 3. Security Audit (parallel)
/security-architect
```

---

## Strategies

### Isolation Strategy
Bulkhead uses **Phased Isolation** to prevent collisions.
- **Rule**: Each Epic runs in its own branch `feature/pX-epic-title`.
- **Enforcement**: Artifacts are namespaced (`phases/P1/E1.1/`).
- **Benefit**: Team A can be in Phase 6 (Execute) while Team B is still in Phase 2 (Design).

### Merge Strategy
Collisions happen at the Phase Gate.
1. **Continuous Integration**: Merge to `develop` frequently (daily).
2. **Feature Flags**: Use flags for incomplete features (don't break build).
3. **Changelog**: `/int-update-changelog` handles concurrent entries automatically.

### Security Overlay
Security audits run orthogonal to features.
- **Workflow**:
    1. Auditor runs `/security-architect` on `develop`.
    2. Identifies vulnerabilities.
    3. Injects blocking "CRITICAL" issues into `project-progress.json`.
    4. Blocks Phase 4 Gate for all ongoing Epics until resolved.

---

## Automation
- **Conflict Detection**: CI pipeline runs `/code-review` on every PR.
- **Dependency Guard**: `01-context.json` declares dependencies upfront. If E1.1 depends on E1.2, the orchestrator warns you.
