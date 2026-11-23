// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

let db: PGlite;
const migration = readFileSync('drizzle/migrations/0002_single_director_initial_registration.sql', 'utf8');
const first = '00000000-0000-4000-8000-000000000001';
const second = '00000000-0000-4000-8000-000000000002';

beforeEach(async () => {
  db = new PGlite();
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
    CREATE SCHEMA auth;
    CREATE TABLE auth.users(id uuid PRIMARY KEY, email text, raw_app_meta_data jsonb DEFAULT '{}');
    CREATE TYPE public.app_role AS ENUM ('admin','moderator');
    CREATE TABLE public.user_roles(id uuid DEFAULT gen_random_uuid(), user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE, role public.app_role, UNIQUE(user_id, role));`);
  await db.exec(migration);
}, 20000);
afterEach(async () => { await db.close(); });

async function add(id: string, metadata = {}) {
  return db.query('INSERT INTO auth.users(id,email,raw_app_meta_data) VALUES ($1,$2,$3)', [id, `${id}@example.test`, JSON.stringify(metadata)]);
}
async function open() {
  return (await db.query<{ open: boolean }>('SELECT public.initial_registration_open() AS open')).rows[0]?.open;
}

describe('Exact deployed Director lifecycle SQL in a disposable database, no web credentials', () => {
  it('starts with zero users and allows the first Director', async () => {
    expect(await open()).toBe(true);
    await add(first);
    expect((await db.query('SELECT user_id,role FROM user_roles')).rows).toEqual([{ user_id: first, role: 'admin' }]);
  });
  it('rejects a second public Director and rolls back the entire user insert', async () => {
    await add(first);
    await expect(add(second)).rejects.toThrow('permanently closed');
    expect((await db.query('SELECT id FROM auth.users')).rows).toEqual([{ id: first }]);
  });
  it('closes registration immediately and does not reopen after Director deletion', async () => {
    await add(first);
    expect(await open()).toBe(false);
    await db.query('DELETE FROM auth.users WHERE id=$1', [first]);
    expect(await open()).toBe(false);
    await expect(add(second)).rejects.toThrow('permanently closed');
  });
  it('does not trust a forged Director role or a fabricated staff permit', async () => {
    await add(first);
    await expect(add(second, { role: 'admin', signup_permit: second })).rejects.toThrow('permanently closed');
  });
  it('allows one authorized staff permit, without another Director', async () => {
    await add(first);
    await db.query('INSERT INTO staff_registration_permits(id,email) VALUES ($1,$2)', [second, `${second}@example.test`]);
    await add(second, { signup_permit: second });
    expect((await db.query('SELECT role FROM user_roles WHERE user_id=$1', [second])).rows).toEqual([{ role: 'moderator' }]);
    expect((await db.query('SELECT id FROM staff_registration_permits')).rows).toEqual([]);
    expect(await open()).toBe(false);
  });
  it('enforces a single Director even for direct role insertion', async () => {
    await add(first);
    await db.query('INSERT INTO staff_registration_permits(id,email) VALUES ($1,$2)', [second, `${second}@example.test`]);
    await add(second, { signup_permit: second });
    await expect(db.query("INSERT INTO user_roles(user_id,role) VALUES ($1,'admin')", [second])).rejects.toThrow('overnight_only_one_director');
    expect((await db.query("SELECT count(*)::int AS total FROM user_roles WHERE role='admin'")).rows[0]).toEqual({ total: 1 });
  });
});