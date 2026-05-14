# Change Classification

## Keep Together

- Screen/component change and matching styles/types/docs.
- API service change and matching shared types/context updates.
- Auth flow change and matching storage/config/docs.
- Dependency addition and code that uses it.
- Skill change and docs that describe the local workflow.

## Split Apart

- Unrelated screens or features.
- Refactor plus behavior change when separable.
- Formatting-only churn mixed with logic changes.
- Local skills/process docs mixed with app runtime changes.
- Dependency updates unrelated to changed code.
- Asset replacement unrelated to component changes.

## Examples

- `feat(auth): add Google sign-in flow`
- `feat(profile): add edit profile screen`
- `fix(api): handle empty backend responses`
- `docs(skills): document frontend Codex workflow`
- `chore(deps): update Expo packages`

Prefer the split that makes review easiest and rollback safest.
