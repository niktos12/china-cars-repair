import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

/**
 * Единая точка доступа к БД.
 *
 * Бэкенд "включается" только если задан DATABASE_URL:
 *  - локально и в песочнице переменной может не быть -> работает демо-режим;
 *  - на Railway переменная приходит от сервиса PostgreSQL -> реальная БД.
 */
export const isDbConfigured = /^postgres(ql)?:\/\//.test(
  process.env.DATABASE_URL ?? "",
);

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!isDbConfigured) return null;
  if (!_db) {
    // postgres.js сам умеет парсить строку подключения
    const client = postgres(process.env.DATABASE_URL!, {
      prepare: false, // важно для некоторых managed-провайдеров Postgres
    });
    _db = drizzle(client, { schema });
  }
  return _db;
}

export { schema };
