---
description: Phase 4 Governance (Decision Gate).
---

# Phase 4: Decision

**Goal:** Authorize the Design and Security plan. This is the **Human Firewall**.

## Protocol

### 1. Presentation
The AI presents the following to the User:
- **Design**: `02-design.md` (Solutions & Trade-offs)
- **Security**: `03-security.md` (Risks & Mitigations)
- **Recommendation**: Whether to Proceed, Refactor, or Abort.

### 2. Human Review
The User must explicitly approve the plan.
- **Review**: Check logic, security, and alignment with goals.
- **Modify**: Request changes to Design/Security if needed (Backtrack to Phase 2).
- **Sign**: Provide an explicit "signature" string (e.g., "APPROVED-v1").

### 3. Execution (Double-Write)
Generate the following artifacts in `architecture/`:

#### A. Human-Readable: `architecture/04-decision.md`
```markdown
# Phase 4: Decision Record

## Decision
- **Outcome**: APPROVED
- **Date**: 2024-01-01
- **Sign-off**: [User Name]

## Rationale
The design uses standard libraries and mitigates all identified risks.

## Conditions
- Must add a rate limiter as discussed.
```

#### B. Machine-Enforceable: `architecture/04-decision.json`
*Must validate against `schemas/decision-record.schema.json`*
```json
{
    "phase": "decision",
    "decision": "REBUILD", 
    "rationale": "Design looks solid.",
    "human_signature": "APPROVED-VIPIN-2024",
    "date": "2024-01-01"
}
```

## Routing
- **APPROVED/REBUILD/REFACTOR**: Proceed to **Phase 5: Plan**.
- **ABORT**: Stop all work. Archive artifacts.
