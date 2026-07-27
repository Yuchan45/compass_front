# React Native And Expo Practices

## Architecture

- Stack: Expo SDK 55, Expo Router, React 19, React Native 0.83, TypeScript.
- App entry lives in `src/app`; screens live in `src/screens`.
- Reusable UI primitives live in `src/components`.
- Runtime config lives in `src/config`; API and storage integrations live in `src/services`.

## Components

- Prefer function components with explicit prop types.
- Keep screens as composition and workflow containers; move reusable controls to `src/components`.
- Use React Native primitives and `StyleSheet.create`.
- Use aliases such as `@/services/...` consistently.
- Avoid business logic in visual components when a context/service can own it.

## Hooks

- Keep effects idempotent and guarded against stale async work.
- Use refs to stabilize callback usage when handling auth-session callbacks.
- Do not call hooks conditionally.
- Keep derived UI state local; keep app-wide session state in context.

## Expo Router

- Preserve `src/app/_layout.tsx` for global providers.
- Keep route files thin and delegate substantial UI to screens.
- Avoid adding navigation libraries or route conventions that conflict with Expo Router.
