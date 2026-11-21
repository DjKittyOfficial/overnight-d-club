import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { LogoEmblem } from "@/components/brand/Logo";
import { TextField } from "@/components/forms/Fields";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/restablecer")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Restablecer contraseña — OverNight D Club" },
      { name: "description", content: "Define una nueva contraseña para tu cuenta de dirección." },
      { property: "og:title", content: "Restablecer contraseña — OverNight D Club" },
      { property: "og:description", content: "Define una nueva contraseña para tu cuenta de dirección." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Reset,
});

function Reset() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data: d }) => d.session && setReady(true));
    return () => data.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (pw.length < 8) return setErr("La contraseña debe tener al menos 8 caracteres.");
    if (pw !== pw2) return setErr("Las contraseñas no coinciden.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setErr("No se pudo actualizar la contraseña. Solicita un nuevo enlace.");
    navigate({ to: "/admin", replace: true });
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-28 pb-16">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
      <div className="panel-hud relative w-full max-w-md p-8 md:p-10">
        <LogoEmblem className="mx-auto size-16" eager />
        <h1 className="mt-6 text-center font-display text-2xl font-bold uppercase text-frost">Nueva contraseña</h1>
        {!ready ? (
          <div className="mt-6 text-center text-sm text-steel">
            <p>Verificando el enlace de recuperación…</p>
            <p className="mt-3">
              Si el enlace ha caducado, <Link to="/auth" className="text-neon-soft underline">solicita uno nuevo</Link>.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-8 space-y-5">
            <TextField id="pw" label="Nueva contraseña" type="password" autoComplete="new-password" value={pw} onChange={setPw} />
            <TextField id="pw2" label="Repite la contraseña" type="password" autoComplete="new-password" value={pw2} onChange={setPw2} />
            {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
            <Button type="submit" variant="neon" size="lg" className="w-full" disabled={busy}>
              {busy && <Loader2 className="animate-spin" />} Guardar contraseña
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
