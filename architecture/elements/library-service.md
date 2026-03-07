---
id: library-service
title: Library Service
order: 50
kind: application-service
branch_aliases:
  - library-service
  - library
  - folder-connection
collaborators:
  - continuity-service
  - player-session-service
  - error-recovery-coordinator
  - section-service
  - activity-service
code_paths:
  - src/lib/domains/library/**
  - src/lib/platform/browser/fs/**
  - src/lib/platform/browser/permissions/**
---
# Library Service

## Responsibility
Define and maintain the runtime contract for library service.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- continuity-service
- player-session-service
- error-recovery-coordinator
- section-service
- activity-service

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/lib/domains/library/**
- src/lib/platform/browser/fs/**
- src/lib/platform/browser/permissions/**
