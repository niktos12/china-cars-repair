import { NextResponse } from "next/server";

import { leadSchema } from "@/lib/validation";
import { createLead } from "@/server/queries";
import type { LeadActionResult } from "@/lib/types";

/**
 * POST /api/leads
 * REST-вариант приёма заявок (на случай будущих клиентов API:
 * мобильное приложение, ВК-мини-апп и т.п.).
 *
 * Основная форма на сайте работает через Server Action
 * (src/server/actions.ts) — этот роут дублирует ту же логику.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    const res: LeadActionResult = { ok: false, error: "Некорректный JSON" };
    return NextResponse.json(res, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const res: LeadActionResult = {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Проверьте правильность заполнения формы",
    };
    return NextResponse.json(res, { status: 422 });
  }

  const result = await createLead(parsed.data, "api");
  if (!result.ok) {
    return NextResponse.json(result, { status: 500 });
  }
  return NextResponse.json(result, { status: 201 });
}
