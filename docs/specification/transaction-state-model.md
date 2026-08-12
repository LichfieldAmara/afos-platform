# AFOS Transaction State Model

**Status:** Working specification; driver, dispatcher, and demand-side validation required  
**Source of truth:** `domain/states.ts`

## Request states

`Draft → Submitted → Matching → Partially Matched / Matched → Allocated → In Progress → Completed`

Terminal alternatives are `Partially Completed`, `Unfulfilled`, `Failed`, and `Cancelled`.

- **Draft:** Editable, not yet operational demand.
- **Submitted:** Genuine request awaiting validation/coordination.
- **Matching:** Capacity search and provider offers underway.
- **Partially Matched:** Some requested quantity has accepted capacity.
- **Matched:** Required quantity has accepted capacity but is not fully allocated.
- **Allocated:** Specific provider resources are committed.
- **In Progress:** At least one trip has been dispatched and the transaction is active.
- **Completed:** All required completed quantities and delivery conditions are satisfied.

## Offer states

`Draft → Sent → Accepted / Rejected / Expired / Withdrawn`

An accepted offer is not a completed allocation. It authorizes creation of committed allocation records, subject to conflict and eligibility checks.

## Trip states

`Assigned → Acknowledged → Ready → Dispatched → At Pickup → In Transit → At Destination → Delivered → Completed`

`Cancelled` is permitted before dispatch. `Failed` is permitted after dispatch. Corrections by AFOS Operations require an audit event and reason rather than silently rewriting history.

## Quantity rules

- Requested quantity must be positive.
- Matched, allocated, completed, and failed quantities cannot be negative.
- Allocated quantity cannot exceed accepted, eligible capacity.
- Completed quantity cannot exceed allocated quantity.
- A request may have allocations from multiple providers.
- A trip represents a physical movement and belongs to one allocation.

## Validation questions

- Do drivers need both `At Pickup` and a separate `Loaded` milestone?
- Is `Ready` declared by the driver, dispatcher, or either?
- At what point is cancellation no longer valid and failure must be recorded instead?
- What delivery evidence is mandatory for completion?
- Who confirms partial completion and the remaining commercial obligation?

