// src/audioAssets.ts
// Voicemail audio, keyed by content voicemail id. Only module that
// require()s audio files — content stays Node-testable. A cue with no
// entry falls back to transcript-only ("audio unavailable" stays honest).

export const VM_AUDIO: Record<string, number> = {
  'vm-mom-oct2': require('../assets/audio/vm-mom-oct2.m4a'),
  'vm-mom-oct11': require('../assets/audio/vm-mom-oct11.m4a'),
  'vm-dae-oct13': require('../assets/audio/vm-dae-oct13.m4a'),
  'vm-hr': require('../assets/audio/vm-hr.m4a'),
  'vm-mom-oct15': require('../assets/audio/vm-mom-oct15.m4a'),
  'vm-marcus': require('../assets/audio/vm-marcus.m4a'),
  'vm-eli': require('../assets/audio/vm-eli.m4a'),
};
