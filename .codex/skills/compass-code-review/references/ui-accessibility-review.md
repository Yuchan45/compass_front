# UI And Accessibility Review

## Inspect

- `src/constants/design.ts` for colors, spacing, radii, typography, and dimensions.
- Shared primitives in `src/components`.
- Screens with forms, lists, bottom navigation, auth flows, or profile/friends UI.
- Assets used in UI.

## Risks

- New UI bypasses design constants.
- Text overflows on narrow mobile widths.
- Touch targets are too small.
- Buttons remain enabled during async submits.
- Errors or empty states are missing.
- Visible user copy is too technical or exposes debug details.
- Important state is represented by color only.
- Accessibility labels are missing for icon-only/non-obvious controls.

## Expected Patterns

- Use `src/constants/design.ts`.
- Keep copy concise and user-facing.
- Use mobile-first layout with safe areas and keyboard-aware form behavior.
- Preserve web max-width patterns where present.
- Keep card radii restrained and consistent with local `radii`.
- Verify meaningful UI changes on at least one target when feasible.
