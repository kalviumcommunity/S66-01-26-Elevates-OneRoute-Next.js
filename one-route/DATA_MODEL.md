# One Route - Data Model Reference

## 🎯 Entity Overview

This document provides a quick reference for all entities in the One Route database and how they relate to the core features.

---

## 📦 Entity Breakdown

### **1. USER** — The Foundation
Represents everyone in the system: students, mentors, and platform admins.

```
Attributes:
  - id (PK)                    # Unique identifier
  - email (UNIQUE)             # Login credential
  - name                       # Display name
  - role                       # STUDENT | MENTOR | ADMIN
  - password                   # Hashed password
  - bio                        # Profile description (optional)
  - avatar                     # Profile picture URL (optional)
  - createdAt, updatedAt       # Timestamps

Used by One Route for:
  ✅ User authentication & profiles
  ✅ Role-based access control (students vs mentors)
  ✅ Mentor assignments & feedback
```

**Why this design?**
- Unified user table supports multiple roles without table bloat
- Email is unique to prevent duplicate registrations
- `bio` and `avatar` allow rich profiles for mentor discoverability
- Passwords are hashed at application level (never stored plaintext)

---

### **2. INTERNSHIP** — Opportunity Database
Represents internship listings posted on the platform.

```
Attributes:
  - id (PK)                    # Unique identifier
  - title                      # Job title (e.g., "Backend Engineer Intern")
  - company                    # Employer name
  - description                # Job description
  - location                   # Physical or remote location
  - salary                     # Compensation (optional)
  - deadline                   # Application deadline
  - link                       # URL to original job posting
  - notes                      # Internal notes (requirements, tips)
  - createdAt, updatedAt       # Timestamps

Indexed on:
  - company (filter by employer)
  - deadline (sort upcoming opportunities)

Used by One Route for:
  ✅ Internship listing & search
  ✅ Deadline tracking & reminders
  ✅ Application target reference
```

**Why this design?**
- Central registry of opportunities prevents duplicate entries
- Deadline index enables "show me internships closing soon" queries
- Company index supports filtering by preferred employers
- Optional `salary` and `link` fields stay flexible for incomplete listings

---

### **3. APPLICATION** — Core Tracking (Heart of One Route)
The most critical entity—tracks each student's application journey.

```
Attributes:
  - id (PK)                    # Unique identifier
  - userId (FK)                # Student who applied
  - internshipId (FK)          # Position applied to
  - status                     # APPLIED | INTERVIEW | OFFER | REJECTED | ACCEPTED | DECLINED
  - appliedDate                # When student submitted application
  - interviewDate              # Interview scheduled/completed date (optional)
  - offerDate                  # When offer was received (optional)
  - rejectedDate               # When rejection was received (optional)
  - notes                      # Personal notes on the application
  - createdAt, updatedAt       # Timestamps

Unique Constraint:
  - (userId, internshipId)     # Prevents applying to same job twice

Indexed on:
  - userId (retrieve student's applications)
  - internshipId (retrieve all applicants to position)
  - status (filter by stage: show me all offers)

Relations:
  - FK to User (which student)
  - FK to Internship (which position)
  - One-to-Many with Feedback (mentor reviews)
  - One-to-Many with Comment (discussion threads)

On Delete Cascade:
  - Delete user → deletes their applications
  - Delete internship → deletes applications to it

Used by One Route for:
  ✅ Central tracking dashboard ("2 applied, 1 interview, 1 offer")
  ✅ Status visibility (show journey: Applied → Interview → Offer)
  ✅ Timeline visualization (when did each milestone occur?)
  ✅ Progress filtering ("show me all rejected applications")
```

**Why this design?**
- Status enum enforces valid state transitions
- Timeline fields (appliedDate, interviewDate, etc.) create an audit trail
- Unique constraint prevents duplicate applications
- ON DELETE CASCADE maintains referential integrity
- Multi-indexed for fast queries from both student and admin perspectives

---

### **4. FEEDBACK** — Mentor Guidance
Allows mentors to review and guide students on their applications.

```
Attributes:
  - id (PK)                    # Unique identifier
  - applicationId (FK)         # Which application is being reviewed
  - mentorId (FK)              # Which mentor is providing feedback
  - content                    # Text feedback (e.g., "Strong resume, but prepare for design questions")
  - rating                     # 1-5 scale (optional, e.g., "application quality: 4/5")
  - createdAt, updatedAt       # Timestamps

Indexed on:
  - applicationId (show all feedback on an application)
  - mentorId (show all feedback a mentor has given)

Relations:
  - FK to Application
  - FK to User (mentor)

On Delete Cascade:
  - Delete application → deletes all feedback
  - Delete mentor → deletes their feedback

Used by One Route for:
  ✅ Multi-mentor review without conflicts
  ✅ Structured guidance from experienced professionals
  ✅ Qualitative feedback on interview readiness
  ✅ Rating-based filtering ("show me applications with mentor rating 4+")
```

**Why this design?**
- Separate table allows multiple mentors to review the same application independently
- Rating field enables quick quality assessment
- Timestamps track when feedback was given (useful for time-sensitive advice)
- FK to User allows mentors to be discoverable by students

---

### **5. COMMENT** — Collaborative Discussion
Enables students and mentors to discuss applications collaboratively.

```
Attributes:
  - id (PK)                    # Unique identifier
  - applicationId (FK)         # Which application is being discussed
  - userId (FK)                # Who wrote the comment (student or mentor)
  - content                    # Comment text
  - createdAt, updatedAt       # Timestamps

Indexed on:
  - applicationId (retrieve discussion thread for an application)
  - userId (retrieve all comments by a user)

Relations:
  - FK to Application
  - FK to User (author)

On Delete Cascade:
  - Delete application → deletes all comments
  - Delete user → deletes their comments

Use Cases:
  - Student: "Interview scheduled for Feb 10!"
  - Mentor: "Prepare for system design questions"
  - Student: "Got the offer! Now deciding between two companies"
  - Mentor: "Congratulations! Here's career guidance for your decision"

Used by One Route for:
  ✅ Real-time collaboration on decisions
  ✅ Audit trail of discussions
  ✅ Mentorship guidance in context of specific applications
  ✅ Crowd-sourced insights (multiple mentors can comment)
```

**Why this design?**
- Separate from Feedback to allow informal discussion
- Simple text-based format encourages quick back-and-forth
- FK to User allows threading and attribution
- Timestamps track conversation flow

---

### **6. MENTORSHIP** — Relationship Management
Formalizes mentor-student pairings for ongoing guidance.

```
Attributes:
  - id (PK)                    # Unique identifier
  - studentId (FK)             # Student being mentored
  - mentorId (FK)              # Mentor providing guidance
  - startDate                  # When mentorship began
  - endDate                    # When mentorship ended (optional/null if active)
  - notes                      # Mentorship focus (e.g., "System design, career growth")
  - createdAt, updatedAt       # Timestamps

Unique Constraint:
  - (studentId, mentorId)      # Prevents duplicate pairings

Relations:
  - FK to User (student side)
  - FK to User (mentor side)

Used by One Route for:
  ✅ Tracking active mentor-student relationships
  ✅ Recording mentorship goals & focus areas
  ✅ Measuring mentorship impact (count of active relationships)
  ✅ Future feature: Mentorship matching algorithm
```

**Why this design?**
- Separate table models many-to-many relationship (students can have multiple mentors, mentors can have multiple students)
- Unique constraint prevents duplicate pairings
- Optional `endDate` allows tracking both active and historical mentorships
- Notes field captures mentorship focus for personalization

---

### **7. DASHBOARDSTATS** — Performance Cache
Pre-calculated summary metrics to avoid expensive aggregation queries.

```
Attributes:
  - id (PK)                    # Unique identifier
  - userId (UNIQUE FK)         # Student owning these stats
  - totalApplications          # Count of all applications
  - appliedCount               # Count with status = APPLIED
  - interviewCount             # Count with status = INTERVIEW
  - offersCount                # Count with status = OFFER
  - rejectedCount              # Count with status = REJECTED
  - mentorsCount               # Count of active mentors
  - feedbackCount              # Count of feedback entries received
  - lastUpdated                # When stats were last recalculated
  - createdAt, updatedAt       # Timestamps

Used by One Route for:
  ✅ Dashboard summary ("2 applied, 1 interview, 1 offer")
  ✅ O(1) single-row lookup instead of aggregating Application table
  ✅ Progress visualization without costly COUNT queries
```

**Why this design?**
- Denormalization trades storage for speed (typical for read-heavy dashboards)
- Updated asynchronously via background job or mutation triggers
- Eliminates N+1 query problems
- Single index on userId ensures instant dashboard loads

---

## 🔗 Relationship Diagram (Quick Version)

```
User (Student) ──→ Application ──→ Internship
                      ↓
                  Feedback ←── User (Mentor)
                  Comment ←── User (anyone)

User (Student) ──→ Mentorship ←── User (Mentor)

User (Student) ──→ DashboardStats (1-to-1)
```

---

## 🚀 Feature Mapping

### Feature: "Student applies for internship"
Entities involved: **User** (student), **Internship**, **Application**
```
1. User clicks "Apply"
2. Application record created with:
   - userId = current student
   - internshipId = position clicked
   - status = APPLIED
   - appliedDate = now()
```

### Feature: "Mentor gives feedback on application"
Entities involved: **Application**, **Feedback**, **User** (mentor)
```
1. Mentor views pending application
2. Mentor writes feedback/rating
3. Feedback record created with:
   - applicationId = application being reviewed
   - mentorId = feedback mentor
   - content = feedback text
   - rating = optional 1-5 rating
```

### Feature: "Student tracks interview process"
Entities involved: **Application**, **Comment**
```
1. Application starts with status = APPLIED
2. Student gets interview call
3. Student adds comment: "Interview scheduled Feb 10"
4. Mentor reviews and comments: "Prepare for system design"
5. Student updates application: status = INTERVIEW, interviewDate = Feb 10
6. After interview, student comments: "Went well!"
7. If rejected: status = REJECTED, rejectedDate = date
8. If offered: status = OFFER, offerDate = date
```

### Feature: "Dashboard shows progress summary"
Entities involved: **DashboardStats**, **Application** (via aggregation)
```
1. User views dashboard
2. DashboardStats query: SELECT * WHERE userId = current_user
3. Display summary (cached, O(1) lookup):
   - Total Applications: 5
   - Applied: 2
   - Interview: 1
   - Offers: 1
   - Rejected: 1
4. Timestamp check: if > 1 hour old, trigger background recalculation
```

---

## 📊 Normalization Check

| Aspect | Status | Details |
|--------|--------|---------|
| **1NF** | ✅ Pass | All attributes are atomic (no repeating groups or arrays) |
| **2NF** | ✅ Pass | No partial dependencies; all columns depend on full PK |
| **3NF** | ✅ Pass | No transitive dependencies; company name lives in Internship, not duplicated |
| **Unique Constraints** | ✅ Pass | (userId, internshipId) prevents duplicate apps; (studentId, mentorId) prevents duplicate mentorships |
| **Referential Integrity** | ✅ Pass | All FKs have ON DELETE CASCADE for consistency |
| **Indexes** | ✅ Pass | All FK and frequently-filtered columns indexed for O(1)–O(log n) performance |

---

## 🔐 Data Security & Integrity

1. **Password Security** — Hashed at application layer (bcrypt/argon2), never stored plaintext
2. **Role-Based Access** — Use `role` field to enforce authorization at API level
3. **Cascade Delete** — Removes orphaned records (e.g., deleting user deletes their apps)
4. **Unique Constraints** — Prevents business rule violations (e.g., duplicate applications)
5. **Audit Trail** — Timestamps on all entities for debugging and compliance

---

## 📈 Query Examples (Prisma Client)

```typescript
// Get student's dashboard summary
const stats = await prisma.dashboardStats.findUnique({
  where: { userId: studentId }
});

// Get applications with full details
const apps = await prisma.application.findMany({
  where: { userId: studentId },
  include: {
    internship: true,
    feedbacks: { include: { mentor: { select: { name: true } } } },
    comments: { include: { author: { select: { name: true } } } }
  },
  orderBy: { appliedDate: "desc" }
});

// Get feedback on a specific application
const feedback = await prisma.feedback.findMany({
  where: { applicationId: appId },
  include: { mentor: true }
});

// Get active mentors for a student
const mentors = await prisma.mentorship.findMany({
  where: { studentId: studentId, endDate: null },
  include: { mentor: true }
});

// Find internships closing soon
const upcoming = await prisma.internship.findMany({
  where: { deadline: { gte: new Date(), lte: new Date(Date.now() + 30*24*60*60*1000) } },
  orderBy: { deadline: "asc" }
});
```

---

## 🎓 Learning Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Constraints](https://www.postgresql.org/docs/current/sql-constraints.html)
- [Database Normalization Guide](https://en.wikipedia.org/wiki/Database_normalization)
- [One Route DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) — Full ER diagram & design rationale
