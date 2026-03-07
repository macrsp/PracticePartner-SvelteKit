# Architecture Governance Context Coverage Manifest

This generated manifest helps distinguish between code that is present in the repository and code paths that are declared architecturally but are still empty or missing.

Use this manifest before assuming that a missing file in the packed context means the repository has no implementation for that area.

## How to use this manifest

- Start with the focus element rows, then inspect collaborator rows that the requested change depends on.
- Treat `path missing` and `directory exists but empty` as signals that the architecture may be ahead of implementation or that the next step is first-time implementation.
- Treat `no matches for glob` as a sign to clarify whether the declared ownership path is stale, overly broad, or simply not populated yet.
- If the needed collaborator area is sparse or missing, clarify architectural intent before spreading implementation into adjacent undeclared areas.

## Status meanings

| Status | Meaning |
| --- | --- |
| `present` | One or more files matched the declared path. |
| `directory exists but empty` | The owned directory exists, but it does not contain files yet. |
| `path missing` | The declared file or directory root does not exist in the repository yet. |
| `no matches for glob` | The root exists, but nothing currently matches the declared glob. |

## Elements in this context

- `architecture-governance` (focus)
- `app-shell` (collaborator)
- `navigation-service` (collaborator)
- `continuity-service` (collaborator)

## Code path coverage

| Context role | Architectural element | Declared code path | Status | Matched files |
| --- | --- | --- | --- | --- |
| focus | architecture-governance | `.github/workflows/ci.yml` | present | 1 |
| focus | architecture-governance | `.github/workflows/update-generated-artifacts.yml` | present | 1 |
| focus | architecture-governance | `architecture/**` | present | 41 |
| focus | architecture-governance | `repomix-instruction.md` | present | 1 |
| focus | architecture-governance | `repomix.config.json` | present | 1 |
| focus | architecture-governance | `scripts/architecture/**` | present | 4 |
| collaborator | app-shell | `src/app.html` | present | 1 |
| collaborator | app-shell | `src/lib/ui/shell/**` | path missing | 0 |
| collaborator | app-shell | `src/routes/+layout.svelte` | path missing | 0 |
| collaborator | app-shell | `src/routes/+layout.ts` | present | 1 |
| collaborator | navigation-service | `src/lib/app/navigation/**` | path missing | 0 |
| collaborator | navigation-service | `src/routes/+layout.ts` | present | 1 |
| collaborator | navigation-service | `src/routes/+page.ts` | present | 1 |
| collaborator | continuity-service | `src/lib/app/continuity/**` | path missing | 0 |
| collaborator | continuity-service | `src/lib/platform/browser/db/**` | path missing | 0 |
| collaborator | continuity-service | `src/lib/platform/browser/fs/**` | path missing | 0 |

## Relevant filesystem tree

### `.github/workflows/ci.yml`

```text
.github/workflows/ci.yml
```

### `.github/workflows/update-generated-artifacts.yml`

```text
.github/workflows/update-generated-artifacts.yml
```

### `architecture`

```text
architecture
├── context-manifests/
│   └── repo-code-path-coverage.md
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

### `src/lib/app/continuity`

```text
src/lib/app/continuity (missing)
```

### `src/lib/app/navigation`

```text
src/lib/app/navigation (missing)
```

### `src/lib/platform/browser/db`

```text
src/lib/platform/browser/db (missing)
```

### `src/lib/platform/browser/fs`

```text
src/lib/platform/browser/fs (missing)
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
