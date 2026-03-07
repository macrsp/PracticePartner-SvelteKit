<!--
  @role architecture-artifact
  @owns the compact ownership map for major state areas
  @not-owns detailed service contracts or implementation mechanics
  @notes Keep this file small enough to include in all coding sessions.
-->

# Ownership Matrix

| State area | Authoritative owner | Writes through | Primary observers |
| --- | --- | --- | --- |
| active profile | Session context store | Profile service | App shell, planner screen, player session service |
| profiles collection | Durable app store | Profile service | App shell, planner screen |
| folder connection state | Session context store | Library service | App shell, planner screen, music player drawer |
| track inventory | Durable app store plus cache metadata | Library service | Track picker, activity composer, player session service |
| active track | Session context store | Library service, launch-to-player use case | Music player drawer, activity composer |
| playback state | Audio engine | Audio engine commands only | Music player drawer, history service |
| waveform viewport | Waveform engine | Waveform engine commands only | Music player drawer |
| A/B selection | Selection engine | Selection engine commands only | Music player drawer, section service |
| focused section | Session context store | Section service, player session service | Music player drawer, planner launch flows |
| sections collection | Durable app store | Section service | Music player drawer, activity service |
| activities collection | Durable app store | Activity service | Planner screen, activity composer, plan service |
| activity draft | Activity draft store | Activity composer service | Activity composer sheet |
| practice plan | Durable app store | Plan service | Planner screen, launch-to-player use case |
| continuity settings | Durable app store | Continuity service, profile service, library service, section service | Bootstrap coordinator |
| recovery state | Error recovery coordinator | Error recovery coordinator | App shell, planner screen, music player drawer |
| overlay stack | Ephemeral UI registry | Navigation service | App shell |
| update/install state | Session coordination services | Update lifecycle coordinator, install experience coordinator | App shell |
