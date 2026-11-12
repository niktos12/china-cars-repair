import type { Metadata } from "next";
import { Comfortaa, Inter } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { Toaster } from "@/components/ui/sonner";

/*
 * Comfortaa — округлый геометрический гротеск с полной кириллицей,
 * максимально близкий к шрифту референс-макета.
 * Inter — резервный шрифт для мелких текстов админки и форм.
 */
const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin", "cyrillic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default:
      "Гранфорт — защита бамперов из нержавеющей стали для JAC T9 и Haval H3",
    template: "%s — Гранфорт",
  },
  description:
    "Защита, которая держит форму. Производство защиты передних и задних бамперов из нержавеющей стали AISI 304 и чёрного металла с порошковым покрытием для китайских внедорожников и пикапов. Готовые комплекты для JAC T9 и Haval H3, индивидуальное изготовление, установка без сверления кузова, доставка по всей России.",
  keywords: [
    "защита бампера",
    "тюнинг китайских автомобилей",
    "Гранфорт",
    "JAC T9",
    "Haval H3",
    "нержавеющая сталь AISI 304",
    "защита переднего бампера",
    "защита заднего бампера",
    "силовой бампер",
    "тюнинг внедорожников",
    "тюнинг пикапов",
  ],
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "Гранфорт — защита, которая держит форму",
    description:
      "Силовые элементы для китайских внедорожников и пикапов из нержавеющей стали AISI 304. Готовые комплекты для JAC T9 и Haval H3, индивидуальное изготовление под другие модели.",
    siteName: "Гранфорт",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${comfortaa.variable} ${inter.variable} flex min-h-screen flex-col bg-coal font-sans text-foreground antialiased`}
      >
        <SmoothScroll />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
