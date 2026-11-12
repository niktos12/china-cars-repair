import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Car } from "lucide-react";

import type { ProductDto } from "@/lib/types";

function formatPrice(priceFrom: number | null) {
  if (priceFrom == null) return "Цена по запросу";
  return `от ${new Intl.NumberFormat("ru-RU").format(priceFrom)} ₽`;
}

/** Карточка товара каталога. Вся карточка — ссылка на страницу товара. */
export function ProductCard({ product }: { product: ProductDto }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden border border-white/10 bg-panel transition-colors duration-200 hover:border-gold/60"
    >
      {/* Фото товара (или заглушка, пока imageUrl не задан) */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#2a2a2a] via-[#242424] to-[#1f1f1f]">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-500">
            <Car className="h-10 w-10" aria-hidden="true" />
            <span className="text-xs uppercase tracking-widest">
              {product.carModel}
            </span>
          </div>
        )}
        <span className="absolute left-3 top-3 bg-gold px-2.5 py-1 text-[11px] font-semibold text-coal">
          {product.carModel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs uppercase tracking-wider text-gold">
          {product.position}
        </p>
        <h3 className="mt-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-gold">
          {product.title}
        </h3>
        <p className="mt-1.5 text-xs text-zinc-500">{product.material}</p>

        <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-lg font-bold text-gold">
            {formatPrice(product.priceFrom)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors group-hover:text-gold">
            Подробнее
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
