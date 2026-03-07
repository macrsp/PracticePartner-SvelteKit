---
id: architecture-governance
title: Architecture Governance
order: 5
kind: governance
branch_aliases:
  - architecture-governance
  - repo-architecture
  - architecture-artifacts
collaborators:
  - app-shell
  - navigation-service
  - continuity-service
code_paths:
  - architecture/**
  - scripts/architecture/**
  - .github/workflows/ci.yml
  - .github/workflows/update-generated-artifacts.yml
  - repomix.config.json
  - repomix-instruction.md
---
# Architecture Governance

## Responsibility
Define and maintain the runtime contract for architecture governance.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- app-shell
- navigation-service
- continuity-service

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- architecture/**
- scripts/architecture/**
- .github/workflows/ci.yml
- .github/workflows/update-repo-context.yml
- repomix.config.json
- repomix-instruction.md
