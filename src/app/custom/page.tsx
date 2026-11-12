import type { Metadata } from "next";
import Image from "next/image";

import { FadeIn } from "@/components/site/fade-in";
import { LeadForm } from "@/components/site/lead-form";

export const metadata: Metadata = {
  title: "На заказ",
  description:
    "Разработаем защиту под ваш автомобиль: заявка и обсуждение, замеры и проектирование, производство и установка. Индивидуальное изготовление защиты бамперов для моделей, которых нет в каталоге Гранфорт.",
};

/* Три этапа — как в референсе. Под каждым — подробности. */
const STEPS = [
  {
    num: "01",
    title: "Заявка и обсуждение",
    details:
      "Вы оставляете заявку с моделью автомобиля и пожеланиями. Обсуждаем задачу, согласовываем материал (AISI 304 или чёрный металл с порошковым покрытием), конструкцию и стоимость.",
  },
  {
    num: "02",
    title: "Замеры и проектирование",
    details:
      "Делаем замеры и готовим чертёж защиты под геометрию конкретного автомобиля: монтажные точки, вылеты, зоны прилегания.",
  },
  {
    num: "03",
    title: "Производство и установка",
    details:
      "Изготавливаем комплект с контролем качества на каждом этапе. Устанавливаем под ключ или отправляем транспортной компанией в любой регион России.",
  },
];

export default function CustomPage() {
  return (
    <div className="bg-coal">
      {/* Шапка + изображение */}
      <section className="border-b border-white/10 py-14 md:py-16">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <FadeIn>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">
                Индивидуальное изготовление
              </p>
              <h1 className="mt-4 text-4xl font-bold uppercase leading-tight tracking-tight sm:text-5xl">
                Разработаем защиту под ваш автомобиль
              </h1>
              <p className="mt-6 max-w-xl text-sm font-bold leading-relaxed text-zinc-200 sm:text-base">
                Изучим конструкцию, спроектируем крепление и изготовим комплект
                для модели, которой пока нет в нашем каталоге.
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={0.15}>
            <div className="relative aspect-[4/3] overflow-hidden border border-white/10">
              <Image
                src="/images/custom.jpg"
                alt="Стальное изделие крупным планом — индивидуальная разработка"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Этапы + форма */}
      <section className="py-16 md:py-20">
        <div className="container-site grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <FadeIn>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Как это работает
              </h2>
            </FadeIn>

            <div className="mt-8">
              {STEPS.map((s, i) => (
                <FadeIn key={s.num} delay={i * 0.1}>
                  <div className="border-t border-gold/30 py-7">
                    <div className="flex items-center gap-6">
                      <span className="text-3xl font-bold text-gold">
                        {s.num}
                      </span>
                      <span className="text-lg font-bold text-foreground">
                        {s.title}
                      </span>
                    </div>
                    <p className="mt-3 max-w-xl pl-[3.25rem] text-sm leading-relaxed text-zinc-400">
                      {s.details}
                    </p>
                  </div>
                </FadeIn>
              ))}
              <div className="border-t border-gold/30" />
            </div>
          </div>

          <FadeIn delay={0.15}>
            <div className="border border-white/10 bg-panel p-7 md:p-9 lg:sticky lg:top-28">
              <LeadForm
                source="custom"
                variant="dark"
                title="Запрос на разработку"
                description="Расскажите про автомобиль и задачу — оценим возможность изготовления и сроки."
              />
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
