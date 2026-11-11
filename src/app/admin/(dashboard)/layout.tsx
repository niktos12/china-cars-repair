import type { Metadata } from "next";

import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/server/auth";

export const metadata: Metadata = {
  title: { default: "Админ-панель", template: "%s — Админка TUNING/304" },
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const username = await requireAdmin();

  return (
    <div className="flex min-h-[60vh] flex-col">
      <AdminNav username={username} />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </div>
    </div>
  );
}
