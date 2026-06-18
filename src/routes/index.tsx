import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Para Mario — Hermandad sin fronteras" },
      {
        name: "description",
        content:
          "Una experiencia inmersiva creada para Mario: voces, versículos, cartas y un mapa que demuestra que en Cristo no hay distancia.",
      },
    ],
  }),
  component: () => <Navigate to="/mario" replace />,
});
