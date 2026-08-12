import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const schema = readFileSync(resolve("supabase/migrations/202608120001_initial_afos_schema.sql"), "utf8");
const requiredTables = ["organizations", "profiles", "organization_memberships", "provider_verifications", "trucks", "trailers", "drivers", "capacity_declarations", "transport_requests", "provider_offers", "allocations", "trips", "trip_status_events", "exceptions", "deliveries", "notifications", "audit_events"];

test("schema defines every MVP table", () => {
  for (const table of requiredTables) assert.match(schema, new RegExp(`create table public\\.${table}\\s*\\(`));
});

test("every MVP table enables row level security", () => {
  for (const table of requiredTables) assert.match(schema, new RegExp(`alter table public\\.${table} enable row level security;`));
});

test("sensitive workflow tables have explicit access policies", () => {
  for (const table of ["verification_documents", "exceptions", "deliveries"]) {
    assert.match(schema, new RegExp(`create policy [^;]+ on public\\.${table}`));
  }
});

test("active trips prevent overlapping truck, trailer, and driver allocation", () => {
  for (const resource of ["truck_id", "trailer_id", "driver_id"]) {
    assert.match(schema, new RegExp(`exclude using gist \\(${resource} with =, tstzrange`));
  }
});

test("provider writes require provider operational roles", () => {
  assert.match(schema, /has_organization_role\(provider_id, array\['provider_manager', 'provider_dispatcher'\]/);
});

test("audit records cannot be updated or deleted by authenticated users", () => {
  assert.match(schema, /revoke update, delete on public\.audit_events from authenticated;/);
});

test("request quantities and capacity quantities must be positive", () => {
  assert.ok((schema.match(/quantity integer not null check \(quantity > 0\)/g) ?? []).length >= 4);
});
