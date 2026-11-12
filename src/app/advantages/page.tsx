import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FadeIn } from "@/components/site/fade-in";
import { ADVANTAGES, MATERIALS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Преимущества",
  description:
    "Почему выбирают Гранфорт: качественные материалы, установка без сверления кузова, комплект под ключ, индивидуальная разработка, доставка по всей России, специализация на китайском автопроме.",
};

export default function AdvantagesPage() {
  return (
    <div className="bg-coal">
      {/* Шапка */}
      <section className="border-b border-white/10 py-14 md:py-16">
        <div className="container-site">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">
              Почему выбирают нас?
            </p>
            <h1 className="mt-4 text-4xl font-bold uppercase tracking-tight sm:text-5xl">
              Наши преимущества
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Мы производим защиту бамперов с вниманием к материалам и деталям —
              и рассчитываем на долгую службу каждого комплекта.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Сетка преимуществ — «золотые квадраты» как на главной */}
      <section className="py-16 md:py-20">
        <div className="container-site grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map((a, i) => (
            <FadeIn key={a.title} delay={Math.min(i * 0.07, 0.3)}>
              <div className="flex items-start gap-5">
                <span
                  className="flex h-20 w-20 shrink-0 items-center justify-center bg-gold text-coal"
                  aria-hidden="true"
                >
                  <a.icon className="h-9 w-9" strokeWidth={1.8} />
                </span>
                <div>
                  <h2 className="text-lg font-bold leading-snug">{a.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {a.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Материалы */}
      <section className="border-t border-white/10 bg-coal-light py-16 md:py-20">
        <div className="container-site">
          <FadeIn>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Материалы
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              Два основных варианта исполнения — под задачи и бюджет клиента.
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
        </div>
      </section>

      {/* Кому подходит */}
      <section className="panel-paper py-16 md:py-20">
        <div className="container-site flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <FadeIn>
              <h2 className="text-2xl font-bold uppercase tracking-tight text-coal sm:text-3xl">
                Для кого наша продукция
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-zinc-700 sm:text-base">
                Преимущественно мужчины 30–60 лет, владельцы внедорожников и
                пикапов, в особенности китайских марок. Среди наших покупателей
                — люди, интересующиеся автомобильным тюнингом, охотой,
                рыбалкой, внедорожными поездками и активным отдыхом.
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={0.15} className="shrink-0">
            <Link href="/products" className="btn-solid-dark">
              Посмотреть каталог
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
