"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { adminMe, AuthError, getStoredToken } from "@/lib/api";
import {
  AdminThemeProvider,
  AdminUserProvider,
  useAdminTheme,
} from "@/components/admin/admin-context";
import { AdminBar } from "@/components/admin/admin-nav";

/**
 * Привратник админки. На монтировании проверяет токен запросом
 * GET /api/admin/me:
 *  - валиден  → рендерит содержимое (шапка и подвал сайта — из root layout);
 *  - нет/401  → редирект на /admin/login.
 *
 * Имя администратора доступно потомкам через useAdminUser().
 * Полоса навигации AdminBar показывается на внутренних страницах,
 * а обзор /admin остаётся чистым — навигация в шестерёнке.
 *
 * Зона контента обёрнута в .adm-theme + data-theme: тёмная/светлая тема
 * применяется ТОЛЬКО к админке, шапка и подвал сайта остаются тёмными.
 */
export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"checking" | "ok">("checking");
  const [username, setUsername] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (!getStoredToken()) {
        router.replace("/admin/login");
        return;
      }
      try {
        const name = await adminMe();
        if (cancelled) return;
        setUsername(name);
        setStatus("ok");
      } catch (err) {
        if (cancelled) return;
        // AuthError (токен просрочен) или бэкенд недоступен — на страницу входа
        if (!(err instanceof AuthError)) {
          console.error("[admin] проверка сессии не удалась:", err);
        }
        router.replace("/admin/login");
      }
    }

    void check();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (status !== "ok") {
    return (
      <div
        className="flex min-h-[50vh] items-center justify-center gap-3 text-zinc-400"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-5 w-5 animate-spin text-gold" aria-hidden="true" />
        <span className="text-sm">Проверяем доступ...</span>
      </div>
    );
  }

  const isOverview = pathname === "/admin";

  return (
    <AdminThemeProvider>
      <AdminScope username={username} isOverview={isOverview}>
        {children}
      </AdminScope>
    </AdminThemeProvider>
  );
}

/**
 * Внутренняя обёртка: подключается к контексту темы и вешает
 * data-theme на зону контента админки.
 */
function AdminScope({
  username,
  isOverview,
  children,
}: {
  username: string;
  isOverview: boolean;
  children: React.ReactNode;
}) {
  const { theme } = useAdminTheme();

  return (
    <AdminUserProvider value={username}>
      <div className="adm-theme flex min-h-full flex-col" data-theme={theme}>
        {!isOverview && <AdminBar />}
        <div className="container-site flex-1 py-10 sm:py-14 lg:py-16">
          {children}
        </div>
      </div>
    </AdminUserProvider>
  );
}
