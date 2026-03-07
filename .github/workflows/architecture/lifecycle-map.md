<!--
  @role architecture-artifact
  @owns the high-level runtime lifecycle map
  @not-owns detailed service contracts or UI copy
  @notes Keep transitions concise and implementation-agnostic.
-->

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