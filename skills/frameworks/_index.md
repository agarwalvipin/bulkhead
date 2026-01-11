---
description: Framework-specific patterns and conventions
---

# Framework Skills

Skills for specific frameworks, their conventions, and idiomatic usage.

| Skill | Description |
|-------|-------------|
| [fastapi.md](fastapi.md) | FastAPI patterns, DI, async |
| [nextjs.md](nextjs.md) | Next.js routing, SSR, RSC |
| [django.md](django.md) | Django ORM, views, middleware |

## Auto-Loading

Framework skills auto-load when detected in dependencies:

- **FastAPI**: `fastapi` in `pyproject.toml` or `requirements.txt`
- **Next.js**: `next.config.js`, `next` in `package.json`
- **Django**: `django` in dependencies
