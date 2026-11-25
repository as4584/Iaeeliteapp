# IAE Elite Services — iOS handoff (V22)

**Bundle ID (suggested):** com.ibds.iaeelite   **App name:** IAE Elite Services

## What is in this folder
- `www/` — the app: `index.html`, `privacy.html` (public Privacy Policy + Terms), `config.json` (editable contact settings), `vercel.json` (lets the installed app read config.json), `assets/` (videos, images).
- `iae-elite-app-v22-standalone.html` — single-file backup of the app (media embedded). It has no separate privacy.html, so use `www/` for deploys.
- `icons/` — AppIcon PNGs from the hi-res gold logo (1024 for App Store Connect, plus all device sizes). Square and opaque.
- `ios-config/Info.plist-additions.xml` — keys to add in Xcode (FaceTime/WhatsApp/tel/mailto schemes, export-compliance flag).
- `docs/APP-STORE-CONNECT-ANSWERS.md` — copy/paste metadata, privacy label answers, review notes, risks.
- `capacitor.config.json`, `package.json` — Capacitor setup (webDir = www).

## Changing the phone number, email or links later (no App Store update)
All contact details (Call Now number, email, FaceTime address, WhatsApp number, Instagram, Facebook, both websites) live in `www/config.json`.
1. After the first Vercel deploy, open `www/index.html`, find `var CONFIG_URL='config.json';` and change it to the full address, e.g. `var CONFIG_URL='https://YOUR-DOMAIN/config.json';`. Do this BEFORE building the iOS app. (Skip this and the iPhone app will only read its bundled copy, so edits would need a new build.)
2. To change a detail later: edit `config.json`, redeploy `www/` to Vercel. Installed apps pick it up the next time they open (they keep the last good copy if offline). Bad or missing values fall back to the built-in defaults.
3. Only these fields change. Pricing, copy, images and layout still need a new build. The Privacy Policy text shows the phone and email from the same file.
4. Keep the Vercel account secure: whoever can edit config.json controls where the buttons send people. Use https:// links only.

## Order of work
1. **Deploy `www/` to Vercel** (drag the folder in). That gives a live link plus the public Privacy Policy URL: `https://<domain>/privacy.html`. Test everything on an iPhone in Safari first.
2. Build the iOS app (needs a Mac with Xcode and the client's Apple Developer account):
   1. `npm install`
   2. `npx cap add ios`, `npx cap sync ios`, `npx cap open ios`
   3. Xcode: set Team and signing, bundle ID, version 1.0 (build 1). Add `icons/AppIcon-1024.png` to Assets > AppIcon.
   4. Merge `ios-config/Info.plist-additions.xml` into Info.plist.
   5. Product > Archive > Distribute App > App Store Connect.
3. App Store Connect: fill in metadata from `docs/APP-STORE-CONNECT-ANSWERS.md` (Privacy Policy URL, App Privacy answers, review notes), add testers, start TestFlight.

## Test on a real iPhone before uploading
- FaceTime button rings innovationbusiness@icloud.com (will not work in the Simulator)
- WhatsApp button opens a chat with +1 862 332 5004
- Call Now dials; Email opens Mail; the Request form opens a pre-filled email
- Change a value in config.json, redeploy, reopen the app: confirm the button uses the new value
- Instagram, Facebook (https://www.facebook.com/share/1Ca3KKBmwC/), both websites open. These use target="_blank"; if any do nothing inside the app shell, change them to `target="_self"` or use Capacitor's Browser plugin.
- Privacy Policy & Terms: Connect tab (bottom link) and Request form line both open the in-app screen; Back returns to Connect
- Home video autoplays muted; Black Car hero fades photo to clip; safe areas on notch/Dynamic Island devices

## Open items
- Replace the FaceTime/WhatsApp icon drawings with the official logo files for the store build.
- Optional: bundle the two Google Fonts locally so the app works offline and makes no third-party request (the policy currently discloses Google Fonts).
- Have counsel review the Privacy Policy and Terms. Statements about how IAE shares information with personnel and partners should be confirmed by the business.
- Terms have no governing-law clause. Add the business's state if counsel recommends.
- Request form uses `mailto:` (no backend). If a backend is added later, update the policy and the App Privacy label.
