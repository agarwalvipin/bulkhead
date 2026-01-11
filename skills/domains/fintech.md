---
description: Financial technology patterns, trading systems, payments, regulations
category: domains
auto_load:
  - when: "trading"
    in: ["files", "config"]
  - when: "payments"
    in: ["files"]
related_skills:
  - practices/security.md
  - architecture/event-driven.md
---

# Fintech Domain

Patterns and considerations for financial technology applications.

---

## Core Concepts

| Concept | Description |
|---------|-------------|
| **Idempotency** | Operations must be safely retryable |
| **Auditability** | Every action must be traceable |
| **Precision** | Use Decimal, never float for money |
| **Reconciliation** | Data consistency verification |
| **Settlement** | Finalization of transactions |

---

## Money Handling

### Never Use Floats

```python
from decimal import Decimal, ROUND_HALF_UP

# ✅ Good: Decimal with explicit precision
class Money:
    def __init__(self, amount: str, currency: str = "USD"):
        self.amount = Decimal(amount)
        self.currency = currency
    
    def quantize(self, places: int = 2) -> Decimal:
        return self.amount.quantize(
            Decimal(10) ** -places, 
            rounding=ROUND_HALF_UP
        )

# ❌ Bad: Float arithmetic
total = 0.1 + 0.2  # 0.30000000000000004
```

### Currency-Aware Types

```python
from pydantic import BaseModel, Field
from decimal import Decimal

class Transaction(BaseModel):
    amount: Decimal = Field(..., decimal_places=2)
    currency: str = Field(..., pattern=r"^[A-Z]{3}$")
    
    class Config:
        json_encoders = {Decimal: str}
```

---

## Double-Entry Bookkeeping

Every transaction has equal debits and credits.

```python
@dataclass
class JournalEntry:
    """A balanced set of debits and credits."""
    id: str
    date: datetime
    entries: list[LedgerEntry]
    
    def validate(self) -> None:
        total = sum(e.signed_amount for e in self.entries)
        if total != Decimal("0"):
            raise ValueError(f"Unbalanced entry: {total}")

@dataclass
class LedgerEntry:
    account_id: str
    amount: Decimal
    entry_type: Literal["debit", "credit"]
    
    @property
    def signed_amount(self) -> Decimal:
        return self.amount if self.entry_type == "debit" else -self.amount
```

---

## Idempotency

```python
from fastapi import Header, HTTPException
import hashlib

async def process_payment(
    payment: PaymentRequest,
    idempotency_key: str = Header(..., alias="Idempotency-Key"),
) -> PaymentResponse:
    # Check if already processed
    existing = await cache.get(f"idem:{idempotency_key}")
    if existing:
        return PaymentResponse.parse_raw(existing)
    
    # Process and store result
    result = await payment_service.process(payment)
    await cache.set(
        f"idem:{idempotency_key}", 
        result.json(),
        ttl=86400 * 7  # 7 days
    )
    return result
```

---

## Trading Systems

### Order Types

| Type | Description |
|------|-------------|
| **Market** | Execute immediately at best price |
| **Limit** | Execute at specified price or better |
| **Stop** | Trigger market order at price |
| **Stop-Limit** | Trigger limit order at price |

### Order States

```
┌─────────┐     ┌──────────┐     ┌──────────┐
│ PENDING │────▶│ ACCEPTED │────▶│  FILLED  │
└─────────┘     └──────────┘     └──────────┘
     │               │                  │
     ▼               ▼                  ▼
┌─────────┐     ┌──────────┐     ┌──────────┐
│ REJECTED│     │ CANCELLED│     │ PARTIAL  │
└─────────┘     └──────────┘     └──────────┘
```

---

## Regulatory Compliance

| Regulation | Scope | Key Requirements |
|------------|-------|------------------|
| **PCI-DSS** | Card data | Encryption, access control, logging |
| **SOX** | Financial reporting | Audit trails, controls |
| **AML/KYC** | Customer verification | Identity checks, monitoring |
| **GDPR** | EU data protection | Consent, right to erasure |
| **MiFID II** | EU trading | Transaction reporting |

### Audit Trail

```python
class AuditLog(BaseModel):
    id: str
    timestamp: datetime
    actor_id: str
    action: str
    resource_type: str
    resource_id: str
    changes: dict
    ip_address: str | None
    
    class Config:
        # Audit logs are append-only
        frozen = True
```

---

## Anti-patterns

| Anti-pattern | Risk | Better Approach |
|--------------|------|-----------------|
| **Float for money** | Precision errors | Decimal, integer cents |
| **Missing idempotency** | Duplicate transactions | Idempotency keys |
| **No audit trail** | Compliance failure | Append-only logs |
| **Sync payment flow** | Timeouts, failures | Async with webhooks |
| **Storing card numbers** | PCI scope | Tokenization |

---

## References

- [PCI DSS Requirements](https://www.pcisecuritystandards.org/)
- [Stripe API Design](https://stripe.com/docs/api)
- [Martin Fowler - Analysis Patterns](https://martinfowler.com/books/ap.html)
