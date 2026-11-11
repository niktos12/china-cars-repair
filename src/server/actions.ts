"use server";

import { leadSchema } from "@/lib/validation";
import { createLead } from "@/server/queries";
import type { LeadActionResult } from "@/lib/types";

/**
 * Server Action: форма заявки вызывает эту функцию напрямую,
 * без HTTP-запроса и без REST-эндпоинта.
 *
 * Здесь вторая линия обороны по валидации: клиент уже проверил
 * форму через zod, но сервер никогда не доверяет клиенту.
 */
export async function submitLeadAction(
  raw: unknown,
  source: string = "website",
): Promise<LeadActionResult> {
  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, error: first?.message ?? "Проверьте правильность заполнения формы" };
  }

  return createLead(parsed.data, source);
}
