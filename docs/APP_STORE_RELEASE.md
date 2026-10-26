# App Store release path

**Nothing is submitted without Alex's explicit approval.** Every step below that touches
Apple or EAS servers is a manual, approved action.

## Identity
| Item | Value / status |
| --- | --- |
| App name (store) | **IAE Elite** (30-char limit OK) — *confirm with client* |
| Subtitle draft | Artist transport & events |
| Bundle ID | `com.innovationartistescort.iaeelite` — placeholder until the client confirms the Apple account owner |
| Version | `1.0.0` (semantic; `app.json`) |
| Build number | Managed remotely by EAS (`appVersionSource: remote`, `autoIncrement`) |
| Devices | iPhone only (`supportsTablet: false`) — iPad layout is Phase 2 |
| Category | Lifestyle (alt: Business) |
| Age rating | 4+ (no user content, no web browsing in-app) |
| Encryption | `usesNonExemptEncryption: false` (HTTPS only) |

## Who owns the Apple account (decision needed)
Recommended: **the client enrolls** (Apple Developer Program, organization, needs a D-U-N-S
number) and adds Alex as an App Manager. Publishing under Alex's account makes the client's
app depend on Alex's membership. Seller name shown on the store = the enrolled entity.

## Pipeline
1. **Dev/QA (now):** `npx expo start` → Expo Go on an iPhone (all modules used are in Expo Go).
   Web build for layout QA: `npx expo start --web` + `python scripts/screens.py`.
2. **Internal build:** `npx eas-cli@latest build -p ios --profile preview` → install via QR (register device UDIDs).
3. **TestFlight:** `npx eas-cli@latest build -p ios --profile production` →
   `npx eas-cli@latest submit -p ios --profile production` → internal testers in App Store Connect.
4. **Submission:** complete metadata below in App Store Connect → Submit for Review.

## Required before submission (checklist)
- [ ] Client approval of all copy, imagery and media rights (see CLIENT_AUDIT §6)
- [ ] Privacy policy URL (hosted; content inputs in `docs/PRIVACY.md`)
- [ ] Support URL (e.g. `https://iaeelite.com/` with contact section, or a dedicated page)
- [ ] App Privacy questionnaire answered (see `docs/PRIVACY.md` — "Data Not Collected" by the app)
- [ ] Screenshots: 6.9" (1320×2868) and 6.5" (1284×2778) sets from a real device/simulator
- [ ] `EXPO_PUBLIC_CONTENT_URL` set in `eas.json` production env (or left empty = bundled content)
- [ ] `eas.json` submit `appleId` / `ascAppId` filled in
- [ ] Physical-device pass of `docs/QA.md` device checklist (Mail composer cannot run in Simulator)

## Screenshot plan (story order)
1. Home hero — "We move the people the world is watching."
2. Services — Capabilities list with FLAGSHIP
3. Service detail — Artist Transport
4. Request step 1 — selection with Full Engagement selected
5. Review — "Your brief."
6. "Request on its way." confirmation
7. Connect — private line

## Store copy (draft — client to approve)
**Promotional text:** One private line for everything around your principal — transport,
spaces, venues, and events across New York and New Jersey.

**Description:**
IAE Elite is the private mobile line to Innovation Artist Escort — the single operation behind
high-profile movement for artists, executives, creators, and private clients.

• Explore capabilities: artist transport, itinerary management, flight retrieval, venue and
  end-to-end event facilitation, and facilitated secure detail through licensed partners.
• For creators: festival and convention escort, live-stream support, fan interaction, and tour logistics.
• Elite Spaces: private studios, podcast sets, lounges, and venues provisioned to spec.
• Send a complete, confidential request in under a minute — what you need, when, and where.
• Reach the team directly by phone or email.

IAE is not a security firm; protective services are coordinated through accredited, licensed partners.

**Keywords:** artist transport,event facilitation,venue,chauffeur,tour logistics,creator support,green room,concierge,NYC,New Jersey

## Review notes (for App Review)
- No login. The request flow composes an email to the business using the iOS Mail composer;
  nothing is sent until the user taps Send in Mail. If Mail isn't configured, the app offers
  call / copy-text alternatives.
- "Escort" refers to artist/talent movement and event logistics (see the company site,
  iaeelite.com). The app contains no dating or companionship services.
- Content is loaded from a JSON file the business maintains; no code is downloaded.

## Production checklist
- [ ] `npm run check` green on the release commit; CI green
- [ ] Version bumped; git tag `v1.0.0`
- [ ] No placeholder content (grep `REPLACE_`) in shipped config
- [ ] Content JSON published and reachable over https (if used)
