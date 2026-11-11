import { NextResponse } from "next/server";

import { isDbConfigured } from "@/server/db";

/**
 * GET /api/health
 * Health-check для Railway (см. healthcheckPath в railway.json).
 */
export async function GET() {
  return NextResponse.json({ ok: true, db: isDbConfigured ? "configured" : "demo" });
}
