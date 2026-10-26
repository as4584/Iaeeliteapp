# Product Spec — IAE Elite iOS App (V1)

Status: approved-by-default working spec (2026-10-25). Changes to scope go through this file.

## Client goal
IAE Elite sells discreet, end-to-end movement and event facilitation to artists, executives,
creators and private clients in NY/NJ. Every engagement starts with **a private request**. Today
that request happens on a long single web page. The app's job is to make IAE feel like a
private line in the client's pocket: understand the offer in seconds, pick what needs handling,
and send a complete, well-formed request — then reach a human instantly.

## Verified inputs
See `docs/CLIENT_AUDIT.md §1`. Key constraints carried into the product:
- No public prices, no booking calendar, no backend. Conversion = pre-filled email to
  `innovationbusiness@icloud.com`; secondary = call `+1 (551) 301-4430`.
- 6 Capabilities, 6 Creator services, 6 Space types, 3 Accommodation services — exact names.
- 6-step engagement process; deposit happens later, offline.
- "Not a security firm" language must stay attached to Secure Detail and Crowd services.

## Inferred product decisions (ours, reversible)
| Decision | Why |
| --- | --- |
| Four tabs: **Home · Services · Request · Connect** | Request gets its own tab = permanent prominence; Film/gallery live in Home (brand) rather than a fifth tab. |
| Services grouped into 4 collections (Capabilities, For Creators, Elite Spaces, Global Travel) | Mirrors the business, scans on a phone. |
| Request flow = 3 steps + review (What → When & Where → Who → Review) | Same fields as the site form, chunked; each step is answerable in < 20 s. |
| Delivery via native Mail composer, fallback to `mailto:`, fallback to call/copy | Uses the client's existing working pipeline; no inbox to staff; no secrets in app. |
| Outcome screen reports the composer's real status | "Sent" only when iOS reports `sent`. Saved/cancelled/unknown are told plainly. |
| Badges limited to three, all fact-based: **FLAGSHIP** (Full engagement), **24-HR READY** (Event Facilitation — "small events in as little as 24 hours"), **LICENSED PARTNERS** (Secure Detail) | Each answers "why notice this?" from a verified claim. Remote-configurable. |
| Press wall omitted | Unverified (see audit §5). |
| Remote content JSON with bundled fallback | Copy/badges/order/contact editable without a binary. |
| Dark-only UI | The brand is a black/gold field; a light mode would be off-brand. |

## Unverified (needs client)
Media rights · press claims · active hours · Facebook URL · seller legal entity · privacy
policy URL & support URL · whether a server inbox is wanted later.

## Required for V1
1. Branded launch (crest icon + splash), dark/gold design system.
2. Home: hero film, positioning, primary CTA, featured offering, mission, 6-step process, field gallery.
3. Services: 4 collections, list → detail with hero image, tagline, description, notes, CTA
   "Request this" which pre-selects the service in the request flow.
4. Request flow: multi-select services (with badges), date (optional, free text or picker),
   city, name, organization, phone, email, details; validation; review; send via Mail;
   honest outcome screen; call fallback.
5. Connect: email (composer), call, Instagram, website, parent company; response-time note;
   confidentiality statement.
6. Remote content: fetch → validate → cache → fallback to bundled; never blank.
7. Accessibility labels, 44pt targets, Dynamic Type tolerance, reduced motion respected.
8. `npm run check` (typecheck + lint + tests) green; release docs complete.

## Important but can follow
Draft persistence of an unfinished request · Add to Calendar for the requested date ·
iPad-tailored layout (V1 ships iPhone-only) · analytics (none in V1).

## Phase 2
Server-backed inquiry (Supabase table + edge function email) with request ID and status ·
client content console · push notifications for confirmed engagements · secure client portal
(itineraries) · real Instagram feed via official API.

## Non-goals (V1)
Payments/deposits · accounts/login · live availability calendar · chat · prices · any
security-guard ordering · scraping social platforms.

---

## User journey (V1)
```
Launch (crest splash, ~1s)
 → Home: film hero "We move the people the world is watching." [Request a Consultation]
   → scroll: Featured (Full engagement, FLAGSHIP) · Collections · The Standard/Mission · How it works · Field
 → Services tab: collection chips → service rows → Service detail [Request this service]
 → Request: Step 1 What (pre-selected) → Step 2 When & where → Step 3 Who → Review
   → [Send request] → iOS Mail composer (pre-filled)
   → Outcome: Sent ✓ "Request on its way" | Saved as draft | Not sent (cancelled) | Mail unavailable → call / mailto / copy
 → Connect: call private line · email · Instagram · website
Returning user: lands on Home; Request tab keeps the in-progress form for the session.
```

## Primary demo screens (7)
1. Home hero (film + crest + CTA)
2. Services collection list
3. Service detail (Artist Transport)
4. Request Step 1 — service selection with badges (signature moment)
5. Request Step 3 / Review — the brief summary
6. Outcome — "Request on its way" (signature moment)
7. Connect — private line

## MVP acceptance test
| # | Criterion | How it is checked |
| --- | --- | --- |
| 1 Launch | App launches to branded Home, no Expo placeholder anywhere | Screenshot; grep for template strings |
| 2 Understand | Home first viewport shows brand, one-line value, primary CTA | Screenshot at 375×667 and 430×932 |
| 3 Explore | All 4 collections reachable in ≤ 2 taps | Navigation test |
| 4 Discover | Every service has a detail screen with description | Content test: all ids resolve |
| 5 Request | Flow produces a complete email body with all fields | Unit test on `buildRequestEmail` |
| 6 Contact | Email + call in one tap; no copy-paste needed | Contact screen test |
| 7 Social | Instagram reachable from Connect | Screen test |
| 8 Content | Services/badges/contact come from remote JSON when available, bundled otherwise | Repository tests (ok, invalid, offline) |
| 9 Quality | No unfinished screen; invalid/loading/error states designed | Visual QA log |
| 10 Release | Dev build → internal → TestFlight → App Store path documented | `docs/APP_STORE_RELEASE.md` |
| Honesty | Success copy shown only for `status === 'sent'` | Unit test on outcome mapping |
