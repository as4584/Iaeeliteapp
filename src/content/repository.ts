import AsyncStorage from '@react-native-async-storage/async-storage';

import bundled from '../../content/content.json';
import { type Content, parseContent } from './schema';

const CACHE_KEY = 'iae.content.v1';
const FETCH_TIMEOUT_MS = 8000;

export type ContentSource = 'bundled' | 'cache' | 'remote';
export type Loaded = { content: Content; source: ContentSource };

/** Bundled snapshot. Validated by tests; a failure here is a build-time bug, so throw. */
export function getBundledContent(): Content {
  const parsed = parseContent(bundled);
  if (!parsed.ok) throw new Error(`Bundled content invalid: ${parsed.reason}`);
  return parsed.content;
}

export async function readCachedContent(): Promise<Content | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = parseContent(JSON.parse(raw));
    return parsed.ok ? parsed.content : null;
  } catch {
    return null;
  }
}

export type RemoteResult = { ok: true; content: Content } | { ok: false; reason: string };

/**
 * Fetch and validate remote content. Never throws: callers keep what they have on failure.
 * Successful results are cached for the next cold start.
 */
export async function fetchRemoteContent(
  url: string | undefined = process.env.EXPO_PUBLIC_CONTENT_URL,
  fetchImpl: typeof fetch = fetch,
): Promise<RemoteResult> {
  if (!url) return { ok: false, reason: 'No content URL configured' };
  if (!url.startsWith('https://')) return { ok: false, reason: 'Content URL must be https' };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetchImpl(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
    const parsed = parseContent(await res.json());
    if (!parsed.ok) return { ok: false, reason: parsed.reason };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(parsed.content)).catch(() => undefined);
    return parsed;
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : 'Network error' };
  } finally {
    clearTimeout(timer);
  }
}

/** Synchronous-first load: bundled immediately, cache if present. Remote is applied later. */
export async function loadInitialContent(): Promise<Loaded> {
  const cached = await readCachedContent();
  return cached ? { content: cached, source: 'cache' } : { content: getBundledContent(), source: 'bundled' };
}
