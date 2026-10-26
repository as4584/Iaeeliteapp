# QA — evidence log

Format per milestone: **Definition of done · Command · Expected result · If different.**

## Canonical validation
- **Command:** `npm run check` (= `tsc --noEmit` → `expo lint` → `jest --ci`). CI runs the same.
- **Expected:** `0` type errors, `0` lint problems, `Tests: 63 passed, 63 total` (8 suites).
- **If different:** read the first failing layer only; rerun it alone (`npm run typecheck` /
  `npm run lint` / `npx jest <file>`), fix, then rerun `npm run check`.
  - Jest "setCSSEventHandler is not available in JSReanimated" → Reanimated's own mock was
    re-enabled; tests must use `test/reanimated-stub.js` (see `jest.setup.js`).
  - RNTL v14: `render`/`fireEvent` are async — always `await` them.

## What the tests prove
| Suite | Proves |
| --- | --- |
| `content.test.ts` | Bundled content is schema-valid; real email/phone; all 22 site services present; every image ref resolves; ≤3 badges; "not a security firm" notes present; no prices; unsafe edits (http/javascript: links, bad badge kinds, orphan/duplicate ids, wrong schema major, bad email) are rejected |
| `repository.test.ts` | Remote content: valid → used + cached; invalid/HTTP error/offline → rejected without throwing; no URL → no fetch; http URL refused; corrupt cache ignored |
| `model.test.ts` | Step validation; Full-Engagement toggle rules; **exact email subject/body**; mailto encoding; only `sent` counts as success |
| `RequestLifecycle.test.tsx` | Double-tap Send opens Mail once; "Opening Mail…" + disabled while composer is up; after reset the flow restarts at step 1; "Request this service" restarts at step 1 with only that service, keeping contact details |
| `RequestResult.test.tsx` | Only `sent` shows success + success haptic + clears draft; saved/cancelled/handoff/failed show honest copy and call/copy fallbacks; a forged status param is treated as unconfirmed |
| `contact.test.ts` | Mail status mapping; mailto fallback; failure (no app / composer crash) never throws; dialer URL; non-https links refused |
| `ContentProvider.test.tsx` | Bundled first; valid remote swaps in; offline stays bundled; newer cache used; older cache ignored; invalid remote ignored |
| `RequestFlow.test.tsx` | Rendered flow: blocked without a service; city required; full walk to Review; Mail called with exact recipient/subject/body; result route gets the composer's real status (sent / cancelled) |

## Visual QA (web build, iPhone viewports)
- **Command:** `npx expo start --web --port 8099` then `python scripts/screens.py http://localhost:8099 docs/qa/screens`
- **Expected:** 46 screenshots (3 devices × 15 states + full-page home), `console/page errors: 0`.
- Web approximates iOS layout. NativeTabs renders as a top pill on web (bottom bar on iOS);
  `src/lib/insets.ts` reserves space for it on web only.

### Grades (2026-10-25, after fix pass 1)
| Screen | Grade | Notes |
| --- | --- | --- |
| Home hero | A | Film poster/loop, crest, italic gold accent, single CTA. Crest shrinks < 740pt height. |
| Home body (featured, collections, scale, process, field, mission) | A- | Curated, not a site dump |
| Services list | B+ | Rows read well; collection tabs scroll horizontally on SE (intended) |
| Service detail | A | Full-bleed image, docked CTA, scope note on protective services |
| Request · What | A- | FLAGSHIP glint, gold rail selection, live count on Continue |
| Request · When / Who | B+ | Chips speed entry; keyboard flow via return key |
| Request · Review | B+ | "This is exactly what we'll receive." |
| Result · sent | A- | Crest settles, rule draws, 6-step timeline |
| Result · not sent | B | Honest copy; call + copy fallbacks |
| Connect | B+ | Call/email in one tap; socials; confidentiality |
| Missing service | B | Designed state, routes back to Services |

Fixed in pass 1: nested `<h1>` (accent word was its own heading), web tab pill overlapping
headers, request dock double-offset for tab bar, truncated step label on SE.

## Device checklist (must be done on a physical iPhone — not yet run)
- [ ] Launch: crest splash → Home, no white flash, fonts loaded
- [ ] Hero video autoplays muted; with Reduce Motion ON shows poster only
- [ ] Native tab bar at bottom; Request dock sits above it (no overlap)
- [ ] Request → Send opens Mail composer pre-filled; Send → "Request on its way." + success haptic
- [ ] Composer Cancel → "Not sent."; Save Draft → "Saved as a draft."
- [ ] Device with no Mail account → mailto handoff or "Mail isn't available." with Call
- [ ] Call button opens dialer to +1 (551) 301-4430
- [ ] Instagram/website open externally
- [ ] Airplane mode cold start → bundled content renders, no error
- [ ] VoiceOver: hero reads as one heading; selection rows announce checked state; step progress announced
- [ ] Largest Dynamic Type: no clipped buttons
- [ ] iPhone SE (3rd gen) + 15 + Pro Max pass

## Verification pass 2 (2026-10-25)
| Gate | Command | Result |
| --- | --- | --- |
| Doctor | `npx expo-doctor` | PASS 20/20 |
| Types / lint / tests | `npm run check` | PASS — 0 / 0 / 63 of 63 |
| Test strength | mutation: make `saved` a success; remove double-tap guard | Both caught (2 and 1 failures), code restored |
| iOS bundle | `npx expo export --platform ios` | PASS — Hermes bundle 4.5 MB, 8 fonts, 21 jpg / 9 webp / 3 mp4 |
| Android bundle | `npx expo export --platform android` | PASS — Hermes bundle 4.7 MB |
| Native config | `npx expo config --type introspect` | No usage strings needed, no background modes, no entitlements; Android permissions = INTERNET only |
| Break attempts (web, SE) | `scratchpad/break.py` | 12/12 — rapid taps, whitespace/malformed input, 4 KB details text, edit-back, tab thrash, hostile deep link, 0 console errors |
| Visual regression | `scripts/screens.py` (SE/15/Max) | 47 screens, 0 console errors |
| Maestro | `.maestro/*.yaml` | **Written, not run** — no device/emulator on this Windows host |
| Native runtime / TestFlight | — | **Not run** — needs EAS build (approval) and a physical iPhone |

Fixed in pass 2: double-tap could open Mail twice; completed request left the Request tab on an
empty Review; "Request this service" could land mid-flow; 29 unused font files bundled (11 → 7.5 MB
assets); dark status bar text on black splash; unneeded Android storage permissions.
