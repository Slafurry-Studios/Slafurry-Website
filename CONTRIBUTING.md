# Contributing to Slafurry Studios — Website

Thank you for your interest in contributing to the Slafurry Studios website.

This repository contains the official website of Slafurry Studios and is primarily maintained for studio development. Contributions may be accepted when they align with the project's goals, technical direction, and development workflow.

---

## Before You Start

Before working on a change:

1. Check existing issues to see if the work is already tracked.
2. For larger changes, discuss the idea with the team before implementation.
3. Avoid duplicating work that is already in progress.
4. Make sure you understand the scope of the issue before starting.

Issues are used as the primary unit of work.

---

## Development Workflow

The general development workflow is:

```text
Issue
  ↓
Branch
  ↓
Development
  ↓
Pull Request
  ↓
Review
  ↓
Merge
  ↓
Issue Closed
```

Each meaningful change should normally have an associated GitHub Issue.

When starting work on an issue, create a branch from that issue whenever possible.

---

## Branch Naming

Use the following convention:

```text
<type>/<issue-number>-<short-description>
```

Examples:

```text
feature/4-montage-video-shuffle
feature/37-achievements-crud
fix/59-cross-browser-qa
refactor/41-admin-datatable
docs/1-readme
```

Recommended branch types:

* `feature` — new functionality
* `fix` — bug fixes
* `refactor` — code restructuring without changing intended behavior
* `docs` — documentation changes
* `chore` — maintenance and repository configuration

Keep branch names short and descriptive.

---

## Making Changes

After creating your branch:

1. Make the smallest reasonable set of changes required for the issue.
2. Keep unrelated changes out of the branch.
3. Follow the existing project's code and formatting conventions.
4. Test your changes locally.
5. Make sure the project still builds successfully.

For UI changes, test the relevant layouts and responsive behavior where applicable.

---

## Commits

Write commit messages that clearly describe the change.

Prefer concise, descriptive messages such as:

```text
feat: add achievement data source
fix: prevent duplicate comment submission
refactor: simplify analytics tracking
docs: update local setup instructions
```

Avoid commits with messages such as:

```text
update
fix
changes
stuff
final
final2
```

Small, focused commits are preferred when they make the history easier to understand.

---

## Pull Requests

When your work is ready, open a Pull Request against the appropriate branch.

The Pull Request should:

* Explain what changed.
* Reference the issue being addressed.
* Describe relevant testing performed.
* Include screenshots or recordings for significant UI changes when useful.
* Mention known limitations or follow-up work when applicable.

Use GitHub closing keywords when the Pull Request completely resolves an issue:

```text
Closes #123
```

This allows GitHub to automatically close the issue when the Pull Request is merged.

If the Pull Request is related to an issue but does not completely resolve it, use a non-closing reference instead:

```text
Related to #123
```

---

## Review

Pull Requests may be reviewed before merging.

Reviewers may request:

* Code changes
* Additional tests
* Documentation updates
* Design or UX adjustments
* Scope changes
* Clarification about implementation decisions

Address review feedback before merging unless the team agrees otherwise.

Do not take review comments personally. The purpose of review is to improve the project and keep the codebase maintainable.

---

## Testing

Before opening a Pull Request, run the relevant checks for your change.

At minimum, verify that:

```bash
npm run build
```

completes successfully when applicable.

For changes involving the database, authentication, admin functionality, or other infrastructure, perform the relevant local testing before requesting review.

Do not commit real credentials, API keys, tokens, or other secrets.

---

## Database Changes

Changes to the Prisma schema or database structure should be treated carefully.

When modifying:

```text
prisma/schema.prisma
```

consider:

* Existing data
* Seed data
* Relations
* Required and optional fields
* Production database impact
* Whether the change requires additional migration or deployment steps

Do not run destructive database operations against production without explicit authorization.

---

## Environment Variables

Environment-specific configuration belongs in `.env`.

Never commit:

```text
.env
```

or any file containing real credentials.

When adding a new required environment variable, update:

```text
.env.example
```

with an empty or safe placeholder so other developers know that the variable exists.

---

## Internationalization

The website currently supports:

```text
en
id
```

When adding user-facing text, make sure the appropriate localization files are updated.

Avoid hardcoding user-facing strings when they should be translated through the project's internationalization system.

---

## UI and Responsive Changes

The website is intended to work across desktop and mobile devices.

For UI changes:

* Check desktop layouts.
* Check mobile layouts.
* Check interactive states.
* Check for obvious overflow or broken spacing.
* Verify touch targets where relevant.
* Check both supported locales when the change affects text or layout.

Screenshots or recordings are encouraged for significant visual changes.

---

## Issues

Use the appropriate issue template when creating a new issue.

Good issues should provide enough context for another developer to understand the problem or proposed change.

For bugs, include reproduction steps and relevant environment information whenever possible.

For feature requests, explain the intended behavior and why the change is useful.

---

## Good First Issues

Issues labeled `good first issue` are intended to be approachable by contributors who are unfamiliar with the repository.

They should have a clearly defined scope and enough information to get started.

If you are unsure about an issue, ask before beginning significant work.

---

## Scope and Ownership

Slafurry Studios retains control over the project's technical direction, architecture, design, and product roadmap.

Not every proposed change will be accepted.

A Pull Request being submitted does not guarantee that it will be merged.

Contributors are encouraged to discuss significant changes before spending substantial time implementing them.

---

## Questions

If you are unsure about the correct approach, open a discussion with the relevant team member before making a large change.

When in doubt:

> Keep the change focused, document your reasoning, and ask before making assumptions.
