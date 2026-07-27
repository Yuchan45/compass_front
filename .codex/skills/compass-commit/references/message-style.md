# Commit Message Style

Use Conventional Commits. For new features, always use `feat(scope): description`; do not use `feature(scope): description`.

## Format

```text
type(scope): short imperative summary
```

Feature format:

```text
feat(scope): description
```

## Examples

```text
feat(auth): add Google sign-in flow
feat(profile): add edit profile screen
fix(api): handle empty backend responses
docs(skills): document frontend workflow
chore(deps): update Expo dependencies
```

## Types

- `feat`
- `fix`
- `docs`
- `test`
- `refactor`
- `perf`
- `chore`
- `build`

## Scopes

Prefer short scopes such as `auth`, `api`, `navigation`, `ui`, `profile`, `friends`, `locations`, `storage`, `config`, `assets`, `docs`, `skills`, or `deps`.

Use imperative summaries, keep them concise, and do not end with a period.
