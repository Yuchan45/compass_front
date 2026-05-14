# Diagrams Guide

Prefer Mermaid diagrams in Markdown so they remain reviewable.

## Good Diagram Targets

- App architecture: Expo Router -> screens -> contexts -> services -> backend.
- Auth flow: Google/local auth -> backend JWT -> storage -> session restore.
- API request flow through `src/services/api/client.ts`.
- Navigation flow between auth, home, friends, profile, and edit profile.
- Location permission and sharing flow when implemented.

## Rules

- Keep diagrams factual and derived from code.
- Do not include secrets, tokens, real user data, or coordinates.
- Use one focused diagram per concern.
- Link diagram docs from `README.md` when created.
