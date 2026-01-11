---
description: Skills system - domain expertise modules for context-aware assistance
---

# Bulkhead Skills

**Skills** are domain expertise modules that provide contextual knowledge during workflows.

## What are Skills?

| Component | Purpose | Answers |
|-----------|---------|---------|
| workflows/ | Processes | **HOW** to do things |
| rules/ | Constraints | **WHAT** to always/never do |
| skills/ | Expertise | **WHAT** to know about a domain |

## Categories

| Category | Path | Purpose |
|----------|------|---------|
| Languages | `languages/` | Language-specific patterns & idioms |
| Frameworks | `frameworks/` | Framework conventions & APIs |
| Architecture | `architecture/` | Architectural patterns & decisions |
| Domains | `domains/` | Business domain expertise |
| Practices | `practices/` | Cross-cutting best practices |

## How Skills Load

### Automatic Detection
Skills auto-load based on project context:

```bash
# Python detected (pyproject.toml, requirements.txt)
→ Loads: languages/python.md

# FastAPI in dependencies
→ Loads: frameworks/fastapi.md
```

### Manual Loading
```bash
/bulkhead skill python      # Load specific skill
/bulkhead skill fintech     # Load domain skill
/bulkhead skills            # List all available
```

### Phase-Specific Loading
- **Phase 2 (Design)** → architecture skills
- **Phase 3 (Security)** → practices/security.md
- **Phase 6 (Execute)** → language + framework skills

## Skill File Format

```yaml
---
description: One-line description
category: languages | frameworks | architecture | domains | practices
auto_load:
  - when: "pattern"     # Context pattern to match
    in: ["files"]       # Where: files, config, dependencies
related_skills:
  - practices/security.md
---

# Skill Title

## Overview
## Key Patterns
## Anti-patterns
## Code Examples
## References
```

## Creating Custom Skills

1. Create a `.md` file in the appropriate category
2. Add YAML frontmatter with `description` and `category`
3. Optionally add `auto_load` rules
4. Document patterns, anti-patterns, and examples
