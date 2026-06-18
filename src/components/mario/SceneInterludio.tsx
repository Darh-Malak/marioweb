import { useEffect, useMemo, useState } from "react";
import type { AmbientAudio } from "./useAmbientAudio";

type Props = {
  audio: AmbientAudio;
  onContinue: () => void;
};

const SPOTIFY_EMBED_SRC =
"https://open.spotify.com/embed/track/1aFPjtn7zUhWn2vsdkJ7pE?utm_source=generator&theme=0";

// Frutos del Espíritu (Gálatas 5:22-23) — 6 pares
const FRUTOS = ["Amor", "Gozo", "Paz", "Paciencia", "Bondad", "Fe"];

type Carta = {
  uid: number;
  valor: string;
  revelada: boolean;
  emparejada: boolean;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function nuevoMazo(): Carta[] {
  const pares = [...FRUTOS, ...FRUTOS];
  return shuffle(pares).map((valor, i) => ({
    uid: i,
    valor,
    revelada: false,
    emparejada: false,
  }));
}

export function SceneInterludio({ audio, onContinue }: Props) {
  const [fase, setFase] = useState<"intro" | "juego">("intro");
  const [introVisible, setIntroVisible] = useState(false);

  // Suspender ambient procedural mientras suena Spotify
  useEffect(() => {
    audio.suspend();
    return () => {
      audio.resume().catch(() => {});
    };
  }, [audio]);

  useEffect(() => {
    const t = window.setTimeout(() => setIntroVisible(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section
    className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-hidden px-6 py-10"
    style={{ backgroundColor: "var(--color-mario-void)" }}
    >
    <div
    aria-hidden
    className="pointer-events-none absolute inset-0"
    style={{
      background:
      "radial-gradient(ellipse at 50% 20%, rgba(226,184,117,0.10) 0%, rgba(5,7,12,0) 60%)",
    }}
    />

    {fase === "intro" ? (
      <IntroDisquete
      visible={introVisible}
      onComenzar={() => setFase("juego")}
      />
    ) : (
      <JuegoFrutos onContinue={onContinue} />
    )}
    </section>
  );
}

/* ------------------------- INTRO: Disquete giratorio ------------------------- */

function IntroDisquete({
  visible,
  onComenzar,
}: {
  visible: boolean;
  onComenzar: () => void;
}) {
  return (
    <div
    className="relative z-10 flex w-full max-w-2xl flex-1 flex-col items-center justify-center text-center"
    style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 900ms ease-out, transform 900ms ease-out",
    }}
    >
    <p
    className="text-[11px] uppercase tracking-[0.42em]"
    style={{
      color: "var(--color-mario-muted)",
          fontFamily: "var(--font-sans-mario)",
    }}
    >
    Una canción para ti
    </p>

    <h2
    className="mt-4 text-4xl font-light italic sm:text-5xl md:text-6xl"
    style={{
      fontFamily: "var(--font-display)",
          color: "var(--color-mario-auroral)",
          letterSpacing: "0.02em",
    }}
    >
    Mario, el discípulo amado
    </h2>

    <div className="relative mt-12 flex flex-col items-center gap-10">
    <div
    className="spin-pause-on-hover"
    style={{ animation: "mario-spin 8s linear infinite" }}
    >
    <Vinilo />
    </div>

    {/* El contenedor con la animación ahora envuelve directamente el diseño del iframe */}
    <div
    className="spin-pause-on-hover w-full max-w-md overflow-hidden rounded-2xl border"
    style={{
      animation: "mario-spin 24s linear infinite",
      borderColor: "rgba(226,184,117,0.25)",
          boxShadow: "0 10px 60px rgba(226,184,117,0.12)",
    }}
    >
    <iframe
    title="Mario, el discípulo amado"
    src={SPOTIFY_EMBED_SRC}
    width="100%"
    height={152}
    frameBorder={0}
    loading="lazy"
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    style={{ display: "block", borderRadius: 12 }}
    />
    </div>

    <p
    className="text-[11px] uppercase tracking-[0.28em]"
    style={{
      color: "var(--color-mario-muted)",
          fontFamily: "var(--font-sans-mario)",
    }}
    >
    Pasa el cursor sobre el disco para pausar el giro · Pulsa ▶ para escuchar
    </p>
    </div>


    <button
    type="button"
    onClick={onComenzar}
    className="mt-10 inline-flex items-center justify-center rounded-full border px-9 py-3 text-[11px] font-medium uppercase tracking-[0.32em] transition-all duration-500"
    style={{
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
    Comenzar el juego
    </button>
    </div>
  );
}

function Vinilo() {
  return (
    <div
    className="relative"
    style={{
      width: 240,
      height: 240,
      filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.6))",
    }}
    >
    {/* Disco */}
    <div
    className="absolute inset-0 rounded-full"
    style={{
      background:
      "radial-gradient(circle at 50% 50%, #1a1a1a 0%, #050505 70%, #000 100%)",
          border: "1px solid rgba(226,184,117,0.25)",
    }}
    />
    {/* Surcos concéntricos */}
    {[0.92, 0.82, 0.72, 0.62, 0.52].map((s) => (
      <div
      key={s}
      className="absolute rounded-full"
      style={{
        inset: `${((1 - s) / 2) * 100}%`,
                                                border: "1px solid rgba(255,255,255,0.04)",
      }}
      />
    ))}
    {/* Etiqueta central */}
    <div
    className="absolute flex items-center justify-center rounded-full"
    style={{
      inset: "32%",
      background:
      "radial-gradient(circle at 30% 30%, #e2b875 0%, #b8894a 60%, #6b4d27 100%)",
          boxShadow:
          "inset 0 2px 6px rgba(255,255,255,0.25), inset 0 -2px 6px rgba(0,0,0,0.4)",
    }}
    />
    {/* Agujero central */}
    <div
    className="absolute rounded-full"
    style={{
      inset: "47.5%",
      backgroundColor: "#05070c",
      boxShadow: "inset 0 0 4px rgba(0,0,0,0.8)",
    }}
    />
    {/* Brillo */}
    <div
    aria-hidden
    className="pointer-events-none absolute inset-0 rounded-full"
    style={{
      background:
      "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.04) 100%)",
    }}
    />
    </div>
  );
}

/* --------------------------- JUEGO: Memoria de Frutos --------------------------- */

function JuegoFrutos({ onContinue }: { onContinue: () => void }) {
  const [mazo, setMazo] = useState<Carta[]>(() => nuevoMazo());
  const [seleccion, setSeleccion] = useState<number[]>([]);
  const [movimientos, setMovimientos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);

  const completado = useMemo(() => mazo.every((c) => c.emparejada), [mazo]);

  const onClickCarta = (uid: number) => {
    if (bloqueado) return;
    const carta = mazo.find((c) => c.uid === uid);
    if (!carta || carta.revelada || carta.emparejada) return;

    const nuevoMazoEstado = mazo.map((c) =>
    c.uid === uid ? { ...c, revelada: true } : c,
    );
    const nuevaSeleccion = [...seleccion, uid];
    setMazo(nuevoMazoEstado);
    setSeleccion(nuevaSeleccion);

    if (nuevaSeleccion.length === 2) {
      setMovimientos((m) => m + 1);
      const [aId, bId] = nuevaSeleccion;
      const a = nuevoMazoEstado.find((c) => c.uid === aId)!;
      const b = nuevoMazoEstado.find((c) => c.uid === bId)!;
      if (a.valor === b.valor) {
        // Match
        window.setTimeout(() => {
          setMazo((prev) =>
          prev.map((c) =>
          c.uid === aId || c.uid === bId
          ? { ...c, emparejada: true }
          : c,
          ),
          );
          setSeleccion([]);
        }, 420);
      } else {
        setBloqueado(true);
        window.setTimeout(() => {
          setMazo((prev) =>
          prev.map((c) =>
          c.uid === aId || c.uid === bId
          ? { ...c, revelada: false }
          : c,
          ),
          );
          setSeleccion([]);
          setBloqueado(false);
        }, 850);
      }
    }
  };

  const reiniciar = () => {
    setMazo(nuevoMazo());
    setSeleccion([]);
    setMovimientos(0);
    setBloqueado(false);
  };

  return (
    <div className="relative z-10 flex w-full max-w-3xl flex-1 flex-col items-center">
    {/* Reproductor sticky arriba */}
    <div
    className="w-full overflow-hidden rounded-2xl border"
    style={{
      borderColor: "rgba(226,184,117,0.22)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
    }}
    >
    <iframe
    title="Mario, el discípulo amado"
    src={SPOTIFY_EMBED_SRC}
    width="100%"
    height={80}
    frameBorder={0}
    loading="lazy"
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    style={{ display: "block", borderRadius: 12 }}
    />
    </div>

    <div className="mt-8 text-center">
    <p
    className="text-[11px] uppercase tracking-[0.34em]"
    style={{
      color: "var(--color-mario-muted)",
          fontFamily: "var(--font-sans-mario)",
    }}
    >
    Gálatas 5:22-23 · Memoria
    </p>
    <h3
    className="mt-2 text-3xl font-light italic sm:text-4xl"
    style={{
      fontFamily: "var(--font-display)",
          color: "var(--color-mario-pearl)",
    }}
    >
    Los frutos del Espíritu
    </h3>
    <p
    className="mt-3 max-w-xl text-sm leading-relaxed"
    style={{
      color: "var(--color-mario-muted)",
          fontFamily: "var(--font-sans-mario)",
    }}
    >
    Encuentra cada par. Cada fruto es una promesa que Dios siembra en quien
    le sigue.
    </p>
    </div>

    <div
    className="mt-8 grid w-full gap-3"
    style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
    >
    {mazo.map((c) => (
      <CartaMemoria
      key={c.uid}
      carta={c}
      onClick={() => onClickCarta(c.uid)}
      />
    ))}
    </div>

    <div
    className="mt-6 flex items-center gap-6 text-[11px] uppercase tracking-[0.28em]"
    style={{
      color: "var(--color-mario-muted)",
          fontFamily: "var(--font-sans-mario)",
    }}
    >
    <span>Movimientos: {movimientos}</span>
    <button
    type="button"
    onClick={reiniciar}
    className="rounded-full border border-white/10 px-4 py-1.5 transition hover:border-[color:var(--color-mario-gold)]/40 hover:text-[color:var(--color-mario-pearl)]"
    >
    Reiniciar
    </button>
    </div>

    <button
    type="button"
    onClick={onContinue}
    disabled={!completado}
    className="mt-8 inline-flex items-center justify-center rounded-full border px-9 py-3 text-[11px] font-medium uppercase tracking-[0.32em] transition-all duration-500"
    style={{
      borderColor: completado
      ? "rgba(226,184,117,0.5)"
      : "rgba(255,255,255,0.08)",
          color: completado
          ? "var(--color-mario-auroral)"
          : "var(--color-mario-muted)",
          backgroundColor: completado
          ? "rgba(226,184,117,0.10)"
          : "rgba(255,255,255,0.02)",
          boxShadow: completado ? "0 0 50px rgba(226,184,117,0.25)" : "none",
          cursor: completado ? "pointer" : "not-allowed",
          fontFamily: "var(--font-sans-mario)",
    }}
    >
    {completado ? "Continuar el viaje" : "Completa los pares"}
    </button>
    </div>
  );
}

function CartaMemoria({
  carta,
  onClick,
}: {
  carta: Carta;
  onClick: () => void;
}) {
  const flipped = carta.revelada || carta.emparejada;
  return (
    <button
    type="button"
    onClick={onClick}
    className="relative aspect-[3/4] w-full"
    style={{
      perspective: "1000px",
      background: "transparent",
      border: "none",
      padding: 0,
      cursor: carta.emparejada ? "default" : "pointer",
    }}
    aria-label={flipped ? carta.valor : "Carta oculta"}
    >
    <div
    className="absolute inset-0"
    style={{
      transformStyle: "preserve-3d",
      transition: "transform 600ms cubic-bezier(.22,1,.36,1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
    }}
    >
    {/* Reverso (oculto) */}
    <div
    className="absolute inset-0 flex items-center justify-center rounded-xl"
    style={{
      backfaceVisibility: "hidden",
      background:
      "linear-gradient(135deg, rgba(226,184,117,0.10) 0%, rgba(11,17,30,0.9) 100%)",
          border: "1px solid rgba(226,184,117,0.20)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
    }}
    >
    <span
    style={{
      fontFamily: "var(--font-display)",
          fontSize: 28,
          color: "rgba(226,184,117,0.55)",
          fontStyle: "italic",
    }}
    >
    ✶
    </span>
    </div>
    {/* Frente (valor) */}
    <div
    className="absolute inset-0 flex items-center justify-center rounded-xl px-2 text-center"
    style={{
      backfaceVisibility: "hidden",
      transform: "rotateY(180deg)",
          background: carta.emparejada
          ? "linear-gradient(135deg, rgba(226,184,117,0.22) 0%, rgba(252,236,203,0.10) 100%)"
          : "linear-gradient(135deg, rgba(248,250,252,0.08) 0%, rgba(11,17,30,0.9) 100%)",
          border: carta.emparejada
          ? "1px solid rgba(226,184,117,0.55)"
          : "1px solid rgba(248,250,252,0.18)",
          boxShadow: carta.emparejada
          ? "0 0 24px rgba(226,184,117,0.35)"
          : "0 6px 20px rgba(0,0,0,0.4)",
    }}
    >
    <span
    style={{
      fontFamily: "var(--font-display)",
          fontSize: 22,
          fontStyle: "italic",
          color: carta.emparejada
          ? "var(--color-mario-auroral)"
          : "var(--color-mario-pearl)",
    }}
    >
    {carta.valor}
    </span>
    </div>
    </div>
    </button>
  );
}
