<!--
  @role repository-instructions
  @owns repository-wide implementation rules, instruction priority, output contract, architecture-artifact discipline, and maintenance conventions
  @not-owns product requirements or per-file responsibilities
  @notes This file is the primary execution surface for AI implementation behavior in this repository.
-->

# Repository Instructions

## Purpose

This file defines repository-wide implementation behavior for AI-assisted coding sessions.

Use it to decide:

- how to interpret constraints
- how to resolve ambiguities
- how to prioritize simplicity versus abstraction
- what output shape to return
- how to preserve architectural boundaries

Do not use it to redefine product behavior. Product behavior belongs in `planning-context.md`.

---

## Instruction Priority

When instructions or signals conflict, use this order:

1. **This file (`repomix-instruction.md`)**
2. **`planning-context.md`** for product direction and accepted behavior
3. **architecture artifacts** under `architecture/`
4. **file headers** for per-file ownership and boundaries
5. **the current codebase** for implementation details

### Tie-breaker rule

If an example structure, earlier scaffold, or informal pattern conflicts with:

- SvelteKit correctness
- current product direction
- or the simplicity rules in this file

prefer correctness and simplicity, and explain the deviation briefly.

---

## Core Implementation Rules

- Favor **small, composable modules**.
- Keep **browser APIs isolated** behind platform adapters.
- Keep **route files thin**.
- Prefer **SvelteKit-native patterns**.
- Preserve **Cloudflare Pages compatibility**.
- Preserve a clean path to **future Tone.js integration**.
- Do not introduce unnecessary dependencies.
- Prefer explicit contracts for services, engines, and adapters over incidental component logic.

### Literalness rule

Treat examples and suggested structures as **non-binding** unless they are explicitly labeled **required**.

Do not infer mandatory structure from:

- example directory layouts
- phrases like “along these lines”
- placeholder files
- temporary scaffolding

---

## Hosting Rules

Assume the production host is **Cloudflare Pages**.

Implementation must remain compatible with:

- a static SvelteKit build
- root-path deployment
- no Node server runtime
- no server-only SvelteKit features
- browser-first PWA behavior

Do not introduce:

- server runtime requirements
- server endpoints as required application infrastructure
- hosting assumptions that depend on path-prefixed deployment
- implementation choices that require anything other than static output deployed to Cloudflare Pages

---

## Development Environment Rules

Assume a **CI/CD-first** execution model for this repository.

Implementation and validation should assume:

- there is **no local development environment**
- validation happens primarily through **GitHub Actions**
- repository edits plus CI validation are the default workflow
- local-machine-specific setup should not be assumed

Do not default to telling the user to run commands locally.

Use **GitHub Codespaces** only when it is clearly necessary and the task cannot reasonably be completed through repository changes plus the existing CI/CD pipeline.

Prefer:

- repository edits
- workflow-based validation
- static build verification in CI
- deployment validation through the existing GitHub Actions pipeline

Avoid introducing:

- instructions that assume a persistent local machine setup
- tooling that is only justified by local development convenience
- implementation steps that require local execution when CI/CD validation is sufficient

---

## Architecture Artifact Rules

The architecture source of truth lives under `architecture/`.

The architecture set is split as follows:

- `architecture/ownership-matrix.md` is the smallest high-signal architectural reference and should be safe to include in all coding sessions
- `architecture/lifecycle-map.md` captures runtime lifecycle transitions
- `architecture/recovery-map.md` captures failure and recovery behavior
- `architecture/elements/*.md` are the source files for individual architectural elements
- `architecture/target-architecture.template.md` is the template for the generated architecture document
- `architecture/target-architecture.md` is a generated artifact
- `architecture/contexts/*.xml` are generated artifacts

Do not hand-edit:

- `architecture/target-architecture.md`
- `architecture/contexts/*.xml`

Those are generated and maintained automatically by GitHub Actions.

---

## Focus Element Rules

Every meaningful coding session should have a **focus architectural element**.

The preferred way to select the focus element is from the branch name by matching one of the `branch_aliases` declared in `architecture/elements/*.md`.

If a branch name does not match any declared alias, the repository falls back to the default focus element:

- `architecture-governance`

That fallback is intended for cross-cutting repo work, artifact maintenance, and sessions whose branch names are not yet architecture-specific.

The first step in any coding session is to update the focus element’s architecture file, including:

- collaborators
- ownership boundaries
- invariants
- lifecycle notes
- any architecture details that are changing in the session

Do not start implementation by changing code first and updating architecture later.

Alias-based branch naming is still preferred because it produces a tighter focused context slice than the governance fallback.

---

## Product-shape Rules

Implement the current product direction as follows:

- prefer **planner-first** surfaces
- prefer reusable **drawer/panel** execution surfaces for media interaction
- keep organization and execution as distinct concerns
- keep profiles, sections, activities, and plans as distinct concepts
- do not collapse unrelated product concepts into a single convenience abstraction

---

## SvelteKit Guardrails

- Prefer the **simplest valid SvelteKit routing structure**.
- Do **not** introduce route groups unless they materially improve the solution.
- Do **not** move or duplicate routes just to satisfy an example structure.
- If a shared shell is needed, prefer a minimal `+layout.svelte` approach unless a more complex structure is justified.
- If a suggested structure conflicts with filesystem routing behavior, prefer routing correctness.

### Routing-specific tie-breaker

If there is a choice between:

- preserving an example route layout
- and keeping routing simple and correct

choose the simpler correct routing structure.

---

## Architecture Boundary Rules

- Keep domain rules separate from UI composition.
- Keep application orchestration separate from browser capability access.
- Treat interaction-heavy systems such as playback, waveform handling, and selection as dedicated services or engines with explicit contracts.
- Do not let route components or presentational components own persistence, audio control, or file-system logic.
- Keep continuity and recovery behavior explicit rather than implicit.

---

## State and Browser Boundary Rules

- No global mutable singleton app-state module unless explicitly requested.
- Prefer state factories, context, or narrowly scoped stores over repo-wide mutable globals.
- Keep durable state, session state, ephemeral UI state, and derived state conceptually distinct.
- IndexedDB, file-system access, audio APIs, service worker behavior, and other browser-only integrations must live behind platform/browser modules.
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

## Session Focus Rules

When implementing a slice, keep the change set focused on a small number of architectural elements.

Prefer work that is scoped by:

- explicit state owners
- explicit service or engine boundaries
- explicit recovery and continuity behavior

Avoid vague scopes such as:

- “planner work”
- “player work”
- “general cleanup”

Prefer precise scopes such as:

- profile selection continuity
- activity composition flow
- track library reconnection
- playback bounds handling

---

## Maintenance Conventions

- Keep headers current in comment-capable files.
- When a file’s responsibility changes materially, update its header in the same change.
- Keep this file concise, operational, and high-signal.
- Add new repository-wide rules here only when they are broadly reusable across slices.