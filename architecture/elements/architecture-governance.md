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
Keep the repository’s architectural source of truth, generated artifacts, focus-element discipline, and context-generation rules coherent and enforceable.

## Owns
- the architectural element model under `architecture/elements/`
- artifact-generation rules for `target-architecture.md` and focused contexts
- focus-element alias policy and collaborator integrity
- architectural documentation discipline for coding sessions

## Does not own
- product behavior decisions in `planning-context.md`
- runtime UI behavior
- domain rules, playback semantics, or persistence semantics
- deployment settings outside architecture-artifact workflow needs

## Collaborators
- app-shell
- navigation-service
- continuity-service

## Lifecycle notes
Architecture governance is always-on repository infrastructure.
It is exercised during planning, implementation, CI validation, artifact generation, and pull-request review.

## Invariants
- every architectural element id is unique
- collaborator references resolve to real architectural elements
- generated architecture artifacts are reproducible from checked-in source files
- focus-element selection is deterministic from branch aliases or the configured default
- architectural context generation never becomes the source of truth; the markdown artifacts remain authoritative

## Code ownership hints
- architecture/**
- scripts/architecture/**
- .github/workflows/ci.yml
- .github/workflows/update-generated-artifacts.yml
- repomix.config.json
- repomix-instruction.md