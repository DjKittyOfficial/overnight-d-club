import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SpiderMark } from "@/components/brand/Logo";
import { formatDate } from "@/lib/format";
import type { PublicAnnouncement } from "@/lib/public.functions";

export function AnnouncementCard({ a }: { a: PublicAnnouncement }) {
  return (
    <Link
      to="/comunicados/$id"
      params={{ id: a.id }}
      className="panel-hud card-hud group flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-border bg-void">
        {a.image ? (
          <img src={a.image} alt="" loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="bg-grid flex size-full items-center justify-center">
            <SpiderMark className="size-12 opacity-50" />
          </div>
        )}
        <span className="font-hud absolute left-3 top-3 bg-void/80 px-2 py-1 text-[0.6rem] text-neon-soft backdrop-blur">
          {a.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <time className="font-hud text-[0.6rem] text-steel" dateTime={a.published_at ?? a.created_at}>
          {formatDate(a.published_at ?? a.created_at)}
        </time>
        <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-frost">{a.title}</h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm text-steel">{a.excerpt || a.content}</p>
        <span className="font-hud mt-5 inline-flex items-center gap-1 text-[0.65rem] text-neon-soft">
          Leer comunicado <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
