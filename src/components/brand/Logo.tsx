import { Link } from "@tanstack/react-router";
import logoMarkAsset from "@/assets/logo-overnight-mark.png.asset.json";
const logoMark = logoMarkAsset.url;
import { cn } from "@/lib/utils";

/** Simplified vector mark: geometric spider over a crescent moon. Works at 16px. */
export function SpiderMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("text-neon", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d="M21 7 A27 27 0 1 0 57 43 A21.5 21.5 0 1 1 21 7 Z" fill="currentColor" opacity="0.9" />
      <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="miter" strokeLinecap="square">
        <path d="M28.5 26 L19 17 L13 21" />
        <path d="M27.5 29.5 L15 26 L8 31" />
        <path d="M27.5 33 L16 37 L11 45" />
        <path d="M28.5 36 L21 45 L20 55" />
        <path d="M35.5 26 L45 17 L51 21" />
        <path d="M36.5 29.5 L49 26 L56 31" />
        <path d="M36.5 33 L48 37 L53 45" />
        <path d="M35.5 36 L43 45 L44 55" />
      </g>
      <path d="M32 14 L35.5 19 L32 23 L28.5 19 Z" fill="currentColor" />
      <path d="M32 22.5 L38.5 30 L32 46 L25.5 30 Z" fill="currentColor" />
      <path d="M32 26 L34 30 L32 38 L30 30 Z" fill="var(--void)" />
    </svg>
  );
}

/** Main emblem (raster, transparent) for hero and large placements. */
export function LogoEmblem({ className, eager }: { className?: string; eager?: boolean }) {
  return (
    <img
      src={logoMark}
      alt="Emblema de OverNight D Club: araña geométrica con luna creciente"
      width={512}
      height={512}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={cn("select-none", className)}
    />
  );
}

export function Wordmark({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex flex-col leading-none", className)}>
      <span className="font-display text-base font-bold tracking-[0.22em] text-frost">OVERNIGHT</span>
      {!compact && <span className="font-hud mt-1 text-[0.6rem] text-neon-soft">D · CLUB</span>}
    </span>
  );
}

export function BrandLink({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("group flex items-center gap-3", className)} aria-label="OverNight D Club — Inicio">
      <SpiderMark className="size-9 transition-transform duration-500 group-hover:rotate-[8deg] animate-pulse-neon" />
      <Wordmark />
    </Link>
  );
}
