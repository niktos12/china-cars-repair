import type { Lead, Product } from "@/server/db/schema";
import { DEMO_PRODUCTS } from "@/server/demo-data";

/**
 * In-memory стор для режима без БД (песочница/локальный запуск).
 * Благодаря ему админка полностью интерактивна в превью: товары можно
 * создавать/редактировать/удалять, заявки — смотреть/удалять.
 * На Railway (DATABASE_URL задан) стор не используется — всё идёт в Postgres.
 * Данные живут в памяти процесса: перезапуск сервера их сбрасывает.
 */
type DemoStore = {
  products: Product[];
  leads: Lead[];
  nextProductId: number;
  nextLeadId: number;
};

function createStore(): DemoStore {
  return {
    products: DEMO_PRODUCTS.map((p, i) => ({
      id: i + 1,
      slug: p.slug,
      title: p.title,
      carModel: p.carModel,
      position: p.position,
      material: p.material,
      description: p.description,
      priceFrom: p.priceFrom ?? null,
      imageUrl: p.imageUrl ?? null,
      isActive: true,
      createdAt: new Date(),
    })),
    leads: [],
    nextProductId: DEMO_PRODUCTS.length + 1,
    nextLeadId: 1,
  };
}

const g = globalThis as unknown as { __demoStore?: DemoStore };
export const demoStore: DemoStore = (g.__demoStore ??= createStore());

export function slugExists(slug: string, excludeId?: number): boolean {
  return demoStore.products.some(
    (p) => p.slug === slug && p.id !== excludeId,
  );
}
