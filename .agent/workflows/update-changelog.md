---
description: Update CHANGELOG.md and commit changes
---

# Update Changelog Workflow

Use this workflow when you've made changes and need to update the changelog before committing.

## Steps

1. **Review uncommitted changes**:
   ```bash
   git status
   git diff --stat
   ```

2. **Determine change type**:
   - **PATCH** (x.x.X): Bug fixes, typos, minor corrections
   - **MINOR** (x.X.0): New features, backwards-compatible changes
   - **MAJOR** (X.0.0): Breaking changes

3. **Update CHANGELOG.md**:
   - Add entry under current `[Unreleased]` or version section
   - Use categories: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`
   - Keep entries concise (one line per change)

4. **Commit with conventional commit message**:
   ```bash
   git add -A
   git commit -m "<type>: <description>"
   ```
   
   Types: `feat`, `fix`, `docs`, `refactor`, `chore`, `test`

5. **If releasing a new version**, also update `VERSION` file.

## Example

For a new feature:
```markdown
### Added
- New widget for dashboard visualization
```

Commit:
```bash
git add -A && git commit -m "feat: add dashboard widget"
```
