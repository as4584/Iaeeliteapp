import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import bundled from '../../../content/content.json';
import { ContentProvider, useContent, useContentSource } from '../ContentProvider';

function Probe() {
  const c = useContent();
  return <Text testID="probe">{`${useContentSource()}|${c.hero.primaryCta}`}</Text>;
}

const URL = 'https://content.example.com/c.json';
const origFetch = globalThis.fetch;
const origUrl = process.env.EXPO_PUBLIC_CONTENT_URL;

beforeEach(async () => {
  await AsyncStorage.clear();
  process.env.EXPO_PUBLIC_CONTENT_URL = URL;
});
afterAll(() => {
  globalThis.fetch = origFetch;
  process.env.EXPO_PUBLIC_CONTENT_URL = origUrl;
});

const mockFetch = (impl: () => Promise<unknown>) => {
  globalThis.fetch = jest.fn(impl) as unknown as typeof fetch;
};
const ok = (body: unknown) => async () => ({ ok: true, status: 200, json: async () => body });

it('renders bundled content immediately, then swaps in valid remote content', async () => {
  mockFetch(ok({ ...bundled, hero: { ...bundled.hero, primaryCta: 'Remote CTA' } }));
  await render(<ContentProvider><Probe /></ContentProvider>);
  await waitFor(() => expect(screen.getByTestId('probe').props.children).toBe('remote|Remote CTA'));
});

it('stays on bundled content when offline', async () => {
  mockFetch(async () => {
    throw new Error('Network request failed');
  });
  await render(<ContentProvider><Probe /></ContentProvider>);
  await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());
  expect(screen.getByTestId('probe').props.children).toBe(`bundled|${bundled.hero.primaryCta}`);
});

it('uses a newer cache while offline', async () => {
  await AsyncStorage.setItem('iae.content.v1', JSON.stringify({ ...bundled, updatedAt: '2099-01-01', hero: { ...bundled.hero, primaryCta: 'Cached CTA' } }));
  mockFetch(async () => {
    throw new Error('offline');
  });
  await render(<ContentProvider><Probe /></ContentProvider>);
  await waitFor(() => expect(screen.getByTestId('probe').props.children).toBe('cache|Cached CTA'));
});

it('ignores a cache older than the bundled copy (app was updated)', async () => {
  await AsyncStorage.setItem('iae.content.v1', JSON.stringify({ ...bundled, updatedAt: '2000-01-01', hero: { ...bundled.hero, primaryCta: 'Old CTA' } }));
  mockFetch(async () => {
    throw new Error('offline');
  });
  await render(<ContentProvider><Probe /></ContentProvider>);
  await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());
  expect(screen.getByTestId('probe').props.children).toBe(`bundled|${bundled.hero.primaryCta}`);
});

it('ignores remote content that fails validation', async () => {
  mockFetch(ok({ ...bundled, services: [] }));
  await render(<ContentProvider><Probe /></ContentProvider>);
  await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());
  expect(screen.getByTestId('probe').props.children).toBe(`bundled|${bundled.hero.primaryCta}`);
});
