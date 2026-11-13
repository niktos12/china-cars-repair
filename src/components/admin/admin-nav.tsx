"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Moon, Settings, Sun } from "lucide-react";
import { toast } from "sonner";

import { clearStoredToken } from "@/lib/api";
import { useAdminTheme, useAdminUser } from "@/components/admin/admin-context";

const ADMIN_TABS = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/products", label: "Товары" },
  { href: "/admin/leads", label: "Заявки" },
];

/** Выход: чистим JWT и уводим на страницу входа. */
function useLogout() {
  const router = useRouter();
  return function onLogout() {
    clearStoredToken();
    toast.success("Вы вышли из админки");
    router.replace("/admin/login");
  };
}

function isActiveTab(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

/**
 * Переключатель тёмной/светлой темы админки. Выбор сохраняется в
 * localStorage (AdminThemeProvider) и применяется ко всей зоне
 * контента админки; шапка и подвал сайта остаются тёмными.
 */
export function AdminThemeToggle({
  className,
  iconClassName = "h-5 w-5",
}: {
  className?: string;
  iconClassName?: string;
}) {
  const { theme, setTheme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      aria-pressed={!isDark}
      title={isDark ? "Светлая тема" : "Тёмная тема"}
      className={`flex items-center justify-center border border-(--adm-border) text-(--adm-muted) transition-colors hover:border-gold hover:text-gold ${className ?? ""}`}
    >
      {isDark ? (
        <Sun className={iconClassName} aria-hidden="true" />
      ) : (
        <Moon className={iconClassName} aria-hidden="true" />
      )}
    </button>
  );
}

/**
 * Тонкая полоса навигации админки под шапкой сайта.
 * Показывается на внутренних страницах (/admin/products, /admin/leads…),
 * на обзоре её нет — там навигация вынесена в шестерёнку (AdminGearMenu),
 * как в референс-макете. Окрашена переменными темы админки.
 */
export function AdminBar() {
  const pathname = usePathname();
  const username = useAdminUser();
  const logout = useLogout();

  return (
    <div className="border-b border-(--adm-border) bg-(--adm-panel) transition-colors">
      <div className="container-site flex min-h-12 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Админка
          </span>
          <span className="adm-tag px-2 py-0.5 text-xs">{username || "…"}</span>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <nav
            className="flex flex-wrap items-center gap-1"
            aria-label="Навигация админки"
          >
            {ADMIN_TABS.map((t) => {
              const active = isActiveTab(pathname, t.href);
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={`px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? "bg-gold font-semibold text-coal"
                      : "text-(--adm-muted) hover:bg-(--adm-hover) hover:text-gold"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {t.label}
                </Link>
              );
            })}
          </nav>
          <AdminThemeToggle className="ml-1 h-8 w-8" iconClassName="h-4 w-4" />
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-(--adm-muted) transition-colors hover:bg-(--adm-hover) hover:text-red-400"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Кнопка-шестерёнка с выпадающим меню на обзоре (справа от приветствия).
 * В меню: разделы админки, «Вернуться на сайт» и выход.
 */
export function AdminGearMenu() {
  const pathname = usePathname();
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  /* Клик мимо меню и Esc закрывают его */
  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Меню администратора"
        className={`flex h-11 w-11 items-center justify-center border transition-colors ${
          open
            ? "border-gold text-gold"
            : "border-(--adm-border) text-(--adm-muted) hover:border-gold hover:text-gold"
        }`}
      >
        <Settings
          className={`h-5 w-5 transition-transform duration-300 ${open ? "rotate-90" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Меню администратора"
          className="absolute right-0 top-full z-30 mt-2 w-56 border border-(--adm-border) bg-(--adm-panel) shadow-2xl shadow-black/40"
        >
          <div className="py-2">
            {ADMIN_TABS.map((t) => {
              const active = isActiveTab(pathname, t.href);
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={`block px-5 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-(--adm-hover) text-gold"
                      : "text-(--adm-text) hover:bg-(--adm-hover) hover:text-gold"
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>
          <div className="border-t border-(--adm-border) py-2">
            <Link
              href="/"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-5 py-2.5 text-sm text-(--adm-text) transition-colors hover:bg-(--adm-hover) hover:text-gold"
            >
              Вернуться на сайт
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={logout}
              className="flex w-full items-center gap-2 px-5 py-2.5 text-left text-sm text-red-400 transition-colors hover:bg-(--adm-hover)"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Выйти
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
