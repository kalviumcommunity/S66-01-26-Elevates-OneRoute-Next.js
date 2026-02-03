

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
