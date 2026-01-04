# Emergency Hotfix Guide

Rapid response protocol for P0 Critical incidents.

---

## Quick Start

```bash
# Start hotfix workflow
/bulkhead
```

1. Select **[1] Start new SDLC workflow**
2. In the Triage phase, mark classification as **CRITICAL**

---

## The Golden Rule
**"Speed is essential, but safety is non-negotiable."**

### Valid for Fast-Track
- Logic bugs causing outages
- Security patches (application layer)
- UI/UX blockers

### INVALID for Fast-Track (Standard Flow Required)
- **Infrastructure Changes (INFRA-5)**: Network/Firewall/IAM changes MUST go through Phase 3 Security
- **Data Migrations**: High risk of data loss

---

## Condensed Workflow
In emergency mode, Phases 0-2 are compressed into a single context pass.

### 1. Triage (P0)
Start with `/bulkhead` and select "CRITICAL" classification. The system unlocks the Fast-Track lane.

### 2. Implementation
- **Branch**: `hotfix/incident-ID`
- **Focus**: Minimal viable fix. NO refactoring.
- Run `/bulkhead continue` to jump straight to execution.

### 3. Verification
- **Requirement**: Automated tests MUST pass
- Manual testing is abbreviated but mandatory

### 4. Deploy
Run `/bulkhead` and you will see the **Post-Completion Menu**:
- Select **[1] Create/manage PR** (Apply `hotfix` label)
- Request expedited review (1 senior approver)

### 5. Post-Mortem
After the incident:
- Select **[3] Capture learnings** (Feedback Loop)
- Document root cause and prevention plan
