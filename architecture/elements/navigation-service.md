---
id: navigation-service
title: Navigation Service
order: 40
kind: application-service
branch_aliases:
  - navigation-service
  - navigation
  - nav
collaborators:
  - app-shell
  - planner-screen
  - player-session-service
  - error-recovery-coordinator
code_paths:
  - src/lib/app/navigation/**
  - src/routes/+layout.ts
  - src/routes/+page.ts
---
# Navigation Service

## Responsibility
Define and maintain the runtime contract for navigation service.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- app-shell
- planner-screen
- player-session-service
- error-recovery-coordinator

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/lib/app/navigation/**
- src/routes/+layout.ts
- src/routes/+page.ts
