# African Freight Operating System (AFOS)

## MVP Implementation Plan

**Initial market:** Sierra Leone  
**Document status:** Living draft  
**Version:** 0.1  
**Last updated:** 12 August 2026

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
| 1 — Ownership and infrastructure | In progress | Pending | GitHub and Vercel live; Central Europe Supabase development project connected; live schema verification pending deployment |
| 2 — Transaction model | In progress | Pending | Working role matrix and tested state graphs created; operational validation required |
| 3 — Product/operations specification | Started | Pending | PRD v0.1 created |
| 4 — Wireframes and validation | Not started | Pending | — |
| 5 — Data/API/security design | In progress | Pending | Initial secure schema applied successfully by founder; live table and RLS verification underway |
| 6 — Vertical slice | Not started | Pending | — |
| 7 — Complete MVP | Not started | Pending | — |
| 8 — Readiness testing | Not started | Pending | — |
| 9 — Pilot preparation | Not started | Pending | — |
| 10 — Live pilot | Not started | Pending | — |
| 11 — Post-pilot decision | Not started | Pending | — |

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

## 22. Revision history

| Date | Version | Change | Author/owner |
|---|---:|---|---|
| 12 Aug 2026 | 0.1 | Initial phased implementation plan | AFOS / pending review |
