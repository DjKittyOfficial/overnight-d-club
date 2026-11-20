import { createFileRoute } from "@tanstack/react-router";
import { AdminTitle } from "@/components/admin/AdminShell";
import { RecordsManager, type RecordsConfig } from "@/components/admin/RecordsManager";
import { MESSAGE_STATUSES } from "@/components/admin/StatusBadge";

const config: RecordsConfig = {
  table: "contact_messages",
  noun: "el mensaje",
  prefix: "MS",
  statuses: MESSAGE_STATUSES,
  hasReviewed: false,
  primary: (r) => String(r["subject"]),
  secondary: (r) => `${r["name"]} · ${r["reason"]}`,
  fields: [
    { key: "name", label: "Nombre" },
    { key: "email", label: "Correo electrónico" },
    { key: "reason", label: "Motivo" },
    { key: "subject", label: "Asunto" },
    { key: "message", label: "Mensaje", long: true },
  ],
};

export const Route = createFileRoute("/_authenticated/admin/mensajes")({
  component: () => (
    <>
      <AdminTitle code="MS" title="Mensajes" />
      <RecordsManager config={config} />
    </>
  ),
});
