# State Management

## Current Pattern

- Auth/session state is centralized in `src/contexts/auth-context.tsx`.
- JWT persistence is handled by `src/services/storage/token-storage.ts`.
- API calls live in `src/services/api`.
- Shared API contracts live in `src/types`.

## Rules

- Do not duplicate `accessToken` state inside individual screens.
- Route auth mutations through context methods such as `login`, `googleLogin`, `register`, `logout`, `refreshMe`, and `updateProfile`.
- Keep transient form state local to the screen.
- Keep server response types explicit and aligned with backend response shapes.
- Clear auth/session state when token validation fails.

## When Adding State

- Use component state for single-screen form or UI state.
- Use context for cross-screen app state.
- Introduce a state library only when there is repeated cross-screen state complexity that context cannot handle cleanly.
