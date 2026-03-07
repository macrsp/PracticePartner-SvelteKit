---
id: activity-service
title: Activity Service
order: 70
kind: application-service
branch_aliases:
  - activity-service
  - activities
collaborators:
  - activity-composer-service
  - plan-service
  - library-service
  - section-service
  - player-session-service
code_paths:
  - src/lib/domains/activities/**
  - src/lib/app/activities/**
---
# Activity Service

## Responsibility
Define and maintain the runtime contract for activity service.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- activity-composer-service
- plan-service
- library-service
- section-service
- player-session-service

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/lib/domains/activities/**
- src/lib/app/activities/**
