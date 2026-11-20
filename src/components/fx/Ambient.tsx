import { cn } from "@/lib/utils";

export function RainLayer({ className, dense = true }: { className?: string; dense?: boolean }) {
  return (
    <div aria-hidden data-fx="motion" className={cn("pointer-events-none absolute inset-0", className)}>
      <div className="rain-slow absolute inset-0" />
      {dense && <div className="rain absolute inset-0 hidden md:block" />}
    </div>
  );
}

export function ScanOverlay({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="scanlines absolute inset-0 opacity-40" />
      <div data-fx="motion" className="animate-scan absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
    </div>
  );
}
