"use client";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Скелетоны загрузки админки. Цвет берётся из bg-accent, который
 * переопределяется темой админки (.adm-theme) — тёмная и светлая темы
 * работают без дополнительных классов.
 *
 * Используются вместо спиннеров: пользователь сразу видит структуру
 * страницы, пока SWR догружает данные с бэкенда.
 */

/** Скелетон одной строки списка: медиа-блок + пара строк текста + чипы */
export function AdminRowSkeleton({
  media = "box",
}: {
  media?: "box" | "circle";
}) {
  return (
    <div className="flex items-center gap-x-4 px-5 py-4 sm:px-7 sm:py-5">
      {media === "circle" ? (
        <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
      ) : (
        <Skeleton className="h-14 w-20 shrink-0 rounded-none" />
      )}
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3 max-w-56" />
        <Skeleton className="h-3.5 w-1/2 max-w-72" />
      </div>
      <div className="hidden items-center gap-3 sm:flex" aria-hidden="true">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-28" />
      </div>
      <Skeleton className="h-6 w-6 sm:hidden" />
    </div>
  );
}

/** Скелетон панели со списком строк */
export function AdminListSkeleton({
  rows = 5,
  media = "box",
  className,
}: {
  rows?: number;
  media?: "box" | "circle";
  className?: string;
}) {
  return (
    <div className={`adm-panel adm-rows ${className ?? ""}`} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <AdminRowSkeleton key={i} media={media} />
      ))}
    </div>
  );
}

/** Скелетон стат-карточки обзора */
export function StatCardSkeleton() {
  return (
    <div
      className="adm-panel flex min-h-44 flex-col justify-between p-6 sm:p-7"
      aria-hidden="true"
    >
      <Skeleton className="h-4 w-32" />
      <div className="mt-5 flex items-end justify-between gap-4">
        <Skeleton className="h-12 w-24 sm:h-14" />
        <Skeleton className="h-12 w-12 sm:h-14 sm:w-14" />
      </div>
    </div>
  );
}

/** Скелетон страницы формы (редактирование/создание товара) */
export function AdminFormSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`adm-panel space-y-6 p-6 md:p-8 ${className ?? ""}`}
      aria-hidden="true"
    >
      <div className="grid gap-5 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-28 w-full" />
      </div>
      <Skeleton className="h-11 w-full max-w-56" />
    </div>
  );
}
