Contribution Guide & Branching Strategy

## Branch Naming Conventions
Use consistent, descriptive branch names to make work easier to follow:

- `feature/<feature-name>` — new features (e.g., `feature/login-auth`)
- `fix/<bug-name>` — bug fixes (e.g., `fix/navbar-alignment`)
- `chore/<task-name>` — maintenance or tooling updates
- `docs/<update-name>` — documentation changes (e.g., `docs/update-readme`)

Keep branch names lowercase, use hyphens to separate words, and keep them focused and short.

## Pull Request Template
We use a PR template to standardize submissions: see `.github/pull_request_template.md`.

When creating a PR:
- Pick the appropriate branch type and create a concise title.
- Link to related issues (e.g., `Fixes #12`).
- Add steps to reproduce (if applicable) and include screenshots or logs.

## Code Review Checklist
We keep the checklist in `.github/CODE_REVIEW_CHECKLIST.md`. Reviewers should verify the checklist before approving.

## Branch Protection Rules (How to configure on GitHub)
Repository administrators should enable branch protection for `main` (or your default branch):
1. Go to `Settings` → `Branches` → `Add rule`.
2. Set `Branch name pattern` to `main`.
3. Enable **Require pull request reviews before merging**.
4. Enable **Require status checks to pass before merging** and add CI checks (lint/test pipelines).
5. Enable **Require branches to be up to date before merging** to prevent merge conflicts.
6. Optionally enable **Include administrators** to enforce rules for admins too.

This ensures changes are reviewed, tested, and validated before merge.

## How this helps
- Improves code quality and reduces regressions.
- Makes reviews faster and more consistent.
- Improves traceability between issues and code changes.

## Visual Evidence
When possible, include screenshots of a PR with passing checks and resolved comments to demonstrate the process during onboarding or documentation.

---

Thanks for contributing! If you have questions about this workflow, open an issue or ask a teammate.