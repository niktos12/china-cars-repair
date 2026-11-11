/**
 * Типы, которыми фронтенд и бэкенд "договорились" общаться.
 * Бэкенд (отдельный репозиторий, Express) отдаёт JSON ровно в этих формах,
 * фронтенд читает их через SWR / fetch. Собственного бэкенда у фронта нет.
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
  /** Путь к фото (/images/...) или внешний URL. null = заглушка с иконкой */
  imageUrl: string | null;
};

/** GET /api/products — публичный каталог */
export type ProductsResponse = {
  products: ProductDto[];
  /** true = бэкенд запущен без БД, отдаются демо-позиции */
  demo: boolean;
};

/** GET /api/products/:slug */
export type ProductPageResponse = {
  product: ProductDto;
  demo: boolean;
};

/** Заявка (GET /api/admin/leads); createdAt приходит строкой ISO */
export type LeadDto = {
  id: number;
  name: string;
  phone: string;
  carModel: string | null;
  message: string | null;
  source: string;
  createdAt: string;
};

/** Товар в админке (GET/POST/PUT /api/admin/products) — полная строка БД */
export type AdminProduct = ProductDto & {
  isActive: boolean;
  createdAt: string;
};

export type AdminProductsResponse = {
  products: AdminProduct[];
  demo: boolean;
};

export type AdminLeadsResponse = {
  leads: LeadDto[];
  demo: boolean;
};

/** POST /api/admin/login */
export type AdminLoginResponse = {
  ok: true;
  token: string;
  expiresIn: string;
};

/** Тело запроса POST/PUT /api/admin/products (админ-форма) */
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
  /** id созданной заявки (или null в демо-режиме бэкенда) */
  id?: number | null;
  /** true = бэкенд работает без БД, заявка сохранена только в лог */
  demo?: boolean;
};

export const CAR_MODELS = ["JAC T9", "Haval H3"] as const;
