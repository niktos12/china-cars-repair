import type { Metadata } from "next";

import { AdminGate } from "@/components/admin/admin-gate";

export const metadata: Metadata = {
  title: { default: "Админ-панель", template: "%s — Админка Гранфорт" },
  robots: { index: false, follow: false },
};

/**
 * Разметка обёртки админки. Проверка доступа переехала на клиент:
 * AdminGate проверяет JWT (localStorage) запросом GET /api/admin/me
 * и при отсутствии/просрочке токена отправляет на /admin/login.
 */
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminGate>{children}</AdminGate>;
}
