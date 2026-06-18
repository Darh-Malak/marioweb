import { useEffect, useState } from "react";
import { VERSICULOS } from "./data";

type Props = {
  onContinue: () => void;
};

export function SceneVersiculos({ onContinue }: Props) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const timers = VERSICULOS.map((_, i) =>
      window.setTimeout(() => setShown((s) => Math.max(s, i + 1)), 300 + i * 220),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <section
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-6 py-20"
      style={{ backgroundColor: "var(--color-mario-void)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(226,184,117,0.08) 0%, rgba(5,7,12,0) 55%), radial-gradient(ellipse at 50% 100%, rgba(11,17,30,0.6) 0%, rgba(5,7,12,0) 55%)",
        }}
      />

      <header className="relative mb-14 text-center">
        <p
          className="text-[10px] uppercase tracking-[0.4em] text-[color:var(--color-mario-gold)]"
          style={{ fontFamily: "var(--font-sans-mario)" }}
        >
          Fortaleza espiritual
        </p>
        <h2
          className="mt-4 text-3xl font-light italic text-[color:var(--color-mario-pearl)] sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Palabras que te sostienen
        </h2>
      </header>

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {VERSICULOS.map((v, i) => {
          const visible = shown > i;
          return (
            <article
              key={v.referencia}
              className="rounded-2xl border p-7 transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transitionDelay: `${i * 80}ms`,
                backgroundColor: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px 0 rgba(0,0,0,0.37)",
              }}
            >
              <p
                className="text-base italic leading-relaxed text-[color:var(--color-mario-pearl)] sm:text-lg"
                style={{ fontFamily: "var(--font-display)" }}
              >
                “{v.texto}”
              </p>
              <p
                className="mt-5 text-[10px] uppercase tracking-[0.32em] text-[color:var(--color-mario-gold)]"
                style={{ fontFamily: "var(--font-sans-mario)" }}
              >
                {v.referencia}
              </p>
            </article>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="relative mt-16 rounded-full border px-9 py-3 text-[11px] uppercase tracking-[0.32em] transition-all duration-500 hover:bg-[color:var(--color-mario-gold)]/15"
        style={{
          borderColor: "rgba(226,184,117,0.45)",
          color: "var(--color-mario-auroral)",
          backgroundColor: "rgba(226,184,117,0.06)",
          fontFamily: "var(--font-sans-mario)",
          opacity: shown >= VERSICULOS.length ? 1 : 0.3,
          pointerEvents: shown >= VERSICULOS.length ? "auto" : "none",
        }}
      >
        Continuar
      </button>
    </section>
  );
}
