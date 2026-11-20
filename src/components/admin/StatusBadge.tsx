import { cn } from "@/lib/utils";

export const REQUEST_STATUSES = [
  { value: "pendiente", label: "Pendiente" },
  { value: "en_revision", label: "En revisión" },
  { value: "aceptada", label: "Aceptada" },
  { value: "rechazada", label: "Rechazada" },
  { value: "archivada", label: "Archivada" },
] as const;

export const MESSAGE_STATUSES = [
  { value: "nuevo", label: "Nuevo" },
  { value: "leido", label: "Leído" },
  { value: "respondido", label: "Respondido" },
  { value: "archivado", label: "Archivado" },
] as const;

const tone: Record<string, string> = {
  pendiente: "border-warning/60 text-warning",
  nuevo: "border-warning/60 text-warning",
  en_revision: "border-primary/60 text-neon-soft",
  leido: "border-primary/60 text-neon-soft",
  aceptada: "border-success/60 text-success",
  respondido: "border-success/60 text-success",
  rechazada: "border-destructive/60 text-destructive",
  archivada: "border-border text-muted-foreground",
  archivado: "border-border text-muted-foreground",
  publicado: "border-success/60 text-success",
  borrador: "border-border text-muted-foreground",
};

const labels: Record<string, string> = Object.fromEntries(
  [...REQUEST_STATUSES, ...MESSAGE_STATUSES, { value: "publicado", label: "Publicado" }, { value: "borrador", label: "Borrador" }].map((s) => [s.value, s.label]),
);

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("font-hud inline-flex items-center border px-2 py-0.5 text-[0.58rem]", tone[status] ?? "border-border text-steel")}>
      {labels[status] ?? status}
    </span>
  );
}
