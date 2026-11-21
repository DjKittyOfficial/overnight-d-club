import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { LogoEmblem } from "@/components/brand/Logo";
import { TextField } from "@/components/forms/Fields";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Acceso de la dirección — OverNight D Club" },
      { name: "description", content: "Acceso privado al panel de la dirección de OverNight D Club." },
      { property: "og:title", content: "Acceso de la dirección — OverNight D Club" },
      { property: "og:description", content: "Acceso privado al panel de la dirección." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/admin" });
  },
  loader: async () => {
    const { data } = await supabase.rpc("admin_exists");
    return { adminExists: data !== false };
  },
  component: AuthPage,
});

type Mode = "login" | "forgot";

const creds = z.object({
  email: z.string().trim().email("Introduce un correo válido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErrors({});
    if (mode === "forgot") {
      const r = z.string().trim().email().safeParse(email);
      if (!r.success) return setErrors({ email: "Introduce un correo válido" });
      setBusy(true);
      const { error } = await supabase.auth.resetPasswordForEmail(r.data, {
        redirectTo: `${window.location.origin}/restablecer`,
      });
      setBusy(false);
      setMsg(
        error
          ? { kind: "err", text: "No se pudo enviar el correo. Inténtalo más tarde." }
          : { kind: "ok", text: "Si la cuenta existe, recibirás un correo con un enlace para restablecer la contraseña." },
      );
      return;
    }
    const r = creds.safeParse({ email, password });
    if (!r.success) {
      const fe: Record<string, string> = {};
      for (const i of r.error.issues) fe[String(i.path[0])] ??= i.message;
      return setErrors(fe);
    }
    setBusy(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword(r.data);
      setBusy(false);
      if (error) return setMsg({ kind: "err", text: "Credenciales no válidas o cuenta sin confirmar." });
      navigate({ to: "/admin", replace: true });
      return;
    }

  }

  const titles: Record<Mode, string> = {
    login: "Acceso de la dirección",
    forgot: "Recuperar contraseña",
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-28 pb-16">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
      <div className="panel-hud relative w-full max-w-md p-8 md:p-10">
        <LogoEmblem className="mx-auto size-20 animate-pulse-neon" eager />
        <p className="font-hud mt-6 text-center text-[0.6rem] text-neon-soft">Terminal restringida</p>
        <h1 className="mt-2 text-center font-display text-2xl font-bold uppercase text-frost">{titles[mode]}</h1>
        <form onSubmit={submit} noValidate className="mt-8 space-y-5">
          <TextField id="email" label="Correo electrónico" type="email" autoComplete="email" value={email} onChange={setEmail} error={errors["email"]} />
          {mode !== "forgot" && (
            <TextField
              id="password"
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={setPassword}
              error={errors["password"]}
            />
          )}
          {msg && (
            <p role={msg.kind === "err" ? "alert" : "status"} className={msg.kind === "err" ? "text-sm text-destructive" : "text-sm text-success"}>
              {msg.text}
            </p>
          )}
          <Button type="submit" variant="neon" size="lg" className="w-full" disabled={busy}>
            {busy && <Loader2 className="animate-spin" />}
            {mode === "login" ? "Iniciar sesión" : "Enviar enlace"}
          </Button>
        </form>
        <div className="mt-6 flex flex-col items-center gap-2">
          {mode !== "login" && (
            <Button variant="quiet" onClick={() => { setMode("login"); setMsg(null); }}>Volver al inicio de sesión</Button>
          )}
          {mode === "login" && (
            <Button variant="quiet" onClick={() => { setMode("forgot"); setMsg(null); }}>¿Has olvidado la contraseña?</Button>
          )}

        </div>
      </div>
    </section>
  );
}
