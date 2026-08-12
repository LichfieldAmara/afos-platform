# AFOS Role and Permission Matrix

**Status:** Working specification; pilot validation required  
**Source of truth:** `domain/permissions.ts`

| Capability | Customer | Freight forwarder | Provider manager | Provider dispatcher | Driver | AFOS Operations | Administrator |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Create/manage own requests | Yes | Yes | — | — | — | Read all | All |
| Manage own provider profile | — | — | Yes | — | — | Verify | All |
| Manage own fleet | — | — | Yes | Yes | — | — | All |
| Declare own capacity | — | — | Yes | Yes | — | Read all | All |
| Respond to own offers | — | — | Yes | Yes | — | Manage all | All |
| Allocate resources | — | — | — | — | — | Yes | All |
| View/update assigned trip | — | — | — | — | Yes | Manage all | All |
| Report exception | — | — | Yes | Yes | Yes | Manage all | All |
| Submit delivery evidence | — | — | — | — | Assigned trip | Manage all | All |
| Confirm delivery | — | — | — | — | — | Yes | All |
| Read audit history | — | — | — | — | — | Yes | All |
| Administer access | — | — | — | — | — | — | Yes |

## Rules

- Access is granted through organization membership, never solely by knowing a record identifier.
- Demand-side users see only requests belonging to organizations in which they have an active membership.
- Provider users see only their provider's assets, capacity, offers, allocations, and trips, except information explicitly included in an offer.
- Drivers see only trips currently or historically assigned to their driver identity.
- AFOS Operations may coordinate across organizations but cannot administer platform access unless separately granted administrator authority.
- Suspended memberships immediately lose active access; transaction history remains intact.
- Database Row Level Security must enforce these rules independently of the interface.

## Validation questions

- Can a provider dispatcher also register new assets, or must a provider manager approve them?
- May customers confirm delivery, or only AFOS Operations during the pilot?
- Should freight forwarders operate on behalf of multiple customer organizations?
- Which AFOS staff may view sensitive driver documents?

