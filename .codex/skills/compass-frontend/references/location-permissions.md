# Location Permissions And Privacy

## Privacy Defaults

- Treat precise location as sensitive personal data.
- Ask for permission before collecting location.
- Explain location use in concise user-facing terms when adding permission flows.
- Do not collect, display, or transmit location before permission is granted.
- Do not log raw coordinates, JWTs, Google tokens, or friend graph details.

## Location Handling

- Keep location acquisition separate from API submission and UI rendering.
- Associate location updates with the authenticated session only.
- Respect disabled sharing, logout, app background state, or permission denial when those features exist.
- Prefer throttling/debouncing live updates if frequent location streaming is added.

## Friend Visibility

- UI should reflect backend privacy rules: locations are for accepted friends only.
- Avoid showing stale friend location as live unless the timestamp supports that.
- Make loading, denied permission, no friends, and no recent location states explicit.
