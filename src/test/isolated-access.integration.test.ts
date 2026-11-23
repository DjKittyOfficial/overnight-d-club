import { describe, expect, it } from "vitest";

// Run with runtime variables present. These tests use only the project's generated
// connection and never use an archived environment file or production endpoint.
const url = process.env["SUPABASE_URL"];
const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
const suite = url && key ? describe : describe.skip;

async function request(path: string, method = "GET", body?: unknown) {
  if (!url || !key) throw new Error("Independent test connection unavailable");
  return fetch(`${url}${path}`, {
    method,
    headers: { apikey: key, "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

suite("Isolated backend access rules", () => {
  it("enables only the guarded initial signup entry point", async () => {
    const response = await request("/auth/v1/settings");
    expect(response.status).toBe(200);
    expect((await response.json()).disable_signup).toBe(false);
    const state = await request("/rest/v1/rpc/initial_registration_open", "POST", {});
    expect(state.status).toBe(200);
    expect(await state.json()).toBe(true);
  });

  it("does not expose private contact messages to a visitor", async () => {
    const response = await request("/rest/v1/contact_messages?select=id,subject");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([]);
  });

  it("does not let the first visitor claim director access", async () => {
    const response = await request("/rest/v1/rpc/claim_first_admin", "POST", {});
    expect(response.status).toBe(404);
  });

  it("does not expose other users' ranks through anonymous role lookup", async () => {
    const response = await request("/rest/v1/rpc/has_role", "POST", {
      _user_id: "00000000-0000-0000-0000-000000000000", _role: "admin",
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toBe(false);
  });
});