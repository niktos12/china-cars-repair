"use server";

import { revalidatePath } from "next/cache";

import {
  checkCredentials,
  endSession,
  startSession,
  requireAdminApi,
} from "@/server/auth";
import {
  createProduct,
  deleteLead,
  deleteProduct,
  updateProduct,
} from "@/server/queries";
import {
  adminLoginSchema,
  productFormSchema,
} from "@/lib/validation";

/* ============================ АВТОРИЗАЦИЯ ============================ */

export async function loginAction(raw: unknown): Promise<{ ok: boolean; error?: string }> {
  const parsed = adminLoginSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Заполните поля" };
  }

  if (!checkCredentials(parsed.data.username, parsed.data.password)) {
    // Небольшая задержка против перебора паролей
    await new Promise((r) => setTimeout(r, 600));
    return { ok: false, error: "Неверный логин или пароль" };
  }

  await startSession(parsed.data.username);
  return { ok: true };
}

export async function logoutAction(): Promise<{ ok: boolean }> {
  await endSession();
  revalidatePath("/", "layout");
  return { ok: true };
}

/* ============================ ТОВАРЫ (только админ) ============================ */

function revalidateCatalog(slug?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/products");
  if (slug) revalidatePath(`/products/${slug}`);
}

export async function saveProductAction(
  raw: unknown,
  id?: number,
): Promise<
  | { ok: true; id: number; demo: boolean; slug: string }
  | { ok: false; error: string; demo?: boolean }
> {
  if (!(await requireAdminApi())) {
    return { ok: false, error: "Сессия истекла. Войдите заново." };
  }

  const parsed = productFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Проверьте поля формы",
    };
  }

  const result = id
    ? await updateProduct(id, parsed.data)
    : await createProduct(parsed.data);

  if (result.ok) {
    revalidateCatalog(parsed.data.slug);
    return { ok: true, id: result.id, demo: result.demo, slug: parsed.data.slug };
  }
  return result;
}

export async function deleteProductAction(
  id: number,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await requireAdminApi())) {
    return { ok: false, error: "Сессия истекла. Войдите заново." };
  }

  const result = await deleteProduct(id);
  if (result.ok) revalidateCatalog();
  return result;
}

export async function deleteLeadAction(
  id: number,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await requireAdminApi())) {
    return { ok: false, error: "Сессия истекла. Войдите заново." };
  }

  const result = await deleteLead(id);
  if (result.ok) revalidatePath("/admin/leads");
  return result;
}
