import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ProductForm } from "@/components/admin/product-form";
import { getProductById } from "@/server/queries";

export const metadata = { title: "Редактирование товара" };

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) notFound();

  const { product } = await getProductById(productId);
  if (!product) notFound();

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/products"
        className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        К списку товаров
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Редактирование товара</h1>
        {product.isActive && (
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="text-sm text-gold hover:underline"
          >
            Открыть страницу на сайте →
          </Link>
        )}
      </div>
      <p className="mt-1 text-sm text-zinc-500">
        ID #{product.id} · создан{" "}
        {new Intl.DateTimeFormat("ru-RU", { dateStyle: "long" }).format(product.createdAt)}
      </p>

      <div className="mt-6 border border-white/10 bg-panel p-6 md:p-8">
        <ProductForm
          productId={product.id}
          defaultValues={{
            slug: product.slug,
            title: product.title,
            carModel: product.carModel,
            position: product.position,
            material: product.material,
            description: product.description,
            priceFrom: product.priceFrom == null ? "" : String(product.priceFrom),
            imageUrl: product.imageUrl ?? "",
            isActive: product.isActive,
          }}
        />
      </div>
    </div>
  );
}
