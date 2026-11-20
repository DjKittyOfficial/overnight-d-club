import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLink } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS } from "./nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 24);
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "border-b border-border bg-void/80 backdrop-blur-xl" : "bg-gradient-to-b from-void/80 to-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 md:h-20 md:px-8">
        <BrandLink />

        <nav aria-label="Navegación principal" className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.slice(1).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="link-hud font-display text-[0.8rem] uppercase tracking-[0.16em] text-steel transition-colors hover:text-frost data-[status=active]:text-frost"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="neon" size="sm" className="hidden sm:inline-flex">
            <Link to="/afiliacion">Solicitar afiliación</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="hud" size="icon" className="lg:hidden" aria-label="Abrir menú">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm border-l border-border bg-void/95 p-0 backdrop-blur-xl [&>button]:hidden">
              <div className="flex h-16 items-center justify-between border-b border-border px-5">
                <SheetTitle className="font-hud text-xs text-neon-soft">Menú · Terminal</SheetTitle>
                <SheetClose asChild>
                  <Button variant="hud" size="icon" aria-label="Cerrar menú">
                    <X />
                  </Button>
                </SheetClose>
              </div>
              <nav aria-label="Navegación móvil" className="flex flex-col p-5">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    activeOptions={{ exact: l.to === "/" }}
                    className="group flex items-baseline gap-4 border-b border-border/60 py-4 text-steel transition-colors hover:text-frost data-[status=active]:text-neon-soft"
                  >
                    <span className="font-hud text-[0.65rem] text-primary">{l.code}</span>
                    <span className="font-display text-xl uppercase tracking-[0.12em]">{l.label}</span>
                  </Link>
                ))}
                <Button asChild variant="neon" size="xl" className="mt-8">
                  <Link to="/afiliacion">Solicitar afiliación</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div aria-hidden className="h-px w-full bg-transparent">
        <div className="h-px origin-left bg-gradient-neon shadow-neon" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </header>
  );
}
