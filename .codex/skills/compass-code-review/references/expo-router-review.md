# Expo Router Review

## Inspect

- `src/app/_layout.tsx` for providers, splash handling, fonts, status bar, and auth-session completion.
- Route files in `src/app` for thin routing wrappers.
- Screens in `src/screens` for user flows and composition.
- Components in `src/components` for reusable UI behavior.

## Risks

- Route files contain substantial UI/business logic instead of delegating to screens.
- Providers are duplicated outside `_layout.tsx`.
- Hooks are called conditionally or effects lack stale async guards.
- Splash screen can stay stuck when fonts fail.
- Web auth popup callback behavior regresses.
- Navigation changes break mobile/web parity.

## Expected Patterns

- Keep Expo Router route files thin.
- Keep screens focused on workflow/composition.
- Keep reusable UI in `src/components`.
- Use React Native primitives and `StyleSheet.create`.
- Use aliases such as `@/services/...` consistently.
