---
description: Event-driven architecture, CQRS, sagas, event sourcing patterns
category: architecture
auto_load:
  - when: "kafka"
    in: ["dependencies", "config"]
  - when: "rabbitmq"
    in: ["dependencies", "config"]
  - when: "redis-streams"
    in: ["dependencies"]
related_skills:
  - architecture/microservices.md
---

# Event-Driven Architecture

Patterns for building loosely-coupled, scalable systems using events and messages.

---

## Core Concepts

| Concept | Description |
|---------|-------------|
| **Event** | Immutable fact that something happened |
| **Command** | Request to perform an action |
| **Message** | Data transported between systems |
| **Producer** | Publishes events/messages |
| **Consumer** | Subscribes to and processes events |

---

## Event Types

| Type | Purpose | Example |
|------|---------|---------|
| **Domain Event** | Business fact occurred | `OrderPlaced`, `PaymentReceived` |
| **Integration Event** | Cross-service notification | `InventoryReserved` |
| **Notification Event** | Thin event, triggers lookup | `{order_id: 123}` |

### Event Naming Convention

```python
# ✅ Good: Past tense, describes what happened
class OrderPlaced:
    order_id: str
    customer_id: str
    total_amount: Decimal
    placed_at: datetime

# ❌ Bad: Imperative or vague
class PlaceOrder: ...      # This is a command, not an event
class OrderEvent: ...      # Too generic
```

---

## Messaging Patterns

### Publish-Subscribe

```python
# Publisher - doesn't know who listens
async def place_order(order: Order) -> None:
    await repository.save(order)
    await event_bus.publish("orders.placed", OrderPlaced(
        order_id=order.id,
        customer_id=order.customer_id,
        total_amount=order.total,
    ))

# Subscriber - independent processing
@event_handler("orders.placed")
async def reserve_inventory(event: OrderPlaced) -> None:
    for item in event.items:
        await inventory.reserve(item.product_id, item.quantity)
```

### Event Sourcing

```python
# Events as the source of truth
class OrderAggregate:
    def __init__(self, events: list[Event]):
        self.events = []
        self.status = None
        for event in events:
            self.apply(event)
    
    def apply(self, event: Event) -> None:
        match event:
            case OrderPlaced():
                self.status = "placed"
            case OrderShipped():
                self.status = "shipped"
            case OrderCancelled():
                self.status = "cancelled"
        self.events.append(event)
    
    def place(self, items: list[Item]) -> None:
        self.apply(OrderPlaced(items=items, placed_at=utcnow()))
```

---

## CQRS (Command Query Responsibility Segregation)

```
┌──────────────┐          ┌──────────────────┐
│   Commands   │─────────▶│  Write Model     │
│  PlaceOrder  │          │  (Event Store)   │
│  CancelOrder │          └────────┬─────────┘
└──────────────┘                   │ Events
                                   ▼
┌──────────────┐          ┌──────────────────┐
│   Queries    │◀─────────│  Read Model      │
│  GetOrder    │          │  (Projections)   │
│  ListOrders  │          └──────────────────┘
└──────────────┘
```

### Implementation

```python
# Command Handler (Write Side)
async def handle_place_order(cmd: PlaceOrderCommand) -> str:
    order = Order.create(cmd.customer_id, cmd.items)
    await event_store.append(order.id, order.uncommitted_events)
    return order.id

# Projection (Read Side)
@event_handler("orders.*")
async def project_order_summary(event: DomainEvent) -> None:
    match event:
        case OrderPlaced():
            await order_view.upsert(OrderSummary(
                id=event.order_id,
                status="placed",
                total=event.total_amount,
            ))
        case OrderShipped():
            await order_view.update_status(event.order_id, "shipped")
```

---

## Saga Pattern

### Choreography (Event-Driven)

```
OrderPlaced ──▶ InventoryService ──▶ InventoryReserved
                                         │
                                         ▼
PaymentFailed ◀── PaymentService ◀── ProcessPayment
      │
      ▼
InventoryReleased ◀── InventoryService ◀── CompensateInventory
```

### Orchestration (Central Coordinator)

```python
class OrderSaga:
    async def execute(self, order: Order) -> None:
        try:
            # Step 1: Reserve inventory
            await inventory_service.reserve(order.items)
            
            # Step 2: Process payment
            await payment_service.charge(order.customer_id, order.total)
            
            # Step 3: Confirm order
            await order_service.confirm(order.id)
            
        except PaymentFailed:
            # Compensating action
            await inventory_service.release(order.items)
            await order_service.cancel(order.id, reason="payment_failed")
```

---

## Delivery Guarantees

| Guarantee | Description | Trade-off |
|-----------|-------------|-----------|
| **At-most-once** | Fire and forget | May lose messages |
| **At-least-once** | Retry until ack | May have duplicates |
| **Exactly-once** | Idempotent processing | Complex, expensive |

### Idempotent Consumers

```python
# ✅ Good: Idempotency key prevents duplicate processing
async def handle_payment_received(event: PaymentReceived) -> None:
    if await processed_events.exists(event.event_id):
        return  # Already processed
    
    await account.credit(event.amount)
    await processed_events.mark(event.event_id)
```

---

## Outbox Pattern

Ensures reliable event publishing with transactional consistency.

```python
async def place_order(order: Order) -> None:
    async with db.transaction():
        # 1. Save the order
        await order_repository.save(order)
        
        # 2. Write event to outbox (same transaction)
        await outbox.insert(OutboxMessage(
            topic="orders.placed",
            payload=OrderPlaced(order_id=order.id).json(),
        ))
    
    # 3. Separate process polls outbox and publishes
```

---

## Anti-patterns

| Anti-pattern | Problem | Better Approach |
|--------------|---------|-----------------|
| **Dual Write** | Inconsistent state | Outbox pattern |
| **Event Soup** | Unclear event semantics | Well-defined domain events |
| **Giant Events** | Tight coupling | Thin events, lookup if needed |
| **Sync Saga** | Defeats purpose | Async choreography or orchestrator |
| **No Idempotency** | Duplicate processing | Idempotency keys |

---

## Message Broker Comparison

| Broker | Best For | Ordering | Persistence |
|--------|----------|----------|-------------|
| **Kafka** | High throughput, log | Per partition | ✅ Long-term |
| **RabbitMQ** | Complex routing | Per queue | ✅ Durable |
| **Redis Streams** | Simple, low latency | Per stream | ⚠️ Limited |
| **NATS** | Cloud-native, simple | Limited | Optional |

---

## References

- [Event Sourcing (Martin Fowler)](https://martinfowler.com/eaaDev/EventSourcing.html)
- [CQRS (Greg Young)](https://cqrs.files.wordpress.com/2010/11/cqrs_documents.pdf)
- [Saga Pattern](https://microservices.io/patterns/data/saga.html)
- [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/)
