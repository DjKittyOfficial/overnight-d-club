import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ExternalLink, Handshake, LayoutDashboard, LogOut, Mail, Megaphone, Settings, UserPlus, Users } from "lucide-react";
import type { ReactNode } from "react";
import { SpiderMark, Wordmark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const ADMIN_NAV = [
  { to: "/admin", label: "Panel", icon: LayoutDashboard, exact: true },
  { to: "/admin/solicitudes", label: "Solicitudes", icon: UserPlus, exact: false },
  { to: "/admin/alianzas", label: "Alianzas", icon: Handshake, exact: false },
  { to: "/admin/mensajes", label: "Mensajes", icon: Mail, exact: false },
  { to: "/admin/comunicados", label: "Comunicados", icon: Megaphone, exact: false },
  { to: "/admin/configuracion", label: "Configuración", icon: Settings, exact: false },
  { to: "/admin/usuarios", label: "Usuarios", icon: Users, exact: false },
] as const;

export function useSignOut() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };
}

export function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  const signOut = useSignOut();
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 z-40 border-b border-sidebar-border bg-sidebar lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between gap-3 px-4 lg:h-20 lg:px-6">
          <Link to="/admin" className="flex items-center gap-3">
            <SpiderMark className="size-8" />
            <Wordmark compact />
          </Link>
          <Button variant="quiet" size="sm" onClick={signOut} className="lg:hidden" aria-label="Cerrar sesión">
            <LogOut />
          </Button>
        </div>
        <nav aria-label="Administración" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-4 lg:pb-0">
          {ADMIN_NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.exact }}
              className="flex shrink-0 items-center gap-3 px-3 py-2.5 text-sm text-steel transition-colors hover:bg-sidebar-accent hover:text-frost data-[status=active]:bg-sidebar-accent data-[status=active]:text-neon-soft data-[status=active]:shadow-[inset_2px_0_0_var(--neon)]"
            >
              <n.icon className="size-4" />
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="absolute inset-x-0 bottom-0 hidden space-y-3 border-t border-sidebar-border p-4 lg:block">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-steel hover:text-frost">
            <ExternalLink className="size-3.5" /> Ver sitio público
          </a>
          <p className="truncate text-xs text-muted-foreground" title={email}>{email}</p>
          <Button variant="hud" size="sm" className="w-full" onClick={signOut}>
            <LogOut /> Cerrar sesión
          </Button>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-8 md:px-8 lg:py-10">{children}</main>
    </div>
  );
}

export function AdminTitle({ code, title, children }: { code: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="font-hud text-[0.6rem] text-neon-soft">[{code}] Dirección · OverNight</p>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase text-frost">{title}</h1>
      </div>
      {children}
    </div>
  );
}
