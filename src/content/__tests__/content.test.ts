import bundled from '../../../content/content.json';
import { hasAsset } from '../media';
import { getBundledContent } from '../repository';
import { parseContent } from '../schema';

const clone = () => JSON.parse(JSON.stringify(bundled));

describe('bundled content (content/content.json)', () => {
  const content = getBundledContent();

  it('passes the schema — this is the gate for client content edits', () => {
    expect(parseContent(bundled)).toEqual({ ok: true, content: expect.any(Object) });
  });

  it('contacts the real business address and line', () => {
    expect(content.contact.email).toBe('innovationbusiness@icloud.com');
    expect(content.contact.phoneE164).toBe('+15513014430');
  });

  it('has every service from the site: 7 capabilities (incl. full), 6 creator, 6 spaces, 3 travel', () => {
    const count = (c: string) => content.services.filter((s) => s.collection === c).length;
    expect([count('capabilities'), count('creators'), count('spaces'), count('travel')]).toEqual([7, 6, 6, 3]);
  });

  it('references only bundled assets that exist', () => {
    const refs = [
      ...content.services.map((s) => s.image),
      ...content.collections.map((c) => c.image),
      ...content.field.map((f) => f.image),
      ...content.hero.film.map((f) => f.poster),
    ];
    expect(refs.filter((r) => !hasAsset(r))).toEqual([]);
  });

  it('uses badges sparingly: at most 3, one per service, each kind once', () => {
    const badges = content.services.flatMap((s) => (s.badge ? [s.badge.kind] : []));
    expect(badges.length).toBeLessThanOrEqual(3);
    expect(new Set(badges).size).toBe(badges.length);
  });

  it('keeps the "not a security firm" scope notes on protective services', () => {
    for (const id of ['secure-detail', 'crowd-coordination']) {
      expect(content.services.find((s) => s.id === id)?.note).toMatch(/not (a security|licensed security)/i);
    }
  });

  it('contains no em or en dashes (client style request, 2026-10-26)', () => {
    expect(JSON.stringify(bundled)).not.toMatch(/[–—]/);
  });

  it('ships no prices (the client publishes none)', () => {
    expect(JSON.stringify(bundled)).not.toMatch(/\$\s?\d/);
  });
});

describe('parseContent rejects unsafe or incompatible edits', () => {
  it('rejects a different schema major version', () => {
    const c = clone();
    c.schemaVersion = '2.0';
    expect(parseContent(c)).toMatchObject({ ok: false, reason: expect.stringContaining('Unsupported') });
  });

  it('rejects non-https social links', () => {
    const c = clone();
    c.socials[0].url = 'http://instagram.com/x';
    expect(parseContent(c).ok).toBe(false);
  });

  it('rejects javascript: links', () => {
    const c = clone();
    c.socials[0].url = 'javascript:alert(1)';
    expect(parseContent(c).ok).toBe(false);
  });

  it('rejects a service in an unknown collection', () => {
    const c = clone();
    c.services[1].collection = 'nope';
    expect(parseContent(c)).toMatchObject({ ok: false, reason: expect.stringContaining('unknown collection') });
  });

  it('rejects duplicate service ids', () => {
    const c = clone();
    c.services[2].id = c.services[1].id;
    expect(parseContent(c)).toMatchObject({ ok: false, reason: expect.stringContaining('Duplicate') });
  });

  it('rejects an unstyled badge kind', () => {
    const c = clone();
    c.services[1].badge = { kind: 'hot', label: 'HOT' };
    expect(parseContent(c).ok).toBe(false);
  });

  it('rejects a malformed email', () => {
    const c = clone();
    c.contact.email = 'innovationbusiness';
    expect(parseContent(c).ok).toBe(false);
  });
});
