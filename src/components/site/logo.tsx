import Link from "next/link";

/** Эмблема — золотое «стальное солнце»: круг + лучи-спицы. */
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  const spokes = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 360) / 12;
    return (
      <line
        key={i}
        x1="24"
        y1="12.5"
        x2="24"
        y2="19.5"
        stroke="#d4af37"
        strokeWidth="3.4"
        strokeLinecap="round"
        transform={`rotate(${angle} 24 24)`}
      />
    );
  });

  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Логотип Гранфорт"
    >
      <circle
        cx="24"
        cy="24"
        r="21.5"
        fill="none"
        stroke="#d4af37"
        strokeWidth="3.4"
      />
      <circle cx="24" cy="24" r="6.2" fill="#d4af37" />
      {spokes}
    </svg>
  );
}

/** Полный логотип: эмблема + начертание и слоган. */
export function Logo({
  className,
  withTagline = true,
}: {
  className?: string;
  withTagline?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`group flex items-center gap-3 ${className ?? ""}`}
      aria-label="Гранфорт — на главную"
    >
      <LogoMark className="h-10 w-10 shrink-0 transition-transform duration-300 group-hover:rotate-45" />
      <span className="flex flex-col leading-none">
        <span className="text-lg font-bold tracking-wide text-foreground">
          Гранф<span className="text-gold">орт</span>
        </span>
        {withTagline && (
          <span className="mt-1 text-[10px] tracking-wide text-zinc-400">
            Защита, созданная для пути
          </span>
        )}
      </span>
    </Link>
  );
}
