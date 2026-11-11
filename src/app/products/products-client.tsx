"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { FadeIn } from "@/components/site/fade-in";
import { ProductCard } from "@/components/site/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/lib/fetcher";
import { CAR_MODELS, type ProductsResponse } from "@/lib/types";

type Filter = "all" | (typeof CAR_MODELS)[number];

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Все модели" },
  ...CAR_MODELS.map((m) => ({ value: m as Filter, label: m })),
];

/**
 * Каталог: SWR запрашивает GET /api/products у отдельного бэкенда
 * (адрес — NEXT_PUBLIC_API_URL), бэкенд достаёт данные из Postgres
 * или отдаёт демо-набор, если запущен без БД.
 *
 * initialModel приходит из ?model=... (карточки моделей на главной).
 */
export function ProductsClient({ initialModel = "all" }: { initialModel?: string }) {
  const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(
    "/api/products",
    fetcher,
    { revalidateOnFocus: false },
  );
  const initial = (FILTERS.some((f) => f.value === initialModel)
    ? initialModel
    : "all") as Filter;
  const [filter, setFilter] = useState<Filter>(initial);

  const products = data?.products ?? [];
  const visible = useMemo(
    () =>
      filter === "all"
        ? products
        : products.filter((p) => p.carModel === filter),
    [products, filter],
  );

  if (isLoading) {
    return (
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border border-white/10">
            <Skeleton className="aspect-[4/3] w-full rounded-none bg-white/5" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-4 w-1/3 rounded-none bg-white/5" />
              <Skeleton className="h-5 w-3/4 rounded-none bg-white/5" />
              <Skeleton className="h-4 w-1/2 rounded-none bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 flex flex-col items-center gap-4 border border-red-500/30 bg-red-500/10 p-10 text-center">
        <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
        <p className="text-sm text-red-200">
          Не удалось загрузить каталог: {(error as Error).message}
        </p>
        <button type="button" onClick={() => mutate()} className="btn-outline-gold">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Повторить
        </button>
      </div>
    );
  }

  return (
    <>
      {data?.demo && (
        <div className="mt-8 flex items-start gap-3 border border-gold/40 bg-gold/10 p-4 text-sm text-gold">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            <span className="font-semibold">Демо-режим бэкенда.</span> База
            данных не подключена, показаны демо-позиции. После подключения
            PostgreSQL (DATABASE_URL) каталог будет загружаться из БД.
          </p>
        </div>
      )}

      {/* Фильтр по модели авто */}
      <div
        className="mt-10 flex flex-wrap gap-3"
        role="tablist"
        aria-label="Фильтр по модели"
      >
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f.value)}
              className={`border px-5 py-2.5 text-sm transition-colors ${
                active
                  ? "border-gold bg-gold font-semibold text-coal"
                  : "border-white/20 text-zinc-300 hover:border-gold hover:text-gold"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 border border-white/10 bg-panel p-10 text-center text-sm text-zinc-400">
          Пока нет позиций по выбранной модели. Оставьте заявку — изготовим
          индивидуально.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <FadeIn key={p.slug} delay={Math.min(i * 0.06, 0.3)}>
              <ProductCard product={p} />
            </FadeIn>
          ))}
        </div>
      )}
    </>
  );
}
