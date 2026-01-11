---
description: Performance optimization, profiling, caching, and benchmarking
category: practices
auto_load:
  - when: "performance"
    in: ["files"]
  - when: "benchmark"
    in: ["files"]
related_skills:
  - architecture/microservices.md
---

# Performance Practices

Patterns for profiling, optimizing, and maintaining application performance.

---

## Performance Principles

| Principle | Description |
|-----------|-------------|
| **Measure First** | Profile before optimizing |
| **80/20 Rule** | 80% of time in 20% of code |
| **Premature Optimization** | Avoid without evidence |
| **Know Your Bottleneck** | CPU, memory, I/O, or network |

---

## Profiling

### Python Profiling

```python
# cProfile for CPU profiling
import cProfile
import pstats

profiler = cProfile.Profile()
profiler.enable()

# ... code to profile ...

profiler.disable()
stats = pstats.Stats(profiler).sort_stats("cumulative")
stats.print_stats(20)
```

### Memory Profiling

```python
# memory_profiler for line-by-line analysis
from memory_profiler import profile

@profile
def process_large_data():
    data = load_data()  # Shows memory per line
    processed = transform(data)
    return processed
```

### Async Profiling

```python
# py-spy for production profiling
# pip install py-spy
# py-spy record -o profile.svg --pid <PID>

# yappi for async code
import yappi

yappi.set_clock_type("wall")
yappi.start()

await async_function()

yappi.stop()
stats = yappi.get_func_stats()
stats.print_all()
```

---

## Caching Strategies

### Cache Layers

```
┌─────────────────┐
│   L1: In-Memory │  < 1ms, limited size
├─────────────────┤
│   L2: Redis     │  < 5ms, shared
├─────────────────┤
│   L3: CDN       │  Edge, static content
├─────────────────┤
│   Origin: DB    │  > 10ms, source of truth
└─────────────────┘
```

### Python Caching

```python
from functools import lru_cache
from cachetools import TTLCache, cached
import redis.asyncio as redis

# In-memory LRU
@lru_cache(maxsize=1000)
def expensive_computation(x: int, y: int) -> int:
    return complex_math(x, y)

# In-memory with TTL
cache = TTLCache(maxsize=100, ttl=300)

@cached(cache)
def fetch_config(key: str) -> dict:
    return load_from_db(key)

# Redis cache
class RedisCache:
    def __init__(self, client: redis.Redis, prefix: str = "cache"):
        self.client = client
        self.prefix = prefix
    
    async def get_or_set(
        self, key: str, factory, ttl: int = 3600
    ):
        full_key = f"{self.prefix}:{key}"
        cached = await self.client.get(full_key)
        if cached:
            return json.loads(cached)
        
        value = await factory()
        await self.client.setex(full_key, ttl, json.dumps(value))
        return value
```

### Cache Invalidation

| Strategy | Description | Use Case |
|----------|-------------|----------|
| **TTL** | Expire after time | Non-critical data |
| **Write-through** | Update cache on write | Consistency needed |
| **Write-behind** | Async cache update | High write volume |
| **Event-based** | Invalidate on events | Microservices |

---

## Database Optimization

### Query Optimization

```python
# ❌ N+1 query problem
for order in orders:
    print(order.customer.name)  # Separate query per order

# ✅ Eager loading
orders = await session.execute(
    select(Order).options(joinedload(Order.customer))
)

# ✅ Batch queries
customer_ids = [o.customer_id for o in orders]
customers = await session.execute(
    select(Customer).where(Customer.id.in_(customer_ids))
)
customer_map = {c.id: c for c in customers}
```

### Indexing Strategy

```sql
-- ✅ Good: Index on frequently filtered columns
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_date ON orders(customer_id, created_at);

-- ❌ Bad: Index on low cardinality column
CREATE INDEX idx_orders_is_active ON orders(is_active);  -- Only 2 values
```

---

## Async & Concurrency

### Async Patterns

```python
import asyncio

# ✅ Good: Concurrent I/O
async def fetch_all_data():
    results = await asyncio.gather(
        fetch_users(),
        fetch_orders(),
        fetch_products(),
    )
    return results

# ✅ Good: Semaphore for rate limiting
semaphore = asyncio.Semaphore(10)

async def rate_limited_fetch(url: str):
    async with semaphore:
        return await http_client.get(url)

# ✅ Good: Background tasks
async def process_webhook(data: dict):
    # Return immediately, process in background
    asyncio.create_task(send_notifications(data))
    return {"status": "accepted"}
```

---

## Connection Pooling

```python
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.pool import AsyncAdaptedQueuePool

# ✅ Good: Connection pooling
engine = create_async_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_timeout=30,
    pool_recycle=1800,
)

# Redis connection pool
import redis.asyncio as redis

pool = redis.ConnectionPool(
    host="localhost",
    port=6379,
    max_connections=20,
)
client = redis.Redis(connection_pool=pool)
```

---

## Pagination

```python
# ✅ Good: Cursor-based pagination (scalable)
async def list_orders(cursor: str | None, limit: int = 20):
    query = select(Order).order_by(Order.id)
    
    if cursor:
        cursor_id = decode_cursor(cursor)
        query = query.where(Order.id > cursor_id)
    
    query = query.limit(limit + 1)  # Fetch one extra
    orders = await session.execute(query)
    
    has_next = len(orders) > limit
    next_cursor = encode_cursor(orders[-1].id) if has_next else None
    
    return {
        "data": orders[:limit],
        "next_cursor": next_cursor,
    }

# ❌ Avoid: Offset pagination (slow at scale)
query.offset(page * limit).limit(limit)
```

---

## Benchmarking

```python
import timeit
import statistics

def benchmark(func, iterations=100):
    times = timeit.repeat(func, repeat=iterations, number=1)
    return {
        "min": min(times),
        "max": max(times),
        "mean": statistics.mean(times),
        "median": statistics.median(times),
        "stdev": statistics.stdev(times),
    }

# pytest-benchmark for test integration
def test_performance(benchmark):
    result = benchmark(expensive_function)
    assert result  # Automatic stats collection
```

---

## Anti-patterns

| Anti-pattern | Problem | Better Approach |
|--------------|---------|-----------------|
| **Cache everything** | Memory bloat | Cache hot paths |
| **No connection pooling** | Connection exhaustion | Pool connections |
| **Sync in async** | Blocks event loop | Use async libraries |
| **Unbounded queries** | Memory explosion | Pagination |
| **Premature optimization** | Wasted effort | Profile first |

---

## Monitoring Metrics

| Metric | Target | Alert |
|--------|--------|-------|
| **P50 Latency** | < 100ms | > 200ms |
| **P99 Latency** | < 500ms | > 1s |
| **Error Rate** | < 0.1% | > 1% |
| **Throughput** | Baseline | -20% |
| **CPU Usage** | < 70% | > 90% |

---

## References

- [High Performance Python](https://www.oreilly.com/library/view/high-performance-python/9781492055013/)
- [Database Performance at Scale](https://www.scylladb.com/resources/)
- [Caching Best Practices](https://aws.amazon.com/caching/best-practices/)
