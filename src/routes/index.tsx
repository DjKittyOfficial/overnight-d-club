import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Radio } from "lucide-react";
import heroImgAsset from "@/assets/hero-city.jpg.asset.json";
const heroImg = heroImgAsset.url;
import heroSmAsset from "@/assets/hero-city-sm.jpg.asset.json";
const heroSm = heroSmAsset.url;
import founderImgAsset from "@/assets/founder-silhouette.jpg.asset.json";
const founderImg = founderImgAsset.url;
import { LogoEmblem } from "@/components/brand/Logo";
import { RainLayer, ScanOverlay } from "@/components/fx/Ambient";
import { Reveal } from "@/components/fx/Reveal";
import { AnnouncementCard } from "@/components/site/AnnouncementCard";
import { SectionLabel } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { PILLARS } from "@/lib/pillars";
import { announcementsQuery, settingsQuery } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OverNight D Club — Una familia unida por los motores" },
      {
        name: "description",
        content:
          "Portal oficial de OverNight D Club. Cultura del motor, la noche y la lealtad. Solicita tu afiliación a la familia.",
      },
      { property: "og:title", content: "OverNight D Club — Una familia unida por los motores" },
      {
        property: "og:description",
        content: "Portal oficial de OverNight D Club. Cultura del motor, la noche y la lealtad.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(announcementsQuery(3)),
  component: Home,
});

const DEFAULT_INTRO =
  "Una organización nacida en la noche de la ciudad, donde el rugido de un motor es el punto de partida y las personas son el destino.";

function Home() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const { data: news } = useQuery(announcementsQuery(3));
  const discord = settings.discord_url;

  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28 md:items-center md:pb-0">
        <picture>
          <source media="(max-width: 767px)" srcSet={heroSm} />
          <img
            src={heroImg}
            alt="Calle nocturna de la ciudad bajo la lluvia, con deportivos modificados iluminados en violeta"
            width={1920}
            height={1088}
            fetchPriority="high"
            className="animate-kenburns absolute inset-0 -z-30 size-full object-cover object-[70%_center]"
          />
        </picture>
        <div aria-hidden className="bg-fade-l absolute inset-0 -z-20" />
        <div aria-hidden className="bg-fade-b absolute inset-0 -z-20" />
        <RainLayer className="-z-10" />
        <ScanOverlay className="-z-10" />
        <div aria-hidden className="noise absolute inset-0 -z-10" />

        {/* HUD corners */}
        <div aria-hidden className="pointer-events-none absolute inset-x-4 top-24 hidden justify-between md:flex md:inset-x-8">
          <p className="font-hud text-[0.6rem] text-steel">
            <span className="text-neon-soft">●</span> Transmisión activa · Canal 07
          </p>
          <p className="font-hud text-[0.6rem] text-steel">Visibilidad: lluvia · Asfalto: mojado</p>
        </div>

        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 md:grid-cols-12 md:px-8">
          <div className="md:col-span-8">
            <Reveal>
              <LogoEmblem eager className="mb-6 size-24 animate-pulse-neon md:size-32" />
            </Reveal>
            <Reveal delay={100}>
              <SectionLabel code="ON">Portal oficial de la organización</SectionLabel>
            </Reveal>
            <Reveal delay={200}>
              <h1
                data-text="OVERNIGHT D CLUB"
                className="glitch mt-5 font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tight text-frost sm:text-6xl md:text-8xl"
              >
                OVERNIGHT D CLUB
              </h1>
            </Reveal>
            <Reveal delay={320}>
              <p className="text-neon mt-6 font-display text-2xl font-medium md:text-3xl">
                «Una familia unida por los motores».
              </p>
            </Reveal>
            <Reveal delay={420}>
              <p className="mt-5 max-w-xl text-base text-steel md:text-lg">{settings.hero_intro || DEFAULT_INTRO}</p>
            </Reveal>
            <Reveal delay={520}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="neon" size="xl">
                  <Link to="/afiliacion">
                    Solicitar afiliación <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="hud" size="xl">
                  <Link to="/quienes-somos">Conocer OverNight</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>

        <div aria-hidden className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-border bg-void/70 py-3 backdrop-blur-md">
          <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
            {[...PILLARS, ...PILLARS, ...PILLARS, ...PILLARS].map((p, i) => (
              <span key={i} className="font-hud text-[0.65rem] text-steel">
                <span className="text-primary">{p.n}</span> {p.name} <span className="text-primary/50">//</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* IDENTIDAD */}
      <section className="relative overflow-hidden py-24 md:py-36">
        <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-12 md:px-8">
          <Reveal className="md:col-span-5">
            <SectionLabel code="01">Quiénes somos</SectionLabel>
            <h2 className="mt-5 font-display text-4xl font-bold uppercase leading-tight text-frost md:text-5xl">
              El motor nos reúne.
              <br />
              <span className="text-gradient-neon">Las personas nos definen.</span>
            </h2>
          </Reveal>
          <Reveal delay={150} className="space-y-5 text-lg text-steel md:col-span-6 md:col-start-7">
            <p>
              OverNight D Club es una organización automovilística con identidad propia. Vive en las calles nocturnas,
              en los garajes iluminados de neón y en cada encuentro donde un motor se pone en marcha.
            </p>
            <p>
              Los coches son el punto de encuentro, pero lo que de verdad importa son quienes los conducen: la amistad,
              la lealtad y el compromiso de una comunidad que se cuida.
            </p>
            <Button asChild variant="quiet" className="px-0">
              <Link to="/quienes-somos">
                Acceder al expediente completo <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* PILARES */}
      <section className="relative border-y border-border bg-void py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel code="02">Filosofía</SectionLabel>
              <h2 className="mt-5 font-display text-4xl font-bold uppercase text-frost md:text-5xl">Seis pilares</h2>
            </div>
            <Button asChild variant="hud">
              <Link to="/filosofia">Ver la filosofía</Link>
            </Button>
          </Reveal>
          <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.n} delay={i * 80} className="h-full">
                <Link
                  to="/filosofia"
                  hash={p.name.toLowerCase()}
                  className="group relative flex h-full flex-col gap-4 bg-background p-8 transition-colors hover:bg-accent/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-hud text-xs text-primary">{p.n}</span>
                    <p.icon className="size-6 text-steel transition-colors group-hover:text-neon-soft" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold uppercase tracking-wide text-frost">{p.name}</h3>
                  <p className="text-steel">{p.line}</p>
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-neon transition-transform duration-500 group-hover:scale-x-100" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FUNDADOR */}
      <section className="relative overflow-hidden py-24 md:py-36">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:px-8">
          <Reveal className="relative">
            <div className="chamfer relative aspect-[4/5] overflow-hidden border border-border">
              <img src={founderImg} alt="Silueta anónima del fundador frente a un deportivo en un garaje" loading="lazy" width={800} height={1333} className="size-full object-cover" />
              <ScanOverlay />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void to-transparent p-6">
                <p className="font-hud text-[0.6rem] text-neon-soft">Identidad visual · Protegida</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <SectionLabel code="03">El fundador</SectionLabel>
            <h2 className="mt-5 font-display text-4xl font-bold uppercase text-frost md:text-6xl">Moha Contreras</h2>
            <p className="font-hud mt-3 text-xs text-steel">Fundador de OverNight D Club</p>
            <p className="mt-6 max-w-lg text-lg text-steel">
              Quien encendió el primer motor de OverNight prefiere que hable la organización. Su rostro permanece en la
              sombra; su visión, en cada miembro de la familia.
            </p>
            <Button asChild variant="hud" className="mt-8">
              <Link to="/fundador">Abrir expediente</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* COMUNICADOS */}
      <section className="relative border-t border-border bg-void py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel code="04">Comunicados</SectionLabel>
              <h2 className="mt-5 font-display text-4xl font-bold uppercase text-frost md:text-5xl">Últimas transmisiones</h2>
            </div>
            <Button asChild variant="hud">
              <Link to="/comunicados">Todos los comunicados</Link>
            </Button>
          </Reveal>
          {news?.items.length ? (
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {news.items.map((a, i) => (
                <Reveal key={a.id} delay={i * 100}>
                  <AnnouncementCard a={a} />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal className="panel-hud mt-12 p-10 text-center">
              <Radio className="mx-auto size-8 text-primary animate-flicker" />
              <p className="font-hud mt-4 text-xs text-steel">Sin transmisiones activas</p>
              <p className="mt-2 text-muted-foreground">Los comunicados oficiales aparecerán aquí en cuanto se publiquen.</p>
            </Reveal>
          )}
        </div>
      </section>

      {/* CENTRO DE COMUNICACIONES + CTA */}
      <section className="relative isolate overflow-hidden py-24 md:py-36">
        <img src={heroSm} alt="" aria-hidden loading="lazy" width={960} height={544} className="absolute inset-0 -z-20 size-full object-cover opacity-25" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-void via-void/80 to-void" />
        <RainLayer dense={false} className="-z-10" />
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2 md:px-8">
          <Reveal className="panel-hud flex h-full flex-col p-8 md:p-10">
            <SectionLabel code="CC">Centro de comunicaciones</SectionLabel>
            <h2 className="mt-5 font-display text-3xl font-bold uppercase text-frost">Canal seguro de la familia</h2>
            <p className="mt-4 flex-1 text-steel">
              El punto de reunión digital de OverNight: avisos, coordinación de encuentros y contacto directo con la dirección.
            </p>
            {discord ? (
              <Button asChild variant="neon" size="lg" className="mt-8 self-start">
                <a href={discord} target="_blank" rel="noopener noreferrer">
                  Conectar al canal <ArrowRight />
                </a>
              </Button>
            ) : (
              <p className="font-hud mt-8 text-[0.65rem] text-muted-foreground">Canal en preparación · Acceso próximamente</p>
            )}
          </Reveal>
          <Reveal delay={150} className="panel-hud flex h-full flex-col p-8 md:p-10">
            <SectionLabel code="AF">Afiliación</SectionLabel>
            <h2 className="mt-5 font-display text-3xl font-bold uppercase text-frost">¿Quieres formar parte?</h2>
            <p className="mt-4 flex-1 text-steel">
              Inicia el protocolo de incorporación. La dirección revisa cada solicitud de forma individual.
            </p>
            <Button asChild variant="neon" size="lg" className="mt-8 self-start">
              <Link to="/afiliacion">
                Iniciar protocolo <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
