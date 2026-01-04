# Daily Developer Workflow Guide

Streamlined routine for efficient contribution.

---

## Quick Start
```bash
# 1. Start Day
/phase-status

# 2. Resume Work (restore context)
/bulkhead continue

# 3. Create/Merge PR
/int-pr-manager
```

---

## 3-Step Information Loop

### 1. Morning Triage (Status)
Start every session by orienting yourself.
- **Command**: `/phase-status`
- **Why**: See what's blocking, what's merged, and where you fit in the current phase.
- **Action**: Check "Recent Activity" for merges that affect your branch.

### 2. Deep Work (Execution)
Maximize flow state.
- **Context Restore**: `/bulkhead continue`
    - Checks `current_phase` file.
    - Checks `project-progress.json`.
    - Checks out your last active branch.
    - Prints the next task from `05-plan.json`.
- **Coding**:
    - Write code.
    - Run tests (`pytest` / `npm test`).
    - Update `06-report.md` as you go.

### 3. End of Day (Sync)
Clean up and communicate.
- **PR Creation**: `/int-pr-manager`
    - Automates standard PR description.
    - Links to GitHub Issue.
    - Requests review.
- **Update Progress**:
    - If task is done: mark it in `05-plan.json` (or move card in GitHub).

---

## Commands Reference
| Command | Alias | Purpose |
|---------|-------|---------|
| `/phase-status` | `status` | Dashboard view |
| `/bulkhead continue` | `resume` | Context switch |
| `/int-pr-manager` | `pr` | GitHub sync |
| `/int-update-changelog` | `log` | Release notes |
