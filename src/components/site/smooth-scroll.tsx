"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { bindPageScroll } from "@/lib/page-scroll";

/**
 * Плавный скролл страницы (Lenis) + плавный переход по якорям (#order и т.п.).
 * Уважает prefers-reduced-motion: в этом режиме просто не включается.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.12 });
    bindPageScroll(lenis);
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!link) return;
      const id = link.getAttribute("href")?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -96 });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      bindPageScroll(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
