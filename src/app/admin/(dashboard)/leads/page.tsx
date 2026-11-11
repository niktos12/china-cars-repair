import { LeadsClient } from "@/components/admin/leads-client";

export const metadata = { title: "Заявки" };

/* Данные загружает клиентский список с бэкенда (GET /api/admin/leads) */
export default function AdminLeadsPage() {
  return <LeadsClient />;
}
