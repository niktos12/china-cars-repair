import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Новый товар" };

export default function AdminNewProductPage() {
  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/products"
        className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        К списку товаров
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">Новый товар</h1>
      <p className="mt-1 text-sm text-zinc-500">
        После создания товар сразу появится в каталоге сайта.
      </p>

      <div className="mt-6 border border-white/10 bg-panel p-6 md:p-8">
        <ProductForm
          defaultValues={{
            slug: "",
            title: "",
            carModel: "",
            position: "",
            material: "",
            description: "",
            priceFrom: "",
            imageUrl: "",
            isActive: true,
          }}
        />
      </div>
    </div>
  );
}
