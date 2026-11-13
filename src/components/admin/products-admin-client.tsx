"use client";

import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { AlertTriangle, Car, ExternalLink, Plus } from "lucide-react";

import { ProductRowMenu } from "@/components/admin/product-row-menu";
import { AdminListSkeleton } from "@/components/admin/skeletons";
import { AdminPagination } from "@/components/admin/pagination";
import { adminFetcher, AuthError } from "@/lib/api";
import type { AdminProductsResponse } from "@/lib/types";

/** Товаров на одной странице списка */
const PAGE_SIZE = 10;

function formatPrice(priceFrom: number | null): string {
  if (priceFrom == null) return "по запросу";
  return `от ${new Intl.NumberFormat("ru-RU").format(priceFrom)} ₽`;
}

/**
 * Список товаров: панель со строками, по PAGE_SIZE на страницу.
 * Действия над товаром собраны в dropdown-меню «…» (редактировать /
 * удалить), внешняя ссылка — отдельной кнопкой.
 */
export function ProductsAdminClient() {
  const { data, error, isLoading } = useSWR<AdminProductsResponse>(
    "/api/admin/products",
    adminFetcher,
    { revalidateOnFocus: false },
  );
  const [page, setPage] = useState(1);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Товары
          </h1>
          <p className="adm-muted mt-2 text-sm">
            Каталог сайта: создание, редактирование, публикация.
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-solid-gold shrink-0 !py-2.5">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Добавить товар
        </Link>
      </div>

      {error ? (
        <div className="mt-10 flex flex-col items-center gap-4 border border-red-500/30 bg-red-500/10 p-10 text-center">
          <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
          <p className="text-sm text-red-200">
            {error instanceof AuthError
              ? "Сессия истекла. Войдите заново."
              : "Не удалось загрузить товары. Сервис временно недоступен."}
          </p>
          {error instanceof AuthError && (
            <Link href="/admin/login" className="btn-outline-gold">
              Войти заново
            </Link>
          )}
        </div>
      ) : isLoading || !data ? (
        <AdminListSkeleton rows={6} media="box" className="mt-8 sm:mt-10" />
      ) : (
        <ProductList products={data.products} page={page} onPageChange={setPage} />
      )}
    </div>
  );
}

function ProductList({
  products,
  page,
  onPageChange,
}: {
  products: AdminProductsResponse["products"];
  page: number;
  onPageChange: (page: number) => void;
}) {
  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const slice = products.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <>
      {products.length === 0 ? (
        <p className="adm-panel adm-muted mt-10 p-8 text-center text-sm">
          Товаров пока нет. Добавьте первый товар.
        </p>
      ) : (
        <div className="adm-panel adm-rows mt-8 sm:mt-10">
          <ul>
            {slice.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4 sm:px-7 sm:py-5"
              >
                <div className="adm-soft relative h-14 w-20 shrink-0 overflow-hidden">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Car
                      className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-(--adm-faint)"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <div className="min-w-[180px] flex-1 basis-56">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="font-semibold transition-colors hover:text-gold"
                  >
                    {p.title}
                  </Link>
                  <p className="adm-muted mt-0.5 truncate text-sm">/{p.slug}</p>
                </div>

                <div className="adm-muted hidden min-w-44 text-sm md:block">
                  <p className="font-medium">{p.carModel}</p>
                  <p className="mt-0.5">{p.position}</p>
                </div>

                <p className="whitespace-nowrap text-sm font-medium">
                  {formatPrice(p.priceFrom)}
                </p>

                <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
                  <span
                    className={`inline-flex whitespace-nowrap px-2 py-1 text-[11px] font-semibold leading-none ${
                      p.isActive ? "bg-green-100 text-green-900" : "adm-tag"
                    }`}
                  >
                    {p.isActive ? "опубликован" : "черновик"}
                  </span>

                  {p.isActive && (
                    <Link
                      href={`/products/${p.slug}`}
                      target="_blank"
                      aria-label="Открыть страницу товара"
                      className="adm-icon-btn h-9 w-9"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  )}
                  {/* Редактировать / удалить — в dropdown-меню */}
                  <ProductRowMenu id={p.id} title={p.title} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <AdminPagination
        page={current}
        pageCount={pageCount}
        onPageChange={onPageChange}
        className="mt-6"
      />
    </>
  );
}
