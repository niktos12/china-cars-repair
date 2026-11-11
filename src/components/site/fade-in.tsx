"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Обёртка framer-motion: плавное появление блока при прокрутке.
 * Используется по всему сайту для "живого" интерфейса.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  /** задержка в секундах — для каскадного появления карточек */
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
