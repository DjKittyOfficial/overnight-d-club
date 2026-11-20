import { z } from "zod";

const email = z
  .string()
  .trim()
  .min(5, "Introduce un correo válido")
  .max(255, "Máximo 255 caracteres")
  .email("Introduce un correo válido");

const accept = z.literal(true, {
  errorMap: () => ({ message: "Debes aceptar la política de privacidad" }),
});

/** Honeypot: real people never fill it. */
const trap = z.string().max(0).optional().default("");

export const CONTACT_CHANNELS = ["Discord", "Correo electrónico", "Instagram", "Otro"] as const;
export const PROPOSAL_TYPES = [
  "Alianza permanente",
  "Evento conjunto",
  "Colaboración puntual",
  "Patrocinio",
  "Otra propuesta",
] as const;
export const CONTACT_REASONS = [
  "Información general",
  "Afiliación",
  "Alianzas",
  "Privacidad y datos",
  "Otro",
] as const;

export const applicationSchema = z.object({
  alias: z.string().trim().min(2, "Mínimo 2 caracteres").max(60, "Máximo 60 caracteres"),
  age: z.coerce
    .number({ invalid_type_error: "Introduce tu edad" })
    .int("Introduce un número entero")
    .min(14, "La edad mínima es 14 años")
    .max(99, "Introduce una edad válida"),
  contact_channel: z.enum(CONTACT_CHANNELS, { errorMap: () => ({ message: "Elige un medio" }) }),
  contact_handle: z.string().trim().min(2, "Indica tu usuario o contacto").max(100, "Máximo 100 caracteres"),
  email,
  introduction: z.string().trim().min(20, "Cuéntanos algo más (mín. 20 caracteres)").max(2000, "Máximo 2000 caracteres"),
  motivation: z.string().trim().min(20, "Cuéntanos algo más (mín. 20 caracteres)").max(2000, "Máximo 2000 caracteres"),
  availability: z.string().trim().max(1000, "Máximo 1000 caracteres").optional().default(""),
  privacy_accepted: accept,
  website: trap,
});
export type ApplicationInput = z.input<typeof applicationSchema>;

export const allianceSchema = z.object({
  organization_name: z.string().trim().min(2, "Mínimo 2 caracteres").max(100, "Máximo 100 caracteres"),
  representative: z.string().trim().min(2, "Mínimo 2 caracteres").max(80, "Máximo 80 caracteres"),
  proposal_type: z.enum(PROPOSAL_TYPES, { errorMap: () => ({ message: "Elige un tipo de propuesta" }) }),
  description: z.string().trim().min(20, "Describe la propuesta (mín. 20 caracteres)").max(3000, "Máximo 3000 caracteres"),
  contact_channel: z.string().trim().min(2, "Indica un medio de contacto").max(100, "Máximo 100 caracteres"),
  email,
  additional_info: z.string().trim().max(1500, "Máximo 1500 caracteres").optional().default(""),
  privacy_accepted: accept,
  website: trap,
});
export type AllianceInput = z.input<typeof allianceSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Mínimo 2 caracteres").max(80, "Máximo 80 caracteres"),
  email,
  reason: z.enum(CONTACT_REASONS, { errorMap: () => ({ message: "Elige un motivo" }) }),
  subject: z.string().trim().min(3, "Mínimo 3 caracteres").max(150, "Máximo 150 caracteres"),
  message: z.string().trim().min(10, "Mínimo 10 caracteres").max(3000, "Máximo 3000 caracteres"),
  privacy_accepted: accept,
  website: trap,
});
export type ContactInput = z.input<typeof contactSchema>;

export const announcementSchema = z.object({
  title: z.string().trim().min(3, "Mínimo 3 caracteres").max(160, "Máximo 160 caracteres"),
  category: z.string().trim().min(2, "Mínimo 2 caracteres").max(40, "Máximo 40 caracteres"),
  excerpt: z.string().trim().max(300, "Máximo 300 caracteres").optional().default(""),
  content: z.string().trim().min(1, "El contenido es obligatorio").max(20000, "Máximo 20000 caracteres"),
});

/** Flatten zod issues into a field → message map for forms. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export const SETTING_KEYS = [
  "discord_url",
  "instagram_url",
  "tiktok_url",
  "youtube_url",
  "x_url",
  "contact_email",
  "privacy_controller",
  "privacy_contact_email",
  "recruitment_open",
  "hero_intro",
] as const;
export type SettingKey = (typeof SETTING_KEYS)[number];
export type SiteSettings = Record<SettingKey, string>;

export function isSafeUrl(value: string): boolean {
  if (!value) return true;
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}
