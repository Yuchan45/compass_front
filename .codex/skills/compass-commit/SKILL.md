---
name: compass-commit
description: Safe commit preparation workflow for the Compass frontend. Use when Codex is asked to prepare, split, stage, write, or create git commits; generate Conventional Commit messages; verify changes before commit; avoid committing secrets, Expo logs, local env, generated output, or unrelated files; or decide which checks to run before committing Expo, React Native, TypeScript, auth, API, UI, docs, assets, or workflow changes. Commit only with explicit user approval.
---

# Compass Commit

## Purpose

Prepare small, reviewable commits for the Compass Expo/React Native frontend without accidentally staging unrelated changes, secrets, local logs, generated noise, or unfinished work.

This skill can prepare a commit plan and message automatically. It must not run `git commit` unless the user explicitly asks to commit or approves the exact commit plan.

## Commit Workflow

1. Inspect current state:
   - `git status --short`
   - `git diff --stat`
   - `git diff --check`
   - targeted `git diff` for changed files.
2. Classify changes with `references/change-classification.md`.
3. Identify unrelated changes and untracked files. Do not stage files outside the requested commit.
4. Check for sensitive or accidental content using `references/safety-checklist.md`.
5. Decide verification commands using `references/verification-policy.md`.
6. Propose one atomic commit or multiple commits if the diff mixes unrelated concerns.
7. Generate a Conventional Commit message using `references/message-style.md`.
8. Ask for explicit approval before staging/committing unless the user already gave a direct instruction such as "commit these changes".
9. Stage only approved files, then run `git status --short` again before committing.
10. Commit with the approved message and report the commit hash.

## Hard Rules

- Never use `git add .` unless the user explicitly approves staging all current changes after seeing status.
- Never commit `.env`, secrets, credentials, JWTs, Google tokens, raw location data, Expo logs, cache files, `node_modules`, `.expo`, `dist`, or unrelated generated files.
- Never revert, discard, or overwrite user changes to make a commit cleaner.
- Never amend, rebase, reset, squash, or force-push unless the user explicitly requests it.
- Never include untracked files just because they exist. Explain why each untracked file belongs.
- If checks fail, do not commit unless the user explicitly asks to commit despite the failure.

## Default Commit Types

- `feat`: new screen, route, auth flow, API integration, UI behavior, location feature, or user/developer-visible capability.
- `fix`: bug fix, auth/session correction, UI regression, platform bug, broken request, bad state, or privacy issue.
- `docs`: README, changelog, diagrams, API integration docs, workflow docs, or comments-only documentation.
- `test`: test-only additions or updates.
- `refactor`: behavior-preserving code restructuring.
- `perf`: performance improvement with same behavior.
- `chore`: tooling, scripts, package metadata, Expo config, formatting config, or local skills.
- `build`: dependencies, lockfile, TypeScript/Expo build configuration.

Use scopes when useful: `auth`, `api`, `navigation`, `ui`, `profile`, `friends`, `locations`, `storage`, `config`, `assets`, `docs`, `skills`, `deps`.

Use `feat(scope): description` for new features. Do not use `feature(scope): description`.

## Approval Language

If the user asks "prepare a commit", stop after the plan, checks, and proposed message.

If the user asks "commit it", "create the commit", or approves the exact plan, stage and commit the approved files.

Before committing, state files to stage, verification already run, and exact commit message.

## Output

For preparation-only requests, return proposed commit split, files per commit, checks run or recommended, proposed message, and risks.

For completed commits, return commit hash, message, included files, checks run, and residual risk.
