"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAdminTheme } from "@/components/admin/admin-context";
import { AuthError, deleteAdminLead } from "@/lib/api";

/**
 * Удаление в админке. Данные приходят с бэкенда, поэтому после удаления
 * перезапрашиваем кэш SWR:
 *  - /api/admin/products и /api/products — каталог в админке и на сайте;
 *  - /api/admin/leads — список заявок.
 */
export function useAdminDelete() {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [pending, setPending] = useState(false);

  async function run(
    action: () => Promise<void>,
    okText: string,
    keys: string[],
  ) {
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

/**
 * Диалог подтверждения удаления (AlertDialog). Контент портится в body
 * вне зоны .adm-theme, поэтому в светлой теме фон задаём явно.
 */
export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  pending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  /** Promise-действие удаления (ошибки обрабатывает useAdminDelete) */
  onConfirm: () => Promise<void> | void;
  pending?: boolean;
}) {
  const { theme } = useAdminTheme();
  const contentClass =
    theme === "light" ? "bg-white text-zinc-900 border-black/15" : undefined;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={contentClass}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            className="bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-600"
            onClick={(e) => {
              /* отменяем автозакрытие — закрываем только после действия */
              e.preventDefault();
              void Promise.resolve(onConfirm()).finally(() =>
                onOpenChange(false),
              );
            }}
          >
            {pending && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * Кнопка удаления заявки (иконка корзины, как в референсе) с диалогом
 * подтверждения вместо window.confirm.
 */
export function DeleteLeadButton({ id }: { id: number }) {
  const { pending, run } = useAdminDelete();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Удалить заявку"
        title="Удалить заявку"
        className="adm-icon-btn h-9 w-9 text-red-500 hover:text-red-400"
        disabled={pending}
        onClick={() => setOpen(true)}
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        )}
      </button>

      <ConfirmDeleteDialog
        open={open}
        onOpenChange={setOpen}
        title="Удалить заявку?"
        description="Действие необратимо. Заявка исчезнет из списка обращений."
        pending={pending}
        onConfirm={() =>
          run(() => deleteAdminLead(id), "Заявка удалена", [
            "/api/admin/leads",
          ])
        }
      />
    </>
  );
}
