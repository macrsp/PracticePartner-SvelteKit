---
id: error-recovery-coordinator
title: Error Recovery Coordinator
order: 150
kind: application-service
branch_aliases:
  - error-recovery-coordinator
  - recovery
  - error-recovery
collaborators:
  - app-shell
  - library-service
  - player-session-service
  - audio-engine
  - waveform-engine
  - continuity-service
  - navigation-service
code_paths:
  - src/lib/app/recovery/**
  - src/lib/ui/shared/**
  - src/routes/+layout.ts
---
# Error Recovery Coordinator

## Responsibility
Define and maintain the runtime contract for error recovery coordinator.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- app-shell
- library-service
- player-session-service
- audio-engine
- waveform-engine
- continuity-service
- navigation-service

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/lib/app/recovery/**
- src/lib/ui/shared/**
- src/routes/+layout.ts
