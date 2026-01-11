---
trigger: always_on
---

# Global Rules

Cross-cutting standards that apply to all work.

## Commit Discipline

GLOBAL-1 — ATOMIC COMMITS
Each commit addresses one logical change. No mixed concerns.

GLOBAL-2 — CONVENTIONAL COMMITS
Use format: `type(scope): description`
Types: feat, fix, docs, refactor, test, chore

GLOBAL-3 — NO BROKEN COMMITS
Every commit must pass linting and tests. Do not commit failing code.

## Documentation

GLOBAL-4 — INLINE DOCS
Document non-obvious logic. Explain "why", not "what".

GLOBAL-5 — CHANGELOG
Update CHANGELOG.md for user-facing changes using Keep a Changelog format.

## Quality Standards

GLOBAL-6 — LINTING CLEAN
Code must pass all configured linters before commit.

GLOBAL-7 — TYPE SAFETY
Use type hints (Python) or TypeScript strict mode where applicable.

GLOBAL-8 — DRY PRINCIPLE
Extract repeated logic. No copy-paste patterns across files.
