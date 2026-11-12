import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  CheckCircle2,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { FadeIn } from "@/components/site/fade-in";
import { LeadForm } from "@/components/site/lead-form";
import { ProductCard } from "@/components/site/product-card";
import {
  fetchProductBySlug,
  fetchProducts,
  fetchRelatedProducts,
} from "@/lib/api";
import type { ProductDto } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

/* Товар редактируется в админке — рендерим на каждый запрос, без кэша */
export const dynamic = "force-dynamic";

async function loadPageData(slug: string) {
  const page = await fetchProductBySlug(slug);
  if (!page) return null;

  let related: ProductDto[] = [];
  try {
    related = await fetchRelatedProducts(page.product.carModel, page.product.slug);
  } catch (err) {
    // Похожие не критичны: страница товара должна открыться и без них
    console.error("[products/[slug]] похожие товары не загрузились:", err);
  }
  return { product: page.product, related };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchProductBySlug(slug);
  if (!page) return { title: "Товар не найден" };
  return {
    title: page.product.title,
    description: `${page.product.title} — ${page.product.material}. Установка без сверления кузова, доставка по всей России.`,
  };
}

const GUARANTEES = [
  { icon: ShieldCheck, text: "Нержавеющая сталь AISI 304 или порошковое покрытие" },
  { icon: CheckCircle2, text: "Установка без сверления и доработок кузова" },
  { icon: Truck, text: "Доставка по всей России, установка под ключ" },
];

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const data = await loadPageData(slug);
  if (!data) notFound();

  const { product, related } = data;

  return (
    <div className="bg-coal">
      <div className="container-site py-12 md:py-16">
        {/* Хлебные крошки */}
        <nav
          className="flex flex-wrap items-center gap-2 text-sm text-zinc-500"
          aria-label="Хлебные крошки"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Продукция
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-zinc-400">{product.title}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Фото товара */}
          <FadeIn>
            <div className="relative aspect-[4/3] overflow-hidden border border-white/10 bg-gradient-to-br from-[#2a2a2a] via-[#242424] to-[#1f1f1f]">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-zinc-500">
                  <Car className="h-16 w-16" aria-hidden="true" />
                  <span className="text-sm uppercase tracking-widest">
                    {product.carModel}
                  </span>
                  <span className="text-xs text-zinc-600">
                    фото появится после фотосессии продукции
                  </span>
                </div>
              )}
            </div>
          </FadeIn>

          {/* Информация о товаре */}
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-gold px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-coal">
                {product.carModel}
              </span>
              <span className="border border-white/20 px-2.5 py-1 text-[11px] uppercase tracking-wider text-zinc-300">
                {product.position}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              {product.title}
            </h1>
            <p className="mt-3 text-sm text-zinc-400">{product.material}</p>

            <p className="mt-6 border-l-2 border-gold pl-4 text-sm leading-relaxed text-zinc-300">
              {product.description}
            </p>

            <p className="mt-8 text-3xl font-bold text-gold">
              {product.priceFrom == null
                ? "Цена по запросу"
                : `от ${new Intl.NumberFormat("ru-RU").format(product.priceFrom)} ₽`}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#order" className="btn-solid-gold">
                Оставить заявку
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link href="/products" className="btn-outline-gold">
                Все комплекты
              </Link>
            </div>

            <ul className="mt-10 space-y-3 border-t border-white/10 pt-8">
              {GUARANTEES.map((g) => (
                <li
                  key={g.text}
                  className="flex items-start gap-3 text-sm text-zinc-300"
                >
                  <g.icon
                    className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                    aria-hidden="true"
                  />
                  {g.text}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

        {/* Форма заявки с предзаполненной моделью */}
        <FadeIn className="mt-16">
          <div id="order" className="panel-paper scroll-mt-24 p-6 md:p-10">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <h2 className="text-2xl font-bold uppercase leading-tight text-coal sm:text-3xl">
                  Заказать: {product.title}
                </h2>
                <p className="mt-5 text-base font-bold leading-relaxed text-coal">
                  Оставьте контакты — уточним комплектацию, стоимость и сроки.
                </p>
              </div>
              <LeadForm
                source={`product:${product.slug}`}
                variant="light"
                defaultCarModel={product.carModel}
              />
            </div>
          </div>
        </FadeIn>

        {/* Похожие товары */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Другие комплекты для {product.carModel}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <FadeIn key={p.slug} delay={i * 0.07}>
                  <ProductCard product={p} />
                </FadeIn>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
