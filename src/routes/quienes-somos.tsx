import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Car, Moon, ShieldCheck, Users } from "lucide-react";
import heroImgAsset from "@/assets/hero-city.jpg.asset.json";
const heroImg = heroImgAsset.url;
import { Reveal } from "@/components/fx/Reveal";
import { PageHeader, SectionLabel } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/quienes-somos")({
  head: () => ({
    meta: [
      { title: "Quiénes somos — OverNight D Club" },
      { name: "description", content: "Qué es OverNight D Club, su identidad, su propósito y qué significa pertenecer a la familia." },
      { property: "og:title", content: "Quiénes somos — OverNight D Club" },
      { property: "og:description", content: "Identidad, propósito y pertenencia en OverNight D Club." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const BLOCKS = [
  {
    code: "A1",
    icon: Car,
    title: "Qué es OverNight",
    body: "OverNight D Club es una organización automovilística con identidad propia. Reúne a quienes viven la cultura del motor de noche: en la carretera, en el garaje y en cada encuentro donde los faros iluminan la ciudad.",
  },
  {
    code: "A2",
    icon: Moon,
    title: "Nuestra identidad",
    body: "Somos noche, asfalto mojado y luces de neón. Una estética y una forma de estar en la ciudad que se reconoce al instante: la araña y la luna creciente son nuestro símbolo, y la lealtad, nuestra seña.",
  },
  {
    code: "A3",
    icon: ShieldCheck,
    title: "Nuestro propósito",
    body: "Crear un espacio de confianza donde la pasión por los automóviles sirva para unir a las personas. Cuidar a quienes forman parte de la organización y construir, juntos, algo que merezca la pena.",
  },
  {
    code: "A4",
    icon: Users,
    title: "Pertenecer a OverNight",
    body: "Formar parte de OverNight es asumir un compromiso con los demás miembros. Significa respetar, apoyar y aportar. Aquí nadie conduce solo: quien entra, entra en una familia.",
  },
];

function About() {
  return (
    <>
      <PageHeader code="01" label="Expediente de la organización" title="Quiénes somos" image={heroImg}>
        Los automóviles son el punto de encuentro. Las personas son lo verdaderamente importante.
      </PageHeader>

      <section className="relative py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2 md:px-8">
          {BLOCKS.map((b, i) => (
            <Reveal key={b.code} delay={i * 90} className="h-full">
              <article className="panel-hud card-hud h-full p-8 md:p-10">
                <div className="flex items-center justify-between">
                  <span className="font-hud text-[0.65rem] text-primary">{b.code}</span>
                  <b.icon className="size-6 text-neon-soft" />
                </div>
                <h2 className="mt-6 font-display text-2xl font-bold uppercase tracking-wide text-frost md:text-3xl">{b.title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-steel">{b.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-border bg-void py-20 md:py-28">
        <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
        <Reveal className="relative mx-auto max-w-4xl px-4 text-center md:px-8">
          <SectionLabel className="justify-center">Lema oficial</SectionLabel>
          <p className="text-neon mt-6 font-display text-4xl font-bold md:text-6xl">«Una familia unida por los motores».</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="neon" size="lg">
              <Link to="/filosofia">
                Nuestra filosofía <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="hud" size="lg">
              <Link to="/afiliacion">Solicitar afiliación</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
