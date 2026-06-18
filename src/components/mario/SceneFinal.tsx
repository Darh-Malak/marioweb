import { useEffect, useState } from "react";
import { MENSAJE_FINAL, VERSICULO_FINAL } from "./data";

type Props = {
  onRestart: () => void;
};

export function SceneFinal({ onRestart }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStep(1), 600),
      window.setTimeout(() => setStep(2), 2400),
      window.setTimeout(() => setStep(3), 4400),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <section
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-6 py-20 text-center"
      style={{ backgroundColor: "var(--color-mario-void)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(226,184,117,0.10) 0%, rgba(5,7,12,0) 60%)",
        }}
      />

      <div className="relative max-w-2xl">
        <p
          className="text-2xl italic leading-relaxed text-[color:var(--color-mario-pearl)] sm:text-3xl"
          style={{
            fontFamily: "var(--font-display)",
            opacity: step >= 1 ? 1 : 0,
            transform: step >= 1 ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 1000ms ease-out, transform 1000ms ease-out",
          }}
        >
          “{VERSICULO_FINAL.texto}”
        </p>
        <p
          className="mt-6 text-[11px] uppercase tracking-[0.4em] text-[color:var(--color-mario-gold)]"
          style={{
            fontFamily: "var(--font-sans-mario)",
            opacity: step >= 1 ? 1 : 0,
            transition: "opacity 1000ms ease-out 300ms",
          }}
        >
          {VERSICULO_FINAL.referencia}
        </p>

        <div
          className="mx-auto my-12 h-px w-24"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(226,184,117,0.6), transparent)",
            opacity: step >= 2 ? 1 : 0,
            transition: "opacity 900ms ease-out",
          }}
        />

        <p
          className="text-lg italic leading-relaxed text-[color:var(--color-mario-auroral)] sm:text-xl"
          style={{
            fontFamily: "var(--font-display)",
            opacity: step >= 2 ? 1 : 0,
            transform: step >= 2 ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 1100ms ease-out, transform 1100ms ease-out",
          }}
        >
          {MENSAJE_FINAL}
        </p>

        <p
          className="mt-10 text-[10px] uppercase tracking-[0.4em] text-[color:var(--color-mario-muted)]"
          style={{
            fontFamily: "var(--font-sans-mario)",
            opacity: step >= 3 ? 1 : 0,
            transition: "opacity 900ms ease-out",
          }}
        >
          Para Mario · Con amor, tu familia
        </p>

        <button
          type="button"
          onClick={onRestart}
          className="mt-12 rounded-full border px-9 py-3 text-[11px] uppercase tracking-[0.32em] transition-all duration-500 hover:bg-[color:var(--color-mario-gold)]/15"
          style={{
            borderColor: "rgba(226,184,117,0.45)",
            color: "var(--color-mario-auroral)",
            backgroundColor: "rgba(226,184,117,0.06)",
            fontFamily: "var(--font-sans-mario)",
            opacity: step >= 3 ? 1 : 0,
            transform: step >= 3 ? "translateY(0)" : "translateY(8px)",
            pointerEvents: step >= 3 ? "auto" : "none",
            transition:
              "opacity 900ms ease-out, transform 900ms ease-out, background-color 400ms ease-out",
          }}
        >
          Vivirlo otra vez
        </button>
      </div>
    </section>
  );
}
