import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const migration = readFileSync(resolve("supabase/migrations/202608120003_provider_operations.sql"), "utf8");
const actions = readFileSync(resolve("app/actions/providers.ts"), "utf8");
const data = readFileSync(resolve("lib/providers/data.ts"), "utf8");

test("provider creation is atomic and audited", () => {
  assert.match(migration, /create function public\.create_transport_provider/);
  assert.match(migration, /insert into public\.provider_verifications/);
  assert.match(migration, /'provider\.created'/);
});

test("provider verification reviews validate decisions and require reasons", () => {
  assert.match(migration, /decision not in \('under_review', 'verified', 'rejected', 'suspended'\)/);
  assert.ok(
    migration.includes("decision in ('rejected', 'suspended')") &&
      migration.includes("char_length(trim(decision_reason)) < 3"),
  );
  assert.match(migration, /'provider\.verification_reviewed'/);
});

test("provider actions enforce platform authorization on the server", () => {
  assert.ok((actions.match(/requirePlatformRole\(\["afos_operations", "afos_administrator"\]\)/g) ?? []).length >= 2);
  assert.match(data, /requirePlatformRole\(\["afos_operations", "afos_administrator"\]\)/);
});

test("provider input is validated before database mutation", () => {
  assert.match(actions, /providerSchema\.safeParse/);
  assert.match(actions, /verificationSchema\.safeParse/);
});
