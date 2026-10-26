# Architecture — IAE Elite app

## Stack
Expo SDK 58 · React Native 0.88 · TypeScript (strict) · Expo Router (file routes in `src/app`)
· Reanimated 4 · expo-mail-composer · expo-haptics · expo-video · expo-image · zod ·
AsyncStorage · Jest (`jest-expo`) + React Native Testing Library. EAS Build/Submit/Update.

No backend in V1. Deliberate: the client's live conversion path is email, and there is no
one to monitor a new inbox. The repository boundary below makes adding one a local change.

## Layout
```
content/content.json          ← publishable remote content (source of truth for business copy)
src/app/                      ← routes only (thin screens)
  _layout.tsx                 ← fonts, splash, ContentProvider, root Stack
  (tabs)/_layout.tsx          ← NativeTabs: Home · Services · Request · Connect
  (tabs)/index.tsx            ← Home
  (tabs)/services/index.tsx   ← collections + list
  (tabs)/request.tsx          ← request flow host
  (tabs)/connect.tsx          ← contact & social
  service/[id].tsx            ← service detail (pushed over tabs)
  request-result.tsx          ← outcome screen (modal)
src/content/                  ← schema (zod), bundled default, media registry, repository, provider
src/features/request/         ← request state, validation, email builder, outcome mapping, steps UI
src/components/               ← design-system primitives (Text, Button, Badge, Screen, …)
src/lib/                      ← contact actions (mail/tel/url), haptics, motion prefs
src/theme/                    ← tokens (color, type, space, radius, motion)
```
Rule: screens never call `fetch`, `Linking`, or `MailComposer` directly — they go through
`src/content/repository.ts` and `src/lib/contact.ts`.

## Content (remote-configurable)
- Schema: `src/content/schema.ts` (zod). Business data: brand copy, hero, contact, socials,
  collections, services (title, tagline, summary, body, notes, image, badge, featured,
  requestable, sortOrder), process steps, field gallery, announcement.
- Images are `ImageRef` strings: `asset:<key>` → bundled media registry; `https://…` → remote.
  New services can therefore use hosted images without a new binary.
- Load order: memory → AsyncStorage cache → bundled `content/content.json` (instant render),
  then background fetch of `EXPO_PUBLIC_CONTENT_URL` → validate → swap in + cache.
  Invalid or failed fetch keeps the last good copy; the UI never blanks.
- `schemaVersion` gates compatibility: the app ignores remote content whose major version it
  doesn't understand (prevents a content edit from crashing old binaries).

### Client editing strategy (smallest legitimate option)
`content/content.json` in this repo is published as a static file (GitHub Pages / any static
host). The client (or Alex for them) edits it via the GitHub web editor; CI runs
`npm run check`, which **validates the JSON against the schema** before it can be published.
A CMS is Phase 2 only if edit frequency justifies it.

## Request / contact integration
`buildRequestEmail(draft, content)` → subject + plain-text body (deterministic, unit-tested).
`sendRequest()` → `MailComposer.isAvailableAsync()` ? `composeAsync` : `mailto:` via Linking.
`toOutcome(status)` maps `sent | saved | cancelled | undetermined | mailto | failed` to honest
copy. Only `sent` produces the success state. `mailto` produces "Finish in your mail app".

## Navigation
NativeTabs (native iOS tab bar) with SF Symbols. Service detail and outcome are root-stack
routes so they overlay tabs. Deep links: `iaeelite://service/<id>`, `iaeelite://services?c=<collection>`.

## Update strategy
See `docs/APP_UPDATE_STRATEGY.md`.

## Testing strategy
- Unit: schema validation of bundled content, repository (ok / invalid / network fail / version
  mismatch), email builder, validation rules, outcome mapping.
- Component: Request flow (invalid → valid → review), Connect actions call `lib/contact`.
- Canonical: `npm run check` = `tsc --noEmit` + `expo lint` + `jest`. CI runs exactly that.
- Visual: screenshots via web export + device/TestFlight passes, logged in `docs/QA.md`.

## Engineering process (adopted from kaw393939's course repos)
From `is218-act-1-operate-deliver`, `218_spec`, `spec-driven-tshirt-website`:
- **Spec before code**: this docs set was written before screens; scope changes edit the spec.
- **"It says done — what would convince you?"** Every milestone states Definition of Done,
  Command, Expected result, If different (see `docs/QA.md`).
- **Assertions that can fail**: tests check independent expectations (e.g. exact email body),
  not snapshots of whatever the code currently does.
- **Focused commits / branches**: one milestone per commit on a named branch; `master` holds
  tagged baselines only.
- **Recover in a fresh environment**: `npm ci && npm run check` must pass from a clean clone; CI proves it.
- **Try → Decide → Build → Check → Keep.** No license-bearing code copied (repos were reviewed
  for process only; most carry no license).

## Security notes
No secrets in the bundle (none exist). `EXPO_PUBLIC_CONTENT_URL` is public by design.
Remote content is schema-validated; external links restricted to `https:`, `mailto:`, `tel:`.
No PII persisted: the request draft lives in memory only. No analytics SDKs.
