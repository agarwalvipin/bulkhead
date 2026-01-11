---
description: Phase 1 Context (Blast Radius).
---

# Phase 1: Context

**Goal:** Identify dependencies, constraints, and define the "Blast Radius" to prevent side effects.

## Protocol

### 1. Repository Scan
Run `ls -R`, `grep`, or use IDE tools to identify:
- **Direct Hits**: Files that *must* change.
- **Dependencies**: Files that import the direct hits.
- **Dependents**: Files imported by the direct hits.
- **Infrastructure**: Docker, K8s, Terraform files relevant to the change.

### 2. Blast Radius Definition
Classify files into permission tiers:
- **Read-Write**: Files you are explicitly authorized to modify.
- **Read-Only**: Context files you need to understand but NOT touch.
- **Forbidden**: Sensitive files (secrets, unrelated logic) that are off-limits.

### 3. Execution (Rigor-Conditional)

#### A. Human-Readable (ALWAYS): `.bulkhead/architecture/01-context.md`
```markdown
# Phase 1: Context

## Blast Radius
### Read-Write (Target)
- `src/controllers/user.ts`
- `src/models/user.ts`

### Read-Only (Context)
- `src/utils/db.ts`
- `package.json`

## Constraints
- Must maintain backward compatibility.
- Cannot change database connection logic.
```

#### B. Machine-Enforceable (standard/maximum only): `.bulkhead/architecture/01-context.json`

> **Skip if `RIGOR=sandbox`**

*Validates against `schemas/context-spec.schema.json`*
```json
{
  "ticket_id": "REQ-123",
  "read_only": ["src/utils/db.ts"],
  "read_write": ["src/controllers/user.ts"],
  "forbidden": [".env", "config/secrets.yaml"]
}
```

## Routing
Proceed to **Phase 2: Design**.
