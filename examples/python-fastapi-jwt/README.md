# Example: Add JWT Authentication (Python/FastAPI)

This directory contains a complete set of governance artifacts for a realistic feature request: **Adding JWT Authentication to a FastAPI service**.

## Scenario

A developer needs to secure a public API. They want to use standard OAuth2 password flow with JWT tokens.

## How to Use This Example

This example demonstrates the complete Bulkhead 8-phase workflow. To recreate this in your own project:

```bash
# Start with the smart orchestrator
/bulkhead

# Or go directly to triage
/phase-0-triage
```

After Phase 7 verification, use the integration workflows:

```bash
# Create a PR for your changes
/pr-manager create

# Update the changelog
/changelog

# Capture learnings for future reference
/feedback-loop
```

## Artifacts Walkthrough

| Phase | Artifact | Description |
|-------|----------|-------------|
| 0 | [00-triage.md](./architecture/00-triage.md) | Classified as **MAJOR** (Score 8/10) - security and schema changes |
| 1 | [01-context.md](./architecture/01-context.md) | **Blast Radius** identified, security files marked forbidden |
| 2 | [02-design.md](./architecture/02-design.md) | Chose **OAuth2** over custom headers for compatibility |
| 3 | [03-security.md](./architecture/03-security.md) | **STRIDE** analysis confirms signed JWTs mitigate threats |
| 4 | [04-decision.md](./architecture/04-decision.md) | Human **Approves** the design ✅ |
| 5 | [05-plan.md](./architecture/05-plan.md) | Work broken into **Epics** (Setup, Logic, Endpoints) |
| 6 | [06-report.md](./architecture/06-report.md) | Execution log with commits |
| 7 | [07-verify.md](./architecture/07-verify.md) | Proof that tests passed |

## Workflow Commands Used

| Category | Command | Notes |
|----------|---------|-------|
| **Orchestrator** | `/bulkhead` | Smart menu shows context-aware options |
| **Core SDLC** | `/phase-0-triage` through `/phase-7-verify` | In `core/` folder |
| **Integrations** | `/pr-manager`, `/changelog` | In `integrations/` folder |

## Key Takeaways

1. **MAJOR changes** (security, schema) go through full 8-phase governance
2. **Human Gate** at Phase 4 requires explicit approval signature
3. **Double-Write Rule**: Each phase produces `.md` (human) + `.json` (machine) artifacts
4. **Post-completion**: Use integration workflows for PR and changelog

## Related Workflows

- `/orchestrators/modernization` - For large-scale refactoring projects
- `/orchestrators/epic-orchestrator` - For multi-epic phased development
- `/specialized/code-review` - For standalone code review sessions
