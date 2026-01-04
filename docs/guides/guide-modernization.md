# Legacy Modernization Guide

Comprehensive flow for analyzing, refactoring, or rebuilding legacy systems.

---

## Quick Start

```bash
# Start the modernization workflow
/bulkhead
```

If your project is not initialized, you will see the **Start Menu**.
Select **[2] Plan large modernization project**.

---

## Workflow Steps

### Phase 1: Analysis
Before making any changes, understand the current state.

1. **Modernization Analysis**: The workflow scans the codebase and generates `modernization-plan.json`
2. **Decision Matrix**: Evaluates rebuild vs refactor based on tech debt and complexity.

### Phase 2: Execution Paths

#### Path A: Rebuild (Greenfield)
Treat the modernization as a new project.

1. Run `/bulkhead`
2. Select **[1] Start new SDLC workflow**
3. Follow the standard 8-phase SDLC for full replacement of legacy components.

#### Path B: Phased Refactoring (Strangler Fig)
Incrementally replace parts of the system.

1. Run `/bulkhead`
2. If an Epic is active, you will see the **Large Project Menu**:
   - Select **[2] Continue current epic**
   - Or **[3] Start next epic**

### Phase 3: Validation
Ensure parity between old and new systems.

- **Parity Testing**: Run old and new paths in parallel (shadow mode)
- **Cutover**: Switch primary traffic

---

## Key Artifacts
| Artifact | Purpose |
|----------|---------|
| `modernization-plan.json` | Master map of what needs changing |
| `rebuild-scorecard.md` | Justification for chosen approach |
| `refactoring-plan.md` | Step-by-step extraction guide (if refactoring) |
