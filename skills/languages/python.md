---
description: Python patterns, typing, async, and best practices (uv + ruff 2026 stack)
category: languages
auto_load:
  - when: "pyproject.toml"
    in: ["files"]
  - when: "uv.lock"
    in: ["files"]
related_skills:
  - practices/testing.md
  - practices/security.md
---

# Python (2026 Stack)

Modern Python (3.12+/3.13+) patterns using **uv + ruff + pyright**.

---

## Toolchain

| Tool | Purpose | Replaces |
|------|---------|----------|
| `uv` | Package manager, venv, Python versions | pip, poetry, pyenv |
| `ruff` | Linter + formatter (800+ rules) | flake8, black, isort, pylint |
| `pyright` | Type checker (strict mode) | mypy |
| `pytest` | Testing framework | unittest |

---

## Quick Setup

```bash
# New project
uv init myproject && cd myproject
uv add fastapi pydantic httpx
uv add --dev ruff pyright pytest pytest-asyncio

# Quality checks
uv run ruff check --fix .
uv run ruff format .
uv run pyright
uv run pytest
```

---

## pyproject.toml

```toml
[project]
name = "myproject"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115",
    "pydantic>=2.10",
    "httpx>=0.28",
]

[dependency-groups]
dev = ["ruff", "pyright", "pytest", "pytest-asyncio"]

[tool.ruff]
target-version = "py312"
line-length = 100
src = ["src", "tests"]

[tool.ruff.lint]
select = [
    "E", "W",     # pycodestyle
    "F",          # Pyflakes
    "I",          # isort
    "B",          # bugbear
    "C4",         # comprehensions
    "UP",         # pyupgrade
    "SIM",        # simplify
    "TCH",        # type-checking imports
    "RUF",        # ruff-specific
    "ASYNC",      # async best practices
    "PTH",        # pathlib
]

[tool.ruff.lint.isort]
known-first-party = ["myproject"]
combine-as-imports = true

[tool.pyright]
pythonVersion = "3.12"
typeCheckingMode = "strict"

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
```

---

## PEP 723: Inline Script Dependencies

Run standalone scripts without a project:

```python
#!/usr/bin/env -S uv run
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx", "rich"]
# ///

import httpx
from rich import print

resp = httpx.get("https://api.example.com/data")
print(resp.json())
```

```bash
uv run script.py  # Auto-installs deps, runs script
```

---

## Import Style

Imports at top, sorted by ruff (`I` rules):

```python
# 1. Standard library
from pathlib import Path
from typing import TYPE_CHECKING

# 2. Third-party
import httpx
from fastapi import FastAPI

# 3. Local
from myproject.services import UserService

# 4. Type-only (removed at runtime)
if TYPE_CHECKING:
    from myproject.models import HeavyModel
```

### Anti-patterns
- ❌ Mid-file imports
- ❌ `from x import *`
- ❌ Unused imports (ruff auto-removes)

---

## Type Hints

```python
from collections.abc import Callable, Sequence

def process(
    items: list[str],
    transform: Callable[[str], str] | None = None,
) -> dict[str, int]:
    ...
```

### Rules
- Lowercase generics: `list`, `dict`, `set`
- Union with `|` not `Union`
- No `Any` unless unavoidable
- Run `pyright` in strict mode

---

## Async Patterns

```python
import asyncio
from collections.abc import AsyncIterator

async def fetch_all(urls: list[str]) -> list[dict]:
    async with httpx.AsyncClient() as client:
        tasks = [client.get(url) for url in urls]
        responses = await asyncio.gather(*tasks)
        return [r.json() for r in responses]
```

### Anti-patterns
- ❌ `time.sleep()` (use `asyncio.sleep`)
- ❌ Blocking I/O (use `asyncio.to_thread()`)

---

## Project Structure

```
project/
├── pyproject.toml
├── uv.lock              # Committed
├── src/myproject/
│   ├── __init__.py
│   ├── main.py
│   └── services/
├── tests/
│   ├── conftest.py
│   └── test_main.py
└── .python-version      # 3.12 or 3.13
```

---

## Error Handling

```python
from dataclasses import dataclass

@dataclass
class AppError(Exception):
    message: str
    code: str = "UNKNOWN"

class NotFoundError(AppError):
    code: str = "NOT_FOUND"
```

### Anti-patterns
- ❌ Bare `except:`
- ❌ `except Exception:` too broadly
- ❌ Silent error swallowing

---

## Common Commands

```bash
# Dependencies
uv add package              # Add dependency
uv add --dev package        # Add dev dependency
uv sync                     # Install from lockfile
uv lock --upgrade           # Update lockfile

# Code quality
uv run ruff check --fix .   # Lint + autofix
uv run ruff format .        # Format
uv run pyright              # Type check

# Testing
uv run pytest               # Run tests
uv run pytest -x --tb=short # Stop on first failure
uv run pytest --cov=src     # With coverage

# Python versions
uv python install 3.13      # Install Python
uv python pin 3.13          # Pin for project
```

---

## Python 3.13+ Features

```python
# No-GIL mode (experimental)
# Run with: python -X nogil script.py

# Improved error messages
# Better f-string debugging
x = 42
print(f"{x=}")  # Output: x=42
```

---

## References

- [uv Docs](https://docs.astral.sh/uv/)
- [Ruff Docs](https://docs.astral.sh/ruff/)
- [Pyright Config](https://microsoft.github.io/pyright/)
- [PEP 723 - Inline Metadata](https://peps.python.org/pep-0723/)
