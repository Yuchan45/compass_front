# Documentation Impact Map

## Always Check Docs

- `src/app/**`: route, layout, provider, font, splash, or navigation behavior.
- `src/screens/**`: user-facing flows, copy, loading/error/empty states.
- `src/components/**`: shared UI conventions or reusable controls.
- `src/services/api/**`: backend endpoint usage and request/response contracts.
- `src/services/storage/**`: token persistence behavior.
- `src/contexts/**`: app state and session behavior.
- `src/config/**`: runtime configuration and env vars.
- `src/constants/design.ts`: UI system conventions.
- `.env.example`, `app.config.js`, `app.json`, `package.json`, `scripts/**`.
- `README.md`, `CHANGELOG.md`, or `docs/**`.

## Usually Check Docs

- Shared types in `src/types`.
- Google auth popup utilities.
- Asset changes that affect branding or documented setup.
- Location permission or privacy-sensitive UI behavior.

## Usually No Docs Needed

- Pure refactors that preserve user/developer behavior.
- Formatting-only changes.
- Private implementation cleanup with no setup, UI, API, auth, or workflow impact.

If a public/developer contract changes, update docs.
