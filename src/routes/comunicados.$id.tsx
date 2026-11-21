import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SectionLabel } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { announcementQuery } from "@/lib/queries";

export const Route = createFileRoute("/comunicados/$id")({
  loader: async ({ context, params }) => {
    if (!/^[0-9a-f-]{36}$/i.test(params.id)) throw notFound();
    const a = await context.queryClient.ensureQueryData(announcementQuery(params.id));
    if (!a) throw notFound();
    return a;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Comunicado no disponible — OverNight D Club" }, { name: "robots", content: "noindex" }] };
    const desc = (loaderData.excerpt || loaderData.content).slice(0, 155);
    const meta = [
      { title: `${loaderData.title} — OverNight D Club` },
      { name: "description", content: desc },
      { property: "og:title", content: loaderData.title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    return { meta: [...meta, ...(loaderData.image?.startsWith("https://") ? [{ property: "og:image", content: loaderData.image }, { name: "twitter:image", content: loaderData.image }] : [])] };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 pt-40 pb-24 text-center">
      <p className="font-hud text-xs text-neon-soft">Comunicado no disponible</p>
      <h1 className="mt-4 font-display text-4xl font-bold text-frost">Transmisión no encontrada</h1>
      <p className="mt-4 text-steel">Este comunicado no existe o ya no está publicado.</p>
      <Button asChild variant="neon" className="mt-8">
        <Link to="/comunicados">Ver comunicados</Link>
      </Button>
    </div>
  ),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const { data: a } = useSuspenseQuery(announcementQuery(id));
  if (!a) return null;
  const paragraphs = a.content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <article className="relative pt-28 pb-24 md:pt-36">
      <div aria-hidden className="bg-grid absolute inset-x-0 top-0 h-96 opacity-40" />
      <div className="relative mx-auto max-w-3xl px-4 md:px-8">
        <Button asChild variant="quiet" className="px-0">
          <Link to="/comunicados">
            <ArrowLeft /> Comunicados
          </Link>
        </Button>
        <SectionLabel className="mt-8">{a.category}</SectionLabel>
        <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-frost md:text-5xl">{a.title}</h1>
        <time className="font-hud mt-5 block text-[0.65rem] text-steel" dateTime={a.published_at ?? a.created_at}>
          {formatDate(a.published_at ?? a.created_at, true)}
        </time>
        {a.image && (
          <div className="chamfer mt-10 overflow-hidden border border-border">
            <img src={a.image} alt="" className="w-full object-cover" />
          </div>
        )}
        <div className="mt-10 space-y-6 text-lg leading-relaxed text-steel">
          {paragraphs.map((p, i) => (
            <p key={i} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
