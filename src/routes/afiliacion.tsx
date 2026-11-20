import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Lock } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import {
  FormBlock,
  Honeypot,
  PrivacyCheck,
  SelectField,
  SubmitBar,
  SuccessPanel,
  TextAreaField,
  TextField,
} from "@/components/forms/Fields";
import { useZodForm } from "@/components/forms/use-zod-form";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { submitApplication } from "@/lib/public.functions";
import { settingsQuery } from "@/lib/queries";
import { applicationSchema, CONTACT_CHANNELS, type ApplicationInput } from "@/lib/schemas";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/afiliacion")({
  head: () => ({
    meta: [
      { title: "Solicitud de afiliación — OverNight D Club" },
      { name: "description", content: "Inicia el protocolo de incorporación a OverNight D Club. La dirección revisa cada solicitud." },
      { property: "og:title", content: "Solicitud de afiliación — OverNight D Club" },
      { property: "og:description", content: "Inicia el protocolo de incorporación a la familia OverNight." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Apply,
});

const initial: ApplicationInput = {
  alias: "",
  age: "" as unknown as number,
  contact_channel: "" as ApplicationInput["contact_channel"],
  contact_handle: "",
  email: "",
  introduction: "",
  motivation: "",
  availability: "",
  privacy_accepted: false as unknown as true,
  website: "",
};

const STEPS = [
  { code: "01", label: "Identificación", keys: ["alias", "age"] },
  { code: "02", label: "Canal de contacto", keys: ["contact_channel", "contact_handle", "email"] },
  { code: "03", label: "Expediente personal", keys: ["introduction", "motivation"] },
  { code: "04", label: "Confirmación", keys: ["privacy_accepted"] },
] as const;

function Apply() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const submit = useServerFn(submitApplication);
  const f = useZodForm(applicationSchema, initial, (data) => submit({ data }));
  const closed = settings.recruitment_open === "false";

  const done = (k: string) => {
    const v = (f.values as Record<string, unknown>)[k];
    return typeof v === "boolean" ? v : String(v ?? "").trim().length > 0;
  };

  return (
    <>
      <PageHeader code="AF" label="Protocolo de incorporación" title="Solicitud de afiliación">
        Cada solicitud se registra como un expediente y la dirección la revisa de forma individual.
      </PageHeader>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="panel-hud sticky top-28 p-6">
              <p className="font-hud text-[0.6rem] text-neon-soft">Progreso del protocolo</p>
              <ol className="mt-5 space-y-4">
                {STEPS.map((s) => {
                  const complete = s.keys.every(done);
                  return (
                    <li key={s.code} className="flex items-center gap-3">
                      <span
                        className={cn(
                          "chamfer-sm font-hud flex size-8 items-center justify-center border text-[0.6rem] transition-colors",
                          complete ? "border-primary bg-primary text-primary-foreground" : "border-border text-steel",
                        )}
                      >
                        {s.code}
                      </span>
                      <span className={cn("text-sm", complete ? "text-frost" : "text-steel")}>{s.label}</span>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-6 flex items-start gap-2 text-xs text-muted-foreground">
                <Lock className="mt-0.5 size-3.5 shrink-0" /> Solo la dirección de OverNight puede consultar tu solicitud.
              </p>
            </div>
          </aside>

          <div className="lg:col-span-9">
            {closed ? (
              <div className="panel-hud p-10 text-center">
                <p className="font-hud text-xs text-warning">Afiliaciones cerradas temporalmente</p>
                <h2 className="mt-4 font-display text-3xl font-bold text-frost">El protocolo está en pausa</h2>
                <p className="mt-4 text-steel">La dirección ha cerrado temporalmente las nuevas afiliaciones. Puedes escribirnos mientras tanto.</p>
                <Button asChild variant="hud" className="mt-8">
                  <Link to="/contacto">Canal de comunicaciones</Link>
                </Button>
              </div>
            ) : f.status === "success" ? (
              <SuccessPanel title="Expediente registrado">
                Tu solicitud ha entrado en revisión. La dirección se pondrá en contacto contigo a través del medio que nos has indicado.
              </SuccessPanel>
            ) : (
              <form onSubmit={f.onSubmit} noValidate className="relative space-y-6">
                <Honeypot value={f.values.website} onChange={(v) => f.set("website", v)} />
                <Reveal>
                  <FormBlock code="01" title="Identificación">
                    <TextField id="alias" label="Nombre o identificación de afiliación" required value={f.values.alias} onChange={(v) => f.set("alias", v)} error={f.errors.alias} maxLength={60} autoComplete="nickname" hint="El nombre con el que quieres ser reconocido en OverNight." />
                    <TextField id="age" label="Edad" type="number" inputMode="numeric" required value={f.values.age as number} onChange={(v) => f.set("age", v as unknown as number)} error={f.errors.age} />
                  </FormBlock>
                </Reveal>
                <Reveal>
                  <FormBlock code="02" title="Canal de contacto">
                    <SelectField id="contact_channel" label="Medio de comunicación" required options={CONTACT_CHANNELS} value={f.values.contact_channel} onChange={(v) => f.set("contact_channel", v as ApplicationInput["contact_channel"])} error={f.errors.contact_channel} />
                    <TextField id="contact_handle" label="Usuario o identificador en ese medio" required value={f.values.contact_handle} onChange={(v) => f.set("contact_handle", v)} error={f.errors.contact_handle} maxLength={100} />
                    <TextField id="email" label="Correo electrónico" type="email" required value={f.values.email} onChange={(v) => f.set("email", v)} error={f.errors.email} autoComplete="email" className="md:col-span-2" />
                  </FormBlock>
                </Reveal>
                <Reveal>
                  <FormBlock code="03" title="Expediente personal">
                    <TextAreaField id="introduction" label="Presentación personal" required value={f.values.introduction} onChange={(v) => f.set("introduction", v)} error={f.errors.introduction} maxLength={2000} className="md:col-span-2" placeholder="Quién eres, qué te mueve, tu relación con el mundo del motor…" />
                    <TextAreaField id="motivation" label="Motivos para formar parte de OverNight" required value={f.values.motivation} onChange={(v) => f.set("motivation", v)} error={f.errors.motivation} maxLength={2000} className="md:col-span-2" />
                    <TextAreaField id="availability" label="Disponibilidad o información adicional" value={f.values.availability} onChange={(v) => f.set("availability", v)} error={f.errors.availability} maxLength={1000} rows={3} className="md:col-span-2" />
                  </FormBlock>
                </Reveal>
                <Reveal>
                  <FormBlock code="04" title="Confirmación">
                    <div className="space-y-6 md:col-span-2">
                      <PrivacyCheck checked={!!f.values.privacy_accepted} onChange={(v) => f.set("privacy_accepted", v as true)} error={f.errors.privacy_accepted} />
                      <SubmitBar submitting={f.status === "submitting"} label="Enviar solicitud" formError={f.formError} />
                    </div>
                  </FormBlock>
                </Reveal>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
