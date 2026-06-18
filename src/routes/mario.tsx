import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PreIntro } from "@/components/mario/PreIntro";
import { ProgressDots } from "@/components/mario/ProgressDots";
import { SceneCartas } from "@/components/mario/SceneCartas";
import { SceneEncuentro } from "@/components/mario/SceneEncuentro";
import { SceneFinal } from "@/components/mario/SceneFinal";
import { SceneInterludio } from "@/components/mario/SceneInterludio";
import { SceneMapa } from "@/components/mario/SceneMapa";
import { SceneVersiculos } from "@/components/mario/SceneVersiculos";
import { useAmbientAudio } from "@/components/mario/useAmbientAudio";
import { useIdleSkip } from "@/components/mario/useIdleSkip";

export const Route = createFileRoute("/mario")({
  head: () => ({
    meta: [
      { title: "Para Mario — Hermandad sin fronteras" },
      {
        name: "description",
        content:
          "Una experiencia inmersiva creada para Mario: voces, versículos, cartas y un mapa que demuestra que en Cristo no hay distancia.",
      },
      { property: "og:title", content: "Para Mario — Hermandad sin fronteras" },
      {
        property: "og:description",
        content:
          "Voces de la familia, palabras que sostienen y un viaje visual desde el mundo entero hacia Guinea Ecuatorial.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: MarioRoute,
});

type SceneId =
  | "pre"
  | "encuentro"
  | "versiculos"
  | "cartas"
  | "interludio"
  | "mapa"
  | "final";

const SCENE_ORDER: SceneId[] = [
  "pre",
  "encuentro",
  "versiculos",
  "cartas",
  "interludio",
  "mapa",
  "final",
];

function MarioRoute() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="flex min-h-[100dvh] w-full items-center justify-center"
        style={{ backgroundColor: "#05070c" }}
      />
    );
  }
  return <MarioExperience />;
}

function MarioExperience() {
  const [scene, setScene] = useState<SceneId>("pre");
  const audio = useAmbientAudio();
  // Las escenas progresivas (sin contar pre-intro)
  const progressIndex = Math.max(0, SCENE_ORDER.indexOf(scene) - 1);
  const showProgress = scene !== "pre";
  const idleVisible = useIdleSkip(scene, 5000);

  const goTo = (s: SceneId) => setScene(s);

  const handleSkip = () => {
    const idx = SCENE_ORDER.indexOf(scene);
    const next = SCENE_ORDER[idx + 1];
    if (next) {
      audio.stopVoice();
      setScene(next);
    }
  };

  return (
    <main
      className="relative min-h-[100dvh] w-full text-[color:var(--color-mario-pearl)]"
      style={{
        backgroundColor: "var(--color-mario-void)",
        fontFamily: "var(--font-sans-mario)",
      }}
    >
      {scene === "pre" && (
        <PreIntro
          audio={audio}
          onEnter={() => goTo("encuentro")}
        />
      )}
      {scene === "encuentro" && (
        <SceneEncuentro audio={audio} onContinue={() => goTo("versiculos")} />
      )}
      {scene === "versiculos" && (
        <SceneVersiculos onContinue={() => goTo("cartas")} />
      )}
      {scene === "cartas" && (
        <SceneCartas onContinue={() => goTo("interludio")} />
      )}
      {scene === "interludio" && (
        <SceneInterludio audio={audio} onContinue={() => goTo("mapa")} />
      )}
      {scene === "mapa" && <SceneMapa onContinue={() => goTo("final")} />}
      {scene === "final" && <SceneFinal onRestart={() => goTo("pre")} />}

      {showProgress && scene !== "final" && (
        <ProgressDots
          total={6}
          current={progressIndex}
          onSkip={handleSkip}
          showSkip={idleVisible}
        />
      )}
    </main>
  );
}
