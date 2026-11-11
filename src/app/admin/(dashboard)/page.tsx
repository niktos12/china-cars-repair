import Link from "next/link";
import { ArrowRight, Mail, Package, ShieldAlert } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { getAllProducts, getLeads } from "@/server/queries";

function formatDate(d: Date | null): string {
  if (!d) return "—";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function AdminDashboardPage() {
  const [{ products, demo: productsDemo }, { leads, demo: leadsDemo }] =
    await Promise.all([getAllProducts(), getLeads()]);

  const activeCount = products.filter((p) => p.isActive).length;
  const lastLead = leads[0];

  const stats = [
    {
      icon: Package,
      label: "Товаров",
      value: products.length,
      hint: `${activeCount} активно`,
      href: "/admin/products",
    },
    {
      icon: Mail,
      label: "Заявок",
      value: leads.length,
      hint: lastLead ? `последняя: ${formatDate(lastLead.createdAt)}` : "пока нет заявок",
      href: "/admin/leads",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Обзор</h1>

      {(productsDemo || leadsDemo) && (
        <div className="mt-4 flex items-start gap-3 border border-gold/40 bg-gold/10 p-4 text-sm text-gold">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            Демо-режим: БД не подключена, изменения хранятся в памяти процесса.
            На Railway с PostgreSQL админка работает с реальными данными.
          </p>
        </div>
      )}

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
