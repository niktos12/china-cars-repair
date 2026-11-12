"use client";

import Link from "next/link";
import useSWR from "swr";
import { ArrowRight, AlertTriangle, Loader2, Mail, Package } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { adminFetcher, AuthError } from "@/lib/api";
import type { AdminLeadsResponse, AdminProductsResponse } from "@/lib/types";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** Обзор админки: счётчики товаров и заявок + последняя заявка. */
export function OverviewClient() {
  const products = useSWR<AdminProductsResponse>(
    "/api/admin/products",
    adminFetcher,
    { revalidateOnFocus: false },
  );
  const leads = useSWR<AdminLeadsResponse>("/api/admin/leads", adminFetcher, {
    revalidateOnFocus: false,
  });

  if (products.error || leads.error) {
    const err = products.error ?? leads.error;
    return (
      <div className="mt-10 flex flex-col items-center gap-4 border border-red-500/30 bg-red-500/10 p-10 text-center">
        <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
        <p className="text-sm text-red-200">
          {err instanceof AuthError
            ? "Сессия истекла. Войдите заново."
            : "Не удалось загрузить данные. Сервис временно недоступен."}
        </p>
        {err instanceof AuthError && (
          <Link href="/admin/login" className="btn-outline-gold">
            Войти заново
          </Link>
        )}
      </div>
    );
  }

  if (products.isLoading || leads.isLoading || !products.data || !leads.data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-3 text-zinc-400">
        <Loader2 className="h-5 w-5 animate-spin text-gold" aria-hidden="true" />
        <span className="text-sm">Загружаем данные...</span>
      </div>
    );
  }

  const { products: list } = products.data;
  const { leads: leadsList } = leads.data;
  const activeCount = list.filter((p) => p.isActive).length;
  const lastLead = leadsList[0];

  const stats = [
    {
      icon: Package,
      label: "Товаров",
      value: list.length,
      hint: `${activeCount} активно`,
      href: "/admin/products",
    },
    {
      icon: Mail,
      label: "Заявок",
      value: leadsList.length,
      hint: lastLead ? `последняя: ${formatDate(lastLead.createdAt)}` : "пока нет заявок",
      href: "/admin/leads",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Обзор</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {stats.map((s) => (
          <Card key={s.label} className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <s.icon className="h-5 w-5 text-gold" aria-hidden="true" />
                <Link
                  href={s.href}
                  className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-gold"
                >
                  Открыть
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
              <p className="mt-3 text-3xl font-bold">{s.value}</p>
              <p className="text-sm font-medium">{s.label}</p>
              <p className="mt-1 text-xs text-zinc-400">{s.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {lastLead && (
        <Card className="mt-4 p-6">
          <CardContent className="p-0">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Последняя заявка
            </p>
            <p className="mt-2 font-semibold">
              {lastLead.name} · {lastLead.phone}
              {lastLead.carModel ? ` · ${lastLead.carModel}` : ""}
            </p>
            {lastLead.message && (
              <p className="mt-1 text-sm text-zinc-500">{lastLead.message}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
