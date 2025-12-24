---
description: Phase 3 Security (Threat Modeling).
---

# Phase 3: Security

**Goal:** Identify and mitigate security risks *before* code is written.

## Protocol

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

### 3. Execution (Double-Write)
Generate the following artifacts in `architecture/`:

#### A. Human-Readable: `architecture/03-security.md`
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

#### B. Machine-Enforceable: `architecture/03-security.json`
*Must validate against `schemas/security-report.schema.json`*
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
Proceed to **Phase 4: Decision**.
