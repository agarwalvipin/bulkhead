---
description: FastAPI patterns, dependency injection, and async best practices
category: frameworks
auto_load:
  - when: "fastapi"
    in: ["dependencies"]
related_skills:
  - languages/python.md
  - practices/security.md
  - architecture/api-design.md
---

# FastAPI

Production patterns for FastAPI applications.

---

## Project Structure

```
app/
├── main.py              # App factory, lifespan
├── api/
│   ├── __init__.py
│   ├── deps.py          # Shared dependencies
│   └── routes/
│       ├── __init__.py
│       ├── users.py
│       └── items.py
├── core/
│   ├── config.py        # Settings (pydantic-settings)
│   └── security.py      # Auth utilities
├── models/
│   ├── domain.py        # Business models
│   └── schemas.py       # Pydantic request/response
├── services/
│   └── user_service.py  # Business logic
└── db/
    ├── session.py       # Database connection
    └── repositories/    # Data access layer
```

---

## Dependency Injection

```python
from typing import Annotated
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.services.user_service import UserService

# Type aliases for common deps
DBSession = Annotated[AsyncSession, Depends(get_session)]

async def get_user_service(session: DBSession) -> UserService:
    return UserService(session)

UserServiceDep = Annotated[UserService, Depends(get_user_service)]

# Usage in routes
@router.get("/users/{user_id}")
async def get_user(
    user_id: int,
    service: UserServiceDep,
) -> UserResponse:
    user = await service.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

### Key Patterns
- Use `Annotated` for cleaner type hints
- Create type aliases for common dependencies
- Dependencies should be async-compatible

### Anti-patterns
- ❌ Business logic in route handlers
- ❌ Direct database access in routes
- ❌ Nested `Depends()` chains without caching

---

## Request/Response Models

```python
from pydantic import BaseModel, Field, ConfigDict

class UserBase(BaseModel):
    email: str = Field(..., examples=["user@example.com"])
    name: str = Field(..., min_length=1, max_length=100)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserResponse(UserBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

class UserList(BaseModel):
    items: list[UserResponse]
    total: int
    page: int
```

### Key Patterns
- Separate Create/Update/Response schemas
- Use `from_attributes=True` for ORM conversion
- Add `Field()` metadata for OpenAPI docs

---

## Lifespan & Startup

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.db.session import engine
from app.core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_database()
    yield
    # Shutdown
    await engine.dispose()

app = FastAPI(
    title=settings.app_name,
    lifespan=lifespan,
)
```

### Key Patterns
- Use `lifespan` (replaces deprecated `on_event`)
- Initialize connections in startup
- Clean up resources in shutdown

---

## Error Handling

```python
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse

class AppError(Exception):
    def __init__(self, message: str, code: str, status: int = 400):
        self.message = message
        self.code = code
        self.status = status

@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status,
        content={"error": exc.code, "message": exc.message},
    )
```

### Key Patterns
- Custom exception classes for business errors
- Consistent error response format
- Global exception handlers

---

## Authentication

```python
from fastapi import Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: DBSession,
) -> User:
    token = credentials.credentials
    payload = decode_jwt(token)
    user = await db.get(User, payload["sub"])
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]
```

---

## References

- [FastAPI Best Practices](https://github.com/zhanymkanov/fastapi-best-practices)
- [Full Stack FastAPI Template](https://github.com/tiangolo/full-stack-fastapi-template)
- [Pydantic V2 Migration](https://docs.pydantic.dev/latest/migration/)
