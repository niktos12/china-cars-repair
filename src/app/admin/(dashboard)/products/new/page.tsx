import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Новый товар" };

export default function AdminNewProductPage() {
  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/products"
        className="adm-faint mb-4 inline-flex items-center gap-1 text-sm transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        К списку товаров
      </Link>

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Новый товар</h1>
      <p className="adm-faint mt-1 text-sm">
        После создания товар сразу появится в каталоге сайта.
      </p>

      <div className="adm-panel mt-6 p-6 md:p-8">
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
