# African Freight Operating System (AFOS)

## MVP Implementation Plan

**Initial market:** Sierra Leone  
**Document status:** Living draft  
**Version:** 0.4
**Last updated:** 13 August 2026

## 1. Purpose

This plan describes how AFOS will move from concept to a controlled real-world pilot. It is written for a non-technical product owner and will be updated as decisions are made and evidence is collected.

No phase is complete merely because software was written. Each phase has a defined output and approval gate.

## 2. Delivery principles

- The founder and AFOS business should own all accounts and assets.
- GitHub is the source of truth for code and technical documentation.
- Every significant change is reviewed through a preview before production.
- Preview/test data and production data remain separate.
- Database changes are version-controlled and reproducible.
- The smallest complete transport workflow is built before secondary features.
- Real user feedback is collected early and repeatedly.
- Operational, security, legal, and commercial readiness are part of delivery.
- Scope expands only when evidence justifies it.
- Every agreed feature must update the Concept Note when it changes the product or operating model, the PRD when it changes requirements or business rules, and this Implementation Plan when it changes delivery status or sequencing.
- Documentation updates, automated checks, and production verification are part of a feature's definition of done; a feature is not recorded as complete without them.

## 3. Responsibilities

### Founder / product owner

- Own the vision, business decisions, and final approvals.
- Create or authorize business accounts, payments, and access.
- Maintain participant relationships and obtain consent.
- Approve workflows, language, rules, and priorities.
- Obtain legal, accounting, regulatory, and insurance advice where required.
- Review every preview in plain-language acceptance sessions.

### Product and technical partner

- Challenge assumptions and explain trade-offs.
- Maintain the Concept Note, PRD, Implementation Plan, and technical documentation.
- Design the architecture, database, permissions, and user experience.
- Implement code and version-controlled database migrations.
- Create tests, previews, release notes, and deployment procedures.
- Identify risks, blockers, and decisions requiring founder approval.
- Provide plain-language handover and operational documentation.

### Pilot participants

- Validate workflows and terminology.
- Provide authorized, accurate onboarding information.
- Complete training and test transactions.
- Use the agreed pilot process and provide structured feedback.

### Professional advisers

- Sierra Leone-qualified legal counsel reviews participation terms, privacy, liability, and regulatory requirements.
- An accountant or tax adviser reviews invoicing, settlement, taxes, and commission treatment.
- Relevant transport/insurance expertise reviews verification and responsibility standards.

## 4. Technical delivery model

### Platform

- Mobile-first responsive web application
- Next.js with TypeScript
- Supabase PostgreSQL, Auth, and Storage
- Vercel preview and production deployments
- Private GitHub repository

### Environments

| Environment | Purpose | Data |
|---|---|---|
| Local | Development on an authorized computer | Artificial/local data |
| Preview/Test | Founder review, user testing, and demonstrations | Artificial or explicitly authorized test data |
| Production | Controlled live pilot | Real authorized operational data |

### Change and release workflow

1. Define a small change and its acceptance criteria.
2. Create a separate GitHub branch.
3. Implement code and database migration changes.
4. Run automated checks.
5. Vercel creates a preview deployment.
6. Founder and relevant users review the preview.
7. Correct identified problems.
8. Merge the approved change into the protected `main` branch.
9. Vercel deploys production automatically.
10. Verify the production release and record release notes.

Production releases must not rely on unrecorded manual database edits.

## 5. Phase 0 — Preserve discovery knowledge

### Objective

Capture the founder's operational knowledge and preserve authorized relationships before leaving AGL.

### Activities

- Document the current request, capacity, dispatch, movement, and delivery process.
- Record operational vocabulary and common exceptions.
- Interview drivers about assignments, statuses, phones, data connectivity, and delivery evidence.
- Interview dispatch/transport staff where authorized.
- Identify an authorized AGL decision-maker for future engagement.
- Request permission to retain contacts and continue research.
- Avoid copying confidential information or using personal/company data without permission.
- Clearly distinguish informal interest from a formal partnership.

### Founder actions

- Make authorized introductions before departure.
- Request consent for follow-up interviews.
- Write down personal operational knowledge without taking restricted company materials.

### Outputs

- Current-state workflow
- Interview notes and consent status
- Terminology list
- Problems and assumptions register
- Potential participant/contact map

### Gate

Enough authorized operational context exists to design the first workflows responsibly.

## 6. Phase 1 — Establish business ownership and infrastructure

### Objective

Create a secure, business-controlled technical foundation.

### Activities

- Select a business-controlled email identity.
- Create a GitHub account or organization and private repository.
- Enable two-factor authentication and preserve recovery codes.
- Create Vercel and connect it to GitHub.
- Create separate Supabase preview/test and production projects.
- Configure project membership using least privilege.
- Create the Next.js/TypeScript application foundation.
- Configure environment variables without committing secrets.
- Add automated formatting, linting, type-checking, and tests.
- Deploy an empty application through the GitHub-to-Vercel workflow.
- Document ownership, recovery, and access procedures.

### Founder actions

- Create/approve accounts and any required billing.
- Choose trusted backup administrators.
- Store recovery information securely.
- Approve repository and project names.

### Outputs

- Private GitHub repository
- Working preview deployment
- Controlled production deployment
- Separate Supabase environments
- Security and recovery checklist
- Technical setup guide

### Gate

The founder owns and can recover every critical account; no secrets exist in source control; preview and production are separate.

## 7. Phase 2 — Freeze the MVP transaction model

### Objective

Define the rules that every screen, database table, and API must follow.

### Activities

- Finalize roles and permissions.
- Define organization boundaries.
- Define request, offer, allocation, trip, exception, and completion states.
- Define allowed state transitions and responsible actors.
- Define partial and multi-provider fulfilment.
- Define cancellation, correction, replacement, and override behaviour.
- Define the minimum audit event for every material action.

### Outputs

- Role-permission matrix
- End-to-end state diagrams
- Business-rule catalogue
- Status and terminology dictionary

### Gate

Every core state has a clear meaning, permitted actor, entry condition, exit condition, and audit requirement.

## 8. Phase 3 — Complete product and operations specification

### Objective

Turn the PRD into an executable, testable backlog and define how AFOS Operations will support the pilot.

### Activities

- Break each epic into prioritized features.
- Write user stories and acceptance criteria.
- Specify fields, validation, empty states, errors, and permissions.
- Define notification triggers.
- Write the provider onboarding and verification process.
- Draft request intake, matching, dispatch, exception, and completion procedures.
- Draft pricing, settlement, cancellation, and failure decision papers.
- Maintain a risk, assumption, issue, and decision log.

### Outputs

- Prioritized development backlog
- Detailed acceptance criteria
- Initial data dictionary
- Pilot Operations Manual
- Open-decision register

### Gate

The first vertical slice can be built without inventing material product rules during coding.

## 9. Phase 4 — Wireframes and user validation

### Objective

Validate workflows before investing in full implementation.

### Activities

- Create screen inventory and navigation.
- Design mobile driver and provider workflows.
- Design customer and operations desktop/mobile workflows.
- Represent loading, success, failure, empty, expired, and unauthorized states.
- Test prototypes with authorized drivers, dispatchers, providers, and demand-side users.
- Record observations separately from requested solutions.
- Revise the PRD and backlog based on repeated, high-impact evidence.

### Outputs

- Approved wireframes/prototype
- Screen-state specification
- User-testing report
- Updated PRD and backlog

### Gate

Target users can complete the core workflow in the prototype with acceptable assistance and comprehension.

## 10. Phase 5 — Database, API, and security design

### Objective

Design a reliable foundation for organizational data, transactions, and auditability.

### Activities

- Create the relational data model.
- Define identifiers, relationships, constraints, and indexes.
- Define API/server action contracts.
- Create Supabase migrations and seed data.
- Design Row Level Security policies.
- Separate ordinary user, operations, and privileged administrator capabilities.
- Define document storage paths and authorization.
- Define retention, backup, and recovery procedures.
- Create automated permission and integrity tests.

### Outputs

- Entity-relationship model
- Data dictionary
- Version-controlled migrations
- API contracts
- Authorization matrix and RLS policies
- Security test plan

### Gate

Organization isolation, privileged access, transaction integrity, and recovery approach have been reviewed and tested in preview.

## 11. Phase 6 — Build the end-to-end vertical slice

### Objective

Prove the complete architecture using one simplified but real transaction path.

### Activities

- Implement invitation/sign-in and basic organizations.
- Create minimum provider, asset, and capacity records.
- Submit a transport request.
- Match and send a provider offer.
- Accept and allocate truck, trailer, and driver.
- Dispatch a trip.
- Record essential milestones.
- Submit delivery evidence.
- Complete the transaction.
- Display essential operations visibility and audit events.

### Outputs

- Working preview transaction from request through completion
- Automated tests of the happy path and critical failures
- Demonstration and review notes

### Gate

The complete transaction works on target desktop and mobile browsers without unsafe manual database intervention.

## 12. Phase 7 — Complete MVP features

### Objective

Add the remaining capabilities required for a controlled pilot.

### Suggested delivery order

1. Identity, organizations, and role management
2. Provider verification
3. Trucks, trailers, and drivers
4. Capacity declarations
5. Transport-request management
6. Matching and provider offers
7. Allocation and conflict prevention
8. Driver dispatch and trip milestones
9. Exceptions and replacement capacity
10. Delivery and completion
11. Operations dashboard and records
12. Notifications and audit reporting

Each increment follows the branch → automated checks → preview → approval → production workflow.

### Outputs

- Feature-complete MVP in preview
- Updated documentation and test suite
- Pilot training draft

### Gate

All approved MVP acceptance criteria pass, and excluded features have not entered scope without a recorded decision.

## 13. Phase 8 — Quality, security, and operational readiness

### Objective

Establish that the system can be used safely and reliably in a controlled pilot.

### Activities

- Test role and organization isolation.
- Test authentication and account recovery.
- Test duplicate/conflicting allocation prevention.
- Test document access and upload restrictions.
- Test all material state transitions and overrides.
- Test mobile usability and representative weak connectivity.
- Test browser compatibility and accessibility essentials.
- Test error monitoring, backup, and recovery.
- Conduct scenario-based internal operating exercises.
- Resolve critical and high-risk defects.

### Outputs

- Quality report
- Security and permissions report
- Backup/recovery evidence
- Defect register
- Release candidate

### Gate

No unresolved defect creates unacceptable risk to participant data or real transport execution.

## 14. Phase 9 — Pilot preparation

### Objective

Prepare people, rules, data, and support before any live movement.

### Activities

- Secure written pilot participation.
- Complete provider, asset, and driver verification.
- Finalize pricing/quotation and AFOS fee approach.
- Finalize invoicing and settlement.
- Approve cancellation, failure, replacement, and dispute rules.
- Obtain appropriate legal/regulatory review.
- Train participants using test transactions.
- Establish support contacts and escalation procedures.
- Record existing coordination baselines.
- Prepare daily/weekly review templates and issue register.
- Confirm production monitoring and incident response.

### Outputs

- Signed/approved participation arrangements
- Verified pilot participants and resources
- Pilot Operations Manual
- Training records
- Baseline report
- Go-live checklist

### Gate

The operational owner explicitly authorizes live use after product, operational, commercial, legal, and support readiness checks pass.

## 15. Phase 10 — Controlled live pilot

### Objective

Validate AFOS using real demand, verified capacity, and completed container movements.

### Activities

- Start with a small number of supervised movements.
- Review waiting demand, capacity, offers, allocations, trips, and exceptions daily.

### Implemented first operational loop

The first controlled Operations workflow now follows one traceable sequence:

1. Capture a transport request using the assisted three-step intake.
2. Register either a transport company or individual vehicle owner, including declared fleet size, contact, operating areas, and verification state.
3. Register each truck and trailer separately, including document expiry, operational status, and expected return date when unavailable.
4. Calculate compatible capacity from verified active truck–trailer pairs and reject schedule conflicts.
5. Assign an eligible provider through Operations and allocate specific resources for dispatch.
6. Create an assigned trip with database protection against overlapping truck, trailer, or driver schedules.

During the controlled pilot, AFOS Operations may record capacity and provider responses received by phone. This avoids making provider account onboarding a prerequisite for validating the operational transaction, while retaining authorization and audit history.

### Revised pilot access and assignment model

- A first-time customer can submit a public transport request without creating an account.
- Submission returns a request reference and a private tracking link. Only a hash of the tracking code is stored.
- Public tracking shows a deliberately limited status view and never exposes Operations records or other requests.
- Route tariffs provide estimates for configured routes; unknown routes clearly require price confirmation.
- Registered trucks, compatible trailers, document validity, manual availability, and trip schedules are the source of capacity truth.
- Matching assigns the transport company or individual owner first. Specific truck, trailer, and driver details are dispatch information added later.
- Drivers do not require AFOS accounts during the controlled pilot.
- When sufficient capacity is engaged, tracking shows the next available date and lets the customer accept or decline it securely.
- Consolidate metrics and qualitative feedback weekly.
- Record failed requests and root causes.
- Track manual intervention and reported off-platform behaviour.
- Apply urgent operational workarounds safely.
- Prioritize product changes using frequency, impact, and relevance.
- Avoid expanding participant volume faster than operations can support.

### Outputs

- Traceable pilot transaction dataset
- Issue and intervention register
- Participant feedback
- Weekly performance reviews
- Final validation report

### Gate

Each hypothesis is marked `Validated`, `Partially Validated`, or `Not Validated`, followed by a `GO`, `MODIFY`, or `REASSESS` decision.

## 16. Phase 11 — Post-pilot decision and next release

### Objective

Act on evidence without assuming expansion is automatically justified.

### Activities

- Compare pilot results with baseline performance.
- Separate technology, coordination, capacity, and execution failures.
- Review unit economics and collection practicality.
- Identify the smallest corrective or expansion release.
- Update the Concept Note, PRD, architecture, and roadmap.

### Outputs

- Validation decision
- Revised commercial and operating model
- Prioritized next-release plan
- Investment/expansion recommendation

## 17. Cross-phase workstreams

These continue throughout implementation:

- Product discovery and participant relationships
- Documentation and decision control
- Security, privacy, and access reviews
- Legal, regulatory, insurance, and commercial validation
- Testing and quality assurance
- Operational procedure development
- Training and support preparation
- Metrics and validation design

## 18. Initial milestone sequence

| Milestone | Evidence of completion |
|---|---|
| Discovery preserved | Authorized notes, workflows, and contact/consent status recorded |
| Foundation online | GitHub → Vercel preview works with test Supabase |
| Transaction specified | Roles, states, transitions, and rules approved |
| Prototype validated | Representative users can complete core prototype tasks |
| Vertical slice complete | One request completes end to end in preview |
| MVP release candidate | Approved MVP acceptance criteria pass |
| Pilot ready | Participants, rules, support, training, and baselines ready |
| Pilot complete | Formal evidence report and decision issued |

Dates and cost estimates will be added only after the transaction model, backlog, participant availability, and team capacity are known. Any estimate before those inputs should be treated as preliminary.

## 19. Immediate next actions

### Founder

1. Preserve authorized AGL/driver relationships and discovery knowledge.
2. Decide the business-controlled email identity to use.
3. Confirm who, besides the founder, should have emergency account recovery access.
4. Review the Concept Note, PRD, and this Implementation Plan.
5. Mark corrections, unclear terms, and assumptions that do not reflect actual operations.

### Product and technical partner

1. Maintain these three documents as living sources of truth.
2. Create the decision, assumption, risk, and issue registers.
3. Facilitate the role-permission and transaction-state specification.
4. Prepare an exact account and infrastructure setup checklist.
5. Scaffold the application only after account ownership and naming are approved.

## 20. Status tracker

| Phase | Status | Gate result | Notes |
|---|---|---|---|
| 0 — Preserve discovery | In progress | Pending | Discovery toolkit created; interviews and authorized evidence remain founder/participant actions |
| 1 — Ownership and infrastructure | Completed | Passed | GitHub, Vercel, and Central Europe Supabase development environment connected; live schema check passed |
| 2 — Transaction model | In progress | Pending | Working role matrix and tested state graphs created; operational validation required |
| 3 — Product/operations specification | In progress | Pending | Concept Note and PRD v0.2 aligned with implemented pilot model; operational validation remains |
| 4 — Wireframes and validation | Not started | Pending | — |
| 5 — Data/API/security design | In progress | Pending | Initial schema and administrator bootstrap verified live; incremental audit insert policy awaiting application |
| 6 — Vertical slice | Completed | Passed | Guest request, secure tracking, provider registration, registered-fleet matching, trip execution, exceptions, and delivery pass automated and production-build checks |
| 7 — Complete MVP | In progress | Pending | Core operational features implemented; remaining approved pilot scope and real-user validation still required |
| 8 — Readiness testing | Not started | Pending | — |
| 9 — Pilot preparation | Not started | Pending | — |
| 10 — Live pilot | Not started | Pending | — |
| 11 — Post-pilot decision | Not started | Pending | — |

### Implemented release baseline — 13 August 2026

The current production-tested software baseline contains:

1. GitHub source control, automatic Vercel production deployment, Supabase database/auth/storage, versioned migrations, and health verification.
2. Public AFOS homepage and responsive visual system.
3. Operations authentication, password recovery, protected routes, platform authorization, and administrator bootstrap.
4. Provider registration, company/individual-owner distinction, contacts, verification workflow, vehicles, documents, and availability dates.
5. Operations-created requests and a public no-account customer request wizard.
6. Flexible container-size entry, quantity selection, cargo/contact/route/date capture, and assisted stepper presentation.
7. Route-tariff estimates, manual price confirmation, and customer-visible price status.
8. Secure tracking reference/token issuance, downloadable receipt, optional configured email delivery, private tracking, and access recovery.
9. Registered-fleet capacity, truck/trailer compatibility, expired/inactive/unavailable exclusion, and overlap prevention.
10. Next-available-date proposal with private customer acceptance or rejection.
11. Request queue and unified request workspace with search, customer contact, price, matching, assignment, resources, and activity history.
12. Company-first assignment followed by truck, trailer, and provider-managed driver selection.
13. Trip creation and forward-only movement milestones with customer-visible status events.
14. Exception reporting/resolution and operational urgency visibility.
15. Delivery recipient/outcome recording, private evidence upload, completion rules, and tracking outcome.
16. Server-side validation, Row Level Security, narrow anonymous access, hashed secrets, audit events, and automated domain/workflow/security tests.

The baseline does not mark the full MVP or pilot as complete. Real participant validation, operational rules, legal/commercial readiness, notification configuration, and remaining approved MVP scope continue under Phases 7–9.

### Operations consolidation completed — 13 August 2026

1. Replaced legacy dashboard counts with eight workflow-specific operational metrics and an exception-first priority queue.
2. Reduced navigation to five active work areas and redirected retired Capacity, Matching, and Offers routes.
3. Consolidated provider and fleet visibility with paired capacity, engagement, unavailable/expired assets, and declared-versus-registered warnings.
4. Made matching explainable by showing all verified providers, available units, blocking reason, and next known availability while rechecking eligibility at assignment.
5. Added a dedicated open-first Exceptions workspace with customer/provider context, replacement needs, resolution, and history.
6. Re-ran automated regression, lint, production build, deployment, public-route, protected-route, and health verification; maintained the living documents as part of completion.

## 21. Decision log

| Date | Decision | Status | Owner |
|---|---|---|---|
| 12 Aug 2026 | Maintain a Concept Note, PRD, and Implementation Plan as living documents | Approved in principle | Founder |
| 12 Aug 2026 | Put the phased delivery process in the Implementation Plan | Approved in principle | Founder |
| 12 Aug 2026 | Use a mobile-first web application with GitHub, Vercel, and Supabase | Working decision | Founder |
| 12 Aug 2026 | Use Next.js 16 with a verified Webpack production build for the initial Vercel foundation | Implemented | Founder / technical partner |
| 12 Aug 2026 | Use https://afos-platform.vercel.app as the initial Vercel production address | Implemented | Founder |
| 12 Aug 2026 | Host the initial Supabase development project in Central Europe and use test data only | Implemented | Founder |
| 12 Aug 2026 | Defer the first operational schema migration until roles and transaction states are approved | Approved | Founder / technical partner |
| 13 Aug 2026 | Allow customer requests without mandatory accounts and protect tracking with private credentials | Implemented | Founder / technical partner |
| 13 Aug 2026 | Register transport companies and individual owners and calculate capacity from actual vehicles | Implemented | Founder / technical partner |
| 13 Aug 2026 | Use Operations-led assignment and defer mandatory provider and driver accounts during the controlled pilot | Implemented pilot model | Founder / technical partner |
| 13 Aug 2026 | Propose a future date when fleet is engaged and let the customer accept or decline | Implemented | Founder / technical partner |
| 13 Aug 2026 | Make living-document updates part of the definition of done for every agreed feature | Approved delivery rule | Founder / technical partner |
| 13 Aug 2026 | Consolidate Operations around requests, registered fleet, trips, and exceptions and retire manual capacity/offer navigation | Implemented | Founder / technical partner |

## 22. Revision history

| Date | Version | Change | Author/owner |
|---|---:|---|---|
| 12 Aug 2026 | 0.1 | Initial phased implementation plan | AFOS / pending review |
| 13 Aug 2026 | 0.2 | Recorded the implemented guest, provider fleet, capacity, assignment, and alternative-date workflow; corrected phase status | Founder / technical partner |
| 13 Aug 2026 | 0.3 | Audited and recorded the complete implemented baseline; made documentation maintenance a formal definition-of-done requirement | Founder / technical partner |
| 13 Aug 2026 | 0.4 | Completed and verified the six-feature Operations consolidation block | Founder / technical partner |
