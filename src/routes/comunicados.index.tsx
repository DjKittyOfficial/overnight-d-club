import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Radio } from "lucide-react";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/fx/Reveal";
import { AnnouncementCard } from "@/components/site/AnnouncementCard";
import { PageHeader } from "@/components/site/PageHeader";
import { announcementsQuery } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/comunicados/")({
  head: () => ({
    meta: [
      { title: "Comunicados oficiales — OverNight D Club" },
      { name: "description", content: "Anuncios y comunicados oficiales de la dirección de OverNight D Club." },
      { property: "og:title", content: "Comunicados oficiales — OverNight D Club" },
      { property: "og:description", content: "Anuncios y comunicados oficiales de la dirección de OverNight." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(announcementsQuery()),
  component: News,
});

function News() {
  const { data } = useSuspenseQuery(announcementsQuery());
  const [cat, setCat] = useState<string | null>(null);
  const categories = useMemo(() => Array.from(new Set(data.items.map((a) => a.category))), [data.items]);
  const items = cat ? data.items.filter((a) => a.category === cat) : data.items;

  return (
    <>
      <PageHeader code="04" label="Canal oficial de la dirección" title="Comunicados">
        Anuncios oficiales de OverNight D Club.
      </PageHeader>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          {data.error && (
            <p role="alert" className="mb-8 border border-destructive/60 bg-destructive/10 p-4 text-sm text-frost">
              {data.error}
            </p>
          )}
          {categories.length > 1 && (
            <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
              {[null, ...categories].map((c) => (
                <button
                  key={c ?? "all"}
                  type="button"
                  onClick={() => setCat(c)}
                  aria-pressed={cat === c}
                  className={cn(
                    "chamfer-sm font-hud border px-4 py-2 text-[0.65rem] transition-colors",
                    cat === c ? "border-primary bg-primary/15 text-neon-soft" : "border-border text-steel hover:text-frost",
                  )}
                >
                  {c ?? "Todos"}
                </button>
              ))}
            </div>
          )}
          {items.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((a, i) => (
                <Reveal key={a.id} delay={(i % 3) * 90}>
                  <AnnouncementCard a={a} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="panel-hud p-12 text-center">
              <Radio className="mx-auto size-10 text-primary animate-flicker" />
              <p className="font-hud mt-5 text-xs text-steel">Sin transmisiones activas</p>
              <p className="mt-2 text-muted-foreground">Todavía no se ha publicado ningún comunicado oficial.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
