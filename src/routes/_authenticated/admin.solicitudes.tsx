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
  head: () => ({ meta: [
    { title: "Administración de solicitudes — OverNight D Club" },
    { name: "description", content: "Administración de solicitudes en el panel privado de OverNight D Club." },
    { property: "og:title", content: "Administración de solicitudes — OverNight D Club" },
    { property: "og:description", content: "Administración de solicitudes en el panel privado de OverNight D Club." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: () => (
    <>
      <AdminTitle code="AF" title="Solicitudes de afiliación" />
      <RecordsManager config={config} />
    </>
  ),
});
