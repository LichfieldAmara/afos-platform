import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const authActions = readFileSync(resolve("app/actions/auth.ts"), "utf8");
const callback = readFileSync(resolve("app/auth/callback/route.ts"), "utf8");
const session = readFileSync(resolve("lib/auth/session.ts"), "utf8");
const health = readFileSync(resolve("app/api/health/route.ts"), "utf8");

test("credentials are validated on the server", () => {
  assert.match(authActions, /credentialsSchema\.safeParse/);
  assert.match(authActions, /signInWithPassword/);
});

test("authentication failures do not reveal which credential failed", () => {
  assert.match(authActions, /The email or password is incorrect/);
  assert.doesNotMatch(authActions, /user does not exist/i);
});

test("password recovery prevents external redirect targets", () => {
  assert.match(callback, /startsWith\("\/"\)/);
  assert.match(callback, /!requestedNext\.startsWith\("\/\/"\)/);
});

test("protected pages require a verified Supabase user", () => {
  assert.match(session, /auth\.getUser\(\)/);
  assert.match(session, /redirect\("\/login"\)/);
});

test("health reports active Google Sheet configuration without exposing secrets", () => {
  assert.match(health, /GOOGLE_SHEETS_WEBHOOK_URL/);
  assert.match(health, /GOOGLE_SHEETS_WEBHOOK_SECRET/);
  assert.match(health, /requestInbox: configured \? "configured" : "not_configured"/);
  assert.doesNotMatch(health, /process\.env\.NEXT_PUBLIC_SUPABASE/);
});
