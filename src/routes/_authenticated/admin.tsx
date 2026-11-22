import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Loader2, ShieldAlert } from "lucide-react";
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  beforeLoad: async ({ context }) => {
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: context.user.id, _role: "admin" });
    return { isAdmin: isAdmin === true };
  },
  pendingComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  ),
  component: AdminLayout,
});

function AdminLayout() {
  const { isAdmin, user } = Route.useRouteContext();
  if (!isAdmin) return <Denied email={user.email ?? ""} />;
  return (
    <AdminShell email={user.email ?? ""}>
      <Outlet />
    </AdminShell>
  );
}

function Denied({ email }: { email: string }) {
  const signOut = useSignOut();
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
      <div className="panel-hud relative w-full max-w-md p-8 text-center">
        <SpiderMark className="mx-auto size-12" />
        <ShieldAlert className="mx-auto mt-6 size-8 text-destructive" />
        <h1 className="mt-4 font-display text-2xl font-bold uppercase text-frost">Acceso denegado</h1>
        <p className="mt-3 text-sm text-steel">La cuenta {email} no tiene permisos de dirección.</p>
        <Button variant="quiet" className="mt-4" onClick={signOut}>Cerrar sesión</Button>
      </div>
    </div>
  );
}
