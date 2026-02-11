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

## 13. Authentication & Authorization with JWT

This project implements a secure authentication system using **bcrypt** for password hashing and **JSON Web Tokens (JWT)** for session management.

### Architecture Overview

```
User Registration (Signup)
      ↓
Email & Password Input
      ↓
Validate with Zod
      ↓
Hash Password with bcrypt (10 salt rounds)
      ↓
Store in Database
      ↓
Return User Data (no password)

User Login
      ↓
Email & Password Input
      ↓
Validate with Zod
      ↓
Find User in Database
      ↓
Compare Password with bcrypt
      ↓
Generate JWT Token (1 hour expiry)
      ↓
Return Token to Client
      ↓
Client Stores Token (localStorage/sessionStorage/cookie)
      ↓
Include Token in Authorization Header for Protected Requests
```

### Password Hashing with bcrypt

Passwords are hashed using bcrypt with **10 salt rounds**:

```ts
// src/app/api/auth/signup/route.ts
import bcrypt from "bcrypt";

const hashedPassword = await bcrypt.hash(validatedData.password, 10);
```

**Why bcrypt?**
- **Irreversible**: Even if the database is compromised, attackers cannot recover passwords
- **Salted**: Each password gets a unique salt, preventing rainbow table attacks
- **Adaptive**: Becoming slower over time as hardware improves, maintaining security
- **10 rounds**: Optimal balance between security and performance (~100ms per hash)

### JWT Token Generation

On successful login, the server generates a JWT token that encodes user identity:

```ts
// src/app/api/auth/login/route.ts
import jwt from "jsonwebtoken";

const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  JWT_SECRET,
  { expiresIn: "1h" }
);
```

**Token Properties:**
- **Payload**: Contains user ID, email, and role
- **Secret**: Signed with JWT_SECRET (must be kept confidential)
- **Expiry**: Automatically expires after 1 hour
- **Non-repudiation**: Cannot be forged without the secret key

### Authentication Schemas

```ts
// src/lib/schemas/authSchema.ts
export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
```

### API Endpoints

#### 1. Signup Endpoint

**POST** `/api/auth/signup`

Creates a new user account with email and password.

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "createdAt": "2026-02-11T10:30:00Z"
  },
  "timestamp": "2026-02-11T10:30:00Z"
}
```

**Error Response (Duplicate Email - 409):**
```json
{
  "success": false,
  "message": "User with this email already exists",
  "error": {
    "code": "E409",
    "type": "DUPLICATE_USER"
  },
  "timestamp": "2026-02-11T10:30:00Z"
}
```

**Error Response (Validation - 400):**
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
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ],
  "timestamp": "2026-02-11T10:30:00Z"
}
```

#### 2. Login Endpoint

**POST** `/api/auth/login`

Authenticates a user and returns a JWT token.

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwib...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "STUDENT"
    }
  },
  "timestamp": "2026-02-11T10:35:00Z"
}
```

**Error Response (Invalid Credentials - 401):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "E401",
    "type": "INVALID_PASSWORD"
  },
  "timestamp": "2026-02-11T10:35:00Z"
}
```

**Error Response (User Not Found - 404):**
```json
{
  "success": false,
  "message": "User not found",
  "error": {
    "code": "E002",
    "type": "USER_NOT_FOUND"
  },
  "timestamp": "2026-02-11T10:35:00Z"
}
```

#### 3. Protected Routes Example

**GET** `/api/users` (requires authentication)

Fetches user list - only accessible with valid JWT token.

**Request (with token):**
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwib..."
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "page": 1,
    "limit": 10,
    "total": 4,
    "data": [
      { "id": 1, "name": "Alice", "email": "alice@example.com", "age": 25 },
      { "id": 2, "name": "Bob", "email": "bob@example.com", "age": 30 }
    ],
    "requestedBy": "john@example.com"
  },
  "timestamp": "2026-02-11T10:40:00Z"
}
```

**Error Response (Missing Token - 401):**
```json
{
  "success": false,
  "message": "Missing or invalid token",
  "error": {
    "code": "E401",
    "type": "UNAUTHORIZED"
  },
  "timestamp": "2026-02-11T10:40:00Z"
}
```

### Token Management Best Practices

#### Token Storage
- **localStorage**: Convenient but vulnerable to XSS attacks
- **sessionStorage**: Cleared on browser close, better security
- **HttpOnly Cookies**: Best practice - inaccessible to JavaScript (prevents XSS)
- **In-Memory**: Lost on page refresh, good for SPAs with refresh token mechanism

#### Recommended Approach for This Project
```ts
// Store token after login
const { token } = await response.json();
localStorage.setItem('authToken', token); // or use secure cookie

// Include in API requests
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`
};
```

#### Token Expiry & Refresh Strategy
- **Current Setup**: Tokens expire after 1 hour
- **Refresh Token Flow** (future enhancement):
  1. Issue short-lived access token (1 hour)
  2. Issue long-lived refresh token (7 days)
  3. When access token expires, use refresh token to get new access token
  4. Requires `/api/auth/refresh` endpoint

```ts
// Future: Refresh endpoint
export async function POST(req: Request) {
  const { refreshToken } = await req.json();
  const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
  const newAccessToken = jwt.sign(decoded, JWT_SECRET, { expiresIn: "1h" });
  return sendSuccess({ token: newAccessToken });
}
```

### Testing Authentication Workflow

#### Step 1: Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "email": "alice.smith@example.com",
    "password": "AliceSecure123"
  }'
```

#### Step 2: Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice.smith@example.com",
    "password": "AliceSecure123"
  }'
```

Save the returned `token` value.

#### Step 3: Access Protected Route
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN_HERE>"
```

Replace `<YOUR_JWT_TOKEN_HERE>` with the token from Step 2.

#### Step 4: Test with Invalid Token
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer invalid_token_here"
```

Expected: 401 Unauthorized response.

### Testing Logs - Screenshots

Below are the actual testing logs captured during validation of the authentication endpoints:

**Screenshot 1: Signup Validation & Authentication Tests**
![Signup and Auth Tests](./public/Screenshot%202026-02-11%20142109.png)

This screenshot shows:
- ✅ Signup endpoint validation (invalid input handling)
- ✅ Successful task creation endpoint
- ✅ Task validation with invalid data

**Screenshot 2: Protected Routes & Login Tests**
![Protected Routes Tests](./public/Screenshot%202026-02-11%20142211.png)

This screenshot shows:
- ✅ Protected GET /api/users endpoint without token (401 error)
- ✅ Protected GET /api/users endpoint with invalid token (401 error)
- ✅ Successfully missing token detection on protected routes

### Security Considerations

1. **Always Validate Input**: Zod schemas ensure type safety and prevent injection attacks
2. **Hash Passwords**: bcrypt ensures passwords are never stored in plain text
3. **HTTPS in Production**: Tokens must only be transmitted over HTTPS to prevent interception
4. **Secret Key Management**: JWT_SECRET must be kept secure (use environment variables, never commit)
5. **CORS Configuration**: Restrict API access to trusted domains only
6. **Rate Limiting**: Implement rate limiting on auth endpoints to prevent brute force attacks
7. **Token Invalidation**: Consider implementing token blacklist for logout functionality (future enhancement)

### File Structure

```
src/
├── app/api/auth/
│   ├── signup/route.ts           # User registration endpoint
│   └── login/route.ts            # User authentication endpoint
├── app/api/admin/
│   └── route.ts                  # Admin-only dashboard & role management
├── lib/
│   ├── schemas/authSchema.ts     # Zod validation schemas
│   ├── auth.ts                   # JWT token utilities
│   └── responseHandler.ts        # Unified response formatting
├── app/api/users/route.ts        # Protected route (AUTH required)
├── middleware.ts                 # Authorization & role enforcement
└── prisma/schema.prisma          # Database schema with Role enum
```

## 14. Role-Based Access Control (RBAC)

This project implements secure role-based authorization using JWT tokens and Next.js middleware. Three user roles control access to different endpoints:

### User Roles

| Role | Description | Default Access |
|------|-------------|-----------------|
| **STUDENT** | Regular users, view own data | `/api/users` (read-only) |
| **MENTOR** | Mentors, give feedback | `/api/users` (read-only) |
| **ADMIN** | System administrators, full access | `/api/admin` (all) |

All roles are defined in the Prisma schema:

```ts
// prisma/schema.prisma
enum Role {
  STUDENT
  MENTOR
  ADMIN
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String
  role  Role    @default(STUDENT)
  // ... other fields
}
```

### Authorization Flow Diagram

```
HTTP Request
      ↓
Middleware (src/middleware.ts)
      ↓
Check if route is protected?
      ├─ No → Next.next() → Handler
      ├─ Yes → Extract JWT token
              ↓
        Token exists?
              ├─ No → 401 Unauthorized
              ├─ Yes → Verify JWT signature
                      ↓
                Valid token?
                      ├─ No → 403 Forbidden (expired/invalid)
                      ├─ Yes → Extract user role from token
                              ↓
                        Check route permissions
                              ├─ /api/admin → role === "ADMIN"? 
                              │   ├─ Yes → Attach headers → Next.next()
                              │   └─ No → 403 Forbidden
                              └─ /api/users → any authenticated user
                                  └─ Attach headers → Next.next()
```

### Middleware Implementation

The middleware intercepts all requests and enforces authorization:

```ts
// src/middleware.ts
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect these routes
  const protectedRoutes = ["/api/users", "/api/admin"];
  const adminRoutes = ["/api/admin"];

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected) {
    // 1. Extract token from header
    const token = req.headers.get("authorization")?.split(" ")[1];
    
    if (!token) return 401 Unauthorized;

    // 2. Verify JWT signature
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. Check role for admin routes
    if (adminRoutes.some(r => pathname.startsWith(r)) && decoded.role !== "ADMIN") {
      return 403 Forbidden;
    }

    // 4. Attach user info to headers for downstream handlers
    const headers = new Headers(req.headers);
    headers.set("x-user-id", decoded.id);
    headers.set("x-user-email", decoded.email);
    headers.set("x-user-role", decoded.role);

    return NextResponse.next({ request: { headers } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/users/:path*", "/api/admin/:path*"],
};
```

**Key Features:**
- ✅ JWT signature verification prevents token tampering
- ✅ Role-based route access (admin-only endpoints)
- ✅ User context passed to handlers via headers
- ✅ Performance optimized with matcher (only intercepts specified paths)

### Protected Endpoints

#### 1. User Data Endpoint (Authenticated Users)

**GET** `/api/users` - List all users (requires authentication)

**Request:**
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "page": 1,
    "limit": 10,
    "total": 4,
    "data": [
      { "id": 1, "name": "Alice", "email": "alice@example.com", "age": 25 },
      { "id": 2, "name": "Bob", "email": "bob@example.com", "age": 30 }
    ],
    "requestedBy": "student@example.com"
  },
  "timestamp": "2026-02-11T12:00:00Z"
}
```

**Error Response (Missing Token - 401):**
```json
{
  "success": false,
  "message": "Missing or invalid token",
  "error": {
    "code": "E401",
    "type": "UNAUTHORIZED"
  },
  "timestamp": "2026-02-11T12:00:00Z"
}
```

#### 2. Admin Dashboard Endpoint (Admin Only)

**GET** `/api/admin` - Admin statistics and system data (admin role required)

**Request:**
```bash
curl -X GET http://localhost:3000/api/admin \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Admin dashboard accessed successfully",
  "data": {
    "totalUsers": 42,
    "usersByRole": [
      { "role": "STUDENT", "count": 35 },
      { "role": "MENTOR", "count": 6 },
      { "role": "ADMIN", "count": 1 }
    ],
    "lastAdminAction": {
      "admin": "admin@example.com",
      "timestamp": "2026-02-11T12:00:00Z",
      "action": "Viewed admin dashboard"
    }
  },
  "timestamp": "2026-02-11T12:00:00Z"
}
```

**Error Response (Non-Admin Access - 403):**
```json
{
  "success": false,
  "message": "Access denied: Admin privileges required",
  "error": {
    "code": "E403",
    "type": "FORBIDDEN"
  },
  "timestamp": "2026-02-11T12:00:00Z"
}
```

#### 3. Role Update Endpoint (Admin Only)

**POST** `/api/admin` - Update a user's role (admin role required)

**Request:**
```bash
curl -X POST http://localhost:3000/api/admin \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 5,
    "newRole": "MENTOR"
  }'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "user": {
      "id": 5,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "MENTOR",
      "updatedAt": "2026-02-11T12:05:00Z"
    },
    "changedBy": "admin@example.com",
    "timestamp": "2026-02-11T12:05:00Z"
  },
  "timestamp": "2026-02-11T12:05:00Z"
}
```

### Testing Role-Based Access

#### Scenario 1: User Accessing User Endpoint (Allowed)

```bash
# 1. Login as student
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"StudentPass123"}'

# Response includes token
# { "data": { "token": "eyJh..." } }

# 2. Access /api/users with token
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer eyJh..."

# ✅ Response: 200 OK with user list
```

#### Scenario 2: User Accessing Admin Endpoint (Denied)

```bash
# Same student token, try to access admin endpoint
curl -X GET http://localhost:3000/api/admin \
  -H "Authorization: Bearer eyJh..."

# ❌ Response: 403 Forbidden
# { "message": "Access denied: Admin privileges required" }
```

#### Scenario 3: Admin Accessing Admin Endpoint (Allowed)

```bash
# Admin logs in (role: ADMIN)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"AdminPass123"}'

# 2. Access /api/admin with admin token
curl -X GET http://localhost:3000/api/admin \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# ✅ Response: 200 OK with dashboard statistics
```

### Least Privilege Principle

This project follows the **least privilege principle**:

1. **Default Role is STUDENT**: New users register with minimal permissions
2. **Explicit Role Assignment**: Only admins can promote users to MENTOR or ADMIN
3. **Middleware Enforcement**: Every protected route checks authorization before handling requests
4. **No Privilege Escalation**: Users cannot modify their own role via API

Example flow:
```
User registers → Role = STUDENT
     ↓
Can access: /api/users (read)
Cannot access: /api/admin
     ↓
Admin manually updates role: MENTOR
     ↓
User can still only access: /api/users (read)
Cannot access: /api/admin (still requires ADMIN role)
     ↓
Admin updates role: ADMIN
     ↓
User can now access: /api/admin
```

### Adding New Roles in the Future

To add a new role (e.g., "EDITOR", "MODERATOR"):

**Step 1: Update Prisma Enum**
```ts
// prisma/schema.prisma
enum Role {
  STUDENT
  MENTOR
  ADMIN
  EDITOR      // New role
  MODERATOR   // New role
}
```

**Step 2: Run Migration**
```bash
npx prisma migrate dev --name add_editor_moderator_roles
```

**Step 3: Create New Protected Route**
```ts
// src/app/api/editor/route.ts
export async function GET(req: Request) {
  const userRole = req.headers.get("x-user-role");
  if (userRole !== "EDITOR") return 403 Forbidden;
  // ... handler logic
}
```

**Step 4: Update Middleware**
```ts
// src/middleware.ts
const editorRoutes = ["/api/editor"];
if (editorRoutes.some(r => pathname.startsWith(r)) && decoded.role !== "EDITOR") {
  return 403 Forbidden;
}
```

### Why This Matters in Team Projects

1. **Security**: Prevents unauthorized access to sensitive operations
2. **Scalability**: New roles can be added without modifying existing routes
3. **Audit Trail**: Admin actions are logged with user context
4. **Consistency**: Middleware ensures all protected routes follow the same validation
5. **Clear Permissions**: Explicit role definitions prevent confusion about who can do what

## 15. Centralized Error Handling & Logging

This project uses structured error handling and logging to ensure consistent error responses, easier debugging, and better security by redacting sensitive information in production.

### Architecture

```
Error occurs in route handler
      ↓
throw new AppError() or catch error
      ↓
handleError(error, context)
      ↓
logger.error(message, meta)  ←  Log to console/CloudWatch
      ↓
Check NODE_ENV
      ├─ development → Include full error details + stack trace
      └─ production → Generic message + [REDACTED] stack
      ↓
Return NextResponse with appropriate HTTP status
```

### Logger Utility

The logger provides structured logging with timestamps and metadata:

```ts
// src/lib/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({ level: "info", message, meta, timestamp: ... }));
  },
  warn: (message: string, meta?: any) => { ... },
  error: (message: string, meta?: any) => { ... },
  debug: (message: string, meta?: any) => { ... },
};
```

### Error Handler

The centralized error handler manages all exceptions and provides environment-specific responses:

```ts
// src/lib/errorHandler.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public code: string = "INTERNAL_ERROR",
    public statusCode: number = 500,
    public details?: any
  ) { ... }
}

export function handleError(error: any, context: string) {
  // Logs error with full details
  logger.error(`Error in ${context}`, { message, stack, ... });
  
  // Returns different response based on NODE_ENV
  if (isProd) {
    // Generic message, redacted stack
    return { message: "Something went wrong. Please try again later." };
  } else {
    // Full error details for debugging
    return { message: error.message, stack: error.stack, ... };
  }
}
```

### Usage in Routes

All API routes use consistent error handling:

```ts
import { handleError, AppError } from "@/lib/errorHandler";
import { logger } from "@/lib/logger";

export async function GET(req: Request) {
  try {
    // Route logic
    logger.info("Success message", { metadata });
    return sendSuccess(data);
  } catch (error) {
    return handleError(error, "GET /api/endpoint");
  }
}
```

### Error Responses Comparison

#### Development Mode Response

Request body or parameter validation fails:

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"A","email":"bad","password":"123"}'
```

Response (400 Bad Request, includes full details):

```json
{
  "success": false,
  "message": "Validation error",
  "error": {
    "code": "E001",
    "type": "VALIDATION_ERROR"
  },
  "details": [
    { "field": "name", "message": "Name must be at least 2 characters long" },
    { "field": "email", "message": "Invalid email address" },
    { "field": "password", "message": "Password must be at least 8 characters long" }
  ],
  "stack": "Error: Validation error\n    at Object.parse (zod/lib/...)"
}
```

Console Log (Development):

```json
{
  "level": "error",
  "message": "Error in POST /api/auth/signup",
  "meta": {
    "context": "POST /api/auth/signup",
    "errorCode": "VALIDATION_ERROR",
    "message": "Validation error",
    "stack": "Error: Validation error\n    at Object.parse (zod/lib/...)",
    "details": [ { "field": "name", "message": "..." } ]
  },
  "timestamp": "2026-02-11T13:00:00.000Z"
}
```

#### Production Mode Response

Same request in production:

Response (400 Bad Request, generic message):

```json
{
  "success": false,
  "message": "Something went wrong. Please try again later.",
  "error": {
    "code": "E001",
    "type": "VALIDATION_ERROR"
  }
}
```

Console Log (Production):

```json
{
  "level": "error",
  "message": "Error in POST /api/auth/signup",
  "meta": {
    "context": "POST /api/auth/signup",
    "errorCode": "VALIDATION_ERROR",
    "message": "Validation error",
    "stack": "[REDACTED]"
  },
  "timestamp": "2026-02-11T13:00:00.000Z"
}
```

### Error Codes Reference

| Code | Type | HTTP Status | When Used |
|------|------|-------------|-----------|
| E001 | VALIDATION_ERROR | 400 | Invalid input, Zod validation fails |
| E002 | NOT_FOUND | 404 | Resource doesn't exist |
| E003 | DATABASE_FAILURE | 500 | Database connection/query error |
| E401 | UNAUTHORIZED | 401 | Missing or invalid token |
| E403 | FORBIDDEN | 403 | Insufficient permissions |
| E409 | DUPLICATE_USER | 409 | Email already registered |
| E500 | INTERNAL_ERROR | 500 | Unexpected server error |

### Key Patterns

**Throwing AppError for business logic violations:**

```ts
if (existingUser) {
  throw new AppError(
    "User with this email already exists",
    "DUPLICATE_USER",
    409
  );
}
```

**Logging important business events:**

```ts
logger.info("User registered successfully", {
  userId: newUser.id,
  email: newUser.email,
});
```

**Logging failed attempts:**

```ts
if (!isPasswordValid) {
  logger.warn("Failed login attempt", { email });
  throw new AppError("Invalid credentials", "INVALID_PASSWORD", 401);
}
```

**Handling specific errors:**

```ts
try {
  await prisma.user.update({ ... });
} catch (error: any) {
  if (error.code === "P2025") {
    return handleError(
      new AppError("User not found", "NOT_FOUND", 404),
      "POST /api/users"
    );
  }
  return handleError(error, "POST /api/users");
}
```

### Why This Matters

**For Developers:**
- Consistent error handling reduces bugs and unexpected behavior
- Structured logs with context make debugging much faster
- Stack traces available in development, but safe in production

**For Organizations:**
- Prevents information leakage (stack traces, database details)
- Audit trail of important events for compliance
- Easier monitoring with consistent error codes

**For Users:**
- Clear, helpful error messages in development
- Safe, generic messages in production (prevents exploitation)
- Professional, trust-building experience

### File Structure

```
src/lib/
├── logger.ts              # Structured logging
├── errorHandler.ts        # Centralized error handling
├── responseHandler.ts     # Unified response formatting
└── ... other utilities

src/app/api/
├── auth/                  # Uses centralized error handling
├── admin/                 # Uses centralized error handling  
├── users/                 # Uses centralized error handling
└── tasks/                 # Uses centralized error handling
```

## Getting Started

Run the development server from `one-route/`:

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to load the app. Edit `app/page.tsx` and leverage hot reload for fast iteration.

## Deployment

Deploy via [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) or your preferred host. See the [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying) for configuration tips.
