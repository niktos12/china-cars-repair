/**
 * Типы, которыми фронтенд и бэкенд "договорились" общаться.
 * Бэкенд отдаёт JSON ровно в этих формах (см. src/app/api/**),
 * фронтенд парсит их через SWR.
 */

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

export type ProductsResponse = {
  products: ProductDto[];
  /** true = БД не подключена, отдаются демо-данные */
  demo: boolean;
};

export type LeadActionResult = {
  ok: boolean;
  /** id созданной заявки (или null в демо-режиме) */
  id?: number | null;
  /** сообщение об ошибке для пользователя */
  error?: string;
  /** true = заявка не сохранена, т.к. БД не подключена (песочница/локально) */
  demo?: boolean;
};

export const CAR_MODELS = ["JAC T9", "Haval H3"] as const;
