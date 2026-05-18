# UI System

Compass shared UI primitives live in `src/components` and use design tokens from `src/constants/design.ts`.

## Form Validation

`TextField` supports live validation through `validationState` and `validationMessage`.

- `validationState="error"` uses the shared alert color and should show a short helper message below the input.
- `validationState="success"` uses the shared success color for a valid field outline.
- Keep validation messages concise and close to the field.

Auth registration and profile editing use this pattern for email, username, password, and profile field validation.
