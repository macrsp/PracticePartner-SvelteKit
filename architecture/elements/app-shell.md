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
  - player-drawer-surface
  - error-recovery-coordinator
  - profile-service
  - continuity-service
code_paths:
  - src/routes/+layout.ts
  - src/routes/+layout.svelte
  - src/app.html
  - src/lib/ui/shell/**
---
# App Shell

## Responsibility
Own the persistent application chrome and mount points that stay alive across planner interactions, drawer interactions, refresh recovery, and install or update affordances.

## Owns
- shared layout composition and root shell structure
- profile selector placement and shell-level controls
- shell-level recovery and status banners
- drawer host placement and install or update affordances
- top-level loading gates while continuity and profile state resolve

## Does not own
- planner route composition
- player session rules, playback state, or waveform state
- low-level persistence adapters
- domain collections such as activities, sections, plans, or tracks

## Collaborators
- navigation-service
- player-drawer-surface
- error-recovery-coordinator
- profile-service
- continuity-service

## Lifecycle notes
The shell mounts once on application bootstrap and remains mounted until full page unload.
Route changes and drawer state changes must not remount the shell.

## Invariants
- `/` resolves into the planner-first shell flow
- shell composition survives planner and drawer transitions
- shell-level recovery UI can surface blocking and non-blocking states without owning their domain logic
- install and update prompts are shell concerns and never become hidden domain state

## Code ownership hints
- src/routes/+layout.ts
- src/routes/+layout.svelte
- src/app.html
- src/lib/ui/shell/**