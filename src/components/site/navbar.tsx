"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, Phone, X } from "lucide-react";

import { Logo } from "@/components/site/logo";
import { lockPageScroll, unlockPageScroll } from "@/lib/page-scroll";
import { CONTACT_PHONE } from "@/lib/validation";

/* Пункты меню */
const NAV_LINKS = [
  { href: "/products", label: "Продукция" },
  { href: "/about", label: "О производстве" },
  { href: "/custom", label: "На заказ" },
  { href: "/contacts", label: "Контакты" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  /*
   * Пока меню открыто: блокируем прокрутку страницы (Lenis stop) и
   * компенсируем пропавший скроллбар, чтобы контент не «прыгал» вбок.
   * Esc и переход на десктопную ширину закрывают меню.
   */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const lg = window.matchMedia("(min-width: 1024px)");
    const onBreakpoint = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    lg.addEventListener("change", onBreakpoint);
    const locked = lockPageScroll();

    const gap = window.innerWidth - document.documentElement.clientWidth;
    if (locked && gap > 0) document.body.style.paddingRight = `${gap}px`;

    return () => {
      window.removeEventListener("keydown", onKey);
      lg.removeEventListener("change", onBreakpoint);
      unlockPageScroll();
      document.body.style.paddingRight = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-coal/95 text-foreground backdrop-blur supports-[backdrop-filter]:bg-coal/85">
        <div className="container-site flex h-20 items-center justify-between gap-4">
          <Logo />

          {/* Десктоп-навигация */}
          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Основная навигация"
          >
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors hover:text-gold ${
                    active ? "text-gold" : "text-zinc-200"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/contacts" className="btn-outline-gold hidden !py-2.5 md:inline-flex">
              Обсудить проект
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            {/* Мобильный бургер */}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center border border-white/15 text-foreground transition-colors hover:border-gold hover:text-gold lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/*
        Мобильное меню — fixed-оверлей вне потока документа:
        открывается поверх контента и не сдвигает страницу.
        Панель ниже шапки (h-20 = 80px), затемнение — под шапкой (z-40 < z-50),
        поэтому крестик и логотип остаются кликабельными.
      */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/70 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
        {open && (
          <motion.nav
            key="panel"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 top-20 z-40 max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain border-t border-white/10 bg-coal lg:hidden"
            aria-label="Мобильная навигация"
            data-lenis-prevent
          >
            <div className="container-site flex flex-col gap-1 py-4 pb-8">
              {NAV_LINKS.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block px-3 py-3 text-sm transition-colors ${
                      active
                        ? "border-l-2 border-gold bg-white/5 text-gold"
                        : "text-zinc-200 hover:bg-white/5 hover:text-gold"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/contacts"
                onClick={() => setOpen(false)}
                className="btn-outline-gold mt-2"
              >
                Обсудить проект
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={`tel:${CONTACT_PHONE.replace(/[^+\d]/g, "")}`}
                className="mt-2 flex items-center justify-center gap-2 px-3 py-3 text-sm text-zinc-300"
              >
                <Phone className="h-4 w-4 text-gold" aria-hidden="true" />
                {CONTACT_PHONE}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
