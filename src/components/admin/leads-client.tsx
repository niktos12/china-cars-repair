"use client";

import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { AlertTriangle } from "lucide-react";

import { DeleteLeadButton } from "@/components/admin/delete-buttons";
import { AdminListSkeleton } from "@/components/admin/skeletons";
import { AdminPagination } from "@/components/admin/pagination";
import { adminFetcher, AuthError } from "@/lib/api";
import type { AdminLeadsResponse } from "@/lib/types";

const DAY_MS = 86_400_000;
/** Заявка считается «новой» первые двое суток */
const NEW_LEAD_MS = 2 * DAY_MS;
/** Заявок на одной странице списка */
const PAGE_SIZE = 10;

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/* Человекочитаемые метки источников заявок (site → ?source=…) */
const SOURCE_LABELS: Record<string, string> = {
  home: "Главная",
  contacts: "Контакты",
  custom: "На заказ",
};

function sourceLabel(source: string): string {
  if (SOURCE_LABELS[source]) return SOURCE_LABELS[source];
  if (source.startsWith("product:")) return `Товар · ${source.slice(8)}`;
  return source;
}

/**
 * Заявки: строгая колоночная сетка, как в референсе.
 *
 * Десктоп (lg+): аватар | имя + «телефон · авто» | дата | бейдж «НОВАЯ» |
 * тег источника | корзина — колонки выровнены сеткой .adm-lead-row
 * (фиксированные ширины, см. globals.css).
 * Мобильные: два ряда — «кто» и мета с датой/статусом/источником.
 */
export function LeadsClient() {
  const { data, error, isLoading } = useSWR<AdminLeadsResponse>(
    "/api/admin/leads",
    adminFetcher,
    { revalidateOnFocus: false },
  );
  const [page, setPage] = useState(1);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Заявки</h1>
      <p className="adm-muted mt-2 max-w-3xl text-sm">
        Обращения с форм на страницах «Контакты», «Индивидуальное
        изготовление» и из карточек товаров. Новые — сверху.
      </p>

      {error ? (
        <div className="mt-10 flex flex-col items-center gap-4 border border-red-500/30 bg-red-500/10 p-10 text-center">
          <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
          <p className="text-sm text-red-200">
            {error instanceof AuthError
              ? "Сессия истекла. Войдите заново."
              : "Не удалось загрузить заявки. Сервис временно недоступен."}
          </p>
          {error instanceof AuthError && (
            <Link href="/admin/login" className="btn-outline-gold">
              Войти заново
            </Link>
          )}
        </div>
      ) : isLoading || !data ? (
        <AdminListSkeleton rows={6} media="circle" className="mt-8 sm:mt-10" />
      ) : (
        <LeadsList leads={data.leads} page={page} onPageChange={setPage} />
      )}
    </div>
  );
}

function LeadsList({
  leads,
  page,
  onPageChange,
}: {
  leads: AdminLeadsResponse["leads"];
  page: number;
  onPageChange: (page: number) => void;
}) {
  const pageCount = Math.max(1, Math.ceil(leads.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const slice = leads.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const now = Date.now();

  return (
    <>
      {leads.length === 0 ? (
        <p className="adm-panel adm-muted mt-10 p-8 text-center text-sm">
          Заявок пока нет. Отправьте тестовую заявку со страницы «Контакты» —
          она появится здесь.
        </p>
      ) : (
        <div className="adm-panel adm-rows mt-8 sm:mt-10">
          <ul>
            {slice.map((l) => {
              const isNew = now - new Date(l.createdAt).getTime() <= NEW_LEAD_MS;

              return (
                <li key={l.id} className="adm-lead-row px-5 py-4 sm:px-7 sm:py-5">
                  {/* Аватар */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-coal text-sm font-bold uppercase text-paper [grid-area:avatar]">
                    {l.name.charAt(0)}
                  </div>

                  {/* Кто: имя, телефон · авто, комментарий */}
                  <div className="min-w-0 [grid-area:main]">
                    <p className="truncate font-semibold">{l.name}</p>
                    <p className="mt-0.5 truncate text-sm">
                      <a
                        href={`tel:${l.phone.replace(/[^+\d]/g, "")}`}
                        className="text-(--adm-muted) underline-offset-2 transition-colors hover:text-gold hover:underline"
                      >
                        {l.phone}
                      </a>
                      {l.carModel && (
                        <span className="adm-faint"> · {l.carModel}</span>
                      )}
                    </p>
                    {l.message && (
                      <p className="adm-faint mt-1 line-clamp-2 text-sm">
                        {l.message}
                      </p>
                    )}
                  </div>

                  {/* Мета: на мобильных — переносимая строка (дата, статус,
                      источник, удаление); на lg+ display:contents убирает
                      обёртку, и элементы становятся ячейками сетки
                      .adm-lead-row — строго по своим колонкам */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 [grid-area:meta] lg:contents">
                    {/* Дата — отдельная выровненная колонка на lg+ */}
                    <p className="adm-muted whitespace-nowrap text-sm [grid-area:date] lg:text-right">
                      {formatDate(l.createdAt)}
                    </p>

                    {/* Бейдж «НОВАЯ» — своя колонка, пустые строки держат место */}
                    <div className="flex lg:justify-center [grid-area:badge]">
                      {isNew && (
                        <span className="inline-flex whitespace-nowrap bg-gold px-2 py-1 text-[11px] font-semibold uppercase leading-none text-coal">
                          новая
                        </span>
                      )}
                    </div>

                    {/* Источник — тег */}
                    <div className="flex lg:justify-end [grid-area:source]">
                      <span
                        className="adm-tag inline-flex max-w-52 truncate whitespace-nowrap px-2 py-1 text-[11px] font-medium leading-none"
                        title={l.source}
                      >
                        {sourceLabel(l.source)}
                      </span>
                    </div>

                    {/* Удаление */}
                    <div className="ml-auto flex items-center gap-2 [grid-area:actions] lg:ml-0 lg:justify-end">
                      <DeleteLeadButton id={l.id} />
                    </div>
                  </div>
                </li>
              );
            })}
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
