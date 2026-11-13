"use client";

import Link from "next/link";
import useSWR from "swr";
import { AlertTriangle, ArrowLeft } from "lucide-react";

import { ProductForm } from "@/components/admin/product-form";
import { AdminFormSkeleton } from "@/components/admin/skeletons";
import { adminFetcher, AuthError } from "@/lib/api";
import type { AdminProductsResponse } from "@/lib/types";

/**
 * Редактирование товара. Бэкенд отдаёт товары списком (GET /api/admin/products),
 * поэтому страницу товара находим поиском по id в этом списке.
 */
export function ProductEditClient({ id }: { id: number }) {
  const { data, error, isLoading } = useSWR<AdminProductsResponse>(
    "/api/admin/products",
    adminFetcher,
    { revalidateOnFocus: false },
  );

  if (error) {
    return (
      <div className="mt-10 flex flex-col items-center gap-4 border border-red-500/30 bg-red-500/10 p-10 text-center">
        <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
        <p className="text-sm text-red-200">
          Не удалось загрузить товар: {(error as Error).message}
        </p>
        {error instanceof AuthError && (
          <Link href="/admin/login" className="btn-outline-gold">
            Войти заново
          </Link>
        )}
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="max-w-3xl">
        <p className="adm-muted text-sm" role="status" aria-live="polite">
          Загружаем товар…
        </p>
        <AdminFormSkeleton className="mt-6" />
      </div>
    );
  }

  const product = data.products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-3xl">
        <Link
          href="/admin/products"
          className="adm-faint mb-4 inline-flex items-center gap-1 text-sm transition-colors hover:text-gold"
        >
          К списку товаров
        </Link>
        <p className="adm-panel adm-muted p-8 text-center text-sm">
          Товар с ID #{id} не найден — возможно, он был удалён.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/products"
        className="adm-faint mb-4 inline-flex items-center gap-1 text-sm transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        К списку товаров
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Редактирование товара</h1>
        {product.isActive && (
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="text-sm text-gold hover:underline"
          >
            Открыть страницу на сайте →
          </Link>
        )}
      </div>
      <p className="adm-faint mt-1 text-sm">
        ID #{product.id}
        {/* Демо-режим бэкенда может не отдавать дату создания */}
        {product.createdAt &&
          !Number.isNaN(new Date(product.createdAt).getTime()) && (
            <>
              {" · создан "}
              {new Intl.DateTimeFormat("ru-RU", { dateStyle: "long" }).format(
                new Date(product.createdAt),
              )}
            </>
          )}
      </p>

      <div className="adm-panel mt-6 p-6 md:p-8">
        <ProductForm
          productId={product.id}
          defaultValues={{
            slug: product.slug,
            title: product.title,
            carModel: product.carModel,
            position: product.position,
            material: product.material,
            description: product.description,
            priceFrom: product.priceFrom == null ? "" : String(product.priceFrom),
            imageUrl: product.imageUrl ?? "",
            isActive: product.isActive,
          }}
        />
      </div>
    </div>
  );
}
