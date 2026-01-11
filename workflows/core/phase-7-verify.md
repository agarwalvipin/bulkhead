---
description: Phase 7 Verification (Quality Gate).
---

# Phase 7: Verification

**Goal:** Verify that the implementation matches the Plan and Design.

## Protocol

### 0. Load Testing Practices

// turbo
```bash
# Load testing strategies for verification
# Relevant skill:
# - practices/testing.md - Unit, integration, E2E testing patterns

echo "✅ Loading testing practices for verification..."

# This skill provides:
# - Testing pyramid guidance
# - Coverage targets
# - Test organization patterns
# - Common testing anti-patterns
```

### 1. Verification
Run the acceptance criteria defined in `05-plan.json`.
- **Automated Tests**: Run `npm test`, `pytest`, etc.
- **Manual Verification**: Check UI, formatting, etc.

### 2. Execution (Double-Write)
Generate the following artifact:

#### A. Human-Readable: `.bulkhead/architecture/07-verify.md`
```markdown
# Phase 7: Verification Report

## Status
- **Result**: PASSED / FAILED
- **Verified By**: [Agent Name / User Name]

## Evidence
- [x] Test Suite: 45/45 Passed
- [x] Linting: Passed
- [x] Manual Check: Login works

## Final Sign-off
Ready for merge/deployment.
```

## Routing

### On FAILED Verification:

| Failure Type | Next Action |
|--------------|-------------|
| **Code Issue** | Return to **Phase 6: Execution** for fixes |
| **Design Issue** | Return to **Phase 2: Design** for architectural review |

---

### On PASSED Verification:

> **⚠️ MANDATORY:** Complete all post-verification steps before marking the task complete.

---

## Post-Verification Workflow

### Step 1: Feedback Loop (MANDATORY)

**Run:** `/int-feedback-loop`

This step ensures:
- Critical issues encountered are documented
- Root causes are identified and recorded
- "Golden Rules" are established to prevent regression
- Governance docs and workspace rules are updated
- Session handoff notes are current

---

### Step 2: GitHub Project Updates (Optional)

**Ask the user:** "Would you like to update GitHub Stories and Epics? (Y/N)"

If user selects **Y**, run `/int-github-project` to:

| Action | Description |
|--------|-------------|
| Close Stories | Mark completed story issues as closed |
| Update Epic | Update epic progress, close if all stories complete |
| Add Comments | Document completion details on issues |

**Commands to execute:**
```bash
# Close completed story issues
gh issue close <STORY_NUMBER> --comment "Completed in Phase 7. Verification: PASSED"

# Update Epic with completion status
gh issue comment <EPIC_NUMBER> --body "Story #<STORY_NUMBER> completed. Progress: X/Y stories done."

# Close Epic if all stories complete
gh issue close <EPIC_NUMBER> --comment "All stories complete. Phase 7 verified."
```

---

### Step 3: Commit, Push & PR (MANDATORY)

**Ask the user:** "Ready to commit, push, and create a PR? (Y/N)"

If user selects **Y**, run `/int-pr-manager create`:

#### 3a. Commit Changes
```bash
git add .
git commit -m "Phase 7: Verification complete

- All acceptance criteria passed
- Feedback loop captured
- Ready for merge"
```

#### 3b. Push to Remote
```bash
git push origin <feature-branch>
```

#### 3c. Create Pull Request
**Run:** `/int-pr-manager create`

This will:
1. Generate PR description from artifacts
2. Prompt user for confirmation
3. Create PR targeting base branch
4. Link to Epic issue (if applicable)

---

## ⚡ Phase 7 Complete: Summary

| Step | Action | Status |
|------|--------|--------|
| 1 | `/int-feedback-loop` | **MANDATORY** |
| 2 | `/int-github-project` (update stories/epics) | **Optional** |
| 3 | `/int-pr-manager create` (commit, push, PR) | **MANDATORY** |

---

### Quick Reference

```
Phase 7 PASSED
    │
    ├─► Step 1: /int-feedback-loop (MANDATORY)
    │       └── Capture learnings, update docs
    │
    ├─► Step 2: Update GitHub? (OPTIONAL)
    │       ├── Y → /int-github-project
    │       │       └── Close stories, update epics
    │       └── N → Skip
    │
    └─► Step 3: /int-pr-manager create (MANDATORY)
            ├── Commit changes
            ├── Push to remote
            └── Create PR
```

---

**Ask the user:** "Verification passed! Let's complete the post-verification workflow:
1. Running feedback loop to capture learnings...
2. Would you like to update GitHub Stories/Epics? (Y/N)
3. Ready to commit, push, and create a PR? (Y/N)"
