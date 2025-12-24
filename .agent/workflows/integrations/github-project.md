---
description: Manages GitHub Project, Epics, and Stories for phase-based development. Creates issues, branches, and tracks progress.
---

# GitHub Project Management Workflow

**Goal:** Track all phases, epics, and stories in GitHub Projects with proper issue linking and clean commit history.

> [!IMPORTANT]
> **Base Branch:** Configure your base branch in the workflow (e.g., `main`, `develop`, or a custom branch like `fresh-refactor`).
> All PRs must target your base branch, and all feature branches must be created from it.

> [!NOTE]
> **Automated Documentation Updates**
> AI agents following this workflow will **AUTOMATICALLY** update:
> - `docs/implementation_plan.md` Progress Tracker
> - `docs/implementation_plan.md` Session Handoff Notes
> 
> See `.agent/PROJECT_MANAGEMENT_RULES.md` for details.
> These updates require no user approval - they are mandatory maintenance.

---

## Prerequisites

- `gh` CLI installed and authenticated: `gh auth status`
- Repository has GitHub Projects enabled

---

## Phase 1: Project Setup (One-Time)

### 1.1 Create GitHub Project

```bash
# Set these variables for your project
export OWNER="<your-github-username-or-org>"
export PROJECT_TITLE="<Your Project Modernization>"
export BASE_BRANCH="main"  # or develop, fresh-refactor, etc.

# Create a new project board
gh project create --owner $OWNER --title "$PROJECT_TITLE" --readme "8-phase modernization using Bulkhead framework"

# Note the project number from output (e.g., Project #4)
export PROJECT_NUMBER=4
```

### 1.2 Create Labels

```bash
# Phase labels (customize descriptions for your project)
gh label create "phase-p1" --color "e74c3c" --description "P1: Phase 1"
gh label create "phase-p2" --color "3498db" --description "P2: Phase 2"
gh label create "phase-p3" --color "9b59b6" --description "P3: Phase 3"
gh label create "phase-p4" --color "1abc9c" --description "P4: Phase 4"
gh label create "phase-p5" --color "f39c12" --description "P5: Phase 5"
gh label create "phase-p6" --color "e67e22" --description "P6: Phase 6"
gh label create "phase-p7" --color "27ae60" --description "P7: Phase 7"
gh label create "phase-p8" --color "2c3e50" --description "P8: Phase 8"

# Type labels
gh label create "epic" --color "7f8c8d" --description "Epic issue"
gh label create "story" --color "bdc3c7" --description "Story issue"
gh label create "bulkhead" --color "8e44ad" --description "Bulkhead governance"
```

---

## Phase 2: Epic Creation (Per Phase)

### 2.1 Create Epic Issue

```bash
# Template for creating an Epic
PHASE_ID="p1"
PHASE_NAME="Auth + Config Layer"
PHASE_GOAL="tokensvr starts and serves authenticated requests"

gh issue create \
  --title "Epic: ${PHASE_ID^^} - $PHASE_NAME" \
  --label "epic,phase-$PHASE_ID,bulkhead" \
  --body "## Goal
$PHASE_GOAL

## Scope
- Supabase Auth integration
- Rate limiting middleware
- Token encryption
- Health endpoint

## Bulkhead Artifacts
- \`.bulkhead/architecture/\` (reused across phases, Git tracks evolution)

## Stories
- [ ] #STORY_1
- [ ] #STORY_2
- [ ] #STORY_3

## Success Criteria
- [ ] All test gates pass
- [ ] /phase-checkpoint validates artifacts
- [ ] PR merged to fresh-refactor
"

# Note the Epic issue number (e.g., #25)
export EPIC_NUMBER=25
```

### 2.2 Create Feature Branch

```bash
# Create branch from your base branch
git checkout $BASE_BRANCH
git pull origin $BASE_BRANCH
git checkout -b feature/$PHASE_ID-$(echo $PHASE_NAME | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

# Example: feature/p1-auth-config-layer
```

### 2.3 Update Progress Tracker (MANDATORY)

```bash
# Open docs/implementation_plan.md and update the Progress Tracker table:
# - Change status from ⬜ Not Started to 🟡 In Progress
# - Add Epic number
# - Add branch name

# Commit the update
git add docs/implementation_plan.md
git commit -m "docs: Update Progress Tracker for phase $PHASE_ID

- Status: In Progress
- Epic: #$EPIC_NUMBER
- Branch: feature/$PHASE_ID"
```

---

## Phase 3: Story Creation (Per Task)

### 3.1 Create Story Issues

```bash
# Template for Stories
create_story() {
  local TASK_ID=$1
  local TASK_TITLE=$2
  local TASK_FILES=$3
  local ACCEPTANCE=$4
  
  gh issue create \
    --title "Story: $TASK_ID - $TASK_TITLE" \
    --label "story,phase-$PHASE_ID" \
    --body "## Task
$TASK_TITLE

## Files
$TASK_FILES

## Acceptance Criteria
$ACCEPTANCE

## Part of Epic
Closes #$EPIC_NUMBER

## Commit Message Template
\`\`\`
$TASK_ID: $TASK_TITLE

- Implementation details
- Closes #ISSUE_NUMBER
\`\`\`
"
}

# Example: Create all P1 stories
create_story "P1.1" "Connect to infra Redis" "riskmon/core/config.py" "Redis ping succeeds"
create_story "P1.2" "Supabase Auth integration" "riskmon/auth/supabase_auth.py" "JWT validation works"
create_story "P1.3" "Rate limiting middleware" "riskmon/middlewares/rate_limit.py" "100/min enforced"
create_story "P1.4" "Token encryption" "riskmon/security/token_storage.py" "Encrypt/decrypt roundtrip"
create_story "P1.5" "Health endpoint" "tokensvr.py" "/health returns 200"
```

### 3.2 Add Issues to Project

```bash
# Add all phase issues to project board
gh project item-add $PROJECT_NUMBER --owner $OWNER --url https://github.com/$OWNER/<repo>/issues/$EPIC_NUMBER

# Add each story
for issue in $(gh issue list --label "phase-$PHASE_ID,story" --json number -q '.[].number'); do
  gh project item-add $PROJECT_NUMBER --owner $OWNER --url https://github.com/$OWNER/<repo>/issues/$issue
done
```

---

## Phase 4: Story Execution (Per Story)

### 4.1 Work on Story

```bash
# Get story details
STORY_NUMBER=26
gh issue view $STORY_NUMBER

# Implement the story
# ... code changes ...

# Commit with story reference
git add .
git commit -m "P1.1: Connect to infra Redis

- Added Redis connection to config
- Tested ping on infra-network
- Closes #$STORY_NUMBER"
```

### 4.2 Update Story Status

```bash
# Move to "In Progress" on project board
gh issue edit $STORY_NUMBER --add-label "in-progress"

# After completion, close the issue
gh issue close $STORY_NUMBER --comment "Completed in commit $(git rev-parse --short HEAD)"
```

---

## Phase 5: Phase Completion

### 5.1 Run Bulkhead Verification

```bash
# Run phase-checkpoint workflow
/phase-checkpoint

# Ensure all artifacts exist in .bulkhead/architecture/
```

### 5.2 Create Pull Request

```bash
# Push branch
git push origin feature/$PHASE_ID-*

# Create PR linking to Epic
gh pr create \
  --base $BASE_BRANCH \
  --title "${PHASE_ID^^}: $PHASE_NAME" \
  --body "## Summary
Closes Epic #$EPIC_NUMBER

## Changes
- List of changes

## Test Results
- Test gate: PASSED
- Bulkhead checkpoint: PASSED

## Stories Completed
$(gh issue list --label phase-$PHASE_ID,story --state closed --json number,title -q '.[] | "- #\(.number): \(.title)"')
"
```

### 5.3 After PR Merge

```bash
# Update Epic
gh issue close $EPIC_NUMBER --comment "All stories complete, PR merged"

# Tag release
git checkout $BASE_BRANCH
git pull
git tag -a v2.0.0-$PHASE_ID -m "Phase $PHASE_ID complete"
git push --tags
```

### 5.4 Update Documentation (MANDATORY)

```bash
# Update Progress Tracker in docs/implementation_plan.md:
# - Change status from 🟡 In Progress to ✅ Complete
# - Add PR number and mark Epic as closed
# - Update Session Handoff Notes with what was accomplished

git add docs/implementation_plan.md
git commit -m "docs: Mark phase $PHASE_ID complete in Progress Tracker

- Status: Complete
- Epic #$EPIC_NUMBER: Closed
- PR #<PR_NUMBER>: Merged
- Updated Session Handoff Notes"
```

---

## Quick Reference

### Create Full Phase Setup

```bash
# One-liner to set up a new phase
PHASE_ID="p1"
PHASE_NAME="Auth + Config Layer"

# 1. Create Epic
EPIC=$(gh issue create --title "Epic: ${PHASE_ID^^} - $PHASE_NAME" --label "epic,phase-$PHASE_ID" --json number -q '.number')

# 2. Create branch
git checkout $BASE_BRANCH && git pull && git checkout -b feature/$PHASE_ID

# 3. Create stories (customize per phase)
# ... see Phase 3 above ...

echo "✅ Phase $PHASE_ID setup complete. Epic: #$EPIC, Branch: feature/$PHASE_ID"
```

### Commit Message Format

```
TASK_ID: Short description

- Details of what was done
- Any notable decisions
- Closes #ISSUE_NUMBER
```

**Examples:**
```
P1.1: Connect to infra Redis

- Added REDIS_URL to Pydantic settings
- Tested connection on infra-network
- Closes #26

P1.2: Supabase Auth integration

- Created get_current_user dependency
- Added require_admin decorator
- JWT validation tested
- Closes #27
```

---

## Workflow Integration

This workflow integrates with Bulkhead phases:

```
/phase-0-triage  → Creates Epic issue
/phase-5-plan    → Creates Story issues from plan
/phase-6-execute → Commit per story
/phase-7-verify  → Close stories, prepare PR
```

---

## Automation Hooks (Future)

Consider automating with GitHub Actions:
- Auto-create Story issues from `/phase-5-plan` output
- Auto-close stories when commits reference them
- Auto-update project board status
