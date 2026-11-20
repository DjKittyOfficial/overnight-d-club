import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Handshake, Mail, Megaphone, UserPlus } from "lucide-react";
import { AdminTitle } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

type Activity = { id: string; kind: string; title: string; status: string; at: string; to: "/admin/solicitudes" | "/admin/alianzas" | "/admin/mensajes" | "/admin/comunicados" };

async function count(table: "applications" | "alliances" | "contact_messages" | "announcements", col?: string, val?: string | boolean) {
  let q = supabase.from(table).select("id", { count: "exact", head: true });
  if (col) q = q.eq(col as never, val as never);
  const { count: c, error } = await q;
  if (error) throw error;
  return c ?? 0;
}

function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const [appsPending, appsTotal, msgsNew, alliancesPending, published, a, b, c, d] = await Promise.all([
        count("applications", "status", "pendiente"),
        count("applications"),
        count("contact_messages", "status", "nuevo"),
        count("alliances", "status", "pendiente"),
        count("announcements", "published", true),
        supabase.from("applications").select("id, alias, status, created_at").order("created_at", { ascending: false }).limit(6),
        supabase.from("alliances").select("id, organization_name, status, created_at").order("created_at", { ascending: false }).limit(6),
        supabase.from("contact_messages").select("id, subject, status, created_at").order("created_at", { ascending: false }).limit(6),
        supabase.from("announcements").select("id, title, published, updated_at").order("updated_at", { ascending: false }).limit(6),
      ]);
      const activity: Activity[] = [
        ...(a.data ?? []).map((r) => ({ id: r.id, kind: "Solicitud", title: r.alias, status: r.status, at: r.created_at, to: "/admin/solicitudes" as const })),
        ...(b.data ?? []).map((r) => ({ id: r.id, kind: "Alianza", title: r.organization_name, status: r.status, at: r.created_at, to: "/admin/alianzas" as const })),
        ...(c.data ?? []).map((r) => ({ id: r.id, kind: "Mensaje", title: r.subject, status: r.status, at: r.created_at, to: "/admin/mensajes" as const })),
        ...(d.data ?? []).map((r) => ({ id: r.id, kind: "Comunicado", title: r.title, status: r.published ? "publicado" : "borrador", at: r.updated_at, to: "/admin/comunicados" as const })),
      ]
        .sort((x, y) => y.at.localeCompare(x.at))
        .slice(0, 10);
      return { appsPending, appsTotal, msgsNew, alliancesPending, published, activity };
    },
  });

  const stats = [
    { label: "Solicitudes pendientes", value: data?.appsPending, sub: `${data?.appsTotal ?? 0} en total`, icon: UserPlus, to: "/admin/solicitudes" as const },
    { label: "Mensajes nuevos", value: data?.msgsNew, sub: "Canal de comunicaciones", icon: Mail, to: "/admin/mensajes" as const },
    { label: "Alianzas pendientes", value: data?.alliancesPending, sub: "Propuestas por revisar", icon: Handshake, to: "/admin/alianzas" as const },
    { label: "Comunicados publicados", value: data?.published, sub: "Visibles en el sitio", icon: Megaphone, to: "/admin/comunicados" as const },
  ];

  return (
    <>
      <AdminTitle code="00" title="Panel de control" />
      {error && <p role="alert" className="mb-6 border border-destructive/60 bg-destructive/10 p-4 text-sm">No se pudo cargar el resumen.</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="panel-hud card-hud block p-6">
            <div className="flex items-center justify-between">
              <p className="font-hud text-[0.58rem] text-steel">{s.label}</p>
              <s.icon className="size-4 text-neon-soft" />
            </div>
            {isLoading ? <Skeleton className="mt-4 h-10 w-16 rounded-none" /> : <p className="mt-3 font-display text-4xl font-bold text-frost">{s.value ?? 0}</p>}
            <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-hud mb-4 text-[0.65rem] text-neon-soft">Actividad reciente</h2>
        {isLoading ? (
          <div className="space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-14 rounded-none" />)}</div>
        ) : data?.activity.length ? (
          <ul className="divide-y divide-border border border-border bg-card">
            {data.activity.map((r) => (
              <li key={`${r.kind}-${r.id}`}>
                <Link to={r.to} className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-accent/40">
                  <span className="font-hud w-24 shrink-0 text-[0.58rem] text-primary">{r.kind}</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-frost">{r.title}</span>
                  <span className="hidden text-xs text-muted-foreground sm:block">{formatDate(r.at, true)}</span>
                  <StatusBadge status={r.status} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="panel-hud p-8 text-center text-steel">Sin actividad todavía. Aquí aparecerán las solicitudes, mensajes y comunicados.</p>
        )}
      </section>
    </>
  );
}
