# Responsive UI And Design

## Design System

- Use `src/constants/design.ts` for colors, spacing, radii, and typography.
- Keep card radii restrained and consistent with existing `radii`.
- Prefer quiet, utilitarian UI for Compass workflows: auth, profile, friendship, map/location, and settings.
- Use readable contrast for outdoor/mobile usage.

## React Native Layout

- Use flexbox, safe areas, and keyboard-aware layouts where forms are present.
- Ensure text fits on narrow mobile widths and does not overflow buttons.
- Avoid fixed pixel widths unless paired with responsive constraints.
- Test meaningful UI changes on at least one mobile-sized viewport or device target when feasible.

## Interaction

- Disable buttons during active async submission to prevent duplicate requests.
- Surface concise error messages near the relevant flow.
- Keep touch targets comfortable for mobile.
- Avoid exposing implementation details in visible user-facing text.

## Accessibility

- Use semantic labels where controls are not self-explanatory.
- Preserve keyboard behavior on web and mobile.
- Avoid color-only state indicators for important errors or success states.
