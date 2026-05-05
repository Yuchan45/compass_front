# API Integration And Auth

## Backend Contract

- Backend base URL comes from `BACKEND_API_URL`, with platform defaults in `src/config/api.ts`.
- API wrapper is `src/services/api/client.ts`.
- Auth endpoints include `/auth/login`, `/auth/register`, `/auth/google`, `/users/me`.
- Internal Compass auth uses the backend `accessToken`; Google auth is only the identity bootstrap.

## Request Rules

- Add API calls in `src/services/api`, not directly in screens.
- Send JSON with explicit request types from `src/types`.
- Attach `Authorization: Bearer <token>` only through the API client option.
- Parse API errors through the shared client so error handling stays consistent.

## Google Sign-In

- Frontend reads `EXPO_PUBLIC_GOOGLE_CLIENT_ID`; it is public.
- Use Expo auth session to obtain a Google `id_token`.
- Send only `{ idToken }` to `POST /auth/google`.
- Do not store Google ID tokens after exchanging them for the backend JWT.
- Do not add a client secret to frontend code or env files.

## Token Storage

- Persist only the backend `accessToken`.
- Use secure/platform-appropriate storage through `src/services/storage/token-storage.ts`.
- On startup, restore token, call `/users/me`, and delete the token if validation fails.
