import { useEffect, useState } from "react";

/**
 * Revela el botón "Saltar escena" tras `delayMs` de inactividad
 * o desde el inicio de la escena. Se resetea cuando cambia `resetKey`.
 */
export function useIdleSkip(resetKey: string | number, delayMs = 5000) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = window.setTimeout(() => setVisible(true), delayMs);
    return () => window.clearTimeout(t);
  }, [resetKey, delayMs]);

  return visible;
}
