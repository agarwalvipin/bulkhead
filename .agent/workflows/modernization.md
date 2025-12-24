---
description: Evaluates legacy systems, recommends REFACTOR vs REBUILD, then produces a phased modernization plan. Consolidates decision-making and planning into a single workflow.
prerequisites: []
routes_to:
  - phase-5-plan
outputs:
  human: .bulkhead/architecture/modernization-plan.md
  machine: .bulkhead/architecture/modernization-plan.json
  schema: .bulkhead/schemas/modernization-plan.schema.json
---

# System Modernization Workflow

**Goal:** Assess a legacy system, decide whether to REFACTOR or REBUILD, and produce an actionable modernization plan.

---

## Stage 1: Assessment

### 1.1 Technical Debt Analysis
Evaluate the codebase on these dimensions:

| Factor | Score (1-5) | Evidence |
|--------|-------------|----------|
| **Code Quality** | | Linting errors, complexity metrics, duplication |
| **Test Coverage** | | % covered, test reliability |
| **Documentation** | | README, inline comments, architecture docs |
| **Dependency Health** | | Outdated deps, security vulnerabilities |
| **Architecture Clarity** | | Clear boundaries, separation of concerns |

### 1.2 Business Logic Audit
- **Documented?** Is business logic captured in specs, tests, or comments?
- **Understood?** Can the team explain what the code does?
- **Critical Paths** Identify the 3-5 most important flows.

### 1.3 Cost Estimation
Provide rough estimates:
- **Time to Refactor**: [X weeks/months]
- **Time to Rebuild**: [Y weeks/months]
- **Risk of Refactor**: [Low/Medium/High]
- **Risk of Rebuild**: [Low/Medium/High]

---

## Stage 2: Decision Gate

### Decision Matrix

| Condition | Recommendation |
|-----------|----------------|
| Tech stack obsolete (e.g., Python 2, EOL frameworks) | **REBUILD** |
| Fundamental security flaws (auth by design) | **REBUILD** |
| No tests, no docs, no one understands it | **REBUILD** |
| Modular codebase with some tests | **REFACTOR** |
| Complex, well-understood business logic | **REFACTOR** |
| Rebuild cost > 2x refactor cost | **REFACTOR** |

### Decision Output
- **REFACTOR**: Proceed to Stage 3a
- **REBUILD**: Proceed to Stage 3b
- **ABORT**: Stop. Document why modernization is not viable.

---

## Stage 3a: Refactor Planning (if REFACTOR)

### 3a.1 Component Extraction
Identify refactoring "seams" — boundaries where components can be isolated:

```markdown
| Component | Dependencies | Risk | Priority |
|-----------|--------------|------|----------|
| AuthModule | DB, Config | High | 1 |
| UserAPI | AuthModule, DB | Med | 2 |
```

**Analysis Steps:**
1. Map import/require statements to build dependency graph
2. Identify high-coupling hotspots (components with >5 dependencies)
3. Find natural boundaries (API layers, data access, utilities)

### 3a.2 Strategy Selection

| Strategy | When to Use |
|----------|-------------|
| **Strangler Fig** | Gradually replace old with new, route traffic incrementally |
| **Abstraction Layer** | Wrap legacy code in interfaces, swap implementations later |
| **Cleanup In Place** | Standardize formatting, naming, linting before structural changes |
| **Branch by Abstraction** | Add feature flags, toggle between old and new paths |

### 3a.3 Phased Refactor Plan

```markdown
### Phase 1: Preparation (Week 1-2)
- [ ] Add test coverage to critical paths
- [ ] Set up linting and formatting
- [ ] Document current architecture

### Phase 2: Isolation (Week 3-4)
- [ ] Extract [Component A] behind interface
- [ ] Add integration tests for extracted component

### Phase 3: Replacement (Week 5-6)
- [ ] Implement [Component A v2]
- [ ] Feature flag: route 10% traffic to v2
- [ ] Monitor, iterate, full rollover
```

### 3a.4 Rollback Strategy
Each phase must have a defined undo path:
- **Feature flags**: Disable flag to revert
- **Database migrations**: Write reversible migrations
- **API changes**: Maintain backward compatibility during transition

---

## Stage 3b: Rebuild Planning (if REBUILD)

### 3b.1 Greenfield Architecture
Design the new system from scratch:

```markdown
### Target Stack
- **Language**: [e.g., TypeScript, Go]
- **Framework**: [e.g., Next.js, FastAPI]
- **Database**: [e.g., PostgreSQL, TimescaleDB]
- **Infrastructure**: [e.g., Docker, Kubernetes]
```

### 3b.2 Data Migration Strategy

| Data Source | Target | Migration Approach |
|-------------|--------|-------------------|
| Legacy DB | New DB | ETL script / Blue-green cutover |
| File storage | Cloud storage | Batch migration with validation |

### 3b.3 Parallel Run Strategy
- **Phase 1**: Build new system, validate against legacy output
- **Phase 2**: Shadow mode — run both, compare results
- **Phase 3**: Cutover — switch traffic, keep legacy on standby
- **Phase 4**: Decommission legacy after N days stable

### 3b.4 Feature Parity Checklist
Map all legacy features to new implementation status:

```markdown
| Feature | Legacy Location | New Status | Priority |
|---------|-----------------|------------|----------|
| User Auth | auth.py | [ ] Pending | P0 |
| Reports | reports/ | [ ] Pending | P1 |
```

---

## Stage 4: Output

### 4.1 Human-Readable: `.bulkhead/architecture/modernization-plan.md`

```markdown
# Modernization Plan: [System Name]

## Decision
- **Type**: REFACTOR / REBUILD
- **Date**: YYYY-MM-DD
- **Rationale**: [Why this decision?]

## Assessment Summary
| Factor | Score |
|--------|-------|
| Code Quality | 3/5 |
| Test Coverage | 2/5 |

## Plan
[Include Stage 3a or 3b content based on decision]

## Timeline
| Phase | Duration | Milestone |
|-------|----------|-----------|
| Prep | 2 weeks | Tests added |
| Isolation | 2 weeks | Component A extracted |

## Rollback Strategy
[How to undo if things go wrong]

## Exit Criteria
- [ ] All phases complete
- [ ] Tests passing
- [ ] Performance benchmarks met
```

### 4.2 Machine-Enforceable: `.bulkhead/architecture/modernization-plan.json`
*Must validate against `.bulkhead/schemas/modernization-plan.schema.json`*

```json
{
  "version": "1.0",
  "decision": "REFACTOR",
  "decision_date": "2024-01-01",
  "rationale": "Modular codebase with recoverable tech debt",
  "assessment": {
    "code_quality": 3,
    "test_coverage": 2,
    "documentation": 2,
    "dependency_health": 4,
    "architecture_clarity": 3
  },
  "strategy": "strangler_fig",
  "phases": [
    {
      "id": "P1",
      "title": "Preparation",
      "duration_weeks": 2,
      "tasks": ["Add tests", "Setup linting"]
    }
  ],
  "rollback_strategy": "feature_flags"
}
```

---

## Routing

- **Plan Approved** → Proceed to **Phase 5: Plan** (convert phases to epics/tasks)
- **Plan Rejected** → Revise assessment or decision
- **ABORT** → Archive artifacts, document lessons learned
