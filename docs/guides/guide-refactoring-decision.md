# Refactoring Decision Guide

Data-driven approach to architectural changes. Stop guessing, start measuring.

---

## Quick Start

```bash
# Start modernization workflow
/bulkhead
```

Select **[2] Plan large modernization project** from the Start Menu.

---

## The Decision Matrix

### Data Inputs
We collect 3 key metrics to calculate the score:

1. **Technical Debt Ratio**: How much "cruft" is in the code?
   - Tools: SonarQube / Linter stats
2. **Test Coverage**: Is it safe to change?
   - Tools: `coverage.py` / Jest
3. **Complexity (Cyclomatic)**: How hard is it to understand?
   - Tools: Radon / Lizard

### Scoring (Illustrative)
| Metric | Refactor Friendly | Rebuild Friendly |
|--------|-------------------|------------------|
| Tech Debt | Low (<10%) | High (>40%) |
| Coverage | High (>80%) | Low (<20%) |
| Complexity | Low (Simple) | High (Spaghetti) |
| Logic Knowledge | Documented | Lost/Tribal |

### Execution Paths

#### The Refactor Path
If code is salvageable:
1. Identify high-value modules
2. Use `/bulkhead` and select **[2] Plan large modernization project**, then follow the **Refactor** logic.
3. Move one module at a time
4. Verify parity

#### The Rebuild Path
If code is toxic:
1. Freeze legacy system (maintenance mode)
2. Start new Bulkhead project with `/bulkhead` > **[1] Start new SDLC workflow**
3. Port logic, not code
4. Migrate data

---

## Deliverables
- `rebuild-scorecard.md`: The definitive "why" behind the decision
- `refactoring-plan.md`: The execution roadmap
