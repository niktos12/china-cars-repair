"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AuthError,
  deleteAdminLead,
  deleteAdminProduct,
} from "@/lib/api";

/**
 * Кнопки удаления в админке. Данные теперь приходят с бэкенда,
 * поэтому после удаления перезапрашиваем кэш SWR:
 *  - /api/admin/products — таблица в админке;
 *  - /api/products       — публичный каталог.
 */
function useDelete() {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [pending, setPending] = useState(false);

  async function run(action: () => Promise<void>, okText: string, keys: string[]) {
    setPending(true);
    try {
      await action();
      toast.success(okText);
      for (const key of keys) void mutate(key);
    } catch (err) {
      if (err instanceof AuthError) {
        toast.error(err.message);
        router.replace("/admin/login");
      } else {
        toast.error(err instanceof Error ? err.message : "Ошибка удаления");
      }
    } finally {
      setPending(false);
    }
  }

  return { pending, run };
}

export function DeleteProductButton({ id, title }: { id: number; title: string }) {
  const { pending, run } = useDelete();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-red-500 hover:bg-red-500/10 hover:text-red-400"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Удалить товар «${title}»? Действие необратимо.`)) return;
        void run(() => deleteAdminProduct(id), "Товар удалён", [
          "/api/admin/products",
          "/api/products",
        ]);
      }}
      aria-label={`Удалить товар ${title}`}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      )}
    </Button>
  );
}

export function DeleteLeadButton({ id }: { id: number }) {
  const { pending, run } = useDelete();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-red-500 hover:bg-red-500/10 hover:text-red-400"
      disabled={pending}
      onClick={() => {
        if (!window.confirm("Удалить заявку? Действие необратимо.")) return;
        void run(() => deleteAdminLead(id), "Заявка удалена", [
          "/api/admin/leads",
        ]);
      }}
      aria-label="Удалить заявку"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      )}
    </Button>
  );
}
