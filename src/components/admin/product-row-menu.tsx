"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ConfirmDeleteDialog,
  useAdminDelete,
} from "@/components/admin/delete-buttons";
import { useAdminTheme } from "@/components/admin/admin-context";
import { AuthError, deleteAdminProduct, deleteAdminLead } from "@/lib/api";

/* Кэш, который нужно обновить после удаления товара */
const PRODUCT_SWR_KEYS = ["/api/admin/products", "/api/products"];

/**
 * Dropdown-меню действий с товаром в списках (кнопка «…»):
 * «Редактировать» — переход на страницу товара, «Удалить» — диалог
 * подтверждения и удаление без ухода со страницы.
 *
 * Контент меню портится Radix в body (вне зоны .adm-theme), поэтому
 * в светлой теме фон задаётся явно.
 */
export function ProductRowMenu({
  id,
  title,
  /** по умолчанию — товар; ключи SWR и API-вызов переключаются автоматически */
  kind = "product",
}: {
  id: number;
  title: string;
  kind?: "product" | "lead";
}) {
  const { pending, run } = useAdminDelete();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { theme } = useAdminTheme();

  const isProduct = kind === "product";
  const contentClass =
    theme === "light" ? "bg-white text-zinc-900 border-black/15" : undefined;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-haspopup="menu"
            aria-label={`Действия: ${title}`}
            title="Действия"
            className="adm-icon-btn h-9 w-9"
            disabled={pending}
          >
            {pending ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            ) : (
              <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className={contentClass}>
          {isProduct ? (
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${id}`} className="cursor-pointer">
                <Pencil aria-hidden="true" />
                Редактировать
              </Link>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onSelect={() => setConfirmOpen(true)}
          >
            <Trash2 aria-hidden="true" />
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDeleteDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={isProduct ? `Удалить товар «${title}»?` : "Удалить заявку?"}
        description={
          isProduct
            ? "Действие необратимо. Товар исчезнет из каталога сайта."
            : "Действие необратимо. Заявка исчезнет из списка обращений."
        }
        pending={pending}
        onConfirm={() =>
          isProduct
            ? run(() => deleteAdminProduct(id), "Товар удалён", PRODUCT_SWR_KEYS)
            : run(() => deleteAdminLead(id), "Заявка удалена", [
                "/api/admin/leads",
              ])
        }
      />
    </>
  );
}
