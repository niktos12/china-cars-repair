"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

/**
 * Имя администратора, полученное AdminGate (GET /api/admin/me).
 * Нужно шапке обзора («Добрый день, …») и полосе навигации админки.
 */
const AdminUserContext = createContext<string>("");

export const AdminUserProvider = AdminUserContext.Provider;

export function useAdminUser(): string {
  return useContext(AdminUserContext);
}

/* ------------------------------------------------------------------ */
/* Тема админки: тёмная (по умолчанию) / светлая                        */
/* ------------------------------------------------------------------ */

export type AdminTheme = "dark" | "light";

const ADMIN_THEME_KEY = "granfort.admin.theme";

const AdminThemeContext = createContext<{
  theme: AdminTheme;
  setTheme: (theme: AdminTheme) => void;
}>({
  theme: "dark",
  setTheme: () => {},
});

/**
 * Провайдер темы админки. Выбор сохраняется в localStorage и
 * восстанавливается после гидратации (до этого рендерится тёмная —
 * совпадает с SSR, мигания нет). На разметку тема ложится через
 * data-theme у обёртки .adm-theme в AdminGate.
 */
export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>("dark");

  /* Восстанавливаем сохранённый выбор после монтирования */
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(ADMIN_THEME_KEY);
      if (saved === "light" || saved === "dark") setThemeState(saved);
    } catch {
      /* приватный режим / запрет storage — остаёмся в тёмной */
    }
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (next: AdminTheme) => {
        setThemeState(next);
        try {
          window.localStorage.setItem(ADMIN_THEME_KEY, next);
        } catch {
          /* хранилище недоступно — тема просто не сохранится */
        }
      },
    }),
    [theme],
  );

  return (
    <AdminThemeContext.Provider value={value}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}
