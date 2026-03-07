<!--
  @role architecture-template
  @owns the template used to generate the full target architecture document
  @not-owns the source content for individual elements
  @notes Do not place element-specific rules here; those belong in the element files.
-->

# Target Architecture

> This file is generated from the source artifacts under `architecture/`.  
> Edit the element files, ownership matrix, lifecycle map, recovery map, or this template.  
> Do not edit the generated output manually.

## Ownership Matrix

# Ownership Matrix

| State area | Authoritative owner | Writes through | Primary observers |
| --- | --- | --- | --- |
| active profile | Session context store | Profile service | App shell, planner screen, player session service |
| profiles collection | Durable app store | Profile service | App shell, planner screen |
| folder connection state | Session context store | Library service | App shell, planner screen, music player drawer |
| track inventory | Durable app store plus cache metadata | Library service | Track picker, activity composer, player session service |
| active track | Session context store | Library service, launch-to-player use case | Music player drawer, activity composer |
| playback state | Audio engine | Audio engine commands only | Music player drawer, history service |
| waveform viewport | Waveform engine | Waveform engine commands only | Music player drawer |
| A/B selection | Selection engine | Selection engine commands only | Music player drawer, section service |
| focused section | Session context store | Section service, player session service | Music player drawer, planner launch flows |
| sections collection | Durable app store | Section service | Music player drawer, activity service |
| activities collection | Durable app store | Activity service | Planner screen, activity composer, plan service |
| activity draft | Activity draft store | Activity composer service | Activity composer sheet |
| practice plan | Durable app store | Plan service | Planner screen, launch-to-player use case |
| continuity settings | Durable app store | Continuity service, profile service, library service, section service | Bootstrap coordinator |
| recovery state | Error recovery coordinator | Error recovery coordinator | App shell, planner screen, music player drawer |
| overlay stack | Ephemeral UI registry | Navigation service | App shell |
| update/install state | Session coordination services | Update lifecycle coordinator, install experience coordinator | App shell |

## Lifecycle Map

# Lifecycle Map

## Recovery Map

# Recovery Map

| Condition | Primary detector | Surfaced state | Primary user action | Continuity policy |
| --- | --- | --- | --- | --- |
| no folder selected | Library service | connect-required | choose folder | preserve profile and planner state |
| folder permission lost | Permission adapter via library service | permission-lost | reconnect folder | preserve stored reference until explicit replacement |
| stored folder handle is stale | File-system adapter via library service | handle-invalid | reconnect folder | keep last known track key but mark unavailable |
| active track missing from inventory | Library service | track-unavailable | choose a different track or reconnect | keep reference explicit rather than silently clearing |
| section target missing | Section service or launch resolver | section-unavailable | remove, relink, or ignore | keep saved references explicit |
| activity target unavailable | Activity service | activity-unavailable | edit activity or choose alternate launch | preserve activity and plan membership |
| audio decode failure | Media-decode adapter via audio engine | media-load-failed | retry or choose another track | preserve continuity reference but classify as unavailable |
| storage or schema failure | database adapter | fatal-storage | reload after fix or schema repair | do not continue with partial writes |
| offline shell asset issue | service worker adapter | offline-not-ready | retry when assets are available | durable data remains local |
| update ready while active playback is running | update lifecycle coordinator | update-deferred | apply update after playback stops | do not interrupt playback or drop continuity |

## Architectural Elements

## Architecture Governance

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

## App Shell

# App Shell

## Responsibility
Define and maintain the runtime contract for app shell.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- navigation-service
- player-session-service
- error-recovery-coordinator
- profile-service

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/routes/+layout.ts
- src/routes/+layout.svelte
- src/app.html
- src/lib/ui/shell/**

## Planner Screen

# Planner Screen

## Responsibility
Define and maintain the runtime contract for planner screen.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- activity-service
- activity-composer-service
- plan-service
- profile-service
- navigation-service
- player-session-service

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/routes/planner/+page.svelte
- src/lib/ui/planner/**

## Profile Service

# Profile Service

## Responsibility
Define and maintain the runtime contract for profile service.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- continuity-service
- planner-screen
- app-shell

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/lib/domains/profiles/**
- src/lib/app/profile/**

## Navigation Service

# Navigation Service

## Responsibility
Define and maintain the runtime contract for navigation service.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- app-shell
- planner-screen
- player-session-service
- error-recovery-coordinator

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/lib/app/navigation/**
- src/routes/+layout.ts
- src/routes/+page.ts

## Library Service

# Library Service

## Responsibility
Define and maintain the runtime contract for library service.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- continuity-service
- player-session-service
- error-recovery-coordinator
- section-service
- activity-service

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/lib/domains/library/**
- src/lib/platform/browser/fs/**
- src/lib/platform/browser/permissions/**

## Section Service

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

## Activity Service

# Activity Service

## Responsibility
Define and maintain the runtime contract for activity service.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- activity-composer-service
- plan-service
- library-service
- section-service
- player-session-service

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/lib/domains/activities/**
- src/lib/app/activities/**

## Activity Composer Service

# Activity Composer Service

## Responsibility
Define and maintain the runtime contract for activity composer service.
Become the man

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- activity-service
- player-session-service
- library-service
- section-service
- planner-screen

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/lib/app/activity-composer/**
- src/lib/ui/planner/**
- src/lib/ui/player/**

## Plan Service

# Plan Service

## Responsibility
Define and maintain the runtime contract for plan service.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
- planner-screen
- activity-service
- player-session-service

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
- src/lib/domains/plans/**
- src/lib/app/plans/**

## Player Session Service

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

## Audio Engine

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

## Waveform Engine

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

## Selection Engine

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

## Continuity Service

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

## Error Recovery Coordinator

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
