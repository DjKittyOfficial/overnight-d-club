import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import founderImgAsset from "@/assets/founder-silhouette.jpg.asset.json";
const founderImg = founderImgAsset.url;
import { ScanOverlay } from "@/components/fx/Ambient";
import { Reveal } from "@/components/fx/Reveal";
import { SectionLabel } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/fundador")({
  head: () => ({
    meta: [
      { title: "El fundador — Moha Contreras · OverNight D Club" },
      { name: "description", content: "Moha Contreras, fundador de OverNight D Club. Identidad visual protegida." },
      { property: "og:title", content: "El fundador — Moha Contreras" },
      { property: "og:description", content: "Fundador de OverNight D Club. Identidad visual protegida." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Founder,
});

const DOSSIER = [
  ["Nombre", "Moha Contreras"],
  ["Rol", "Fundador de OverNight D Club"],
  ["Identidad visual", "Protegida"],
  ["Expediente personal", "Reservado"],
];

function Founder() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-32">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-12 md:px-8">
        <Reveal className="md:col-span-5">
          <div className="chamfer relative aspect-[3/5] overflow-hidden border border-border shadow-neon">
            <img src={founderImg} alt="Silueta anónima con capucha frente a un deportivo iluminado en violeta" width={800} height={1333} className="size-full object-cover" />
            <ScanOverlay />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/40" />
            <div className="absolute left-4 top-4 flex items-center gap-2 bg-void/80 px-3 py-1.5 backdrop-blur">
              <Lock className="size-3.5 text-neon-soft" />
              <span className="font-hud text-[0.6rem] text-frost">Identidad protegida</span>
            </div>
          </div>
        </Reveal>
        <div className="md:col-span-6 md:col-start-7 md:pt-10">
          <Reveal>
            <SectionLabel code="03">El fundador</SectionLabel>
            <h1 data-text="MOHA CONTRERAS" className="glitch mt-5 font-display text-5xl font-extrabold uppercase leading-none text-frost md:text-7xl">
              MOHA CONTRERAS
            </h1>
            <p className="font-hud mt-4 text-xs text-steel">Fundador · OverNight D Club</p>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-8 text-lg leading-relaxed text-steel">
              Moha Contreras es el fundador de OverNight. Su imagen se mantiene en la sombra por decisión propia: lo que
              importa no es un rostro, sino la familia que se reúne alrededor de los motores.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <dl className="panel-hud mt-10 divide-y divide-border">
              {DOSSIER.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 px-6 py-4">
                  <dt className="font-hud text-[0.6rem] text-muted-foreground">{k}</dt>
                  <dd className="text-right font-display text-frost">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild variant="neon" size="lg">
                <Link to="/filosofia">La filosofía de OverNight</Link>
              </Button>
              <Button asChild variant="hud" size="lg">
                <Link to="/contacto">Contactar con la dirección</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
