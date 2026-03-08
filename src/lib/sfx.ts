// Simple sound effects using Web Audio API - no backend needed
const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

function ensureContext() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  if (!audioCtx) return;
  ensureContext();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export const SFX = {
  /** Evidence found - bright ascending chime */
  evidenceFound() {
    playTone(800, 0.15, 'sine', 0.12);
    setTimeout(() => playTone(1200, 0.15, 'sine', 0.1), 100);
    setTimeout(() => playTone(1600, 0.3, 'sine', 0.08), 200);
  },

  /** Hover over hotspot - soft blip */
  hotspotHover() {
    playTone(600, 0.08, 'sine', 0.06);
  },

  /** Click on hotspot - confirm */
  hotspotClick() {
    playTone(900, 0.1, 'triangle', 0.1);
    setTimeout(() => playTone(1100, 0.15, 'triangle', 0.08), 80);
  },

  /** Correct answer */
  correct() {
    playTone(523, 0.12, 'sine', 0.1);
    setTimeout(() => playTone(659, 0.12, 'sine', 0.1), 100);
    setTimeout(() => playTone(784, 0.25, 'sine', 0.08), 200);
  },

  /** Wrong answer */
  wrong() {
    playTone(300, 0.2, 'sawtooth', 0.08);
    setTimeout(() => playTone(250, 0.3, 'sawtooth', 0.06), 150);
  },

  /** Page transition - subtle whoosh-like sweep */
  transition() {
    if (!audioCtx) return;
    ensureContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  },

  /** Scanner pulse - when magnifier is near a hotspot */
  scannerPulse() {
    playTone(440, 0.05, 'sine', 0.04);
  },

  /** Evidence match correct */
  matchCorrect() {
    playTone(700, 0.1, 'sine', 0.1);
    setTimeout(() => playTone(880, 0.2, 'sine', 0.08), 100);
  },

  /** Complete section */
  complete() {
    playTone(523, 0.15, 'sine', 0.1);
    setTimeout(() => playTone(659, 0.15, 'sine', 0.1), 120);
    setTimeout(() => playTone(784, 0.15, 'sine', 0.1), 240);
    setTimeout(() => playTone(1047, 0.4, 'sine', 0.08), 360);
  },
};
