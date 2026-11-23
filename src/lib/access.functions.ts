import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

export const initialRegistrationOpen = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error("No se pudo comprobar el registro.");
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
      headers.set('apikey', key);
      return fetch(input, { ...init, headers });
    } },
  });
  const { data, error } = await client.rpc('initial_registration_open');
  if (error) throw new Error("No se pudo comprobar el registro.");
  return data === true;
});

export const listManagedUsers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
    if (error || data !== true) throw new Error("Acceso denegado.");
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const [{ data: accounts, error: usersError }, { data: roles, error: rolesError }] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      supabaseAdmin.from('user_roles').select('user_id, role'),
    ]);
    if (usersError || rolesError) throw new Error("No se pudieron cargar los usuarios.");
    return accounts.users.map(user => ({
      id: user.id, email: user.email ?? '', confirmed: Boolean(user.email_confirmed_at),
      director: roles?.some(role => role.user_id === user.id && role.role === 'admin') ?? false,
    }));
  });

export const inviteStaff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ email: z.string().trim().email(), origin: z.string().url() }).parse(input))
  .handler(async ({ context, data }) => {
    const { data: allowed, error } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
    if (error || allowed !== true) throw new Error("Acceso denegado.");
    const { getRequest } = await import('@tanstack/react-start/server');
    const requestOrigin = new URL(getRequest().url).origin;
    if (new URL(data.origin).origin !== requestOrigin) throw new Error("Destino de recuperación no válido.");
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const permit = crypto.randomUUID();
    const { error: permitError } = await supabaseAdmin.from('staff_registration_permits').insert({ id: permit, email: data.email });
    if (permitError) throw new Error("No se pudo autorizar la cuenta.");
    try {
      const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: data.email, email_confirm: false, app_metadata: { signup_permit: permit },
      });
      if (createError || !created.user) throw new Error("No se pudo crear la cuenta. Comprueba si el correo ya existe.");
      const { error: mailError } = await supabaseAdmin.auth.resetPasswordForEmail(data.email, { redirectTo: `${requestOrigin}/restablecer` });
      return { ok: !mailError, message: mailError ? 'Cuenta creada, pero no se pudo enviar el correo. Reintenta desde Recuperar contraseña.' : 'Cuenta creada sin permisos de dirección. Se ha enviado el enlace para establecer su contraseña.' };
    } finally {
      await supabaseAdmin.from('staff_registration_permits').delete().eq('id', permit);
    }
  });

export const deleteStaff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const { data: allowed, error } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
    if (error || allowed !== true) throw new Error("Acceso denegado.");
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: director, error: roleError } = await supabaseAdmin.from('user_roles').select('id').eq('user_id', data.id).eq('role', 'admin').maybeSingle();
    if (roleError || director || data.id === context.userId) throw new Error("La cuenta Director está protegida.");
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(data.id);
    if (deleteError) throw new Error("No se pudo eliminar la cuenta.");
    return { ok: true };
  });