---
description: E-commerce patterns, payments, inventory, cart, and fulfillment
category: domains
auto_load:
  - when: "cart"
    in: ["files"]
  - when: "checkout"
    in: ["files"]
  - when: "inventory"
    in: ["files"]
related_skills:
  - practices/security.md
  - architecture/microservices.md
---

# E-Commerce Domain

Patterns for online retail systems including payments, inventory, and fulfillment.

---

## Core Concepts

| Concept | Description |
|---------|-------------|
| **SKU** | Stock Keeping Unit - unique product identifier |
| **Cart** | Temporary collection of items before purchase |
| **Checkout** | Process of converting cart to order |
| **Fulfillment** | Picking, packing, shipping |
| **GMV** | Gross Merchandise Value |

---

## Product Catalog

### Product Model

```python
from pydantic import BaseModel, Field
from decimal import Decimal
from enum import Enum

class ProductStatus(Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    ARCHIVED = "archived"

class Product(BaseModel):
    id: str
    sku: str = Field(..., pattern=r"^[A-Z0-9-]{6,20}$")
    name: str = Field(..., max_length=200)
    description: str
    price: Decimal = Field(..., ge=0, decimal_places=2)
    compare_at_price: Decimal | None = None  # For sale display
    status: ProductStatus = ProductStatus.DRAFT
    categories: list[str] = []
    tags: list[str] = []
    variants: list["ProductVariant"] = []
    
class ProductVariant(BaseModel):
    id: str
    sku: str
    option_values: dict[str, str]  # {"size": "L", "color": "Blue"}
    price: Decimal
    inventory_quantity: int = 0
```

---

## Shopping Cart

### Cart Logic

```python
from dataclasses import dataclass, field
from decimal import Decimal

@dataclass
class CartItem:
    product_id: str
    variant_id: str
    quantity: int
    unit_price: Decimal
    
    @property
    def subtotal(self) -> Decimal:
        return self.unit_price * self.quantity

@dataclass
class Cart:
    id: str
    customer_id: str | None
    items: list[CartItem] = field(default_factory=list)
    
    @property
    def subtotal(self) -> Decimal:
        return sum(item.subtotal for item in self.items)
    
    def add_item(self, item: CartItem) -> None:
        # Merge with existing if same variant
        for existing in self.items:
            if existing.variant_id == item.variant_id:
                existing.quantity += item.quantity
                return
        self.items.append(item)
    
    def remove_item(self, variant_id: str) -> None:
        self.items = [i for i in self.items if i.variant_id != variant_id]
```

### Cart Persistence Strategies

| Strategy | Use Case | TTL |
|----------|----------|-----|
| **Session** | Guest users | Session lifetime |
| **Redis** | Logged-in users | 30 days |
| **Database** | Cart recovery | Indefinite |

---

## Inventory Management

### Stock Reservation

```python
async def reserve_inventory(order_id: str, items: list[OrderItem]) -> bool:
    """Reserve inventory with soft-lock pattern."""
    async with db.transaction():
        for item in items:
            result = await db.execute("""
                UPDATE inventory 
                SET reserved = reserved + :qty
                WHERE variant_id = :vid 
                  AND (available - reserved) >= :qty
            """, {"vid": item.variant_id, "qty": item.quantity})
            
            if result.rowcount == 0:
                raise InsufficientInventoryError(item.variant_id)
        
        await inventory_reservations.create(
            order_id=order_id,
            items=items,
            expires_at=utcnow() + timedelta(minutes=15)
        )
    return True
```

### Inventory States

```
┌───────────────────────────────────────────────────┐
│                   Total Stock                     │
├──────────────┬──────────────┬────────────────────┤
│  Available   │   Reserved   │   Committed        │
│  (for sale)  │ (in carts)   │ (in orders)        │
└──────────────┴──────────────┴────────────────────┘

Available = Total - Reserved - Committed
```

---

## Checkout Flow

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│  Cart   │──▶│ Address │──▶│ Payment │──▶│ Confirm │
└─────────┘   └─────────┘   └─────────┘   └─────────┘
                                │
                                ▼
                         ┌─────────────┐
                         │ Create Order│
                         │ + Reserve   │
                         │   Inventory │
                         └─────────────┘
```

### Order Creation

```python
async def create_order(cart: Cart, payment: Payment) -> Order:
    async with db.transaction():
        # 1. Validate inventory
        await validate_inventory(cart.items)
        
        # 2. Create order
        order = await order_repository.create(
            customer_id=cart.customer_id,
            items=cart.items,
            shipping=cart.shipping,
            payment_intent=payment.intent_id,
        )
        
        # 3. Reserve inventory
        await reserve_inventory(order.id, cart.items)
        
        # 4. Clear cart
        await cart_repository.delete(cart.id)
        
        # 5. Publish event
        await events.publish(OrderCreated(order))
        
    return order
```

---

## Pricing & Discounts

### Discount Types

| Type | Example | Application |
|------|---------|-------------|
| **Percentage** | 20% off | Multiply by 0.8 |
| **Fixed Amount** | $10 off | Subtract from total |
| **BOGO** | Buy 1 Get 1 | Conditional free item |
| **Shipping** | Free shipping | Zero shipping cost |
| **Threshold** | $100+ = 10% off | Conditional percentage |

```python
@dataclass
class Discount:
    code: str
    type: Literal["percentage", "fixed", "shipping"]
    value: Decimal
    min_order_amount: Decimal | None = None
    
    def apply(self, subtotal: Decimal) -> Decimal:
        if self.min_order_amount and subtotal < self.min_order_amount:
            return Decimal("0")
        
        match self.type:
            case "percentage":
                return subtotal * (self.value / 100)
            case "fixed":
                return min(self.value, subtotal)
            case "shipping":
                return self.value  # Applied to shipping
```

---

## Anti-patterns

| Anti-pattern | Risk | Better Approach |
|--------------|------|-----------------|
| **No inventory check** | Overselling | Reserved inventory pattern |
| **Sync payment** | Timeouts | Async with webhooks |
| **Price in URL** | Tampering | Server-side validation |
| **Cart in frontend only** | Cart abandonment | Server persistence |
| **No idempotency** | Duplicate orders | Idempotency keys |

---

## References

- [Shopify API Design](https://shopify.dev/api)
- [Stripe Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Event-Driven E-commerce (Confluent)](https://www.confluent.io/blog/event-driven-ecommerce/)
