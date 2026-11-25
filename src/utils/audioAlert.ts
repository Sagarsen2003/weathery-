let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    console.warn('AudioContext not available:', e);
    return null;
  }
}

/**
 * Plays a recognizable, gentle dual-frequency emergency alert chime
 * (Inspired by standard meteorological alert tone, scaled to a safe, comfortable volume)
 */
export function playSevereAlertChime(volume: number = 0.15): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    gainNode.connect(ctx.destination);

    // Oscillator 1 (Primary alert frequency ~850 Hz)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(853, now);
    osc1.frequency.exponentialRampToValueAtTime(1050, now + 0.35);
    osc1.connect(gainNode);

    // Oscillator 2 (Harmonic support frequency ~1050 Hz)
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1050, now);
    osc2.frequency.exponentialRampToValueAtTime(853, now + 0.35);
    osc2.connect(gainNode);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.8);
    osc2.stop(now + 0.8);
  } catch (e) {
    console.warn('Could not play alert chime:', e);
  }
}

/**
 * Subtle confirmation beep for actions
 */
export function playCheckmarkBeep(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    gain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.connect(gain);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch {
    // Ignore audio errors
  }
}
