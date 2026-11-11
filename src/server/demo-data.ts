import type { NewProduct } from "./db/schema";

/**
 * Заглушки для макета (разрешено ТЗ).
 * Используются, когда DATABASE_URL не задан или БД недоступна,
 * а также для первичного наполнения БД (scripts/seed.ts).
 * Цены — примерные, заменить на реальные.
 */
export const DEMO_PRODUCTS: NewProduct[] = [
  {
    slug: "jac-t9-front-aisi304",
    title: "Защита переднего бампера JAC T9",
    carModel: "JAC T9",
    position: "Передний бампер",
    material: "Нержавеющая сталь AISI 304, зеркальная полировка",
    description:
      "Дуга защиты переднего бампера из нержавеющей стали с зеркальной полировкой. Установка без сверления кузова, в штатные посадочные места.",
    priceFrom: 14900,
    imageUrl: "/images/jac-t9.jpg",
  },
  {
    slug: "jac-t9-rear-aisi304",
    title: "Защита заднего бампера JAC T9",
    carModel: "JAC T9",
    position: "Задний бампер",
    material: "Нержавеющая сталь AISI 304, зеркальная полировка",
    description:
      "Защита заднего бампера из нержавеющей стали AISI 304. Усиленное крепление, не мешает открыванию борта.",
    priceFrom: 13900,
    imageUrl: "/images/jac-t9.jpg",
  },
  {
    slug: "jac-t9-full-kit",
    title: "Комплект защиты JAC T9 (перед + зад)",
    carModel: "JAC T9",
    position: "Комплект",
    material: "Нержавеющая сталь AISI 304, зеркальная полировка",
    description:
      "Полный комплект защиты переднего и заднего бамперов со скидкой относительно покупки по отдельности.",
    priceFrom: 26900,
    imageUrl: "/images/jac-t9.jpg",
  },
  {
    slug: "haval-h3-front-aisi304",
    title: "Защита переднего бампера Haval H3",
    carModel: "Haval H3",
    position: "Передний бампер",
    material: "Нержавеющая сталь AISI 304, зеркальная полировка",
    description:
      "Защита переднего бампера, разработанная под геометрию Haval H3. Монтаж без доработок кузова.",
    priceFrom: 15900,
    imageUrl: "/images/haval-h3.jpg",
  },
  {
    slug: "haval-h3-rear-powder",
    title: "Защита заднего бампера Haval H3",
    carModel: "Haval H3",
    position: "Задний бампер",
    material: "Чёрный металл, порошковое покрытие",
    description:
      "Защита заднего бампера из чёрного металла с порошковым покрытием — практичный вариант для активной эксплуатации.",
    priceFrom: 12900,
    imageUrl: "/images/haval-h3.jpg",
  },
  {
    slug: "haval-h3-full-kit",
    title: "Комплект защиты Haval H3 (перед + зад)",
    carModel: "Haval H3",
    position: "Комплект",
    material: "Нержавеющая сталь AISI 304 / чёрный металл",
    description:
      "Комплект защиты переднего и заднего бамперов. Можно собрать в любом сочетании материалов — уточняйте при заказе.",
    priceFrom: 27900,
    imageUrl: "/images/haval-h3.jpg",
  },
];
