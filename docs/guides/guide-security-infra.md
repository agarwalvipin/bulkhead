# Security-First Infrastructure Guide

Strict protocol for infrastructure and security-critical changes.

---

## Quick Start
```bash
# 1. Start Security Phase
/phase-3-security

# 2. Run Threat Model
/security-architect

# 3. Get Approval
/phase-4-decision
```

---

## Critical Rules (INFRA-1 to INFRA-5)
1. **INFRA-1 (No Defaults)**: Explicitly declare all ports, creds, and nets.
2. **INFRA-2 (Threat Model)**: `03-security.json` is MANDATORY.
3. **INFRA-3 (Decision Record)**: No provisioning without signed `04-decision-record.md`.
4. **INFRA-4 (Secrets)**: Never inline secrets. Use a vault.
5. **INFRA-5 (Network)**: Network changes are P0 security events. No fast-tracking.

## Workflow Steps

### Step 1: Design Review
- **Input**: `02-design.json` (Infrastructure-as-Code definitions)
- **Action**: Run `/architect-review`
- **Check**: Are defaults used? Are secrets visible?

### Step 2: Threat Modeling
- **Command**: `/security-architect`
- **Action**: Analyze attack surface.
- **Output**: `03-security.json`
    - Assets
    - Threats (STRIDE)
    - Mitigations

### Step 3: Governance Gate
- **Command**: `/phase-4-decision`
- **Requirement**: Human approval from Security Architect AND Infrastructure Lead.
- **Blocker**: If risk is HIGH, works stops until mitigation is planned.

### Step 4: Provisioning
- Only after `04-decision-record.md` is approved.
- Use CI/CD to apply changes (Terraform/CloudFormation).
- **Manual changes are forbidden.**

---

## Artifact Checklist
| Artifact | Purpose | Validator |
|----------|---------|-----------|
| `02-design.json` | Infra definition | Infrastructure Lead |
| `03-security.json` | Threat analysis | Security Architect |
| `04-decision-record.md` | Audit trail | Compliance Officer |
