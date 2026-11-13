"use client";

import Link from "next/link";
import useSWR from "swr";
import { AlertTriangle, ArrowLeft, ArrowRight, Car } from "lucide-react";

import { useAdminUser } from "@/components/admin/admin-context";
import { AdminGearMenu, AdminThemeToggle } from "@/components/admin/admin-nav";
import { ProductRowMenu } from "@/components/admin/product-row-menu";
import {
  AdminListSkeleton,
  StatCardSkeleton,
} from "@/components/admin/skeletons";
import { adminFetcher, AuthError } from "@/lib/api";
import type { AdminLeadsResponse, AdminProductsResponse } from "@/lib/types";

const DAY_MS = 86_400_000;
/** Заявка считается «новой» первые двое суток */
const NEW_LEAD_MS = 2 * DAY_MS;
/** Сколько позиций показываем в списках обзора (дальше — «все …») */
const PREVIEW_LIMIT = 4;

/* ------------------------------------------------------------------ */
/* Форматирование времени: «Сегодня, 12:40», «Вчера, 18:05», «3 ноября» */
/* ------------------------------------------------------------------ */

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function dayLabel(d: Date, now: Date): string {
  const diffDays = Math.round((startOfDay(now) - startOfDay(d)) / DAY_MS);
  if (diffDays === 0) return "Сегодня";
  if (diffDays === 1) return "Вчера";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  }).format(d);
}

function formatRowTime(iso: string): string {
  const d = new Date(iso);
  const time = new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  return `${dayLabel(d, new Date())}, ${time}`;
}

/** «1 товар в черновиках», «2 товара…», «5 товаров…» */
function draftsHint(drafts: number): string {
  const form = new Intl.PluralRules("ru-RU").select(drafts);
  const word =
    form === "one" ? "товар" : form === "few" ? "товара" : "товаров";
  return `${drafts} ${word} в черновиках`;
}

/* ------------------------------------------------------------------ */
/* Пиктограммы карточек — как в макете (текущий цвет + золотой акцент)  */
/* ------------------------------------------------------------------ */

function BarsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <rect x="7" y="27" width="8" height="15" rx="1.5" fill="currentColor" />
      <rect x="20" y="19" width="8" height="23" rx="1.5" fill="currentColor" />
      <rect x="33" y="7" width="8" height="35" rx="1.5" fill="#d4af37" />
    </svg>
  );
}

function TrendIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 33l10-10 8 6 10-14"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 40h31"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M40 4c.9 6.2 3 8.3 9 9.2-6 .9-8.1 3-9 9.2-.9-6.2-3-8.3-9-9.2 6-.9 8.1-3 9-9.2Z"
        fill="#d4af37"
      />
    </svg>
  );
}

/* Чипы статусов — квадратные, как в макете */
function chipClass(kind: "published" | "draft" | "new") {
  if (kind === "published") return "bg-green-100 text-green-900";
  if (kind === "draft") return "adm-tag";
  return "bg-gold text-coal";
}

function Chip({
  kind,
  children,
}: {
  kind: "published" | "draft" | "new";
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex whitespace-nowrap px-2 py-1 text-[11px] font-semibold leading-none ${chipClass(kind)}`}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Обзор админки                                                       */
/* ------------------------------------------------------------------ */

export function OverviewClient() {
  const username = useAdminUser();
  const products = useSWR<AdminProductsResponse>(
    "/api/admin/products",
    adminFetcher,
    { revalidateOnFocus: false },
  );
  const leads = useSWR<AdminLeadsResponse>("/api/admin/leads", adminFetcher, {
    revalidateOnFocus: false,
  });

  const loading = products.isLoading || leads.isLoading;
  const error = products.error ?? leads.error;

  return (
    <div>
      {/* Приветствие + переключатель темы + меню администратора (шестерёнка) */}
      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-6">
        <div className="min-w-0">
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Добрый день, {username || "…"}
          </h1>
          <p className="adm-muted mt-4 max-w-2xl text-sm sm:text-base">
            Здесь собрана главная информация по сайту и обращениям клиентов
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <AdminThemeToggle className="h-11 w-11" />
          <AdminGearMenu />
        </div>
      </div>

      {error && !loading ? (
        <ErrorBox error={error} />
      ) : loading ? (
        <>
          {/* Три стат-карточки в скелетонах */}
          <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
          {/* Списки в скелетонах */}
          <div className="mt-10 grid gap-6 sm:mt-14 xl:grid-cols-[7fr_5fr] xl:gap-8">
            <AdminListSkeleton rows={4} media="box" />
            <AdminListSkeleton rows={4} media="circle" />
          </div>
        </>
      ) : (
        <Dashboard
          products={products.data!.products}
          leads={leads.data!.leads}
        />
      )}

      {/* Возврат на сайт */}
      <div className="mt-12 sm:mt-16">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-base text-(--adm-text) transition-colors hover:text-gold sm:text-lg"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          Вернуться на сайт
        </Link>
      </div>
    </div>
  );
}

function ErrorBox({ error }: { error: unknown }) {
  return (
    <div className="mt-10 flex flex-col items-center gap-4 border border-red-500/30 bg-red-500/10 p-10 text-center">
      <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
      <p className="text-sm text-red-200">
        {error instanceof AuthError
          ? "Сессия истекла. Войдите заново."
          : "Не удалось загрузить данные. Сервис временно недоступен."}
      </p>
      {error instanceof AuthError && (
        <Link href="/admin/login" className="btn-outline-gold">
          Войти заново
        </Link>
      )}
    </div>
  );
}

function Dashboard({
  products,
  leads,
}: {
  products: AdminProductsResponse["products"];
  leads: AdminLeadsResponse["leads"];
}) {
  /* Считаем по реальным данным бэкенда, без выдуманной статистики */
  const now = Date.now();
  const age = (iso: string) => now - new Date(iso).getTime();
  const leads7 = leads.filter((l) => age(l.createdAt) <= 7 * DAY_MS).length;
  const leadsPrev7 = leads.filter((l) => {
    const t = age(l.createdAt);
    return t > 7 * DAY_MS && t <= 14 * DAY_MS;
  }).length;
  const delta =
    leadsPrev7 > 0
      ? Math.round(((leads7 - leadsPrev7) / leadsPrev7) * 100)
      : null;
  const drafts = products.filter((p) => !p.isActive).length;
  const publishedShare = products.length
    ? Math.round(((products.length - drafts) / products.length) * 100)
    : 0;
  const lastLead = leads[0];

  return (
    <>
      {/* Три светлые карточки со статистикой */}
      <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        <div className="h-full">
          <div className="adm-panel flex h-full min-h-44 flex-col justify-between p-6 sm:p-7">
            <p className="adm-muted text-sm sm:text-base">Новые заявки</p>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-5xl font-bold tracking-tight sm:text-6xl">
                  {leads7}
                </p>
                <p className="mt-2 text-sm font-medium text-gold">
                  {delta === null
                    ? leads7 > 0
                      ? "за последние 7 дней"
                      : "пока нет заявок"
                    : `${delta >= 0 ? "+" : ""}${delta}% за неделю`}
                </p>
              </div>
              <BarsIcon className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
            </div>
          </div>
        </div>

        <div className="h-full">
          <div className="adm-panel flex h-full min-h-44 flex-col justify-between p-6 sm:p-7">
            <p className="adm-muted text-sm sm:text-base">Обращений всего</p>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-5xl font-bold tracking-tight sm:text-6xl">
                  {leads.length}
                </p>
                <p className="adm-faint mt-2 truncate text-sm font-medium">
                  {lastLead
                    ? `последняя: ${formatRowTime(lastLead.createdAt)}`
                    : "пока нет обращений"}
                </p>
              </div>
              <TrendIcon className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
            </div>
          </div>
        </div>

        <div className="h-full sm:col-span-2 xl:col-span-1">
          <div className="adm-panel flex h-full min-h-44 flex-col justify-between p-6 sm:p-7">
            <p className="adm-muted text-sm sm:text-base">
              Товары в каталоге
            </p>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-5xl font-bold tracking-tight sm:text-6xl">
                  {products.length}
                </p>
                <p className="mt-2 text-sm font-medium text-gold">
                  {drafts > 0
                    ? draftsHint(drafts)
                    : products.length > 0
                      ? "все опубликованы"
                      : "каталог пуст"}
                </p>
              </div>
              {/* Полоса прогресса: доля опубликованных товаров */}
              <div className="w-28 shrink-0 sm:w-32">
                <div className="adm-soft h-2">
                  <div
                    className="h-full bg-gold transition-[width] duration-500"
                    style={{ width: `${publishedShare}%` }}
                  />
                </div>
                <p className="adm-faint mt-2 text-right text-xs">
                  {publishedShare}% опубликовано
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Списки: товары и заявки */}
      <div className="mt-10 grid gap-6 sm:mt-14 xl:grid-cols-[7fr_5fr] xl:gap-8">
        {/* ТОВАРЫ */}
        <div className="adm-panel">
          <div className="flex items-start justify-between gap-4 px-5 pb-2 pt-6 sm:px-7 sm:pt-7">
            <div>
              <p className="adm-faint text-xs uppercase tracking-[0.25em]">
                Каталог
              </p>
              <h2 className="mt-1.5 text-xl font-bold uppercase tracking-wide sm:text-2xl">
                Товары
              </h2>
            </div>
            <Link
              href="/admin/products"
              className="adm-muted inline-flex shrink-0 items-center gap-1.5 pt-1 text-sm transition-colors hover:text-gold"
            >
              все товары
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <ul className="adm-rows mt-3">
            {products.slice(0, PREVIEW_LIMIT).map((p) => (
              <li key={p.id}>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 px-5 py-4 sm:px-7">
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
                  <div className="min-w-0 flex-1 basis-40">
                    <p className="truncate font-semibold">{p.title}</p>
                    <p className="adm-muted mt-0.5 truncate text-sm">
                      {p.position} · {p.material}
                    </p>
                  </div>
                  {/* На мобильных статус и меню уходят на вторую строку */}
                  <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end sm:gap-3">
                    <Chip kind={p.isActive ? "published" : "draft"}>
                      {p.isActive ? "опубликован" : "черновик"}
                    </Chip>
                    <ProductRowMenu id={p.id} title={p.title} />
                  </div>
                </div>
              </li>
            ))}
            {products.length === 0 && (
              <li className="adm-muted px-5 py-6 text-sm sm:px-7">
                Товаров пока нет — добавьте первый в разделе «Товары».
              </li>
            )}
          </ul>
        </div>

        {/* ЗАЯВКИ */}
        <div className="adm-panel">
          <div className="flex items-start justify-between gap-4 px-5 pb-2 pt-6 sm:px-7 sm:pt-7">
            <div>
              <p className="adm-faint text-xs uppercase tracking-[0.25em]">
                Обращения
              </p>
              <h2 className="mt-1.5 text-xl font-bold uppercase tracking-wide sm:text-2xl">
                Заявки
              </h2>
            </div>
            <Link
              href="/admin/leads"
              className="adm-muted inline-flex shrink-0 items-center gap-1.5 pt-1 text-sm transition-colors hover:text-gold"
            >
              все заявки
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <ul className="adm-rows mt-3">
            {leads.slice(0, PREVIEW_LIMIT).map((l) => (
              <li key={l.id}>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 px-5 py-4 sm:px-7">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coal text-sm font-bold uppercase text-paper">
                    {l.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1 basis-40">
                    <p className="truncate font-semibold">{l.name}</p>
                    <p className="adm-muted truncate text-sm">
                      {l.carModel || "Авто не указан"}
                    </p>
                  </div>
                  {/* На мобильных время и статус уходят на вторую строку */}
                  <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:flex-col sm:items-end sm:gap-1.5">
                    <p className="adm-muted whitespace-nowrap text-sm">
                      {formatRowTime(l.createdAt)}
                    </p>
                    {age(l.createdAt) <= NEW_LEAD_MS && (
                      <Chip kind="new">новая</Chip>
                    )}
                  </div>
                </div>
              </li>
            ))}
            {leads.length === 0 && (
              <li className="adm-muted px-5 py-6 text-sm sm:px-7">
                Заявок пока нет — отправьте тестовую со страницы «Контакты».
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
