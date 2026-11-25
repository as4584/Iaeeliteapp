// Copy and contact details exactly as in Damian's v22 (www/index.html + IAE_DEFAULTS).

export type Tab = 'home' | 'services' | 'blackcar' | 'request' | 'connect';
export type Screen = Tab | 'legal';

export const contact = {
  phoneDial: '+15513014430',
  phoneDisplay: '+1 (551) 301-4430',
  email: 'innovationbusiness@icloud.com',
  facetime: 'innovationbusiness@icloud.com',
  whatsapp: '18623325004',
  instagram: 'https://instagram.com/GETYOURBUSINESSSTARTEDNOW',
  facebook: 'https://www.facebook.com/share/1Ca3KKBmwC/',
  websites: [
    { name: 'IAE ELITE SERVICES', url: 'https://iaeelite.com', label: 'iaeelite.com' },
    { name: 'IBDS BUSINESS DEVELOPMENT SOLUTIONS', url: 'https://innovationdevelopmentsolutions.com', label: 'innovationdevelopmentsolutions.com' },
  ],
};

export const links = {
  tel: `tel:${contact.phoneDial}`,
  facetime: `facetime:${contact.facetime}`,
  whatsapp: `https://wa.me/${contact.whatsapp}`,
};

export const services = [
  { name: 'Artist Transport', desc: 'Discreet, vetted ground movement — sedans, SUVs, and motorcade-grade convoys. Professional drivers, timed arrivals, clean hand-offs.', tag: 'Door to Door, On the Second' },
  { name: 'Venue Facilitation', desc: 'Private load-in, closed green rooms, controlled access, perimeter coordination. Set, sealed, and run to spec before the talent moves.', tag: 'Room Set & Sealed' },
  { name: 'Event Facilitation', desc: 'Concept, permits, vendors, staffing, transport, and the room — one discreet timeline from private arrivals to clean departures.', tag: 'One Timeline, Every Cue' },
  { name: 'Flight & Transport Retrieval', desc: 'Private and commercial flight coordination — curbside-to-cabin retrieval, luggage, customs, and onward ground arranged in advance.', tag: 'Wheels-Up to Wheels-Down' },
  { name: 'Itinerary Management', desc: 'Minute-by-minute itinerary built around your principal — sequenced, briefed, and adjusted live. Day or night, exactly as directed.', tag: 'Day or Night, As Directed' },
  { name: 'Protective Detail', desc: 'Licensed security personnel coordinated through one point of contact. Vetted, briefed, and positioned around your principal for every engagement.', tag: 'Licensed Personnel. One Point of Contact.' },
  { name: 'Private Gatherings', desc: 'Exclusive events, celebrations, and private experiences — curated from concept to clean departure, handled in full silence.', tag: 'Exceptional Spaces. Epic Experiences.' },
];

/** The Request form's service list (his <select>, without the duplicate Black Car entry). */
export const serviceOptions = [
  'Black Car Service',
  'Artist Transport',
  'Venue Facilitation',
  'Event Facilitation',
  'Flight & Transport Retrieval',
  'Itinerary Management',
  'Protective Detail',
  'Private Gatherings',
  'Multiple Services',
];

export const processSteps = [
  { name: 'Request', desc: 'Submit your brief below — service, dates, city, and contact info.' },
  { name: 'Intake', desc: 'An IAE representative reviews your request within the hour.' },
  { name: 'Evaluation', desc: 'We assess scope, logistics, and personnel requirements.' },
  { name: 'Confirmation', desc: "Details locked, deposit collected, team briefed. You're covered." },
];

export const blackCarFeatures = [
  { t: 'Vetted Professional Drivers', d: 'Discreet, uniform-ready, and briefed on your itinerary before wheels roll.' },
  { t: 'Timed, Door-To-Door Arrivals', d: 'Hotel, venue, private terminal — staged early, exactly on the minute.' },
  { t: 'Single Or Convoy', d: 'One car or a full motorcade, coordinated through one point of contact.' },
  { t: 'Airport, Venue & Event Runs', d: 'Arrivals, load-in, after-party, and departure — all on one schedule.' },
];

export type RequestForm = {
  service: string;
  name: string;
  org: string;
  date: string; // YYYY-MM-DD, like <input type="date">
  city: string;
  phone: string;
  email: string;
  details: string;
};

export const emptyForm: RequestForm = { service: '', name: '', org: '', date: '', city: '', phone: '', email: '', details: '' };

export const isFormValid = (f: RequestForm) => !!(f.name.trim() && f.phone.trim() && f.service);

export const REQUEST_SUBJECT = 'IAE Elite Service Request';

/** Same body his submitReq() builds, as plain text. */
export function buildRequestBody(f: RequestForm): string {
  const lines = [`Service: ${f.service}`, '', `Name: ${f.name.trim()}`];
  if (f.org.trim()) lines.push(`Organization: ${f.org.trim()}`);
  if (f.date) lines.push(`Event Date: ${f.date}`);
  if (f.city.trim()) lines.push(`City: ${f.city.trim()}`);
  lines.push(`Phone: ${f.phone.trim()}`);
  if (f.email.trim()) lines.push(`Email: ${f.email.trim()}`);
  if (f.details.trim()) lines.push('', 'Details:', f.details.trim());
  return lines.join('\n');
}

type Legal = { kind: 'h2' | 'date' | 'h3' | 'p' | 'div'; text?: string };

export const legal: Legal[] = [
  { kind: 'h2', text: 'Privacy Policy' },
  { kind: 'date', text: 'Effective November 25, 2026' },
  { kind: 'p', text: 'IAE Elite Services (Innovation Artist Escort), operated by IBDS Enterprise LLC ("IAE," "we," "us"), respects your privacy. This policy explains what this app does and does not collect.' },
  { kind: 'h3', text: 'What we collect' },
  { kind: 'p', text: "Only what you choose to send us. If you complete the Request form, you may provide your name, phone number, email address, organization, event date, city, the service you want, and any details you type. The app does not store this information on a server of ours. When you tap Send, the app opens your device's email app with a pre-filled message addressed to us; the message leaves your device only when you press Send in that email app, and we receive it by email." },
  { kind: 'p', text: 'The app has no accounts or sign-in, and it does not use advertising, analytics, or tracking tools. It does not request access to your location, contacts, photos, camera, microphone, or other device data.' },
  { kind: 'h3', text: 'Calls, FaceTime, WhatsApp and email' },
  { kind: 'p', text: 'The Call Now, Email, FaceTime and WhatsApp buttons open your phone, mail, FaceTime or WhatsApp apps. Those apps and services handle the communication under their own terms and privacy policies. When you contact us this way, we may see your phone number, Apple ID, WhatsApp number or profile name, and the content of your message.' },
  { kind: 'h3', text: 'How we use it' },
  { kind: 'p', text: 'We use the information you send to respond to you, evaluate and plan your request, coordinate and confirm services, and keep business and legal records. We do not sell your information and we do not share it for advertising. We share it only with the personnel and partners needed to carry out an engagement you confirm, and where the law requires.' },
  { kind: 'p', text: 'Non-disclosure is standard on our engagements. We treat principal details, schedules and locations as confidential.' },
  { kind: 'h3', text: 'Third parties' },
  // The native app bundles its fonts and contact details, so his Google Fonts / settings-file sentences no longer apply.
  { kind: 'p', text: 'The app links to Instagram, Facebook, WhatsApp, and our websites (iaeelite.com and innovationdevelopmentsolutions.com). Those services are not controlled by us, and their own policies apply once you leave the app.' },
  { kind: 'h3', text: 'Retention' },
  { kind: 'p', text: 'We keep your request for as long as needed to respond to you, carry out any engagement, and meet business and legal record-keeping needs.' },
  { kind: 'h3', text: 'Your choices' },
  { kind: 'p', text: `You may ask us to tell you what we hold about you, correct it, or delete it by emailing ${contact.email}. We will respond within a reasonable time and as the law requires. Residents of some states and countries have additional rights under local law, and we honor valid requests.` },
  { kind: 'h3', text: 'Security' },
  { kind: 'p', text: 'We use reasonable measures to protect information we receive. Email is not guaranteed to be secure, so please do not send Social Security numbers, payment card numbers, passwords, or similar sensitive data through the Request form.' },
  { kind: 'h3', text: 'Children' },
  { kind: 'p', text: 'This app is intended for adults. It is not directed to children under 13, and we do not knowingly collect information from them.' },
  { kind: 'h3', text: 'Changes' },
  { kind: 'p', text: 'We may update this policy. The effective date above shows the latest version, and the version in the app is the current one.' },
  { kind: 'h3', text: 'Contact' },
  { kind: 'p', text: `IBDS Enterprise LLC, IAE Elite Services\nEmail: ${contact.email}\nPhone: ${contact.phoneDisplay}` },
  { kind: 'div' },
  { kind: 'h2', text: 'Terms of Use' },
  { kind: 'date', text: 'Effective November 25, 2026' },
  { kind: 'p', text: 'By using this app you agree to these terms.' },
  { kind: 'h3', text: 'Requests are not bookings' },
  { kind: 'p', text: 'Submitting a request does not create a booking or contract. An engagement exists only after IAE evaluates your request and confirms it with you directly, including scope, pricing and any deposit. Service availability varies by date and location.' },
  { kind: 'h3', text: 'Information in the app' },
  { kind: 'p', text: 'Service descriptions are general and may change. Photos and video show representative vehicles and personnel and may not match what is assigned to a specific engagement.' },
  { kind: 'h3', text: 'Your responsibilities' },
  { kind: 'p', text: 'Provide accurate information, and do not use the app for unlawful purposes or to interfere with its operation.' },
  { kind: 'h3', text: 'Ownership' },
  { kind: 'p', text: 'The IAE name, logo, text, photos and video are owned by IBDS Enterprise LLC or its licensors and may not be copied or reused without permission.' },
  { kind: 'h3', text: 'Disclaimer and liability' },
  { kind: 'p', text: 'The app is provided "as is." To the fullest extent the law allows, we are not liable for indirect or consequential losses from using the app. Nothing here limits rights you have under applicable law.' },
  { kind: 'h3', text: 'Contact' },
  { kind: 'p', text: contact.email },
];
