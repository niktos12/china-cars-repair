"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteLeadAction, deleteProductAction } from "@/server/admin-actions";

export function DeleteProductButton({ id, title }: { id: number; title: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-red-500 hover:bg-red-500/10 hover:text-red-400"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Удалить товар «${title}»? Действие необратимо.`)) return;
        startTransition(async () => {
          const res = await deleteProductAction(id);
          if (res.ok) {
            toast.success("Товар удалён");
            router.refresh();
          } else {
            toast.error(res.error ?? "Ошибка удаления");
          }
        });
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
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-red-500 hover:bg-red-500/10 hover:text-red-400"
      disabled={pending}
      onClick={() => {
        if (!window.confirm("Удалить заявку? Действие необратимо.")) return;
        startTransition(async () => {
          const res = await deleteLeadAction(id);
          if (res.ok) {
            toast.success("Заявка удалена");
            router.refresh();
          } else {
            toast.error(res.error ?? "Ошибка удаления");
          }
        });
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
