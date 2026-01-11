---
description: Microservices patterns, service boundaries, communication strategies
category: architecture
auto_load:
  - when: "docker-compose"
    in: ["files"]
  - when: "kubernetes"
    in: ["config"]
related_skills:
  - architecture/event-driven.md
  - architecture/api-design.md
---

# Microservices Architecture

Patterns for designing, implementing, and operating microservices systems.

---

## Core Principles

| Principle | Description |
|-----------|-------------|
| **Single Responsibility** | Each service owns one business capability |
| **Loose Coupling** | Services are independent and deployable alone |
| **High Cohesion** | Related functionality lives together |
| **Bounded Context** | Clear data ownership boundaries |
| **Autonomy** | Teams can deploy without coordination |

---

## Service Decomposition

### Domain-Driven Boundaries

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Order Svc     │  │  Inventory Svc  │  │  Payment Svc    │
│  ─────────────  │  │  ─────────────  │  │  ─────────────  │
│  - Orders       │  │  - Stock levels │  │  - Transactions │
│  - Line items   │  │  - Reservations │  │  - Refunds      │
│  - Order status │  │  - Warehouses   │  │  - Wallet       │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Decomposition Strategies

| Strategy | When to Use |
|----------|-------------|
| **By Business Capability** | Clear domain boundaries exist |
| **By Subdomain** | Complex domain with DDD |
| **Strangler Pattern** | Migrating from monolith |

---

## Communication Patterns

### Synchronous (Request-Response)

```python
# ✅ Good: Circuit breaker + timeout
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1))
async def get_inventory(product_id: str) -> dict:
    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.get(
            f"{INVENTORY_URL}/products/{product_id}"
        )
        response.raise_for_status()
        return response.json()
```

### Asynchronous (Event-Driven)

```python
# ✅ Good: Fire-and-forget via message queue
async def place_order(order: Order) -> None:
    await order_repository.save(order)
    await event_bus.publish(
        topic="orders.placed",
        event=OrderPlaced(order_id=order.id, items=order.items)
    )
```

### Anti-patterns
- ❌ Synchronous chains > 3 services deep
- ❌ Shared databases between services
- ❌ Tight coupling via shared libraries with business logic

---

## Data Management

### Database per Service

```yaml
# ✅ Good: Each service owns its data
services:
  order-service:
    depends_on:
      - order-postgres
  
  inventory-service:
    depends_on:
      - inventory-redis
      - inventory-postgres
```

### Data Consistency Patterns

| Pattern | Use Case |
|---------|----------|
| **Saga** | Distributed transactions across services |
| **Outbox** | Reliable event publishing with ACID |
| **CQRS** | Separate read/write models |

---

## Service Discovery & Load Balancing

```yaml
# Kubernetes service discovery
apiVersion: v1
kind: Service
metadata:
  name: order-service
spec:
  selector:
    app: order-service
  ports:
    - port: 80
      targetPort: 8000
```

### Patterns
- **Client-Side Discovery**: Service registry (Consul, Eureka)
- **Server-Side Discovery**: Load balancer (K8s Service, AWS ALB)
- **Service Mesh**: Sidecar proxy (Istio, Linkerd)

---

## Resilience Patterns

### Circuit Breaker

```python
from circuitbreaker import circuit

@circuit(failure_threshold=5, recovery_timeout=30)
async def call_payment_service(payment: Payment) -> PaymentResult:
    return await payment_client.process(payment)
```

### Key Patterns
| Pattern | Purpose |
|---------|---------|
| **Circuit Breaker** | Prevent cascade failures |
| **Bulkhead** | Isolate failures |
| **Retry + Backoff** | Handle transient failures |
| **Timeout** | Bound wait times |
| **Fallback** | Graceful degradation |

---

## Observability

### The Three Pillars

```python
# Logging - structured JSON
import structlog
logger = structlog.get_logger()
logger.info("order.created", order_id=order.id, customer_id=customer.id)

# Metrics - counters + histograms
from prometheus_client import Counter, Histogram
orders_total = Counter("orders_total", "Total orders", ["status"])
order_latency = Histogram("order_latency_seconds", "Order processing time")

# Tracing - distributed correlation
from opentelemetry import trace
tracer = trace.get_tracer(__name__)
with tracer.start_as_current_span("process_order") as span:
    span.set_attribute("order_id", order.id)
```

---

## Anti-patterns

| Anti-pattern | Problem | Better Approach |
|--------------|---------|-----------------|
| **Distributed Monolith** | Services tightly coupled | True bounded contexts |
| **Shared Database** | Coupling via data | Database per service |
| **Sync Everywhere** | Coupling + latency | Async where possible |
| **No Circuit Breakers** | Cascade failures | Resilience patterns |
| **Nano-services** | Operational overhead | Right-sized services |

---

## References

- [Microservices Patterns (Chris Richardson)](https://microservices.io/patterns/)
- [Building Microservices (Sam Newman)](https://samnewman.io/books/building_microservices/)
- [12-Factor App](https://12factor.net/)
