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

## API URL

The app reads `EXPO_PUBLIC_API_URL`.

```bash
EXPO_PUBLIC_API_URL=http://localhost:9000/api
```

Defaults:

- Android emulator: `http://10.0.2.2:9000/api`
- iOS simulator and web: `http://localhost:9000/api`

For a physical device, set `EXPO_PUBLIC_API_URL` to your machine LAN IP, for example:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.20:9000/api
```

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

## Structure

- `src/app`: Expo Router entry.
- `src/components`: shared UI primitives.
- `src/config`: runtime configuration.
- `src/contexts`: app-level state providers.
- `src/screens`: user-facing screens.
- `src/services`: API and storage integrations.
- `src/types`: shared TypeScript contracts.
