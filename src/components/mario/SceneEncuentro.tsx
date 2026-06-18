import { useEffect, useRef, useState } from "react";
import { FOTO_VIDEOLLAMADA, VOCES } from "./data";
import type { AmbientAudio } from "./useAmbientAudio";

type Props = {
  audio: AmbientAudio;
  onContinue: () => void;
};

const RING_SEGMENTS = 64;
const RING_RADIUS = 150;
const RING_CENTER = 170;

export function SceneEncuentro({ audio, onContinue }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [finished, setFinished] = useState(false);
  const [playing, setPlaying] = useState(false);
  const ringRef = useRef<SVGSVGElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);
  const segmentsRef = useRef<SVGLineElement[]>([]);

  // Reproducir cola secuencial de voces
  useEffect(() => {
    cancelledRef.current = false;
    let cancelled = false;
    (async () => {
      for (let i = 0; i < VOCES.length; i++) {
        if (cancelled) return;
        setCurrentIdx(i);
        setPlaying(true);
        await audio.playVoice(VOCES[i].src, VOCES[i].fallbackSec);
        setPlaying(false);
        if (cancelled) return;
        // pausa entre voces
        await new Promise((r) => setTimeout(r, 600));
      }
      if (!cancelled) setFinished(true);
    })();
    return () => {
      cancelled = true;
      cancelledRef.current = true;
      audio.stopVoice();
    };
  }, [audio]);

  // Loop del visualizador (rAF)
  useEffect(() => {
    const data = new Uint8Array(RING_SEGMENTS);
    let phase = 0;
    const tick = () => {
      const analyser = audio.getAnalyser();
      const segments = segmentsRef.current;
      if (segments.length) {
        if (analyser) {
          const buf = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(buf);
          for (let i = 0; i < RING_SEGMENTS; i++) {
            const srcIdx = Math.floor(
              (i / RING_SEGMENTS) * analyser.frequencyBinCount * 0.6,
            );
            data[i] = buf[srcIdx] ?? 0;
          }
        } else {
          // fallback idle: pulso suave sinusoidal
          phase += 0.04;
          for (let i = 0; i < RING_SEGMENTS; i++) {
            const v = playing
              ? 60 + Math.sin(phase + i * 0.3) * 30
              : 20 + Math.sin(phase + i * 0.2) * 12;
            data[i] = v;
          }
        }
        for (let i = 0; i < RING_SEGMENTS; i++) {
          const seg = segments[i];
          if (!seg) continue;
          const amp = data[i] / 255;
          const len = 6 + amp * 26;
          seg.setAttribute("stroke-width", String(1 + amp * 2.2));
          seg.setAttribute("opacity", String(0.25 + amp * 0.75));
          const angle = (i / RING_SEGMENTS) * Math.PI * 2 - Math.PI / 2;
          const x1 = RING_CENTER + Math.cos(angle) * RING_RADIUS;
          const y1 = RING_CENTER + Math.sin(angle) * RING_RADIUS;
          const x2 = RING_CENTER + Math.cos(angle) * (RING_RADIUS + len);
          const y2 = RING_CENTER + Math.sin(angle) * (RING_RADIUS + len);
          seg.setAttribute("x1", x1.toFixed(2));
          seg.setAttribute("y1", y1.toFixed(2));
          seg.setAttribute("x2", x2.toFixed(2));
          seg.setAttribute("y2", y2.toFixed(2));
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [audio, playing]);

  const currentVoz = VOCES[currentIdx];

  return (
    <section
      className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden px-6 py-16"
      style={{ backgroundColor: "var(--color-mario-void)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(226,184,117,0.12) 0%, rgba(5,7,12,0) 55%)",
        }}
      />

      <div className="relative flex flex-col items-center text-center">
        <div
          className="relative"
          style={{ width: 340, height: 340 }}
        >
          <svg
            ref={ringRef}
            width={340}
            height={340}
            viewBox="0 0 340 340"
            className="absolute inset-0"
          >
            {Array.from({ length: RING_SEGMENTS }, (_, i) => (
              <line
                key={i}
                ref={(el) => {
                  if (el) segmentsRef.current[i] = el;
                }}
                stroke="var(--color-mario-gold)"
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 6px rgba(226,184,117,0.5))" }}
              />
            ))}
          </svg>
          <div
            className="absolute overflow-hidden rounded-full"
            style={{
              top: 30,
              left: 30,
              width: 280,
              height: 280,
              boxShadow:
                "0 0 60px rgba(226,184,117,0.25), inset 0 0 0 2px rgba(226,184,117,0.4)",
            }}
          >
            <img
              src={FOTO_VIDEOLLAMADA}
              alt="Mario en una videollamada con la familia"
              width={280}
              height={280}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center" style={{ minHeight: 96 }}>
          <p
            key={currentVoz.id}
            className="text-xs uppercase tracking-[0.4em] text-[color:var(--color-mario-gold)]"
            style={{
              fontFamily: "var(--font-sans-mario)",
              animation: "mario-fade-in 700ms ease-out",
            }}
          >
            {currentVoz.nombre}
          </p>
          <p
            key={currentVoz.id + "-sub"}
            className="mt-3 max-w-md text-lg italic text-[color:var(--color-mario-pearl)] sm:text-xl"
            style={{
              fontFamily: "var(--font-display)",
              animation: "mario-fade-up 900ms ease-out",
            }}
          >
            “{currentVoz.subtitulo}”
          </p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="mt-10 rounded-full border px-9 py-3 text-[11px] uppercase tracking-[0.32em] transition-all duration-500"
          style={{
            opacity: finished ? 1 : 0,
            transform: finished ? "translateY(0)" : "translateY(8px)",
            pointerEvents: finished ? "auto" : "none",
            borderColor: "rgba(226,184,117,0.45)",
            color: "var(--color-mario-auroral)",
            backgroundColor: "rgba(226,184,117,0.06)",
            fontFamily: "var(--font-sans-mario)",
          }}
        >
          Continuar
        </button>
      </div>
    </section>
  );
}
