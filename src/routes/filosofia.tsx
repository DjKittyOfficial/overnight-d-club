import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { PILLARS } from "@/lib/pillars";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/filosofia")({
  head: () => ({
    meta: [
      { title: "Filosofía — Los seis pilares de OverNight D Club" },
      { name: "description", content: "Libertad, Lealtad, Respeto, Personas, Familia y Legado: los seis pilares de OverNight D Club." },
      { property: "og:title", content: "Filosofía — Los seis pilares de OverNight" },
      { property: "og:description", content: "Libertad, Lealtad, Respeto, Personas, Familia y Legado." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Philosophy,
});

function Philosophy() {
  return (
    <>
      <PageHeader code="02" label="Código de la organización" title="Filosofía">
        Seis pilares sostienen OverNight. No son normas escritas en una pared: son la forma en que nos tratamos.
      </PageHeader>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl space-y-6 px-4 md:px-8">
          {PILLARS.map((p, i) => (
            <Reveal key={p.n}>
              <article
                id={p.name.toLowerCase()}
                className={cn(
                  "panel-hud group grid scroll-mt-28 items-center gap-8 overflow-hidden p-8 md:grid-cols-12 md:p-12",
                )}
              >
                <div className={cn("relative md:col-span-4", i % 2 && "md:order-2 md:col-start-9")}>
                  <span aria-hidden className="text-gradient-steel block font-display text-[7rem] font-extrabold leading-none opacity-20 md:text-[10rem]">
                    {p.n}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="chamfer flex size-24 items-center justify-center border border-primary/50 bg-void/80 shadow-neon md:size-28">
                      <p.icon className="size-10 text-neon-soft animate-pulse-neon md:size-12" />
                    </div>
                  </div>
                </div>
                <div className={cn("md:col-span-7", i % 2 ? "md:order-1" : "md:col-start-6")}>
                  <p className="font-hud text-[0.65rem] text-primary">Pilar {p.n} / 06</p>
                  <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-wide text-frost md:text-5xl">{p.name}</h2>
                  <p className="text-neon mt-4 font-display text-xl">{p.line}</p>
                  <p className="mt-5 text-lg leading-relaxed text-steel">{p.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-16 flex max-w-7xl justify-center px-4">
          <Button asChild variant="neon" size="xl">
            <Link to="/afiliacion">
              Compartes estos pilares — solicita tu afiliación <ArrowRight />
            </Link>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
