import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const initialMigration = readFileSync(resolve("supabase/migrations/202608120004_transport_request_operations.sql"), "utf8");
const refinementMigration = readFileSync(resolve("supabase/migrations/202608120005_flexible_request_container_size.sql"), "utf8");
const migration = `${initialMigration}\n${refinementMigration}`;
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
  for (const phrase of ["Tell us about the container", "What size is the container?", "How many containers are moving?", "Where and when?", "Who should we call?", "You can complete this for a customer on the phone.", "What happens next?"]) {
    assert.ok(form.includes(phrase));
  }
  assert.match(form, /Container number <small>Optional<\/small>/);
  assert.match(form, /autoComplete="tel"/);
  assert.match(form, /role="status"/);
  assert.match(form, /list="container-size-options"/);
  assert.match(form, /list="container-quantity-options"/);
  assert.doesNotMatch(form, /Import|Export|Empty return|name="movementType"/);
  assert.match(form, /wizard-progress/);
  assert.match(form, /Step 1 of 3/);
  assert.match(form, /continueFrom\(1\)/);
  assert.match(form, /continueFrom\(2\)/);
  assert.match(form, /hidden=\{step !== 3\}/);
});

test("request storage accepts a genuine typed container size", () => {
  assert.match(migration, /alter column container_size type text/);
  assert.match(actions, /containerSize: z\.string\(\)/);
  assert.doesNotMatch(actions, /z\.enum\(\["20ft", "40ft"\]\)/);
});

test("request queue exposes a direct phone action and operational status", () => {
  assert.match(page, /href={`tel:\$\{request\.contactPhone\}`}/);
  assert.match(page, /status-chip/);
  assert.match(page, /request\.pickup/);
  assert.match(page, /request\.destination/);
});
