import Link from "next/link";
import { Mail, Phone } from "lucide-react";

import { Logo } from "@/components/site/logo";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/validation";

const FOOTER_LINKS = [
  { href: "/products", label: "Продукция" },
  { href: "/about", label: "О компании" },
  { href: "/advantages", label: "Преимущества" },
  { href: "/custom", label: "На заказ" },
  { href: "/contacts", label: "Контакты" },
];

/* --- Иконки соцсетей (VK и Telegram отсутствуют в lucide — рисуем сами) --- */

function VkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.16 17.86c-5.61 0-8.81-3.85-8.95-10.28h2.81c.1 4.71 2.17 6.71 3.81 7.12V7.58h2.65v4.07c1.62-.17 3.32-2.02 3.9-4.07h2.64c-.43 2.53-2.27 4.38-3.57 5.14 1.3.61 3.41 2.23 4.2 5.14h-2.9c-.63-1.97-2.2-3.5-4.27-3.7v3.7h-.32Z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.9 4.6 18.9 19c-.23 1.02-.83 1.27-1.68.79l-4.65-3.43-2.24 2.16c-.25.25-.46.46-.94.46l.33-4.73L18.4 6.5c.38-.33-.08-.52-.58-.19L6.99 13.02 2.4 11.6c-1-.31-1.02-1 .21-1.48l16.1-6.2c.83-.31 1.56.19 1.29 1.28Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const SOCIALS = [
  { label: "VK", href: "#", Icon: VkIcon },
  { label: "Telegram", href: "#", Icon: TelegramIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-coal text-zinc-300">
      <div className="container-site grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr] md:py-16">
        {/* Бренд */}
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-zinc-400">
            Безопасный и улучшенный автомобильный тюнинг
            <br />
            в г. Тольятти
          </p>
          <div className="mt-5 space-y-2 text-sm">
            <a
              href={`tel:${CONTACT_PHONE.replace(/[^+\d]/g, "")}`}
              className="flex items-center gap-2 transition-colors hover:text-gold"
            >
              <Phone className="h-4 w-4 text-gold" aria-hidden="true" />
              {CONTACT_PHONE}
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-2 transition-colors hover:text-gold"
            >
              <Mail className="h-4 w-4 text-gold" aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        {/* Меню */}
        <nav aria-label="Навигация в подвале">
          <p className="text-lg font-semibold text-foreground">Меню</p>
          <ul className="mt-4 space-y-2.5">
            {FOOTER_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-zinc-400 transition-colors hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Соцсети */}
        <div>
          <p className="text-lg font-semibold text-foreground">Мы в соцсетях</p>
          <p className="mt-4 text-sm text-zinc-400">Будем с нами на связи</p>
          <div className="mt-3 flex gap-3">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                title={`${label} — ссылка-заглушка`}
                className="flex h-11 w-11 items-center justify-center bg-paper text-coal transition-colors hover:bg-gold"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
          <Link
            href="/admin"
            className="mt-6 inline-block text-xs text-zinc-600 underline-offset-2 transition-colors hover:text-gold hover:underline"
          >
            Вход для сотрудников
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-1.5 py-5 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} TUNING/304. Все права защищены.
          </span>
          <span>
            Название бренда, контакты и цены — заглушки, финальные данные
            согласуются.
          </span>
        </div>
      </div>
    </footer>
  );
}
