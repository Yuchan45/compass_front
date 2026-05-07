---
name: compass-frontend
description: Frontend engineering guide for the Compass mobile/web app. Use when Codex works in or discusses this Expo Router, React Native, TypeScript frontend; when adding screens, components, auth flows, API integrations, state management, responsive UI, Google Sign-In, location permissions, or privacy-sensitive location features; or when asked to preserve the project's frontend architecture and best practices.
---

# Compass Frontend

## Workflow

1. Inspect current screens, components, context, services, config, and design constants before changing UI.
2. Keep screens focused on user flow and composition; put API calls in services, session state in context, and reusable UI in components.
3. Preserve the Expo Router structure and React Native primitives unless the existing app has a stronger local pattern.
4. Treat auth tokens, Google ID tokens, and location permissions as sensitive flows.
5. Verify with the smallest useful command, usually `npm run check`.

## Project References

Read only the reference files needed for the task:

- `references/react-expo.md`: Expo Router, React Native, component and hook practices.
- `references/state-management.md`: auth/session state, storage, API data state.
- `references/responsive-ui.md`: design constants, layouts, accessibility, mobile/web responsiveness.
- `references/api-auth.md`: backend integration, JWT storage, Google Sign-In frontend flow.
- `references/location-permissions.md`: device location handling, consent, privacy.

## Local Rules

- Use TypeScript types from `src/types` for shared API contracts.
- Use `src/services/api` for HTTP calls and `src/services/storage` for token persistence.
- Use `AuthProvider`/`useAuth` for session state instead of duplicating token state in screens.
- Use `src/constants/design.ts` for colors, spacing, radii, and typography.
- Write all visible UI copy, navigation labels, placeholders, accessibility labels, and user-facing messages in English.
- Keep visible UI text concise and user-facing; do not expose debug URLs except when intentionally useful in dev screens.
- Do not store secrets in frontend env. `EXPO_PUBLIC_*` values are public.

## Verification

- Run `npm run check` for format, lint, and typecheck.
- Run `npm run format` only when intentionally formatting touched frontend files.
- If testing UI behavior, prefer Expo web/mobile manual verification and report the platform used.
