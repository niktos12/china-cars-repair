"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { adminMe, AuthError, getStoredToken } from "@/lib/api";

import { AdminNav } from "./admin-nav";

/**
 * Привратник админки (заменила серверную сессию на проверку JWT).
 * На монтировании проверяет токен запросом GET /api/admin/me:
 *  - валиден  → рендерит навигацию и содержимое;
 *  - нет/401  → редирект на /admin/login.
 */
export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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
        className="flex min-h-[60vh] items-center justify-center gap-3 text-zinc-400"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-5 w-5 animate-spin text-gold" aria-hidden="true" />
        <span className="text-sm">Проверяем доступ...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col">
      <AdminNav username={username} />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </div>
    </div>
  );
}
