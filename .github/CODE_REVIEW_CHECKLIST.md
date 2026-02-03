Code Review Checklist

Use this checklist for every PR review to keep reviews consistent and fast.

- [ ] Branch name follows the project naming convention
- [ ] Code builds and runs locally
- [ ] Functionality validated manually (happy path + edge cases)
- [ ] Unit/integration tests added or updated where applicable
- [ ] No console errors or warnings in dev or production builds
- [ ] ESLint and Prettier checks pass (formatting and linting)
- [ ] Code is readable and comments/documentation are meaningful
- [ ] No sensitive data (keys, secrets, PII) are included in the change
- [ ] Performance and security implications considered
- [ ] Appropriate files updated (README / docs) when behavior changes
- [ ] Tests & CI status checks pass before approving
- [ ] At least one approving review from a teammate

Helpful tips:
- Prefer small, focused PRs to speed up review.
- Request specific reviewers and add context in the PR description.