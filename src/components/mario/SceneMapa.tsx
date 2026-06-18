import { useEffect, useRef, useState } from "react";
import { CONTINENTS } from "./worldGeo";
import { DESTINO, ORIGENES, VERSICULO_MAPA } from "./data";

type Props = {
  onContinue: () => void;
};

type Particle = {
  originIdx: number;
  t: number;
  speed: number;
  delay: number;
  trail: { x: number; y: number; alpha: number }[];
  active: boolean;
};

type Flash = { x: number; y: number; start: number };

const MAX_PARTICLES = 60;
const TRAIL_LENGTH = 14;

export function SceneMapa({ onContinue }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setOverlayVisible(false), 3600);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let destXY = { x: 0, y: 0 };
    const originXYs: { x: number; y: number }[] = [];

    const project = (lng: number, lat: number) => ({
      x: ((lng + 180) / 360) * width,
      // recortamos lat -60..80 para enfocar la "banda habitada"
      y: ((80 - lat) / 140) * height,
    });

    const setupSize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      destXY = project(DESTINO.lng, DESTINO.lat);
      originXYs.length = 0;
      ORIGENES.forEach((o) => originXYs.push(project(o.lng, o.lat)));
    };

    setupSize();
    const resizeObs = new ResizeObserver(setupSize);
    resizeObs.observe(canvas);

    // Inicializar partículas (pool fijo)
    const particles: Particle[] = [];
    const particlesPerOrigin = Math.floor(MAX_PARTICLES / ORIGENES.length);
    let pIdx = 0;
    for (let oi = 0; oi < ORIGENES.length; oi++) {
      for (let k = 0; k < particlesPerOrigin; k++) {
        particles.push({
          originIdx: oi,
          t: 0,
          speed: 0.0028 + Math.random() * 0.0022,
          delay: 1200 + oi * 180 + k * 900 + Math.random() * 400,
          trail: [],
          active: false,
        });
        pIdx++;
        if (pIdx >= MAX_PARTICLES) break;
      }
      if (pIdx >= MAX_PARTICLES) break;
    }

    const flashes: Flash[] = [];
    const startTime = performance.now();

    const drawBase = () => {
      // fondo
      ctx.fillStyle = "#05070c";
      ctx.fillRect(0, 0, width, height);

      // halo destino
      const grdDest = ctx.createRadialGradient(
        destXY.x,
        destXY.y,
        0,
        destXY.x,
        destXY.y,
        180,
      );
      grdDest.addColorStop(0, "rgba(226,184,117,0.16)");
      grdDest.addColorStop(1, "rgba(226,184,117,0)");
      ctx.fillStyle = grdDest;
      ctx.fillRect(0, 0, width, height);

      // continentes
      ctx.fillStyle = "rgba(11,17,30,0.92)";
      ctx.strokeStyle = "rgba(226,184,117,0.10)";
      ctx.lineWidth = 1;
      for (const poly of CONTINENTS) {
        ctx.beginPath();
        for (let i = 0; i < poly.length; i++) {
          const p = project(poly[i][0], poly[i][1]);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // puntos de origen
      for (const o of originXYs) {
        ctx.beginPath();
        ctx.arc(o.x, o.y, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(252,236,203,0.85)";
        ctx.shadowColor = "rgba(226,184,117,0.7)";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // destino (más grande)
      ctx.beginPath();
      ctx.arc(destXY.x, destXY.y, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = "var(--color-mario-auroral)";
      ctx.fillStyle = "#fceccb";
      ctx.shadowColor = "rgba(226,184,117,0.9)";
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = "10px Inter, sans-serif";
      ctx.fillStyle = "rgba(248,250,252,0.65)";
      ctx.textAlign = "center";
      ctx.fillText("Guinea Ecuatorial", destXY.x, destXY.y + 18);
    };

    const tick = (now: number) => {
      const elapsed = now - startTime;
      drawBase();

      // partículas
      for (const p of particles) {
        if (!p.active) {
          if (elapsed >= p.delay) {
            p.active = true;
            p.t = 0;
            p.trail = [];
          } else {
            continue;
          }
        }

        const origin = originXYs[p.originIdx];
        if (!origin) continue;
        const dest = destXY;
        // control point para Bézier — desplazamiento perpendicular
        const mx = (origin.x + dest.x) / 2;
        const my = (origin.y + dest.y) / 2;
        const dx = dest.x - origin.x;
        const dy = dest.y - origin.y;
        const dist = Math.hypot(dx, dy);
        const nx = -dy / (dist || 1);
        const ny = dx / (dist || 1);
        const curvature = Math.min(120, dist * 0.25);
        const cpx = mx + nx * curvature;
        const cpy = my + ny * curvature;

        p.t += p.speed;
        if (p.t >= 1) {
          flashes.push({ x: dest.x, y: dest.y, start: now });
          // reset (siguiente onda)
          p.active = false;
          p.delay = elapsed + 1800 + Math.random() * 2200;
          p.trail = [];
          continue;
        }

        const t = p.t;
        const omt = 1 - t;
        const x = omt * omt * origin.x + 2 * omt * t * cpx + t * t * dest.x;
        const y = omt * omt * origin.y + 2 * omt * t * cpy + t * t * dest.y;

        p.trail.unshift({ x, y, alpha: 1 });
        if (p.trail.length > TRAIL_LENGTH) p.trail.pop();

        // dibujar trail
        for (let i = p.trail.length - 1; i >= 0; i--) {
          const seg = p.trail[i];
          const a = (1 - i / TRAIL_LENGTH) * 0.85;
          ctx.beginPath();
          ctx.arc(seg.x, seg.y, 1.4 + (1 - i / TRAIL_LENGTH) * 1.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(252,236,203,${a})`;
          if (i < 3) {
            ctx.shadowColor = "rgba(226,184,117,0.9)";
            ctx.shadowBlur = 14;
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // flashes
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        const age = (now - f.start) / 600;
        if (age >= 1) {
          flashes.splice(i, 1);
          continue;
        }
        const r = 8 + age * 90;
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
        grad.addColorStop(0, `rgba(252,236,203,${0.6 * (1 - age)})`);
        grad.addColorStop(1, "rgba(252,236,203,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(f.x - r, f.y - r, r * 2, r * 2);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObs.disconnect();
    };
  }, []);

  return (
    <section
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--color-mario-void)" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
        aria-label="Mapa de conexión entre países y Guinea Ecuatorial"
      />

      {/* Overlay inicial con el versículo */}
      <div
        aria-hidden={!overlayVisible}
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-8 text-center transition-opacity duration-1000"
        style={{
          opacity: overlayVisible ? 1 : 0,
          backgroundColor: "rgba(5,7,12,0.72)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div className="max-w-2xl">
          <p
            className="text-xl italic leading-relaxed text-[color:var(--color-mario-pearl)] sm:text-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            “{VERSICULO_MAPA.texto}”
          </p>
          <p
            className="mt-5 text-[10px] uppercase tracking-[0.4em] text-[color:var(--color-mario-gold)]"
            style={{ fontFamily: "var(--font-sans-mario)" }}
          >
            {VERSICULO_MAPA.referencia}
          </p>
        </div>
      </div>

      {/* Botón Continuar */}
      <div className="relative z-10 mt-auto mb-24 flex flex-col items-center gap-4">
        <p
          className="text-[10px] uppercase tracking-[0.4em] text-[color:var(--color-mario-muted)]"
          style={{ fontFamily: "var(--font-sans-mario)" }}
        >
          La hermandad cruza fronteras
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="rounded-full border px-9 py-3 text-[11px] uppercase tracking-[0.32em] transition-all duration-500"
          style={{
            borderColor: "rgba(226,184,117,0.45)",
            color: "var(--color-mario-auroral)",
            backgroundColor: "rgba(226,184,117,0.06)",
            fontFamily: "var(--font-sans-mario)",
            opacity: overlayVisible ? 0 : 1,
            pointerEvents: overlayVisible ? "none" : "auto",
          }}
        >
          Continuar
        </button>
      </div>
    </section>
  );
}
