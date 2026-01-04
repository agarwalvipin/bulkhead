# New Feature Development Guide

Complete 8-phase governance flow for standard feature development, from request to deployment.

---

## Quick Start
```bash
# 1. Start Standard Flow
/bulkhead start

# 2. Planning
/phase-epic-orchestrator start P1
/int-github-project create-epic "New Feature"

# 3. Execution
/phase-6-execute
```

---

## Workflow Steps

### Phase 0-4: Governance Gates
Before writing any code, you must establish viability and safety.

1. **Triage (`/phase-0-triage`)**: Determine if the feature is worth the investment.
   - Output: `00-triage.json` (Classification: MINOR/MAJOR/CRITICAL)
2. **Context (`/phase-1-context`)**: Define the blast radius and dependencies.
   - Output: `01-context.json`
3. **Design (`/phase-2-design`)**: Propose the technical architecture.
   - Output: `02-design.json`
   - **Gate**: `/architect-review`
4. **Security (`/phase-3-security`)**: Threat modeling.
   - Output: `03-security.json`
   - **Gate**: `/security-architect`
5. **Decision (`/phase-4-decision`)**: Human approval to proceed.
   - Output: `04-decision-record.md`

### Phase 5: Planning
Once approved, break down the work.

- Run `/phase-5-plan` to generate the task list.
- Use `/int-github-project` to sync Epics and Stories to the project board.
- **Checkpoint**: Run `/phase-checkpoint` to ensure all 0-5 artifacts are valid.

### Phase 6: Execution
Time to code.

- Run `/bulkhead continue` to ensure you are on the correct branch.
- Implement the feature.
- Update `06-report.md` with implementation details.

### Phase 7: Verification
Quality assurance before merge.

1. **Test**: Run your test suite.
2. **Verify (`/phase-7-verify`)**: Record test results and coverage.
3. **PR**: Use `/int-pr-manager` to create a Pull Request.
4. **Review**: `/code-review` checks for compliance.
5. **Merge**: Upon approval, merge and run `/int-update-changelog`.

---

## Artifact Checklist
| Phase | Artifact | Verified By |
|-------|----------|-------------|
| 0 | `00-triage.json` | Triage Bot |
| 1 | `01-context.json` | Architect |
| 2 | `02-design.json` | Architect |
| 3 | `03-security.json` | Security Lead |
| 4 | `04-decision-record.md` | Product Owner |
| 5 | `05-plan.json` | Project Manager |
| 6 | `06-report.md` | Developer |
| 7 | `07-verify.json` | CI/CD |
