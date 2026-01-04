# Example: Add JWT Authentication (Python/FastAPI)

> 📖 **Tutorial Available**: For a step-by-step guide explaining this example, see [Your First Bulkhead Change](../../docs/tutorials/01-getting-started.md).

This directory contains a complete set of governance artifacts for a realistic feature request: **Adding JWT Authentication to a FastAPI service**.

## Scenario

A developer needs to secure a public API. They want to use standard OAuth2 password flow with JWT tokens.

## How to Use This Example

To recreate this in your own project:

1. **Start the change**:
   ```bash
   /bulkhead
   ```
   *Select [1] Start new SDLC*

2. **Progress through phases**:
   ```bash
   /bulkhead continue
   ```
   *The system will guide you through Triage, Design, Security, and Verification.*

3. **Complete the delivery**:
   ```bash
   /bulkhead
   ```
   *Select from the Post-Completion menu to create PRs, update changesets, and capture feedback.*

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

## Key Takeaways

1. **MAJOR changes** (security, schema) go through full 8-phase governance.
2. **Human Gate** at Phase 4 requires explicit approval signature.
3. **Double-Write Rule**: Each phase produces `.md` (human) + `.json` (machine) artifacts.
4. **Unified entry point**: Use `/bulkhead` for routing, status, and delivery automation.

---

> [!TIP]
> This example project shows the **Standard** rigor profile. For simpler projects, the **Sandbox** profile allows for faster delivery with fewer mandatory gates.
