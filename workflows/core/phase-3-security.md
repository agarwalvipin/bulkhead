---
description: Phase 3 Security (Threat Modeling).
---

# Phase 3: Security

**Goal:** Identify and mitigate security risks *before* code is written.

## Protocol

### 0. Load Security Practices

// turbo
```bash
# Load security best practices for threat modeling
# Relevant skill:
# - practices/security.md - OWASP Top 10, auth patterns, secrets management

echo "🔒 Loading security practices for threat modeling..."

# This skill provides:
# - OWASP Top 10 quick reference
# - Authentication best practices
# - Secrets management patterns
# - Input validation strategies
```

### 1. Threat Modeling (STRIDE)
Analyze the `02-design.md` against the STRIDE model:
- **S**poofing: Can someone impersonate a user?
- **T**ampering: Can data be altered in transit/rest?
- **R**epudiation: Can actions be denied?
- **I**nformation Disclosure: Is sensitive data exposed?
- **D**enial of Service: Can the resource be exhausted?
- **E**levation of Privilege: Can a user gain admin rights?

### 2. Risk Assessment
Assign a risk level (LOW, MEDIUM, HIGH, CRITICAL) based on likelihood and impact.

### 3. Execution (Rigor-Conditional)

#### A. Human-Readable (ALWAYS): `.bulkhead/architecture/03-security.md`
```markdown
# Phase 3: Security Report

## Threat Model (STRIDE)
- **Spoofing**: Mitigated by JWT verification.
- **Tampering**: Mitigated by TLS.

## Risk Assessment
- **Score**: LOW
- **Criticality**: NON-BLOCKING

## Checklist
- [x] No secrets in code
- [x] Input validation defined
- [x] Auth checks on all endpoints
```

#### B. Machine-Enforceable (standard/maximum only): `.bulkhead/architecture/03-security.json`

> **Skip if `RIGOR=sandbox`**

*Validates against `schemas/security-report.schema.json`*
```json
{
    "phase": "security",
    "risk_score": "LOW",
    "threat_model": [
        {
            "threat": "SQL Injection",
            "mitigation": "Use ORM/Prepared Statements",
            "status": "MITIGATED"
        }
    ],
    "auth_review": {
        "new_permissions": false,
        "sensitive_data_exposure": false
    }
}
```

## Routing

> **⚠️ RE-APPROVAL REQUIRED ON EVERY ITERATION**
> 
> If this phase is being re-run (e.g., after a failed Phase 7 verification or security revision), 
> **previous approvals are NOT valid**. You MUST obtain fresh user approval.

### User Approval Gate

Before proceeding to Phase 4, present the security assessment to the user and ask:

```
🔒 Phase 3: Security Review

Threat Model Analysis Complete:
- Risk Score: [LOW/MEDIUM/HIGH/CRITICAL]
- Threats Identified: [Count]
- Mitigations Defined: [Count]
- Unmitigated Risks: [Count]

This is iteration #[N] of the security phase.
[If N > 1: Previous approval has been invalidated due to re-iteration.]

Do you approve this security assessment? (Y/N/Request Changes)
```

| User Response | Action |
|---------------|--------|
| **Y (Approve)** | Proceed to **Phase 4: Decision** |
| **N (Reject)** | Revise security plan based on feedback, re-run Phase 3 |
| **Request Changes** | Incorporate feedback, update artifacts, ask for approval again |

---

**IMPORTANT**: Never assume a previous security approval carries over. Each iteration is a fresh review.
