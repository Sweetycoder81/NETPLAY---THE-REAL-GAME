import { useCallback, useRef } from "react";

type BeepOptions = {
  frequency?: number;
  durationMs?: number;
  volume?: number;
};

export const useNavBeep = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const beep = useCallback((opts?: BeepOptions) => {
    const frequency = opts?.frequency ?? 880;
    const durationMs = opts?.durationMs ?? 40;
    const volume = opts?.volume ?? 0.06;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        void ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.005);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + durationMs / 1000);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + durationMs / 1000);

      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
      };
    } catch {
      // noop
    }
  }, []);

  return { beep };
};
