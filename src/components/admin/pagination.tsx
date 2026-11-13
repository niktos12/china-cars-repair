"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Пагинация админки (клиентская): списки товаров и заявок режутся
 * на страницы по N записей, компонент рисует «Назад / номера / Вперёд».
 *
 * Оформление — переменными темы админки (.adm-page-btn в globals.css),
 * активная страница — золотая, как табы AdminBar. При pageCount <= 1
 * компонент не рендерится вообще.
 */

/** Номера страниц с многоточиями: 1 … 4 5 6 … 12 */
function pageWindow(page: number, count: number): (number | "…")[] {
  if (count <= 7) {
    return Array.from({ length: count }, (_, i) => i + 1);
  }
  const wanted = new Set<number>(
    [1, count, page - 1, page, page + 1].filter((p) => p >= 1 && p <= count),
  );
  const sorted = [...wanted].sort((a, b) => a - b);

  const out: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

export function AdminPagination({
  page,
  pageCount,
  onPageChange,
  className,
}: {
  /** текущая страница (с 1) */
  page: number;
  /** всего страниц */
  pageCount: number;
  /** выбрать страницу */
  onPageChange: (page: number) => void;
  className?: string;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav
      className={`flex flex-wrap items-center justify-between gap-3 ${className ?? ""}`}
      aria-label="Постраничная навигация"
    >
      <p className="adm-muted text-sm">
        Страница {page} из {pageCount}
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className="adm-page-btn gap-1.5"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Предыдущая страница"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Назад</span>
        </button>

        {pageWindow(page, pageCount).map((p, i) =>
          p === "…" ? (
            <span key={`dots-${i}`} className="adm-faint px-1.5 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              aria-label={`Страница ${p}`}
              className={
                p === page
                  ? "adm-page-btn bg-gold font-semibold text-coal"
                  : "adm-page-btn"
              }
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          className="adm-page-btn gap-1.5"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          aria-label="Следующая страница"
        >
          <span className="hidden sm:inline">Вперёд</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
