# Repository Code Path Coverage Manifest

This generated manifest summarizes how the architecture maps onto the current filesystem so implementation sessions can tell the difference between missing code, empty owned areas, and genuinely populated code paths.

Use this manifest before concluding that an architectural area is absent or before borrowing nearby files that are outside the declared ownership paths.

## How to use this manifest

- When a requested slice depends on paths marked `present`, start from those files.
- When a requested slice depends on paths marked `path missing`, `directory exists but empty`, or `no matches for glob`, clarify whether the architecture is intentionally ahead of implementation.
- When several collaborator areas are sparse, prefer expanding or refreshing architectural context before making cross-cutting implementation changes.

## Code path coverage

| Architectural element | Declared code path | Status | Matched files |
| --- | --- | --- | --- |
| architecture-governance | `.github/workflows/ci.yml` | present | 1 |
| architecture-governance | `.github/workflows/update-repo-context.yml` | path missing | 0 |
| architecture-governance | `architecture/**` | present | 41 |
| architecture-governance | `repomix-instruction.md` | present | 1 |
| architecture-governance | `repomix.config.json` | present | 1 |
| architecture-governance | `scripts/architecture/**` | present | 4 |
| app-shell | `src/app.html` | present | 1 |
| app-shell | `src/lib/ui/shell/**` | path missing | 0 |
| app-shell | `src/routes/+layout.svelte` | path missing | 0 |
| app-shell | `src/routes/+layout.ts` | present | 1 |
| planner-screen | `src/lib/ui/planner/**` | path missing | 0 |
| planner-screen | `src/routes/planner/+page.svelte` | present | 1 |
| profile-service | `src/lib/app/profile/**` | path missing | 0 |
| profile-service | `src/lib/domains/profiles/**` | path missing | 0 |
| navigation-service | `src/lib/app/navigation/**` | path missing | 0 |
| navigation-service | `src/routes/+layout.ts` | present | 1 |
| navigation-service | `src/routes/+page.ts` | present | 1 |
| library-service | `src/lib/domains/library/**` | path missing | 0 |
| library-service | `src/lib/platform/browser/fs/**` | path missing | 0 |
| library-service | `src/lib/platform/browser/permissions/**` | path missing | 0 |
| section-service | `src/lib/app/sections/**` | path missing | 0 |
| section-service | `src/lib/domains/sections/**` | path missing | 0 |
| activity-service | `src/lib/app/activities/**` | path missing | 0 |
| activity-service | `src/lib/domains/activities/**` | path missing | 0 |
| activity-composer-service | `src/lib/app/activity-composer/**` | path missing | 0 |
| activity-composer-service | `src/lib/ui/planner/**` | path missing | 0 |
| activity-composer-service | `src/lib/ui/player/**` | path missing | 0 |
| plan-service | `src/lib/app/plans/**` | path missing | 0 |
| plan-service | `src/lib/domains/plans/**` | path missing | 0 |
| player-session-service | `src/lib/app/player-session/**` | path missing | 0 |
| player-session-service | `src/lib/ui/player/**` | path missing | 0 |
| player-session-service | `src/routes/+layout.ts` | present | 1 |
| audio-engine | `src/lib/engines/audio/**` | path missing | 0 |
| audio-engine | `src/lib/platform/browser/audio/**` | path missing | 0 |
| audio-engine | `src/lib/platform/browser/media/**` | path missing | 0 |
| waveform-engine | `src/lib/engines/waveform/**` | path missing | 0 |
| waveform-engine | `src/lib/platform/browser/media/**` | path missing | 0 |
| waveform-engine | `src/lib/ui/player/**` | path missing | 0 |
| selection-engine | `src/lib/app/selection/**` | path missing | 0 |
| selection-engine | `src/lib/engines/selection/**` | path missing | 0 |
| selection-engine | `src/lib/ui/player/**` | path missing | 0 |
| continuity-service | `src/lib/app/continuity/**` | path missing | 0 |
| continuity-service | `src/lib/platform/browser/db/**` | path missing | 0 |
| continuity-service | `src/lib/platform/browser/fs/**` | path missing | 0 |
| error-recovery-coordinator | `src/lib/app/recovery/**` | path missing | 0 |
| error-recovery-coordinator | `src/lib/ui/shared/**` | path missing | 0 |
| error-recovery-coordinator | `src/routes/+layout.ts` | present | 1 |

## Relevant filesystem tree

### `.github/workflows/ci.yml`

```text
.github/workflows/ci.yml
```

### `.github/workflows/update-repo-context.yml`

```text
.github/workflows/update-repo-context.yml (missing)
```

### `architecture`

```text
architecture
├── context-manifests/
├── contexts/
│   ├── activity-composer-service.context.xml
│   ├── activity-service.context.xml
│   ├── app-shell.context.xml
│   ├── architecture-governance.context.xml
│   ├── audio-engine.context.xml
│   ├── continuity-service.context.xml
│   ├── current-focus.context.xml
│   ├── error-recovery-coordinator.context.xml
│   ├── library-service.context.xml
│   ├── navigation-service.context.xml
│   ├── plan-service.context.xml
│   ├── planner-screen.context.xml
│   ├── player-session-service.context.xml
│   ├── profile-service.context.xml
│   ├── section-service.context.xml
│   ├── selection-engine.context.xml
│   └── waveform-engine.context.xml
├── elements/
│   ├── activity-composer-service.md
│   ├── activity-service.md
│   ├── app-shell.md
│   ├── architecture-governance.md
│   ├── audio-engine.md
│   ├── continuity-service.md
│   ├── error-recovery-coordinator.md
│   ├── library-service.md
│   ├── navigation-service.md
│   ├── plan-service.md
│   ├── planner-screen.md
│   ├── player-session-service.md
│   ├── profile-service.md
│   ├── section-service.md
│   ├── selection-engine.md
│   └── waveform-engine.md
├── context-settings.json
├── element-seed-metadata.json
├── lifecycle-map.md
├── ownership-matrix.md
├── README.md
├── recovery-map.md
├── target-architecture.md
└── target-architecture.template.md
```

### `repomix-instruction.md`

```text
repomix-instruction.md
```

### `repomix.config.json`

```text
repomix.config.json
```

### `scripts/architecture`

```text
scripts/architecture
├── generate-context-configs.mjs
├── generate-target-architecture.mjs
├── lib.mjs
└── validate-architecture-consistency.mjs
```

### `src/app.html`

```text
src/app.html
```

### `src/lib/app/activities`

```text
src/lib/app/activities (missing)
```

### `src/lib/app/activity-composer`

```text
src/lib/app/activity-composer (missing)
```

### `src/lib/app/continuity`

```text
src/lib/app/continuity (missing)
```

### `src/lib/app/navigation`

```text
src/lib/app/navigation (missing)
```

### `src/lib/app/plans`

```text
src/lib/app/plans (missing)
```

### `src/lib/app/player-session`

```text
src/lib/app/player-session (missing)
```

### `src/lib/app/profile`

```text
src/lib/app/profile (missing)
```

### `src/lib/app/recovery`

```text
src/lib/app/recovery (missing)
```

### `src/lib/app/sections`

```text
src/lib/app/sections (missing)
```

### `src/lib/app/selection`

```text
src/lib/app/selection (missing)
```

### `src/lib/domains/activities`

```text
src/lib/domains/activities (missing)
```

### `src/lib/domains/library`

```text
src/lib/domains/library (missing)
```

### `src/lib/domains/plans`

```text
src/lib/domains/plans (missing)
```

### `src/lib/domains/profiles`

```text
src/lib/domains/profiles (missing)
```

### `src/lib/domains/sections`

```text
src/lib/domains/sections (missing)
```

### `src/lib/engines/audio`

```text
src/lib/engines/audio (missing)
```

### `src/lib/engines/selection`

```text
src/lib/engines/selection (missing)
```

### `src/lib/engines/waveform`

```text
src/lib/engines/waveform (missing)
```

### `src/lib/platform/browser/audio`

```text
src/lib/platform/browser/audio (missing)
```

### `src/lib/platform/browser/db`

```text
src/lib/platform/browser/db (missing)
```

### `src/lib/platform/browser/fs`

```text
src/lib/platform/browser/fs (missing)
```

### `src/lib/platform/browser/media`

```text
src/lib/platform/browser/media (missing)
```

### `src/lib/platform/browser/permissions`

```text
src/lib/platform/browser/permissions (missing)
```

### `src/lib/ui/planner`

```text
src/lib/ui/planner (missing)
```

### `src/lib/ui/player`

```text
src/lib/ui/player (missing)
```

### `src/lib/ui/shared`

```text
src/lib/ui/shared (missing)
```

### `src/lib/ui/shell`

```text
src/lib/ui/shell (missing)
```

### `src/routes/+layout.svelte`

```text
src/routes/+layout.svelte (missing)
```

### `src/routes/+layout.ts`

```text
src/routes/+layout.ts
```

### `src/routes/+page.ts`

```text
src/routes/+page.ts
```

### `src/routes/planner/+page.svelte`

```text
src/routes/planner/+page.svelte
```
