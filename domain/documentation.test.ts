import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const concept = readFileSync(resolve("docs/concept-note.md"), "utf8");
const prd = readFileSync(resolve("docs/prd.md"), "utf8");
const plan = readFileSync(resolve("docs/implementation-plan.md"), "utf8");
const readme = readFileSync(resolve("README.md"), "utf8");

test("living documents record the complete implemented baseline", () => {
  assert.match(concept, /Product implemented to date/);
  assert.match(prd, /Implemented functional baseline/);
  assert.match(plan, /Implemented release baseline/);
  for (const feature of [
    "no-account", "tracking", "provider", "fleet", "trip", "exception", "delivery",
  ]) {
    assert.match(`${concept}\n${prd}\n${plan}`.toLowerCase(), new RegExp(feature));
  }
});

test("feature definition of done requires documentation updates", () => {
  assert.match(plan, /Documentation updates, automated checks, and production verification are part of a feature's definition of done/);
  assert.match(readme, /Documentation, tests, and production verification are part of the definition of done/);
});
