import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AdminTitle } from "@/components/admin/AdminShell";
import { TextAreaField, TextField } from "@/components/forms/Fields";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { isSafeUrl, SETTING_KEYS, type SettingKey, type SiteSettings } from "@/lib/schemas";

export const Route = createFileRoute("/_authenticated/admin/configuracion")({
  component: SettingsPage,
});

const url = z.string().trim().max(500).refine(isSafeUrl, "Debe ser una URL completa (https://…)");
const mail = z.union([z.literal(""), z.string().trim().email("Correo no válido")]);
const settingsSchema = z.object({
  discord_url: url,
  instagram_url: url,
  tiktok_url: url,
  youtube_url: url,
  x_url: url,
  contact_email: mail,
  privacy_controller: z.string().trim().max(300),
  privacy_contact_email: mail,
  recruitment_open: z.enum(["true", "false"]),
  hero_intro: z.string().trim().max(400, "Máximo 400 caracteres"),
});

const LINKS: { key: SettingKey; label: string; hint?: string }[] = [
  { key: "discord_url", label: "Discord · Centro de comunicaciones", hint: "Invitación al servidor de Discord. Si se deja vacío, el botón no se muestra." },
  { key: "instagram_url", label: "Instagram" },
  { key: "tiktok_url", label: "TikTok" },
  { key: "youtube_url", label: "YouTube" },
  { key: "x_url", label: "X" },
];

function SettingsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key, value");
      if (error) throw error;
      const out = Object.fromEntries(SETTING_KEYS.map((k) => [k, ""])) as SiteSettings;
      for (const r of data) if ((SETTING_KEYS as readonly string[]).includes(r.key)) out[r.key as SettingKey] = r.value;
      if (!out.recruitment_open) out.recruitment_open = "true";
      return out;
    },
  });
  const [v, setV] = useState<SiteSettings | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    if (data) setV(data);
  }, [data]);

  const save = useMutation({
    mutationFn: async (values: SiteSettings) => {
      const rows = SETTING_KEYS.map((key) => ({ key, value: values[key] }));
      const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      qc.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Configuración guardada");
    },
    onError: () => toast.error("No se pudo guardar la configuración"),
  });

  if (isLoading || !v) return <><AdminTitle code="CF" title="Configuración" /><Skeleton className="h-96 rounded-none" /></>;

  const set = (k: SettingKey, val: string) => {
    setV({ ...v, [k]: val });
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = settingsSchema.safeParse(v);
    if (!r.success) {
      const fe: Record<string, string> = {};
      for (const i of r.error.issues) fe[String(i.path[0])] ??= i.message;
      setErrors(fe);
      return;
    }
    save.mutate(r.data as SiteSettings);
  }

  return (
    <>
      <AdminTitle code="CF" title="Configuración" />
      <form onSubmit={submit} noValidate className="max-w-3xl space-y-8">
        <section className="panel-hud space-y-5 p-6">
          <h2 className="font-hud text-[0.65rem] text-neon-soft">Enlaces oficiales</h2>
          {LINKS.map((l) => (
            <TextField key={l.key} id={l.key} label={l.label} hint={l.hint} type="url" placeholder="https://" value={v[l.key]} onChange={(x) => set(l.key, x)} error={errors[l.key]} />
          ))}
        </section>
        <section className="panel-hud space-y-5 p-6">
          <h2 className="font-hud text-[0.65rem] text-neon-soft">Información pública</h2>
          <TextAreaField id="hero_intro" label="Presentación breve de la portada" hint="Si se deja vacío se muestra el texto por defecto." value={v.hero_intro} onChange={(x) => set("hero_intro", x)} error={errors["hero_intro"]} maxLength={400} rows={3} />
          <TextField id="contact_email" label="Correo de contacto público" type="email" value={v.contact_email} onChange={(x) => set("contact_email", x)} error={errors["contact_email"]} />
          <div className="flex items-center justify-between gap-4 border border-border p-4">
            <div>
              <Label htmlFor="recruitment" className="text-frost">Afiliaciones abiertas</Label>
              <p className="text-xs text-muted-foreground">Si se desactiva, el formulario de afiliación muestra un aviso de cierre temporal.</p>
            </div>
            <Switch id="recruitment" checked={v.recruitment_open !== "false"} onCheckedChange={(c) => set("recruitment_open", c ? "true" : "false")} />
          </div>
        </section>
        <section className="panel-hud space-y-5 p-6">
          <h2 className="font-hud text-[0.65rem] text-neon-soft">Política de privacidad</h2>
          <TextField id="privacy_controller" label="Responsable del tratamiento" hint="Nombre o denominación del responsable, tal y como debe figurar en la política." value={v.privacy_controller} onChange={(x) => set("privacy_controller", x)} error={errors["privacy_controller"]} />
          <TextField id="privacy_contact_email" label="Correo para asuntos de privacidad" type="email" value={v.privacy_contact_email} onChange={(x) => set("privacy_contact_email", x)} error={errors["privacy_contact_email"]} />
        </section>
        <Button type="submit" variant="neon" size="lg" disabled={save.isPending}>
          {save.isPending && <Loader2 className="animate-spin" />} Guardar configuración
        </Button>
      </form>
    </>
  );
}
