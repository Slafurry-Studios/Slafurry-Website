let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    try {
      audioCtx = new AudioContext();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

/**
 * Play a short achievement-unlock chime via Web Audio API.
 * Two ascending tones (C5 → E5) with a soft envelope — feels rewarding
 * without being obnoxious. No external audio files needed.
 */
export function playUnlockSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume if suspended ( autoplay policy )
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const now = ctx.currentTime;

  // Two-tone ascending chime
  const tones = [523.25, 659.25]; // C5, E5
  const noteLength = 0.12;
  const gap = 0.06;

  tones.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    const startTime = now + i * (noteLength + gap);
    const endTime = startTime + noteLength;

    // Soft attack / release envelope
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.25, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, endTime);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(endTime);
  });
}
