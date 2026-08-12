# AFOS Interface Design Research

**Status:** Living research note  
**Last updated:** 12 August 2026

## Sources reviewed

- [Behance fleet-management dashboards](https://www.behance.net/search/projects/fleet%20management%20dashboard)
- [Behance logistics dashboards](https://www.behance.net/search/projects/logistics%20dashboard)
- [Dribbble logistics dashboards](https://dribbble.com/tags/logistics-dashboard)
- [Dribbble dispatch dashboards](https://dribbble.com/search/dispatch-dashboard)
- [Dribbble freight dashboards](https://dribbble.com/search/freight-dashboard)
- [Awwwards transport and logistics examples](https://www.awwwards.com/sites/search/?text=transport%20logistics)
- [21st.dev component community](https://21st.dev/)
- [Behance logistics and transport references](https://www.behance.net/search/projects/logistics%20website)
- [Dribbble logistics web references](https://dribbble.com/tags/logistic-web-design)
- [Pinterest logistics website references](https://www.pinterest.com/search/pins/?q=logistics%20website%20design)

These are inspiration sources, not templates to copy. AFOS will use original layouts, language, components, and branding.

## Patterns selected for AFOS

- Persistent desktop navigation for Operations and provider managers.
- A top summary band showing work requiring attention, not decorative statistics.
- Status chips with text and colour; colour is never the only signal.
- A primary work queue organized around the next required action.
- Tables on wide screens that become cards on small screens.
- Request and trip detail pages with a visible chronological event timeline.
- Exceptions elevated above routine activity.
- Progressive disclosure: summary first, operational detail on demand.
- Consistent filters for status, provider, container size, date, and location.
- Large, single-purpose driver actions with confirmation and retry feedback.

## Patterns rejected

- Map-dominated dashboards before live GPS exists.
- Large decorative charts without operational decisions attached.
- Tiny low-contrast text and icon-only actions.
- Dense desktop tables reused unchanged on phones.
- Colour-only status meanings.
- Fake real-time telemetry or invented commercial numbers.

## AFOS visual direction

- Deep green communicates operations and trust.
- Warm orange identifies the primary action and urgent attention.
- Warm neutral surfaces reduce glare and distinguish AFOS from generic blue SaaS dashboards.
- Typography should be direct, compact, and readable on inexpensive Android devices.
- Motion remains minimal and respects reduced-motion preferences.
- The public site uses editorial-scale typography, cinematic transport imagery, restrained pill actions, modular narrative sections, and generous space inspired by contemporary award-site composition.
- Operational screens remain more compact than the public site; visual drama must never obscure actions, statuses, or exceptions.

### Refined public-site direction

- Preserve the approved positioning statement: “Moving container transport from fragmented calls to one clear workflow.”
- Use a bold Inter-style grotesk headline with tight tracking and deliberate line breaks.
- Lead with container, trailer, truck, and port imagery rather than abstract software artwork.
- Keep the deep operational green, warm off-white, and safety orange system.
- Borrow hierarchy and confidence from premium references, but avoid generic freight-company patterns such as invented statistics, testimonials, or quotation widgets during the controlled pilot.

## Validation rule

Visual quality does not validate usability. Every important workflow must be tested with representative users using realistic tasks before pilot approval.
