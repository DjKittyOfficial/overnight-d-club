export function formatDate(iso: string | null | undefined, withTime = false) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Madrid",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

/** Stable short code from a uuid, for HUD-style references. */
export function refCode(id: string, prefix = "ON") {
  return `${prefix}-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}
