---
id: selection-engine
title: Selection Engine
order: 130
kind: interaction-engine
branch_aliases:
  - selection-engine
  - selection
collaborators:
  - player-session-service
  - waveform-engine
  - audio-engine
  - section-service
code_paths:
  - src/lib/engines/selection/**
  - src/lib/ui/player/**
  - src/lib/app/selection/**
---
# Selection Engine

## Responsibility
Define and maintain the runtime contract for selection engine.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- player-session-service
- waveform-engine
- audio-engine
- section-service

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/lib/engines/selection/**
- src/lib/ui/player/**
- src/lib/app/selection/**
