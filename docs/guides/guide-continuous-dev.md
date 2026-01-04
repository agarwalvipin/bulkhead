# Daily Developer Workflow Guide

Streamlined routine for efficient contribution.

---

## Quick Start

```bash
# Start your day - check status
/bulkhead status
# Or run /bulkhead and select [2] View status dashboard

# Resume work on your current task
/bulkhead continue
# Or run /bulkhead and select [1] Continue to Phase <N+1>
```

---

## 3-Step Information Loop

### 1. Morning Triage (Status)
Start every session by orienting yourself.

```bash
/bulkhead status
```

See what's blocking, what's merged, and where you fit in the current phase. Check "Recent Activity" for merges that affect your branch.

### 2. Deep Work (Execution)
Maximize flow state.

```bash
/bulkhead continue
```

This will:
- Check your `current_phase` file
- Check `project-progress.json`
- Check out your last active branch
- Print the next task from `05-plan.json`

Then:
- Write code
- Run tests (`pytest` / `npm test`)
- Update `06-report.md` as you go

### 3. End of Day (Sync)
Clean up and communicate.

```bash
/bulkhead
```

If you are in the **Mid-SDLC Menu**, select **[6] GitHub project** to sync status.

If you have finished Phase 7, you will see the **Post-Completion Menu**:
- Select **[1] Create/manage PR**
- Select **[2] Update changelog**

---

## Commands Reference
> **Pro Tip**: You can access everything via `/bulkhead`, but these shortcuts are faster:

| Command | Purpose |
|---------|---------|
| `/bulkhead` | Smart menu with context-aware options |
| `/bulkhead status` | Dashboard view |
| `/bulkhead continue` | Context switch / resume work |
