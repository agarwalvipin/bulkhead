---
description: Next.js patterns, routing, SSR, RSC, and data fetching
category: frameworks
auto_load:
  - when: "next.config.js"
    in: ["files"]
  - when: "next.config.mjs"
    in: ["files"]
  - when: "next"
    in: ["dependencies"]
related_skills:
  - languages/typescript.md
---

# Next.js

Patterns and best practices for Next.js applications.

---

## App Router (v13+)

### File-Based Routing

```
app/
├── layout.tsx          # Root layout (required)
├── page.tsx            # Home page (/)
├── about/
│   └── page.tsx        # /about
├── blog/
│   ├── page.tsx        # /blog
│   └── [slug]/
│       └── page.tsx    # /blog/:slug
└── api/
    └── users/
        └── route.ts    # API route
```

### Special Files

| File | Purpose |
|------|---------|
| `page.tsx` | Route UI |
| `layout.tsx` | Shared UI wrapper |
| `loading.tsx` | Loading fallback |
| `error.tsx` | Error boundary |
| `not-found.tsx` | 404 page |

---

## Server Components (Default)

```tsx
// ✅ Good: Server Component (default)
// Can fetch data directly, no useState/useEffect
async function ProductPage({ params }: { params: { id: string } }) {
  const product = await db.product.findUnique({ 
    where: { id: params.id } 
  });
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
    </div>
  );
}

export default ProductPage;
```

### When to Use Client Components

```tsx
// Use "use client" when you need:
// - useState, useEffect, event handlers
// - Browser APIs
// - React Context

"use client";

import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

---

## Data Fetching

### Server Components (Recommended)

```tsx
// Fetch directly in component
async function Posts() {
  const posts = await fetch("https://api.example.com/posts", {
    next: { revalidate: 3600 }, // Cache for 1 hour
  }).then(res => res.json());
  
  return (
    <ul>
      {posts.map((post: Post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### Cache Options

```tsx
// No cache (always fresh)
fetch(url, { cache: "no-store" });

// Revalidate after time
fetch(url, { next: { revalidate: 60 } });

// Revalidate on demand
import { revalidatePath, revalidateTag } from "next/cache";
revalidatePath("/blog");
revalidateTag("posts");
```

---

## Server Actions

```tsx
// actions.ts
"use server";

import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  
  await db.post.create({ data: { title } });
  revalidatePath("/posts");
}

// page.tsx
import { createPost } from "./actions";

function CreatePostForm() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <button type="submit">Create</button>
    </form>
  );
}
```

---

## API Routes

```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const users = await db.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const user = await db.user.create({ data });
  return NextResponse.json(user, { status: 201 });
}

// Dynamic route: app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await db.user.findUnique({ where: { id: params.id } });
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(user);
}
```

---

## Middleware

```tsx
// middleware.ts (root level)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Auth check
  const token = request.cookies.get("token");
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
```

---

## Patterns

### Parallel Routes

```
app/
├── @modal/
│   └── photo/[id]/page.tsx
├── photo/[id]/page.tsx
└── layout.tsx
```

```tsx
// layout.tsx
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
```

### Streaming with Suspense

```tsx
import { Suspense } from "react";

export default async function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<Skeleton />}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}
```

---

## Anti-patterns

| Anti-pattern | Problem | Better Approach |
|--------------|---------|-----------------|
| Client fetch in RSC | Extra round trips | Fetch in server |
| "use client" everywhere | Lose SSR benefits | Default to server |
| No loading states | Poor UX | Suspense, loading.tsx |
| API routes for RSC | Unnecessary | Direct DB in server |
| No error boundaries | Crashes whole app | error.tsx |

---

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Migration](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
