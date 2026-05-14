---
name: compass-documentation
description: Documentation maintenance guide for the Compass Expo/React Native frontend. Use when Codex adds, changes, reviews, or discusses frontend behavior that affects README files, docs, API client contracts, backend integration, auth flows, Google Sign-In, environment variables, scripts, Expo Router navigation, responsive UI, diagrams, changelogs, screenshots, assets, or developer workflow. Also use after implementation tasks to decide whether frontend documentation should be updated.
---

# Compass Documentation

## Purpose

Keep Compass frontend documentation synchronized with real app behavior. Treat docs as part of the implementation when changes affect setup, user flows, API integration, navigation, auth, UI conventions, or developer workflow.

This skill does not run as a background hook. It should be invoked when the task or diff touches documentation-relevant areas, or explicitly with `$compass-documentation`.

## Workflow

1. Inspect changed files and nearby code before editing docs.
2. Classify documentation impact using `references/doc-impact-map.md`.
3. Load matching references:
   - `references/readme-guide.md` for setup, scripts, env vars, structure, and onboarding.
   - `references/api-integration-docs.md` for backend API usage, auth contracts, Google Sign-In, and token storage.
   - `references/ui-workflow-docs.md` for screens, navigation, responsive UI, assets, and user flows.
   - `references/diagrams-guide.md` for Mermaid architecture, auth, API, and navigation diagrams.
   - `references/changelog-guide.md` for `CHANGELOG.md` entries.
   - `references/docs-quality-checklist.md` before finalizing.
4. Update the smallest set of docs that prevents stale or missing information.
5. Keep docs factual and derived from code. Do not invent behavior, future plans, env vars, screens, routes, or backend endpoints.
6. If implementation changed but docs should not change, state that explicitly in the final response.

## Documentation Triggers

Evaluate docs when changes touch:

- Expo Router route files, navigation structure, `_layout.tsx`, providers, fonts, splash, or status bar.
- Screens, shared components, design constants, assets, responsive layout, accessibility, or visible UI copy.
- API services, shared types, backend URL config, request/response contracts, or error handling.
- Auth context, JWT storage, Google Sign-In, popup behavior, logout, or session restore.
- Location permission, precise location handling, privacy, or friend visibility flows.
- `.env.example`, `app.config.js`, `app.json`, scripts, Node/Expo requirements, or package dependencies.
- README, changelog, diagrams, screenshots, or developer workflow docs.

## Target Docs

Current docs:

- `README.md`: concise onboarding, setup, env vars, scripts, and project structure.

Create or update stable docs when needed:

- `CHANGELOG.md` for user/developer-visible changes and workflow updates.
- `docs/codex-skills.md` for local Codex skills and recommended workflow.
- `docs/api-integration.md` for backend API, auth, Google Sign-In, token storage, and env config.
- `docs/navigation.md` for Expo Router routes and screen flow.
- `docs/ui-system.md` for design constants, components, assets, and responsive conventions.
- `docs/diagrams.md` for Mermaid diagrams explaining auth, API, navigation, or location flows.

When adding a new doc, link it from `README.md`.

## Style

- Write concise Markdown.
- Prefer fenced commands and env examples.
- Prefer Mermaid fenced blocks for diagrams.
- Use exact script names from `package.json`.
- Use exact env var names from `.env.example`, config, and README.
- Use exact route filenames, screen names, service names, and type names from code.
- Do not document frontend secrets. `EXPO_PUBLIC_*` values are public.
- Avoid duplicating long content across docs; link to the canonical doc.

## Verification

Documentation-only changes usually do not require tests. For code plus docs changes, run the implementation verification from `$compass-frontend`, usually `npm run check`.

Before finalizing, check links, stale names, broken commands, undocumented changed behavior, and missing changelog entries for release-note-worthy changes.
