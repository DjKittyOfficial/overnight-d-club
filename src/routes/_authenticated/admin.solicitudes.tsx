import { createFileRoute } from "@tanstack/react-router";
import { AdminTitle } from "@/components/admin/AdminShell";
import { RecordsManager, type RecordsConfig } from "@/components/admin/RecordsManager";
import { REQUEST_STATUSES } from "@/components/admin/StatusBadge";

const config: RecordsConfig = {
  table: "applications",
  noun: "la solicitud de afiliación",
  prefix: "AF",
  statuses: REQUEST_STATUSES,
  hasReviewed: true,
  primary: (r) => String(r["alias"]),
  secondary: (r) => `${r["age"]} años · ${r["contact_channel"]}: ${r["contact_handle"]}`,
  fields: [
    { key: "alias", label: "Identificación" },
    { key: "age", label: "Edad" },
    { key: "contact_channel", label: "Medio de comunicación" },
    { key: "contact_handle", label: "Usuario / contacto" },
    { key: "email", label: "Correo electrónico" },
    { key: "introduction", label: "Presentación personal", long: true },
    { key: "motivation", label: "Motivos", long: true },
    { key: "availability", label: "Disponibilidad / información adicional", long: true },
  ],
};

export const Route = createFileRoute("/_authenticated/admin/solicitudes")({
  component: () => (
    <>
      <AdminTitle code="AF" title="Solicitudes de afiliación" />
      <RecordsManager config={config} />
    </>
  ),
});
