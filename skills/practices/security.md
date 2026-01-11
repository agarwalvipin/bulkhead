---
description: Security practices, OWASP, authentication, secrets management
category: practices
auto_load:
  - when: "phase-3"
    in: ["config"]
related_skills:
  - architecture/api-design.md
---

# Security Practices

Security patterns and OWASP considerations for production applications.

---

## OWASP Top 10 Quick Reference

| Risk | Prevention |
|------|------------|
| **Injection** | Parameterized queries, input validation |
| **Broken Auth** | MFA, secure session management |
| **Sensitive Data** | Encryption, no secrets in code |
| **XXE** | Disable external entities in XML parsers |
| **Broken Access** | RBAC, deny by default |
| **Misconfig** | Hardened defaults, security headers |
| **XSS** | Output encoding, CSP headers |
| **Deserialization** | Avoid untrusted data, use allowlists |
| **Components** | Dependency scanning, updates |
| **Logging** | Audit logs, monitoring |

---

## Authentication Patterns

### JWT Best Practices

```python
# ✅ Good: Short-lived tokens + refresh
ACCESS_TOKEN_EXPIRE = timedelta(minutes=15)
REFRESH_TOKEN_EXPIRE = timedelta(days=7)

# ✅ Good: Token payload validation
def decode_token(token: str) -> dict:
    payload = jwt.decode(
        token,
        SECRET_KEY,
        algorithms=["HS256"],
        options={"require": ["exp", "sub", "iat"]},
    )
    return payload
```

### Anti-patterns
- ❌ Long-lived access tokens (>1 hour)
- ❌ Storing sensitive data in JWT payload
- ❌ Using `none` algorithm

---

## Secrets Management

### Environment-Based

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    api_key: str
    
    model_config = {"env_file": ".env"}
```

### Key Patterns
- Never commit `.env` files
- Use secret managers in production (Vault, AWS Secrets Manager)
- Rotate secrets regularly

### Anti-patterns
- ❌ Hardcoded secrets in code
- ❌ Secrets in environment variables on shared hosts
- ❌ Same secrets across environments

---

## Input Validation

```python
from pydantic import BaseModel, Field, field_validator
import re

class CreateUser(BaseModel):
    email: str = Field(..., max_length=255)
    username: str = Field(..., pattern=r"^[a-zA-Z0-9_]{3,30}$")
    
    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        if not re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", v):
            raise ValueError("Invalid email format")
        return v.lower()
```

### Key Patterns
- Validate at the boundary (API layer)
- Use allowlists over denylists
- Normalize input (lowercase emails, strip whitespace)

---

## SQL Injection Prevention

```python
# ✅ Good: Parameterized queries
async def get_user(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(
        select(User).where(User.email == email)
    )
    return result.scalar_one_or_none()

# ❌ Bad: String interpolation
query = f"SELECT * FROM users WHERE email = '{email}'"
```

---

## Security Headers

```python
from fastapi import FastAPI
from starlette.middleware import Middleware
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware

app = FastAPI()

@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000"
    return response
```

---

## Dependency Scanning

```bash
# Python
pip-audit                    # Check for known vulnerabilities
safety check                 # Alternative scanner

# JavaScript
npm audit
snyk test

# Containers
trivy image myapp:latest
```

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
