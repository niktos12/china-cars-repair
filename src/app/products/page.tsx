import type { Metadata } from "next";

import { ProductsClient } from "./products-client";

export const metadata: Metadata = {
  title: "Продукция",
  description:
    "Каталог защиты бамперов Гранфорт: готовые комплекты для JAC T9 и Haval H3 из нержавеющей стали AISI 304 и чёрного металла с порошковым покрытием. Индивидуальное изготовление под другие модели.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ model?: string }>;
}) {
  const { model } = await searchParams;

  return (
    <div className="bg-coal">
      <div className="container-site py-14 md:py-16">
        <FadeInHeader />
        <ProductsClient initialModel={model ?? "all"} />
      </div>
    </div>
  );
}

function FadeInHeader() {
  return (
    <header className="max-w-3xl">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Каталог</p>
      <h1 className="mt-4 text-4xl font-bold uppercase tracking-tight sm:text-5xl">
        Продукция
      </h1>
      <p className="mt-5 text-sm leading-relaxed text-zinc-400 sm:text-base">
        Защита передних и задних бамперов из нержавеющей стали AISI 304 с
        зеркальной полировкой и из чёрного металла с порошковым покрытием.
        Сейчас разработаны готовые комплекты для двух моделей — JAC T9 и Haval
        H3. Ассортимент пополняется.
      </p>
    </header>
  );
}
