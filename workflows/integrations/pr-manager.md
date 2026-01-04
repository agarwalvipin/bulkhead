---
description: Manages PR creation and merge with user confirmation prompts. Never auto-merges without user consent.
prerequisites: [core/phase-7-verify complete]
routes_to:
  - integrations/changelog
outputs:
  human: PR created and merged with user confirmation
---

# PR Manager Workflow

**Goal:** Create PRs and merge changes with explicit user confirmation at each step.

---

## Philosophy

- **AI Proposes, Human Decides**: Always prompt for confirmation
- **Transparency**: Show exactly what will happen
- **Reversibility**: User can decline at any step

---

## Usage

```bash
/pr-manager create    # Create PR with confirmation
/pr-manager merge     # Merge PR with confirmation
/pr-manager status    # Check open PRs
```

---

## Workflow: Create PR

### Step 1: Validate Prerequisites

// turbo
```bash
# Check Phase 7 verification passed
if [ -f .bulkhead/architecture/07-verify.json ]; then
  STATUS=$(cat .bulkhead/architecture/07-verify.json | jq -r '.status')
  echo "Phase 7 status: $STATUS"
fi

# Check current branch
git branch --show-current
```

### Step 2: Generate PR Description

Build structured PR description from artifacts:

```markdown
## Summary
[From 01-context.md summary]

## Changes
[From git diff --stat]

## Testing
[From 07-verify.md results]

## Governance
- Classification: [MINOR/MAJOR/CRITICAL]
- Phase 4 Decision: [Approved/Auto-bypassed]
- Security Review: [Passed/Required review]

## Artifacts
- 📋 [Context](link)
- 🏗️ [Design](link)
- 🔒 [Security](link)
- ✅ [Verification](link)
```

### Step 3: Prompt User

```
📝 Ready to Create Pull Request

Branch: feature/my-feature → main
Title: [Generated title]
Description: [preview]

Changes:
- 5 files modified
- +150 lines / -23 lines

Create this PR? [y/n/edit]
```

**Options:**
- `y` → Create PR
- `n` → Cancel
- `edit` → Open PR description in editor

### Step 4: Create PR

// turbo
```bash
# Create PR using GitHub CLI
gh pr create \
  --base main \
  --title "[Generated Title]" \
  --body-file .bulkhead/pr-description.md
```

### Step 5: Report

```
✅ PR Created Successfully

PR #123: [Title]
URL: https://github.com/user/repo/pull/123

Next: Wait for review, then run `/pr-manager merge`
```

---

## Workflow: Merge PR

### Step 1: Check PR Status

// turbo
```bash
# Get PR status
gh pr status
gh pr checks
```

### Step 2: Validate Merge Conditions

| Check | Status |
|-------|--------|
| CI Passed | Required |
| Reviews Approved | Required (if configured) |
| No Conflicts | Required |
| Phase 7 Complete | Required |

### Step 3: Prompt User

```
🔀 Ready to Merge Pull Request

PR #123: [Title]
Status: ✅ All checks passed
Reviews: 2 approved

This will:
1. Update CHANGELOG.md
2. Merge to main
3. Delete feature branch
4. Tag release (if configured)

Proceed with merge? [y/n]
```

### Step 4: Execute Merge

If user confirms:

// turbo
```bash
# Update changelog
# (Invoke /integrations/changelog)

# Merge PR
gh pr merge --squash --delete-branch

# Confirm
echo "✅ PR merged successfully"
```

### Step 5: Post-Merge Cleanup

1. Run `/integrations/changelog` if not already done
2. Tag release if rigor profile requires
3. Archive artifacts (move to `.bulkhead/archive/`)
4. Reset `current_phase` marker

```
✅ Merge Complete!

Merged: PR #123
Commit: abc123
Branch: main

Changelog updated: v1.2.3
Next: Start new work with `/bulkhead start 0`
```

---

## Workflow: Status

// turbo
```bash
# Show all open PRs for this repo
gh pr list --state open

# Show current branch PR if exists
gh pr view --json title,state,reviews,checks
```

Output:
```
📋 Open Pull Requests

#123 - Feature A (ready to merge)
  ✅ CI Passed | ✅ 2 Reviews | ✅ No Conflicts

#124 - Feature B (needs work)
  ❌ CI Failed | ⏳ 0 Reviews | ✅ No Conflicts

Current branch: feature/my-feature
Associated PR: #123
```

---

## Integration with Governance

### Rigor-Based Behavior

| Rigor | PR Creation | Merge |
|-------|------------|-------|
| Sandbox | Prompt | Prompt |
| Standard | Prompt | Prompt |
| Maximum | Prompt + Review Required | Prompt + Multiple Reviews |

### MINOR Classification

For MINOR changes that bypassed Phase 4:
- Still prompt for PR creation
- Still prompt for merge
- Note in PR: "Auto-approved (MINOR classification)"

---

## Error Handling

| Error | Action |
|-------|--------|
| No feature branch | Prompt to create branch first |
| PR already exists | Show existing PR, offer to update |
| CI fails | Block merge, link to failing checks |
| Merge conflicts | Block merge, show conflict files |
| User declines | Cancel gracefully, preserve state |

---

## Configuration

In `.bulkhead/config.yaml`:

```yaml
pr_manager:
  auto_changelog: true      # Run changelog on merge
  delete_branch: true       # Delete after merge
  merge_strategy: squash    # squash|merge|rebase
  require_reviews: 1        # Minimum reviews (0 to skip)
```
