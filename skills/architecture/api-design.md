---
description: API design principles, REST, GraphQL, versioning, documentation
category: architecture
auto_load:
  - when: "openapi"
    in: ["files"]
  - when: "swagger"
    in: ["files", "dependencies"]
  - when: "graphql"
    in: ["dependencies"]
related_skills:
  - practices/security.md
  - frameworks/fastapi.md
---

# API Design

Patterns and best practices for designing robust, maintainable APIs.

---

## REST Principles

| Principle | Description |
|-----------|-------------|
| **Resource-Oriented** | URLs represent resources, not actions |
| **Stateless** | Each request contains all needed info |
| **Uniform Interface** | Consistent URL structure and HTTP semantics |
| **HATEOAS** | Responses include navigable links |

---

## URL Design

### Resource Naming

```bash
# ✅ Good: Nouns, plural, hierarchical
GET    /orders                    # List orders
POST   /orders                    # Create order
GET    /orders/{id}               # Get order
PATCH  /orders/{id}               # Update order
DELETE /orders/{id}               # Delete order
GET    /orders/{id}/items         # Order's items (sub-resource)

# ❌ Bad: Verbs, actions in URL
POST   /createOrder
GET    /getOrderById
POST   /orders/{id}/updateStatus
```

### Filtering, Sorting, Pagination

```bash
# Query parameters for collections
GET /orders?status=pending&customer_id=123
GET /orders?sort=-created_at,+total
GET /orders?page=2&limit=20
GET /orders?cursor=eyJpZCI6MTAwfQ==
```

---

## HTTP Methods & Status Codes

### Methods

| Method | Purpose | Idempotent |
|--------|---------|------------|
| `GET` | Retrieve resource | ✅ Yes |
| `POST` | Create resource | ❌ No |
| `PUT` | Replace resource | ✅ Yes |
| `PATCH` | Partial update | ✅ Yes |
| `DELETE` | Remove resource | ✅ Yes |

### Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| `200` | OK | Successful GET, PUT, PATCH |
| `201` | Created | Successful POST |
| `204` | No Content | Successful DELETE |
| `400` | Bad Request | Validation error |
| `401` | Unauthorized | Missing/invalid auth |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate or state conflict |
| `422` | Unprocessable | Semantic validation error |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Server Error | Unexpected failure |

---

## Request/Response Design

### Consistent Response Envelope

```python
# ✅ Good: Consistent structure
{
    "data": {...},                    # The actual resource
    "meta": {                         # Metadata
        "request_id": "abc-123",
        "timestamp": "2024-01-15T10:30:00Z"
    }
}

# For collections
{
    "data": [...],
    "meta": {
        "total": 150,
        "page": 1,
        "limit": 20
    },
    "links": {
        "next": "/orders?page=2&limit=20",
        "prev": null
    }
}
```

### Error Responses

```python
# RFC 7807 Problem Details
{
    "type": "https://api.example.com/errors/validation",
    "title": "Validation Error",
    "status": 422,
    "detail": "One or more fields failed validation",
    "instance": "/orders",
    "errors": [
        {"field": "email", "message": "Invalid email format"},
        {"field": "quantity", "message": "Must be positive"}
    ]
}
```

---

## Versioning Strategies

| Strategy | Example | Pros | Cons |
|----------|---------|------|------|
| **URL Path** | `/v1/orders` | Clear, cacheable | URL clutter |
| **Header** | `Accept-Version: v1` | Clean URLs | Harder to test |
| **Query Param** | `/orders?version=1` | Flexible | Easy to forget |
| **Content Type** | `Accept: application/vnd.api+json;v=1` | Semantic | Complex |

### Best Practice

```python
# ✅ URL versioning for major breaking changes
@app.get("/v1/orders/{order_id}")
async def get_order_v1(order_id: str) -> OrderV1Response:
    ...

@app.get("/v2/orders/{order_id}")
async def get_order_v2(order_id: str) -> OrderV2Response:
    ...
```

---

## GraphQL Patterns

### Schema Design

```graphql
type Query {
    order(id: ID!): Order
    orders(filter: OrderFilter, first: Int, after: String): OrderConnection!
}

type Order {
    id: ID!
    status: OrderStatus!
    items: [OrderItem!]!
    customer: Customer!
    createdAt: DateTime!
}

type OrderConnection {
    edges: [OrderEdge!]!
    pageInfo: PageInfo!
}
```

### When to Use GraphQL

| Use Case | REST | GraphQL |
|----------|------|---------|
| Simple CRUD | ✅ Better | Overkill |
| Complex nested data | N+1 issues | ✅ Better |
| Multiple clients | Multiple endpoints | ✅ Single endpoint |
| Caching | ✅ HTTP caching | Complex |

---

## API Documentation

### OpenAPI/Swagger

```python
from fastapi import FastAPI, Query
from pydantic import BaseModel, Field

class OrderResponse(BaseModel):
    """Order resource representation."""
    id: str = Field(..., description="Unique order identifier")
    status: str = Field(..., example="pending")
    total: float = Field(..., ge=0, description="Order total in USD")

@app.get(
    "/orders/{order_id}",
    response_model=OrderResponse,
    summary="Get order by ID",
    responses={404: {"description": "Order not found"}},
)
async def get_order(
    order_id: str = Path(..., description="Order ID"),
) -> OrderResponse:
    """Retrieve a specific order by its unique identifier."""
    ...
```

---

## Rate Limiting

```python
# Response headers
X-RateLimit-Limit: 100        # Max requests per window
X-RateLimit-Remaining: 45     # Remaining in current window
X-RateLimit-Reset: 1640000000 # Unix timestamp of reset
Retry-After: 30               # Seconds (on 429)
```

### Implementation

```python
from fastapi import Request, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.get("/orders")
@limiter.limit("100/minute")
async def list_orders(request: Request):
    ...
```

---

## Anti-patterns

| Anti-pattern | Problem | Better Approach |
|--------------|---------|-----------------|
| **Chatty APIs** | N+1 requests | Compound resources, GraphQL |
| **Verbs in URLs** | Not RESTful | Resource-oriented URLs |
| **Inconsistent errors** | Hard to handle | RFC 7807 standard |
| **Breaking changes** | Client failures | Versioning, deprecation |
| **No pagination** | Memory/perf issues | Cursor or offset pagination |
| **Exposing internals** | Security risk | DTOs, response models |

---

## Authentication Patterns

| Pattern | Use Case |
|---------|----------|
| **API Keys** | Server-to-server, simple |
| **JWT Bearer** | User sessions, stateless |
| **OAuth 2.0** | Third-party access |
| **mTLS** | High security, service mesh |

```bash
# Bearer token
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

# API Key
X-API-Key: sk_live_abc123
```

---

## References

- [REST API Design Rulebook](https://www.oreilly.com/library/view/rest-api-design/9781449317904/)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [RFC 7807 - Problem Details](https://tools.ietf.org/html/rfc7807)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [Microsoft API Design Guidelines](https://github.com/microsoft/api-guidelines)
