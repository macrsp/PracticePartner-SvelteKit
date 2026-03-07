---
id: section-service
title: Section Service
order: 60
kind: application-service
branch_aliases:
  - section-service
  - sections
collaborators:
  - selection-engine
  - player-session-service
  - library-service
  - continuity-service
  - activity-service
code_paths:
  - src/lib/domains/sections/**
  - src/lib/app/sections/**
---
# Section Service

## Responsibility
Define and maintain the runtime contract for section service.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- selection-engine
- player-session-service
- library-service
- continuity-service
- activity-service

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/lib/domains/sections/**
- src/lib/app/sections/**
