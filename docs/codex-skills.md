# Codex Skills

This repository includes local Codex skills under `.codex/skills`. They do not create separate agents or background processes. They give Codex frontend-specific instructions so it can adopt the right role for the task.

## Available Skills

| Skill | Use it for |
| --- | --- |
| `$compass-frontend` | Implement or modify Compass frontend code while respecting Expo Router, React Native, TypeScript, auth, API, storage, responsive UI, and design conventions. |
| `$compass-documentation` | Keep README, docs, API integration notes, diagrams, changelog, route/screen docs, and developer workflow documentation synchronized with frontend changes. |
| `$compass-code-review` | Review PRs or diffs for Expo Router, React Native, auth, API integration, responsive UI, accessibility, performance, naming, and verification risk. |
| `$compass-commit` | Prepare safe atomic commits with explicit staging, checks, `feat(scope): description` commit messages, and user approval before committing. |

## Recommended Workflow

For implementation work:

```text
Use $compass-frontend to implement <change>.
Use $compass-documentation to update affected docs.
Use $compass-code-review to review the changes.
Use $compass-commit to prepare a safe atomic commit.
```

For documentation-only work:

```text
Use $compass-documentation to update <docs>.
Use $compass-commit to prepare a safe atomic commit.
```

For reviewing existing changes:

```text
Use $compass-code-review to review the current diff.
```

For committing approved changes:

```text
Use $compass-commit to commit only the approved files.
```

## Commit Control

`$compass-commit` may prepare a plan, propose commit splits, run checks, and write a commit message. It should only stage and commit after explicit approval or a direct request such as "commit it" or "create the commit".

## When Documentation Is Needed

Run `$compass-documentation` when changes affect:

- Expo Router routes, screens, navigation, providers, fonts, or splash behavior.
- API services, shared types, auth context, token storage, Google Sign-In, or backend URL config.
- UI components, design constants, assets, responsive layout, accessibility, or user-facing copy.
- Environment variables, setup, scripts, Expo config, or developer workflow.
- Diagrams, changelog, README, or other stable docs.

For internal skill-only changes, document the workflow here instead of expanding product UX/API docs.
