import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { settingsQuery } from "@/lib/queries";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de privacidad — OverNight D Club" },
      { name: "description", content: "Cómo trata OverNight D Club los datos personales enviados a través de sus formularios." },
      { property: "og:title", content: "Política de privacidad — OverNight D Club" },
      { property: "og:description", content: "Información sobre el tratamiento de datos personales en OverNight D Club." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

function Pending() {
  return <span className="font-hud text-[0.65rem] text-warning">[Pendiente de configurar por la dirección]</span>;
}

function Block({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border py-10">
      <h2 className="flex items-baseline gap-4 font-display text-2xl font-bold uppercase text-frost">
        <span className="font-hud text-xs text-primary">{n}</span> {title}
      </h2>
      <div className="mt-5 space-y-4 leading-relaxed text-steel [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-frost">{children}</div>
    </section>
  );
}

function Privacy() {
  const { data: s } = useSuspenseQuery(settingsQuery);
  const contact = s.privacy_contact_email || s.contact_email;

  return (
    <>
      <PageHeader code="LG" label="Documento legal" title="Política de privacidad">
        Información transparente sobre qué datos recogemos, para qué y qué derechos tienes.
      </PageHeader>
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-20">
        <p className="panel-hud p-5 text-sm text-steel">
          Este documento describe el funcionamiento real de este sitio web. Los datos identificativos del responsable los
          completa la dirección desde su panel. Si tienes dudas sobre su contenido, puedes consultarnos a través del{" "}
          <Link to="/contacto" className="text-neon-soft underline underline-offset-4">canal de comunicaciones</Link>.
        </p>

        <Block n="01" title="Responsable del tratamiento">
          <p><strong>Responsable:</strong> {s.privacy_controller || <Pending />}</p>
          <p><strong>Contacto para privacidad:</strong> {contact ? <a className="text-neon-soft" href={`mailto:${contact}`}>{contact}</a> : <Pending />}</p>
        </Block>

        <Block n="02" title="Datos que recogemos">
          <p>Solo tratamos los datos que nos facilitas voluntariamente a través de los formularios del sitio:</p>
          <ul>
            <li><strong>Solicitud de afiliación:</strong> nombre o identificación de afiliación, edad, medio de comunicación y usuario en él, correo electrónico, presentación personal, motivos y disponibilidad o información adicional.</li>
            <li><strong>Alianzas y colaboraciones:</strong> nombre de la organización, representante, tipo de propuesta, descripción, medio de contacto, correo electrónico e información adicional.</li>
            <li><strong>Canal de comunicaciones:</strong> nombre, correo electrónico, motivo, asunto y mensaje.</li>
            <li><strong>Acceso de la dirección:</strong> correo electrónico y contraseña de las cuentas de administración (la contraseña se almacena cifrada, nunca en texto plano).</li>
          </ul>
          <p>No pedimos datos que no sean necesarios para atender cada solicitud.</p>
        </Block>

        <Block n="03" title="Finalidades">
          <ul>
            <li>Valorar las solicitudes de afiliación y contactar con quien las envía.</li>
            <li>Estudiar y responder propuestas de alianza o colaboración.</li>
            <li>Atender las consultas recibidas por el canal de comunicaciones.</li>
            <li>Gestionar el acceso seguro al panel de administración.</li>
          </ul>
        </Block>

        <Block n="04" title="Base jurídica">
          <p>
            El tratamiento se basa en el <strong>consentimiento</strong> que otorgas al marcar la casilla de aceptación de
            esta política antes de enviar cada formulario. Puedes retirarlo en cualquier momento escribiendo al contacto
            de privacidad indicado arriba.
          </p>
        </Block>

        <Block n="05" title="Conservación">
          <p>
            Los datos se conservan mientras sean necesarios para atender la solicitud o mientras la relación con OverNight
            se mantenga. La dirección puede eliminar solicitudes y mensajes desde su panel, y lo hará cuando lo solicites o
            cuando dejen de ser necesarios.
          </p>
        </Block>

        <Block n="06" title="Destinatarios y servicios externos">
          <p>Los datos no se ceden a terceros. Solo la dirección de OverNight, con acceso autenticado, puede consultarlos.</p>
          <p>Para funcionar, el sitio utiliza estos servicios de terceros:</p>
          <ul>
            <li><strong>Alojamiento, base de datos y autenticación:</strong> el sitio y los datos de los formularios se alojan en la infraestructura en la nube de Lovable.</li>
            <li><strong>Tipografías:</strong> las fuentes se cargan desde Google Fonts, que puede recibir tu dirección IP al mostrar la página.</li>
            <li><strong>Enlaces externos:</strong> los enlaces al centro de comunicaciones (Discord) u otras redes llevan a servicios con sus propias políticas de privacidad.</li>
          </ul>
        </Block>

        <Block n="07" title="Tus derechos">
          <p>
            Puedes solicitar el acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad de
            tus datos, así como retirar tu consentimiento, escribiendo al contacto de privacidad. También puedes presentar
            una reclamación ante la autoridad de protección de datos competente.
          </p>
        </Block>

        <Block n="08" title="Información de contacto">
          <p>
            Para cualquier cuestión sobre esta política: {contact ? <a className="text-neon-soft" href={`mailto:${contact}`}>{contact}</a> : <Pending />}, o a través del{" "}
            <Link to="/contacto" className="text-neon-soft underline underline-offset-4">canal de comunicaciones</Link>.
          </p>
        </Block>

        <Block n="09" title="Cookies y almacenamiento local">
          <p>
            Este sitio no utiliza cookies publicitarias ni de analítica. Solo el panel de administración guarda en el
            navegador la sesión de acceso de la dirección, imprescindible para su funcionamiento.
          </p>
        </Block>
      </div>
    </>
  );
}
