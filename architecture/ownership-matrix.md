<!--
  @role architecture-artifact
  @owns the compact ownership map for major state areas
  @not-owns detailed service contracts or implementation mechanics
  @notes Keep this file small enough to include in all coding sessions.
-->

# Ownership Matrix

| State area | Authoritative owner | Writes through | Primary observers |
| --- | --- | --- | --- |
| active profile | profile-service | profile-service, continuity-service | app-shell, planner-screen, history-service |
| profiles collection | profile-service | profile-service | app-shell, planner-screen |
| folder connection state | library-service | library-service, continuity-service | planner-screen, player-session-service, error-recovery-coordinator |
| track inventory | library-service | library-service | planner-screen, activity-composer-service, player-session-service |
| active track | player-session-service | player-session-service, library-service | player-drawer-surface, planner-screen, history-service |
| playback transport state | audio-engine | audio-engine | player-drawer-surface, player-session-service, history-service |
| waveform viewport state | waveform-engine | waveform-engine | player-drawer-surface, player-session-service |
| A/B selection state | selection-engine | selection-engine | player-drawer-surface, section-service, activity-composer-service |
| focused section | player-session-service | player-session-service, section-service | player-drawer-surface, planner-screen |
| saved sections collection | section-service | section-service | planner-screen, player-drawer-surface, activity-service |
| practice history ledger | history-service | history-service | planner-screen, section-service, activity-service |
| mastery summaries | history-service | history-service | planner-screen, section-service |
| activities collection | activity-service | activity-service | planner-screen, activity-composer-service, plan-service |
| activity draft | activity-composer-service | activity-composer-service | planner-screen |
| practice plan | plan-service | plan-service | planner-screen, player-session-service |
| continuity snapshot | continuity-service | continuity-service | app-shell, profile-service, library-service, player-session-service |
| recovery state | error-recovery-coordinator | error-recovery-coordinator | app-shell, planner-screen, player-drawer-surface |
| overlay and drawer navigation state | navigation-service | navigation-service | app-shell, planner-screen, player-drawer-surface |
| install and update affordances | app-shell | app-shell | planner-screen, player-drawer-surface |