<!--
  @role repository-instructions
  @owns repository-wide implementation rules, AI response-shape rules, and maintenance conventions
  @not-owns product requirements or per-file responsibilities
  @notes Keep this concise and stable.
-->

# Repository Instructions

## Purpose

This is the SvelteKit migration target for Suzuki Practice Partner.

## Rules

- Favor small, composable modules.
- Keep browser APIs isolated behind platform adapters.
- Keep route files thin.
- Prefer complete file outputs over diff hunks in implementation sessions.
- Preserve GitHub Pages compatibility.
- Preserve future Tone.js integration flexibility.