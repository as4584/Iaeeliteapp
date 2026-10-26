# IAE Elite — iOS app

The mobile app for **Innovation Artist Escort (IAE Elite)**: discover the services, send a
complete private request in under a minute, and reach the team directly.

Expo SDK 58 · React Native 0.88 · TypeScript · Expo Router · EAS.

## Run it
```bash
npm ci
npx expo start            # scan the QR with Expo Go on an iPhone
npx expo start --web      # browser preview (layout QA only)
```

## Verify it
```bash
npm run check             # typecheck + lint + 38 tests — must be green before any commit
```
Visual QA: `python scripts/screens.py http://localhost:8081 docs/qa/screens` with the web server running.

## Where things are
| Need | Go to |
| --- | --- |
| What the client actually offers (verified) | `docs/CLIENT_AUDIT.md` |
| Scope, acceptance test, user journey | `docs/PRODUCT_SPEC.md` |
| Code structure, content pipeline, process | `docs/ARCHITECTURE.md` |
| Colors, type, badges, motion | `docs/DESIGN.md` |
| Change business copy without a release | `content/content.json` + `docs/APP_UPDATE_STRATEGY.md` |
| TestFlight / App Store | `docs/APP_STORE_RELEASE.md` |
| Test evidence & device checklist | `docs/QA.md` |
| Privacy inventory | `docs/PRIVACY.md` |
| Client hand-off summary | `docs/HANDOFF.md` |

## Remote content
Set `EXPO_PUBLIC_CONTENT_URL` (https) to a published copy of `content/content.json`.
Unset = the bundled copy is used. Invalid remote content is ignored, never shown.
