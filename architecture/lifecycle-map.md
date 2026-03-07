<!--
  @role architecture-artifact
  @owns the high-level runtime lifecycle map
  @not-owns detailed service contracts or UI copy
  @notes Keep transitions concise and implementation-agnostic.
-->

# Lifecycle Map

| Stage | Primary owner | Trigger | Main work | Stable outcome |
| --- | --- | --- | --- | --- |
| shell bootstrap | app-shell | app load or full refresh | mount shared shell, profile controls, planner host, drawer host, and recovery host | application chrome is mounted once and remains mounted until page unload |
| continuity restore | continuity-service | shell bootstrap completed | read durable profile-scoped continuity, normalize stored references, and hand restored state to owning services | last known profile, library reference, player session, and recovery context are restored where valid |
| profile resolution | profile-service | continuity restore completed or no stored profile exists | resolve active profile, create default profile when none exists, and publish profile-scoped namespaces | active profile is always defined before planner interactions proceed |
| library reconnection check | library-service | active profile resolved | validate stored folder reference, enumerate tracks if available, and classify missing or permission-lost states | planner and drawer receive either usable track inventory or an explicit reconnect state |
| planner ready | planner-screen | profile and library state classified | compose planner route from profile, activity, plan, section, and recovery state | planner becomes the primary organizational surface |
| launch into player session | player-session-service | user launches a track, section, activity, or plan item | resolve launch target, set active track and bounds, open drawer intent, and seed engine state | a single authoritative player session exists for the current execution target |
| interactive playback loop | audio-engine, waveform-engine, selection-engine | player session becomes active | process transport commands, waveform viewport changes, scrub gestures, and A/B selection updates | playback interaction remains low-latency and independent from route composition |
| section and history capture | section-service, history-service | user saves sections or playback completes a trackable practice pass | persist section changes, record practice events, and refresh mastery summaries | saved sections and progress summaries remain profile-scoped and durable |
| continuity checkpoint | continuity-service | meaningful session state changes | persist active profile, last active track, focused section, drawer continuity, and recoverable references | refresh and reopen continuity stays current without a server dependency |
| recovery handling | error-recovery-coordinator | any service reports unavailable, invalid, or permission-lost state | classify failure, select recovery actions, and publish recoverable user-visible state | the user sees an explicit recovery path instead of silent resets |
| update or install prompt | app-shell | service worker or browser installability state changes | surface update-ready or install-available affordances without interrupting active work | update and install prompts stay shell-level and do not own domain state |