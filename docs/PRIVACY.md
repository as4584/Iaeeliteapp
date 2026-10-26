# Privacy inventory (V1) — input for the privacy policy and App Store "App Privacy"

Only what the code actually does. Re-audit whenever a dependency or flow changes.

| Data | Collected by the app? | Where it goes |
| --- | --- | --- |
| Name, organization, phone, email, event date, city, details | Typed by the user into the request form | Held **in memory only**; placed into an email the user reviews and sends from their own Mail account to innovationbusiness@icloud.com. The app never transmits it itself and never writes it to disk. |
| Content cache | App content JSON (no personal data) | AsyncStorage on device |
| Analytics / crash reporting | **None** | — |
| Advertising / tracking IDs | **None** (no ATT prompt needed) | — |
| Push tokens | **None** | — |
| Location, contacts, photos, camera, microphone | **None** — no permissions requested | — |

Network calls made by the app: the optional content URL (`EXPO_PUBLIC_CONTENT_URL`, a static
JSON file) and Expo Updates checks in production builds. Links open Instagram/websites in the
system browser.

**App Store Privacy answer (proposed):** "Data Not Collected" — the developer does not collect
data from the app; the user sends email from their own account. *Final answer is the
client's legal decision.*

**Privacy policy must still state:** that requests are sent by email, how IAE stores and
retains inquiry emails, the NDA/confidentiality practice, and a contact for deletion requests.
No legal claims are made in this repo.
