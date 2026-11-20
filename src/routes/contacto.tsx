import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Radio } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import { FormBlock, Honeypot, PrivacyCheck, SelectField, SubmitBar, SuccessPanel, TextAreaField, TextField } from "@/components/forms/Fields";
import { useZodForm } from "@/components/forms/use-zod-form";
import { PageHeader, SectionLabel } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { submitContact } from "@/lib/public.functions";
import { settingsQuery } from "@/lib/queries";
import { CONTACT_REASONS, contactSchema, type ContactInput } from "@/lib/schemas";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Canal de comunicaciones — OverNight D Club" },
      { name: "description", content: "Contacta con la dirección de OverNight D Club o accede al centro de comunicaciones." },
      { property: "og:title", content: "Canal de comunicaciones — OverNight D Club" },
      { property: "og:description", content: "Contacta con la dirección de OverNight D Club." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

const initial: ContactInput = {
  name: "",
  email: "",
  reason: "" as ContactInput["reason"],
  subject: "",
  message: "",
  privacy_accepted: false as unknown as true,
  website: "",
};

function Contact() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const submit = useServerFn(submitContact);
  const f = useZodForm(contactSchema, initial, (data) => submit({ data }));

  return (
    <>
      <PageHeader code="06" label="Línea directa con la dirección" title="Canal de comunicaciones">
        Para cualquier consulta, escríbenos. Cada mensaje llega directamente a la dirección de OverNight.
      </PageHeader>
      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-12">
          <aside className="space-y-6 lg:col-span-4">
            <Reveal className="panel-hud relative overflow-hidden p-8">
              <div aria-hidden className="scanlines absolute inset-0 opacity-30" />
              <div className="relative">
                <Radio className="size-8 text-neon-soft animate-flicker" />
                <SectionLabel className="mt-6">Centro de comunicaciones</SectionLabel>
                <h2 className="mt-4 font-display text-2xl font-bold uppercase text-frost">Canal seguro de OverNight</h2>
                <p className="mt-3 text-sm text-steel">El espacio donde la familia se coordina, recibe avisos y mantiene el contacto.</p>
                {settings.discord_url ? (
                  <Button asChild variant="neon" className="mt-6">
                    <a href={settings.discord_url} target="_blank" rel="noopener noreferrer">
                      Conectar al canal <ArrowRight />
                    </a>
                  </Button>
                ) : (
                  <p className="font-hud mt-6 text-[0.6rem] text-muted-foreground">Canal en preparación · Acceso próximamente</p>
                )}
              </div>
            </Reveal>
            {settings.contact_email && (
              <Reveal className="panel-hud p-8">
                <SectionLabel>Correo oficial</SectionLabel>
                <a href={`mailto:${settings.contact_email}`} className="mt-4 block break-all font-display text-lg text-frost hover:text-neon-soft">
                  {settings.contact_email}
                </a>
              </Reveal>
            )}
          </aside>
          <div className="lg:col-span-8">
            {f.status === "success" ? (
              <SuccessPanel title="Mensaje enviado" onReset={f.reset} resetLabel="Enviar otro mensaje">
                Hemos recibido tu mensaje. La dirección responderá al correo indicado lo antes posible.
              </SuccessPanel>
            ) : (
              <form onSubmit={f.onSubmit} noValidate className="relative">
                <Honeypot value={f.values.website} onChange={(v) => f.set("website", v)} />
                <FormBlock code="MSG" title="Nuevo mensaje">
                  <TextField id="name" label="Nombre" required value={f.values.name} onChange={(v) => f.set("name", v)} error={f.errors.name} maxLength={80} autoComplete="name" />
                  <TextField id="email" label="Correo electrónico" type="email" required value={f.values.email} onChange={(v) => f.set("email", v)} error={f.errors.email} autoComplete="email" />
                  <SelectField id="reason" label="Motivo de contacto" required options={CONTACT_REASONS} value={f.values.reason} onChange={(v) => f.set("reason", v as ContactInput["reason"])} error={f.errors.reason} />
                  <TextField id="subject" label="Asunto" required value={f.values.subject} onChange={(v) => f.set("subject", v)} error={f.errors.subject} maxLength={150} />
                  <TextAreaField id="message" label="Mensaje" required value={f.values.message} onChange={(v) => f.set("message", v)} error={f.errors.message} maxLength={3000} rows={6} className="md:col-span-2" />
                  <div className="space-y-6 md:col-span-2">
                    <PrivacyCheck checked={!!f.values.privacy_accepted} onChange={(v) => f.set("privacy_accepted", v as true)} error={f.errors.privacy_accepted} />
                    <SubmitBar submitting={f.status === "submitting"} label="Enviar mensaje" formError={f.formError} />
                  </div>
                </FormBlock>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
