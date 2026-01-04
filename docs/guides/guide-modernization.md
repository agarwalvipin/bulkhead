# Legacy Modernization Guide

Comprehensive flow for analyzing, refactoring, or rebuilding legacy systems.

---

## Quick Start
```bash
# 1. Analyze existing system
/spec-modernization

# 2. Decide path
/rebuild-vs-refactor

# 3. Execute choice
# Path A: Rebuild
/bulkhead start

# Path B: Refactor
/refactoring-architect
```

---

## Workflow Steps

### Phase 1: Analysis
Before making any changes, understand the current state.
1. **Spec Modernization**: Run `/spec-modernization` to scan the codebase.
   - Generates: `modernization-plan.json`
2. **Decision Matrix**: Run `/rebuild-vs-refactor`.
   - Input: Metrics (Tech Debt, Complexity, Test Coverage)
   - Output: Scorecard (Rebuild vs Refactor)

### Phase 2: Execution Paths

#### Path A: Rebuild (Greenfields)
Treat the modernization as a new project.
- **Command**: `/bulkhead start`
- **Process**: Follow standard SDLC (Scenario 1).
- **Goal**: Full replacement of legacy component.

#### Path B: Phased Refactoring (Strangler Fig)
Incrementally replace parts of the system.
- **Command**: `/refactoring-architect`
- **Process**:
    1. Identify seams/boundaries.
    2. Extract component to separate module/service.
    3. create `01-context.json` for the new module.
    4. Execute standard SDLC for the new module.
    5. Route traffic to new module.
    6. Delete old code.

### Phase 3: Validation
Ensure parity between old and new systems.
- **Parity Testing**: Run old and new paths in parallel (shadow mode).
- **Cutover**: Switch primary traffic.

---

## Key Artifacts
- `modernization-plan.json`: The master map of what needs changing.
- `rebuild-scorecard.md`: The justification for the chosen approach.
- `refactoring-plan.md`: Step-by-step extraction guide (if refactoring).
