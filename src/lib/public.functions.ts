import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import {
  allianceSchema,
  applicationSchema,
  contactSchema,
  SETTING_KEYS,
  type SiteSettings,
} from "@/lib/schemas";

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

/** Signed URLs are built on the server URL; browsers must reach the public one. */
function toBrowserUrl(signed: string) {
  const server = (process.env["SUPABASE_URL"] ?? "").replace(/\/+$/, "");
  const browser = (import.meta.env["VITE_SUPABASE_URL"] ?? "").replace(/\/+$/, "");
  return server && browser && signed.startsWith(server) ? browser + signed.slice(server.length) : signed;
}

export type PublicAnnouncement = {
  id: string;
  title: string;
  category: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  published_at: string | null;
  created_at: string;
};

async function signImages<T extends { image_url: string | null }>(
  sb: ReturnType<typeof publicClient>,
  rows: T[],
) {
  const paths = rows.map((r) => r.image_url).filter((p): p is string => !!p);
  const map = new Map<string, string>();
  if (paths.length) {
    const { data } = await sb.storage.from("announcement-images").createSignedUrls(paths, 60 * 60 * 24);
    for (const item of data ?? []) {
      if (item.path && item.signedUrl) map.set(item.path, toBrowserUrl(item.signedUrl));
    }
  }
  return map;
}

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb.from("site_settings").select("key, value");
  const out = Object.fromEntries(SETTING_KEYS.map((k) => [k, ""])) as SiteSettings;
  if (error) {
    console.error("settings", error.message);
    return out;
  }
  for (const row of data ?? []) {
    if ((SETTING_KEYS as readonly string[]).includes(row.key)) out[row.key as keyof SiteSettings] = row.value;
  }
  return out;
});

export const listAnnouncements = createServerFn({ method: "GET" })
  .inputValidator((input: { limit?: number } | undefined) =>
    z.object({ limit: z.number().int().min(1).max(50).optional() }).parse(input ?? {}),
  )
  .handler(async ({ data }): Promise<{ items: PublicAnnouncement[]; error: string | null }> => {
    const sb = publicClient();
    const { data: rows, error } = await sb
      .from("announcements")
      .select("id, title, category, excerpt, content, image_url, published_at, created_at")
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(data.limit ?? 30);
    if (error) {
      console.error("announcements", error.message);
      return { items: [], error: "No se pudieron cargar los comunicados." };
    }
    const signed = await signImages(sb, rows ?? []);
    return {
      items: (rows ?? []).map(({ image_url, ...r }) => ({ ...r, image: image_url ? signed.get(image_url) ?? null : null })),
      error: null,
    };
  });

export const getAnnouncement = createServerFn({ method: "GET" })
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }): Promise<PublicAnnouncement | null> => {
    const sb = publicClient();
    const { data: row, error } = await sb
      .from("announcements")
      .select("id, title, category, excerpt, content, image_url, published_at, created_at")
      .eq("id", data.id)
      .eq("published", true)
      .maybeSingle();
    if (error || !row) return null;
    const signed = await signImages(sb, [row]);
    const { image_url, ...rest } = row;
    return { ...rest, image: image_url ? signed.get(image_url) ?? null : null };
  });

type SubmitResult = { ok: true } | { ok: false; error: string };

export const submitApplication = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => applicationSchema.parse(input))
  .handler(async ({ data }): Promise<SubmitResult> => {
    if (data.website) return { ok: true };
    const { website: _w, availability, ...rest } = data;
    const { error } = await publicClient()
      .from("applications")
      .insert({ ...rest, availability: availability || null });
    if (error) {
      console.error("application insert", error.message);
      return { ok: false, error: "No se pudo registrar la solicitud. Inténtalo de nuevo en unos minutos." };
    }
    return { ok: true };
  });

export const submitAlliance = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => allianceSchema.parse(input))
  .handler(async ({ data }): Promise<SubmitResult> => {
    if (data.website) return { ok: true };
    const { website: _w, additional_info, ...rest } = data;
    const { error } = await publicClient()
      .from("alliances")
      .insert({ ...rest, additional_info: additional_info || null });
    if (error) {
      console.error("alliance insert", error.message);
      return { ok: false, error: "No se pudo registrar la propuesta. Inténtalo de nuevo en unos minutos." };
    }
    return { ok: true };
  });

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }): Promise<SubmitResult> => {
    if (data.website) return { ok: true };
    const { website: _w, ...rest } = data;
    const { error } = await publicClient().from("contact_messages").insert(rest);
    if (error) {
      console.error("contact insert", error.message);
      return { ok: false, error: "No se pudo enviar el mensaje. Inténtalo de nuevo en unos minutos." };
    }
    return { ok: true };
  });
