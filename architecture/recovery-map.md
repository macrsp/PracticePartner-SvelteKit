<!--
  @role architecture-artifact
  @owns the compact recovery-state map for major failure classes
  @not-owns detailed error-copy or implementation mechanics
  @notes Keep this file small and explicit.
-->

# Recovery Map

| Condition | Primary detector | Recovery coordinator | User surface | Primary user action | Persistence rule |
| --- | --- | --- | --- | --- | --- |
| no folder selected | library-service | error-recovery-coordinator | planner-screen | choose a local folder | preserve active profile, plan, and saved non-library data |
| folder permission lost | library-service | error-recovery-coordinator | planner-screen, player-drawer-surface | reconnect the existing folder or choose a replacement | preserve stored library reference until the user explicitly replaces it |
| stored folder handle is stale | library-service | error-recovery-coordinator | planner-screen | reconnect folder | keep last known track references explicit and mark them unavailable |
| active track missing from inventory | library-service | error-recovery-coordinator | player-drawer-surface, planner-screen | choose a different track or reconnect library | do not silently clear the broken track reference |
| section target missing | section-service | error-recovery-coordinator | planner-screen, player-drawer-surface | relink, delete, or ignore the section | preserve the section record until the user resolves it |
| activity target unavailable | activity-service | error-recovery-coordinator | planner-screen | edit the activity or remove the broken target | preserve activity identity and plan membership |
| plan item target unavailable | plan-service | error-recovery-coordinator | planner-screen | edit, skip, or remove the plan item | preserve plan order and item identity |
| audio decode or media load failure | audio-engine | error-recovery-coordinator | player-drawer-surface | retry or choose another track | keep the launch context but classify the track as unavailable |
| continuity reference cannot be restored | continuity-service | error-recovery-coordinator | app-shell, planner-screen | continue with cleared session state or reconnect missing references | clear only the invalid session fragment, not unrelated durable data |
| storage read or write failure | continuity-service | error-recovery-coordinator | app-shell | reload after recovery or storage repair | stop partial writes and keep the last known good durable snapshot |
| offline shell assets unavailable | app-shell | error-recovery-coordinator | app-shell | retry when cached assets are available | keep local durable data untouched |
| update ready during active playback | app-shell | error-recovery-coordinator | app-shell, player-drawer-surface | defer update until playback stops | never interrupt active practice playback automatically |