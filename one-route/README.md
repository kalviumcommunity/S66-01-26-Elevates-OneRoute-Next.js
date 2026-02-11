## Overview

This repo contains a [Next.js](https://nextjs.org) App Router project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). The `app/` directory powers both UI routes and API endpoints, so a clear, consistent strategy for file-based routing is essential.

## 1. File-Based Routing Primer

Every folder inside `app/api/` becomes a REST endpoint, and each `route.ts` exports HTTP verb handlers:

```
app/
 └── api/
		 ├── users/
		 │   └── route.ts
		 ├── users/[id]/
		 │   └── route.ts
		 └── users/[id]/orders/
				 └── route.ts
```

```ts
// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
	const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
	return NextResponse.json(users); // 200 OK
}

export async function POST(req: Request) {
	const body = await req.json();
	return NextResponse.json({ message: 'User created', data: body }, { status: 201 });
}
```

## 2. RESTful Endpoint Conventions

- Use nouns for folders: `/api/users`, `/api/projects`, `/api/tasks`.
- Match HTTP verbs to intent:

| Verb | Purpose          | Example            |
|------|------------------|--------------------|
| GET  | Read list        | `/api/users`       |
| POST | Create resource  | `/api/users`       |
| GET  | Read by ID       | `/api/users/:id`   |
| PUT  | Replace resource | `/api/users/:id`   |
| PATCH| Partial update   | `/api/users/:id`   |
| DELETE | Remove         | `/api/users/:id`   |

Keep folder names lowercase, plural, and consistent to avoid integration drift.

## 3. Route Hierarchy Blueprint

| Resource        | Folder structure                      | Notes                              |
|-----------------|---------------------------------------|------------------------------------|
| Users           | `app/api/users/route.ts`              | Collection route                   |
| User detail     | `app/api/users/[id]/route.ts`         | Dynamic segment for ID lookups     |
| Orders          | `app/api/orders/route.ts`             | Top-level orders collection        |
| User orders     | `app/api/users/[id]/orders/route.ts`  | Nested relationship by user        |

Add more folders using the same pattern for related resources (`projects`, `tasks`, etc.).

## 4. Pagination and Filtering

Paginate any list endpoint to prevent unbounded result sets:

```ts
export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const page = Number(searchParams.get('page')) || 1;
	const limit = Number(searchParams.get('limit')) || 10;
	// TODO: fetch data based on page + limit
	return NextResponse.json({ page, limit, data: [] });
}
```

Keep query parameters short and predictable (`page`, `limit`, `status`, `sort`).

## 5. Error Handling & Status Codes

- 2xx for success (`200` GET, `201` POST, `204` DELETE without body).
- 4xx for client issues (`400` validation, `404` missing record, `409` conflict).
- 5xx for unexpected server failures.

```ts
if (!user) {
	return NextResponse.json({ error: 'User not found' }, { status: 404 });
}
```

Give callers actionable messages, but avoid leaking internal details.

## 6. Testing the API

| Scenario | Command |
|----------|---------|
| List users | `curl -X GET http://localhost:3000/api/users` |
| Create user | `curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"name":"Charlie"}'` |
| Fetch detail | `curl -X GET http://localhost:3000/api/users/123` |
| Update user | `curl -X PUT http://localhost:3000/api/users/123 -H "Content-Type: application/json" -d '{"name":"Updated"}'` |
| Delete user | `curl -X DELETE http://localhost:3000/api/users/123` |

Postman collections work equally well; export them into `docs/api-tests/` and capture screenshots for evidence when submitting deliverables.

## 7. Documentation Checklist

Include the following in project docs:

- Route hierarchy table (UI + API) with HTTP verb coverage.
- Sample requests/responses, including pagination and error payloads.
- Testing proof (curl transcripts, Postman screenshots in `docs/api-tests/`).
- Reflection on naming consistency: aligning on lowercase plural nouns makes routes guessable, reduces client bugs, and simplifies onboarding because developers can infer endpoints from resource names alone.

## 8. Unified Response Envelope

Standardizing response shapes keeps frontend code simple and observability tooling reliable. Every route in this project returns the same envelope:

```json
{
	"success": true,
	"message": "Human-friendly summary",
	"data": {},
	"timestamp": "2025-10-30T10:00:00Z"
}
```

Errors share the same structure but add a typed error block:

```json
{
	"success": false,
	"message": "Missing required field: name",
	"error": {
		"code": "E001",
		"type": "VALIDATION_ERROR"
	},
	"timestamp": "2025-10-30T10:00:00Z"
}
```

Implementations live in [src/lib/responseHandler.ts](src/lib/responseHandler.ts) and are shared by every API route.

## 9. Global Handler Utility

Use `sendSuccess` and `sendError` for all HTTP handlers to guarantee the envelope above:

```ts
// src/lib/responseHandler.ts
export const sendSuccess = <T>(data: T, message = 'Success', status = 200) => { /* ... */ };
export const sendError = (message = 'Something went wrong', errorType = 'INTERNAL_ERROR', status = 500, details?: unknown) => { /* ... */ };
```

Example usage can be seen in [src/app/api/users/route.ts](src/app/api/users/route.ts) and [src/app/api/tasks/route.ts](src/app/api/tasks/route.ts), ensuring both read-heavy and write-heavy routes behave consistently for consumers.

## 10. Error Codes

The handler pulls canonical codes from [src/lib/errorCodes.ts](src/lib/errorCodes.ts):

| Key | Code | When to use |
|-----|------|-------------|
| `VALIDATION_ERROR` | `E001` | Missing/invalid input |
| `NOT_FOUND` | `E002` | Resource lookup failed |
| `DATABASE_FAILURE` | `E003` | Persistence layer issues |
| `INTERNAL_ERROR` | `E500` | Unknown/unexpected state |

Because both the symbolic key and numeric code are emitted, logs and dashboards can filter by either dimension without extra parsing.

## 11. Developer Experience & Observability

- Predictable JSON unlocks simple frontend guards: one place to read `success`, branching only when needed.
- Error telemetry (Sentry, Datadog, Postman monitors) can group by `error.type` or `error.code`, surfacing noisy endpoints fast.
- Shared timestamps make correlation with server logs immediate and expose clock drift.
- Onboarding improves because each new API file imports the same helpers instead of inventing its own patterns.

## 12. Input Validation with Zod

Data validation is critical for API reliability and security. This project uses [Zod](https://zod.dev) for runtime schema validation that provides type safety and descriptive error messages.

### Schema Definitions

Schemas are centralized in `src/lib/schemas/` and define the shape of valid input for each API endpoint:

#### User Schema
```ts
// src/lib/schemas/userSchema.ts
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "User must be 18 or older"),
});

export type UserInput = z.infer<typeof userSchema>;
```

#### Task Schema
```ts
// src/lib/schemas/taskSchema.ts
import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").min(3, "Title must be at least 3 characters long"),
  status: z.enum(["pending", "in-progress", "done"]).optional().default("pending"),
});

export type TaskInput = z.infer<typeof taskSchema>;
```

### Validation in API Handlers

All POST and PUT routes use Zod to validate input before processing:

```ts
// src/app/api/users/route.ts
import { ZodError } from 'zod';
import { userSchema } from '@/lib/schemas/userSchema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = userSchema.parse(body);

    const newUser = {
      id: Date.now(),
      ...validatedData,
    };

    return sendSuccess(newUser, 'User created successfully', 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(
        'Validation Error',
        'VALIDATION_ERROR',
        400,
        error.issues.map((e) => ({ field: e.path[0], message: e.message }))
      );
    }
    return sendError('Failed to create user', 'INTERNAL_ERROR', 500, error);
  }
}
```

### Testing Validation

#### ✅ Valid Request (Passing)

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "age": 25
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1707561600000,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "age": 25
  },
  "timestamp": "2026-02-11T10:00:00Z"
}
```

#### ❌ Invalid Request (Failing)

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "A",
    "email": "not-an-email",
    "age": 16
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation Error",
  "error": {
    "code": "E001",
    "type": "VALIDATION_ERROR"
  },
  "data": [
    {
      "field": "name",
      "message": "Name must be at least 2 characters long"
    },
    {
      "field": "email",
      "message": "Invalid email address"
    },
    {
      "field": "age",
      "message": "User must be 18 or older"
    }
  ],
  "timestamp": "2026-02-11T10:00:00Z"
}
```

#### Task Endpoint Examples

**Create Task - Valid:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete API documentation",
    "status": "in-progress"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete API documentation",
    "status": "in-progress"
  },
  "timestamp": "2026-02-11T10:00:00Z"
}
```

**Create Task - Invalid (Missing Required Field):**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "status": "pending"
  }'
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation Error",
  "error": {
    "code": "E001",
    "type": "VALIDATION_ERROR"
  },
  "data": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ],
  "timestamp": "2026-02-11T10:00:00Z"
}
```

### Schema Reuse Between Client and Server

One of the key benefits of Zod is type reusability across your full-stack TypeScript application:

```ts
// Client-side validation (React component)
import { userSchema } from '@/lib/schemas/userSchema';

function UserForm() {
  const handleSubmit = (formData) => {
    try {
      const validated = userSchema.parse(formData);
      // Send to API
      fetch('/api/users', { method: 'POST', body: JSON.stringify(validated) });
    } catch (error) {
      // Display client-side errors
    }
  };
  
  return <form onSubmit={handleSubmit}>{/* inputs */}</form>;
}
```

```ts
// Server-side validation (API route)
// Uses the exact same schema - no duplication, guaranteed consistency
```

### Why Validation Consistency Matters

1. **Single Source of Truth**: Defining validation rules once and reusing them prevents drift between client and server implementations.
2. **Improved Security**: Server-side validation ensures malicious clients cannot bypass business logic, even if they modify client-side checks.
3. **Better UX**: Consistent error messages and fields provide users with clear feedback across web and API interfaces.
4. **Team Coordination**: Clear schema definitions in a shared location reduce communication overhead and onboarding time.
5. **Type Safety**: `z.infer<>` automatically generates TypeScript types, eliminating manual type definitions and keeping types synchronized with runtime validation logic.

## Getting Started

Run the development server from `one-route/`:

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to load the app. Edit `app/page.tsx` and leverage hot reload for fast iteration.

## Deployment

Deploy via [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) or your preferred host. See the [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying) for configuration tips.
