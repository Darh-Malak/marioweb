import { useState } from "react";
import { CARTAS } from "./data";

type Props = {
  onContinue: () => void;
};

export function SceneCartas({ onContinue }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-start overflow-hidden px-6 py-20"
      style={{ backgroundColor: "var(--color-mario-void)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(226,184,117,0.08) 0%, rgba(5,7,12,0) 55%)",
        }}
      />

      <header className="relative mb-12 text-center">
        <p
          className="text-[10px] uppercase tracking-[0.4em] text-[color:var(--color-mario-gold)]"
          style={{ fontFamily: "var(--font-sans-mario)" }}
        >
          Cartas de hermandad
        </p>
        <h2
          className="mt-4 text-3xl font-light italic text-[color:var(--color-mario-pearl)] sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Toca un sobre para leerlo
        </h2>
      </header>

      <div className="relative mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CARTAS.map((carta) => {
          const open = openId === carta.id;
          return (
            <button
              key={carta.id}
              type="button"
              onClick={() => setOpenId(open ? null : carta.id)}
              className="relative block aspect-[5/3] w-full text-left focus:outline-none"
              style={{ perspective: 1200 }}
              aria-label={`Carta de ${carta.firma}`}
            >
              <div
                className="relative h-full w-full transition-transform duration-700"
                style={{
                  transformStyle: "preserve-3d",
                  transform: open
                    ? "rotateY(180deg) scale(1.04)"
                    : "rotateY(0deg) scale(1)",
                  transitionTimingFunction: "cubic-bezier(.22,1,.36,1)",
                  willChange: "transform",
                }}
              >
                {/* Frente — sobre */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    backgroundColor: "rgba(11,17,30,0.85)",
                    borderColor: "rgba(226,184,117,0.22)",
                    boxShadow:
                      "0 12px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.04)",
                    backgroundImage:
                      "linear-gradient(135deg, rgba(226,184,117,0.06), rgba(11,17,30,0) 50%, rgba(226,184,117,0.08))",
                  }}
                >
                  {/* Solapa diagonal */}
                  <div
                    aria-hidden
                    className="absolute left-0 right-0 top-0 mx-auto h-1/2"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(226,184,117,0.06) 0%, rgba(226,184,117,0) 100%)",
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    }}
                  />
                  {/* Sello */}
                  <div
                    className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border"
                    style={{
                      borderColor: "rgba(226,184,117,0.55)",
                      backgroundColor: "rgba(226,184,117,0.12)",
                      boxShadow: "0 0 30px rgba(226,184,117,0.35)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    <span className="text-xl italic text-[color:var(--color-mario-auroral)]">
                      {carta.inicial}
                    </span>
                  </div>
                  <p
                    className="relative z-10 mt-4 text-[10px] uppercase tracking-[0.32em] text-[color:var(--color-mario-muted)]"
                    style={{ fontFamily: "var(--font-sans-mario)" }}
                  >
                    De {carta.firma}
                  </p>
                </div>

                {/* Reverso — carta */}
                <div
                  className="absolute inset-0 overflow-hidden rounded-2xl border"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    backgroundColor: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(226,184,117,0.3)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div className="h-full w-full overflow-y-auto px-5 py-5">
                    <p
                      className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--color-mario-gold)]"
                      style={{ fontFamily: "var(--font-sans-mario)" }}
                    >
                      {carta.titulo}
                    </p>
                    <p
                      className="mt-3 whitespace-pre-line text-[13px] italic leading-relaxed text-[color:var(--color-mario-pearl)] sm:text-sm"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {carta.cuerpo?.trim()
                        ? carta.cuerpo
                        : "Esta carta llegará pronto. Quien la escribe la está preparando para ti."}
                    </p>
                    <p
                      className="mt-4 text-right text-xs italic text-[color:var(--color-mario-auroral)]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      — {carta.firma}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="relative mt-14 rounded-full border px-9 py-3 text-[11px] uppercase tracking-[0.32em] transition-all duration-500"
        style={{
          borderColor: "rgba(226,184,117,0.45)",
          color: "var(--color-mario-auroral)",
          backgroundColor: "rgba(226,184,117,0.06)",
          fontFamily: "var(--font-sans-mario)",
        }}
      >
        Continuar
      </button>
    </section>
  );
}
