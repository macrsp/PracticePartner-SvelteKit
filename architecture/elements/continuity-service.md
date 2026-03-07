---
id: continuity-service
title: Continuity Service
order: 140
kind: application-service
branch_aliases:
  - continuity-service
  - continuity
collaborators:
  - profile-service
  - library-service
  - section-service
  - player-session-service
  - error-recovery-coordinator
code_paths:
  - src/lib/app/continuity/**
  - src/lib/platform/browser/db/**
  - src/lib/platform/browser/fs/**
---
# Continuity Service

## Responsibility
Define and maintain the runtime contract for continuity service.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- profile-service
- library-service
- section-service
- player-session-service
- error-recovery-coordinator

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/lib/app/continuity/**
- src/lib/platform/browser/db/**
- src/lib/platform/browser/fs/**
