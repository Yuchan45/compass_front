# State And Performance Review

## Inspect

- Context providers, especially `AuthProvider`.
- Effects with async work.
- Form loading/error state.
- Lists, image usage, and repeated renders.
- API calls triggered by navigation or screen mount.

## Risks

- Async effects update state after unmount.
- Duplicate submissions create repeated API calls.
- Session state is split across screens and context.
- Derived data is stored globally without need.
- Large images or assets are loaded unnecessarily.
- Functions/objects recreated in hot paths cause avoidable child rerenders.
- Lists are unbounded or lack stable keys.

## Expected Patterns

- Use local state for single-screen form/UI state.
- Use context for app-wide session state.
- Disable controls during active submissions.
- Guard async effects with active flags or equivalent cancellation.
- Introduce a state library only when context is insufficient for repeated cross-screen complexity.
