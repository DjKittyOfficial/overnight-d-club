import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Handshake } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import { FormBlock, Honeypot, PrivacyCheck, SelectField, SubmitBar, SuccessPanel, TextAreaField, TextField } from "@/components/forms/Fields";
import { useZodForm } from "@/components/forms/use-zod-form";
import { PageHeader, SectionLabel } from "@/components/site/PageHeader";
import { submitAlliance } from "@/lib/public.functions";
import { allianceSchema, PROPOSAL_TYPES, type AllianceInput } from "@/lib/schemas";

export const Route = createFileRoute("/alianzas")({
  head: () => ({
    meta: [
      { title: "Alianzas y colaboraciones — OverNight D Club" },
      { name: "description", content: "Organizaciones interesadas en establecer relaciones con OverNight D Club: envía tu propuesta de alianza." },
      { property: "og:title", content: "Alianzas y colaboraciones — OverNight D Club" },
      { property: "og:description", content: "Envía una propuesta de alianza o colaboración a la dirección de OverNight." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Alliances,
});

const initial: AllianceInput = {
  organization_name: "",
  representative: "",
  proposal_type: "" as AllianceInput["proposal_type"],
  description: "",
  contact_channel: "",
  email: "",
  additional_info: "",
  privacy_accepted: false as unknown as true,
  website: "",
};

function Alliances() {
  const submit = useServerFn(submitAlliance);
  const f = useZodForm(allianceSchema, initial, (data) => submit({ data }));

  return (
    <>
      <PageHeader code="05" label="Relaciones externas" title="Alianzas y colaboraciones">
        OverNight está abierta a establecer relaciones con otras organizaciones que compartan el respeto por la cultura del motor.
      </PageHeader>
      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <Reveal className="panel-hud sticky top-28 p-8">
              <Handshake className="size-8 text-neon-soft" />
              <SectionLabel className="mt-6">Cómo funciona</SectionLabel>
              <ol className="mt-5 space-y-4 text-sm text-steel">
                <li><span className="font-hud mr-2 text-primary">01</span>Envía la propuesta con los datos de tu organización.</li>
                <li><span className="font-hud mr-2 text-primary">02</span>La dirección la estudia y valora su encaje.</li>
                <li><span className="font-hud mr-2 text-primary">03</span>Si procede, contactaremos con el representante indicado.</li>
              </ol>
            </Reveal>
          </aside>
          <div className="lg:col-span-8">
            {f.status === "success" ? (
              <SuccessPanel title="Propuesta recibida" onReset={f.reset} resetLabel="Enviar otra propuesta">
                La dirección de OverNight revisará la propuesta y responderá a través del medio de contacto indicado.
              </SuccessPanel>
            ) : (
              <form onSubmit={f.onSubmit} noValidate className="relative space-y-6">
                <Honeypot value={f.values.website} onChange={(v) => f.set("website", v)} />
                <FormBlock code="01" title="Organización">
                  <TextField id="organization_name" label="Nombre de la organización" required value={f.values.organization_name} onChange={(v) => f.set("organization_name", v)} error={f.errors.organization_name} maxLength={100} autoComplete="organization" />
                  <TextField id="representative" label="Representante" required value={f.values.representative} onChange={(v) => f.set("representative", v)} error={f.errors.representative} maxLength={80} />
                </FormBlock>
                <FormBlock code="02" title="Propuesta">
                  <SelectField id="proposal_type" label="Tipo de propuesta" required options={PROPOSAL_TYPES} value={f.values.proposal_type} onChange={(v) => f.set("proposal_type", v as AllianceInput["proposal_type"])} error={f.errors.proposal_type} className="md:col-span-2" />
                  <TextAreaField id="description" label="Descripción" required value={f.values.description} onChange={(v) => f.set("description", v)} error={f.errors.description} maxLength={3000} className="md:col-span-2" />
                </FormBlock>
                <FormBlock code="03" title="Contacto">
                  <TextField id="contact_channel" label="Medio de contacto" required placeholder="Discord, Instagram…" value={f.values.contact_channel} onChange={(v) => f.set("contact_channel", v)} error={f.errors.contact_channel} maxLength={100} />
                  <TextField id="email" label="Correo electrónico" type="email" required value={f.values.email} onChange={(v) => f.set("email", v)} error={f.errors.email} autoComplete="email" />
                  <TextAreaField id="additional_info" label="Información adicional" value={f.values.additional_info} onChange={(v) => f.set("additional_info", v)} error={f.errors.additional_info} maxLength={1500} rows={3} className="md:col-span-2" />
                  <div className="space-y-6 md:col-span-2">
                    <PrivacyCheck checked={!!f.values.privacy_accepted} onChange={(v) => f.set("privacy_accepted", v as true)} error={f.errors.privacy_accepted} />
                    <SubmitBar submitting={f.status === "submitting"} label="Enviar propuesta" formError={f.formError} />
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
