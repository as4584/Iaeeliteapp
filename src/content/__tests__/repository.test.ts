import AsyncStorage from '@react-native-async-storage/async-storage';

import bundled from '../../../content/content.json';
import { fetchRemoteContent, readCachedContent } from '../repository';

const URL = 'https://content.example.com/content.json';
const respond = (body: unknown, status = 200) =>
  jest.fn(async () => ({ ok: status < 400, status, json: async () => body }) as unknown as Response);

beforeEach(() => AsyncStorage.clear());

describe('fetchRemoteContent', () => {
  it('accepts valid remote content and caches it for next launch', async () => {
    const remote = { ...bundled, hero: { ...bundled.hero, primaryCta: 'Book the night' } };
    const result = await fetchRemoteContent(URL, respond(remote));
    expect(result.ok && result.content.hero.primaryCta).toBe('Book the night');
    expect((await readCachedContent())?.hero.primaryCta).toBe('Book the night');
  });

  it('rejects invalid content and does not cache it', async () => {
    const result = await fetchRemoteContent(URL, respond({ schemaVersion: '1.0' }));
    expect(result.ok).toBe(false);
    expect(await readCachedContent()).toBeNull();
  });

  it('reports HTTP errors without throwing', async () => {
    expect(await fetchRemoteContent(URL, respond({}, 503))).toEqual({ ok: false, reason: 'HTTP 503' });
  });

  it('reports network failure without throwing', async () => {
    const offline = jest.fn(async () => {
      throw new Error('Network request failed');
    });
    expect(await fetchRemoteContent(URL, offline as unknown as typeof fetch)).toEqual({ ok: false, reason: 'Network request failed' });
  });

  it('does nothing when no URL is configured (bundled content is used)', async () => {
    const f = respond(bundled);
    expect((await fetchRemoteContent(undefined, f)).ok).toBe(false);
    expect(f).not.toHaveBeenCalled();
  });

  it('refuses a non-https content URL', async () => {
    const f = respond(bundled);
    expect(await fetchRemoteContent('http://insecure.example.com/c.json', f)).toEqual({ ok: false, reason: 'Content URL must be https' });
    expect(f).not.toHaveBeenCalled();
  });

  it('ignores a corrupted cache', async () => {
    await AsyncStorage.setItem('iae.content.v1', '{not json');
    expect(await readCachedContent()).toBeNull();
  });
});
