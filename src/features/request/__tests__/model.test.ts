import { getBundledContent } from '@/content/repository';

import { buildRequestEmail, emptyDraft, isValid, mailtoUrl, type RequestDraft, toggleService, toOutcome, validateStep } from '../model';

const content = getBundledContent();
const FULL = 'full-engagement';

const complete: RequestDraft = {
  serviceIds: ['artist-transport', 'venue-facilitation'],
  date: 'March 14',
  city: 'New York',
  name: 'Jordan Reyes',
  organization: 'Reyes Mgmt',
  phone: '(201) 555-0142',
  email: 'jordan@example.com',
  details: 'Two SUVs, private load-in.',
};

describe('validateStep', () => {
  it('step 1 requires a service', () => {
    expect(validateStep('what', emptyDraft).serviceIds).toBeDefined();
    expect(isValid(validateStep('what', { ...emptyDraft, serviceIds: [FULL] }))).toBe(true);
  });

  it('step 2 requires a city but not a date', () => {
    expect(validateStep('when', emptyDraft)).toEqual({ city: expect.any(String) });
    expect(isValid(validateStep('when', { ...emptyDraft, city: 'Newark' }))).toBe(true);
  });

  it('step 3 needs a name and at least one way to reply', () => {
    const e = validateStep('who', emptyDraft);
    expect(Object.keys(e).sort()).toEqual(['email', 'name']);
    expect(isValid(validateStep('who', { ...emptyDraft, name: 'A', phone: '5513014430' }))).toBe(true);
    expect(isValid(validateStep('who', { ...emptyDraft, name: 'A', email: 'a@b.co' }))).toBe(true);
  });

  it('flags malformed email and too-short phone', () => {
    const e = validateStep('who', { ...emptyDraft, name: 'A', email: 'a@b', phone: '123' });
    expect(e.email).toMatch(/incomplete/);
    expect(e.phone).toMatch(/short/);
  });

  it('review re-checks everything', () => {
    expect(isValid(validateStep('review', complete))).toBe(true);
    expect(Object.keys(validateStep('review', emptyDraft)).sort()).toEqual(['city', 'email', 'name', 'serviceIds']);
  });
});

describe('toggleService', () => {
  it('Full Engagement replaces individual picks', () => {
    expect(toggleService(['artist-transport', 'itinerary'], FULL, FULL)).toEqual([FULL]);
  });
  it('an individual pick removes Full Engagement', () => {
    expect(toggleService([FULL], 'artist-transport', FULL)).toEqual(['artist-transport']);
  });
  it('toggles off', () => {
    expect(toggleService(['artist-transport'], 'artist-transport', FULL)).toEqual([]);
  });
});

describe('buildRequestEmail', () => {
  it('produces the exact brief the business receives', () => {
    const mail = buildRequestEmail(complete, content);
    expect(mail.to).toBe('innovationbusiness@icloud.com');
    expect(mail.subject).toBe('Elite Service Request — Artist Transport +1 · New York');
    expect(mail.body).toBe(
      [
        'ELITE SERVICE REQUEST',
        '',
        'What needs handling: Artist Transport, Venue Facilitation',
        'Event date: March 14',
        'City: New York',
        '',
        'Name: Jordan Reyes',
        'Organization / Management: Reyes Mgmt',
        'Best number: (201) 555-0142',
        'Email: jordan@example.com',
        '',
        'Details:',
        'Two SUVs, private load-in.',
        '',
        '— Sent from the IAE Elite iPhone app',
      ].join('\n'),
    );
  });

  it('marks blanks with an em dash rather than leaving empty labels', () => {
    const mail = buildRequestEmail({ ...complete, date: '', organization: '', details: '' }, content);
    expect(mail.body).toContain('Event date: —');
    expect(mail.body).toContain('Organization / Management: —');
  });

  it('ignores unknown service ids (e.g. after remote content removed one)', () => {
    const mail = buildRequestEmail({ ...complete, serviceIds: ['retired-service', 'itinerary'] }, content);
    expect(mail.body).toContain('What needs handling: Itinerary & Detail Management');
  });

  it('mailto fallback encodes subject and body', () => {
    expect(mailtoUrl('a@b.co', 'A & B', 'line1\nline2')).toBe('mailto:a@b.co?subject=A%20%26%20B&body=line1%0Aline2');
  });
});

describe('toOutcome — no fake success', () => {
  it('only "sent" is a success', () => {
    const statuses = ['sent', 'saved', 'cancelled', 'undetermined', 'handoff', 'failed'] as const;
    expect(statuses.filter((s) => toOutcome(s).success)).toEqual(['sent']);
  });
  it('handoff tells the user it is not sent until they press Send', () => {
    expect(toOutcome('handoff').message).toMatch(/only sent once you press Send/);
  });
});
