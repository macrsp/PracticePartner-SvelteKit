# Section Service Context Coverage Manifest

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

- `library-service` (collaborator)
- `section-service` (focus)
- `activity-service` (collaborator)
- `player-session-service` (collaborator)
- `selection-engine` (collaborator)
- `continuity-service` (collaborator)

## Code path coverage

| Context role | Architectural element | Declared code path | Status | Matched files |
| --- | --- | --- | --- | --- |
| collaborator | library-service | `src/lib/domains/library/**` | path missing | 0 |
| collaborator | library-service | `src/lib/platform/browser/fs/**` | path missing | 0 |
| collaborator | library-service | `src/lib/platform/browser/permissions/**` | path missing | 0 |
| focus | section-service | `src/lib/app/sections/**` | path missing | 0 |
| focus | section-service | `src/lib/domains/sections/**` | path missing | 0 |
| collaborator | activity-service | `src/lib/app/activities/**` | path missing | 0 |
| collaborator | activity-service | `src/lib/domains/activities/**` | path missing | 0 |
| collaborator | player-session-service | `src/lib/app/player-session/**` | path missing | 0 |
| collaborator | player-session-service | `src/lib/ui/player/**` | path missing | 0 |
| collaborator | player-session-service | `src/routes/+layout.ts` | present | 1 |
| collaborator | selection-engine | `src/lib/app/selection/**` | path missing | 0 |
| collaborator | selection-engine | `src/lib/engines/selection/**` | path missing | 0 |
| collaborator | selection-engine | `src/lib/ui/player/**` | path missing | 0 |
| collaborator | continuity-service | `src/lib/app/continuity/**` | path missing | 0 |
| collaborator | continuity-service | `src/lib/platform/browser/db/**` | path missing | 0 |
| collaborator | continuity-service | `src/lib/platform/browser/fs/**` | path missing | 0 |

## Relevant filesystem tree

### `src/lib/app/activities`

```text
src/lib/app/activities (missing)
```

### `src/lib/app/continuity`

```text
src/lib/app/continuity (missing)
```

### `src/lib/app/player-session`

```text
src/lib/app/player-session (missing)
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

### `src/lib/domains/sections`

```text
src/lib/domains/sections (missing)
```

### `src/lib/engines/selection`

```text
src/lib/engines/selection (missing)
```

### `src/lib/platform/browser/db`

```text
src/lib/platform/browser/db (missing)
```

### `src/lib/platform/browser/fs`

```text
src/lib/platform/browser/fs (missing)
```

### `src/lib/platform/browser/permissions`

```text
src/lib/platform/browser/permissions (missing)
```

### `src/lib/ui/player`

```text
src/lib/ui/player (missing)
```

### `src/routes/+layout.ts`

```text
src/routes/+layout.ts
```
