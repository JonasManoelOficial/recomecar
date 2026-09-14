type LogoProps = {
  /** Tamanho do símbolo em pixels. */
  size?: number;
  /** Mostra o nome "RECOMEÇAR" ao lado do símbolo. */
  withWordmark?: boolean;
  className?: string;
};

/**
 * Símbolo do RECOMEÇAR: um sol nascendo sobre o horizonte, desenhado com dois
 * traços que se encontram — a ideia de duas histórias que recomeçam juntas.
 */
export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Símbolo do Recomeçar"
      className={className}
    >
      <defs>
        <linearGradient id="rc-sun" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--sunrise-300)" />
          <stop offset="100%" stopColor="var(--sunrise-500)" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="23" fill="var(--brand-700)" />
      <circle cx="24" cy="27" r="9" fill="url(#rc-sun)" />
      <path
        d="M7 31c4.6 0 4.6-5 9.2-5s4.6 5 9.2 5 4.6-5 9.2-5 4.6 5 6.4 5"
        fill="none"
        stroke="var(--brand-200)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M24 10.5c2.4-3.2 7.6-1.9 7.6 2.2 0 3-3.9 5.6-7.6 8-3.7-2.4-7.6-5-7.6-8 0-4.1 5.2-5.4 7.6-2.2Z"
        fill="var(--brand-100)"
        opacity="0.95"
      />
    </svg>
  );
}

export function Logo({ size = 36, withWordmark = true, className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {withWordmark ? (
        <span className="font-display text-base font-semibold uppercase tracking-[0.12em] text-[var(--wordmark)] sm:text-lg sm:tracking-[0.18em]">
          Recomeçar
        </span>
      ) : null}
    </span>
  );
}
