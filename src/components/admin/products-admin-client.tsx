"use client";

import Link from "next/link";
import useSWR from "swr";
import { AlertTriangle, ExternalLink, Loader2, Pencil, Plus, ShieldAlert } from "lucide-react";

import { DeleteProductButton } from "@/components/admin/delete-buttons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminFetcher, AuthError } from "@/lib/api";
import type { AdminProductsResponse } from "@/lib/types";

function formatPrice(priceFrom: number | null): string {
  if (priceFrom == null) return "по запросу";
  return `от ${new Intl.NumberFormat("ru-RU").format(priceFrom)} ₽`;
}

/** Список товаров в админке: GET /api/admin/products (включая скрытые) */
export function ProductsAdminClient() {
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
          Не удалось загрузить товары: {(error as Error).message}
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
      <div className="flex min-h-[40vh] items-center justify-center gap-3 text-zinc-400">
        <Loader2 className="h-5 w-5 animate-spin text-gold" aria-hidden="true" />
        <span className="text-sm">Загружаем товары...</span>
      </div>
    );
  }

  const { products, demo } = data;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Товары</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Каталог сайта: создание, редактирование, публикация.
          </p>
        </div>
        <Button asChild className="bg-gold font-semibold text-coal hover:bg-gold-light">
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Добавить товар
          </Link>
        </Button>
      </div>

      {demo && (
        <div className="mt-4 flex items-start gap-3 border border-gold/40 bg-gold/10 p-4 text-sm text-gold">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            Демо-режим: бэкенд без БД — создание и правка товаров недоступны
            (эндпоинты записи вернут 503). Подключите PostgreSQL, чтобы
            редактировать каталог.
          </p>
        </div>
      )}

      {products.length === 0 ? (
        <p className="mt-8 rounded-lg border bg-zinc-100 p-8 text-center text-sm text-zinc-500">
          Товаров пока нет. Добавьте первый товар.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">ID</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Модель</TableHead>
                <TableHead>Позиция</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-zinc-400">{p.id}</TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="font-medium hover:text-gold"
                    >
                      {p.title}
                    </Link>
                    <p className="text-xs text-zinc-400">/{p.slug}</p>
                  </TableCell>
                  <TableCell>{p.carModel}</TableCell>
                  <TableCell className="text-zinc-500">{p.position}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatPrice(p.priceFrom)}</TableCell>
                  <TableCell>
                    {p.isActive ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        активен
                      </Badge>
                    ) : (
                      <Badge variant="secondary">скрыт</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {p.isActive && (
                        <Button asChild variant="ghost" size="sm">
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            aria-label="Открыть страницу товара"
                          >
                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        </Button>
                      )}
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/products/${p.id}`} aria-label="Редактировать">
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </Button>
                      <DeleteProductButton id={p.id} title={p.title} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
