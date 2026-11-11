import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { LoginForm } from "@/components/admin/login-form";
import { LogoMark } from "@/components/site/logo";

export const metadata: Metadata = {
  title: "Вход в админку",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  /* Проверку «уже вошли» делает LoginForm на клиенте (токен + GET /api/admin/me) */
  return (
    <div className="container-site flex max-w-md flex-col px-4 py-20 sm:px-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        На сайт
      </Link>

      <div className="border border-white/10 bg-panel p-6 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <LogoMark className="h-11 w-11" />
          <div>
            <h1 className="text-lg font-bold">Админ-панель</h1>
            <p className="text-xs text-zinc-500">
              Управление товарами и заявками TUNING/304
            </p>
          </div>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
