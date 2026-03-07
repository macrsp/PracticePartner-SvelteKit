<!--
  @role planning-context
  @owns accepted product behavior, planning decisions, and active deltas
  @not-owns repository-wide implementation rules or file-level ownership details
  @notes Keep this user-facing and implementation-agnostic.
-->

# Planning Context

This repository contains the SvelteKit codebase for Suzuki Practice Partner.

## Purpose

This file is the product planning source of truth for the repository.

Use it to capture:

- accepted user-visible behavior
- current product direction
- active planning decisions
- open questions that affect product behavior
- the current planning delta for the next implementation slice

Do not use this file for:

- code structure
- module boundaries
- file ownership
- implementation mechanics
- repository workflow rules

Those belong elsewhere.

## Current status

- The application is planner-first
- `/planner` is the primary route
- `/` redirects to `/planner`
- The app shell owns lightweight global chrome and profile selection
- Playback and time-based media interaction are expected to live in a reusable drawer or panel surface
- Profile continuity and local persistence are core product behavior
- The app is deployed as a static SvelteKit build to Cloudflare Pages

## Stable goals

- Cloudflare Pages hosting
- installable PWA experience
- touch-friendly mobile-first interaction
- local-first behavior
- profile-scoped continuity for user data
- planner-oriented organization of practice work
- reusable media player drawer or panel for execution behavior
- modular SvelteKit architecture
- future Tone.js integration path

## Current UX direction

- The planner is the main task surface
- The app shell provides lightweight navigation and profile controls
- Media playback, waveform interaction, A/B range work, and section execution belong in a reusable player surface rather than a separate full-screen route
- Track selection should support both direct playback use and activity creation/editing flows
- Recovery states must be explicit and actionable

## Accepted product behavior

### Profiles

- The user can select a practice profile
- The user can create a new practice profile
- Saved work is scoped to the active profile
- The app restores the active profile across refresh and reopen when possible
- If no profile exists, the app creates a default profile automatically

### Music library

- The user can choose a local music folder
- The app enumerates supported audio files from that folder
- The user can reconnect the folder after refresh or reopen
- The app surfaces permission loss and reconnect requirements clearly
- The app restores the last active track when possible
- Missing or unavailable tracks are surfaced clearly and recoverably

### Playback and waveform interaction

- The app can load the active track for playback
- The user can scrub through the track
- The user can view and interact with a waveform
- The user can define an A/B range
- The user can control playback speed
- The user can enable or disable loop behavior
- Playback bounds are explicit and respected
- Playback continuity is preserved across route changes when appropriate

### Sections

- The user can save a selected A/B range as a section
- Saved sections are associated with the active profile and track
- The user can focus a saved section
- The user can play a saved section
- The user can loop a saved section
- The user can delete a saved section
- The app tracks practice history for sections
- The app derives and shows mastery for sections

### Activities

- The user can create reusable activities
- An activity can target:
  - a whole track
  - a saved section
  - a custom reference
- The user can edit and delete activities
- Activity availability is surfaced clearly when referenced material is unavailable

### Practice plan

- The user can build a practice plan from reusable activities
- The user can add activities to the plan
- The user can remove activities from the plan
- The user can reorder plan items
- Plan items preserve references even when the target becomes unavailable
- The user can launch activities and plan items into the media player surface

### Continuity and recovery

- The app preserves continuity across refresh and reopen where possible
- The app supports offline-capable shell behavior as a PWA
- The app surfaces clear empty states
- The app surfaces clear unavailable states
- The app surfaces clear permission and reconnect states
- The app provides explicit recovery paths rather than silent resets

## Product boundaries

The product distinguishes these concepts and does not collapse them into one abstraction:

- profiles
- tracks
- sections
- activities
- practice plan items

The planner is the organizational surface.

The media player drawer or panel is the execution surface.

## Hosting assumptions

- The production host is Cloudflare Pages
- The deployed app is a static SvelteKit build
- Production routing assumes root-path deployment
- Product decisions should remain compatible with a browser-first PWA running without a server runtime

## Current planning focus

The current planning focus is to keep implementation aligned with the planner-first, player-drawer-centered product shape while preserving continuity, recovery, touch-first interaction quality, and Cloudflare Pages compatibility.

## Open questions

Add only current, unresolved product questions here. Remove resolved questions promptly so this file stays high-signal.