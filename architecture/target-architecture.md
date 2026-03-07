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

## Cold start

1. Open IndexedDB and validate schema
2. Load durable entities and continuity settings
3. Ensure at least one profile exists
4. Restore active profile
5. Restore stored folder capability reference
6. Validate folder permission and reconnect state
7. Rebuild track inventory when the handle is usable
8. Restore active track and focused section when resolvable
9. Initialize audio, waveform, and selection engines
10. Register service worker and update observers
11. Enter `ready`, `needs-attention`, or `fatal`

## Profile change

1. Persist new active profile
2. Re-scope activities, sections, plan, and mastery data
3. Reconcile active track and focused section for the new profile
4. Update planner and player-derived views

## Folder connection or reconnect

1. Request or validate the folder handle
2. Enumerate supported audio files
3. Persist the capability reference and inventory metadata
4. Reconcile last active track
5. Surface reconnect or recovery state if validation fails

## Track change

1. Persist active track continuity
2. Cancel stale media-load work
3. Load audio into the audio engine
4. Load waveform data into the waveform engine
5. Reset or restore selection and focused section
6. Publish a new player-session snapshot

## Launch from planner

1. Resolve the activity or plan item target
2. Update player launch context in session state
3. Select track and optional section target
4. Expand the player drawer
5. Start playback only when the launch mode explicitly requests it

## Foreground / background

### Background

- flush continuity settings
- preserve session context
- suspend audio according to policy

### Foreground

- revalidate folder handle and permissions
- restore media readiness if still valid
- surface recovery state if continuity is stale

## Update activation

1. Detect update readiness through the service worker
2. Delay activation during active playback or uncommitted draft work
3. Flush continuity settings
4. Activate the update
5. Reload into the restored planner-first shell

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

### Responsibility
Own the architecture artifact system itself: element metadata, collaborator definitions, generated target architecture, generated context slices, and the CI rules that keep them synchronized.

### Owns
- architecture artifact conventions
- branch-to-focus-element discipline
- generated artifact policy
- context-generation workflow rules

### Does not own
- product behavior
- runtime application state
- playback, planning, or persistence logic

### Collaborators
- app-shell
- navigation-service
- continuity-service

### Invariants
- each architectural element is defined in exactly one file
- collaborator identifiers must resolve to real element files
- generated artifacts are never hand-edited
- every non-main branch resolves to a focus element

### Code ownership hints
- architecture/**
- scripts/architecture/**
- .github/workflows/ci.yml
- .github/workflows/update-repo-context.yml
- repomix.config.json
- repomix-instruction.md

## App Shell

### Responsibility
Provide the persistent application shell that hosts planner content, the music player drawer, global overlays, and shell-level status.

### Owns
- persistent chrome
- overlay host
- drawer host
- shell-level status banners

### Does not own
- business entities
- audio timing
- waveform rendering internals
- file-system access

### Collaborators
- navigation-service
- player-session-service
- error-recovery-coordinator
- profile-service

### Invariants
- the shell stays mounted across route changes
- the player drawer is always available from the shell
- shell presentation never becomes the source of truth for domain or engine state

### Code ownership hints
- src/routes/+layout.ts
- src/routes/+layout.svelte
- src/app.html
- src/lib/ui/shell/**

## Planner Screen

### Responsibility
Provide the primary planning surface for activities, plan composition, add-activity flows, and launch actions into the player.

### Owns
- planner layout
- planner-only ephemeral UI state
- activity and plan list composition

### Does not own
- transport state
- waveform state
- track enumeration authority
- persistence writes

### Collaborators
- activity-service
- activity-composer-service
- plan-service
- profile-service
- navigation-service
- player-session-service

### Invariants
- planner interactions mutate durable state only through services
- planner launches resolve into player-session updates rather than direct component logic

### Code ownership hints
- src/routes/planner/+page.svelte
- src/lib/ui/planner/**

## Profile Service

### Responsibility
Manage profiles, default-profile bootstrap, active-profile selection, and profile-scoped partitioning for durable data.

### Owns
- profile creation and renaming
- active-profile continuity
- profile-scoped rebind triggers

### Does not own
- track inventory
- activity composition UI
- playback state

### Collaborators
- continuity-service
- planner-screen
- app-shell

### Invariants
- there is always at least one profile
- the active profile is always valid
- profile changes trigger deterministic re-scoping of dependent data

### Code ownership hints
- src/lib/domains/profiles/**
- src/lib/app/profile/**

## Navigation Service

### Responsibility
Own route state, overlay stack state, player-drawer history integration, and mobile back behavior.

### Owns
- route transitions
- overlay stack
- drawer expansion history rules

### Does not own
- rendering
- durable entities
- transport state

### Collaborators
- app-shell
- planner-screen
- player-session-service
- error-recovery-coordinator

### Invariants
- browser back closes the deepest overlay first
- browser back collapses the player drawer before leaving the current planner state
- overlay transitions are explicit and stack-based

### Code ownership hints
- src/lib/app/navigation/**
- src/routes/+layout.ts
- src/routes/+page.ts

## Library Service

### Responsibility
Manage the selected music folder, permission validation, track enumeration, reconnect flows, and active-track continuity.

### Owns
- folder connection state machine
- track inventory refresh
- active-track continuity
- missing-track detection

### Does not own
- audio transport
- waveform rendering
- activity persistence

### Collaborators
- continuity-service
- player-session-service
- error-recovery-coordinator
- section-service
- activity-service

### Invariants
- inventory refresh occurs only from a validated folder handle
- stored references are revalidated before use
- missing tracks are surfaced explicitly, not silently cleared

### Code ownership hints
- src/lib/domains/library/**
- src/lib/platform/browser/fs/**
- src/lib/platform/browser/permissions/**

## Section Service

### Responsibility
Manage saved sections, focused section continuity, and section actions tied to the current track and profile.

### Owns
- section CRUD
- focused-section selection
- section filtering by active track
- bounds validation on save

### Does not own
- gesture-driven selection
- playback timing
- waveform rendering

### Collaborators
- selection-engine
- player-session-service
- library-service
- continuity-service
- activity-service

### Invariants
- a saved section always belongs to exactly one profile and one track
- a focused section either resolves to a valid saved range or is marked unavailable
- section actions go through the service, not direct component mutation

### Code ownership hints
- src/lib/domains/sections/**
- src/lib/app/sections/**

## Activity Service

### Responsibility
Persist reusable activities, validate their targets, and expose availability status for planner and launch flows.

### Owns
- activity CRUD
- target validation
- activity availability classification

### Does not own
- draft-composition UI
- plan ordering
- playback state

### Collaborators
- activity-composer-service
- plan-service
- library-service
- section-service
- player-session-service

### Invariants
- each activity has exactly one target type
- unavailable references remain explicit rather than being silently rewritten
- validation depends on current library and section state, not component-local heuristics

### Code ownership hints
- src/lib/domains/activities/**
- src/lib/app/activities/**

## Activity Composer Service

### Responsibility
Own the draft lifecycle for creating and editing activities from current media context or explicit custom input.

### Owns
- activity draft creation
- draft validation orchestration
- current-media-context import
- commit and cancel behavior

### Does not own
- persisted activity collection
- sheet presentation
- track inventory authority

### Collaborators
- activity-service
- player-session-service
- library-service
- section-service
- planner-screen

### Invariants
- draft commit is blocked until validation succeeds
- importing current media context is explicit and reversible
- only one draft is active at a time

### Code ownership hints
- src/lib/app/activity-composer/**
- src/lib/ui/planner/**
- src/lib/ui/player/**

## Plan Service

### Responsibility
Manage plan composition, ordered plan items, and transactional plan updates for the active profile.

### Owns
- plan persistence
- item ordering
- add/remove/reorder behavior

### Does not own
- activity definitions
- playback state
- route navigation

### Collaborators
- planner-screen
- activity-service
- player-session-service

### Invariants
- each plan item references an activity
- reorder operations preserve stable item identity
- plan updates are atomic at the service boundary

### Code ownership hints
- src/lib/domains/plans/**
- src/lib/app/plans/**

## Player Session Service

### Responsibility
Bind session context to the player-facing engines so that track, section, and launch context produce coherent playback-ready state.

### Owns
- player session state machine
- engine load serialization
- focus-to-selection synchronization
- launch-context consumption

### Does not own
- audio graph internals
- waveform rendering internals
- durable section storage

### Collaborators
- audio-engine
- waveform-engine
- selection-engine
- library-service
- section-service
- continuity-service
- navigation-service

### Invariants
- engine loads are cancellable and serialized
- focused-section changes synchronize playback bounds explicitly
- launch resolution always results in an explicit player state

### Code ownership hints
- src/lib/app/player-session/**
- src/lib/ui/player/**
- src/routes/+layout.ts

## Audio Engine

### Responsibility
Provide low-latency transport, playback rate, loop mode, bounded playback, and transport-event emission.

### Owns
- transport clock
- play/pause state
- playback rate
- loop mode
- playback bounds
- decoded source lifecycle

### Does not own
- track inventory
- section persistence
- UI gesture recognition

### Collaborators
- player-session-service
- waveform-engine
- selection-engine
- error-recovery-coordinator
- continuity-service

### Invariants
- playback bounds are enforced inside the engine
- rate is clamped to product-defined limits
- commands remain safe when no track is loaded

### Code ownership hints
- src/lib/engines/audio/**
- src/lib/platform/browser/audio/**
- src/lib/platform/browser/media/**

## Waveform Engine

### Responsibility
Load waveform data, manage render readiness, maintain viewport and zoom state, and map scrubbing gestures to media time.

### Owns
- waveform readiness
- viewport
- zoom
- playhead projection
- render scheduling

### Does not own
- playback transport
- selection invariants
- persistence

### Collaborators
- player-session-service
- audio-engine
- selection-engine
- error-recovery-coordinator

### Invariants
- waveform work is cancellable on track changes
- gesture-to-time mapping is deterministic
- render scheduling protects UI responsiveness

### Code ownership hints
- src/lib/engines/waveform/**
- src/lib/platform/browser/media/**
- src/lib/ui/player/**

## Selection Engine

### Responsibility
Own A/B selection, focused-range synchronization, touch-driven selection gestures, and playback-bound updates.

### Owns
- selection state machine
- selection timestamps
- focused range
- selection validity and clamping

### Does not own
- section persistence
- waveform rendering internals
- audio decoding

### Collaborators
- player-session-service
- waveform-engine
- audio-engine
- section-service

### Invariants
- selection start is always before selection end
- focused range and playback bounds remain synchronized through explicit contracts
- selection resets or restores deterministically on track changes

### Code ownership hints
- src/lib/engines/selection/**
- src/lib/ui/player/**
- src/lib/app/selection/**

## Continuity Service

### Responsibility
Persist and restore continuity signals across refresh, reopen, backgrounding, and update activation.

### Owns
- active-profile continuity
- folder capability continuity
- active-track continuity
- focused-section continuity
- player-context continuity policy

### Does not own
- entity CRUD
- direct UI prompts
- browser API implementations

### Collaborators
- profile-service
- library-service
- section-service
- player-session-service
- error-recovery-coordinator

### Invariants
- continuity never silently clears stale references
- every unresolved restore becomes an explicit recovery state
- continuity writes happen at the service boundary, not in components

### Code ownership hints
- src/lib/app/continuity/**
- src/lib/platform/browser/db/**
- src/lib/platform/browser/fs/**

## Error Recovery Coordinator

### Responsibility
Classify failures and unavailable states, map them to recovery actions, and surface high-signal recovery models to the shell, planner, and player.

### Owns
- error taxonomy
- recoverability classification
- recommended recovery actions
- recovery-state aggregation

### Does not own
- rendering
- entity persistence
- engine internals

### Collaborators
- app-shell
- library-service
- player-session-service
- audio-engine
- waveform-engine
- continuity-service
- navigation-service

### Invariants
- every problem is classified as auto-recovering, recoverable-with-action, or fatal
- the UI receives actionable recovery state instead of raw exceptions
- recovery rules remain explicit and centralized

### Code ownership hints
- src/lib/app/recovery/**
- src/lib/ui/shared/**
- src/routes/+layout.ts