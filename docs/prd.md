# African Freight Operating System (AFOS)

## MVP Product Requirements Document

**Initial market:** Sierra Leone  
**Document status:** Living draft  
**Version:** 0.1  
**Last updated:** 12 August 2026

## 1. Purpose

This Product Requirements Document defines the first AFOS product that will be built and tested. It translates the concept into product boundaries, users, workflows, functional requirements, business rules, and measurable outcomes.

Detailed user stories, acceptance criteria, data definitions, API contracts, and wireframes will be added as product discovery progresses.

## 2. Product objective

Enable genuine container-transport demand to be matched with verified suitable capacity and coordinated from request through delivery and completion in one traceable workflow.

## 3. Product principles

- Mobile first, especially for drivers and field users
- Clear current state and next required action
- Human-assisted operations before advanced automation
- Verified participants and traceable actions
- Minimum data required to complete the transaction
- Secure organization-level data isolation
- Explicit exception handling
- Evidence-based scope decisions

## 4. Users and roles

| Role | Primary responsibility |
|---|---|
| Customer user | Submit and monitor transport requests |
| Freight forwarder user | Submit and coordinate requests for authorized customers/cargo |
| Provider manager | Maintain provider records, declare capacity, respond to offers, and allocate assets |
| Provider dispatcher | Coordinate accepted assignments and driver dispatch |
| Driver | View assigned trips and submit simple status updates/evidence |
| AFOS operations | Verify supply, coordinate matching, manage allocations, trips, and exceptions |
| AFOS administrator | Manage access, configuration, suspensions, and audit oversight |

A person may have more than one authorized role, but permissions must always be explicit and associated with an organization.

## 5. Core workflow

1. Customer submits a transport request.
2. AFOS validates the request.
3. Matching identifies suitable verified declared capacity.
4. One or more providers receive offers.
5. Providers accept, reject, or allow offers to expire.
6. Accepted capacity is allocated to the request.
7. Specific trucks, trailers, and drivers are assigned.
8. Trips are dispatched.
9. Drivers or operations record movement milestones.
10. Exceptions are recorded and resolved when necessary.
11. Delivery evidence is submitted.
12. AFOS confirms completion or records an unsuccessful outcome.

## 6. MVP epics and high-level requirements

### Epic 1 — Identity and access

The system must:

- Support secure sign-in and sign-out.
- Support invitation-based onboarding for controlled pilot participation.
- Support password recovery.
- Associate users with organizations and roles.
- Restrict actions and records by role and organization.
- Allow administrators to suspend access without deleting history.
- Record security-relevant administrative actions.

### Epic 2 — Organizations and provider verification

The system must:

- Create and maintain customer, freight-forwarder, and provider organizations.
- Capture provider operational and verification information.
- Support `Draft`, `Submitted`, `Under Review`, `Verified`, `Rejected`, and `Suspended` verification states.
- Record reviewer, decision time, reason, and document expirations.
- Prevent unverified or suspended providers from being offered live work.
- Preserve verification history.

The exact verification standard remains an operational and legal decision.

### Epic 3 — Fleet, trailer, and driver management

The system must:

- Register trucks, trailers, and drivers under a provider.
- Distinguish 20-foot and 40-foot trailer compatibility.
- Record operational status and essential identifying details.
- Record required document status and expiration dates.
- Prevent suspended, expired, or unavailable resources from being allocated.
- Preserve historical assignments if a resource later becomes inactive.

### Epic 4 — Capacity availability

The system must:

- Allow authorized providers or AFOS operations to declare capacity availability.
- Record container compatibility, quantity, date/time window, and relevant operating constraints.
- Distinguish registered fleet from currently available operational capacity.
- Show when and by whom availability was declared or changed.
- Prevent capacity from being committed to conflicting assignments.
- Measure whether declared capacity was genuinely usable when required.

### Epic 5 — Transport requests

The system must:

- Allow authorized demand-side users to create requests.
- Capture request reference, organization, container size, quantity, pickup, destination, required date/time, and operational contact.
- Support draft submission and validation.
- Display the request's current fulfilment state.
- Permit controlled amendment or cancellation with reasons and history.
- Separate requested, matched, allocated, completed, and unfulfilled quantities.
- Allow container numbers to be added after initial submission but require them before dispatch where the operating rule requires it.
- Record movement type, cargo category, estimated cargo weight with unit, pickup readiness, requested pickup window, and requested delivery window.
- Support authorized freight forwarder or clearing-agent participation as a demand-side organization without presenting AFOS as an authoritative customs or port-status source.

### Epic 6 — Matching and provider offers

The system must:

- Identify capacity using transparent eligibility rules.
- Consider verification, compatibility, availability, dates, quantity, and allocation conflicts.
- Allow AFOS operations to review and override suggested matches.
- Send offers to one or more suitable providers.
- Record sent, viewed where feasible, accepted, rejected, unanswered, expired, and withdrawn outcomes.
- Capture provider response time and rejection reason.
- Support partial and multi-provider fulfilment.

Automated AI matching is outside the MVP.

The pilot will record manually coordinated quotations or confirmed prices. Automated estimated pricing and unrestricted price-only provider comparison are outside the MVP.

### Epic 7 — Allocation

The system must:

- Convert accepted provider capacity into committed allocations.
- Link allocations to requests, providers, quantities, and agreed operating details.
- Assign eligible trucks, trailers, and drivers.
- Prevent double allocation.
- Support replacement resources with reasons and history.
- Make allocated and remaining request quantities visible.

### Epic 8 — Dispatch and trip management

The system must:

- Create one or more trips from an allocation.
- Present drivers with a short mobile workflow.
- Record acknowledgement and milestone timestamps.
- Support controlled statuses such as `Assigned`, `Acknowledged`, `Ready`, `Dispatched`, `At Pickup`, `In Transit`, `At Destination`, `Delivered`, and `Completed`.
- Prevent invalid status transitions.
- Allow AFOS operations to correct a status with a mandatory reason and audit record.
- Make the current state and next expected action clear.

Final statuses must be validated with real drivers and dispatchers.

### Epic 9 — Exception management

The system must:

- Allow authorized users to report an exception against a request, allocation, or trip.
- Record type, time, reporter, description, operational impact, and evidence.
- Record response, responsible owner, resolution, and replacement-capacity requirement.
- Distinguish technology, coordination, capacity, and execution failures.
- Keep unresolved exceptions visible to AFOS operations.

### Epic 10 — Delivery and completion

The system must:

- Record delivery time and outcome.
- Support controlled upload of delivery evidence.
- Record who submitted and who confirmed delivery.
- Allow completion only when required conditions are met or an authorized override is explained.
- Support `Completed`, `Partially Completed`, `Failed`, and `Cancelled` transaction outcomes.
- Require a reason for unsuccessful or partial outcomes.

### Epic 11 — Operations dashboard and records

The system must provide AFOS operations with visibility into:

- Requests awaiting action
- Genuine available capacity
- Requests without matches
- Offers awaiting provider responses
- Pending allocations and dispatches
- Active trips
- Delays and unresolved exceptions
- Deliveries awaiting confirmation
- Completed and unsuccessful transactions

Records must be searchable and filterable using essential operational fields.

### Epic 12 — Audit and notifications

The system must:

- Preserve an append-only audit history of material transaction and administrative events.
- Record actor, action, time, affected record, and relevant before/after information.
- Provide essential in-application notifications.
- Support carefully selected email or messaging notifications when validated.
- Prevent notifications from becoming the sole source of operational truth.

## 7. Initial business rules

- Only verified, active providers may receive live transport offers.
- Only eligible, active resources may be allocated.
- A resource may not have overlapping committed assignments.
- An accepted offer does not complete a request; resources must be allocated and movements completed.
- A request may be fulfilled by multiple providers.
- Every cancellation, failure, override, replacement, and rejection must have a reason.
- Historical transaction records must not be deleted merely because a participant or asset becomes inactive.
- AFOS operations may intervene, but intervention must be traceable.
- Prices and fees, when recorded, must retain currency, authorizer, and change history.

## 8. Essential data entities

- User
- Organization
- Organization membership
- Role and permission
- Provider profile
- Verification review and document
- Truck
- Trailer
- Driver
- Capacity declaration
- Transport request and request line
- Match candidate
- Provider offer and response
- Allocation and allocated resource
- Trip and trip status event
- Exception and resolution
- Delivery and evidence
- Price/fee record
- Notification
- Audit event

The detailed relational schema will be maintained through version-controlled Supabase migrations.

## 9. Non-functional requirements

### Security and privacy

- Enforce organization-level isolation with Supabase Row Level Security.
- Keep privileged keys and operations on the server.
- Store secrets outside source control.
- Restrict sensitive documents to authorized users.
- Log material administrative and operational actions.
- Define document retention and deletion procedures before live use.

### Usability

- Support current mainstream mobile and desktop browsers.
- Optimize driver screens for small displays and short actions.
- Use plain operational language validated with users.
- Clearly communicate loading, success, failure, and retry states.
- Preserve unsent form input where reasonably possible after temporary connection loss.

### Reliability and integrity

- Use database constraints and transactions for allocations and status changes.
- Provide error monitoring and operational logs.
- Maintain database backups appropriate to the pilot risk.
- Separate preview/test data from production data.

### Performance

- Essential operational screens should remain usable on typical mobile connections in the pilot area.
- Avoid unnecessarily large media and client downloads.
- Compress uploaded evidence within acceptable quality limits where appropriate.

### Accessibility

- Provide readable contrast, meaningful labels, keyboard support for office workflows, and sufficiently large mobile controls.

## 10. Pilot metrics

The product must make it possible to calculate:

- Total requests and container movements requested
- 20-foot and 40-foot quantities
- Verified and active providers
- Declared and usable capacity
- Requests and containers matched
- Partial, multi-provider, and unmatched requests
- Offers and response times
- Trips allocated, dispatched, delivered, completed, delayed, and failed
- Request-to-first-match time
- Request-to-provider-acceptance time
- Request-to-confirmed-capacity time
- Capacity accuracy
- Repeat customer and provider usage
- Manual interventions and off-platform behaviour when reported
- Successful AFOS fulfilment rate

## 11. MVP success criteria

The MVP is technically ready for a controlled pilot when:

- A complete request-to-completion transaction works in production-like testing.
- Permissions and organization isolation pass security tests.
- Invalid or conflicting allocations are prevented.
- Drivers can complete essential actions on target mobile devices.
- Operations can identify and act on waiting work and exceptions.
- Material actions are auditable.
- Participants can be onboarded and trained without development intervention.
- Operational, commercial, legal, and verification rules required for live movements are approved.

Business success will be determined by the pilot validation framework, not by software completion alone.

## 12. Dependencies and open decisions

- Formal pilot participants
- Provider, vehicle, trailer, and driver verification standard
- Pricing and quotation process
- Commission/fee model
- Invoicing and commercial settlement
- Cancellation, failure, and replacement rules
- Terms of participation
- Privacy, document retention, and consent requirements
- Regulatory and legal review in Sierra Leone
- Required notification channels
- Final driver and dispatcher status vocabulary
- Pilot locations, routes, and operational support hours
- Source and authority for any container-release, customs-clearance, appointment, demurrage, or detention status

## 12A. Post-MVP vision items

- Live GPS map after a reliable authorized location source exists
- Automated transport-cost estimates after route/rate evidence exists
- Integrated invoicing, payments, commissions, earnings, and settlement
- Authoritative port, terminal, customs, and clearing integrations
- Automatic demurrage and detention calculations
- Full clearing-agent handover workflows

## 13. Change-control rule

New feature requests will be evaluated using:

`Frequency × Operational impact × Strategic relevance`

A request is not automatically added to the MVP because one participant asks for it. Every proposed addition must identify the problem, affected users, evidence, priority, and effect on pilot timing.

## 14. Decision log

| Date | Decision | Status | Owner |
|---|---|---|---|
| 12 Aug 2026 | Build a mobile-first responsive web application before native apps | Working decision | Founder |
| 12 Aug 2026 | Use GitHub, Vercel, and Supabase as the initial platform foundation | Working decision | Founder |
| 12 Aug 2026 | Use human-assisted matching in the MVP | Working decision | Founder |
| 12 Aug 2026 | Keep payments, GPS, AI matching, and native apps outside the initial MVP | Working decision | Founder |

## 15. Revision history

| Date | Version | Change | Author/owner |
|---|---:|---|---|
| 12 Aug 2026 | 0.1 | Initial consolidated MVP PRD | AFOS / pending review |
