import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { LogoEmblem, Wordmark } from "@/components/brand/Logo";
import { settingsQuery } from "@/lib/queries";
import { NAV_LINKS } from "./nav";

const SOCIALS = [
  { key: "discord_url", label: "Discord · Centro de comunicaciones" },
  { key: "instagram_url", label: "Instagram" },
  { key: "tiktok_url", label: "TikTok" },
  { key: "youtube_url", label: "YouTube" },
  { key: "x_url", label: "X" },
] as const;

export function SiteFooter() {
  const { data: settings } = useQuery(settingsQuery);
  const socials = SOCIALS.filter((s) => settings?.[s.key]);

  return (
    <footer className="relative overflow-hidden border-t border-border bg-void">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <div className="flex items-center gap-4">
            <LogoEmblem className="size-16" />
            <Wordmark />
          </div>
          <p className="mt-6 max-w-sm font-display text-lg text-frost">«Una familia unida por los motores».</p>
          <p className="font-hud mt-6 flex items-center gap-2 text-[0.65rem] text-muted-foreground">
            <span className="size-1.5 animate-blink rounded-full bg-success" /> Canal seguro · Señal estable
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="font-hud mb-4 text-[0.65rem] text-neon-soft">Navegación</p>
          <ul className="space-y-2.5">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-steel transition-colors hover:text-frost">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/afiliacion" className="text-sm text-steel transition-colors hover:text-frost">
                Solicitud de afiliación
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="font-hud mb-4 text-[0.65rem] text-neon-soft">Enlaces oficiales</p>
          {socials.length ? (
            <ul className="space-y-2.5">
              {socials.map((s) => (
                <li key={s.key}>
                  <a
                    href={settings![s.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-steel transition-colors hover:text-frost"
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Los canales oficiales se publicarán próximamente.</p>
          )}
          {settings?.contact_email && (
            <a href={`mailto:${settings.contact_email}`} className="mt-4 block text-sm text-steel hover:text-frost">
              {settings.contact_email}
            </a>
          )}
        </div>
      </div>
      <div className="relative border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
          <p className="font-hud text-[0.6rem]">© {new Date().getFullYear()} OverNight D Club</p>
          <div className="flex gap-6">
            <Link to="/privacidad" className="hover:text-frost">
              Política de privacidad
            </Link>
            <Link to="/auth" className="hover:text-frost">
              Acceso dirección
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
