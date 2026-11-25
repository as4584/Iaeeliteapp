# App Store Connect — copy/paste answers (IAE Elite Services v1.0)

Prepared from what the app actually does. Whoever owns the developer account should read each answer and confirm it is true before submitting. This is a working draft, not legal advice. Have counsel review the Privacy Policy and Terms.

## 1. App information
- **Name:** IAE Elite Services
- **Subtitle (30 max):** Black car, security & events
- **Category:** Business (secondary: Lifestyle)
- **Age rating:** 4+ (no user-generated content, no mature content, no web browsing inside the app, no purchases). Answer "None" to every content-descriptor question.
- **Privacy Policy URL (REQUIRED, public, live):** `https://<your-domain>/privacy.html` (the file is in `www/privacy.html`; it deploys with the app)
- **Support URL (REQUIRED):** `https://iaeelite.com` or the same domain's `/privacy.html` page until a support page exists
- **Marketing URL (optional):** https://iaeelite.com
- **Copyright:** 2026 IBDS Enterprise LLC

## 2. Description (draft)
IAE Elite Services (Innovation Artist Escort) coordinates ground transport, security, and event operations for artists and principals, all through one point of contact. Browse services, view the Black Car fleet, and send a confidential request in under a minute. Reach the team by call, email, FaceTime or WhatsApp. Available 24/7 across NY · NJ and nationwide.

**Keywords (100 max):** black car,artist transport,event staffing,protective detail,concierge,itinerary,private flights,VIP

**Promotional text:** Now booking Black Car Service. Anywhere. Any place. Anytime.

## 3. App Privacy ("nutrition label")
Apple counts data as "collected" when it is sent off the device where the developer can access it. The app has no servers, accounts, analytics or ads, but when a user sends the Request form by email, **we receive their name, phone, email and message.** The conservative, accurate answer is therefore:

- **Do you collect data from this app?** Yes
- **Data types collected:**
  - Contact Info → Name; Email Address; Phone Number
  - Other User Content → "Other User Content" (the free-text Details field)
- **For each type:** Used for **App Functionality** only. **Linked to the user: Yes** (it arrives in an email from them). **Used for tracking: No.**
- **Everything else (Location, Identifiers, Usage Data, Diagnostics, Purchases, Financial, Contacts, Photos, etc.):** Not collected.
- **Tracking:** No. Do not enable App Tracking Transparency and do not add the tracking prompt string.

Third party note: the fonts load from Google Fonts. Apple's questionnaire concerns data you or your SDKs collect. To remove the question entirely, bundle the Cormorant Garamond and Montserrat font files inside `www/` (a short job for the developer).

## 4. Export compliance
Answer "No" to non-exempt encryption. This is already set by the `ITSAppUsesNonExemptEncryption = false` key in `ios-config/Info.plist-additions.xml`.

## 5. App Review notes (paste into "Notes")
No sign-in is required. This is a service-booking app for IAE Elite Services. Tabs: Home, Services, Black Car, Request, Connect.
- Request tab: a form that opens a pre-filled email to the business. No account and no in-app payment. Requests are evaluated and confirmed off-app with the client.
- Connect tab: Call Now, Email, FaceTime and WhatsApp buttons open the matching Apple/WhatsApp apps. FaceTime requires a real device; it will not ring in the Simulator.
- Privacy Policy and Terms are in the app (Connect tab, bottom link, and Request form) and online at the Privacy Policy URL above.
- The app sells no digital goods and takes no payments. Real-world services are arranged directly with the business.

## 6. Guideline risks to expect (and what to do)
- **4.2 Minimum Functionality ("just a website in a wrapper"):** the biggest risk. Mitigate by keeping all media bundled in the app (it is), having working native hand-offs (call, FaceTime, WhatsApp, mail), and describing those in the review notes. If rejected, add one or two light native features (for example the Capacitor Share or Haptics plugins) and resubmit.
- **5.1.1 Data collection and privacy:** satisfied by the in-app policy, the public URL, and the label above. The privacy label must match the policy. If the app later adds analytics, accounts or a backend, update both.
- **2.1 Completeness:** every button must work on a real device. Use the test checklist in `README-HANDOFF.md` before uploading.
- **Business or professional services imagery:** keep the Protective Detail wording as written ("licensed personnel, coordinated through one point of contact"). Do not add claims about weapons, armed escort or law-enforcement affiliation.
- **TestFlight external testers** also need the Privacy Policy URL and a short Beta App Description plus Beta App Review. Internal testers (people on the team in App Store Connect) skip Beta App Review.

## 7. Screenshots (required for store, not for TestFlight)
6.9" iPhone: 1320 x 2868 px. The screenshots already uploaded in this project are the right size. Use Home, Services, Black Car, Request, Connect.
