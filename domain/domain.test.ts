import test from "node:test";
import assert from "node:assert/strict";

import { hasPermission, roles } from "./permissions";
import { canTransition, offerTransitions, requestTransitions, tripTransitions } from "./states";

test("every AFOS role is represented", () => assert.equal(roles.length, 7));
test("drivers cannot read every request", () => assert.equal(hasPermission("driver", "request:read_all"), false));
test("operations can manage allocations", () => assert.equal(hasPermission("afos_operations", "allocation:manage"), true));
test("administrator has all declared capabilities", () => assert.equal(hasPermission("afos_administrator", "access:administer"), true));
test("request cannot skip from submitted to completed", () => assert.equal(canTransition(requestTransitions, "submitted", "completed"), false));
test("accepted offer cannot be accepted twice", () => assert.equal(canTransition(offerTransitions, "accepted", "accepted"), false));
test("trip follows dispatch sequence", () => {
  assert.equal(canTransition(tripTransitions, "ready", "dispatched"), true);
  assert.equal(canTransition(tripTransitions, "ready", "delivered"), false);
});

