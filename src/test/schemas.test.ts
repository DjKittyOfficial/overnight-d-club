import { describe, expect, it } from "vitest";
import { applicationSchema, contactSchema, allianceSchema } from "@/lib/schemas";

const app = {
  alias: "Nocturno",
  age: 20,
  contact_channel: "Discord",
  contact_handle: "nocturno#0001",
  email: "a@b.es",
  introduction: "Me apasionan los motores desde siempre.",
  motivation: "Quiero formar parte de una familia de verdad.",
  privacy_accepted: true,
};

describe("Solicitud de afiliación", () => {
  it("acepta una solicitud válida", () => {
    expect(applicationSchema.safeParse(app).success).toBe(true);
  });
  it("rechaza menores de 14 años", () => {
    expect(applicationSchema.safeParse({ ...app, age: 13 }).success).toBe(false);
  });
  it("exige aceptar la política de privacidad", () => {
    expect(applicationSchema.safeParse({ ...app, privacy_accepted: false }).success).toBe(false);
  });
});

describe("Contacto y alianzas", () => {
  it("el mensaje de contacto exige privacidad aceptada", () => {
    const base = { name: "Ana", email: "ana@x.es", reason: "Otro", subject: "Hola", message: "Un mensaje de prueba", privacy_accepted: false };
    expect(contactSchema.safeParse(base).success).toBe(false);
  });
  it("la propuesta de alianza exige un correo válido", () => {
    const base = {
      organization_name: "Org",
      representative: "Rep",
      proposal_type: "Evento conjunto",
      description: "Una propuesta suficientemente larga.",
      contact_channel: "Discord",
      email: "no-es-correo",
      privacy_accepted: true,
    };
    expect(allianceSchema.safeParse(base).success).toBe(false);
  });
});
