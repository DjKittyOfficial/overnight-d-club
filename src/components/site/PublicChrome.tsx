import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/** Public header/footer; the admin area renders its own shell. */
export function PublicChrome({ children }: { children: ReactNode }) {
  const isAdmin = useRouterState({ select: (s) => s.location.pathname.startsWith("/admin") });
  if (isAdmin) return <>{children}</>;
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
