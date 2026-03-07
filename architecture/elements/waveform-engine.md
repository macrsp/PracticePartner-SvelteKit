---
id: waveform-engine
title: Waveform Engine
order: 120
kind: interaction-engine
branch_aliases:
  - waveform-engine
  - waveform
collaborators:
  - player-session-service
  - audio-engine
  - selection-engine
  - error-recovery-coordinator
code_paths:
  - src/lib/engines/waveform/**
  - src/lib/platform/browser/media/**
  - src/lib/ui/player/**
---
# Waveform Engine

## Responsibility
Define and maintain the runtime contract for waveform engine.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- player-session-service
- audio-engine
- selection-engine
- error-recovery-coordinator

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/lib/engines/waveform/**
- src/lib/platform/browser/media/**
- src/lib/ui/player/**
