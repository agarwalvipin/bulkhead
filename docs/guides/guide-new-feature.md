# New Feature Development Guide

Complete 8-phase governance flow for standard feature development, from request to deployment.

---

## Quick Start

```bash
# Just start here - the orchestrator handles everything
/bulkhead
```

The smart orchestrator will detect your project state and guide you through the appropriate phase.

---

## Workflow Steps

### Phase 0-4: Governance Gates
Before writing any code, you must establish viability and safety.

1. **Start Project**:
   - Run `/bulkhead`
   - Select **[1] Start new SDLC workflow** (if starting fresh)
   - Or **[1] Continue to Phase <N+1>** (if work in progress)

2. **Follow the Flow**:
   - **Triage**: Determine investment worth (Output: `00-triage.json`)
   - **Context**: Define blast radius (Output: `01-context.json`)
   - **Design**: Propose architecture (Output: `02-design.json`)
   - **Security**: Threat modeling (Output: `03-security.json`)
   - **Decision**: Human approval gate (Output: `04-decision.md`)

> **Pro Tip**: After completing each phase artifact, just type `/bulkhead` again. It validates your work and routes you to the next step automatically.

### Phase 5: Planning
Once approved, break down the work.

- Run `/bulkhead` to generate the task list
- Select **[6] GitHub project** to sync Epics/Stories if needed
- **Checkpoint**: The orchestrator validates all 0-5 artifacts before execution

### Phase 6: Execution
Time to code.

- Run `/bulkhead` and select **[1] Continue** to ensure you are on the correct branch
- Implement the feature
- Update `06-report.md` with implementation details

### Phase 7: Verification
Quality assurance before merge.

1. **Test**: Run your test suite
2. **Verify**: Record test results in `07-verify.md`
3. **Finish**: Run `/bulkhead` and you will see the **Post-Completion Menu**:
   - Select **[1] Create/manage PR**
   - Select **[2] Update changelog**

---

## Artifact Checklist
| Phase | Artifact | Verified By |
|-------|----------|-------------|
| 0 | `00-triage.json` | Triage Bot |
| 1 | `01-context.json` | Architect |
| 2 | `02-design.json` | Architect |
| 3 | `03-security.json` | Security Lead |
| 4 | `04-decision.md` | Product Owner |
| 5 | `05-plan.json` | Project Manager |
| 6 | `06-report.md` | Developer |
| 7 | `07-verify.md` | CI/CD |
