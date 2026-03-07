---
id: app-shell
title: App Shell
order: 10
kind: ui-shell
branch_aliases:
  - app-shell
  - shell
collaborators:
  - navigation-service
  - player-session-service
  - error-recovery-coordinator
  - profile-service
code_paths:
  - src/routes/+layout.ts
  - src/routes/+layout.svelte
  - src/app.html
  - src/lib/ui/shell/**
---
# App Shell

## Responsibility
Define and maintain the runtime contract for app shell.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- navigation-service
- player-session-service
- error-recovery-coordinator
- profile-service

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/routes/+layout.ts
- src/routes/+layout.svelte
- src/app.html
- src/lib/ui/shell/**
