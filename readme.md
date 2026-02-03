

# One Route

**Unified Internship & Mentorship Tracking Portal**

## 📌 Problem Statement

College students struggle to track internship applications and mentorship feedback across multiple platforms such as email, LinkedIn, spreadsheets, and messaging apps. This fragmentation leads to missed deadlines, poor follow-ups, lost feedback, and inefficient career planning.

## 💡 Solution Overview

** One Route** is a unified, web-based portal that centralizes:

* Internship application tracking
* Application status updates
* Mentor feedback and notes
* Reminders and progress visualization

The platform helps students manage their career journey in one place, improve follow-up discipline, and make data-driven decisions.

---

## 👥 Target Users

* Undergraduate and graduate students applying for internships
* Students participating in mentorship or career guidance programs

---

## 🗂️ Folder Structure

```
ios-one-route/
│
├── frontend/
│   ├── public/              # Static assets (index.html, icons)
│   └── src/
│       ├── components/      # Reusable UI components (Navbar, Footer)
│       ├── pages/           # Application pages (Login, Dashboard, Internships)
│       ├── services/        # API calls and helpers
│       ├── styles/          # CSS files
│       └── App.js           # Main app component & routes
│
├── backend/
│   ├── controllers/         # Business logic for routes
│   ├── models/              # Database schemas
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth & error handling
│   ├── config/              # DB and environment config
│   └── server.js            # Express server entry point
│
├── .env.example             # Sample environment variables
├── package.json             # Project dependencies
├── README.md                # Project documentation
└── docker-compose.yml       # Container setup (optional)
```

---

## ⚙️ Setup Instructions

### 1️⃣ Prerequisites

* Node.js (v18+)
* MongoDB (local or cloud)
* Git

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/kalviumcommunity/S66-01-26-Elevates-OneRoute-Next.js
cd one-route
```

### 3️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 4️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 5️⃣ Local Run

* Frontend: `http://localhost:3000`
* Backend API: `http://localhost:5000`

---

## 🔐 Core Features (MVP)

* User signup & login (JWT authentication)
* Internship application CRUD
* Status tracking (Applied, Interview, Offer, Rejected)
* Mentor feedback linked to applications
* Dashboard with summary statistics
* Protected routes for authenticated users

---

## 🧠 Reflection: Why This Structure?

### Why this folder structure?

* **Frontend & Backend separation** enables parallel development
* **Component-based frontend** improves reusability and maintainability
* **MVC-style backend** keeps logic, routes, and models cleanly separated

### How this helps future scaling

* New features (analytics, notifications) can be added without refactoring
* Easy onboarding for new team members
* Supports CI/CD, Docker, and cloud deployment
* Clear boundaries reduce bugs during future sprints

---

## 🛠️ Development Setup: TypeScript, ESLint & Prettier

### Why Strict TypeScript?

**Strict TypeScript mode** catches errors at compile-time rather than runtime, reducing bugs in production. Our configuration includes:

- **`strict: true`** – Enables all strict type checking options
- **`noImplicitAny: true`** – Prevents using `any` type without explicit declaration, forcing developers to be intentional about types
- **`noUnusedLocals: true`** – Flags unused variables, keeping code clean
- **`noUnusedParameters: true`** – Catches unused function parameters, preventing dead code
- **`forceConsistentCasingInFileNames: true`** – Ensures consistent file naming (important for cross-platform development)
- **`skipLibCheck: true`** – Skips type checking of declaration files for faster builds

**Benefits:**
- Type safety prevents undefined variable errors before deployment
- Improved IDE autocomplete and refactoring support
- Self-documenting code through explicit type annotations
- Easier debugging and long-term maintenance

### ESLint & Prettier Rules

We enforce consistent code style through ESLint and Prettier:

**ESLint Rules:**
- **`no-console: warn`** – Warns when `console.log()` is used in production code
- **`semi: ["error", "always"]`** – Requires semicolons at end of statements
- **`quotes: ["error", "double"]`** – Enforces double quotes instead of single quotes

**Prettier Configuration:**
- Consistent 2-space indentation
- Double quotes for strings
- Semicolons at end of statements
- Trailing commas in multi-line structures (ES5 compatible)

**Why These Rules?**
- **Consistency** – Team members write code that looks the same, improving readability
- **Error Prevention** – Missing semicolons and quote mismatches are caught automatically
- **Reduced Code Review Time** – Style issues are auto-fixed, allowing reviewers to focus on logic
- **Better Onboarding** – New team members don't need to learn project-specific conventions

### Pre-Commit Hooks with Husky & lint-staged

We use **Husky** and **lint-staged** to automatically check code before commits:

**How it works:**
1. Developer stages files for commit
2. Git pre-commit hook runs automatically
3. **lint-staged** runs ESLint and Prettier on staged files only
4. If violations are found, the commit is blocked
5. Developer fixes the issues and tries again

**Configuration in `package.json`:**
```json
"lint-staged": {
  "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"]
}
```

**Benefits:**
- **Team Consistency** – All code in the repository follows the same standards
- **Catch Issues Early** – Problems are found before code reaches the repository
- **Reduced Code Review Time** – Reviewers don't need to request style fixes
- **Automated Fixes** – ESLint and Prettier automatically fix many issues

### Running Lint Checks

```bash
# Check lint violations
npm run lint

# Fix lint violations automatically
npm run lint -- --fix

# Format code with Prettier
npx prettier --write .
```

### Testing the Setup

To verify the pre-commit hooks work, try committing code that breaks a rule:

```bash
# Example: Create a file with a console.log
echo 'console.log("test")' > src/test.ts

# Try to commit
git add src/test.ts
git commit -m "test: check linting"

# The commit will fail with:
# ⚠ console.log found
# Fix and try again
```

### Example: Successful Lint Fix

When a violation is detected and auto-fixed:
```
⚠ lint-staged Running tasks for staged files...
⚠ Running "eslint --fix" on 3 files...
✓ Fixed formatting in src/components/Button.tsx
✓ Fixed import statement in src/pages/dashboard.tsx
✓ All checks passed!
✓ Commit successful
```

### Development Setup in Action

![ESLint and Prettier Configuration](./one-route/public/Screenshot%202026-02-02%20142600.png)

---

## 🗄️ Database Schema & Design

### Core Entities
One Route uses a **relational database** (PostgreSQL with Prisma ORM) with the following core entities:

- **User** — Students, mentors, and admins with roles and profiles
- **Internship** — Internship opportunities with company, title, location, and deadlines
- **Application** — Student applications with status tracking (Applied → Interview → Offer/Rejected)
- **Feedback** — Mentor reviews and ratings on applications
- **Comment** — Collaborative notes and discussion threads
- **Mentorship** — Formal mentor-student relationships
- **DashboardStats** — Pre-calculated metrics for fast dashboard queries

---

### Prisma Schema Excerpt

```prisma
// User model - represents students, mentors, and admins
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(STUDENT) // STUDENT, MENTOR, ADMIN
  bio       String?
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  applications Application[] @relation("StudentApplications")
  feedbacks    Feedback[]    @relation("MentorFeedback")
  comments     Comment[]
  mentoredBy   Mentorship[]  @relation("StudentMentorship")
  mentors      Mentorship[]  @relation("MentorRelation")
  @@index([role])
  @@index([email])
}

// Application model - tracks student internship applications
model Application {
  id           Int       @id @default(autoincrement())
  userId       Int
  internshipId Int
  status       Status    @default(APPLIED)
  appliedDate  DateTime  @default(now())
  rejectedDate DateTime?
  offerDate    DateTime?
  interviewDate DateTime?
  notes        String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  // Relations
  user       User        @relation("StudentApplications", fields: [userId], references: [id], onDelete: Cascade)
  internship Internship  @relation(fields: [internshipId], references: [id], onDelete: Cascade)
  feedbacks  Feedback[]  @relation("ApplicationFeedback")
  comments   Comment[]   @relation("ApplicationComments")

  @@unique([userId, internshipId]) // Prevent duplicate applications
  @@index([userId])
  @@index([internshipId])
  @@index([status])
}

enum Role {
  STUDENT
  MENTOR
  ADMIN
}

enum Status {
  APPLIED
  INTERVIEW
  REJECTED
  OFFER
  ACCEPTED
  DECLINED
}
```

See [one-route/prisma/schema.prisma](one-route/prisma/schema.prisma) for the complete schema.

---

### Keys, Constraints & Relationships

#### **Primary Keys (PKs)**
Every entity has an auto-incrementing integer `id` as its primary key, ensuring uniqueness and fast lookups:
```
User.id, Internship.id, Application.id, Feedback.id, Comment.id, Mentorship.id, DashboardStats.id
```

#### **Foreign Keys (FKs)**
Define relationships between tables and enforce referential integrity:
```
Application.userId → User.id (which student applied)
Application.internshipId → Internship.id (which position)
Feedback.applicationId → Application.id (which application is reviewed)
Feedback.mentorId → User.id (which mentor is reviewing)
Comment.applicationId → Application.id (discussion on which application)
Comment.userId → User.id (who wrote the comment)
Mentorship.studentId → User.id (the mentored student)
Mentorship.mentorId → User.id (the mentoring mentor)
```

#### **Unique Constraints**
Prevent invalid duplicate records:
```sql
User.email UNIQUE — Only one user per email
Application.(userId, internshipId) UNIQUE — Can't apply to same job twice
Mentorship.(studentId, mentorId) UNIQUE — One mentorship per student-mentor pair
```

#### **Cascade Delete Rules**
Maintains consistency when parent records are deleted:
```
DELETE User → CASCADE deletes their Applications, Feedbacks, Comments, Mentorships
DELETE Internship → CASCADE deletes its Applications
DELETE Application → CASCADE deletes its Feedbacks, Comments
```

#### **Indexes (Performance)**
Strategic indexes on frequently queried columns:
```
User: index on [role] (filter by STUDENT/MENTOR/ADMIN)
User: index on [email] (login lookups)
Application: index on [userId] (student's applications)
Application: index on [internshipId] (position's applicants)
Application: index on [status] (filter offers, rejections, interviews)
Internship: index on [deadline] (upcoming opportunities)
Feedback: index on [applicationId] (reviews for an application)
Feedback: index on [mentorId] (mentor's feedback history)
Comment: index on [applicationId] (discussion thread)
Comment: index on [userId] (user's comments)
```

---

### Database Normalization (1NF, 2NF, 3NF)

#### **1st Normal Form (1NF)** ✅
**Rule:** All attributes must be atomic (indivisible values).

✅ **One Route Complies:**
- No repeating groups or arrays in columns
- User.name stored as single string (not [firstName, lastName])
- Application.status stored as enum (single value, not comma-separated list)
- Each attribute holds exactly one value per row

#### **2nd Normal Form (2NF)** ✅
**Rule:** Must be in 1NF AND all non-key attributes must depend on the **full** primary key.

✅ **One Route Complies:**
- Application has composite concern (userId + internshipId), but attributes depend on full combo:
  - `status` depends on both user AND internship (you need both to know application state)
  - `appliedDate` depends on both user AND internship
- No partial dependencies (e.g., company name doesn't appear in Application table)

#### **3rd Normal Form (3NF)** ✅
**Rule:** Must be in 2NF AND non-key attributes must not depend on other non-key attributes.

✅ **One Route Complies:**
- **No transitive dependencies:**
  - Internship company name lives in `Internship` table, not duplicated in `Application`
  - User name lives in `User` table, not duplicated in `Feedback` or `Comment`
  - All data flows from primary key, never from other non-key attributes
  
- Example of **correct** design:
  ```
  ✅ Application stores: userId, internshipId, status
  ❌ Application would NOT store: userName, internshipCompany (those are derived from FKs)
  ```

**Redundancy Avoided:**
- Student name stored once in User table, referenced via userId in multiple places
- Internship details stored once, referenced via internshipId in multiple applications
- Mentor info stored once, referenced in Feedback and Mentorship tables

---

### Why This Schema Supports One Route's Goals

#### **1. Centralized Tracking** 📊
All internship data, applications, feedback, and mentorship relationships live in one integrated schema:
- Students see their applications' statuses in one place
- Mentors review feedback on multiple applications
- Dashboard aggregates stats from related tables

#### **2. Multi-Mentor Support** 👥
Separate `Feedback` table allows multiple mentors to review the same application without conflicts:
```
Application #5 can have:
  - Feedback from Mentor A (rating: 4)
  - Feedback from Mentor B (rating: 5)
  - Feedback from Mentor C (rating: 3)
```
Each mentor's review is independent and stored separately.

#### **3. Collaboration** 💬
`Comment` table enables students and mentors to discuss applications in real-time:
```
Timeline for Application #5:
  - Student: "Just applied"
  - Mentor A: "Good fit for your skills!"
  - Student: "Interview scheduled for Feb 10"
  - Mentor B: "Prepare for system design questions"
  - Student: "Got the offer! 🎉"
```

#### **4. Performance Optimization** ⚡
`DashboardStats` table caches summary metrics, preventing expensive aggregations on every page load:
```
Without cache:
  SELECT COUNT(*) FROM Application WHERE userId=1 AND status='OFFER'
  (full table scan, slow)

With cache:
  SELECT offersCount FROM DashboardStats WHERE userId=1
  (single row, O(1) instant)
```

#### **5. Scalability** 🚀
- **Denormalized stats** avoid expensive COUNT queries as user volume grows
- **Strategic indexes** ensure O(log n) lookups even with millions of records
- **Enum types** validate data at database level (not just app level)
- **Cascade deletes** prevent orphaned records and maintain consistency
- **3NF design** allows new features (notifications, analytics) without refactoring core tables

---

### Most Common Queries & Optimization

#### **Query 1: Student Dashboard Summary** (Most Frequent)
```sql
SELECT * FROM DashboardStats WHERE userId = ?;
-- Response time: O(1) — instant, single row lookup
-- Index: userId UNIQUE
```
**Why fast:** Pre-calculated metrics avoid expensive joins and aggregations.

#### **Query 2: Student's Applications**
```sql
SELECT a.*, i.company, i.title 
FROM Application a
JOIN Internship i ON a.internshipId = i.id
WHERE a.userId = ? 
ORDER BY a.appliedDate DESC;
-- Response time: O(log n) — milliseconds
-- Indexes: Application[userId], Application[internshipId]
```

#### **Query 3: Filter by Status (e.g., "Show me all offers")**
```sql
SELECT * FROM Application 
WHERE userId = ? AND status = 'OFFER';
-- Response time: O(log n)
-- Index: Application[status]
```

#### **Query 4: Feedback on Application**
```sql
SELECT f.*, u.name as mentorName
FROM Feedback f
JOIN User u ON f.mentorId = u.id
WHERE f.applicationId = ? 
ORDER BY f.createdAt DESC;
-- Response time: O(log n)
-- Index: Feedback[applicationId]
```

#### **Query 5: Upcoming Deadlines**
```sql
SELECT * FROM Internship 
WHERE deadline > NOW() AND deadline < NOW() + INTERVAL '30 days'
ORDER BY deadline ASC;
-- Response time: O(log n)
-- Index: Internship[deadline]
```

---

### Migration & Seeding Success

#### **Migration Applied** ✅
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "one-route", schema "public" at "localhost:5432"

PostgreSQL database one-route created at localhost:5432

Applying migration `20260203095105_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20260203095105_init/
    └─ migration.sql

Your database is now in sync with your schema.
✔ Generated Prisma Client (v5.22.0)
```

#### **Database Seeded** ✅
```
🌱 Seeding database...
✅ Created 5 users (2 students, 2 mentors, 1 admin)
✅ Created 3 internship opportunities
✅ Created 4 applications with various statuses
✅ Created 2 feedback entries
✅ Created 2 comments
✅ Created 2 mentorship relationships
✅ Created dashboard stats for students

🎉 Database seeded successfully!

Summary:
📊 Users: 5 (2 students, 2 mentors, 1 admin)
💼 Internships: 3
📝 Applications: 4 (statuses: APPLIED, INTERVIEW, OFFER, REJECTED)
💬 Feedback entries: 2
📋 Comments: 2
👥 Mentorships: 2
```

#### **Docker Containers Running** ✅
```
[+] Running 6/6
 ✔ one-route-app               Built                          
 ✔ Network one-route_localnet  Created                       
 ✔ Volume "one-route_db_data"  Created                       
 ✔ Container postgres_db       Started                       
 ✔ Container redis_cache       Started                       
 ✔ Container nextjs_app        Started                       
```

---

### Setup Instructions

```bash
# 1. Install Prisma dependencies
npm install @prisma/client
npm install -D prisma ts-node

# 2. Copy environment variables
cp .env.example .env
# Update DATABASE_URL in .env

# 3. Start PostgreSQL & Redis
docker-compose up -d

# 4. Run migrations to create tables
npx prisma migrate dev --name init

# 5. Seed sample data
npm run db:seed

# 6. Open Prisma Studio to explore data visually
npm run db:studio
# Visit: http://localhost:5555
```

---

## 🔗 Prisma ORM Integration

### What is Prisma?
**Prisma** is an open-source ORM (Object-Relational Mapping) that provides:
- **Type-Safe Database Access** — Generated TypeScript types prevent runtime errors
- **Auto-Generated Client** — Query builder with IDE autocomplete
- **Schema as Source of Truth** — Single definition for database and application models
- **Migrations** — Version-controlled database schema evolution
- **Visual Explorer** — Prisma Studio GUI for data management

### Why Prisma for One Route?
1. **Type Safety** — TypeScript generated types catch errors at compile-time, not runtime
2. **Developer Experience** — Autocomplete, validation, and error messages reduce bugs
3. **Query Flexibility** — Supports complex queries without raw SQL
4. **Migration Support** — Track schema changes in version control
5. **Performance** — Optimized queries with connection pooling and lazy loading

### Installation & Initialization

```bash
# Install Prisma packages
npm install @prisma/client
npm install -D prisma ts-node

# Initialize Prisma (creates /prisma folder and schema.prisma)
npx prisma init

# This creates:
# ├── prisma/
# │   ├── schema.prisma      ← Database schema definition
# │   └── migrations/         ← Migration history
# └── .env                    ← DATABASE_URL configuration
```

### Prisma Schema Definition

The `prisma/schema.prisma` file defines your complete database structure:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// User model - represents students, mentors, and admins
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(STUDENT)
  bio       String?
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  applications Application[] @relation("StudentApplications")
  feedbacks    Feedback[]    @relation("MentorFeedback")
  comments     Comment[]
  mentoredBy   Mentorship[]  @relation("StudentMentorship")
  mentors      Mentorship[]  @relation("MentorRelation")

  @@index([role])
  @@index([email])
}

// Application model - core entity tracking internship applications
model Application {
  id           Int      @id @default(autoincrement())
  userId       Int
  internshipId Int
  status       Status   @default(APPLIED)
  appliedDate  DateTime @default(now())
  rejectedDate DateTime?
  offerDate    DateTime?
  interviewDate DateTime?
  notes        String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  user       User        @relation("StudentApplications", fields: [userId], references: [id], onDelete: Cascade)
  internship Internship  @relation(fields: [internshipId], references: [id], onDelete: Cascade)
  feedbacks  Feedback[]  @relation("ApplicationFeedback")
  comments   Comment[]   @relation("ApplicationComments")

  @@unique([userId, internshipId])
  @@index([userId])
  @@index([internshipId])
  @@index([status])
}

enum Role {
  STUDENT
  MENTOR
  ADMIN
}

enum Status {
  APPLIED
  INTERVIEW
  REJECTED
  OFFER
  ACCEPTED
  DECLINED
}

// ... (Internship, Feedback, Comment, Mentorship, DashboardStats models)
```

**Key Features:**
- `@id` — Primary key with auto-increment
- `@unique` — Enforces unique values (email, combinations)
- `@default()` — Default values (timestamps, enums)
- `@relation()` — Defines relationships with cascade rules
- `@@index()` — Optimizes query performance
- `onDelete: Cascade` — Maintains data integrity

### Prisma Client Initialization

Create `src/lib/prisma.ts` for a singleton instance:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Why a Singleton?**
- Prevents multiple Prisma Client instances in development (which causes memory leaks)
- Reuses single connection pool across all requests
- Improves performance and stability

### Example Queries (Type-Safe)

```typescript
import { prisma } from '@/lib/prisma';
import { Role, Status } from '@prisma/client';

// ✅ Fetch user with all applications (type-safe)
const student = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    applications: {
      include: { internship: true, feedbacks: true },
    },
  },
});
// TypeScript knows: student.applications[0].internship.company exists

// ✅ Filter by enum (type-safe)
const offers = await prisma.application.findMany({
  where: { 
    userId: 1,
    status: Status.OFFER, // TypeScript validates enum value
  },
});

// ✅ Create with relations
const newUser = await prisma.user.create({
  data: {
    email: 'alice@student.com',
    name: 'Alice Johnson',
    role: Role.STUDENT, // TypeScript validates role enum
  },
});

// ❌ This would cause TypeScript error:
// const invalidRole = await prisma.user.create({
//   data: { role: 'INVALID_ROLE' } // TypeScript error: not a valid Role
// });
```

### Prisma Commands (Quick Reference)

```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Create and apply a migration
npx prisma migrate dev --name add_users_table

# Apply migrations in production
npx prisma migrate deploy

# View migration history
npx prisma migrate status

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (GUI for data management)
npx prisma studio
```

### Connection Verification

**Successful Connection Log:**
```
✔ Generated Prisma Client (v5.22.0) in 164ms
✔ Prisma Client is ready
✔ Connected to PostgreSQL database at localhost:5432/one-route
```

**Testing Connection:**
```typescript
// pages/api/test-connection.ts
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  try {
    const userCount = await prisma.user.count();
    const appCount = await prisma.application.count();
    res.status(200).json({
      status: 'connected',
      users: userCount,
      applications: appCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
}
```

**Successful Response:**
```json
{
  "status": "connected",
  "users": 5,
  "applications": 4
}
```

### Prisma Studio Verification

Run `npm run db:studio` and verify data in the GUI:

```
Prisma Studio running at:
→ Local:      http://localhost:5555
→ On Network: http://192.168.x.x:5555

Browse Tables:
  ✓ User (5 records)
  ✓ Internship (3 records)
  ✓ Application (4 records)
  ✓ Feedback (2 records)
  ✓ Comment (2 records)
  ✓ Mentorship (2 records)
  ✓ DashboardStats (2 records)
```

### Benefits of Prisma for One Route

#### **Type Safety** 🛡️
```typescript
// Before Prisma (raw SQL):
const result = await db.query('SELECT * FROM users WHERE id = ?', [id]);
// What is result? Unknown! Could have wrong properties, might crash.

// After Prisma:
const user = await prisma.user.findUnique({ where: { id } });
// TypeScript knows: user has id, email, name, role, bio, avatar, createdAt, updatedAt
// IDE autocomplete works: user.ap[TAB] → user.applications
```

#### **Query Reliability** ✅
```typescript
// Complex query with Prisma (readable, type-safe):
const mentorFeedback = await prisma.feedback.findMany({
  where: {
    applicationId: appId,
    mentor: { role: 'MENTOR' },
  },
  include: {
    mentor: { select: { name: true, email: true } },
    application: { include: { internship: true } },
  },
});

// Same query in raw SQL (error-prone, hard to maintain):
const query = `
  SELECT f.*, u.name, u.email, i.title, i.company
  FROM feedback f
  JOIN users u ON f.mentorId = u.id
  JOIN applications a ON f.applicationId = a.id
  JOIN internships i ON a.internshipId = i.id
  WHERE f.applicationId = $1 AND u.role = 'MENTOR'
`;
```

#### **Developer Productivity** 🚀
- Autocomplete suggests available fields and relations
- Compile-time error checking prevents bugs
- Migration management tracks schema evolution
- Prisma Studio provides visual data exploration
- No need to write database access layer (DAO/Repository pattern)

#### **Scalability** 📈
- Connection pooling optimizes database resources
- Lazy loading prevents N+1 query problems
- Indexes and constraints enforced at schema level
- Migrations enable painless schema evolution
- Type generation ensures frontend-backend alignment

---

## 🔄 Database Migrations & Data Management

### Migration Workflow

Prisma uses a **migration-first** approach to safely manage schema evolution:

#### **1. Create a Migration** (When you change `schema.prisma`)
```bash
# Make changes to prisma/schema.prisma
# Then create a migration

npx prisma migrate dev --name add_feedback_rating

# This:
# 1. Generates migration file: migrations/20260203_add_feedback_rating/migration.sql
# 2. Applies migration to development database
# 3. Regenerates Prisma Client
```

#### **2. Review Migration SQL** (Safety Check)
```bash
# View what will be executed
cat migrations/20260203_add_feedback_rating/migration.sql

# Example output:
# ALTER TABLE "Feedback" ADD COLUMN "rating" INTEGER;
# CREATE INDEX "Feedback_rating_idx" ON "Feedback"("rating");
```

#### **3. Apply to Staging** (Before Production)
```bash
# In staging environment:
export DATABASE_URL="postgresql://user:pass@staging-db:5432/one-route"

npx prisma migrate deploy

# Verify changes in staging before touching production
npx prisma studio  # Check data visually
```

#### **4. Deploy to Production** (With Backups)
```bash
# CRITICAL: Always backup before production migration!
# (See backup instructions below)

export DATABASE_URL="postgresql://user:pass@prod-db:5432/one-route"

# Apply all pending migrations
npx prisma migrate deploy

# Verify success
npx prisma migrate status
```

### Safe Rollback Procedures

#### **Scenario 1: Rollback Before Production Deployment**
```bash
# If you created a migration but haven't deployed to production yet:

# Option A: Undo latest migration (development only)
npx prisma migrate dev --name undo_feature_name
# Create a new migration that reverts changes

# Option B: Reset development database completely
npx prisma migrate reset
# WARNING: Deletes all data in development
```

#### **Scenario 2: Rollback After Production Deployment**
```bash
# If a migration caused production issues:

# Step 1: Create a reverse migration
npx prisma migrate dev --name revert_problematic_change

# Edit the new migration file to reverse the changes:
# migrations/20260203_revert_problematic_change/migration.sql

# Step 2: Test the reverse migration in staging
export DATABASE_URL="postgresql://user:pass@staging-db:5432/one-route"
npx prisma migrate deploy

# Step 3: If staging passes, apply to production
export DATABASE_URL="postgresql://user:pass@prod-db:5432/one-route"
npx prisma migrate deploy

# Step 4: Monitor for issues
npx prisma studio
```

#### **Scenario 3: Emergency Rollback (Database Restore)**
```bash
# If migration caused data corruption:

# 1. Restore from backup
# (See backup procedures below)

# 2. After restore, check migration history
npx prisma migrate status

# 3. If needed, manually resolve migration state
npx prisma migrate resolve --rolled-back 20260203_problematic_migration

# 4. Create corrective migration
npx prisma migrate dev --name fix_data_corruption
```

### Production Data Protection Strategy

#### **🔐 Pre-Migration Backups**
```bash
# Automated backup before any production migration

# PostgreSQL native backup (recommended):
pg_dump -h prod-db.example.com \
  -U postgres \
  -d one-route \
  -F c \
  -f backup-$(date +%Y%m%d-%H%M%S).sql

# Verify backup integrity:
pg_restore -l backup-20260203-143022.sql | head -20

# Store backups in secure location:
# - AWS S3 with versioning enabled
# - Google Cloud Storage with lifecycle policies
# - Azure Blob Storage with soft delete
# - Multiple geographic replicas for disaster recovery
```

#### **🧪 Staging Testing Before Production**
```bash
# Workflow:

# 1. Deploy new schema to staging with production data snapshot
export DATABASE_URL="postgresql://user:pass@staging-db:5432/one-route"

# 2. Run migration
npx prisma migrate deploy

# 3. Run comprehensive tests
npm run test:integration

# 4. Load test with expected production traffic
npx artillery run load-test.yml

# 5. Validate data integrity
npm run validate:data

# 6. Only after all checks pass, deploy to production
export DATABASE_URL="postgresql://user:pass@prod-db:5432/one-route"
npx prisma migrate deploy
```

#### **📊 Health Checks & Monitoring**
```typescript
// src/lib/health-check.ts
import { prisma } from '@/lib/prisma';

export async function databaseHealthCheck() {
  try {
    // Test basic connectivity
    const userCount = await prisma.user.count();
    
    // Verify key constraints
    const uniqueEmails = await prisma.user.findMany({
      select: { email: true }
    });
    
    // Check for orphaned records
    const orphanedApps = await prisma.application.findMany({
      where: { user: null }
    });
    
    return {
      status: orphanedApps.length === 0 ? 'healthy' : 'degraded',
      checks: {
        connectivity: ✓,
        uniqueConstraints: uniqueEmails.length > 0,
        orphanedRecords: orphanedApps.length,
      }
    };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

// Run on every deployment:
// const health = await databaseHealthCheck();
// if (health.status !== 'healthy') throw new Error('Database health check failed');
```

### Seed Script & Sample Output

#### **Seed Script Location**
```
one-route/prisma/seed.ts
```

**Contents:**
```typescript
// Creates realistic test data with all entity relationships
// - 5 users (2 students, 2 mentors, 1 admin)
// - 3 internship opportunities
// - 4 applications with different statuses
// - 2 mentor feedback entries
// - 2 discussion comments
// - 2 mentorship relationships
// - Pre-calculated dashboard stats
```

#### **Successful Seed Output** ✅
```bash
$ npm run db:seed

> one-route@0.1.0 db:seed
> prisma db seed

Environment variables loaded from .env
Running seed command `ts-node prisma/seed.ts` ...

🌱 Seeding database...

✅ Created 5 users (2 students, 2 mentors, 1 admin)
✅ Created 3 internship opportunities
✅ Created 4 applications with various statuses
✅ Created 2 feedback entries
✅ Created 2 comments
✅ Created 2 mentorship relationships
✅ Created dashboard stats for students

🎉 Database seeded successfully!

Summary:
📊 Users: 5 (2 students, 2 mentors, 1 admin)
  - Alice Johnson (STUDENT) - alice@student.com
  - Bob Smith (STUDENT) - bob@student.com
  - Sarah Chen (MENTOR) - mentor.sarah@company.com
  - James Brown (MENTOR) - mentor.james@company.com
  - Admin User (ADMIN) - admin@oneroute.com

💼 Internships: 3
  - Backend Engineer Intern @ Tech Startup Inc
  - Frontend Engineer Intern @ Design Studio Co
  - Full-Stack Developer Intern @ E-commerce Giants Ltd

📝 Applications: 4
  - Alice → Backend (INTERVIEW)
  - Alice → Frontend (APPLIED)
  - Bob → Backend (REJECTED)
  - Bob → Full-Stack (OFFER)

💬 Feedback entries: 2
  - Sarah reviewed Alice's Backend application (rating: 4)
  - James reviewed Bob's Full-Stack application (rating: 5)

📋 Comments: 2
  - Alice: "Feeling confident after the interview"
  - Bob: "Need to decide on the offer by next Friday"

👥 Mentorships: 2
  - Alice mentored by Sarah (System design focus)
  - Bob mentored by James (Career growth focus)
```

### Migration History & Status

#### **View Migration Status**
```bash
$ npx prisma migrate status

Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma

Following migrations have been applied:

migrations/
  └─ 20260203095105_init
       Status: Applied
       Timestamp: 2026-02-03 09:51:05

There are no pending migrations.
```

#### **Migration File Structure**
```
one-route/prisma/migrations/
└── 20260203095105_init/
    ├── migration.sql              # SQL to execute
    └── migration_lock.toml        # Lock file (auto-managed)

migrations/20260203095105_init/migration.sql contents:
-- Create "User" table
CREATE TABLE "User" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'STUDENT',
  ...
);
-- Create indexes
CREATE INDEX "User_role_idx" ON "User"("role");
...
```

### Data Protection Checklist

- ✅ **Pre-Migration Backup** — Full database dump before any schema change
- ✅ **Staging Validation** — Test migrations in staging with production data replica
- ✅ **Automated Tests** — Integration tests verify data integrity after migration
- ✅ **Health Checks** — Post-deployment verification of constraints and relationships
- ✅ **Rollback Plan** — Documented procedures for reverting migrations
- ✅ **Change Log** — All migrations tracked in Git with descriptive names
- ✅ **Team Communication** — Notify team before production migrations
- ✅ **Backup Retention** — Keep backups for at least 30 days
- ✅ **Disaster Recovery** — Geo-replicated backups for quick recovery
- ✅ **Audit Trail** — Track who, what, when for all migrations

### Quick Reference Commands

```bash
# Development
npx prisma migrate dev --name feature_name       # Create & apply migration
npx prisma migrate reset                         # Reset dev database (careful!)
npm run db:seed                                  # Populate sample data
npm run db:studio                                # Visual data explorer

# Production
npx prisma migrate deploy                        # Apply migrations (read-only check)
npx prisma migrate status                        # View migration history
npx prisma migrate resolve --rolled-back MigrationName  # Manual state fix

# Debugging
npx prisma validate                              # Check schema syntax
npx prisma format                                # Auto-format schema
DEBUG=* npm run dev                              # Enable query logging
```

---

### Migration Logs (Success Evidence)

```
✔ Generated Prisma Client (v5.22.0) in 164ms

Applying migration `20260203095105_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20260203095105_init/
    └─ migration.sql

Your database is now in sync with your schema. ✓

🎉 Database seeded successfully!

Summary:
📊 Users: 5 (2 students, 2 mentors, 1 admin)
💼 Internships: 3
📝 Applications: 4 (APPLIED, INTERVIEW, OFFER, REJECTED)
💬 Feedback entries: 2
📋 Comments: 2
👥 Mentorships: 2
```

---

## 📋 Entity-Relationship Diagram (ER)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ONE ROUTE DATABASE SCHEMA                           │
└─────────────────────────────────────────────────────────────────────────────┘

                                    ┌────────────┐
                                    │    USER    │
                                    ├────────────┤
                                    │ id (PK)    │
                                    │ email      │
                                    │ name       │
                                    │ role       │◄──── STUDENT
                                    │ password   │      MENTOR
                                    │ bio        │      ADMIN
                                    │ avatar     │
                                    └────────────┘
                                       ▲  ▲  ▲
                                      │  │  │
                    ┌──────────────────┘  │  └─────────────────────────┐
                    │                     │                             │
                    │                     │                             │
            ┌───────┴──────────┐  ┌───────┴────────────┐      ┌────────┴────────┐
            │   APPLICATION    │  │    MENTORSHIP    │      │    FEEDBACK     │
            ├──────────────────┤  ├──────────────────┤      ├─────────────────┤
            │ id (PK)          │  │ id (PK)          │      │ id (PK)         │
            │ userId (FK)      │  │ studentId (FK)   │      │ applicationId   │
            │ internshipId (FK)│  │ mentorId (FK)    │      │ (FK)            │
            │ status           │  │ startDate        │      │ mentorId (FK)   │
            │ appliedDate      │  │ endDate          │      │ content         │
            │ offerDate        │  │ notes            │      │ rating (1-5)    │
            │ rejectedDate     │  └──────────────────┘      │ createdAt       │
            │ interviewDate    │         │                   └─────────────────┘
            │ notes            │         │                            ▲
            └──────────────────┘         │                            │
                    │                    │                            │
                    │                    │              ┌─────────────┘
                    │                    │              │
                    │                    │              │
         ┌──────────┴──────────┐         │              │
         │    COMMENT          │         │              │
         ├─────────────────────┤         │              │
         │ id (PK)             │         │              │
         │ applicationId (FK)  │         │              │
         │ userId (FK)         │         │              │
         │ content             │         │              │
         │ createdAt           │         │              │
         └─────────────────────┘         │              │
                                         │              │
                        ┌────────────────┴──────────────┤
                        │                               │
                    ┌───┴───────────┐          ┌────────┴──────┐
                    │  INTERNSHIP   │          │ DASHBOARD     │
                    ├───────────────┤          │  STATS        │
                    │ id (PK)       │          ├───────────────┤
                    │ title         │          │ id (PK)       │
                    │ company       │          │ userId (FK)   │
                    │ description   │          │ totalApps     │
                    │ location      │          │ appliedCount  │
                    │ salary        │          │ interviewCnt  │
                    │ deadline      │          │ offersCount   │
                    │ link          │          │ rejectedCnt   │
                    │ notes         │          │ mentorsCount  │
                    └───────────────┘          │ feedbackCnt   │
                                              └───────────────┘

═══════════════════════════════════════════════════════════════════════════════

---

## 🧪 Testing & Deployment

* Backend unit tests using Jest
* Manual end-to-end testing for key user flows
* CI/CD via GitHub Actions
* Deployment-ready for platforms like Render, Railway, or AWS

---

## 📸 Screenshot (Local App Running)

```md
![Dashboard Screenshot](./screenshots/dashboard.png)
```

---

## 🔐 Development Setup: Environment Variables

This project uses environment variables to manage sensitive configuration such as database credentials and authentication secrets.

---

## 🔐 Environment Variables

This project uses environment variables to manage sensitive configuration such as database credentials and authentication secrets.

### `.env.example`

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/one-route
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

### Setup

```bash
copy .env.example .env
```

### Notes

* `.env` files are ignored via `.gitignore`
* Never commit real secrets
* Use platform-managed environment variables in production

---

## 🐳 Containerized Deployment

### Dockerfile Overview

* [Dockerfile](Dockerfile) builds the Next.js app that lives inside the `one-route` workspace using the lightweight `node:20-alpine` base image.
* The working directory is `/app`, `package*.json` files are copied in first for efficient layer caching, and `npm install` pulls dependencies.
* `COPY one-route .` brings the actual Next.js source into the container, `npm run build` runs the production build, and the container starts via `npm run start` on port 3000.

### docker-compose Services

* [docker-compose.yml](docker-compose.yml) declares every service on the shared `localnet` bridge network for simple name-based service discovery.
* **app** – Builds from the local Dockerfile, maps port `3000:3000`, and injects `DATABASE_URL` plus `REDIS_URL` pointing at the internal service names (`db`, `redis`).
* **db** – Uses `postgres:15-alpine`, persists data in the `db_data` named volume, exposes port `5432`, and sets user/password/db via environment variables.
* **redis** – Runs `redis:7-alpine`, exposes port `6379`, and shares the same network for low-latency caching support.

### Networks, Environment Variables, and Volumes

* `localnet` keeps traffic scoped between the three containers while still allowing explicit port publishing to the host.
* `DATABASE_URL` and `REDIS_URL` make the Next.js server configurable without hard-coding internal addresses; override them in `.env` or Compose overrides for different environments.
* `db_data` stores PostgreSQL state outside the container lifecycle so database restarts do not wipe tables.

### Running the Stack

```bash
docker-compose up --build
```

* Reach the web app at `http://localhost:3000` once `npm run start` logs “ready - started server”.
* Validate PostgreSQL with `docker exec -it postgres_db psql -U postgres -d mydb` and Redis with `docker exec -it redis_cache redis-cli PING`.
* Use `docker ps` to confirm all containers are healthy; stop everything with `docker-compose down` (add `-v` if you deliberately want to drop `db_data`).

### Example Logs & Verification Artifacts

```
app_1     | ready - started server on 0.0.0.0:3000, url: http://localhost:3000
db_1      | database system is ready to accept connections
redis_1   | 1:M * Ready to accept connections
```


### Reflection & Troubleshooting Notes

* Because the Next.js project lives under `one-route/`, the Dockerfile copies dependency manifests from that folder instead of the repo root—this avoids missing-module errors at build time.
* Port conflicts on 3000, 5432, or 6379 can be resolved by editing the `ports` mappings in [docker-compose.yml](docker-compose.yml); keep the container-side port unchanged so internal communication still works.
* Slow cold builds are usually due to dependency installs; rely on Docker layer caching by avoiding unnecessary changes to `package*.json` for incremental rebuilds.

---

## 🏁 Final Note

**One Route** delivers a focused MVP that solves a real student pain point while maintaining a scalable architecture for future growth. The project is structured, testable, and demo-ready within a 4-week sprint.
