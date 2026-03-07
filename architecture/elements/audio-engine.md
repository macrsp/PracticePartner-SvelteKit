---
id: audio-engine
title: Audio Engine
order: 110
kind: interaction-engine
branch_aliases:
  - audio-engine
  - playback-engine
  - transport
collaborators:
  - player-session-service
  - waveform-engine
  - selection-engine
  - error-recovery-coordinator
  - continuity-service
code_paths:
  - src/lib/engines/audio/**
  - src/lib/platform/browser/audio/**
  - src/lib/platform/browser/media/**
---
# Audio Engine

## Responsibility
Define and maintain the runtime contract for audio engine.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- player-session-service
- waveform-engine
- selection-engine
- error-recovery-coordinator
- continuity-service

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/lib/engines/audio/**
- src/lib/platform/browser/audio/**
- src/lib/platform/browser/media/**
