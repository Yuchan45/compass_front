# Safety Checklist

## Never Commit

- `.env` or local secrets.
- JWTs, Google ID/access tokens, OAuth secrets, API keys, private certificates.
- Raw precise location samples unless intentionally anonymized fixtures.
- `node_modules`, `.expo`, `dist`, `coverage`, logs, temporary files, editor caches.
- `expo-web.out.log` and `expo-web.err.log`.
- Local machine paths or personal config unless intentionally project-standard.

## Inspect Carefully

- `.env.example`: placeholders only.
- `app.config.js` and `app.json`: public Expo config only.
- `package-lock.json`: intentional dependency changes only.
- Assets: intentional file size and path changes.
- `.codex/skills/**`: usually commit separately from runtime app changes.

## Useful Commands

```bash
git status --short
git diff --check
git diff --stat
git diff -- <file>
```
