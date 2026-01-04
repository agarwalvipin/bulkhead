# Security-First Infrastructure Guide

Strict protocol for infrastructure and security-critical changes.

---

## Quick Start

```bash
# Start governance workflow
/bulkhead
```

Select **[1] Start new SDLC workflow** and mark the Triage classification as **MAJOR** or **CRITICAL**.

---

## Critical Rules (INFRA-1 to INFRA-5)

1. **INFRA-1 (No Defaults)**: Explicitly declare all ports, creds, and nets
2. **INFRA-2 (Threat Model)**: `03-security.json` is MANDATORY
3. **INFRA-3 (Decision Record)**: No provisioning without signed `04-decision.md`
4. **INFRA-4 (Secrets)**: Never inline secrets. Use a vault
5. **INFRA-5 (Network)**: Network changes are P0 security events. No fast-tracking

---

## Workflow Steps

### Step 1: Design Review
- **Input**: `02-design.json` (Infrastructure-as-Code definitions)
- **Action**: Run `/bulkhead` and select **Utilities > Code Review** (or use the main menu)

### Step 2: Threat Modeling
- **Action**: Analyze attack surface
- **Output**: `03-security.json`
  - Assets
  - Threats (STRIDE)
  - Mitigations
- **Tooling**: Run `/bulkhead` > Select **Utilities** if specialized modeling is needed.

### Step 3: Governance Gate
- **Requirement**: Human approval from Security Architect AND Infrastructure Lead
- **Blocker**: If risk is HIGH, work stops until mitigation is planned
- **Sign-off**: Manually sign `04-decision.md`

### Step 4: Provisioning
- Run `/bulkhead` and select **[1] Continue**
- Use CI/CD to apply changes (Terraform/CloudFormation)
- **Manual changes are forbidden**

---

## Artifact Checklist
| Artifact | Purpose | Validator |
|----------|---------|-----------|
| `02-design.json` | Infra definition | Infrastructure Lead |
| `03-security.json` | Threat analysis | Security Architect |
| `04-decision.md` | Audit trail | Compliance Officer |
