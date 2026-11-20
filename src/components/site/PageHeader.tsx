import type { ReactNode } from "react";
import { RainLayer, ScanOverlay } from "@/components/fx/Ambient";
import { cn } from "@/lib/utils";

export function SectionLabel({ code, children, className }: { code?: string; children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-hud flex items-center gap-3 text-[0.68rem] text-neon-soft", className)}>
      {code && <span className="text-primary">[{code}]</span>}
      <span>{children}</span>
      <span aria-hidden className="h-px w-12 bg-gradient-neon" />
    </p>
  );
}

export function PageHeader({
  code,
  label,
  title,
  children,
  image,
}: {
  code: string;
  label: string;
  title: string;
  children?: ReactNode;
  image?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border pt-32 pb-16 md:pt-44 md:pb-24">
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden
          className="animate-kenburns absolute inset-0 -z-20 size-full object-cover opacity-35"
          width={1920}
          height={1088}
        />
      )}
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-60" />
      <div aria-hidden className="bg-fade-b absolute inset-0 -z-10" />
      <RainLayer dense={false} className="-z-10 opacity-60" />
      <ScanOverlay className="-z-10" />
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionLabel code={code}>{label}</SectionLabel>
        <h1
          data-text={title}
          className="glitch mt-5 max-w-4xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-frost sm:text-5xl md:text-7xl"
        >
          {title}
        </h1>
        {children && <div className="mt-6 max-w-2xl text-lg text-steel md:text-xl">{children}</div>}
      </div>
    </section>
  );
}
