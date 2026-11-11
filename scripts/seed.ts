/**
 * Первичное наполнение БД демо-товарами (заглушки из ТЗ).
 *
 * Запуск локально против БД Railway:
 *   DATABASE_URL="postgresql://..." npm run db:seed
 *
 * Повторный запуск безопасен: существующие slug-ы не дублируются.
 */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { DEMO_PRODUCTS } from "../src/server/demo-data";
import * as schema from "../src/server/db/schema";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL не задан. Пример:");
    console.error('  DATABASE_URL="postgresql://user:pass@host:5432/db" npm run db:seed');
    process.exit(1);
  }

  const client = postgres(url, { prepare: false });
  const db = drizzle(client, { schema });

  const inserted = await db
    .insert(schema.products)
    .values(DEMO_PRODUCTS)
    .onConflictDoNothing({ target: schema.products.slug })
    .returning({ slug: schema.products.slug });

  console.log(`Готово. Новых товаров добавлено: ${inserted.length}`);
  inserted.forEach((p) => console.log(`  + ${p.slug}`));

  await client.end();
}

main().catch((err) => {
  console.error("Ошибка наполнения БД:", err);
  process.exit(1);
});
