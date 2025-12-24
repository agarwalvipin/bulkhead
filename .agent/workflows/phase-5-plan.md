---
description: Phase 5 Plan (Orchestration).
---

# Phase 5: Plan

**Goal:** Convert the approved Design into a deterministic, step-by-step execution plan.

## Protocol

### 1. Task Breakdown
Convert the architecture into granular tasks.
- **Criteria**: Each task should be atomic (one commit), testable, and have clear acceptance criteria.
- **Order**: Dependencies first (e.g., Database migrations before API endpoints).

### 2. Execution (Double-Write)
Generate the following artifacts in `architecture/`:

#### A. Human-Readable: `architecture/05-plan.md`
```markdown
# Phase 5: Execution Plan

## Milestones
### Epic 1: Database Setup
- [ ] Create User migration table
- [ ] Add `email` and `password_hash` columns

### Epic 2: API Implementation
- [ ] Implement `POST /register`
- [ ] Implement `POST /login`
```

#### B. Machine-Enforceable: `architecture/05-plan.json`
*Must validate against `schemas/execution-plan.schema.json`*
```json
{
  "version": "1.0",
  "strategy": "REFACTOR",
  "milestone_title": "Auth Implementation",
  "epics": [
    {
      "id": "E1",
      "title": "Database",
      "tasks": [
        {
          "title": "Create User Table",
          "type": "migration",
          "context_files": ["src/db/schema.sql"],
          "acceptance_criteria": ["Table 'users' exists", "Has 'email' index"]
        }
      ]
    }
  ]
}
```

## Routing
Proceed to **Phase 6: Execution**.
