---
id: planner-screen
title: Planner Screen
order: 20
kind: screen
branch_aliases:
  - planner-screen
  - planner-ui
  - planner
collaborators:
  - profile-service
  - library-service
  - activity-service
  - activity-composer-service
  - plan-service
  - navigation-service
  - player-session-service
  - history-service
code_paths:
  - src/routes/planner/+page.svelte
  - src/lib/ui/planner/**
---
# Planner Screen

## Responsibility
Compose the planner route as the primary organizational surface for profiles, tracks, activities, sections, practice plans, and explicit recovery states.

## Owns
- planner route composition
- planner-scoped empty, unavailable, and reconnect states
- user actions that create, edit, order, or launch planning objects
- presentation of profile-scoped progress summaries supplied by services
- planner-originated intents to open or retarget the player drawer

## Does not own
- shell chrome
- playback transport, waveform, or selection logic
- low-level library access or persistence adapters
- direct mutation of activity, section, plan, history, or player-session state outside service contracts

## Collaborators
- profile-service
- library-service
- activity-service
- activity-composer-service
- plan-service
- navigation-service
- player-session-service
- history-service

## Lifecycle notes
The planner screen is the steady-state route.
It re-renders from service-owned state but does not own continuity across reloads by itself.

## Invariants
- planner remains the primary route-level task surface
- planner actions launch execution into the drawer instead of replacing the route
- planner can render usable states when some targets are missing or unavailable
- planner never becomes the source of truth for domain collections

## Code ownership hints
- src/routes/planner/+page.svelte
- src/lib/ui/planner/**