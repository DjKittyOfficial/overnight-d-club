import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "@/integrations/supabase/client";
import { PublicChrome } from "@/components/site/PublicChrome";
import { SpiderMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { settingsQuery } from "@/lib/queries";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 pt-24">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
      <div className="panel-hud relative max-w-lg p-10 text-center">
        <SpiderMark className="mx-auto size-14 animate-flicker" />
        <p className="font-hud mt-6 text-xs text-neon-soft">Error 404 · Sector no encontrado</p>
        <h1 data-text="SEÑAL PERDIDA" className="glitch mt-3 font-display text-4xl font-bold text-frost md:text-5xl">
          SEÑAL PERDIDA
        </h1>
        <p className="mt-4 text-steel">La ruta que buscas no existe o ha sido trasladada.</p>
        <Button asChild variant="neon" className="mt-8">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}

// Browser extensions (translators, password managers…) can inject markup into
// <body> before hydration. That mismatch is harmless: re-render once on the client.
let hydrationRecoveryUsed = false;
function isHydrationError(error: unknown) {
  return error instanceof Error && /hydrat/i.test(error.message);
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  const recover = isHydrationError(error) && !hydrationRecoveryUsed;
  useEffect(() => {
    if (recover) {
      hydrationRecoveryUsed = true;
      reset();
      return;
    }
    console.error(error);
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error, recover, reset]);
  if (recover) return null;

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 pt-24">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
      <div className="panel-hud relative max-w-lg p-10 text-center">
        <SpiderMark className="mx-auto size-14 animate-flicker" />
        <p className="font-hud mt-6 text-xs text-destructive">Interferencia detectada</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-frost">Esta página no ha cargado</h1>
        <p className="mt-4 text-steel">Algo ha fallado en la transmisión. Puedes reintentarlo o volver al inicio.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            variant="neon"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Reintentar
          </Button>
          <Button asChild variant="hud">
            <a href="/">Inicio</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#07040d" },
      { title: "OverNight D Club — Una familia unida por los motores" },
      {
        name: "description",
        content: "Portal oficial de OverNight D Club: cultura del motor, la noche y una familia unida por los motores.",
      },
      { name: "author", content: "OverNight D Club" },
      { property: "og:site_name", content: "OverNight D Club" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Oxanium:wght@400;500;600;700;800&family=Saira:wght@300;400;500;600&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <PublicChrome>
        {/* Required: nested routes render here. */}
        <Outlet />
      </PublicChrome>
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}
