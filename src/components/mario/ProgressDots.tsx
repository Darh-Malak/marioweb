type Props = {
  total: number;
  current: number;
  onSkip?: () => void;
  showSkip?: boolean;
};

export function ProgressDots({ total, current, onSkip, showSkip }: Props) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        {Array.from({ length: total }, (_, i) => {
          const active = i === current;
          const past = i < current;
          return (
            <span
              key={i}
              aria-hidden
              className="block rounded-full transition-all duration-500"
              style={{
                width: active ? 22 : 6,
                height: 6,
                backgroundColor: active
                  ? "var(--color-mario-gold)"
                  : past
                    ? "rgba(226,184,117,0.45)"
                    : "rgba(248,250,252,0.18)",
                boxShadow: active ? "0 0 12px rgba(226,184,117,0.55)" : "none",
              }}
            />
          );
        })}
      </div>
      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="pointer-events-auto rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-mario-muted)] backdrop-blur-md transition-all duration-500 hover:border-[color:var(--color-mario-gold)]/40 hover:text-[color:var(--color-mario-pearl)]"
          style={{
            opacity: showSkip ? 1 : 0,
            transform: showSkip ? "translateY(0)" : "translateY(8px)",
            pointerEvents: showSkip ? "auto" : "none",
          }}
        >
          Saltar escena
        </button>
      )}
    </div>
  );
}
