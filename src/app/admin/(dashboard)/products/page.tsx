import Link from "next/link";
import { ExternalLink, Pencil, Plus, ShieldAlert } from "lucide-react";

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
import { getAllProducts } from "@/server/queries";

function formatPrice(priceFrom: number | null): string {
  if (priceFrom == null) return "по запросу";
  return `от ${new Intl.NumberFormat("ru-RU").format(priceFrom)} ₽`;
}

export default async function AdminProductsPage() {
  const { products, demo } = await getAllProducts();

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
          <p>Демо-режим: изменения хранятся в памяти и сбросятся при перезапуске сервера.</p>
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
