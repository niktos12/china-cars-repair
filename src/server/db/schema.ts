import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Каталог продукции.
 * Пока сайт-визитка без корзины — товары хранятся просто,
 * фильтр по модели авто делается на фронте.
 */
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  /** Модель автомобиля, например "JAC T9", "Haval H3" */
  carModel: varchar("car_model", { length: 120 }).notNull(),
  /** "Передний бампер" | "Задний бампер" | "Комплект" */
  position: varchar("position", { length: 80 }).notNull(),
  /** Материал изготовления, например "Нержавеющая сталь AISI 304" */
  material: varchar("material", { length: 160 }).notNull(),
  description: text("description").notNull(),
  /** Базовая цена "от", в рублях. null = цена по запросу */
  priceFrom: integer("price_from"),
  /** Фото товара: путь в /public ("/images/...") или внешний URL. null = заглушка */
  imageUrl: text("image_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Заявки с сайта (форма на страницах "Контакты" и "Индивидуальное изготовление").
 */
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  /** Какой автомобиль интересует (опционально) */
  carModel: varchar("car_model", { length: 120 }),
  message: text("message"),
  /** Откуда пришла заявка: "contacts" | "custom" | ... */
  source: varchar("source", { length: 60 }).notNull().default("website"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
