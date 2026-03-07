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
Classify failures and unavailable states, map them to recovery actions, and surface high-signal recovery models to the shell, planner, and player.

## Owns
- error taxonomy
- recoverability classification
- recommended recovery actions
- recovery-state aggregation

## Does not own
- rendering
- entity persistence
- engine internals

## Collaborators
- app-shell
- library-service
- player-session-service
- audio-engine
- waveform-engine
- continuity-service
- navigation-service

## Invariants
- every problem is classified as auto-recovering, recoverable-with-action, or fatal
- the UI receives actionable recovery state instead of raw exceptions
- recovery rules remain explicit and centralized

## Code ownership hints
- src/lib/app/recovery/**
- src/lib/ui/shared/**
- src/routes/+layout.ts