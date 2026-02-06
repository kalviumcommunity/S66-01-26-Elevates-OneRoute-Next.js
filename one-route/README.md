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

## Getting Started

Run the development server from `one-route/`:

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to load the app. Edit `app/page.tsx` and leverage hot reload for fast iteration.

## Deployment

Deploy via [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) or your preferred host. See the [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying) for configuration tips.
