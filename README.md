# Compass Front

Expo + React Native client for Compass.

## Requirements

- Node.js compatible with Expo SDK 55
- Backend running on port `9000` by default

## Setup

```bash
npm install
cp .env.example .env
npm run start
```

## Runtime Env

The app reads `PORT` for the frontend dev server and `BACKEND_API_URL` for API calls.

```bash
PORT=8081
BACKEND_API_URL=http://localhost:9000/api
```

Defaults:

- Android emulator: `http://10.0.2.2:9000/api`
- iOS simulator and web: `http://localhost:9000/api`

For a physical device, set `BACKEND_API_URL` to your machine LAN IP, for example:

```bash
BACKEND_API_URL=http://192.168.1.20:9000/api
```

## Google Auth

The app reads `EXPO_PUBLIC_GOOGLE_CLIENT_ID` and sends Google's `id_token` to the backend:

```bash
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Use the same client ID configured as `GOOGLE_CLIENT_ID` in the backend unless the backend is updated to accept multiple Google audiences.

For web development, register `http://localhost:8081` exactly in Google Cloud Console under the OAuth
client `Authorized redirect URIs`. The value must match the URL used by Expo, including the port and
whether there is a trailing slash.

## Scripts

```bash
npm run start
npm run android
npm run ios
npm run web
npm run format
npm run format:check
npm run lint
npm run lint:fix
npm run typecheck
npm run check
```

## Development Workflow

See [docs/codex-skills.md](docs/codex-skills.md) for the local Codex skills and recommended implementation, documentation, review, and commit workflow.

## Structure

- `src/app`: Expo Router entry.
- `src/components`: shared UI primitives.
- `src/config`: runtime configuration.
- `src/contexts`: app-level state providers.
- `src/screens`: user-facing screens.
- `src/services`: API and storage integrations.
- `src/types`: shared TypeScript contracts.
