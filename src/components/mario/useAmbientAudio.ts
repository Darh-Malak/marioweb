import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hook de audio compartido para la experiencia "Para Mario".
 *
 * - Crea UN único AudioContext tras gesto del usuario (`unlock`).
 * - Sintetiza un pad ambiental procedural (drone etéreo en C dórico) con
 *   GainNode dedicado, evitando depender de un MP3 ambiental externo.
 * - Reproduce voces secuenciales vía <audio> + MediaElementSource + Analyser.
 * - Realiza ducking automático del ambiente (1.0 → 0.18) durante voces.
 * - Devuelve el AnalyserNode activo para visualizaciones (Escena Encuentro).
 */

export type AmbientAudio = {
  unlocked: boolean;
  unlock: () => Promise<void>;
  playVoice: (src: string, fallbackSec: number) => Promise<void>;
  stopVoice: () => void;
  getAnalyser: () => AnalyserNode | null;
  suspend: () => void;
  resume: () => Promise<void>;
};

const DRONE_NOTES_HZ = [98.0, 146.83, 220.0, 293.66]; // G2, D3, A3, D4
const AMBIENT_LEVEL = 0.42;
const DUCKED_LEVEL = 0.08;

export function useAmbientAudio(): AmbientAudio {
  const ctxRef = useRef<AudioContext | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const droneNodesRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);
  const lfoRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const currentVoiceRef = useRef<HTMLAudioElement | null>(null);
  const currentSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  const unlock = useCallback(async () => {
    if (ctxRef.current) {
      if (ctxRef.current.state === "suspended") await ctxRef.current.resume();
      return;
    }
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AC();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = AMBIENT_LEVEL;
    master.connect(ctx.destination);
    ambientGainRef.current = master;

    // Drone pad: 4 osciladores sumados con LFO global para respiración.
    const now = ctx.currentTime;
    droneNodesRef.current = DRONE_NOTES_HZ.map((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? "sine" : i === 1 ? "triangle" : "sine";
      osc.frequency.value = freq;
      // detune leve para riqueza armónica
      osc.detune.value = (i - 1.5) * 6;
      const g = ctx.createGain();
      g.gain.value = 0;
      osc.connect(g).connect(master);
      osc.start(now);
      // fade-in suave individual
      g.gain.linearRampToValueAtTime(0.18 / DRONE_NOTES_HZ.length + i * 0.02, now + 3 + i * 0.4);
      return { osc, gain: g };
    });

    // LFO para amplitud sutil (respiración del pad)
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07; // ciclo de ~14s
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.08;
    lfo.connect(lfoGain).connect(master.gain);
    lfo.start(now);
    lfoRef.current = { osc: lfo, gain: lfoGain };

    if (ctx.state === "suspended") await ctx.resume();
    setUnlocked(true);
  }, []);

  const playVoice = useCallback(
    async (src: string, fallbackSec: number) => {
      const ctx = ctxRef.current;
      const ambient = ambientGainRef.current;
      if (!ctx || !ambient) return;

      // Ducking
      const now = ctx.currentTime;
      ambient.gain.cancelScheduledValues(now);
      ambient.gain.linearRampToValueAtTime(DUCKED_LEVEL, now + 0.4);

      const restoreAmbient = () => {
        const t = ctx.currentTime;
        ambient.gain.cancelScheduledValues(t);
        ambient.gain.linearRampToValueAtTime(AMBIENT_LEVEL, t + 0.6);
      };

      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.preload = "auto";
      audio.src = src;
      currentVoiceRef.current = audio;

      let source: MediaElementAudioSourceNode | null = null;
      let analyser: AnalyserNode | null = null;
      try {
        source = ctx.createMediaElementSource(audio);
        analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.78;
        source.connect(analyser);
        analyser.connect(ctx.destination);
        currentSourceRef.current = source;
        analyserRef.current = analyser;
      } catch {
        // Algunos navegadores fallan si el src es 404 antes de conectar.
        analyserRef.current = null;
      }

      await new Promise<void>((resolve) => {
        let resolved = false;
        const done = () => {
          if (resolved) return;
          resolved = true;
          analyserRef.current = null;
          currentVoiceRef.current = null;
          currentSourceRef.current = null;
          try {
            source?.disconnect();
            analyser?.disconnect();
          } catch {
            /* noop */
          }
          restoreAmbient();
          resolve();
        };

        const fallbackTimer = window.setTimeout(done, fallbackSec * 1000 + 800);

        audio.addEventListener("ended", () => {
          window.clearTimeout(fallbackTimer);
          done();
        });
        audio.addEventListener("error", () => {
          window.clearTimeout(fallbackTimer);
          window.setTimeout(done, 600);
        });

        audio.play().catch(() => {
          // si autoplay falla, dejamos correr el fallback
        });
      });
    },
    [],
  );

  const stopVoice = useCallback(() => {
    const audio = currentVoiceRef.current;
    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        /* noop */
      }
    }
    const ctx = ctxRef.current;
    const ambient = ambientGainRef.current;
    if (ctx && ambient) {
      const t = ctx.currentTime;
      ambient.gain.cancelScheduledValues(t);
      ambient.gain.linearRampToValueAtTime(AMBIENT_LEVEL, t + 0.4);
    }
  }, []);

  const getAnalyser = useCallback(() => analyserRef.current, []);

  const suspend = useCallback(() => {
    ctxRef.current?.suspend().catch(() => {});
  }, []);

  const resume = useCallback(async () => {
    if (ctxRef.current?.state === "suspended") {
      await ctxRef.current.resume();
    }
  }, []);

  useEffect(() => {
    return () => {
      try {
        currentVoiceRef.current?.pause();
      } catch {
        /* noop */
      }
      droneNodesRef.current.forEach(({ osc }) => {
        try {
          osc.stop();
        } catch {
          /* noop */
        }
      });
      try {
        lfoRef.current?.osc.stop();
      } catch {
        /* noop */
      }
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);

  return { unlocked, unlock, playVoice, stopVoice, getAnalyser, suspend, resume };
}
