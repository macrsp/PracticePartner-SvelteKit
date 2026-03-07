# Plan Service Context Coverage Manifest

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

- `planner-screen` (collaborator)
- `activity-service` (collaborator)
- `plan-service` (focus)
- `player-session-service` (collaborator)

## Code path coverage

| Context role | Architectural element | Declared code path | Status | Matched files |
| --- | --- | --- | --- | --- |
| collaborator | planner-screen | `src/lib/ui/planner/**` | path missing | 0 |
| collaborator | planner-screen | `src/routes/planner/+page.svelte` | present | 1 |
| collaborator | activity-service | `src/lib/app/activities/**` | path missing | 0 |
| collaborator | activity-service | `src/lib/domains/activities/**` | path missing | 0 |
| focus | plan-service | `src/lib/app/plans/**` | path missing | 0 |
| focus | plan-service | `src/lib/domains/plans/**` | path missing | 0 |
| collaborator | player-session-service | `src/lib/app/player-session/**` | path missing | 0 |
| collaborator | player-session-service | `src/lib/ui/player/**` | path missing | 0 |
| collaborator | player-session-service | `src/routes/+layout.ts` | present | 1 |

## Relevant filesystem tree

### `src/lib/app/activities`

```text
src/lib/app/activities (missing)
```

### `src/lib/app/plans`

```text
src/lib/app/plans (missing)
```

### `src/lib/app/player-session`

```text
src/lib/app/player-session (missing)
```

### `src/lib/domains/activities`

```text
src/lib/domains/activities (missing)
```

### `src/lib/domains/plans`

```text
src/lib/domains/plans (missing)
```

### `src/lib/ui/planner`

```text
src/lib/ui/planner (missing)
```

### `src/lib/ui/player`

```text
src/lib/ui/player (missing)
```

### `src/routes/+layout.ts`

```text
src/routes/+layout.ts
```

### `src/routes/planner/+page.svelte`

```text
src/routes/planner/+page.svelte
```
