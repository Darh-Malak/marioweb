import { useEffect, useState } from "react";
import {
  BENDICION_AUDIO_SRC,
  BENDICION_FALLBACK_SEC,
  BENDICION_SACERDOTAL,
  HERMANOS_FRASES,
  PRE_INTRO_LINEAS,
} from "./data";
import type { AmbientAudio } from "./useAmbientAudio";

type Props = {
  audio: AmbientAudio;
  onEnter: () => void;
};

type Fase = "titulo" | "bendicion" | "hermanos" | "final";

export function PreIntro({ audio, onEnter }: Props) {
  const [fase, setFase] = useState<Fase>("titulo");
  const [visibleCount, setVisibleCount] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [entering, setEntering] = useState(false);

  // Fase TITULO — cascada de PRE_INTRO_LINEAS + botón "Entrar"
  useEffect(() => {
    if (fase !== "titulo") return;
    const timers: number[] = [];
    PRE_INTRO_LINEAS.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => setVisibleCount(i + 1), 700 + i * 900),
      );
    });
    timers.push(
      window.setTimeout(
        () => setShowButton(true),
        700 + PRE_INTRO_LINEAS.length * 900 + 400,
      ),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [fase]);

  // Fase BENDICION — cascada de 3 versos
  useEffect(() => {
    if (fase !== "bendicion") return;
    setVisibleCount(0);
    const timers: number[] = [];
    BENDICION_SACERDOTAL.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => setVisibleCount(i + 1), 600 + i * 4200),
      );
    });
    // tras la bendición → fase hermanos
    timers.push(
      window.setTimeout(
        () => setFase("hermanos"),
        600 + BENDICION_SACERDOTAL.length * 4200 + 1500,
      ),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [fase]);

  // Fase HERMANOS — cascada de nombres + frase
  useEffect(() => {
    if (fase !== "hermanos") return;
    setVisibleCount(0);
    const timers: number[] = [];
    HERMANOS_FRASES.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => setVisibleCount(i + 1), 400 + i * 1700),
      );
    });
    timers.push(
      window.setTimeout(
        () => setFase("final"),
        400 + HERMANOS_FRASES.length * 1700 + 1400,
      ),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [fase]);

  // Fase FINAL — botón "Continuar"
  useEffect(() => {
    if (fase !== "final") return;
    setShowButton(true);
  }, [fase]);

  const handleEntrar = async () => {
    if (entering) return;
    setEntering(true);
    setShowButton(false);
    try {
      await audio.unlock();
      // Lanza el audio de la bendición en paralelo (no esperamos a que termine
      // para que la cascada visual avance al ritmo del propio audio).
      void audio.playVoice(BENDICION_AUDIO_SRC, BENDICION_FALLBACK_SEC);
    } catch {
      /* noop */
    }
    // pequeña transición visual entre fases
    window.setTimeout(() => {
      setEntering(false);
      setFase("bendicion");
    }, 600);
  };

  const handleContinuar = () => {
    audio.stopVoice();
    onEnter();
  };

  return (
    <section
      className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden px-6"
      style={{ backgroundColor: "var(--color-mario-void)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(226,184,117,0.06) 0%, rgba(5,7,12,0) 60%)",
        }}
      />

      {/* FASE TITULO */}
      {fase === "titulo" && (
        <div
          className="relative flex flex-col items-center text-center transition-opacity duration-700"
          style={{ opacity: entering ? 0 : 1, fontFamily: "var(--font-display)" }}
        >
          {PRE_INTRO_LINEAS.map((linea, i) => (
            <h1
              key={linea}
              className="text-4xl font-light italic tracking-wide text-[color:var(--color-mario-pearl)] sm:text-5xl md:text-6xl"
              style={{
                opacity: visibleCount > i ? 1 : 0,
                transform:
                  visibleCount > i ? "translateY(0)" : "translateY(14px)",
                transition: "opacity 900ms ease-out, transform 900ms ease-out",
                marginTop: i === 0 ? 0 : "0.6rem",
                letterSpacing: i === 1 ? "0.04em" : "0.02em",
                color:
                  i === 1
                    ? "var(--color-mario-auroral)"
                    : "var(--color-mario-pearl)",
              }}
            >
              {linea}
            </h1>
          ))}

          <button
            type="button"
            onClick={handleEntrar}
            className="mt-14 inline-flex items-center justify-center rounded-full border px-10 py-3.5 text-[11px] font-medium uppercase tracking-[0.32em] transition-all duration-500"
            style={{
              opacity: showButton ? 1 : 0,
              transform: showButton ? "translateY(0)" : "translateY(10px)",
              pointerEvents: showButton ? "auto" : "none",
              borderColor: "rgba(226,184,117,0.45)",
              color: "var(--color-mario-auroral)",
              backgroundColor: "rgba(226,184,117,0.06)",
              boxShadow: "0 0 40px rgba(226,184,117,0.12)",
              fontFamily: "var(--font-sans-mario)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(226,184,117,0.14)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(226,184,117,0.06)";
            }}
          >
            Entrar
          </button>

          <p
            className="mt-6 text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-mario-muted)]"
            style={{
              opacity: showButton ? 0.7 : 0,
              transition: "opacity 700ms ease-out",
              fontFamily: "var(--font-sans-mario)",
            }}
          >
            Activa el sonido · usa audífonos
          </p>
        </div>
      )}

      {/* FASE BENDICION */}
      {fase === "bendicion" && (
        <div className="relative flex w-full max-w-3xl flex-col items-center text-center">
          <p
            className="mb-10 text-[10px] uppercase tracking-[0.42em]"
            style={{
              color: "var(--color-mario-muted)",
              fontFamily: "var(--font-sans-mario)",
            }}
          >
            Bendición Sacerdotal · Números 6:24-26
          </p>
          {BENDICION_SACERDOTAL.map((verso, i) => (
            <p
              key={i}
              className="mb-8 text-2xl font-light italic leading-relaxed sm:text-3xl md:text-4xl"
              style={{
                fontFamily: "var(--font-display)",
                color:
                  i === 1
                    ? "var(--color-mario-auroral)"
                    : "var(--color-mario-pearl)",
                opacity: visibleCount > i ? 1 : 0,
                transform:
                  visibleCount > i ? "translateY(0)" : "translateY(18px)",
                transition:
                  "opacity 1400ms ease-out, transform 1400ms ease-out",
                textShadow: "0 0 32px rgba(226,184,117,0.18)",
              }}
            >
              {verso}
            </p>
          ))}
        </div>
      )}

      {/* FASE HERMANOS */}
      {fase === "hermanos" && (
        <div className="relative flex w-full max-w-2xl flex-col items-center text-center">
          <p
            className="mb-12 text-[10px] uppercase tracking-[0.42em]"
            style={{
              color: "var(--color-mario-muted)",
              fontFamily: "var(--font-sans-mario)",
            }}
          >
            Tus hermanos
          </p>
          <div className="flex w-full flex-col items-center gap-6">
            {HERMANOS_FRASES.map((h, i) => (
              <div
                key={h.nombre}
                className="flex flex-col items-center"
                style={{
                  opacity: visibleCount > i ? 1 : 0,
                  transform:
                    visibleCount > i ? "translateY(0)" : "translateY(12px)",
                  transition:
                    "opacity 800ms ease-out, transform 800ms ease-out",
                }}
              >
                <span
                  className="text-[11px] uppercase tracking-[0.38em]"
                  style={{
                    color: "var(--color-mario-muted)",
                    fontFamily: "var(--font-sans-mario)",
                  }}
                >
                  {h.nombre}
                </span>
                <span
                  className="mt-1 text-2xl font-light italic sm:text-3xl"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--color-mario-auroral)",
                  }}
                >
                  «{h.frase}»
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FASE FINAL */}
      {fase === "final" && (
        <div className="relative flex flex-col items-center text-center">
          <p
            className="text-3xl font-light italic sm:text-4xl md:text-5xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-mario-pearl)",
              opacity: 1,
              transition: "opacity 1200ms ease-out",
            }}
          >
            Ahora ven, hermano…
          </p>
          <button
            type="button"
            onClick={handleContinuar}
            className="mt-12 inline-flex items-center justify-center rounded-full border px-10 py-3.5 text-[11px] font-medium uppercase tracking-[0.32em] transition-all duration-500"
            style={{
              opacity: showButton ? 1 : 0,
              transform: showButton ? "translateY(0)" : "translateY(10px)",
              pointerEvents: showButton ? "auto" : "none",
              borderColor: "rgba(226,184,117,0.45)",
              color: "var(--color-mario-auroral)",
              backgroundColor: "rgba(226,184,117,0.06)",
              boxShadow: "0 0 40px rgba(226,184,117,0.12)",
              fontFamily: "var(--font-sans-mario)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(226,184,117,0.14)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(226,184,117,0.06)";
            }}
          >
            Continuar
          </button>
        </div>
      )}
    </section>
  );
}
