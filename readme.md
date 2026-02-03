

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

Capture screenshots or copy terminal output similar to the above after running `docker ps` to show each container status for your submission.

### Reflection & Troubleshooting Notes

* Because the Next.js project lives under `one-route/`, the Dockerfile copies dependency manifests from that folder instead of the repo root—this avoids missing-module errors at build time.
* Port conflicts on 3000, 5432, or 6379 can be resolved by editing the `ports` mappings in [docker-compose.yml](docker-compose.yml); keep the container-side port unchanged so internal communication still works.
* Slow cold builds are usually due to dependency installs; rely on Docker layer caching by avoiding unnecessary changes to `package*.json` for incremental rebuilds.

---

## 🏁 Final Note

**One Route** delivers a focused MVP that solves a real student pain point while maintaining a scalable architecture for future growth. The project is structured, testable, and demo-ready within a 4-week sprint.
