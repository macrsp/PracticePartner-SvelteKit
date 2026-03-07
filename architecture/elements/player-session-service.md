---
id: player-session-service
title: Player Session Service
order: 100
kind: application-service
branch_aliases:
  - player-session-service
  - player-session
  - player
collaborators:
  - audio-engine
  - waveform-engine
  - selection-engine
  - library-service
  - section-service
  - continuity-service
  - navigation-service
code_paths:
  - src/lib/app/player-session/**
  - src/lib/ui/player/**
  - src/routes/+layout.ts
---
# Player Session Service

## Responsibility
Define and maintain the runtime contract for player session service.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- audio-engine
- waveform-engine
- selection-engine
- library-service
- section-service
- continuity-service
- navigation-service

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/lib/app/player-session/**
- src/lib/ui/player/**
- src/routes/+layout.ts
