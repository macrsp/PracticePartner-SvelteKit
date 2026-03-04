<!--
  @role migration-context
  @owns source-to-target migration status, completed slices, parity gaps, and next slice guidance
  @not-owns product requirements or repository-wide implementation rules
  @notes Keep this operational and current.
-->

# Migration Context

## Source repo
Legacy browser app repository

## Target repo
This SvelteKit repository

## Completed slices
- Repo bootstrap
- GitHub Pages deployment setup
- Repo-context generation workflow
- Minimal route skeleton

## Not yet migrated
- Profiles
- IndexedDB layer
- Track loading
- Audio engine
- Waveform UI
- Sections
- Activities
- Plans

## Next recommended slice
- Shell + profile selection

## Disposable scaffold

The following are temporary bootstrap artifacts and may be removed or reshaped freely if a migration slice no longer needs them:
- placeholder route content
- temporary workspace scaffolding
- example starter files
