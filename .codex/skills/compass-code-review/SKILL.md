---
name: compass-code-review
description: Compass frontend code review skill for PRs, diffs, commits, Expo Router screens, React Native components, TypeScript contracts, API/auth integrations, Google Sign-In, token storage, location/privacy flows, responsive UI, accessibility, performance, naming conventions, and verification risk. Use when Codex is asked to review frontend changes or evaluate Compass mobile/web implementation quality.
---

# Compass Code Review

## Review Contract

Act as a risk-focused reviewer for the Compass Expo/React Native frontend. Prefer concrete defects, UX regressions, broken auth/API contracts, privacy issues, platform bugs, accessibility problems, performance risks, and missing verification over broad style commentary.

Combine this skill with `$compass-frontend` when available. Load only the reference files that match the changed area.

## Workflow

1. Determine the target: PR, branch diff, commit range, staged diff, working tree diff, or named files.
2. Inspect the diff first, then read surrounding screens, components, contexts, services, config, types, and design constants.
3. Load matching references:
   - `references/expo-router-review.md` for routing, layouts, screens, providers, fonts, splash, and platform behavior.
   - `references/api-auth-review.md` for API client, backend contract, JWT storage, Google Sign-In, and env config.
   - `references/ui-accessibility-review.md` for responsive mobile/web UI, design constants, accessibility, and copy.
   - `references/state-performance-review.md` for context state, async effects, duplicate submits, stale data, and rendering performance.
   - `references/review-output.md` for severity and output format.
4. Check project-specific rules before generic preferences: use `src/services/api`, `src/services/storage`, `src/types`, `AuthProvider`/`useAuth`, and `src/constants/design.ts`.
5. Run or recommend the smallest useful verification:
   - `npm run check` for format, lint, and typecheck.
   - `npm run lint` or `npm run typecheck` for targeted failures.
   - Manual Expo web/mobile verification when UI behavior, routing, auth popup, or platform-specific behavior changes.
6. Report findings first, ordered by severity, with file/line references and concrete fix direction.

## Review Priorities

- Auth and privacy: JWT handling, Google ID token handling, public env vars, SecureStore usage, logout/session cleanup, and location permission privacy.
- API contract: paths, payloads, response types, error parsing, backend URL config, and auth headers.
- UX correctness: loading/error/empty states, duplicate submissions, disabled controls, navigation, and stale session behavior.
- React/Expo correctness: hook rules, stale async effects, Expo Router boundaries, web popup completion, fonts, splash behavior, platform differences.
- Responsive UI: narrow mobile widths, web max width, safe areas, keyboard/form behavior, touch targets, and text overflow.
- Accessibility: labels for non-obvious controls, color contrast, keyboard behavior on web, and non-color-only states.
- Performance: unnecessary re-renders, heavy work in render, unbounded lists, oversized assets, and repeated network calls.
- Tests/verification: missing `npm run check`, missing manual platform verification, or untested risky auth/API changes.

## Output

Use `references/review-output.md`.
