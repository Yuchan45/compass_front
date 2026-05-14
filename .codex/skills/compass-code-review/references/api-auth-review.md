# API And Auth Review

## Inspect

- `src/config/api.ts` for backend URL defaults and platform handling.
- `src/services/api/client.ts` for request behavior, auth headers, JSON parsing, and errors.
- `src/services/api/*` for endpoint paths and payloads.
- `src/services/storage/token-storage.ts` for JWT persistence.
- `src/contexts/auth-context.tsx` for session state and auth actions.
- `src/types` for backend contract alignment.

## Risks

- API calls are made directly from screens instead of services.
- Backend `accessToken` is duplicated in screen state.
- Google ID tokens are stored after exchange.
- Client secrets or private values appear in frontend env/code.
- `EXPO_PUBLIC_*` values are treated as secret.
- Auth errors leak implementation details or do not clear invalid sessions.
- Requests bypass the shared API client and lose consistent headers/errors.

## Expected Patterns

- API calls live in `src/services/api`.
- Request/response contracts live in `src/types`.
- `Authorization: Bearer <token>` is attached through the API client option.
- Only the backend JWT is persisted.
- Invalid restored tokens are deleted.
- Google auth sends only `{ idToken }` to the backend.
