import { NextResponse } from "next/server";

import { getProducts } from "@/server/queries";

/**
 * GET /api/products
 * Публичный REST-эндпоинт каталога. Именно его читает фронтенд через SWR.
 * Ответ: { products: ProductDto[], demo: boolean }
 */
export async function GET() {
  const { products, demo } = await getProducts();
  // Без кэширования: правки из админки должны сразу попадать в каталог
  return NextResponse.json({ products, demo });
}
