---
description: Testing strategies, unit/integration/E2E tests, mocking, TDD
category: practices
auto_load:
  - when: "phase-7"
    in: ["config"]
  - when: "pytest"
    in: ["dependencies"]
  - when: "jest"
    in: ["dependencies"]
related_skills:
  - practices/security.md
---

# Testing Practices

Strategies and patterns for comprehensive software testing.

---

## Testing Pyramid

```
         ┌─────────┐
         │   E2E   │  Few, slow, expensive
         ├─────────┤
         │Integr-  │  Some, medium speed
         │ation    │
         ├─────────┤
         │  Unit   │  Many, fast, cheap
         └─────────┘
```

| Level | Speed | Scope | Examples |
|-------|-------|-------|----------|
| **Unit** | < 10ms | Single function/class | Logic, calculations |
| **Integration** | < 1s | Multiple components | DB, API calls |
| **E2E** | < 30s | Whole system | User workflows |

---

## Unit Testing

### Good Unit Tests

```python
import pytest
from decimal import Decimal
from myapp.pricing import calculate_discount

class TestCalculateDiscount:
    """Tests for calculate_discount function."""
    
    def test_percentage_discount_applied_correctly(self):
        # Arrange
        price = Decimal("100.00")
        discount_percent = 20
        
        # Act
        result = calculate_discount(price, discount_percent)
        
        # Assert
        assert result == Decimal("80.00")
    
    def test_zero_discount_returns_original_price(self):
        assert calculate_discount(Decimal("50.00"), 0) == Decimal("50.00")
    
    def test_100_percent_discount_returns_zero(self):
        assert calculate_discount(Decimal("50.00"), 100) == Decimal("0.00")
    
    def test_negative_discount_raises_error(self):
        with pytest.raises(ValueError, match="Discount cannot be negative"):
            calculate_discount(Decimal("100.00"), -10)
```

### Test Naming Convention

```python
# Pattern: test_[what]_[condition]_[expected]
def test_login_with_invalid_credentials_returns_401(): ...
def test_order_with_empty_cart_raises_error(): ...
def test_cache_expired_item_returns_none(): ...
```

---

## Integration Testing

### Database Integration

```python
import pytest
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

@pytest.fixture
async def db_session():
    """Create a test database session with rollback."""
    engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncSession(engine) as session:
        yield session
        await session.rollback()

async def test_create_user_persists_to_db(db_session):
    user = User(email="test@example.com", name="Test")
    db_session.add(user)
    await db_session.commit()
    
    result = await db_session.get(User, user.id)
    assert result.email == "test@example.com"
```

### API Integration

```python
from httpx import AsyncClient
from myapp.main import app

@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

async def test_create_order_returns_201(client, auth_headers):
    response = await client.post(
        "/orders",
        json={"items": [{"sku": "ABC123", "quantity": 2}]},
        headers=auth_headers,
    )
    
    assert response.status_code == 201
    assert "id" in response.json()
```

---

## Mocking

### When to Mock

| Mock | Don't Mock |
|------|------------|
| External APIs | Your own code |
| Time-based operations | Pure functions |
| File system (sometimes) | Data structures |
| Databases (unit tests) | Databases (integration) |

### Python Mocking

```python
from unittest.mock import Mock, patch, AsyncMock

# Mock a dependency
def test_send_notification_calls_email_service():
    email_service = Mock()
    notification_service = NotificationService(email_service)
    
    notification_service.send("Hello", "user@example.com")
    
    email_service.send_email.assert_called_once_with(
        to="user@example.com",
        body="Hello"
    )

# Patch an import
@patch("myapp.services.requests.post")
def test_external_api_called_correctly(mock_post):
    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {"status": "ok"}
    
    result = call_external_api({"data": "test"})
    
    assert result["status"] == "ok"

# Async mocking
async def test_async_service():
    mock = AsyncMock(return_value={"id": 1})
    service = MyService(external_client=mock)
    
    result = await service.fetch_data()
    assert result["id"] == 1
```

---

## Fixtures and Factories

```python
import pytest
from factory import Factory, Faker, SubFactory

class UserFactory(Factory):
    class Meta:
        model = User
    
    email = Faker("email")
    name = Faker("name")
    is_active = True

class OrderFactory(Factory):
    class Meta:
        model = Order
    
    user = SubFactory(UserFactory)
    total = Faker("pydecimal", left_digits=3, right_digits=2)

# Usage
@pytest.fixture
def user():
    return UserFactory()

@pytest.fixture
def order_with_user(user):
    return OrderFactory(user=user)
```

---

## Test Coverage

```bash
# Run with coverage
pytest --cov=myapp --cov-report=html tests/

# Enforce minimum coverage
pytest --cov=myapp --cov-fail-under=80 tests/
```

### Coverage Guidelines

| Coverage | Meaning |
|----------|---------|
| < 50% | Serious gaps |
| 50-70% | Basic coverage |
| 70-85% | Good coverage |
| > 85% | Excellent (diminishing returns) |

---

## Test-Driven Development (TDD)

```
   Red ──────────▶ Green ──────────▶ Refactor
    │               │                   │
    │ Write        │ Write             │ Clean up
    │ failing      │ minimal           │ code
    │ test         │ code to pass      │
    ▼               ▼                   ▼
 (repeat)
```

---

## Anti-patterns

| Anti-pattern | Problem | Better Approach |
|--------------|---------|-----------------|
| **Testing implementation** | Brittle tests | Test behavior |
| **Giant test methods** | Hard to debug | One assertion per test |
| **No arrange-act-assert** | Unclear intent | Clear structure |
| **Mocking everything** | False confidence | Integration tests |
| **Slow unit tests** | Feedback delay | Keep < 10ms each |
| **Flaky tests** | Erode trust | Fix or delete |

---

## References

- [pytest Documentation](https://docs.pytest.org/)
- [Test-Driven Development by Example](https://www.amazon.com/dp/0321146530)
- [Growing Object-Oriented Software](https://www.amazon.com/dp/0321503627)
