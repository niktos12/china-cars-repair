import { notFound } from "next/navigation";

import { ProductEditClient } from "@/components/admin/product-edit-client";

export const metadata = { title: "Редактирование товара" };

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) notFound();

  /* Данные товара загружает клиентский компонент с бэкенда */
  return <ProductEditClient id={productId} />;
}
