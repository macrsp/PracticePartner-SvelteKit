---
id: profile-service
title: Profile Service
order: 30
kind: application-service
branch_aliases:
  - profile-service
  - profiles
collaborators:
  - continuity-service
  - planner-screen
  - app-shell
code_paths:
  - src/lib/domains/profiles/**
  - src/lib/app/profile/**
---
# Profile Service

## Responsibility
Define and maintain the runtime contract for profile service.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- continuity-service
- planner-screen
- app-shell

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/lib/domains/profiles/**
- src/lib/app/profile/**
