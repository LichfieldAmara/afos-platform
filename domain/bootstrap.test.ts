import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const bootstrap = readFileSync(resolve("supabase/bootstrap/001_founder_administrator.sql"), "utf8");

test("founder bootstrap requires an existing Auth user", () => {
  assert.match(bootstrap, /from auth\.users/);
  assert.match(bootstrap, /raise exception 'No Supabase Auth user exists/);
});

test("founder bootstrap creates an AFOS administrator membership", () => {
  assert.match(bootstrap, /'afos_administrator'/);
  assert.match(bootstrap, /on conflict \(organization_id, user_id, role\) do update/);
});

test("founder bootstrap never embeds a real email", () => {
  assert.match(bootstrap, /founder@example\.com/);
  assert.doesNotMatch(bootstrap, /@gmail\.com|@yahoo\.com|@outlook\.com/i);
});
