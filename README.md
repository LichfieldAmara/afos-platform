# AFOS Platform

African Freight Operating System (AFOS) is a proposed container transport capacity coordination platform for Sierra Leone.

The initial product will be a mobile-first web application connecting genuine container transport demand with verified suitable capacity and coordinating movements through completion.

## Project documents

- [Concept Note](docs/concept-note.md)
- [MVP Product Requirements Document](docs/prd.md)
- [MVP Implementation Plan](docs/implementation-plan.md)

## Current status

AFOS now has a deployed, test-data-only operational vertical slice. It supports public no-account transport requests and private tracking, Operations authentication, provider verification, registered fleet and availability, company assignment, trip milestones, exceptions, proof of delivery, and audited completion. Product discovery, real-user validation, pilot rules, and commercial/legal readiness remain in progress.

The working technical direction is:

- Next.js with TypeScript
- Supabase for PostgreSQL, authentication, and controlled file storage
- Vercel for preview and production deployment
- GitHub for source control and review

See the Implementation Plan for phases, delivery gates, responsibilities, and current status.

Every agreed feature must update the living Concept Note, PRD, and Implementation Plan where it changes the product model, requirements, or delivery status. Documentation, tests, and production verification are part of the definition of done.

## Development principle

> Build narrowly. Test with real transport. Measure relentlessly. Expand only on evidence.
