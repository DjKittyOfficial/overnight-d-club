import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { AdminShell, useSignOut } from "@/components/admin/AdminShell";
import { SpiderMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel de la dirección — OverNight D Club" },
      { name: "description", content: "Panel privado de administración de OverNight D Club." },
      { property: "og:title", content: "Panel de la dirección — OverNight D Club" },
      { property: "og:description", content: "Panel privado de administración." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  beforeLoad: async ({ context }) => {
    const [{ data: isAdmin }, { data: adminExists }] = await Promise.all([
      supabase.rpc("has_role", { _user_id: context.user.id, _role: "admin" }),
      supabase.rpc("admin_exists"),
    ]);
    return { isAdmin: isAdmin === true, adminExists: adminExists !== false };
  },
  pendingComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  ),
  component: AdminLayout,
});

function AdminLayout() {
  const { isAdmin, adminExists, user } = Route.useRouteContext();
  if (!isAdmin) return <Denied canClaim={!adminExists} email={user.email ?? ""} />;
  return (
    <AdminShell email={user.email ?? ""}>
      <Outlet />
    </AdminShell>
  );
}

function Denied({ canClaim, email }: { canClaim: boolean; email: string }) {
  const router = useRouter();
  const signOut = useSignOut();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function claim() {
    setBusy(true);
    setErr(null);
    const { data, error } = await supabase.rpc("claim_first_admin");
    setBusy(false);
    if (error || !data) return setErr("No se pudo activar el acceso. Es posible que ya exista una cuenta de dirección.");
    router.invalidate();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
      <div className="panel-hud relative w-full max-w-md p-8 text-center">
        <SpiderMark className="mx-auto size-12" />
        {canClaim ? (
          <>
            <ShieldCheck className="mx-auto mt-6 size-8 text-neon-soft" />
            <h1 className="mt-4 font-display text-2xl font-bold uppercase text-frost">Activar acceso de dirección</h1>
            <p className="mt-3 text-sm text-steel">
              Todavía no hay administradores. Puedes activar el acceso de dirección para <strong className="text-frost">{email}</strong>. Solo puede hacerse una vez.
            </p>
            {err && <p className="mt-4 text-sm text-destructive">{err}</p>}
            <Button variant="neon" className="mt-6 w-full" onClick={claim} disabled={busy}>
              {busy && <Loader2 className="animate-spin" />} Activar acceso
            </Button>
          </>
        ) : (
          <>
            <ShieldAlert className="mx-auto mt-6 size-8 text-destructive" />
            <h1 className="mt-4 font-display text-2xl font-bold uppercase text-frost">Acceso denegado</h1>
            <p className="mt-3 text-sm text-steel">La cuenta {email} no tiene permisos de dirección.</p>
          </>
        )}
        <Button variant="quiet" className="mt-4" onClick={signOut}>Cerrar sesión</Button>
      </div>
    </div>
  );
}
