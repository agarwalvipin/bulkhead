---
description: Phase 6 Execution (Coding).
---

# Phase 6: Execution

**Goal:** Execute the plan deterministically. Coding happens here.

## Protocol

### 0. Load Implementation Skills

// turbo
```bash
# Auto-load language and framework skills based on project
/bulkhead skills

# Common skills that may load:
# - languages/python.md - If pyproject.toml detected
# - frameworks/fastapi.md - If fastapi in dependencies
# - languages/typescript.md - If tsconfig.json detected
# - frameworks/nextjs.md - If next.config.js detected

echo "💻 Auto-loaded implementation skills based on your project..."

# Skills provide:
# - Language-specific patterns and idioms
# - Framework conventions and best practices
# - Code examples for common scenarios
# - Anti-patterns to avoid
```

### 1. Initialization
- Reading `.bulkhead/architecture/05-plan.json`.
- Restricting context to `.bulkhead/architecture/01-context.json` (Read-Write files).

### 2. Execution Loop
For each task in `05-plan.json`:
1.  **Read Task**: Understand the goal and acceptance criteria.
2.  **Implement**: Write the code.
3.  **Verify**: Run tests locally.
4.  **BitCommit**: Commit the code with the specific Task ID prefix (e.g., `feat(auth): [T-1] Add user schema`).

### 3. Error Handling
- **If a task fails**:
    - **Retry**: Attempt to fix using available context.
    - **Escalate**: If blocked by missing context, pause and request **Phase 1 Re-evaluation**.
    - **Design Flaw**: If implementation reveals a design flaw, pause and request **Phase 2 Re-design**.

### 4. Reporting
Generate the following artifact manually or automatically:

#### A. Execution Report: `.bulkhead/architecture/06-report.md`
```markdown
# Phase 6: Execution Report

## Completed Tasks
- [x] T-1: Create User Table (Commit: ab12c)
- [x] T-2: Add Register Route (Commit: de34f)

## Blockers Encountered
- None.
```

## Routing
Proceed to **Phase 7: Verification**.
