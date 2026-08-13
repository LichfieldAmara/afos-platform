# African Freight Operating System (AFOS)

## Concept Note

**Product:** Container Transport Capacity Coordination Platform  
**Initial market:** Sierra Leone  
**Document status:** Living draft  
**Version:** 0.3
**Last updated:** 13 August 2026

## 1. Executive summary

The African Freight Operating System (AFOS) is a proposed digital coordination platform for container road transportation in Sierra Leone. It will connect customers and freight forwarders that require container transport with verified transport providers that have suitable available trucks, trailers, and drivers.

AFOS is intended to improve how existing transport capacity is discovered, confirmed, allocated, dispatched, monitored, and completed. The first product will be a narrow, operations-assisted web application used to validate the business and operating model through real transport movements.

AFOS will not initially own transport assets. It will coordinate capacity belonging to participating providers.

## 2. Background

The concept originated from direct operational experience in container transport at AGL in Sierra Leone. Initial observations include:

- Container transport demand can exceed the capacity of an individual provider.
- Capacity is distributed among established companies, smaller operators, and independent operators.
- Customers may contact multiple providers manually when capacity is unavailable.
- Transport companies already subcontract or coordinate informally.
- There is no known standardized, shared mechanism for viewing and coordinating available container-transport capacity.
- Initial conversations with some AGL drivers indicate that the problem and proposed direction are relevant to their work.

These observations support further validation but do not constitute a formal AGL partnership, confirmed national market size, or proven willingness to transact through AFOS.

## 3. Problem statement

Sierra Leone's container road-transport market appears to face two connected problems:

1. **Capacity constraints:** An individual provider may not have enough suitable trailers available when demand occurs.
2. **Coordination constraints:** Capacity that exists elsewhere is fragmented and difficult to discover, verify, and coordinate reliably.

The result can include delayed movements, lost business, customer frustration, inefficient asset use, and demurrage exposure.

## 4. Proposed solution

AFOS will provide a trusted workflow through which:

1. A customer or freight forwarder submits a genuine container-transport request without being forced to create an account.
2. AFOS Operations registers and verifies transport companies and individual vehicle owners, including their trucks and compatible trailers.
3. AFOS calculates suitable capacity from registered, compliant vehicles and their schedules.
4. AFOS Operations identifies and assigns an available provider; provider responses may initially be coordinated by phone.
5. Specific trucks and trailers are allocated. A driver may be recorded for dispatch, but a separate driver account is not required during the controlled pilot.
6. Trips are dispatched and progressed through clear statuses.
7. Exceptions are recorded and managed.
8. Delivery is confirmed and the transaction is completed.

If suitable vehicles are engaged, the customer is shown the next supported date and can accept or decline it through their private tracking page.

The core transaction is:

`Guest request → Verified fleet → Availability check → Company assignment → Vehicle allocation → Dispatch → Move → Deliver → Complete`

## 5. Target users

### Demand side

- Importers and exporters
- Cargo owners
- Freight forwarders
- Other organizations requiring container road transportation

### Supply side

- Established transport companies
- Smaller transport operators
- Qualified independent operators
- Drivers working for participating providers

### Platform operations

- AFOS operations coordinators
- AFOS administrators

## 6. Initial product approach

AFOS will begin as a mobile-first responsive web application. It will work in a browser on phones, tablets, and computers. The driver experience will be optimized for inexpensive Android phones, short actions, and inconsistent connectivity.

The first release will use human-assisted matching and operational oversight. AFOS Operations will initially record dispatch and movement updates; a separate driver interface will be introduced only if field validation shows it improves execution. The product will prioritize traceability and successful transaction completion over automation.

The proposed technical foundation is:

- Private GitHub repository for source control
- Next.js and TypeScript for the application
- Vercel for preview and production hosting
- Supabase PostgreSQL for data
- Supabase Auth for authentication
- Supabase Storage for controlled document storage
- Supabase Row Level Security for organization-level data isolation

This architecture is a working decision that may be revised if implementation evidence exposes a material limitation.

## 7. Initial value proposition

### For customers and freight forwarders

- Easier access to suitable verified capacity
- Less manual provider-by-provider coordination
- Clearer request and trip status
- Better visibility into delays and exceptions
- One traceable transaction record

### For transport providers

- Access to relevant transport opportunities
- Ability to expose genuine unused capacity
- Clear allocation of trucks, trailers, and drivers
- Better coordination with AFOS and customers

### For AFOS

- Commercial value when transportation is successfully coordinated
- Operational data for improving matching and fulfilment
- A foundation for evidence-based expansion

## 8. Business model hypothesis

AFOS is a two-sided B2B transport-coordination marketplace. The initial commercial principle is that AFOS earns when a successful movement occurs.

Possible pilot models include:

- A fixed coordination fee per completed container movement
- A percentage of completed transport value
- A customer-paid service fee
- A provider-paid coordination fee

No permanent pricing or commission model has been approved. Pricing, invoicing, settlement, taxes, and incentives to bypass the platform require validation before live commercial operation.

## 9. MVP scope

The MVP will support:

- User authentication and role-based access
- Organization and membership management
- Provider onboarding and verification
- Truck, trailer, and driver records
- Registered-fleet availability calculated from active trucks, compatible trailers, documents, unavailable dates, and trip schedules
- Public no-account request submission and secure private tracking
- Customer acceptance or rejection of a proposed later date
- Transport requests for 20-foot and 40-foot containers
- Matching and provider offers
- Operations-led company assignment, with provider response coordinated directly during the pilot
- Single-provider and multi-provider allocation
- Dispatch and trip status management
- Exception recording and resolution
- Delivery evidence and completion
- Operations dashboards and searchable records
- Essential notifications and audit history

The MVP will not initially include:

- Native mobile applications
- AI matching
- Dynamic pricing
- Integrated payments or custody of funds
- Live GPS tracking
- Fuel or maintenance management
- Advanced route optimization
- Financial or insurance products
- Expansion beyond container road transportation

## 10. Pilot objective

The pilot will answer:

> Does AFOS improve the coordination of container transport capacity under real operating conditions in Sierra Leone?

It will test demand, supply, trust, matching, execution, adoption, and commercial value. The primary measure will be the proportion of requested container movements successfully matched, allocated, and completed through AFOS.

## 10A. Product implemented to date

As of 13 August 2026, AFOS has a deployed, test-data-only operational vertical slice. Implemented capabilities include:

- A public, mobile-responsive AFOS homepage explaining the container-transport proposition.
- Secure Operations authentication, sign-out, password recovery, role checks, and founder-administrator bootstrap.
- A no-account customer request wizard with container details, quantity, route, required date, cargo information, and contact details.
- Route-based estimated pricing where a tariff exists and an explicit price-confirmation state where one does not.
- A request confirmation containing a reference, private tracking credentials, downloadable receipt, and optional automatic email when an email service is configured.
- Private customer tracking with request, price, assigned provider, trip milestones, exceptions, and delivery outcome.
- Operations-assisted recovery that replaces lost tracking access after identity checks and invalidates the previous code.
- Registration and verification of transport companies and individual vehicle owners.
- Separate truck and trailer records, document-expiry information, operational availability, and return-to-service dates.
- Registered-fleet capacity calculation, compatibility checking, schedule conflict prevention, and next-available-date handling.
- A unified Operations request workspace for price confirmation, provider assignment, resource selection, trip execution, exceptions, delivery, and activity history.
- Controlled trip status progression, exception reporting and resolution, private proof-of-delivery upload, recipient capture, and completion.
- Database authorization, Row Level Security, narrow public database functions, hashed tracking secrets, audit history, and automated workflow tests.
- Version-controlled delivery through GitHub, Vercel, and Supabase, with a live application/database/schema health check.

This is evidence of software implementation, not evidence that the commercial or operational model has yet been validated through a controlled live pilot.

## 11. Current evidence and relationships

- The founder has direct experience as a truck supervisor at AGL.
- Some AGL drivers have been consulted informally and consider the idea relevant.
- Additional authorized engagement is required after the founder leaves AGL.
- Permission must be obtained before retaining contacts, using company information, or representing AGL as a participant.
- AGL must not be described publicly as a partner or pilot participant without formal authorization.

## 12. Key risks

- Providers may not declare genuine or accurate availability.
- Customers and providers may coordinate outside AFOS after introduction.
- Provider response may be too slow for operational requirements.
- Driver workflows may be impractical under field conditions.
- Multi-provider fulfilment may create excessive manual complexity.
- Pricing and settlement disagreements may prevent adoption.
- Sensitive identity and operational records may be mishandled.
- Poor connectivity may interrupt status reporting.
- Early enthusiasm may not translate into repeat transactions.

## 13. Unresolved decisions

The following must be resolved before a live commercial pilot:

- Provider, asset, and driver verification standards
- Required documents and expiration rules
- Pricing and quotation procedure
- AFOS fee or commission model
- Invoicing and settlement process
- Cancellation and failure rules
- Breakdown and replacement-capacity procedures
- Participant obligations and dispute handling
- Data retention and privacy requirements
- Relevant Sierra Leone regulatory and legal requirements
- Formally committed pilot participants

## 14. Success and decision

The pilot will end in one of three decisions:

- **GO:** Evidence supports further investment and controlled expansion.
- **MODIFY:** The need is real, but the product or operating model requires correction and retesting.
- **REASSESS:** Evidence does not support the fundamental coordination model.

The development principle is:

> Build narrowly. Test with real transport. Measure relentlessly. Expand only on evidence.

## 15. Document governance

This is a living document. Material changes should update the version, date, and decision log below.

| Date | Version | Change | Decision owner |
|---|---:|---|---|
| 12 Aug 2026 | 0.1 | Initial consolidated concept note | Founder / pending review |
| 13 Aug 2026 | 0.2 | Recorded no-account demand, company/individual fleet registration, vehicle-led capacity, operations assignment, and alternative-date response | Founder / technical partner |
| 13 Aug 2026 | 0.3 | Added the complete implemented-product baseline from infrastructure and identity through request, tracking, operations, trip, exception, and delivery workflows | Founder / technical partner |
