import { ProductsAdminClient } from "@/components/admin/products-admin-client";

/* Данные загружает клиентский список с бэкенда (GET /api/admin/products) */
export default function AdminProductsPage() {
  return <ProductsAdminClient />;
}
