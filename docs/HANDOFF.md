# IAE Elite app — client hand-off (draft, 2026-10-25)

## What was built
An iPhone app for Innovation Artist Escort. It presents IAE's capabilities as four clear
collections (Capabilities · For Creators · Elite Spaces · Global Accommodations). A guided
private request takes about a minute: what you need, when and where, and who to reply to. It
ends in a pre-filled email to innovationbusiness@icloud.com, and the private line is one tap away.
All copy comes from iaeelite.com; nothing was invented.

## Primary user journey
Home (film + "We move the people the world is watching.") → Services → Service detail
→ **Request this service** → What → When → Who → **Your brief** → Send (Mail) →
**"Request on its way."** → (Connect: call / email / Instagram)

## Screenshots
`docs/qa/screens/` — `15-*` (iPhone 15), `se-*` (iPhone SE), `max-*` (Pro Max).
Demo set: 01-home, 02-services, 03-detail, 04c-request-selected, 06-request-review, 07-result-sent, 08-connect.
*These are web-rendered previews. App Store screenshots must be captured on device.*

## What IAE can change without an App Store release
Service names, descriptions, order, featured service, badges, hero copy, announcements,
phone/email, response note, social links, process steps, gallery captions. Edit one file
(`content/content.json`); it is checked automatically before it goes live.

## What needs an app update
New features, new device capabilities (calendar, notifications, maps), new screen designs,
icon/name changes. See `docs/APP_UPDATE_STRATEGY.md`.

## Known limitations (no hiding)
- The request is delivered **by email from the customer's own Mail app**. That is the same
  mechanism as the website. The app can only confirm "sent" when iOS Mail reports it. There is
  no server inbox, request ID, or CRM yet.
- Remote content hosting isn't set up yet (`EXPO_PUBLIC_CONTENT_URL` is empty). The app runs on
  the bundled copy until a URL is published.
- Not yet run on a physical iPhone. Mail, haptics, native tab bar and video are unverified on device.
- iPhone only; no iPad layout.
- Imagery and reels are taken from the IAE website. Usage rights still need written confirmation.
- The website's press wall (Forbes, GQ, Variety…) is **deliberately left out** until coverage links are provided.
- The website's Facebook link is broken (no URL), so Facebook is left out.
- **Film likeness:** a frame of the "Arrival" reel shows a figure closely resembling a well-known public figure. If the reels are AI-generated with a real person's likeness, the client must confirm rights before App Store use (right of publicity, Apple guideline 5.2).
- Film reels were AI-upscaled (Real-ESRGAN) from the website's 368×654 / 960×720 sources to 1080p. This is sharper but not true HD; original camera or render files from the client would be better still. The still photos have not been upscaled yet.

## Phase 2 roadmap (priority order)
1. Server-backed inquiry (Supabase table + email notification): request IDs, guaranteed delivery, no Mail dependency.
2. Content hosting + a simple edit page for IAE staff.
3. "Add to Calendar" for the requested date; draft persistence.
4. Push notifications when an engagement is confirmed.
5. Client portal (itineraries, briefs) behind login.
6. iPad layout; official Instagram feed via Meta API.

## Release status
| Question | Answer |
| --- | --- |
| DEMO MVP READY? | **Yes, for an Expo Go demo on a phone.** Device pass still pending. |
| TESTFLIGHT READY? | **No.** Needs an Apple Developer account decision, an EAS project (`eas init`), and the device QA pass. |
| APP STORE SUBMISSION READY? | **No.** Also needs a privacy policy URL, support URL, media-rights confirmation, approved store copy, and device screenshots. |
| PRODUCTION READY? | **No.** Same as above, plus content hosting. |
| FULL SPEC COMPLETE? | **No.** V1–V3 are built; V5 device QA and release prep remain. |
