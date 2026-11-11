import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FadeIn } from "@/components/site/fade-in";
import { MATERIALS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "О компании",
  description:
    "TUNING/304 — производство защиты передних и задних бамперов для китайских внедорожников и пикапов. Нержавеющая сталь AISI 304 и чёрный металл с порошковым покрытием, установка без сверления, доставка по всей России.",
};

const FACTS = [
  { value: "AISI 304", label: "нержавеющая сталь с зеркальной полировкой" },
  { value: "2 модели", label: "готовые комплекты: JAC T9 и Haval H3" },
  { value: "0 сверлений", label: "установка без доработок кузова" },
  { value: "Вся Россия", label: "доставка в любой регион" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Шапка страницы */}
      <section className="border-b border-white/10 bg-coal py-16 md:py-20">
        <div className="container-site">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">
              TUNING/304
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold uppercase leading-tight tracking-tight sm:text-5xl">
              Создано для тех, кто выбирает{" "}
              <span className="text-gold">свой путь</span>
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Кто мы */}
      <section className="bg-coal py-16 md:py-20">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <FadeIn>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                О компании
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-zinc-300 sm:text-base">
                Мы занимаемся производством элементов автомобильного тюнинга.
                Основной продукт — защита передних и задних бамперов из
                нержавеющей стали AISI 304 с зеркальной полировкой, а также из
                чёрного металла с порошковым покрытием.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                Основное направление — тюнинг китайских внедорожников и
                пикапов. Ассортимент специализированных решений для китайских
                автомобилей пока относительно невелик, поэтому мы развиваем это
                направление и постепенно расширяем ассортимент продукции.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                Каждая защита проектируется под конкретную геометрию бампера,
                монтажные точки и предполагаемые условия эксплуатации: она
                должна точно вставать, органично выглядеть и служить годами.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/products" className="btn-outline-gold">
                  Посмотреть работы
                </Link>
                <Link href="/contacts" className="btn-outline-gold">
                  Обсудить проект
                </Link>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.15}>
            <div className="relative aspect-[4/3] overflow-hidden border border-white/10">
              <Image
                src="/images/philosophy.jpg"
                alt="Пикап с защитой переднего бампера из нержавеющей стали"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Факты — светлая полоса */}
      <section className="panel-paper py-12">
        <div className="container-site grid grid-cols-2 gap-8 md:grid-cols-4">
          {FACTS.map((f, i) => (
            <FadeIn key={f.value} delay={i * 0.08}>
              <p className="text-2xl font-bold text-coal sm:text-3xl">
                {f.value}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 sm:text-sm">
                {f.label}
              </p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Материалы */}
      <section className="bg-coal py-16 md:py-20">
        <div className="container-site">
          <FadeIn>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Материалы
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              Работаем с двумя основными материалами — под задачи и бюджет
              клиента.
            </p>
          </FadeIn>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {MATERIALS.map((m, i) => (
              <FadeIn key={m.title} delay={i * 0.1}>
                <div className="h-full border border-white/10 bg-panel p-7">
                  <h3 className="text-lg font-bold text-gold">{m.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                    {m.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.2}>
            <Link href="/advantages" className="btn-ghost-gold mt-10">
              Все преимущества
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
