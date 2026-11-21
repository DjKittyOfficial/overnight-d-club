import { createFileRoute } from "@tanstack/react-router";
import { AdminTitle } from "@/components/admin/AdminShell";
import { RecordsManager, type RecordsConfig } from "@/components/admin/RecordsManager";
import { REQUEST_STATUSES } from "@/components/admin/StatusBadge";

const config: RecordsConfig = {
  table: "alliances",
  noun: "la propuesta de alianza",
  prefix: "AL",
  statuses: REQUEST_STATUSES,
  hasReviewed: true,
  primary: (r) => String(r["organization_name"]),
  secondary: (r) => `${r["proposal_type"]} · ${r["representative"]}`,
  fields: [
    { key: "organization_name", label: "Organización" },
    { key: "representative", label: "Representante" },
    { key: "proposal_type", label: "Tipo de propuesta" },
    { key: "contact_channel", label: "Medio de contacto" },
    { key: "email", label: "Correo electrónico" },
    { key: "description", label: "Descripción", long: true },
    { key: "additional_info", label: "Información adicional", long: true },
  ],
};

export const Route = createFileRoute("/_authenticated/admin/alianzas")({
  head: () => ({ meta: [
    { title: "Administración de alianzas — OverNight D Club" },
    { name: "description", content: "Administración de alianzas en el panel privado de OverNight D Club." },
    { property: "og:title", content: "Administración de alianzas — OverNight D Club" },
    { property: "og:description", content: "Administración de alianzas en el panel privado de OverNight D Club." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: () => (
    <>
      <AdminTitle code="AL" title="Propuestas de alianza" />
      <RecordsManager config={config} />
    </>
  ),
});
