"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ExternalLink, LayoutDashboard, LogOut, Mail, Package } from "lucide-react";
import { toast } from "sonner";

import { logoutAction } from "@/server/admin-actions";

const TABS = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard },
  { href: "/admin/products", label: "Товары", icon: Package },
  { href: "/admin/leads", label: "Заявки", icon: Mail },
];

export function AdminNav({ username }: { username: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function onLogout() {
    await logoutAction();
    toast.success("Вы вышли из админки");
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="border-b bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold uppercase tracking-wider">
            Админка
          </span>
          <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-300">
            {username}
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-1" aria-label="Навигация админки">
          {TABS.map((t) => {
            const active =
              t.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-gold font-semibold text-coal"
                    : "text-zinc-300 hover:bg-white/10 hover:text-gold"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <t.icon className="h-4 w-4" aria-hidden="true" />
                {t.label}
              </Link>
            );
          })}

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Сайт
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-red-400 transition-colors hover:bg-zinc-800"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Выйти
          </button>
        </nav>
      </div>
    </div>
  );
}
