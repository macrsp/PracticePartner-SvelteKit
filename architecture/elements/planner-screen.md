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
  - activity-service
  - activity-composer-service
  - plan-service
  - profile-service
  - navigation-service
  - player-session-service
code_paths:
  - src/routes/planner/+page.svelte
  - src/lib/ui/planner/**
---
# Planner Screen

## Responsibility
Define and maintain the runtime contract for planner screen.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- activity-service
- activity-composer-service
- plan-service
- profile-service
- navigation-service
- player-session-service

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/routes/planner/+page.svelte
- src/lib/ui/planner/**
