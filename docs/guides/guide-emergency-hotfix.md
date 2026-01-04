# Emergency Hotfix Guide

Rapid response protocol for P0 Critical incidents.

---

## Quick Start
```bash
# 1. Triage (Force P0)
/phase-0-triage --critical

# 2. Fast-Track Context
/phase-1-context --fast-track

# 3. Execution
/phase-6-execute
```

---

## The Golden Rule
**"Speed is essential, but safety is non-negotiable."**

### Valid for Fast-Track
- Logic bugs causing outages.
- Security patches (application layer).
- UI/UX blockers.

### INVALID for Fast-Track (Standard Flow Required)
- **Infrastructure Changes (INFRA-5)**: Network/Firewall/IAM changes MUST go through Phase 3 Security.
- **Data Migrations**: High risk of data loss.

---

## Condensed Workflow
In emergency mode, Phases 0-2 are compressed into a single context pass.

### 1. Triage (P0)
- **Command**: `/phase-0-triage`
- **Action**: Select "CRITICAL".
- **Result**: System unlocks the Fast-Track lane.

### 2. Implementation
- **Command**: `/phase-6-execute`
- **Branch**: `hotfix/incident-ID`.
- **Focus**: Minimal viable fix. NO refactoring.

### 3. Verification
- **Command**: `/phase-7-verify`
- **Requirement**: Automated tests MUST pass. Manual testing is abbreviated but mandatory.

### 4. Deploy
- **Command**: `/int-pr-manager`
- **Label**: `hotfix`
- **Review**: expedited (1 senior approver).

### 5. Post-Mortem
- **After Incident**: Create a `post-mortem.md` in the `docs/incidents/` folder.
- **Root Cause**: Why did this happen?
- **Prevention**: How do we stop it next time?
