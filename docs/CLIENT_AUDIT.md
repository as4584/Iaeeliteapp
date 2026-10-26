# Client Audit — IAE Elite

Audited 2026-10-25. Sources: `https://iaeelite.com/` (fetched raw; full extracted text in
`docs/research/iaeelite-home-text.txt`), the Instagram profile linked from the site, and the
site's embedded media (42 inline data URIs, decoded and reviewed).

Purpose of this file: the single place to check *what is actually known* before writing copy,
content, or App Store metadata. If a claim is not in **Verified**, do not ship it as fact.

---

## 1. Verified facts

### Identity
- Business name: **Innovation Artist Escort** — brand **IAE Elite**, sub-line **"Elite Services"**.
- A division of **Innovation Business Development Solutions** (`https://innovationdevelopmentsolutions.com`).
- Taglines used on the site:
  - "We move the people the world is watching."
  - "Exceptional spaces. Epic experiences." (page `<title>`)
  - "Anywhere · Any Place · Anytime"
  - "Discretion by default. Presence on command."
  - Mission: "At Innovation, we don't chase profit. We pursue excellence."
- Positioning: one confidential point of contact for artist transport, elite creative spaces,
  venue logistics, and full event facilitation.
- Region: "Full operational coverage across **New York and New Jersey**".
- Global accommodations/travel are offered ("anywhere in the world").

### Contact
- Email: `innovationbusiness@icloud.com`
- Direct line: `+1 (551) 301-4430` (`tel:+15513014430`)
- Response promise: "We respond privately — usually within the hour during active hours."
- Instagram: `https://instagram.com/GETYOURBUSINESSSTARTEDNOW`
- Facebook: footer shows a "Facebook" label **with no working URL** (broken link on the site).

### Services (exact names from the site; no prices anywhere)
**Capabilities** — "Six coordinated disciplines. One accountable team."
1. Artist Transport — "Door to door, on the second"
2. Itinerary & Detail Management — "Day or night, as directed"
3. Flight & Transport Retrieval — "Wheels-up to wheels-down"
4. Venue Facilitation — "Room set & sealed"
5. End-to-End Event Facilitation — "One timeline, every cue"
6. Secure Detail Facilitation — "Facilitated & fully licensed"

**For Creators & Public Talent**
1. Festival & Convention Escort — "Floor to stage, covered"
2. Live Streaming & Public Content Support — "On camera, never in frame"
3. Controlled Fan Interaction — "Access, on your terms"
4. Crowd Management & Movement Coordination — "Coordinated, not confrontational"
5. Discreet Everyday Escort — "Present, never imposing"
6. Travel & Tour Escort — "One thread, every city"

**IAE Elite Spaces**: Content & Video · Music & Recording · Podcast & Broadcast ·
Meetings & Corporate · Social & Celebrations · Private Gatherings.

**Global Accommodations**: Flights & Retrieval · Residences & Suites · The Stay, End to End.

### Legal/compliance language the site is careful about (must be preserved in the app)
- "IAE is **not a security or protective-services firm** and does not directly provide guards or
  armed personnel." Protective services are coordinated through accredited, licensed partners.
- Creator crowd work is "coordination and facilitation, not licensed security".
- "Non-disclosure is standard on every engagement."

### Scope & scale claims (the client's own claims)
- Up to 13,000 venue capacity · NY & NJ regional command · 30–60 days recommended lead time
  for large engagements · small events in as little as 24 hours.

### The engagement process (verbatim steps)
01 Request → 02 Intake (private intake form) → 03 Evaluation → 04 Individual Briefs →
05 Confirmation (by email) → 06 Deposit & Lock.

### Conversion mechanism (how the site actually converts)
- Primary CTA everywhere: **"Request a Confidential Consultation"**.
- Contact form fields: Name · Organization / Management · Event date · City · Best number ·
  Your email · What do you need handled? (select, 11 options) · Details.
- Submit = **"Send Elite Service Request"** → opens a **pre-filled email in the visitor's mail
  app** ("just review and press Send"). There is **no backend, no booking calendar, no
  payments, no CRM integration**.
- "What do you need handled?" options: Full engagement (everything) · Artist Transport ·
  Elite Spaces — Content & Video / Music & Recording / Podcast & Broadcast / Meetings &
  Corporate / Social & Private Gatherings · End-to-End Event Facilitation · Venue Facilitation ·
  Global Accommodations & Travel · Secure Detail Facilitation.

### Brand system (from site CSS)
- Colors: obsidian `#0A0A0B`, graphite `#141417`, panel `#16161A`, steel `#2A2D33`,
  gold `#A67C22`, gold-bright `#D9B25E`, gold-deep `#5E4410`, bone `#F4F1EA`, ash `#A2A2A8`,
  night `#16202E`, slate `#5A6572`.
- Fonts: **Bodoni Moda** (display, incl. italics), **Archivo** (tactical labels, caps),
  **Manrope** (body), Jost (minor).
- Crest logo: gold IAE monogram with crown, ring, shield — "Innovation Artist Escort / Elite Services".

### Media
- 37 photos + 5 short MP4 reels (the "Film": The Arrival / The Room / The Standard / The
  Detail / The Motion). Night photography, gold practical light, black SUVs/motorcades,
  private jets, green rooms, velvet-rope entrances, studios. Faces largely hidden — consistent
  with the discretion positioning.

### Instagram (`@getyourbusinessstartednow`, display name "D HOVA")
- Bio: "National Business Development since 2015. Founder at IBDS & IAE Excellence over profit."
- ~1,092 followers. Highlights: DISCIPLINE, IAE, MASTERY, INNOVATION, BOSS?, OUR MASTERPIECE.
- This is the **founder's personal/business-development account**, not a dedicated IAE brand
  account. Post captions were not readable without login.

---

## 2. Brand analysis (inference, not fact)
- Register: **private-aviation / black-car / luxury hospitality**, not nightlife or "bodyguard".
  The voice is clipped, declarative, confidential: "Executed in silence." "Handled quietly."
- Visual signature: black field, warm gold rim light, wet reflective streets, serif headlines
  with an italic gold accent word. The app should feel like a **private dossier / concierge
  line**, not a marketplace.
- Social energy: the founder's account sells *discipline, mastery, excellence over profit*.
  That maps to the Mission section — worth surfacing as the "why".

## 3. Website IA (one long single page)
Home → The Film → The Standard → Capabilities → For Creators → The Detail/The Motion (reels) →
Elite Spaces → The Mission → Global Accommodations → Confidentiality → The Engagement →
Scope & Scale → Standing Arrangement → Field Record (gallery) → The Operation (team) → Begin (contact form).

## 4. Opportunities for the app
1. **The request flow is the product.** The site's form is a long single block; on mobile it
   becomes a guided 3-step "brief" with service selection, timing, and contact — then the same
   proven pre-filled email (the client's existing, working pipeline).
2. **Honest outcome tracking.** iOS Mail composer reports `sent / saved / cancelled`; the app can
   say exactly what happened, which the website cannot.
3. **One-tap private line** (call) and email, always reachable.
4. Re-organize 22+ offerings into four clear collections instead of one endless scroll.
5. Native film reels (muted autoplay, tap for sound) rather than a web page of embedded videos.

## 5. Weaknesses / risks found
- **"As Featured In" press wall** (Forbes, GQ, Variety, Rolling Stone, Billboard, Vanity Fair,
  THR, Esquire, Complex, XXL, VIBE, Hypebeast) — **no supporting links or articles**. Treated
  as **UNVERIFIED** and excluded from the app (App Store guideline 2.3.1 risk + client
  reputation risk) until the client provides coverage links.
- Facebook link is broken (no URL).
- Imagery appears to be AI-generated / stylized renders. Fine for brand mood; **must not be
  captioned as real client engagements**. Site itself says "Representative of the standard".
- Page weight: 12.8 MB single HTML with base64 media — slow on cellular. App bundles optimized assets.
- The word "Escort" in the name can be misread; App Store copy must lead with
  "artist transport & event facilitation" so review and search context is unambiguous.
- "By Standing Arrangement" emergency-exit line: availability is "reserved for clients under a
  standing arrangement" — no number published. Not exposed in V1.

## 6. Unknowns (need client confirmation)
- Rights/ownership of the site imagery and reels for App Store screenshots.
- Press coverage claims (see above).
- Business hours / "active hours" definition.
- Whether they want a server-backed inquiry inbox (vs. email) and who monitors it.
- Correct Facebook URL; whether a dedicated IAE Instagram exists.
- Legal entity name for the App Store seller field and privacy policy.
- Whether prices/packages should ever be shown (site shows none — app shows none).
