# Verification Policy

## Always Consider

- `git diff --check`.
- `npm run check` for format, lint, and typecheck.

## Run `npm run check`

Run for TypeScript/TSX changes, config changes, package changes, route/screen/component changes, API/auth changes, or shared type changes.

## Targeted Commands

- `npm run format:check`: formatting only.
- `npm run lint`: lint-only failures.
- `npm run typecheck`: TypeScript contract failures.

## Manual Verification

Recommend Expo manual verification for:

- UI, navigation, auth popup, platform-specific behavior, location permissions, or responsive layout changes.
- Use `npm run web`, `npm run android`, or `npm run ios` as appropriate.

## Docs-Only Changes

For README/docs/changelog/skill-only changes, tests are usually not required. Still run `git diff --check`.

If checks fail, stop before commit unless the user explicitly approves committing despite failure.
