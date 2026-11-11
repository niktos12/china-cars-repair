import { asc, desc, eq } from "drizzle-orm";

import { isDbConfigured, getDb, schema } from "@/server/db";
import { demoStore, slugExists } from "@/server/demo-store";
import type { LeadInput, ProductFormInput } from "@/lib/validation";
import type { ProductDto } from "@/lib/types";

type ProductRow = typeof schema.products.$inferSelect;
type LeadRow = typeof schema.leads.$inferSelect;

function toDto(p: ProductRow): ProductDto {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    carModel: p.carModel,
    position: p.position,
    material: p.material,
    description: p.description,
    priceFrom: p.priceFrom,
    imageUrl: p.imageUrl,
  };
}

/* ============================ КАТАЛОГ (сайт) ============================ */

/** Каталог для сайта: только активные товары. */
export async function getProducts(): Promise<{
  products: ProductDto[];
  demo: boolean;
}> {
  const db = getDb();
  if (!db) {
    return {
      products: demoStore.products
        .filter((p) => p.isActive)
        .map(toDto),
      demo: true,
    };
  }

  try {
    const rows = await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.isActive, true))
      .orderBy(asc(schema.products.carModel), asc(schema.products.id));
    return { products: rows.map(toDto), demo: false };
  } catch (err) {
    console.error("[getProducts] DB error, fallback to demo data:", err);
    return {
      products: demoStore.products.filter((p) => p.isActive).map(toDto),
      demo: true,
    };
  }
}

/** Один товар по slug — для страницы /products/[slug]. */
export async function getProductBySlug(
  slug: string,
): Promise<{ product: ProductDto | null; demo: boolean }> {
  const db = getDb();
  if (!db) {
    const found = demoStore.products.find((p) => p.slug === slug) ?? null;
    return { product: found ? toDto(found) : null, demo: true };
  }

  try {
    const [row] = await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.slug, slug))
      .limit(1);
    return { product: row ? toDto(row) : null, demo: false };
  } catch (err) {
    console.error("[getProductBySlug] DB error:", err);
    const found = demoStore.products.find((p) => p.slug === slug) ?? null;
    return { product: found ? toDto(found) : null, demo: true };
  }
}

/** Похожие товары: та же модель авто, исключая текущий. */
export async function getRelatedProducts(
  carModel: string,
  excludeSlug: string,
): Promise<{ products: ProductDto[]; demo: boolean }> {
  const { products, demo } = await getProducts();
  return {
    products: products
      .filter((p) => p.carModel === carModel && p.slug !== excludeSlug)
      .slice(0, 3),
    demo,
  };
}

/* ============================ ЗАЯВКИ ============================ */

/** Сохранение заявки. Вызывается из Server Action и из REST-роута. */
export async function createLead(
  input: LeadInput,
  source: string,
): Promise<
  { ok: true; id: number | null; demo: boolean } | { ok: false; error: string }
> {
  const db = getDb();
  if (!db) {
    const id = demoStore.nextLeadId++;
    demoStore.leads.unshift({
      id,
      name: input.name,
      phone: input.phone,
      carModel: input.carModel || null,
      message: input.message || null,
      source,
      createdAt: new Date(),
    });
    console.log(`[createLead] DEMO mode: заявка #${id} сохранена в памяти`);
    return { ok: true, id, demo: true };
  }

  try {
    const [row] = await db
      .insert(schema.leads)
      .values({
        name: input.name,
        phone: input.phone,
        carModel: input.carModel || null,
        message: input.message || null,
        source,
      })
      .returning({ id: schema.leads.id });
    return { ok: true, id: row.id, demo: false };
  } catch (err) {
    console.error("[createLead] DB error:", err);
    return {
      ok: false,
      error:
        "Не удалось сохранить заявку. Попробуйте ещё раз или позвоните нам.",
    };
  }
}

/** Все заявки — для админки, новые сверху. */
export async function getLeads(): Promise<{ leads: LeadRow[]; demo: boolean }> {
  const db = getDb();
  if (!db) {
    return { leads: [...demoStore.leads], demo: true };
  }

  try {
    const rows = await db
      .select()
      .from(schema.leads)
      .orderBy(desc(schema.leads.createdAt), desc(schema.leads.id));
    return { leads: rows, demo: false };
  } catch (err) {
    console.error("[getLeads] DB error:", err);
    return { leads: [...demoStore.leads], demo: true };
  }
}

export async function deleteLead(
  id: number,
): Promise<{ ok: boolean; demo?: boolean; error?: string }> {
  const db = getDb();
  if (!db) {
    demoStore.leads = demoStore.leads.filter((l) => l.id !== id);
    return { ok: true, demo: true };
  }

  try {
    await db.delete(schema.leads).where(eq(schema.leads.id, id));
    return { ok: true };
  } catch (err) {
    console.error("[deleteLead] DB error:", err);
    return { ok: false, error: "Не удалось удалить заявку" };
  }
}

/* ============================ ТОВАРЫ (админка) ============================ */

/** Все товары, включая неактивные — для админки. */
export async function getAllProducts(): Promise<{
  products: ProductRow[];
  demo: boolean;
}> {
  const db = getDb();
  if (!db) {
    return { products: [...demoStore.products], demo: true };
  }

  try {
    const rows = await db
      .select()
      .from(schema.products)
      .orderBy(asc(schema.products.carModel), asc(schema.products.id));
    return { products: rows, demo: false };
  } catch (err) {
    console.error("[getAllProducts] DB error:", err);
    return { products: [...demoStore.products], demo: true };
  }
}

export async function getProductById(
  id: number,
): Promise<{ product: ProductRow | null; demo: boolean }> {
  const db = getDb();
  if (!db) {
    const found = demoStore.products.find((p) => p.id === id) ?? null;
    return { product: found, demo: true };
  }

  try {
    const [row] = await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.id, id))
      .limit(1);
    return { product: row ?? null, demo: false };
  } catch (err) {
    console.error("[getProductById] DB error:", err);
    const found = demoStore.products.find((p) => p.id === id) ?? null;
    return { product: found, demo: true };
  }
}

function formInputToRow(input: ProductFormInput) {
  return {
    slug: input.slug,
    title: input.title,
    carModel: input.carModel,
    position: input.position,
    material: input.material,
    description: input.description,
    priceFrom: input.priceFrom === "" ? null : Number(input.priceFrom),
    imageUrl: input.imageUrl?.trim() ? input.imageUrl.trim() : null,
    isActive: input.isActive,
  };
}

export async function createProduct(
  input: ProductFormInput,
): Promise<
  | { ok: true; id: number; demo: boolean }
  | { ok: false; error: string; demo?: boolean }
> {
  const values = formInputToRow(input);
  const db = getDb();

  if (!db) {
    if (slugExists(values.slug)) {
      return { ok: false, error: "Товар с таким slug уже существует", demo: true };
    }
    const id = demoStore.nextProductId++;
    demoStore.products.push({ id, createdAt: new Date(), ...values });
    return { ok: true, id, demo: true };
  }

  try {
    const [row] = await db
      .insert(schema.products)
      .values(values)
      .returning({ id: schema.products.id });
    return { ok: true, id: row.id, demo: false };
  } catch (err) {
    console.error("[createProduct] DB error:", err);
    if (String(err).includes("unique") || String(err).includes("duplicate")) {
      return { ok: false, error: "Товар с таким slug уже существует" };
    }
    return { ok: false, error: "Не удалось создать товар" };
  }
}

export async function updateProduct(
  id: number,
  input: ProductFormInput,
): Promise<
  | { ok: true; id: number; demo: boolean }
  | { ok: false; error: string; demo?: boolean }
> {
  const values = formInputToRow(input);
  const db = getDb();

  if (!db) {
    if (slugExists(values.slug, id)) {
      return { ok: false, error: "Товар с таким slug уже существует", demo: true };
    }
    const idx = demoStore.products.findIndex((p) => p.id === id);
    if (idx === -1) return { ok: false, error: "Товар не найден", demo: true };
    demoStore.products[idx] = { ...demoStore.products[idx], ...values };
    return { ok: true, id, demo: true };
  }

  try {
    await db
      .update(schema.products)
      .set(values)
      .where(eq(schema.products.id, id));
    return { ok: true, id, demo: false };
  } catch (err) {
    console.error("[updateProduct] DB error:", err);
    if (String(err).includes("unique") || String(err).includes("duplicate")) {
      return { ok: false, error: "Товар с таким slug уже существует" };
    }
    return { ok: false, error: "Не удалось сохранить товар" };
  }
}

export async function deleteProduct(
  id: number,
): Promise<{ ok: boolean; demo?: boolean; error?: string }> {
  const db = getDb();
  if (!db) {
    demoStore.products = demoStore.products.filter((p) => p.id !== id);
    return { ok: true, demo: true };
  }

  try {
    await db.delete(schema.products).where(eq(schema.products.id, id));
    return { ok: true };
  } catch (err) {
    console.error("[deleteProduct] DB error:", err);
    return { ok: false, error: "Не удалось удалить товар" };
  }
}
