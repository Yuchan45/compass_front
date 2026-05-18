# API Integration

Compass uses `src/services/api/client.ts` for authenticated HTTP requests. `API_BASE_URL` comes from `BACKEND_API_URL` and defaults to `http://localhost:9000/api` on web/iOS simulator and `http://10.0.2.2:9000/api` on Android emulator.

## Auth

Auth requests live in `src/services/api/auth.ts`.

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/google`
- `GET /users/me`
- `PATCH /users/me`

The backend returns a JWT access token. The frontend persists it through `src/services/storage/token-storage.ts` and sends it as a Bearer token on authenticated requests.

Registration sends a user-selected `username`. Usernames must be 3-30 characters using only lowercase letters, numbers, underscores, or dots.

Profile updates can also send `username` through `PATCH /users/me`; the frontend applies the same local validation before submitting.

## Friendships

Friendship requests live in `src/services/api/friendships.ts`.

- `GET /friendships?type=received&status=PENDING` loads pending friendship requests addressed to the signed-in user.
- `POST /friendships/:id/accept` accepts a pending request.
- `POST /friendships/:id/decline` declines a pending request.
- `GET /friendships/friends?status=accepted&sortBy=displayName&sortDirection=asc` loads accepted friends for the Friends tab.

`src/types/friendships.ts` mirrors the response contracts used by the Friends screen. Accepted friends are returned as paginated relationships with `data[]`, where each item exposes `friend` as the other user in the relationship.

## Errors

The API client reads backend error messages when available. Friends flows show concise inline retry states and a global `alert` toast for backend failures.
