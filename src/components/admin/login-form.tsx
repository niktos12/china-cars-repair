"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn, Shield } from "lucide-react";
import { toast } from "sonner";

import { adminLogin, adminMe, getStoredToken, storeToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminLoginSchema, type AdminLoginInput } from "@/lib/validation";

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { username: "", password: "" },
  });

  /* Уже вошли (токен жив) — сразу на дашборд, без повторного логина */
  useEffect(() => {
    if (!getStoredToken()) return;
    adminMe()
      .then(() => router.replace("/admin"))
      .catch(() => {
        /* токен мёртв — останемся на форме, adminFetch уже снял его */
      });
  }, [router]);

  async function onSubmit(values: AdminLoginInput) {
    try {
      const token = await adminLogin(values.username, values.password);
      storeToken(token);
      toast.success("Вход выполнен");
      router.replace("/admin");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка входа");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="admin-username">Логин</Label>
        <Input id="admin-username" autoComplete="username" {...register("username")} />
        {errors.username && (
          <p className="text-xs text-red-600" role="alert">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="admin-password">Пароль</Label>
        <Input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-red-600" role="alert">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gold font-semibold text-coal hover:bg-gold-light"
      >
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
        )}
        Войти
      </Button>

      <p className="flex items-start gap-2 bg-white/5 p-3 text-xs text-zinc-400">
        <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" aria-hidden="true" />
        Логин и пароль задаются на бэкенде переменными окружения
        ADMIN_USERNAME и ADMIN_PASSWORD (см. .env бэкенд-репозитория).
      </p>
    </form>
  );
}
