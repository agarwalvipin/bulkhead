---
description: Systematically capture learnings from a phase and update governance/docs to prevent regression.
---

# Feedback Loop Workflow
**Trigger**: run at the end of every phase (after `/phase-7-verify`) or after resolving a major critical bug.

## 1. Identify Learnings
- [ ] List critical issues encountered (e.g., "PGRST002 due to password chars").
- [ ] Identify the root cause (e.g., "Unsafe secret generation", "Env var precedence").
- [ ] Determine the "Golden Rule" to prevent this (e.g., "All secrets must be alphanumeric").

## 2. Update Governance & Docs
- [ ] **Implementation Plan**:
    - Update `docs/implementation_plan.md` -> "Session Handoff Notes".
    - Add new findings to "Critical Configuration Rules" section in `docs/implementation_plan.md`.
- [ ] **Workspace Rules**:
    - Review `.agent/rules/workspace-rules.md` and `global-rules.md`.
    - **Propose New Rules**: Identify if a recurring issue (e.g., module import errors, dependency conflicts) requires a new enforcement rule.
        - *Example Proposal*: "To prevent import errors, always use `uv run` with `PYTHONPATH=$(pwd)` for execution."
    - **Implement Rule**: Add the proposed rule (e.g., `PYTHON-1`, `INFRA-X`) to the relevant rules file.
    - **User Approval**: Present the proposed rule to the user and ask: "I've identified a recurring issue. Would you like to add the following rule to prevent this in the future?"
- [ ] **Workflows**:
    - Update relevant workflows in `.agent/workflows/` if a step was missing or incorrect.

## 3. Fix Source of Truth (Automation)
- [ ] Check if scripts (e.g., `rotate-secrets.sh`, `setup-env.sh`) caused the issue.
- [ ] Patch scripts to enforce the new rule (e.g., "Use alphanumeric generation").

## 4. Commit Knowledge
- [ ] Commit documentation updates.
    ```bash
    git add docs/ .agent/rules/
    git commit -m "docs: update knowledge base from Phase X learnings"
    ```
