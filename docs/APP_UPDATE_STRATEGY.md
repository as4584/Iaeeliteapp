# How the IAE Elite app gets updated

Three kinds of change, three paths. Pick the cheapest one that is *legitimately* enough.

## A. Content update — minutes, no App Store involvement
**Examples:** service names/descriptions/taglines, which service is featured, badges
(Flagship / 24-hr ready / Licensed partners) and where they appear, sort order, hero copy,
announcement banner, phone/email, response-time note, social links, process steps, gallery
captions, adding a service that uses a hosted (https) image.

**Mechanism:** edit `content/content.json` → open a PR → CI runs `npm run check` (schema
validation blocks bad edits) → merge → the file is published to the URL in
`EXPO_PUBLIC_CONTENT_URL`. Apps pick it up on next launch (cached thereafter; bundled copy
is the offline fallback).

**Cannot do via content:** new badge *styles*, new screen layouts, new fields the app doesn't
know about, new bundled images (use an https image instead).

## B. App-layer update — EAS Update (OTA), hours
**Examples:** a JS bug fix, copy that is hard-coded in components, spacing/visual polish,
validation tweaks, a new section built only from existing native modules.

**Mechanism:** `npx eas-cli@latest update --channel production --message "…"`.
Runtime version = app version (`runtimeVersion.policy: appVersion`), so an OTA only reaches
binaries it is compatible with.

**Allowed only when** the change keeps the app's purpose and reviewed functionality the same
(Apple guideline 3.3.2 / 2.5.2). OTA is for fixes and polish — **never** to ship features that
would have needed review, and never to change what the app fundamentally is.

## C. Native release — new binary + App Store review, days
**Required when:** adding/removing any native module (e.g. calendar, notifications, maps),
changing permissions or Info.plist, upgrading Expo SDK / React Native, changing app icon,
splash, bundle id or name, changing schemaVersion *major* (old apps would ignore new content),
or anything Apple would consider a new feature.

**Mechanism:** bump `version` in `app.json` → `eas build -p ios --profile production` →
TestFlight → `eas submit` → review. See `docs/APP_STORE_RELEASE.md`.

| Change | Path |
| --- | --- |
| "Make Event Facilitation the featured service" | A |
| "Remove the 24-HR READY badge" | A |
| "New phone number" | A |
| "Typo in the Connect screen headline" | B (it's in code) |
| "Request form crashes on iOS 27" | B if JS-only, else C |
| "Add 'Add to Calendar' after sending" | C (new native module) |
| "Push notifications when we confirm" | C (+ backend) |
