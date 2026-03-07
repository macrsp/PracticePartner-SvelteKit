---
id: plan-service
title: Plan Service
order: 90
kind: application-service
branch_aliases:
  - plan-service
  - practice-plan
  - plan-items
collaborators:
  - planner-screen
  - activity-service
  - player-session-service
code_paths:
  - src/lib/domains/plans/**
  - src/lib/app/plans/**
---
# Plan Service

## Responsibility
Define and maintain the runtime contract for plan service.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- planner-screen
- activity-service
- player-session-service

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/lib/domains/plans/**
- src/lib/app/plans/**
