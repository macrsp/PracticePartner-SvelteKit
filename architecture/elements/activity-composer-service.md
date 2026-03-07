---
id: activity-composer-service
title: Activity Composer Service
order: 80
kind: application-service
branch_aliases:
  - activity-composer-service
  - activity-composer
  - composer
collaborators:
  - activity-service
  - player-session-service
  - library-service
  - section-service
  - planner-screen
code_paths:
  - src/lib/app/activity-composer/**
  - src/lib/ui/planner/**
  - src/lib/ui/player/**
---
# Activity Composer Service

## Responsibility
Define and maintain the runtime contract for activity composer service.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- activity-service
- player-session-service
- library-service
- section-service
- planner-screen

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/lib/app/activity-composer/**
- src/lib/ui/planner/**
- src/lib/ui/player/**
