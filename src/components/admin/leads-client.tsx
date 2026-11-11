"use client";

import Link from "next/link";
import useSWR from "swr";
import { AlertTriangle, Loader2, ShieldAlert } from "lucide-react";

import { DeleteLeadButton } from "@/components/admin/delete-buttons";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminFetcher, AuthError } from "@/lib/api";
import type { AdminLeadsResponse } from "@/lib/types";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** Заявки в админке: GET /api/admin/leads, свежие сверху */
export function LeadsClient() {
  const { data, error, isLoading } = useSWR<AdminLeadsResponse>(
    "/api/admin/leads",
    adminFetcher,
    { revalidateOnFocus: false },
  );

  if (error) {
    return (
      <div className="mt-10 flex flex-col items-center gap-4 border border-red-500/30 bg-red-500/10 p-10 text-center">
        <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
        <p className="text-sm text-red-200">
          Не удалось загрузить заявки: {(error as Error).message}
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
        <span className="text-sm">Загружаем заявки...</span>
      </div>
    );
  }

  const { leads, demo } = data;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Заявки</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Обращения с форм на страницах «Контакты», «Индивидуальное изготовление»
        и из карточек товаров. Новые — сверху.
      </p>

      {demo && (
        <div className="mt-4 flex items-start gap-3 border border-gold/40 bg-gold/10 p-4 text-sm text-gold">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            Демо-режим: бэкенд без БД — заявки демонстрационные. Подключите
            PostgreSQL, чтобы видеть реальные обращения.
          </p>
        </div>
      )}

      {leads.length === 0 ? (
        <p className="mt-8 rounded-lg border bg-zinc-100 p-8 text-center text-sm text-zinc-500">
          Заявок пока нет. Отправьте тестовую заявку со страницы «Контакты» —
          она появится здесь.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Имя</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Авто</TableHead>
                <TableHead>Комментарий</TableHead>
                <TableHead>Источник</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="whitespace-nowrap text-zinc-500">
                    {formatDate(l.createdAt)}
                  </TableCell>
                  <TableCell className="font-medium">{l.name}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <a href={`tel:${l.phone.replace(/[^+\d]/g, "")}`} className="hover:text-gold">
                      {l.phone}
                    </a>
                  </TableCell>
                  <TableCell>{l.carModel ?? "—"}</TableCell>
                  <TableCell className="max-w-72">
                    <p className="truncate" title={l.message ?? undefined}>
                      {l.message ?? "—"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{l.source}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <DeleteLeadButton id={l.id} />
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
