/// <reference types="node" />
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import path from 'path';

import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { media } from '../media';
import { Home } from '../screens/Home';

jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) }));
jest.mock('@react-native-masked-view/masked-view', () => function MaskedViewMock({ children }: { children: React.ReactNode }) {
  return children;
});
jest.mock('expo-video', () => ({ useVideoPlayer: () => ({ play: jest.fn(), pause: jest.fn() }), VideoView: () => null }));
jest.mock('expo', () => ({ ...jest.requireActual('expo'), useEventListener: jest.fn() }));

// SHA-1 of the home <video> embedded in Damian's V24 index.html (the original V21 file).
const V24_HOME_FILM_SHA1 = '2628c84320e5fc8829fb39adec791bc40e7a4b98';

function assetPath(mod: unknown): string {
  const uri = (mod as { testUri?: string }).testUri;
  if (!uri) throw new Error(`asset module has no testUri: ${JSON.stringify(mod)}`);
  return path.resolve(__dirname, '../../..', uri.replace(/^(\.\.\/)+/, '')); // testUri is root-relative behind ../ segments
}

it('home film is byte-identical to the V24 home video', () => {
  const sha = createHash('sha1').update(readFileSync(assetPath(media.filmHome))).digest('hex');
  expect(sha).toBe(V24_HOME_FILM_SHA1);
});

it('V24 home bar: lettering sits beside the logo, left-aligned', async () => {
  await render(<Home go={jest.fn()} statsPlayed onStatsPlayed={jest.fn()} />);
  const bar = StyleSheet.flatten(screen.getByTestId('home-float-bar').props.style);
  expect(bar.justifyContent).toBe('flex-start');
  expect(bar.gap).toBe(14);
  expect(bar.paddingTop).toBe(26);
  const tag = StyleSheet.flatten(screen.getByTestId('home-tag').props.style);
  expect(tag.textAlign).toBe('left');
  expect(tag.letterSpacing).toBe(1.8);
});
