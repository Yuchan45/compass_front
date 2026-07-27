# API Integration Docs

Use this when services, types, auth context, token storage, or backend URL config change.

## Document

- `BACKEND_API_URL` behavior and platform defaults.
- API services and their backend endpoint paths.
- Auth flow: login/register/Google -> backend JWT -> persisted session -> `/users/me`.
- Token storage expectations.
- Public nature of `EXPO_PUBLIC_GOOGLE_CLIENT_ID`.
- Error handling through the shared API client.
- Alignment with backend Swagger/OpenAPI only when the frontend contract changes.

## Avoid

- Claiming the frontend exposes Swagger.
- Storing or documenting client secrets.
- Duplicating full backend API docs.
- Documenting behavior not implemented in frontend code.
