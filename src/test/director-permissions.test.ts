import { beforeEach, describe, expect, it, vi } from 'vitest';

// Exercise the handler's own authorization, independently of the page guard.
vi.mock('@tanstack/react-start', () => ({ createServerFn: () => {
  const builder = { middleware: () => builder, inputValidator: () => builder, handler: (handler: unknown) => handler };
  return builder;
} }));
vi.mock('@/integrations/supabase/auth-middleware', () => ({ requireSupabaseAuth: {} }));
const { privilegedRead } = vi.hoisted(() => ({ privilegedRead: vi.fn() }));
vi.mock('@/integrations/supabase/client.server', () => ({ supabaseAdmin: { auth: { admin: { listUsers: privilegedRead } } } }));
import { deleteStaff, inviteStaff, listManagedUsers } from '@/lib/access.functions';

beforeEach(() => { privilegedRead.mockClear(); });

describe('Director-only account management handler boundaries', () => {
  for (const [name, handler, data] of [
    ['list', listManagedUsers, {}],
    ['create', inviteStaff, { email: 'staff@example.test', origin: 'http://localhost:8080' }],
    ['delete', deleteStaff, { id: '00000000-0000-4000-8000-000000000002' }],
  ] as const) {
    it(`denies ${name} to an authenticated account without Director permissions`, async () => {
      const rpc = vi.fn().mockResolvedValue({ data: false, error: null });
      const run = handler as unknown as (input: unknown) => Promise<unknown>;
      await expect(run({ context: { supabase: { rpc }, userId: 'ordinary-account' }, data })).rejects.toThrow('Acceso denegado');
      expect(rpc).toHaveBeenCalledWith('has_role', { _user_id: 'ordinary-account', _role: 'admin' });
      expect(privilegedRead).not.toHaveBeenCalled();
    });
  }
});