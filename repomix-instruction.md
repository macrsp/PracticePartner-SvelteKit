<!--
  @role repository-instructions
  @owns repository-wide implementation rules, instruction priority, migration guardrails, output contract, and maintenance conventions
  @not-owns product requirements or per-file responsibilities
  @notes This file is the primary execution surface for AI implementation behavior in this repository.
-->

# Repository Instructions

## Purpose

This is the SvelteKit migration target for Suzuki Practice Partner.

This file is the **primary execution surface** for implementation behavior in AI-assisted coding sessions.

Use it to decide:
- how to interpret constraints
- how to resolve ambiguities
- how to prioritize simplicity vs preservation
- what output shape to return

Do not use it to redefine product behavior. Product behavior belongs in `planning-context.md`.

---

## Instruction Priority

When instructions or signals conflict, use this order:

1. **This file (`repomix-instruction.md`)**
2. **`planning-context.md`** for product direction and accepted behavior
3. **`migration-context.md`** for current migration goals and intentional non-goals
4. **file headers** for per-file ownership and boundaries
5. **the current codebase** for implementation details

### Tie-breaker rule

If an example structure, earlier scaffold, or legacy pattern conflicts with:
- SvelteKit correctness
- current product direction
- or the simplicity rules in this file

then prefer correctness and simplicity, and explain the deviation briefly.

---

## Core Implementation Rules

- Favor **small, composable modules**.
- Keep **browser APIs isolated** behind platform adapters.
- Keep **route files thin**.
- Prefer **SvelteKit-native patterns** over legacy structure preservation.
- Preserve **GitHub Pages compatibility**.
- Preserve a clean path to **future Tone.js integration**.
- Do not introduce unnecessary dependencies.

### Literalness rule

Treat examples and suggested structures as **non-binding** unless they are explicitly labeled **required**.

Do not infer mandatory structure from:
- example directory layouts
- phrases like “along these lines”
- temporary scaffold routes or placeholder files

---

## Migration Rules

This repository is a migration target, not a line-for-line port.

### Preserve behavior, not legacy shape

Do not preserve legacy concepts merely because they exist in the source repo.

Preserve only:
- user-visible behavior that still matches the new product direction
- persistence requirements that still matter
- architectural boundaries that improve clarity in the new app

Do **not** preserve:
- route structure
- controller graph shape
- DOM wiring style

### Prefer current product direction over legacy architecture

If the legacy app bundles too many concerns into one surface, split them in the target repo according to the current product direction.

### Avoid speculative scaffolding

Do not create large empty directory trees or placeholder modules unless they are immediately useful for the current slice.

Prefer a smaller correct structure over a larger aspirational one.

---

## SvelteKit Guardrails

- Prefer the **simplest valid SvelteKit routing structure**.
- Do **not** introduce route groups unless they materially improve the solution.
- Do **not** move or duplicate routes just to satisfy an example structure.
- If a shared shell is needed, prefer a minimal `+layout.svelte` approach unless a more complex structure is justified.
- If a suggested structure conflicts with filesystem routing behavior, prefer routing correctness.
- Do **not** add the workspace concept back! It is is the reference repo, but it is explicitly deleted!!!

### Routing-specific tie-breaker

If there is a choice between:
- preserving an example route layout
- and keeping routing simple and correct

choose the simpler correct routing structure.

---

## State and Browser Boundary Rules

- No global mutable singleton app-state module unless explicitly requested.
- Prefer state factories, context, or narrowly scoped stores over repo-wide mutable globals.
- IndexedDB, file-system access, audio APIs, and other browser-only integrations must live behind platform/browser modules.
- Route components and presentational components must not own low-level browser persistence or audio logic.

---

## File Change Rules

You may:
- create files
- delete files
- move files
- rename files

when needed for a cleaner or more correct implementation.

### Deletion / move rule

Do not keep a bad scaffold, conflicting route, or obsolete placeholder file just to avoid deleting it.

If you delete, move, or rename a file:
- say so explicitly in a short list before the file contents
- still return full contents of all remaining changed files

---

## Output Contract

For implementation requests:

1. Give a **brief explanation** of the chosen approach.
2. List any **deleted, moved, or renamed files** explicitly.
3. Then return the **full contents of each changed file only**.
4. Do not return diff hunks unless explicitly requested.

### When not to preserve suggestions

If a user prompt includes a suggested structure, treat it as:
- a preference
- not a requirement

unless the user explicitly says:
- “must use this structure”
- “required”
- “do not deviate”

---

## Planning / Product Boundary

`planning-context.md` is the source of truth for:
- accepted behavior
- product direction
- user-visible goals

Do not silently reinterpret accepted product direction during implementation.

If the codebase or a prompt example points in a different direction than `planning-context.md`, follow `planning-context.md`.

---

## Current Migration Heuristics

When migrating a slice:

- prefer behavior-preserving rewrites over literal ports
- prefer planner-first/library-first surfaces. DO NOT revive the overly broad legacy “workspace” surfaces - the product direction has changed and that concept is reference only.
- prefer reusable UI surfaces such as drawers/panels over dedicated routes when the product direction calls for them
- keep the current slice minimal and prove the architecture before adding downstream complexity

---

## Maintenance Conventions

- Keep headers current in comment-capable files.
- When a file’s responsibility changes materially, update its header in the same change.
- Keep this file concise, operational, and high-signal.
- Add new repository-wide rules here only when they are broadly reusable across slices.
