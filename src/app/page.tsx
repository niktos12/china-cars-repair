import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Earth, Globe, PackageCheck, SquarePen, ShieldCheck, Truck, Wrench } from "lucide-react";

import { FadeIn } from "@/components/site/fade-in";
import { LeadForm } from "@/components/site/lead-form";
import { ADVANTAGES } from "@/lib/site-data";

/* Преимущества — иконки берутся из site-data, но на главной нужны
   «золотые квадраты» из референса: отдельная карта иконок. */
const HOME_ICONS = [ShieldCheck, Wrench, PackageCheck, SquarePen, Truck, Earth];

const CUSTOM_STEPS = [
  { num: "01", title: "Заявка и обсуждение" },
  { num: "02", title: "Замеры и проектирование" },
  { num: "03", title: "Производство и установка" },
];

const MODELS = [
  {
    name: "JAC T9",
    subtitle: "Передняя и задняя защита | AISI 304",
    image: "/images/jac-t9.png",
    href: "/products?model=JAC+T9",
  },
  {
    name: "HAVAL H3",
    subtitle: "Передняя и задняя защита | AISI 304",
    image: "/images/haval-h3.jpg",
    href: "/products?model=Haval+H3",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ================= HERO ================= */}
      <section className="relative min-h-screen overflow-hidden bg-coal text-foreground">
        {/* Фон: автомобиль в тёмной студии */}
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/images/hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Плавный переход фото в тёмный фон на десктопе */}
          <div className="absolute inset-0 bg-gradient-to-r from-coal via-coal/40 to-transparent" />
          {/* Градиент только для мобильных: текст читается поверх машины */}
          <div className="absolute inset-0 bg-coal/55 lg:hidden" />
        </div>

        <div className="container-site relative flex min-h-screen flex-col justify-center py-24">
          <FadeIn>
            <h1 className="max-w-3xl text-5xl font-tight uppercase leading-[1.25] tracking-tight sm:text-6xl lg:text-7xl">
              Защита
              <br />
              которая
              <br />
              <span className="text-gold">держит</span>
              <br />
              форму
            </h1>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-zinc-300 sm:text-base">
              Силовые элементы для китайских внедорожников и пикапов. Точная
              посадка, надёжный металл и установка без вмешательства в кузов.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} className="mt-9 flex flex-wrap gap-4">
            <Link href="/contacts" className="btn-outline-gold">
              Обсудить проект
            </Link>
            <Link href="/custom" className="btn-outline-gold">
              Заказать разработку
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ================= ФИЛОСОФИЯ БРЕНДА ================= */}
      <section className="bg-coal py-20 md:py-28">
        <div className="container-site grid items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <FadeIn>
              <h1 className="text-3xl font-tight uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Создано для тех,
                <br />
                кто выбирает <span className="text-gold">свой путь</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.1}>
              <blockquote className="mt-8 border-l-2 border-gold pl-5 text-sm font-tight uppercase leading-relaxed text-zinc-100 sm:text-base">
                Защита должна не только принимать удар, она должна{" "}
                <span className="text-gold">точно вставать</span>, органично
                выглядеть и служить годами.
              </blockquote>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-zinc-400">
                Мы развиваем специализированные решения для китайских
                внедорожников и пикапов — автомобилей, которые всё чаще
                выбирают для работы, путешествий и бездорожья. Каждый элемент —
                это баланс инженерной точности, надёжного материала и
                выразительного внешнего вида.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <Link href="/products" className="btn-outline-gold mt-9">
                Посмотреть работы
              </Link>
            </FadeIn>
          </div>

          <FadeIn delay={0.15}>
            <div className="relative aspect-[4/3] overflow-hidden lg:aspect-[4/5]">
              <Image
                src="/images/philosophy.jpg"
                alt="Пикап с силовым бампером из нержавеющей стали"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ================= МОДЕЛИ (светлая секция) ================= */}
      <section className="panel-paper py-20 md:py-24">
        <div className="container-site">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <FadeIn>
              <h2 className="text-3xl font-tight uppercase leading-tight tracking-tight text-coal sm:text-4xl">
                Создано под
                <br />
                ваш автомобиль
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="max-w-md text-sm leading-relaxed text-zinc-600 lg:ml-auto">
                Не универсальный аксессуар, а выверенная конструкция под
                геометрию конкретной модели. Всё необходимое для установки уже
                в комплекте.
              </p>
            </FadeIn>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-[1.45fr_1fr]">
            {MODELS.map((m, i) => (
              <FadeIn key={m.name} delay={i * 0.12}>
                <Link
                  href={m.href}
                  className="group relative block min-h-[340px] overflow-hidden bg-coal sm:min-h-[440px] lg:min-h-[520px]"
                >
                  <Image
                    src={m.image}
                    alt={`${m.name} — защита переднего и заднего бампера`}
                    fill
                    sizes="(min-width: 768px) 58vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                    <p className="text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
                      {m.name}
                    </p>
                    <p className="mt-2 text-sm text-zinc-200 sm:text-base">
                      {m.subtitle}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ПРЕИМУЩЕСТВА ================= */}
      <section className="bg-coal py-20 md:py-24">
        <div className="container-site">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Наши преимущества
            </h2>
            <p className="mt-4 text-lg font-bold text-zinc-100">
              Почему выбирают нас?
            </p>
          </FadeIn>

          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {ADVANTAGES.map((a, i) => {
              const Icon = HOME_ICONS[i] ?? a.icon;
              return (
                <FadeIn key={a.title} delay={Math.min(i * 0.08, 0.3)}>
                  <div className="flex items-start gap-5">
                    <span
                      className="flex h-16 w-16 shrink-0 items-center justify-center bg-gold text-white sm:h-35 sm:w-35"
                      aria-hidden="true"
                    >
                      <Icon className="h-7 w-7 sm:h-25 sm:w-25" strokeWidth={1.8} />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold leading-snug text-foreground sm:text-xl">
                        {a.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                        {a.description}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn delay={0.2}>
            <Link href="/advantages" className="btn-ghost-gold mt-12">
              Подробнее о преимуществах
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ================= ИНДИВИДУАЛЬНАЯ РАЗРАБОТКА (h-screen) ================= */}
      <section className="bg-coal">
        <div className="container-site grid min-h-screen items-center gap-10 py-16 sm:py-20 lg:h-screen lg:grid-cols-[6fr_5fr] lg:gap-14">
          {/* Фото на всю высоту блока */}
          <FadeIn className="h-full self-center">
            <div className="relative h-72 overflow-hidden sm:h-96 lg:h-[80vh] lg:max-h-[720px] min-md:mt-40">
              <Image
                src="/images/custom.png"
                alt="Индивидуальная разработка защиты — стальное колесо крупным планом"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>

          <div className="self-center flex flex-col">
            <FadeIn>
              <h2 className="text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
                Разработаем защиту под ваш автомобиль
              </h2>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="mt-6 max-w-xl text-base font-bold leading-relaxed text-zinc-100 sm:text-lg">
                Изучим конструкцию, спроектируем крепление и изготовим
                комплект для модели, которой пока нет в нашем каталоге
              </p>
            </FadeIn>

            <div className="mt-10">
              {CUSTOM_STEPS.map((s, i) => (
                <FadeIn key={s.num} delay={0.15 + i * 0.08}>
                  <div className="flex items-center gap-6 border-t border-gold/40 py-5 sm:gap-8 sm:py-6">
                    <span className="text-4xl font-bold text-gold sm:text-5xl">
                      {s.num}
                    </span>
                    <span className="text-xl text-zinc-100 sm:text-2xl">
                      {s.title}
                    </span>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.4}>
              <Link href="/custom" className="btn-outline-gold mt-8">
                Перейти к заявке
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ================= ФОРМА (светлая секция) ================= */}
      <section className="panel-paper py-20 md:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <FadeIn>
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-coal sm:text-4xl">
                Подберём защиту под ваш автомобиль
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-6 max-w-md text-base font-bold leading-relaxed text-coal">
                Оставьте контакты, и мы уточним модель, вариант использования и
                ответим на вопросы.
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.15}>
            <LeadForm
              source="home"
              variant="light"
              defaultCarModel=""
            />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
