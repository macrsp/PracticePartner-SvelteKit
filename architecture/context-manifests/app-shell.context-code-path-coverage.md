# App Shell Context Coverage Manifest

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

- `app-shell` (focus)
- `profile-service` (collaborator)
- `navigation-service` (collaborator)
- `player-session-service` (collaborator)
- `error-recovery-coordinator` (collaborator)

## Code path coverage

| Context role | Architectural element | Declared code path | Status | Matched files |
| --- | --- | --- | --- | --- |
| focus | app-shell | `src/app.html` | present | 1 |
| focus | app-shell | `src/lib/ui/shell/**` | path missing | 0 |
| focus | app-shell | `src/routes/+layout.svelte` | path missing | 0 |
| focus | app-shell | `src/routes/+layout.ts` | present | 1 |
| collaborator | profile-service | `src/lib/app/profile/**` | path missing | 0 |
| collaborator | profile-service | `src/lib/domains/profiles/**` | path missing | 0 |
| collaborator | navigation-service | `src/lib/app/navigation/**` | path missing | 0 |
| collaborator | navigation-service | `src/routes/+layout.ts` | present | 1 |
| collaborator | navigation-service | `src/routes/+page.ts` | present | 1 |
| collaborator | player-session-service | `src/lib/app/player-session/**` | path missing | 0 |
| collaborator | player-session-service | `src/lib/ui/player/**` | path missing | 0 |
| collaborator | player-session-service | `src/routes/+layout.ts` | present | 1 |
| collaborator | error-recovery-coordinator | `src/lib/app/recovery/**` | path missing | 0 |
| collaborator | error-recovery-coordinator | `src/lib/ui/shared/**` | path missing | 0 |
| collaborator | error-recovery-coordinator | `src/routes/+layout.ts` | present | 1 |

## Relevant filesystem tree

### `src/app.html`

```text
src/app.html
```

### `src/lib/app/navigation`

```text
src/lib/app/navigation (missing)
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

### `src/lib/domains/profiles`

```text
src/lib/domains/profiles (missing)
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
