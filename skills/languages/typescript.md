---
description: TypeScript patterns, type system, generics, and best practices
category: languages
auto_load:
  - when: "tsconfig.json"
    in: ["files"]
  - when: "*.ts"
    in: ["files"]
related_skills:
  - frameworks/nextjs.md
---

# TypeScript

Patterns, idioms, and best practices for TypeScript development.

---

## Type System Basics

### Primitive Types

```typescript
// Basic types
const name: string = "Alice";
const age: number = 30;
const isActive: boolean = true;
const nothing: null = null;
const notDefined: undefined = undefined;

// Arrays
const numbers: number[] = [1, 2, 3];
const names: Array<string> = ["Alice", "Bob"];

// Tuples
const pair: [string, number] = ["Alice", 30];
```

### Objects and Interfaces

```typescript
// Interface (preferred for object shapes)
interface User {
  id: string;
  email: string;
  name?: string;  // Optional
  readonly createdAt: Date;  // Immutable
}

// Type alias (for unions, primitives)
type Status = "pending" | "active" | "archived";
type ID = string | number;
```

---

## Advanced Types

### Union and Intersection

```typescript
// Union: one of many
type Result<T> = T | Error;
type StringOrNumber = string | number;

// Intersection: all combined
type Admin = User & { permissions: string[] };
```

### Generics

```typescript
// Generic function
function identity<T>(value: T): T {
  return value;
}

// Generic interface
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

// Generic constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

### Utility Types

```typescript
interface User {
  id: string;
  email: string;
  name: string;
}

// Built-in utilities
type PartialUser = Partial<User>;      // All optional
type RequiredUser = Required<User>;    // All required
type UserWithoutId = Omit<User, "id">; // Remove field
type UserEmail = Pick<User, "email">;  // Select fields
type ReadonlyUser = Readonly<User>;    // All readonly
```

---

## Type Guards

```typescript
// typeof guard
function processValue(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase();  // TypeScript knows it's string
  }
  return value * 2;  // TypeScript knows it's number
}

// in guard
interface Dog { bark(): void }
interface Cat { meow(): void }

function speak(pet: Dog | Cat) {
  if ("bark" in pet) {
    pet.bark();
  } else {
    pet.meow();
  }
}

// Custom type guard
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "email" in obj
  );
}
```

---

## Patterns

### Result Type (No Exceptions)

```typescript
type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await api.get<User>(`/users/${id}`);
    return { ok: true, value: user };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}

// Usage
const result = await fetchUser("123");
if (result.ok) {
  console.log(result.value.email);
} else {
  console.error(result.error.message);
}
```

### Branded Types

```typescript
// Prevent mixing incompatible types
type UserId = string & { readonly brand: unique symbol };
type OrderId = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId): User { ... }

const userId = createUserId("user-123");
const orderId = createOrderId("order-456");

getUser(userId);    // ✅ OK
getUser(orderId);   // ❌ Type error!
```

### Builder Pattern

```typescript
class QueryBuilder<T> {
  private filters: string[] = [];
  private sortField?: keyof T;
  
  where(field: keyof T, value: unknown): this {
    this.filters.push(`${String(field)}=${value}`);
    return this;
  }
  
  orderBy(field: keyof T): this {
    this.sortField = field;
    return this;
  }
  
  build(): string {
    return [
      ...this.filters,
      this.sortField && `sort=${String(this.sortField)}`,
    ].filter(Boolean).join("&");
  }
}

// Type-safe query building
new QueryBuilder<User>().where("email", "test@example.com").build();
```

---

## Async Patterns

```typescript
// Async functions return Promise
async function fetchData(): Promise<Data> {
  const response = await fetch("/api/data");
  return response.json();
}

// Promise.all for concurrent
const [users, orders] = await Promise.all([
  fetchUsers(),
  fetchOrders(),
]);

// Error handling
try {
  const data = await fetchData();
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.statusCode);
  }
}
```

---

## Strict Mode Settings

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,              // Enable all strict checks
    "noImplicitAny": true,       // No implicit any
    "strictNullChecks": true,    // null/undefined checking
    "noUnusedLocals": true,      // No unused variables
    "noUnusedParameters": true,  // No unused params
    "noImplicitReturns": true,   // All paths must return
    "exactOptionalPropertyTypes": true
  }
}
```

---

## Anti-patterns

| Anti-pattern | Problem | Better Approach |
|--------------|---------|-----------------|
| `any` everywhere | No type safety | Use `unknown`, generics |
| Type assertions | Bypasses checking | Type guards |
| Enum (numeric) | Runtime overhead | String literals |
| Classes for data | Verbose | Interfaces + functions |
| `!` non-null | Hides bugs | Proper null checking |

---

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Type Challenges](https://github.com/type-challenges/type-challenges)
- [Total TypeScript](https://www.totaltypescript.com/)
