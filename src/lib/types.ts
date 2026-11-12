/**
 * Типы ответов бэкенда (Express) — фронтенд читает их через SWR / fetch.
 */

/** Публичный товар (GET /api/products, GET /api/products/:slug) */
export type ProductDto = {
  id: number;
  slug: string;
  title: string;
  carModel: string;
  position: string;
  material: string;
  description: string;
  priceFrom: number | null;
  /** Путь к фото (/images/...) или внешний URL. null = заглушка */
  imageUrl: string | null;
};

export type ProductsResponse = {
  products: ProductDto[];
};

export type ProductPageResponse = {
  product: ProductDto;
};

/** Заявка; createdAt приходит строкой ISO */
export type LeadDto = {
  id: number;
  name: string;
  phone: string;
  carModel: string | null;
  message: string | null;
  source: string;
  createdAt: string;
};

/** Товар в админке — полная строка БД */
export type AdminProduct = ProductDto & {
  isActive: boolean;
  createdAt: string;
};

export type AdminProductsResponse = {
  products: AdminProduct[];
};

export type AdminLeadsResponse = {
  leads: LeadDto[];
};

/** POST /api/admin/login */
export type AdminLoginResponse = {
  ok: true;
  token: string;
  expiresIn: string;
};

/** Тело запроса POST/PUT /api/admin/products */
export type ProductSavePayload = {
  slug: string;
  title: string;
  carModel: string;
  position: string;
  material: string;
  description: string;
  priceFrom: number | null;
  imageUrl: string | null;
  isActive: boolean;
};

export type LeadActionResult = {
  ok: boolean;
  id?: number | null;
};

export type { LeadInput } from "./validation";

export const CAR_MODELS = ["JAC T9", "Haval H3"] as const;
