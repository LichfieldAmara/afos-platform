import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const migration = readFileSync(resolve("supabase/migrations/202608120004_transport_request_operations.sql"), "utf8");
const actions = readFileSync(resolve("app/actions/requests.ts"), "utf8");
const form = readFileSync(resolve("components/requests/request-form.tsx"), "utf8");
const page = readFileSync(resolve("app/app/requests/page.tsx"), "utf8");

test("request creation is atomic, authorized, and audited", () => {
  assert.match(migration, /create function public\.create_transport_request_for_customer/);
  assert.match(migration, /public\.has_platform_role\('afos_operations'\)/);
  assert.match(migration, /insert into public\.transport_requests/);
  assert.match(migration, /'transport_request\.created'/);
});

test("request input is validated before database mutation", () => {
  assert.match(actions, /requestSchema\.safeParse/);
  assert.match(actions, /requirePlatformRole\(\["afos_operations", "afos_administrator"\]\)/);
  assert.match(actions, /new Date\(parsed\.data\.requiredAt\)\.toISOString\(\)/);
});

test("request form uses a short, assisted, plain-language journey", () => {
  for (const phrase of ["What is moving?", "Where and when?", "Who should we call?", "You can complete this for a customer on the phone.", "What happens next?"]) {
    assert.ok(form.includes(phrase));
  }
  assert.match(form, /Container number <small>Optional<\/small>/);
  assert.match(form, /autoComplete="tel"/);
  assert.match(form, /role="status"/);
});

test("request queue exposes a direct phone action and operational status", () => {
  assert.match(page, /href={`tel:\$\{request\.contactPhone\}`}/);
  assert.match(page, /status-chip/);
  assert.match(page, /request\.pickup/);
  assert.match(page, /request\.destination/);
});
