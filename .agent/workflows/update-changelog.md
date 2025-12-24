---
description: Update CHANGELOG.md and commit changes
---

# Update Changelog Workflow

Use this workflow when you've made changes and need to update the changelog and optionally bump the version.

## Steps

### 1. Read Current State

```bash
# Get current version
cat VERSION

# Review uncommitted changes
git status
git diff --stat
```

### 2. Analyze Changes and Propose Version

Based on the changes, determine the appropriate version bump:

| Change Type | Bump | Example |
|-------------|------|---------|
| Bug fixes, typos | PATCH | 1.0.0 → 1.0.1 |
| New features (backwards compatible) | MINOR | 1.0.0 → 1.1.0 |
| Breaking changes | MAJOR | 1.0.0 → 2.0.0 |

**Propose a default version** to the user based on the nature of changes detected.

### 3. Prompt User for Version Override

Present the proposed version and ask:

> **Proposed version: `X.Y.Z`**
> 
> Is this correct, or would you like to override?
> - Press Enter to accept
> - Or specify a different version (e.g., `1.2.0`)

### 4. Update VERSION File

If version is being bumped:
```bash
echo "X.Y.Z" > VERSION
```

### 5. Update CHANGELOG.md

Add or update entries under the version section. Use these categories:
- `Added` - New features
- `Changed` - Changes to existing functionality  
- `Deprecated` - Features marked for removal
- `Removed` - Removed features
- `Fixed` - Bug fixes
- `Security` - Security improvements

Format:
```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- Description of new feature
```

### 6. Update README.md

#### 6a. Update Version Badge
```bash
sed -i 's/version-[0-9]*\.[0-9]*\.[0-9]*/version-X.Y.Z/' README.md
```

#### 6b. Review README Content
Check if any documentation needs updating based on the changes:
- Project structure diagrams
- Installation/setup instructions
- Feature descriptions
- Path references
- Usage examples

If changes affect documented behavior, update the relevant README sections.

### 7. Commit Changes

// turbo
```bash
git add VERSION CHANGELOG.md README.md
git commit -m "chore(release): bump version to X.Y.Z"
```

### 8. Optional: Create Git Tag

Ask user if they want to tag the release:

```bash
git tag -a vX.Y.Z -m "Release vX.Y.Z"
```

## Example Interaction

```
Current version: 1.0.0
Changes detected: New feature (conflict detection)

Proposed version: 1.1.0

Is this correct? [Y/n/override]: 
> Y

Updating VERSION to 1.1.0...
Updating CHANGELOG.md...
Committing: chore(release): bump version to 1.1.0

Create git tag v1.1.0? [y/N]:
> n

Done!
```
