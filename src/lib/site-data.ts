import {
  Globe,
  PackageCheck,
  PenLine,
  ShieldCheck,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/** Преимущества из ТЗ — используются на главной и на странице "Преимущества". */
export type Advantage = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const ADVANTAGES: Advantage[] = [
  {
    icon: ShieldCheck,
    title: "Качество и материалы",
    description: "Качественные материалы и внимание к деталям производства.",
  },
  {
    icon: Wrench,
    title: "Установка без сверления",
    description: "Установка без сверления и доработки кузова автомобиля.",
  },
  {
    icon: PackageCheck,
    title: "Комплекс или «под ключ»",
    description:
      "Возможность приобрести комплект отдельно или заказать установку под ключ.",
  },
  {
    icon: PenLine,
    title: "Индивидуальная разработка",
    description: "Индивидуальная разработка под другие модели автомобилей.",
  },
  {
    icon: Truck,
    title: "Доставка по всей России",
    description: "Возможность доставки продукции по всей России.",
  },
  {
    icon: Globe,
    title: "Специализация",
    description: "Специализация на китайском автопроме.",
  },
];

/** Материалы, о которых рассказывается на странице "Преимущества". */
export const MATERIALS = [
  {
    title: "Нержавеющая сталь AISI 304",
    description:
      "Зеркальная полировка, устойчивость к коррозии, реагентам и зимней эксплуатации. Сохраняет внешний вид годами.",
  },
  {
    title: "Чёрный металл с порошковым покрытием",
    description:
      "Практичный и недорогой вариант: прочная сталь, а порошковое покрытие защищает от сколов и ржавчины.",
  },
];
