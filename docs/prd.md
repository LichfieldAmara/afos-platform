# African Freight Operating System (AFOS)

## MVP Product Requirements Document

**Initial market:** Sierra Leone  
**Document status:** Living draft  
**Version:** 0.6
**Last updated:** 13 August 2026

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
- Keep the customer request as the operational centre; matching must not require navigating to provider setup screens.

### Request-to-fleet assignment requirements

- Provider registration records company or individual-owner identity, contact person, declared truck count, declared trailer count, operating areas, and verification state.
- Trucks and trailers are registered as individual assets; drivers are provider-managed records and do not require their own portal in the pilot.
- One usable unit means one active truck, one active correctly sized trailer, and one active driver with valid documents for the selected schedule.
- The request workspace shows every verified provider, compatible units available now, a plain-language reason when unavailable, and the next recorded availability date where known.
- Operations selects exact units on the request itself. Confirmation atomically rechecks and reserves every selected asset and creates its trip.
- Multi-container requests may combine several providers. Partial fulfilment requires an explicit choice and leaves the remaining quantity visible and open.
- Assigned assets immediately stop appearing as available for overlapping schedules and return automatically after completion or cancellation.

## 4. Users and roles

| Role | Primary responsibility |
|---|---|
| Guest customer | Submit and privately track a transport request without creating an account |
| Freight forwarder user | Submit and coordinate requests for authorized customers/cargo |
| Provider contact | Represent a transport company or individual vehicle owner; an AFOS account is not required during the controlled pilot |
| AFOS operations | Verify supply, coordinate matching, manage allocations, trips, and exceptions |
| AFOS administrator | Manage access, configuration, suspensions, and audit oversight |

A person may have more than one authorized role, but permissions must always be explicit and associated with an organization.

## 5. Core workflow

1. Customer submits a transport request without creating an account and receives private tracking details and a downloadable receipt.
2. AFOS validates the request.
3. Matching calculates suitable capacity from verified registered trucks, compatible trailers, document validity, availability dates, and non-conflicting trip schedules.
4. If capacity is available, AFOS Operations assigns a suitable company or individual owner.
5. If capacity is engaged, the customer receives the next available date and can accept or decline it securely.
6. Assigned capacity is allocated to the request.
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
- Distinguish registered transport companies from individual vehicle owners.
- Capture provider/owner name, registration where applicable, primary contact, contact details, declared vehicle count, and operating areas.

The exact verification standard remains an operational and legal decision.

### Epic 3 — Fleet, trailer, and driver management

The system must:

- Register trucks, trailers, and drivers under a provider.
- Distinguish 20-foot and 40-foot trailer compatibility.
- Record operational status and essential identifying details.
- Record required document status and expiration dates.
- Prevent suspended, expired, or unavailable resources from being allocated.
- Preserve historical assignments if a resource later becomes inactive.
- Register every truck and trailer separately with a globally unique registration number.
- Capture insurance and roadworthiness expiration dates and a return-to-service date when an asset is unavailable.
- Show declared vehicle count separately from registered assets.
- Treat drivers as provider-managed operational resources; do not require separate driver accounts in the controlled pilot.

### Epic 4 — Registered-fleet availability

The system must:

- Calculate usable units as the lower of eligible trucks and compatible trailers.
- Exclude inactive, expired, manually unavailable, and already-booked assets.
- Record explicit unavailable reasons and expected return dates.
- Show declared fleet, registered assets, engaged assets, and remaining usable capacity distinctly.
- Prevent overlapping truck, trailer, and driver schedules at database level.
- Calculate the earliest supported future date when requested capacity is currently engaged.

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
- Allow first-time customers to submit without an account using a short step-by-step form.
- Capture customer contact details and issue a private tracking reference and token.
- Provide a downloadable receipt and support optional email delivery when email infrastructure is configured.
- Allow a customer to track only their own request using both secret values.
- Allow a customer to accept or decline a proposed later availability date.

### Epic 6 — Matching and provider offers

The system must:

- Identify capacity from verified registered fleet using transparent eligibility rules.
- Consider verification, compatibility, availability, dates, quantity, and allocation conflicts.
- Allow AFOS operations to review and override suggested matches.
- Allow AFOS Operations to assign an eligible company or individual vehicle owner during the controlled pilot.
- Record sent, viewed where feasible, accepted, rejected, unanswered, expired, and withdrawn outcomes.
- Capture provider response time and rejection reason.
- Support partial and multi-provider fulfilment.

Automated AI matching and mandatory provider self-service accounts are outside the controlled-pilot workflow.

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

## 7A. Implemented functional baseline

The following capabilities are implemented and verified in the current web application. They remain subject to real-user and controlled-pilot validation.

| Area | Implemented behaviour |
|---|---|
| Public experience | Responsive positioning homepage with links to request transport, track a request, and sign in to Operations |
| Operations identity | Supabase sign-in/sign-out, password recovery/reset, protected routes, platform roles, and administrator bootstrap |
| Guest demand intake | No account required; short wizard captures container size/quantity, container and cargo details, pickup, destination, date, and customer contact |
| Pricing | Configured route tariffs can return an estimate; Operations can confirm or amend the customer-visible price with audit history |
| Request receipt | Submission issues a reference and private tracking token, provides a downloadable receipt, and can send email when the email provider is configured |
| Customer tracking | Secret reference/token lookup exposes only customer-safe status, price, provider, movement events, exceptions, and delivery outcome |
| Tracking recovery | Operations can verify a caller, regenerate access, invalidate the old token, and record the action |
| Provider onboarding | Operations can register a company or individual owner, declared vehicle count, contacts, operating areas, and verification decision |
| Fleet records | Separate globally unique trucks and trailers, size compatibility, document dates, active/inactive state, reason, and available-again date |
| Capacity | Available units derive from eligible truck–trailer pairs; expired, inactive, unavailable, or schedule-conflicting assets are excluded |
| Alternative date | When capacity is engaged, the system records a future availability proposal that the customer can accept or decline privately |
| Request workspace | One Operations screen covers customer/route data, price, compatible provider matching, assignment, trip setup, exceptions, delivery, recovery, and audit activity |
| Assignment and dispatch | Only verified providers with enough compatible fleet can be assigned; specific provider resources are selected for a scheduled trip |
| Trip execution | Forward-only milestones from assigned through destination, with timestamps, notes, and customer-visible updates |
| Exceptions | Operations can report and resolve operational problems; unresolved exceptions remain visible and can block completion |
| Delivery | Recipient and outcome capture, private evidence upload, completion controls, and customer-visible delivery result |
| Security and integrity | Server authorization, Row Level Security, hashed tracking tokens, restricted public functions, allocation conflict controls, and append-oriented audit events |
| Delivery platform | GitHub source control, automatic Vercel deployment, Supabase database/auth/storage, schema migrations, health endpoint, tests, lint, and production build checks |
| Operations dashboard | Three clearly named action cards for price, provider assignment, and exceptions; a separate four-item operational snapshot; direct links to the work; and a plain-language operating guide |
| Operations navigation | Five active areas: Overview, Requests, Providers & Fleet, Trips, and Exceptions; legacy workflow URLs redirect safely |
| Explainable matching | Every verified provider is shown with compatible available units, unavailable reason, and next known date; only currently eligible providers can be assigned |
| Fleet overview | Declared trucks, registered trucks/trailers, available pairs, engaged pairs, unavailable assets, expired documents, and mismatch warnings |
| Exceptions workspace | Open-first queue, request/customer/provider context, direct contact, replacement-capacity flag, resolution form, and resolved history |

Not yet validated or completed merely by this baseline: a live commercial pilot, authoritative port/customs integrations, GPS, payments and commissions, comprehensive notifications, legal/insurance standards, and proven multi-provider fulfilment at operating scale.

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
| 13 Aug 2026 | Permit public transport requests without mandatory account creation | Implemented | Founder |
| 13 Aug 2026 | Make registered vehicles and schedules the source of operational capacity | Implemented | Founder |
| 13 Aug 2026 | Support companies and individual vehicle owners with operations-led pilot assignment | Implemented | Founder |
| 13 Aug 2026 | Do not require separate driver accounts during the controlled pilot | Working decision | Founder |
| 13 Aug 2026 | Let customers securely accept or decline a later available date | Implemented | Founder |

## 15. Revision history

| Date | Version | Change | Author/owner |
|---|---:|---|---|
| 12 Aug 2026 | 0.1 | Initial consolidated MVP PRD | AFOS / pending review |
| 13 Aug 2026 | 0.2 | Aligned requirements with the implemented guest request, registered fleet, matching, and alternative-date workflows | Founder / technical partner |
| 13 Aug 2026 | 0.3 | Added a complete implemented functional baseline and distinguished it from unvalidated and future scope | Founder / technical partner |
| 13 Aug 2026 | 0.4 | Added the consolidated Operations dashboard, navigation, fleet, matching, and Exceptions acceptance baseline | Founder / technical partner |
| 13 Aug 2026 | 0.5 | Clarified the dashboard UX by separating actionable work from awareness metrics | Founder / technical partner |
