import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { FadeIn } from "@/components/site/fade-in";
import { LeadForm } from "@/components/site/lead-form";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Свяжитесь с Гранфорт: телефон, почта, мессенджеры. Проконсультируем по защите бамперов, установке и доставке по всей России.",
};

const CONTACTS = [
  {
    icon: Phone,
    label: "Телефон",
    value: CONTACT_PHONE,
    href: `tel:${CONTACT_PHONE.replace(/[^+\d]/g, "")}`,
    note: "звонок или WhatsApp",
  },
  {
    icon: Mail,
    label: "Почта",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    note: "ответим в течение рабочего дня",
  },
  {
    icon: MessageCircle,
    label: "Telegram / VK",
    value: "@granfort_placeholder",
    href: "#",
    note: "мессенджеры — заглушка",
  },
  {
    icon: MapPin,
    label: "Производство",
    value: "г. Тольятти, ул. Промышленная, 1",
    href: null,
    note: "адрес указан для примера",
  },
  {
    icon: Clock,
    label: "Режим работы",
    value: "Пн–Пт: 9:00–18:00",
    href: null,
    note: "Сб–Вс — по договорённости",
  },
];

export default function ContactsPage() {
  return (
    <div className="bg-coal">
      {/* Шапка */}
      <section className="border-b border-white/10 py-14 md:py-16">
        <div className="container-site">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">
              Свяжитесь с нами
            </p>
            <h1 className="mt-4 text-4xl font-bold uppercase tracking-tight sm:text-5xl">
              Контакты
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Свяжитесь с нами любым удобным способом — проконсультируем по
              продукции, установке и доставке. Доставка возможна в любой регион
              России.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Контактная информация */}
          <div>
            <div className="grid gap-5 sm:grid-cols-2">
              {CONTACTS.map((c, i) => (
                <FadeIn key={c.label} delay={i * 0.06}>
                  <div className="h-full border border-white/10 bg-panel p-6">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <c.icon className="h-4 w-4 text-gold" aria-hidden="true" />
                      <span className="text-xs font-medium uppercase tracking-wider">
                        {c.label}
                      </span>
                    </div>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="mt-3 block break-all text-base font-bold transition-colors hover:text-gold"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <p className="mt-3 text-base font-bold">{c.value}</p>
                    )}
                    <p className="mt-1.5 text-xs text-zinc-500">{c.note}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.2}>
              <div className="mt-6 border border-gold/30 bg-gold/5 p-6">
                <h2 className="text-lg font-bold text-gold">
                  Установка под ключ
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                  Комплект защиты можно приобрести отдельно или сразу заказать
                  установку — без сверления и доработок кузова. Подробности
                  уточняйте у менеджера.
                </p>
              </div>
            </FadeIn>
          </div>

          {/* Форма */}
          <FadeIn delay={0.15}>
            <div className="border border-white/10 bg-panel p-7 md:p-9">
              <LeadForm
                source="contacts"
                variant="dark"
                title="Написать нам"
                description="Оставьте номер — перезвоним и ответим на вопросы."
              />
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
