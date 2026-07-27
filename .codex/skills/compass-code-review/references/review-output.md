# Review Output

## Severity

- `Critical`: credential exposure, auth bypass, severe privacy leak, app cannot start, or data-loss flow.
- `High`: realistic cross-user/session leak, broken core auth/navigation flow, common crash, or severe platform regression.
- `Medium`: plausible UX/correctness bug, missing validation/error state, performance issue likely at normal usage, or missing verification for risky logic.
- `Low`: maintainability risk, confusing contract, minor accessibility gap, or limited test/verification gap.

## Required Finding Shape

Each finding must include severity, file/line, concrete problem, impact, and fix direction.

## Response Order

1. Findings first, ordered by severity.
2. Open questions or assumptions.
3. Verification run or recommended.
4. Short summary only as secondary context.

If no issues are found, say so clearly and mention residual risk.
