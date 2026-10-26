This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## IAE Elite project rules

- Read `docs/PRODUCT_SPEC.md` and `docs/CLIENT_AUDIT.md` before changing copy or scope. Business facts must be in CLIENT_AUDIT §1 (Verified). Never invent prices, testimonials, press, staff, stats, or bookings.
- Business content lives in `content/content.json` (validated by `src/content/schema.ts`). Don't hard-code business data in components.
- Screens never call `fetch`, `Linking`, or `MailComposer` directly: use `src/content/repository.ts` and `src/lib/contact.ts`.
- Request success copy is shown **only** for Mail status `sent` (`toOutcome`). Keep it that way.
- Keep the "IAE is not a security firm" scope notes on protective services.
- Design is frozen per `docs/DESIGN.md`; change it only for a written defect.
- Done = `npm run check` green + screenshots re-captured for touched screens + `docs/QA.md` updated.
- Branches only; `master` holds tagged baselines. Never submit to the App Store or run `eas build/submit/update` without Alex's explicit approval.
- Jest: use `test/reanimated-stub.js` (Reanimated 4.7's mock throws under jest-expo); `await` RNTL `render`/`fireEvent`.
