<!--
  @role architecture-artifact
  @owns the compact recovery-state map for major failure classes
  @not-owns detailed error-copy or implementation mechanics
  @notes Keep this file small and explicit.
-->

# Recovery Map

| Condition | Primary detector | Surfaced state | Primary user action | Continuity policy |
| --- | --- | --- | --- | --- |
| no folder selected | Library service | connect-required | choose folder | preserve profile and planner state |
| folder permission lost | Permission adapter via library service | permission-lost | reconnect folder | preserve stored reference until explicit replacement |
| stored folder handle is stale | File-system adapter via library service | handle-invalid | reconnect folder | keep last known track key but mark unavailable |
| active track missing from inventory | Library service | track-unavailable | choose a different track or reconnect | keep reference explicit rather than silently clearing |
| section target missing | Section service or launch resolver | section-unavailable | remove, relink, or ignore | keep saved references explicit |
| activity target unavailable | Activity service | activity-unavailable | edit activity or choose alternate launch | preserve activity and plan membership |
| audio decode failure | Media-decode adapter via audio engine | media-load-failed | retry or choose another track | preserve continuity reference but classify as unavailable |
| storage or schema failure | database adapter | fatal-storage | reload after fix or schema repair | do not continue with partial writes |
| offline shell asset issue | service worker adapter | offline-not-ready | retry when assets are available | durable data remains local |
| update ready while active playback is running | update lifecycle coordinator | update-deferred | apply update after playback stops | do not interrupt playback or drop continuity |